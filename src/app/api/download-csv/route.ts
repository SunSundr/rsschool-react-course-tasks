import { NextRequest, NextResponse } from 'next/server';
import { TMDBVideo } from '~/types';

export async function POST(request: NextRequest) {
  try {
    const { videos }: { videos: TMDBVideo[] } = await request.json();

    if (!videos || !Array.isArray(videos)) {
      return NextResponse.json({ error: 'Invalid videos data' }, { status: 400 });
    }

    // Generate CSV content
    const headers = ['Title', 'Release Date', 'Vote Average', 'Overview'];
    const csvContent = [
      headers.join(','),
      ...videos.map((video) =>
        [
          `"${video.title?.replace(/"/g, '""') || ''}"`,
          video.release_date || '',
          video.vote_average?.toString() || '',
          `"${video.overview?.replace(/"/g, '""') || ''}"`,
        ].join(','),
      ),
    ].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${videos.length}_items.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to generate CSV' }, { status: 500 });
  }
}
