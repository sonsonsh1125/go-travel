// Temporarily using description instead of transcript due to Vercel limitations
import { VideoTranscript, YouTubeVideo } from '../types';

export class TranscriptService {
  /**
   * Get transcript (using description as fallback for Vercel) for a YouTube video
   */
  async getTranscript(video: YouTubeVideo): Promise<VideoTranscript | null> {
    try {
      // Use video description as a fallback since youtube-transcript doesn't work in Vercel
      if (!video.description || video.description.trim().length < 50) {
        console.log(`  ⚠️  No sufficient description: ${video.title.substring(0, 50)}...`);
        return null;
      }

      return {
        videoId: video.videoId,
        videoTitle: video.title,
        transcript: video.description,
        language: 'ko',
      };
    } catch (error: any) {
      console.log(`  ⚠️  Error processing video: ${video.title.substring(0, 50)}...`);
      return null;
    }
  }

  /**
   * Get transcripts for multiple videos
   */
  async getMultipleTranscripts(videos: YouTubeVideo[]): Promise<VideoTranscript[]> {
    const transcripts: VideoTranscript[] = [];

    console.log(`\n📝 Fetching transcripts for ${videos.length} videos...\n`);

    let successCount = 0;
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      process.stdout.write(`  [${i + 1}/${videos.length}] ${video.title.substring(0, 50)}...`);

      const transcript = await this.getTranscript(video);
      if (transcript) {
        transcripts.push(transcript);
        successCount++;
        process.stdout.write(` ✅\n`);
      } else {
        process.stdout.write(` ❌\n`);
      }

      // Add delay to avoid rate limiting
      await this.delay(500);
    }

    console.log(`\n✅ Successfully fetched ${successCount}/${videos.length} transcripts\n`);
    return transcripts;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
