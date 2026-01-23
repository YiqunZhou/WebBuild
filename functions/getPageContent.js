import { Client } from "@notionhq/client";

export const handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== "GET") {
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
      throw new Error("Missing NOTION_KEY environment variable");
    }

    const notion = new Client({ auth: NOTION_KEY });

    // Get pageId from query parameters
    const pageId = event.queryStringParameters?.pageId;

    if (!pageId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          error: "Missing required parameter: pageId"
        })
      };
    }

    // Get all blocks from the page
    const blocks = await notion.blocks.children.list({
      block_id: pageId
    });

    // Convert blocks to Markdown
    let markdown = '';

    for (const block of blocks.results) {
      switch (block.type) {
        case 'paragraph':
          const paragraphText = block.paragraph.rich_text
            .map(text => text.plain_text)
            .join('');
          if (paragraphText) {
            markdown += paragraphText + '\n\n';
          }
          break;

        case 'heading_1':
          const h1Text = block.heading_1.rich_text
            .map(text => text.plain_text)
            .join('');
          markdown += `# ${h1Text}\n\n`;
          break;

        case 'heading_2':
          const h2Text = block.heading_2.rich_text
            .map(text => text.plain_text)
            .join('');
          markdown += `## ${h2Text}\n\n`;
          break;

        case 'heading_3':
          const h3Text = block.heading_3.rich_text
            .map(text => text.plain_text)
            .join('');
          markdown += `### ${h3Text}\n\n`;
          break;

        case 'bulleted_list_item':
          const bulletText = block.bulleted_list_item.rich_text
            .map(text => text.plain_text)
            .join('');
          markdown += `- ${bulletText}\n`;
          break;

        case 'numbered_list_item':
          const numberedText = block.numbered_list_item.rich_text
            .map(text => text.plain_text)
            .join('');
          markdown += `1. ${numberedText}\n`;
          break;

        case 'code':
          const codeText = block.code.rich_text
            .map(text => text.plain_text)
            .join('');
          markdown += `\`\`\`${block.code.language || ''}\n${codeText}\n\`\`\`\n\n`;
          break;

        case 'quote':
          const quoteText = block.quote.rich_text
            .map(text => text.plain_text)
            .join('');
          markdown += `> ${quoteText}\n\n`;
          break;

        default:
          // Skip unsupported block types
          break;
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        success: true,
        content: markdown.trim()
      })
    };

  } catch (error) {
    console.error("❌ Error getting page content:", error);

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
