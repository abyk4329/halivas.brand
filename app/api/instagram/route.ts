import { NextResponse } from 'next/server';

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID;

export async function GET() {
  try {
    if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
      return NextResponse.json({ error: 'Instagram credentials not configured' }, { status: 500 });
    }

    // Get recent media from Instagram
    const response = await fetch(
      `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,media_type,media_url,permalink,caption,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=20`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Instagram data');
    }

    const data = await response.json();

    // Filter only images
    const images = data.data
      .filter((item: { media_type: string }) => item.media_type === 'IMAGE')
      .map((item: { id: string; media_url: string; permalink: string; caption?: string; timestamp: string }) => ({
        id: item.id,
        url: item.media_url,
        permalink: item.permalink,
        caption: item.caption || '',
        timestamp: item.timestamp
      }));

    return NextResponse.json(images);
  } catch (error) {
    console.error('Instagram API error:', error);
    return NextResponse.json({ error: 'Failed to fetch Instagram posts' }, { status: 500 });
  }
}
