import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const clientsFilePath = path.join(process.cwd(), 'data', 'clients.json');

interface Deal {
  id: string;
  type: string;
  description: string;
  price: number;
  status: string;
  date: string;
  summary: string;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  deals: Deal[];
}

// קריאת נתוני הלקוחות
function readClients() {
  try {
    const fileContents = fs.readFileSync(clientsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading clients file:', error);
    return [];
  }
}

// כתיבת נתוני הלקוחות
function writeClients(clients: Client[]) {
  try {
    fs.writeFileSync(clientsFilePath, JSON.stringify(clients, null, 2));
  } catch (error) {
    console.error('Error writing clients file:', error);
  }
}

// GET - קבלת פרטי לקוח לפי ת.ז. או כל הלקוחות
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    // החזרת כל הלקוחות אם לא צוין ID
    const clients = readClients();
    return NextResponse.json(clients);
  }

  const clients = readClients();
  const client = clients.find((c: Client) => c.id === id);

  if (!client) {
    return NextResponse.json({ error: 'לקוח לא נמצא' }, { status: 404 });
  }

  return NextResponse.json(client);
}

// POST - הוספת לקוח חדש או עדכון לקוח קיים
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, phone, email, deals } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'נדרשים מספר תעודת זהות ושם' }, { status: 400 });
    }

    const clients = readClients();
    const existingClientIndex = clients.findIndex((c: Client) => c.id === id);

    if (existingClientIndex >= 0) {
      // עדכון לקוח קיים
      clients[existingClientIndex] = {
        ...clients[existingClientIndex],
        name: name || clients[existingClientIndex].name,
        phone: phone || clients[existingClientIndex].phone,
        email: email || clients[existingClientIndex].email,
        deals: deals || clients[existingClientIndex].deals
      };
    } else {
      // הוספת לקוח חדש
      clients.push({
        id,
        name,
        phone: phone || '',
        email: email || '',
        deals: deals || []
      });
    }

    writeClients(clients);
    return NextResponse.json({ success: true, message: 'הלקוח נשמר בהצלחה' });
  } catch (error) {
    console.error('Error saving client:', error);
    return NextResponse.json({ error: 'שגיאה בשמירת הלקוח' }, { status: 500 });
  }
}
