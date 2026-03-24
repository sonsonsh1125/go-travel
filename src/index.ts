import { YouTubeService } from './services/youtube';
import { TranscriptService } from './services/transcript';
import { PlaceExtractorService } from './services/placeExtractor';
import { NotionService } from './services/notion';
import { config, validateConfig } from './utils/config';
import { getDestinationInput } from './utils/prompt';
import { NotionPlaceData } from './types';

async function main() {
  console.log('🌍 Go-Travel: AI-Powered Travel Place Extractor\n');
  console.log('='.repeat(50));
  console.log();

  // Validate configuration
  validateConfig();

  // Get user input
  const destination = await getDestinationInput();
  console.log(`\n✈️  Searching for: ${destination}\n`);
  console.log('='.repeat(50));

  // Initialize services
  const youtubeService = new YouTubeService(config.youtube.apiKey);
  const transcriptService = new TranscriptService();
  const placeExtractor = new PlaceExtractorService(config.openai.apiKey, config.openai.model);
  const notionService = new NotionService(config.notion.apiKey, config.notion.databaseId);

  try {
    // Step 1: Setup Notion database
    console.log('\n📊 Setting up Notion database...');
    await notionService.setupDatabase();
    console.log();

    // Step 2: Search YouTube videos
    console.log(`🔍 Searching YouTube for "${destination}" videos...`);
    const videos = await youtubeService.searchDestinationVideos({
      destination,
      maxResults: config.search.maxResults,
    });

    if (videos.length === 0) {
      console.log('❌ No videos found');
      return;
    }

    console.log(`✅ Found ${videos.length} videos\n`);

    // Step 3: Get transcripts
    const transcripts = await transcriptService.getMultipleTranscripts(videos);

    if (transcripts.length === 0) {
      console.log('❌ No transcripts available');
      return;
    }

    // Step 4: Extract places using AI
    const places = await placeExtractor.extractPlacesFromMultipleTranscripts(
      transcripts,
      videos,
      destination
    );

    if (places.length === 0) {
      console.log('❌ No places extracted');
      return;
    }

    // Step 5: Prepare data for Notion
    const notionData: NotionPlaceData[] = places.map((place) => ({
      place,
      destination,
    }));

    // Step 6: Add to Notion
    const pageIds = await notionService.addMultiplePlaces(notionData);

    // Summary
    console.log('='.repeat(50));
    console.log('\n📊 Summary:\n');
    console.log(`  Destination: ${destination}`);
    console.log(`  Videos found: ${videos.length}`);
    console.log(`  Transcripts collected: ${transcripts.length}`);
    console.log(`  Unique places extracted: ${places.length}`);
    console.log(`  Places saved to Notion: ${pageIds.length}`);

    // Top mentions
    if (places.length > 0) {
      console.log(`\n🏆 Top 5 Most Mentioned Places:\n`);
      places.slice(0, 5).forEach((place, index) => {
        console.log(`  ${index + 1}. ${place.name} (${place.category}) - ${place.mentionCount} mentions`);
      });
    }

    console.log('\n✨ Done! Check your Notion database.\n');
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.response?.data) {
      console.error('API Error:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Run the main function
main();
