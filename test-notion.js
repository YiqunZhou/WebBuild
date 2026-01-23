import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

async function testNotionConnection() {
  console.log("Testing Notion API connection...\n");

  const { NOTION_KEY, NOTION_DB } = process.env;

  console.log("NOTION_KEY:", NOTION_KEY ? `${NOTION_KEY.substring(0, 10)}...` : "NOT SET");
  console.log("NOTION_DB:", NOTION_DB || "NOT SET");
  console.log();

  if (!NOTION_KEY || !NOTION_DB) {
    console.error("❌ Missing NOTION_KEY or NOTION_DB environment variable");
    process.exit(1);
  }

  try {
    const notion = new Client({ auth: NOTION_KEY });

    console.log("Attempting to query database...");
    const response = await notion.databases.query({
      database_id: NOTION_DB,
      filter: {
        property: "Status",
        status: {
          equals: "done"
        }
      },
      sorts: [
        {
          property: "ordering",
          direction: "ascending"
        }
      ]
    });

    console.log("✅ Success! Found", response.results.length, "projects");
    console.log("\nFirst project:", response.results[0]?.properties?.Name?.title?.[0]?.plain_text || "No name");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("\nFull error:", error);
  }
}

testNotionConnection();
