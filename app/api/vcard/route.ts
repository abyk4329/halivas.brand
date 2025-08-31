import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const vCard = `BEGIN:VCARD
VERSION:3.0
FN:HALIVAS.BRAND
ORG:Halivas - אדריכלות ועיצוב
TEL;TYPE=CELL:0544525927
EMAIL:idan@halivas.com
ADR:;;המחקר 5;אשדוד;;ישראל
URL:${baseUrl}/business-card
NOTE:מומחה באדריכלות, עיצוב פנים וייצור מטבחים מותאמים אישית
END:VCARD`;

  return new NextResponse(vCard, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="HALIVAS.BRAND.vcf"',
    },
  });
}
