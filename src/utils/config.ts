import dotenv from 'dotenv';

dotenv.config();

export const config = {
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY || '',
  },
  notion: {
    apiKey: process.env.NOTION_API_KEY || '',
    databaseId: process.env.NOTION_DATABASE_ID || '',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.AI_MODEL || 'gpt-4o-mini',
  },
  search: {
    maxResults: parseInt(process.env.MAX_RESULTS || '30'),
  },
};

export function validateConfig(): void {
  const errors: string[] = [];

  if (!config.youtube.apiKey) {
    errors.push('YOUTUBE_API_KEY is not set');
  }

  if (!config.notion.apiKey) {
    errors.push('NOTION_API_KEY is not set');
  }

  if (!config.notion.databaseId) {
    errors.push('NOTION_DATABASE_ID is not set');
  }

  if (!config.openai.apiKey) {
    errors.push('OPENAI_API_KEY is not set');
  }

  if (errors.length > 0) {
    console.error('\n❌ Configuration errors:');
    errors.forEach((error) => console.error(`  - ${error}`));
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    console.error('You can copy .env.example to .env and fill in your values.\n');
    process.exit(1);
  }
}
