import { NextResponse } from 'next/server';
import { YouTubeService } from '@/lib/services/youtube';
import { TranscriptService } from '@/lib/services/transcript';
import { PlaceExtractorService } from '@/lib/services/placeExtractor';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes

export async function POST(request: Request) {
  try {
    const { destination } = await request.json();

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination is required' },
        { status: 400 }
      );
    }

    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!youtubeApiKey || !geminiApiKey) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing API keys' },
        { status: 500 }
      );
    }

    // Step 1: Search YouTube videos
    const youtubeService = new YouTubeService(youtubeApiKey);
    const videos = await youtubeService.searchDestinationVideos({
      destination,
      maxResults: 30,
    });

    if (videos.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          videos: [],
          transcripts: [],
          places: [],
        },
      });
    }

    // Step 2: Get transcripts
    const transcriptService = new TranscriptService();
    const transcripts = await transcriptService.getMultipleTranscripts(videos);

    if (transcripts.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          videos,
          transcripts: [],
          places: [],
        },
      });
    }

    // Step 3: Extract places using AI
    const placeExtractor = new PlaceExtractorService(
      geminiApiKey,
      process.env.AI_MODEL || 'gemini-1.5-flash'
    );

    const places = await placeExtractor.extractPlacesFromMultipleTranscripts(
      transcripts,
      videos,
      destination
    );

    return NextResponse.json({
      success: true,
      data: {
        destination,
        videos,
        transcripts,
        places,
      },
    });
  } catch (error: any) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
