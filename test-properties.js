import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

async function testNotionProperties() {
  const { NOTION_KEY, NOTION_DB } = process.env;

  console.log("Testing Notion database properties...\n");

  if (!NOTION_KEY || !NOTION_DB) {
    console.error("❌ Missing NOTION_KEY or NOTION_DB");
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_KEY });

  try {
    // Get database schema
    const database = await notion.databases.retrieve({
      database_id: NOTION_DB
    });

    console.log("✅ Database properties found:\n");

    Object.keys(database.properties).forEach(prop => {
      const property = database.properties[prop];
      console.log(`  - ${prop} (${property.type})`);
    });

    console.log("\n");

    // Check specifically for content property
    if (database.properties.content) {
      console.log("✅ 'content' property exists!");
      console.log("   Type:", database.properties.content.type);
    } else {
      console.log("❌ 'content' property NOT FOUND");
      console.log("   Please add a 'content' property (type: Text) to your Notion database");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testNotionProperties();
