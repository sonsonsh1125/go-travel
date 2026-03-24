import { NextResponse } from 'next/server';
import { YouTubeService } from '@/lib/services/youtube';
import { TranscriptService } from '@/lib/services/transcript';
import { PlaceExtractorService } from '@/lib/services/placeExtractor';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds (requires Pro plan, 10s for Hobby)

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
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!youtubeApiKey || !openaiApiKey) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing API keys' },
        { status: 500 }
      );
    }

    // Step 1: Search YouTube videos
    const youtubeService = new YouTubeService(youtubeApiKey);
    const videos = await youtubeService.searchDestinationVideos({
      destination,
      maxResults: 10, // Reduced for faster response on Vercel free tier
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
      openaiApiKey,
      process.env.AI_MODEL || 'gpt-4o-mini'
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
