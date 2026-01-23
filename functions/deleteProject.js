import { Client } from "@notionhq/client";

export const handler = async (event, context) => {
  // Only allow DELETE requests
  if (event.httpMethod !== "DELETE") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { NOTION_KEY } = process.env;

    if (!NOTION_KEY) {
      console.error("Missing NOTION_KEY environment variable");
      throw new Error("Missing NOTION_KEY environment variable");
    }

    const notion = new Client({ auth: NOTION_KEY });

    // Parse request body
    const data = JSON.parse(event.body);

    const { pageId } = data;

    // Validate required fields
    if (!pageId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          error: "Missing required field: pageId"
        })
      };
    }

    // Archive the page in Notion (Notion doesn't have delete, only archive)
    const response = await notion.pages.update({
      page_id: pageId,
      archived: true
    });

    console.log("✅ Project archived in Notion:", pageId);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        success: true,
        message: "Project archived successfully",
        id: response.id
      })
    };

  } catch (error) {
    console.error("❌ Error archiving project:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: error.message || "Unknown error",
        details: error.toString()
      })
    };
  }
};
