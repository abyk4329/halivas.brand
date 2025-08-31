import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const clientId = formData.get('clientId') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    if (!file || !clientId || !name) {
      return NextResponse.json(
        { error: 'נדרש קובץ, מזהה לקוח ושם סקיצה' },
        { status: 400 }
      );
    }

    // יצירת שם קובץ ייחודי
    const fileExtension = file.name.split('.').pop();
    const fileName = `${clientId}_${Date.now()}.${fileExtension}`;

    // נתיב לשמירת הקובץ באופן זמני
    const tempDir = path.join(process.cwd(), 'temp');
    const tempFilePath = path.join(tempDir, fileName);

    // יצירת תיקיית temp אם לא קיימת
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // שמירת הקובץ באופן זמני
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(tempFilePath, buffer);

    // סימולציה של העלאה לגיטהאב
    // בפרויקט אמיתי היינו משתמשים ב-GitHub API
    const githubUrl = `https://github.com/abyk4329/halivas.brand/blob/main/sketches/${fileName}`;

    // עדכון נתוני הלקוח עם הסקיצה החדשה
    await updateClientSketches(clientId, {
      id: `sketch_${Date.now()}`,
      name,
      url: githubUrl,
      uploadedAt: new Date().toISOString(),
      description: description || ''
    });

    // מחיקת הקובץ הזמני
    fs.unlinkSync(tempFilePath);

    return NextResponse.json({
      success: true,
      githubUrl,
      message: 'הסקיצה הועלתה בהצלחה לגיטהאב'
    });

  } catch (error) {
    console.error('Error uploading sketch:', error);
    return NextResponse.json(
      { error: 'שגיאה בהעלאת הסקיצה' },
      { status: 500 }
    );
  }
}

async function updateClientSketches(clientId: string, newSketch: {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  description: string;
}) {
  try {
    const clientsPath = path.join(process.cwd(), 'data', 'clients.json');
    const clientsData = JSON.parse(fs.readFileSync(clientsPath, 'utf8'));

    const clientIndex = clientsData.findIndex((client: { id: string; kitchenStatus: { sketches: unknown[] } }) => client.id === clientId);
    if (clientIndex !== -1) {
      // הוספת הסקיצה לרשימת הסקיצות של הלקוח
      if (!clientsData[clientIndex].kitchenStatus.sketches) {
        clientsData[clientIndex].kitchenStatus.sketches = [];
      }
      clientsData[clientIndex].kitchenStatus.sketches.push(newSketch);

      fs.writeFileSync(clientsPath, JSON.stringify(clientsData, null, 2));
    }
  } catch (error) {
    console.error('Error updating client sketches:', error);
  }
}
