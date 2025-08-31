'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  deals: unknown[];
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ConversationManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const router = useRouter();

  useEffect(() => {
    // טעינת רשימת הלקוחות
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error('Error loading clients:', err));
  }, []);

  const addMessage = (role: 'user' | 'assistant') => {
    if (!currentMessage.trim()) return;

    const newMessage: ConversationMessage = {
      role,
      content: currentMessage,
      timestamp: new Date().toISOString()
    };

    setConversation(prev => [...prev, newMessage]);
    setCurrentMessage('');
  };

  const generateSummary = async () => {
    if (!selectedClient || conversation.length === 0) return;

    setIsGeneratingSummary(true);
    try {
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation,
          clientId: selectedClient.id,
          clientName: selectedClient.name
        }),
      });

      const data = await response.json();
      if (data.summary) {
        setSummary(data.summary);
        // רענון נתוני הלקוח
        const updatedClients = await fetch('/api/clients').then(res => res.json());
        setClients(updatedClients);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setSummary('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ניהול שיחות עם לקוחות</h1>
              <p className="text-gray-600">יצירת סיכומים אוטומטיים עם ChatGPT</p>
            </div>
            <button
              onClick={() => router.push('/admin-clients')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              חזרה לניהול לקוחות
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Client Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">בחירת לקוח</h2>
              <div className="space-y-2">
                {clients.map(client => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedClient?.id === client.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.phone}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conversation Interface */}
          <div className="lg:col-span-2">
            {selectedClient ? (
              <div className="space-y-6">
                {/* Conversation Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      שיחה עם {selectedClient.name}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={generateSummary}
                        disabled={conversation.length === 0 || isGeneratingSummary}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isGeneratingSummary ? 'יוצר סיכום...' : 'צור סיכום'}
                      </button>
                      <button
                        onClick={clearConversation}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        נקה שיחה
                      </button>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addMessage('user')}
                      placeholder="הקלד הודעה..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => addMessage('user')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      הוסף כהודעת לקוח
                    </button>
                    <button
                      onClick={() => addMessage('assistant')}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      הוסף כהודעה שלי
                    </button>
                  </div>

                  {/* Conversation Display */}
                  <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto bg-gray-50">
                    {conversation.length === 0 ? (
                      <p className="text-gray-500 text-center">אין הודעות בשיחה</p>
                    ) : (
                      <div className="space-y-3">
                        {conversation.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs px-4 py-2 rounded-lg ${
                                msg.role === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border border-gray-200'
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString('he-IL')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary Display */}
                {summary && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">סיכום שיחה</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                        {summary}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-gray-500">בחר לקוח כדי להתחיל שיחה</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
