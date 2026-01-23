# Notion CMS Portfolio Template

A modern, accessible portfolio website template powered by Notion as a CMS. Built with Vite, Notion API, Netlify Functions, and Supabase for image storage.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://leileixia.com)
[![Netlify Status](https://img.shields.io/badge/netlify-deployed-00C7B7)](https://tactileye.netlify.app)

## ✨ Features

### 🎨 Dynamic Content Management
- **Notion as CMS**: Manage all your content directly in Notion
- **Dynamic Index Page**: Configure homepage content (hero section, about) from a Notion page
- **Project Pages**: Auto-generate individual project pages from Notion database
- **Real-time Updates**: Content updates reflect immediately after rebuild

### 🔐 Admin Panel (Screen Reader Accessible)
- **Secure Login**: Password-protected admin interface
- **Full CRUD Operations**: Add, edit, delete projects without touching code
- **Tag Management**: Multi-select tags with visual feedback
- **Markdown Editor**: EasyMDE integration for rich content editing
- **Accessibility**: WCAG compliant with keyboard navigation, ARIA labels, and screen reader support

### 🖼️ Image Management
- **Supabase Integration**: Automatic image upload to Supabase storage
- **Notion Link Migration**: Replaces expiring Notion image URLs with permanent Supabase links
- **Image Descriptions**: AI-generated alt text for accessibility

### 🎯 Built for Performance
- **Vite**: Lightning-fast development and optimized production builds
- **Static Generation**: Pre-rendered HTML pages for instant load times
- **Netlify Functions**: Serverless API endpoints for dynamic content
- **Dark Mode**: Built-in theme toggle with localStorage persistence

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Project Structure](#-project-structure)
- [Notion Database Setup](#-notion-database-setup)
- [Environment Variables](#-environment-variables)
- [Development](#-development)
- [Deployment](#-deployment)
- [Customization](#-customization)
- [Credits](#-credits)

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- A Notion account
- A Netlify account (for deployment)
- A Supabase account (optional, for image hosting)

### 1. Clone & Install

open terminal/command prompt, cd + the directory that you want to work in, and then type in:

```bash
# Clone this repository
git clone https://github.com/yourusername/notion-cms-template.git
cd notion-cms-template

# Install dependencies
npm install
```

### 2. Set Up Notion

1. Use [the template](https://leileixia.notion.site/2f1401da165b806ab047ed36f3b999bc?v=2f1401da165b81ffbb45000cbc60e3d0&source=copy_link) as your Notion database, or create a new Notion database with the following properties:
   - `Name` (Title)
   - `slug` (Text)
   - `description` (Text)
   - `titleImage` (Files & Media)
   - `Status` (Status with options: “Not Started”,"done", "private","In Progress", "Index")
   - `type` (Select: Project, Film, Animation, etc.)
   - `tag` (Multi-select)
   - `ordering` (Number)

2. Create a Notion Integration:
   - Go to https://www.notion.so/my-integrations
   - Click "New integration"
   - Name it and select your workspace
   - Copy the "Internal Integration Token"

3. Share your database with the integration:
   - Open your Notion database
   - Click "..." → "Add connections" → Select your integration

### 3. Configure Environment Variables

```bash
# Copy the sample environment file
cp sample.env .env
```

Edit `.env` and fill in your credentials:

```env
NOTION_KEY=your_notion_integration_token
NOTION_DB=your_notion_database_id
ADMIN_PASSWORD=your_secure_admin_password

# Optional: Supabase for image hosting
SUPASPACE_ACCESS_KEY=your_supabase_access_key
SUPASPACE_PROJECT_URL=your_supabase_project_url
SUPASPACE_API=your_supabase_anon_key
SUPASPACE_ENDPOINT=your_supabase_storage_endpoint
SUPASPACE_JWT=your_supabase_jwt
SUPASPACE_SERVICE_KEY=your_supabase_service_key
SUPASPACE_REGION=your_region
```

**How to find your Notion Database ID:**
- Open your Notion database in browser
- Copy the URL: `https://notion.so/workspace/DATABASE_ID?v=...`
- The `DATABASE_ID` is the 32-character string

### 4. Run Development Server

```bash
# Start Netlify Dev (recommended for full feature testing)
npm run dev

# Or start Vite only (faster, but no API functions)
npm run dev:vite
```

Visit:
- Main site: `http://localhost:8888`
- Admin login: `http://localhost:8888/admin-login.html`

### 5. Build for Production

```bash
npm run build
```

## 📚 Documentation

Detailed guides for specific topics:

- **[Setup Guide](./docs/SETUP.md)** - Complete installation and configuration
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deploy to Netlify with environment variables
- **[Theming Guide](./docs/THEMING.md)** - Customize styles and create your own theme
- **[API Reference](./docs/API.md)** - Netlify Functions documentation

## 📁 Project Structure

```
notion-cms-template/
├── functions/              # Netlify serverless functions
│   ├── getPage.js         # Fetch all pages with status "done"/"private"
│   ├── getIndexPage.js    # Fetch Index page configuration
│   ├── fetchNotion.js     # Fetch projects for gallery
│   ├── authenticate.js    # Admin authentication
│   ├── addProject.js      # Add new project
│   ├── updateProject.js   # Update existing project
│   ├── deleteProject.js   # Delete project
│   └── getTagOptions.js   # Fetch available tags
├── scripts/               # Build scripts
│   ├── generatePages.js   # Generate static HTML pages
│   ├── processNotionImages.js  # Upload images to Supabase
│   ├── imageDescriptions.js    # Generate AI descriptions
│   └── getTagOptions.js   # Extract tag options
├── src/
│   ├── main.js           # Main JavaScript entry
│   ├── admin.js          # Admin panel logic
│   └── style.css         # Global styles
├── index.html            # Homepage
├── admin.html            # Admin panel
├── admin-login.html      # Admin login page
├── generated/            # Generated project pages (git-ignored)
├── dist/                 # Production build (git-ignored)
├── netlify.toml          # Netlify configuration
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🗄️ Notion Database Setup

### Required Properties

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `Name` | Title | Project title | ✅ |
| `slug` | Rich Text | URL-friendly identifier | ✅ |
| `description` | Rich Text | Short description | ✅ |
| `titleImage` | Files & Media | Hero/cover image | ✅ |
| `Status` | Status | Publication status | ✅ |
| `type` | Select | Project category | ✅ |
| `tag` | Multi-select | Project tags | ❌ |
| `ordering` | Number | Display order | ❌ |

### Status Options

- **`done`**: Published and visible on the website
- **`private`**: Generated but not shown in gallery
- **`Index`**: Special page that controls homepage content

### Creating an Index Page

To customize your homepage dynamically:

1. Create a new page in your Notion database
2. Set `Status` to "Index"
3. Fill in the fields:
   - **`Name`**: Can contain HTML (e.g., `<img src="logo.gif">`)
   - **`slug`**: Hero title accent text (supports line breaks)
   - **`description`**: Hero subtitle text
   - **`titleImage`**: Hero image URL
   - **Page Content**: Write your "About Me" content in the page body

The homepage will automatically fetch and display this content!

## 🔐 Environment Variables

### Local Development (`.env`)

Required for local development:

```env
NOTION_KEY=secret_xxxxx
NOTION_DB=xxxxx
ADMIN_PASSWORD=your_password
```

### Netlify Deployment

Set these in Netlify Dashboard → Site Settings → Environment Variables:

```env
NOTION_KEY=secret_xxxxx
NOTION_DB=xxxxx
ADMIN_PASSWORD=your_password
SUPASPACE_ACCESS_KEY=xxxxx (optional)
SUPASPACE_PROJECT_URL=xxxxx (optional)
# ... other Supabase variables
```

**Or use Netlify CLI:**

```bash
netlify link
netlify env:set NOTION_KEY "your_value"
netlify env:set NOTION_DB "your_value"
netlify env:set ADMIN_PASSWORD "your_value"
```

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start Netlify Dev server
npm run dev:vite         # Start Vite dev server only
npm run dev:with-gen     # Deploy to production then start dev

# Build
npm run build            # Build for production
npm run build:with-images # Build + process images + descriptions
npm run preview          # Preview production build

# Utilities
npm run generate:pages   # Generate HTML pages from Notion
npm run process:images   # Upload images to Supabase
npm run get:tags         # Extract tag options
npm run descriptions     # Generate image descriptions
```

### Development Workflow

1. **Make changes** to HTML/CSS/JS files
2. **Test locally** with `npm run dev`
3. **Update Notion** content for testing
4. **Generate pages** with `npm run generate:pages`
5. **Deploy** when ready

## 🚀 Deployment

### Deploy to Netlify

#### Option 1: One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=your-repo-url)

#### Option 2: Manual Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link project
netlify link

# Set environment variables
netlify env:set NOTION_KEY "your_value"
netlify env:set NOTION_DB "your_value"
netlify env:set ADMIN_PASSWORD "your_value"

# Deploy to production
netlify deploy --prod
```

#### Option 3: Git Integration

1. Push your code to GitHub
2. Go to Netlify Dashboard
3. Click "New site from Git"
4. Select your repository
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**: Add your keys
6. Deploy!

For detailed deployment instructions, see [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## 🎨 Customization

### Change Colors & Fonts

Edit `src/style.css`:

```css
:root {
  --color-primary: #6366f1;     /* Primary color */
  --color-accent: #f59e0b;      /* Accent color */
  --font-primary: "Pangolin";   /* Main font */
  /* ... more variables */
}
```

### Modify Layout

- **Homepage**: Edit `index.html`
- **Project pages**: Edit `scripts/generatePages.js`
- **Admin panel**: Edit `admin.html` and `src/admin.js`

### Create Custom Theme

See [THEMING.md](./docs/THEMING.md) for a complete guide on:
- CSS custom properties
- Class naming conventions
- Component styling
- Creating theme variants

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use this template for your own projects!

## 🙏 Credits

- **Original Tutorial**: [Coding in Public](https://www.youtube.com/@CodinginPublic) - [Watch the series](https://www.youtube.com/watch?v=mukkm6o6Pjw&list=PLoqZcxvpWzzdJiW95Y7nDqY8XsiKTgo17&index=1)
- **Built by**: [Leilei Xia](https://leileixia.com)
- **Tools**: Vite, Notion API, Netlify, Supabase, Claude Code

## 🐛 Troubleshooting

### Common Issues

**"NOTION_KEY not found"**
- Make sure `.env` file exists in root directory
- Check that environment variables are set in Netlify

**"No matching project found" when linking Netlify**
- Use `netlify link --id YOUR_SITE_ID` instead
- Find your site ID in Netlify Dashboard → Site Settings

**Images not loading**
- Notion image URLs expire - use Supabase image processing
- Run `npm run process:images` to migrate images

**Admin panel not accessible on Netlify**
- Check that `ADMIN_PASSWORD` is set in Netlify environment variables
- Verify `admin.html` and `admin-login.html` are in `dist/` after build

For more help, [open an issue](https://github.com/yourusername/notion-cms-template/issues)

## 📧 Contact

Questions? Reach out:
- Website: [leileixia.com](https://leileixia.com)
- Email: leileixiawork@gmail.com
- GitHub: [@lilyxia99](https://github.com/lilyxia99)

---

Made with ❤️ using Notion, Vite, and Claude Code
