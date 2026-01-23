# API Reference

Documentation for all Netlify Functions (serverless API endpoints) in the template.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Content Endpoints](#content-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Utility Endpoints](#utility-endpoints)
- [Error Handling](#error-handling)

## Overview

All API endpoints are Netlify Functions deployed to `/.netlify/functions/`.

**Base URL (local)**: `http://localhost:8888/api/`
**Base URL (production)**: `https://your-site.netlify.app/api/`

### URL Rewriting

The `netlify.toml` configuration rewrites `/api/*` to `/.netlify/functions/*`:

```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

So `/api/getPage` → `/.netlify/functions/getPage`

---

## Authentication

### POST /api/authenticate

Authenticate admin user with password.

**Request:**
```json
{
  "password": "your-password"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Authentication successful"
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "error": "Invalid password"
}
```

**Example:**
```javascript
const response = await fetch('/api/authenticate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'mypassword' })
});

const result = await response.json();
if (result.success) {
  // Authentication successful
  sessionStorage.setItem('admin_auth', 'true');
  window.location.href = '/admin.html';
}
```

---

## Content Endpoints

### GET /api/fetchNotion

Fetch all published projects for the gallery.

**Query Parameters:** None

**Response (200):**
```json
{
  "results": [
    {
      "id": "page-id",
      "properties": {
        "Name": {
          "title": [{ "plain_text": "Project Title" }]
        },
        "slug": {
          "rich_text": [{ "plain_text": "project-slug" }]
        },
        "description": {
          "rich_text": [{ "plain_text": "Project description" }]
        },
        "titleImage": {
          "files": [{ "external": { "url": "image-url" } }]
        },
        "type": {
          "select": { "name": "Project" }
        },
        "tag": {
          "multi_select": [
            { "name": "Animation" },
            { "name": "Film" }
          ]
        },
        "ordering": {
          "number": 1
        }
      }
    }
  ]
}
```

**Filters:**
- Only returns pages with `Status = "done"`
- Results are sorted by `ordering` property

**Example:**
```javascript
const response = await fetch('/api/fetchNotion');
const data = await response.json();
const projects = data.results;
```

---

### GET /api/getPage

Fetch all pages for static generation (both "done" and "private" status).

**Query Parameters:** None

**Response (200):**
```json
[
  {
    "page_id": "page-uuid",
    "title": "Project Title",
    "slug": "project-slug",
    "description": "Description text",
    "titleImage": "image-url",
    "content": [
      {
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            { "plain_text": "Content text" }
          ]
        }
      }
    ]
  }
]
```

**Filters:**
- Returns pages with `Status = "done"` OR `Status = "private"`
- Includes full page content (blocks)

**Example:**
```javascript
const response = await fetch('/api/getPage');
const pages = await response.json();

pages.forEach(page => {
  console.log(`${page.title} (${page.slug})`);
});
```

---

### GET /api/getIndexPage

Fetch the special "Index" page that configures the homepage.

**Query Parameters:** None

**Response (200):**
```json
{
  "name": "Website Title",
  "slug": "Hero accent text",
  "description": "Hero subtitle text",
  "titleImage": "hero-image-url",
  "pageId": "page-uuid",
  "content": [
    {
      "type": "paragraph",
      "paragraph": {
        "rich_text": [{ "plain_text": "About me content" }]
      }
    }
  ]
}
```

**Response (404):**
```json
{
  "error": "No Index page found. Please create a page with Status='Index' in your Notion database."
}
```

**Filter:**
- Returns the first page with `Status = "Index"`

**Example:**
```javascript
const response = await fetch('/api/getIndexPage');
const indexPage = await response.json();

if (response.ok) {
  document.querySelector('.index_title').innerHTML = indexPage.name;
  document.querySelector('.hero__title--accent').innerHTML = indexPage.slug;
}
```

---

### GET /api/getPageContent

Fetch full content blocks for a specific page.

**Query Parameters:**
- `pageId` (required) - Notion page ID

**Response (200):**
```json
{
  "content": [
    {
      "type": "heading_1",
      "heading_1": {
        "rich_text": [{ "plain_text": "Heading" }]
      }
    },
    {
      "type": "paragraph",
      "paragraph": {
        "rich_text": [{ "plain_text": "Content" }]
      }
    }
  ]
}
```

**Example:**
```javascript
const pageId = 'abc123def456';
const response = await fetch(`/api/getPageContent?pageId=${pageId}`);
const { content } = await response.json();
```

---

### GET /api/getTagOptions

Fetch all available tags from the database.

**Query Parameters:** None

**Response (200):**
```json
{
  "tagOptions": [
    { "id": "tag-id-1", "name": "Animation", "color": "blue" },
    { "id": "tag-id-2", "name": "Film", "color": "green" },
    { "id": "tag-id-3", "name": "Installation", "color": "purple" }
  ]
}
```

**Example:**
```javascript
const response = await fetch('/api/getTagOptions');
const { tagOptions } = await response.json();

