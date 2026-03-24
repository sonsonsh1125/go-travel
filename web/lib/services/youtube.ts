import axios from 'axios';
import { YouTubeVideo, SearchConfig } from '../types';

export class YouTubeService {
  private apiKey: string;
  private baseURL = 'https://www.googleapis.com/youtube/v3';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Search YouTube videos for a specific destination
   */
  async searchDestinationVideos(config: SearchConfig): Promise<YouTubeVideo[]> {
    try {
      const searchQueries = [
        `${config.destination} 여행`,
        `${config.destination} 브이로그`,
      ];

      const allVideos: YouTubeVideo[] = [];

      // Search with multiple queries to get diverse results
      for (const query of searchQueries) {
        const videos = await this.searchVideos(query, Math.ceil(config.maxResults / 3));
        allVideos.push(...videos);
      }

      // Remove duplicates and sort by view count
      const uniqueVideos = this.removeDuplicates(allVideos);
      uniqueVideos.sort((a, b) => b.viewCount - a.viewCount);

      // Filter to only include videos with destination in title
      const filteredVideos = uniqueVideos.filter((video) =>
        video.title.toLowerCase().includes(config.destination.toLowerCase())
      );

      console.log(
        `Found ${uniqueVideos.length} unique videos, ${filteredVideos.length} with "${config.destination}" in title`
      );
      return filteredVideos.slice(0, config.maxResults);
    } catch (error) {
      console.error('Error searching destination videos:', error);
      throw error;
    }
  }

  private async searchVideos(query: string, maxResults: number): Promise<YouTubeVideo[]> {
    try {
      // Step 1: Search for videos
      const searchResponse = await axios.get(`${this.baseURL}/search`, {
        params: {
          key: this.apiKey,
          q: query,
          part: 'snippet',
          type: 'video',
          maxResults: Math.min(maxResults, 50),
          order: 'viewCount',
          relevanceLanguage: 'ko',
        },
      });

      const videoIds = searchResponse.data.items
        .map((item: any) => item.id.videoId)
        .filter(Boolean);

      if (videoIds.length === 0) {
        return [];
      }

      // Step 2: Get detailed video statistics
      const videosResponse = await axios.get(`${this.baseURL}/videos`, {
        params: {
          key: this.apiKey,
          id: videoIds.join(','),
          part: 'snippet,statistics',
        },
      });

      const videos: YouTubeVideo[] = videosResponse.data.items.map((item: any) => ({
        videoId: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        viewCount: parseInt(item.statistics.viewCount || '0'),
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        url: `https://www.youtube.com/watch?v=${item.id}`,
      }));

      return videos;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('YouTube API Error:', error.response?.data || error.message);
      }
      throw error;
    }
  }

  private removeDuplicates(videos: YouTubeVideo[]): YouTubeVideo[] {
    const seen = new Set<string>();
    return videos.filter((video) => {
      if (seen.has(video.videoId)) {
        return false;
      }
      seen.add(video.videoId);
      return true;
    });
  }
}
