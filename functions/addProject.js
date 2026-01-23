import { Client } from "@notionhq/client";

export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
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
    const { NOTION_KEY, NOTION_DB } = process.env;

    if (!NOTION_KEY || !NOTION_DB) {
      console.error("Missing environment variables");
      throw new Error("Missing NOTION_KEY or NOTION_DB environment variable");
    }

    const notion = new Client({ auth: NOTION_KEY });

    // Parse request body
    const data = JSON.parse(event.body);

    const { name, slug, description, content, type, titleImage, ordering, tags } = data;

    // Validate required fields
    if (!name || !slug || !description || !type || !titleImage) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          error: "Missing required fields: name, slug, description, type, titleImage"
        })
      };
    }

    // Build properties object for Notion (without content property)
    const properties = {
      Name: {
        title: [
          {
            text: {
              content: name
            }
          }
        ]
      },
      slug: {
        rich_text: [
          {
            text: {
              content: slug
            }
          }
        ]
      },
      description: {
        rich_text: [
          {
            text: {
              content: description
            }
          }
        ]
      },
      type: {
        select: {
          name: type
        }
      },
      titleImage: {
        files: [
          {
            name: "Title Image",
            external: {
              url: titleImage
            }
          }
        ]
      },
      Status: {
        status: {
          name: "done"
        }
      }
    };

    // Add ordering if provided
    if (ordering !== undefined && ordering !== null && ordering !== "") {
      properties.ordering = {
        number: parseInt(ordering, 10)
      };
    }

    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      properties.tag = {
        multi_select: tags.map(tag => ({ name: tag }))
      };
    }

    // Create the page in Notion
    const response = await notion.pages.create({
      parent: {
        database_id: NOTION_DB
      },
      properties: properties
    });

    // Convert Markdown content to Notion blocks
    // Split by double newlines for paragraphs and detect headings
    const contentLines = content.split('\n');
    const blocks = [];

    let currentParagraph = [];

    for (const line of contentLines) {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        // Empty line - finish current paragraph if any
        if (currentParagraph.length > 0) {
          blocks.push({
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{
                type: 'text',
                text: { content: currentParagraph.join('\n') }
              }]
            }
          });
          currentParagraph = [];
        }
        continue;
      }

      // Check for headings
      if (trimmedLine.startsWith('### ')) {
        if (currentParagraph.length > 0) {
          blocks.push({
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{
                type: 'text',
                text: { content: currentParagraph.join('\n') }
              }]
            }
          });
          currentParagraph = [];
        }
        blocks.push({
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [{
              type: 'text',
              text: { content: trimmedLine.substring(4) }
            }]
          }
        });
      } else if (trimmedLine.startsWith('## ')) {
        if (currentParagraph.length > 0) {
          blocks.push({
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{
                type: 'text',
                text: { content: currentParagraph.join('\n') }
              }]
            }
          });
          currentParagraph = [];
        }
        blocks.push({
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{
              type: 'text',
              text: { content: trimmedLine.substring(3) }
            }]
          }
        });
      } else if (trimmedLine.startsWith('# ')) {
        if (currentParagraph.length > 0) {
          blocks.push({
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{
                type: 'text',
                text: { content: currentParagraph.join('\n') }
              }]
            }
          });
          currentParagraph = [];
        }
        blocks.push({
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{
              type: 'text',
              text: { content: trimmedLine.substring(2) }
            }]
          }
        });
      } else {
        // Regular text - add to current paragraph
        currentParagraph.push(trimmedLine);
      }
    }

    // Add any remaining paragraph
    if (currentParagraph.length > 0) {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: { content: currentParagraph.join('\n') }
          }]
        }
      });
    }

    // Add blocks to the page (if any)
    if (blocks.length > 0) {
      await notion.blocks.children.append({
        block_id: response.id,
        children: blocks
      });
    }

    console.log("✅ Project added to Notion:", name);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        success: true,
        message: "Project added successfully",
        id: response.id
      })
    };

  } catch (error) {
    console.error("❌ Error adding project:", error);

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
