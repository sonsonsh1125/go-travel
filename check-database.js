const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function checkDatabase() {
  try {
    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    console.log('\n📊 Database Properties:\n');
    console.log('Database Name:', database.title[0]?.plain_text || 'Untitled');
    console.log('\nProperty Names:');

    Object.keys(database.properties).forEach((key) => {
      const prop = database.properties[key];
      console.log(`  - "${key}" (${prop.type})`);
    });

    console.log('\n');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDatabase();
