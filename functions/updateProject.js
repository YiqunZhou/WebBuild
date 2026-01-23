import { Client } from "@notionhq/client";

export const handler = async (event, context) => {
  // Only allow PATCH/PUT requests
  if (event.httpMethod !== "PATCH" && event.httpMethod !== "PUT") {
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

    const { pageId, name, slug, description, content, type, titleImage, ordering, tags, status } = data;

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

    // Build properties object for Notion (only update provided fields)
    const properties = {};

    if (name) {
      properties.Name = {
        title: [
          {
            text: {
              content: name
            }
          }
        ]
      };
    }

    if (slug) {
      properties.slug = {
        rich_text: [
          {
            text: {
              content: slug
            }
          }
        ]
      };
    }

    if (description) {
      properties.description = {
        rich_text: [
          {
            text: {
              content: description
            }
          }
        ]
      };
    }

    if (type) {
      properties.type = {
        select: {
          name: type
        }
      };
    }

    if (titleImage) {
      properties.titleImage = {
        files: [
          {
            name: "Title Image",
            external: {
              url: titleImage
            }
          }
        ]
      };
    }

    if (ordering !== undefined && ordering !== null && ordering !== "") {
      properties.ordering = {
        number: parseInt(ordering, 10)
      };
    }

    if (tags !== undefined) {
      if (Array.isArray(tags) && tags.length > 0) {
        properties.tag = {
          multi_select: tags.map(tag => ({ name: tag }))
        };
      } else {
        // Clear tags if empty array provided
        properties.tag = {
          multi_select: []
        };
      }
    }

    if (status) {
      properties.Status = {
        status: {
          name: status
        }
      };
    }

    // Update the page in Notion
    const response = await notion.pages.update({
      page_id: pageId,
      properties: properties
    });

    // Handle content update if provided
    if (content) {
      // First, delete all existing blocks in the page
      const existingBlocks = await notion.blocks.children.list({
        block_id: pageId
      });

      // Delete existing blocks
      for (const block of existingBlocks.results) {
        try {
          await notion.blocks.delete({
            block_id: block.id
          });
        } catch (deleteError) {
          console.warn(`Could not delete block ${block.id}:`, deleteError.message);
        }
      }

      // Convert Markdown content to Notion blocks
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

      // Add new blocks to the page (if any)
      if (blocks.length > 0) {
        await notion.blocks.children.append({
          block_id: pageId,
          children: blocks
        });
      }
    }

    console.log("✅ Project updated in Notion:", pageId);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        success: true,
        message: "Project updated successfully",
        id: response.id
      })
    };

  } catch (error) {
    console.error("❌ Error updating project:", error);

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
