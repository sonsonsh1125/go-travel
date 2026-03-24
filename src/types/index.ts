export interface YouTubeVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  viewCount: number;
  publishedAt: string;
  description: string;
  thumbnailUrl: string;
  url: string;
}

export interface VideoTranscript {
  videoId: string;
  videoTitle: string;
  transcript: string;
  language: string;
}

export interface Place {
  name: string;
  category: PlaceCategory;
  description: string;
  mentionedInVideos: string[]; // video IDs
}

export type PlaceCategory =
  | '관광지'
  | '맛집'
  | '카페'
  | '호텔'
  | '사찰'
  | '시장'
  | '쇼핑'
  | '액티비티'
  | '기타';

export interface PlaceWithMentions extends Place {
  mentionCount: number;
  videoTitles: string[];
  videoUrls: string[];
}

export interface SearchConfig {
  destination: string;
  maxResults: number;
}

export interface NotionPlaceData {
  place: PlaceWithMentions;
  destination: string;
}