tagOptions.forEach(tag => {
  console.log(`${tag.name} (${tag.color})`);
});
```

---

## Admin Endpoints

### POST /api/addProject

Add a new project to the Notion database.

**Request:**
```json
{
  "name": "New Project",
  "slug": "new-project",
  "description": "Project description",
  "content": "# Project Content\n\nMarkdown text here",
  "type": "Project",
  "titleImage": "https://example.com/image.jpg",
  "ordering": 10,
  "tags": ["Animation", "Interactive"]
}
```

**Response (200):**
```json
{
  "success": true,
  "pageId": "new-page-uuid",
  "message": "Project added successfully"
}
```

**Response (400):**
```json
{
  "error": "Missing required fields"
}
```

**Example:**
```javascript
const newProject = {
  name: "My Project",
  slug: "my-project",
  description: "A cool project",
  content: "# About\n\nThis is my project.",
  type: "Project",
  titleImage: "https://example.com/image.jpg",
  ordering: 5,
  tags: ["Art", "Interactive"]
};

const response = await fetch('/api/addProject', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newProject)
});

const result = await response.json();
if (result.success) {
  console.log(`Created page: ${result.pageId}`);
}
```

---

### POST /api/updateProject

Update an existing project.

**Request:**
```json
{
  "pageId": "existing-page-uuid",
  "name": "Updated Title",
  "slug": "updated-slug",
  "description": "Updated description",
  "content": "# Updated Content",
  "type": "Film",
  "titleImage": "https://example.com/new-image.jpg",
  "ordering": 15,
  "status": "done",
  "tags": ["Film", "Animation"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully"
}
```

**Example:**
```javascript
const updates = {
  pageId: "abc123",
  name: "Updated Project Title",
  description: "New description",
  status: "done"
};

const response = await fetch('/api/updateProject', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updates)
});
```

---

### POST /api/deleteProject

Delete (archive) a project.

**Request:**
```json
{
  "pageId": "page-to-delete-uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

**Example:**
```javascript
const response = await fetch('/api/deleteProject', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ pageId: 'abc123' })
});

const result = await response.json();
if (result.success) {
  console.log('Project deleted');
}
```

---

## Utility Endpoints

All endpoints return **JSON** and include **CORS headers** for cross-origin requests:

```json
{
  "Access-Control-Allow-Origin": "*"
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

### Common HTTP Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Missing or invalid parameters |
| 401 | Unauthorized | Invalid admin password |
| 404 | Not Found | Resource doesn't exist |
| 405 | Method Not Allowed | Wrong HTTP method (e.g., GET instead of POST) |
| 500 | Server Error | Notion API error or server issue |

### Example Error Handling

```javascript
try {
  const response = await fetch('/api/addProject', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });

  const result = await response.json();

  if (!response.ok) {
    // Handle error
    throw new Error(result.error || 'Unknown error');
  }

  // Success
  console.log('Project added:', result.pageId);

} catch (error) {
  console.error('Error:', error.message);
  alert(`Failed to add project: ${error.message}`);
}
```

---

## Rate Limiting

Notion API has rate limits:
- **3 requests per second** per integration
- If exceeded, you'll get a `429 Too Many Requests` response

**Best Practices:**
- Batch operations when possible
- Add delays between requests if making many
- Cache responses when appropriate

---

## Environment Variables

All functions require these environment variables:

```env
NOTION_KEY=secret_xxxxx
NOTION_DB=database-id
ADMIN_PASSWORD=your-password
```

Set these in:
- **Local**: `.env` file
- **Netlify**: Site Settings → Environment Variables

---

## Function Locations

All functions are in the `functions/` directory:

```
functions/
├── authenticate.js      # Admin login
├── addProject.js        # Create project
├── updateProject.js     # Update project
├── deleteProject.js     # Delete project
├── fetchNotion.js       # Gallery projects
├── getPage.js           # All pages (for build)
├── getIndexPage.js      # Homepage config
├── getPageContent.js    # Single page content
└── getTagOptions.js     # Available tags
```

---

## Testing Functions Locally

Start Netlify Dev:

```bash
npm run dev
```

Functions available at: `http://localhost:8888/api/[function-name]`

**Test with curl:**

```bash
# Get projects
curl http://localhost:8888/api/fetchNotion

# Authenticate
curl -X POST http://localhost:8888/api/authenticate \
  -H "Content-Type: application/json" \
  -d '{"password":"your-password"}'

# Add project
curl -X POST http://localhost:8888/api/addProject \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","slug":"test","description":"Test project"}'
```

---

## Need Help?

- **Notion API Docs**: https://developers.notion.com
- **Netlify Functions**: https://docs.netlify.com/functions/overview/

For template-specific issues, [open an issue](https://github.com/lilyxia99/LeileiNotionCMS/issues).
