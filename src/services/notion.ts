import { Client } from '@notionhq/client';
import { NotionPlaceData, PlaceWithMentions } from '../types';

export class NotionService {
  private client: Client;
  private databaseId: string;

  constructor(apiKey: string, databaseId: string) {
    this.client = new Client({ auth: apiKey });
    this.databaseId = databaseId;
  }

  /**
   * Verify database exists and is accessible
   */
  async setupDatabase(): Promise<void> {
    try {
      const database = await this.client.databases.retrieve({
        database_id: this.databaseId,
      });

      console.log(`Database found: ${(database as any).title?.[0]?.plain_text || 'Untitled'}`);
      console.log('Database is ready to use');
    } catch (error: any) {
      console.error('Error accessing database:', error.message);
      console.log('\n Please ensure:');
      console.log('1. The database exists in your Notion workspace');
      console.log('2. Your integration has been added to the database page');
      console.log('3. The NOTION_DATABASE_ID is correct in your .env file');
      throw error;
    }
  }

  /**
   * Add a place to the Notion database
   */
  async addPlace(data: NotionPlaceData): Promise<string> {
    try {
      const { place, destination } = data;

      const properties: any = {
        name: {
          title: [
            {
              text: {
                content: place.name,
              },
            },
          ],
        },
        category: {
          select: {
            name: place.category,
          },
        },
        destination: {
          select: {
            name: destination,
          },
        },
        'mention count': {
          number: place.mentionCount,
        },
        description: {
          rich_text: [
            {
              text: {
                content: place.description.substring(0, 2000),
              },
            },
          ],
        },
      };

      // Add video titles as multi-select or text
      if (place.videoTitles.length > 0) {
        properties['mentioned videos'] = {
          rich_text: [
            {
              text: {
                content: place.videoTitles.slice(0, 3).join(', ').substring(0, 2000),
              },
            },
          ],
        };
      }

      const response = await this.client.pages.create({
        parent: {
          database_id: this.databaseId,
        },
        properties,
      });

      return response.id;
    } catch (error: any) {
      console.error(`Error adding place to Notion: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add multiple places to the Notion database
   */
  async addMultiplePlaces(placesData: NotionPlaceData[]): Promise<string[]> {
    const pageIds: string[] = [];

    console.log(`📤 Adding ${placesData.length} places to Notion...\n`);

    for (let i = 0; i < placesData.length; i++) {
      const placeData = placesData[i];
      try {
        process.stdout.write(
          `  [${i + 1}/${placesData.length}] ${placeData.place.name} (${placeData.place.category})...`
        );

        const pageId = await this.addPlace(placeData);
        pageIds.push(pageId);

        process.stdout.write(` ✅\n`);

        // Small delay to avoid rate limiting
        await this.delay(350);
      } catch (error: any) {
        process.stdout.write(` ❌\n`);
        console.error(`  Error: ${error.message}`);
      }
    }

    console.log(`\n✅ Successfully added ${pageIds.length}/${placesData.length} places to Notion\n`);
    return pageIds;
  }

  /**
   * Check if a place already exists in the database
   */
  async placeExists(placeName: string): Promise<boolean> {
    try {
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'name',
          title: {
            equals: placeName,
          },
        },
      });

      return response.results.length > 0;
    } catch (error) {
      console.error('Error checking if place exists:', error);
      return false;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
