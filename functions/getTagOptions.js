import { Client } from "@notionhq/client";

export const handler = async (event, context) => {
  try {
    const { NOTION_KEY, NOTION_DB } = process.env;

    if (!NOTION_KEY || !NOTION_DB) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          error: 'Missing NOTION_KEY or NOTION_DB environment variables'
        })
      };
    }

    const notion = new Client({ auth: NOTION_KEY });

    // Retrieve database schema
    const database = await notion.databases.retrieve({
      database_id: NOTION_DB
    });

    // Extract tag options specifically
    const tagProperty = database.properties.tag;

    if (!tagProperty) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          error: 'No "tag" property found in database'
        })
      };
    }

    if (tagProperty.type !== 'multi_select') {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          error: `"tag" property is of type "${tagProperty.type}", expected "multi_select"`
        })
      };
    }

    const tagOptions = tagProperty.multi_select.options;

    // Create a comma-separated list like Thomas Frank suggested
    const tagChoices = tagOptions.map(option => option.name).join(', ');

    console.log("✅ Retrieved tag options from database");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        success: true,
        tagOptions: tagOptions,
        tagChoicesString: tagChoices,
        count: tagOptions.length
      })
    };

  } catch (error) {
    console.error("❌ Tag options fetch error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: error.message || "Unknown error"
      })
    };
  }
};
