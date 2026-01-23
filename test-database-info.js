import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

async function showDatabaseInfo() {
  const { NOTION_KEY, NOTION_DB } = process.env;

  console.log("=".repeat(60));
  console.log("NOTION DATABASE INFORMATION");
  console.log("=".repeat(60));

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

    console.log("\n📊 Database Details:");
    console.log(`   ID: ${NOTION_DB}`);
    console.log(`   Title: ${database.title?.[0]?.plain_text || "Untitled Database"}`);
    console.log(`   URL: https://notion.so/${NOTION_DB.replace(/-/g, '')}`);

    console.log("\n✅ Current Properties:");
    const properties = Object.keys(database.properties).sort();
    properties.forEach(prop => {
      const property = database.properties[prop];
      console.log(`   • ${prop} (${property.type})`);
    });

    console.log("\n🔍 Checking for 'content' property:");
    if (database.properties.content) {
      console.log("   ✅ 'content' property EXISTS!");
      console.log(`   ✅ Type: ${database.properties.content.type}`);
    } else {
      console.log("   ❌ 'content' property NOT FOUND");
      console.log("\n📝 TO FIX THIS:");
      console.log("   1. Open the database in Notion using the URL above");
      console.log("   2. Click the '+' button to add a new property/column");
      console.log("   3. Name it exactly: content (all lowercase)");
      console.log("   4. Set the type to: Text");
      console.log("   5. Save the property");
      console.log("   6. Wait a few seconds for Notion API to sync");
      console.log("   7. Run this script again to verify\n");
    }

    console.log("=".repeat(60));

  } catch (error) {
    console.error("\n❌ Error accessing database:", error.message);
    console.error("\nPossible issues:");
    console.error("   • The database ID might be incorrect");
    console.error("   • The integration might not have access to this database");
    console.error("   • The API key might be invalid\n");
  }
}

showDatabaseInfo();
