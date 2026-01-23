import { Client } from "@notionhq/client";

export const handler = async (event, context) => {
  try {
    const { NOTION_KEY, NOTION_DB } = process.env;

    if (!NOTION_KEY || !NOTION_DB) {
      console.error("Missing environment variables");
      console.error("NOTION_KEY:", NOTION_KEY ? "SET" : "NOT SET");
      console.error("NOTION_DB:", NOTION_DB ? "SET" : "NOT SET");
      throw new Error("Missing NOTION_KEY or NOTION_DB environment variable");
    }

    const notion = new Client({ auth: NOTION_KEY });

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

    console.log("✅ Fetched data from Notion");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error("❌ Notion fetch error:", error);
    console.error("Error details:", error.message);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: error.message || "Unknown error" })
    };
  }
};
