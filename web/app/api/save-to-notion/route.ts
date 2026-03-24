import { NextResponse } from 'next/server';
import { NotionService } from '@/lib/services/notion';
import { NotionPlaceData } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { places, destination, notionApiKey, notionDatabaseId } = await request.json();

    if (!places || !destination || !notionApiKey || !notionDatabaseId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const notionService = new NotionService(notionApiKey, notionDatabaseId);

    // Verify database access
    await notionService.setupDatabase();

    // Prepare data
    const notionData: NotionPlaceData[] = places.map((place: any) => ({
      place,
      destination,
    }));

    // Save to Notion
    const pageIds = await notionService.addMultiplePlaces(notionData);

    return NextResponse.json({
      success: true,
      data: {
        savedCount: pageIds.length,
        totalCount: places.length,
      },
    });
  } catch (error: any) {
    console.error('Error saving to Notion:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save to Notion' },
      { status: 500 }
    );
  }
}
