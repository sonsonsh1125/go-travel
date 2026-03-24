import { YoutubeTranscript } from 'youtube-transcript';
import { VideoTranscript, YouTubeVideo } from '../types';

export class TranscriptService {
  /**
   * Get transcript for a YouTube video
   */
  async getTranscript(video: YouTubeVideo): Promise<VideoTranscript | null> {
    try {
      const transcriptItems = await YoutubeTranscript.fetchTranscript(video.videoId, {
        lang: 'ko',
      });

      if (!transcriptItems || transcriptItems.length === 0) {
        return null;
      }

      const fullTranscript = transcriptItems
        .map((item) => item.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      return {
        videoId: video.videoId,
        videoTitle: video.title,
        transcript: fullTranscript,
        language: 'ko',
      };
    } catch (error: any) {
      // Try English if Korean is not available
      try {
        const transcriptItems = await YoutubeTranscript.fetchTranscript(video.videoId, {
          lang: 'en',
        });

        if (!transcriptItems || transcriptItems.length === 0) {
          return null;
        }

        const fullTranscript = transcriptItems
          .map((item) => item.text)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        return {
          videoId: video.videoId,
          videoTitle: video.title,
          transcript: fullTranscript,
          language: 'en',
        };
      } catch (enError) {
        console.log(`  ⚠️  No transcript available: ${video.title.substring(0, 50)}...`);
        return null;
      }
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
