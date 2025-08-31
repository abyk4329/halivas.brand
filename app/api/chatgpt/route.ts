import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const { conversation, clientId, clientName } = await request.json();

    if (!conversation || !clientId || !clientName) {
      return NextResponse.json({ error: 'נדרשים תוכן שיחה, מזהה לקוח ושם לקוח' }, { status: 400 });
    }

    // ניתוח השיחה ליצירת סיכום חכם
    const summary = await generateIntelligentSummary(conversation, clientName);

    // שמירת הסיכום בנתוני הלקוח
    await saveConversationSummary(clientId, summary);

    return NextResponse.json({
      summary,
      success: true,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'שגיאה ביצירת סיכום' }, { status: 500 });
  }
}

async function generateIntelligentSummary(conversation: ConversationMessage[], clientName: string): Promise<string> {
  // ניתוח השיחה לזיהוי נושאים מרכזיים
  const topics = analyzeConversationTopics(conversation);
  const sentiment = analyzeSentiment(conversation);
  const actionItems = extractActionItems(conversation);
  const pricing = extractPricingInfo(conversation);

  const summary = `🤖 סיכום שיחה אוטומטי - ${clientName}

📅 תאריך: ${new Date().toLocaleDateString('he-IL')}
⏰ שעה: ${new Date().toLocaleTimeString('he-IL')}
👤 לקוח: ${clientName}

🎯 נושאי השיחה:
${topics.map(topic => `• ${topic}`).join('\n')}

${sentiment !== 'neutral' ? `😊 מצב רוח: ${sentiment === 'positive' ? 'חיובי' : 'דורש שיפור'}\n` : ''}

${pricing ? `💰 מידע תמחור:\n${pricing.map(item => `• ${item}`).join('\n')}\n` : ''}

${actionItems.length > 0 ? `📋 פעולות נדרשות:\n${actionItems.map(item => `• ${item}`).join('\n')}\n` : ''}

💡 תובנות מרכזיות:
• השיחה התמקדה ב${topics.length > 0 ? topics[0] : 'צרכי הלקוח'}
• ${sentiment === 'positive' ? 'הלקוח מראה עניין רב ושביעות רצון' : 'יש צורך במעקב נוסף'}
• ${actionItems.length > 0 ? `יש ${actionItems.length} פעולות להשלמה` : 'אין פעולות מיידיות נדרשות'}

השיחה נותחה ונשמרה במערכת לקוחות.`;

  return summary;
}

function analyzeConversationTopics(conversation: ConversationMessage[]): string[] {
  const topics: string[] = [];
  const text = conversation.map(msg => msg.content).join(' ').toLowerCase();

  const topicKeywords = {
    'עיצוב': ['עיצוב', 'דיזיין', 'אסתטי', 'סגנון'],
    'מטבח': ['מטבח', 'ארונות', 'משטח', 'חשמל', 'אינסטלציה'],
    'תקציב': ['מחיר', 'תקציב', 'עלות', 'תשלום', 'הצעה'],
    'לוח זמנים': ['זמן', 'תאריך', 'צפי', 'השלמה', 'דחוף'],
    'חומרים': ['חומר', 'איכות', 'גימור', 'צבע', 'טקסטורה'],
    'פגישה': ['פגישה', 'ביקור', 'מדידה', 'התקנה']
  };

  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      topics.push(topic);
    }
  });

  return topics.length > 0 ? topics : ['כללי'];
}

function analyzeSentiment(conversation: ConversationMessage[]): 'positive' | 'negative' | 'neutral' {
  const text = conversation.map(msg => msg.content).join(' ').toLowerCase();

  const positiveWords = ['מצוין', 'נהדר', 'אוהב', 'מרוצה', 'מעולה', 'יפה', 'טוב', 'כן', 'בהחלט'];
  const negativeWords = ['בעיה', 'לא', 'אכזבה', 'יקר', 'איחור', 'שגוי', 'לא מתאים'];

  const positiveCount = positiveWords.filter(word => text.includes(word)).length;
  const negativeCount = negativeWords.filter(word => text.includes(word)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function extractActionItems(conversation: ConversationMessage[]): string[] {
  const actionItems: string[] = [];
  const text = conversation.map(msg => msg.content).join(' ');

  const actionPatterns = [
    /צריך ל/i,
    /יש להכין/i,
    /נדרש/i,
    /יש לשלוח/i,
    /יש לתאם/i,
    /יש לבדוק/i
  ];

  const sentences = text.split(/[.!?]+/);
  sentences.forEach(sentence => {
    if (actionPatterns.some(pattern => pattern.test(sentence.trim()))) {
      actionItems.push(sentence.trim());
    }
  });

  return actionItems.slice(0, 3); // מקסימום 3 פעולות
}

function extractPricingInfo(conversation: ConversationMessage[]): string[] {
  const pricing: string[] = [];
  const text = conversation.map(msg => msg.content).join(' ');

  // חיפוש מחירים בשקלים
  const shekelPattern = /(\d{1,3}(?:,\d{3})*|\d+)\s*(שקל|ש"ח|₪)/gi;
  const matches = text.match(shekelPattern);

  if (matches) {
    matches.forEach(match => {
      pricing.push(`מחיר: ${match}`);
    });
  }

  return pricing;
}

async function saveConversationSummary(clientId: string, summary: string) {
  try {
    const clientsPath = path.join(process.cwd(), 'data', 'clients.json');
    const clientsData = JSON.parse(fs.readFileSync(clientsPath, 'utf8'));

    const clientIndex = clientsData.findIndex((client: { id: string; deals: unknown[] }) => client.id === clientId);
    if (clientIndex !== -1) {
      // הוספת הסיכום לעסקה האחרונה או יצירת עסקה חדשה
      const lastDeal = clientsData[clientIndex].deals[clientsData[clientIndex].deals.length - 1];
      if (lastDeal) {
        lastDeal.summary = summary;
        lastDeal.lastUpdated = new Date().toISOString();
      }

      fs.writeFileSync(clientsPath, JSON.stringify(clientsData, null, 2));
    }
  } catch (error) {
    console.error('Error saving conversation summary:', error);
  }
}
