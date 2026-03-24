import OpenAI from 'openai';
import { Place, VideoTranscript, YouTubeVideo, PlaceWithMentions } from '../types';

export class PlaceExtractorService {
  private openai: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o-mini') {
    this.openai = new OpenAI({ apiKey });
    this.model = model;
  }

  /**
   * Extract places from a single video transcript using AI
   */
  async extractPlacesFromTranscript(
    transcript: VideoTranscript,
    destination: string
  ): Promise<Place[]> {
    try {
      const prompt = this.buildPrompt(transcript.transcript, destination);

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              '당신은 여행 영상 자막에서 구체적인 장소를 추출하는 전문가입니다. 실제 방문 가능한 장소만 추출하고, JSON 형식으로 응답합니다.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        return [];
      }

      const result = JSON.parse(content);
      const places: Place[] = result.places || [];

      // Add video ID to each place
      return places.map((place) => ({
        ...place,
        mentionedInVideos: [transcript.videoId],
      }));
    } catch (error: any) {
      console.error(`Error extracting places from video ${transcript.videoTitle}:`, error.message);
      return [];
    }
  }

  /**
   * Extract places from multiple transcripts and merge duplicates
   */
  async extractPlacesFromMultipleTranscripts(
    transcripts: VideoTranscript[],
    videos: YouTubeVideo[],
    destination: string
  ): Promise<PlaceWithMentions[]> {
    console.log(`\n🤖 Extracting places using AI (${this.model})...\n`);

    const allPlaces: Place[] = [];
    const videoMap = new Map(videos.map((v) => [v.videoId, v]));

    for (let i = 0; i < transcripts.length; i++) {
      const transcript = transcripts[i];
      process.stdout.write(
        `  [${i + 1}/${transcripts.length}] Analyzing: ${transcript.videoTitle.substring(0, 40)}...`
      );

      const places = await this.extractPlacesFromTranscript(transcript, destination);
      allPlaces.push(...places);

      process.stdout.write(` ✅ (${places.length} places)\n`);

      // Small delay to avoid rate limiting
      await this.delay(1000);
    }

    console.log(`\n📍 Total places extracted: ${allPlaces.length}`);

    // Merge duplicate places
    const mergedPlaces = this.mergeDuplicatePlaces(allPlaces, videoMap);
    console.log(`📍 Unique places after merging: ${mergedPlaces.length}\n`);

    return mergedPlaces;
  }

  /**
   * Merge duplicate places and count mentions
   */
  private mergeDuplicatePlaces(
    places: Place[],
    videoMap: Map<string, YouTubeVideo>
  ): PlaceWithMentions[] {
    const placeMap = new Map<string, PlaceWithMentions>();

    for (const place of places) {
      const key = this.normalizePlaceName(place.name);

      if (placeMap.has(key)) {
        const existing = placeMap.get(key)!;
        // Add unique video IDs
        for (const videoId of place.mentionedInVideos) {
          if (!existing.mentionedInVideos.includes(videoId)) {
            existing.mentionedInVideos.push(videoId);
          }
        }
      } else {
        placeMap.set(key, {
          ...place,
          mentionCount: 0,
          videoTitles: [],
          videoUrls: [],
        });
      }
    }

    // Calculate mention count and add video details
    const result: PlaceWithMentions[] = [];
    for (const place of placeMap.values()) {
      place.mentionCount = place.mentionedInVideos.length;
      place.videoTitles = place.mentionedInVideos
        .map((id) => videoMap.get(id)?.title || '')
        .filter(Boolean);
      place.videoUrls = place.mentionedInVideos
        .map((id) => videoMap.get(id)?.url || '')
        .filter(Boolean);
      result.push(place);
    }

    // Sort by mention count (descending)
    result.sort((a, b) => b.mentionCount - a.mentionCount);

    return result;
  }

  /**
   * Normalize place name for duplicate detection
   */
  private normalizePlaceName(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '')
      .replace(/[()[\]]/g, '');
  }

  /**
   * Build AI prompt for place extraction
   */
  private buildPrompt(transcript: string, destination: string): string {
    return `다음은 "${destination}" 여행 영상의 자막입니다.
이 자막에서 언급된 모든 관광지, 맛집, 카페, 호텔, 사찰, 시장 등의 구체적인 장소를 추출해주세요.

자막:
${transcript.substring(0, 8000)}

다음 형식의 JSON으로 응답해주세요:
{
  "places": [
    {
      "name": "장소명",
      "category": "카테고리 (관광지/맛집/카페/호텔/사찰/시장/쇼핑/액티비티/기타 중 하나)",
      "description": "장소에 대한 간단한 설명 (자막에서 추출, 1-2문장)"
    }
  ]
}

주의사항:
- 구체적인 장소명만 추출 (예: "기요미즈데라", "니시키시장", "이치란 라멘")
- 애매한 표현은 제외 (예: "그 카페", "유명한 곳", "거기")
- 실제 방문 가능한 장소만 포함
- 중복 제거
- 카테고리는 반드시 한국어로, 제시된 옵션 중 하나만 사용`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
