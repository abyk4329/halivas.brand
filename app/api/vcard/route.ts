import { NextResponse } from 'next/server';

export async function GET() {
  const vCard = `BEGIN:VCARD
VERSION:3.0
FN:עידן חליווה
ORG:Halivas
TEL;TYPE=CELL:0544525927
EMAIL:idan@halivas.com
ADR:;;המחקר 5;אשדוד;;ישראל
URL:http://localhost:3000/business-card
NOTE:מומחה באדריכלות, עיצוב פנים וייצור מטבחים
END:VCARD`;

  return new NextResponse(vCard, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Idan_Haliva.vcf"',
    },
  });
}
