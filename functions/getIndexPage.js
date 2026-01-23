import { Client } from "@notionhq/client";

export const handler = async (event, context) => {
  try {
    const { NOTION_KEY, NOTION_DB } = process.env;

    if (!NOTION_KEY || !NOTION_DB) {
      throw new Error("Missing NOTION_KEY or NOTION_DB environment variable");
    }

    // Initialize Notion client
    const notion = new Client({
      auth: NOTION_KEY,
    });

    // Query for pages with status "Index"
    const response = await notion.databases.query({
      database_id: NOTION_DB,
      filter: {
        "property": "Status",
        "status": {
          "equals": "Index"
        }
      }
    });

    if (response.results.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          error: "No Index page found. Please create a page with Status='Index' in your Notion database."
        })
      };
    }

    // Get the first Index page
    const page = response.results[0];

    // Extract properties
    const indexData = {
      name: page.properties.Name?.title?.[0]?.plain_text || 'Portfolio',
      slug: page.properties.slug?.rich_text?.[0]?.plain_text || '',
      description: page.properties.description?.rich_text?.[0]?.plain_text || '',
      titleImage: page.properties.titleImage?.files?.[0]?.external?.url ||
                  page.properties.titleImage?.files?.[0]?.file?.url || '',
      pageId: page.id
    };

    // Recursive function to fetch block children
    async function fetchBlocksRecursively(blockId) {
      const blocks = await notion.blocks.children.list({
        block_id: blockId,
        page_size: 100,
      });

      // For each block, if it has children, fetch them recursively
      const blocksWithChildren = await Promise.all(
        blocks.results.map(async (block) => {
          if (block.has_children) {
            const children = await fetchBlocksRecursively(block.id);
            return {
              ...block,
              children: children
            };
          }
          return block;
        })
      );

      return blocksWithChildren;
    }

    // Fetch page content
    const content = await fetchBlocksRecursively(page.id);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        ...indexData,
        content: content
      })
    };

  } catch (error) {
    console.error("❌ Error fetching Index page:", error);
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
