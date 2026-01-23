# Complete Setup Guide

Step-by-step guide to set up the Notion CMS Portfolio Template from scratch.

## Table of Contents

- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Notion Setup](#notion-setup)
- [Environment Configuration](#environment-configuration)
- [First Run](#first-run)
- [Testing](#testing)
- [Next Steps](#next-steps)

## System Requirements

### Required

- **Node.js**: Version 16 or higher
- **npm**: Comes with Node.js
- **Git**: For version control
- **Notion Account**: Free account works fine
- **Text Editor**: VS Code, Sublime, or any editor

### Optional

- **Netlify Account**: For deployment (free tier available)
- **Supabase Account**: For image hosting (free tier available)

### Check Your Setup

Open your terminal/command prompt and verify:

```bash
# Check Node.js version (should be 16+)
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

If any command fails, install the missing software:
- **Node.js & npm**: https://nodejs.org/
- **Git**: https://git-scm.com/

---

## Installation

### Step 1: Open Terminal

**macOS:**
- Press `Cmd + Space`
- Type "Terminal"
- Press Enter

**Windows:**
- Press `Win + R`
- Type "cmd"
- Press Enter

**Linux:**
- Press `Ctrl + Alt + T`

### Step 2: Navigate to Your Workspace

```bash
# Navigate to where you want to store the project
# Example: Desktop
cd ~/Desktop

# Example: Documents folder
cd ~/Documents

# Example: Custom folder
cd /path/to/your/workspace
```

### Step 3: Clone the Repository

```bash
# Clone the template
git clone https://github.com/lilyxia99/LeileiNotionCMS.git

# Navigate into the project
cd LeileiNotionCMS

# Or if you renamed it:
cd notion-cms-template
```

### Step 4: Install Dependencies

```bash
# Install all required packages
npm install
```

This will:
- Download all dependencies
- Create a `node_modules` folder
- Generate `package-lock.json`

**Expected output:**
```
added 487 packages in 23s
```

**If you see errors:**
- Make sure you're in the project directory
- Try `npm cache clean --force` then `npm install` again
- Check your Node.js version

---

## Notion Setup

### Step 1: Duplicate the Template Database

**Option A: Use the Provided Template (Easiest)**

1. Click this link: [Notion Template Database](https://leileixia.notion.site/2f1401da165b806ab047ed36f3b999bc?v=2f1401da165b81ffbb45000cbc60e3d0)
2. Click "Duplicate" in the top-right corner
3. The database will be added to your Notion workspace

**Option B: Create Your Own Database**

1. Open Notion
2. Click "+ New page"
3. Select "Table" → "Database - Full page"
4. Name it "Portfolio Projects" (or anything you like)
5. Add the following properties:

| Property Name | Type | Options |
|--------------|------|---------|
| `Name` | Title | Default |
| `slug` | Text | - |
| `description` | Text | - |
| `titleImage` | Files & Media | - |
| `Status` | Status | Options: "Not Started", "In Progress", "done", "private", "Index" |
| `type` | Select | Options: "Project", "Film", "Animation", "Workshop", "Installation", "Publication" |
| `tag` | Multi-select | Options: "Animation", "Interactive", "Video", etc. (add your own) |
| `ordering` | Number | - |

### Step 2: Create a Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click **"+ New integration"**
3. Fill in:
   - **Name**: "Portfolio CMS" (or any name)
   - **Associated workspace**: Select your workspace
   - **Type**: Internal integration
4. Click **"Submit"**
5. Copy the **"Internal Integration Token"**
   - It starts with `secret_`
   - Keep this safe - you'll need it soon!

### Step 3: Connect Database to Integration

1. Open your Notion database
2. Click the **"..."** menu in the top-right
3. Scroll down and click **"+ Add connections"**
4. Search for your integration name
5. Click to connect

**Important:** If you don't do this step, the integration won't be able to access your database!

### Step 4: Get Your Database ID

1. Open your Notion database in a browser
2. Look at the URL:
   ```
   https://www.notion.so/workspace-name/abc123def456?v=xyz789
   ```
3. The database ID is the 32-character string: `abc123def456`
4. Copy just that part (no hyphens needed)

**Tip:** The database ID is between your workspace name and the `?v=` parameter.

---

## Environment Configuration

### Step 1: Create .env File

```bash
# Copy the sample environment file
cp sample.env .env
```

**If that doesn't work (Windows):**
```bash
copy sample.env .env
```

### Step 2: Open .env File

Open `.env` in your text editor. You should see:

```env
NOTION_KEY=
NOTION_DB=
ADMIN_PASSWORD=
SUPASPACE_ACCESS_KEY=
SUPASPACE_PROJECT_URL=
SUPASPACE_API=
SUPASPACE_ENDPOINT=
SUPASPACE_JWT=
SUPASPACE_SERVICE_KEY=
SUPASPACE_REGION=
```

### Step 3: Fill in Required Variables

**Required for basic functionality:**

```env
NOTION_KEY=secret_your_integration_token_here
NOTION_DB=your_database_id_here
ADMIN_PASSWORD=choose_a_secure_password
```

**Example (with fake values):**
```env
NOTION_KEY=secret_abc123xyz789
NOTION_DB=29b401da165b81adb4dfc78f4b13ace5
ADMIN_PASSWORD=MySecurePass123!
```

### Step 4: Supabase Setup (Optional)

**If you want image hosting:**

1. Go to https://supabase.com
2. Create a free account
3. Create a new project
4. Go to Project Settings → API
5. Copy these values:
   - **URL** → `SUPASPACE_PROJECT_URL`
   - **anon public** → `SUPASPACE_API`
   - **service_role** → `SUPASPACE_SERVICE_KEY`

6. Go to Storage → Create a bucket named "notion-images"
7. Make it public
8. Get the storage endpoint URL → `SUPASPACE_ENDPOINT`

**If you skip Supabase:**
- Notion image URLs will work initially
- But they expire after ~1 hour
- You'll need to use external image hosting (Imgur, Catbox, etc.)

### Step 5: Verify .env File

Double-check:
- ✅ No spaces around `=` signs
- ✅ No quotes around values
- ✅ All required fields filled
- ✅ File is named exactly `.env` (with the dot)

**Common mistakes:**
```env
# ❌ Wrong - has spaces
NOTION_KEY = secret_abc123

# ❌ Wrong - has quotes
NOTION_KEY="secret_abc123"

# ✅ Correct
NOTION_KEY=secret_abc123
```

---

## First Run

### Step 1: Start Development Server

```bash
npm run dev
```

**What happens:**
1. Netlify Dev starts
2. Vite dev server starts
3. Functions are loaded
4. Site becomes available

**Expected output:**
```
◈ Netlify Dev ◈
◈ Starting Netlify Dev...
◈ Setting up local development server

   ┌──────────────────────────────────────┐
   │                                      │
   │   ◈ Server now ready on              │
   │   http://localhost:8888              │
   │                                      │
   └──────────────────────────────────────┘
```

### Step 2: Open Your Browser

Visit: **http://localhost:8888**

You should see:
- Your portfolio homepage
- Loading message while fetching from Notion
- Projects appearing (if you have any in your database)

### Step 3: Test Admin Panel

1. Visit: **http://localhost:8888/admin-login.html**
2. Enter your `ADMIN_PASSWORD`
3. Click "Login"
4. You should be redirected to the admin panel

**If login fails:**
- Check your `.env` file has `ADMIN_PASSWORD` set
- Restart the dev server: `Ctrl+C`, then `npm run dev` again
- Check browser console for errors (F12)

### Step 4: Add Your First Project

In the admin panel:

1. Click "Add Project" tab
2. Fill in:
   - **Project Name**: "My First Project"
   - **URL Slug**: "my-first-project"
   - **Description**: "This is a test project"
   - **Type**: Select "Project"
   - **Title Image URL**: Paste any image URL
   - **Status**: Should auto-set to "done"
3. Click "Add Project"

**Success!** You should see a success message.

### Step 5: Generate Static Pages

After adding projects via admin panel or directly in Notion:

```bash
# In a new terminal (keep dev server running)
npm run generate:pages
```

This creates HTML files in the `generated/` folder.

Visit: **http://localhost:8888/generated/my-first-project.html**

---

## Testing

### Test Checklist

Go through this checklist to make sure everything works:

- [ ] **Homepage loads** - Visit http://localhost:8888
- [ ] **Projects display** - See project cards on homepage
- [ ] **Filters work** - Click tag filters to filter projects
- [ ] **Dark mode works** - Click sun/moon icon
- [ ] **Admin login works** - Login at /admin-login.html
- [ ] **Can add project** - Add new project via admin panel
- [ ] **Can edit project** - Update an existing project
- [ ] **Can delete project** - Delete a test project
- [ ] **Generated pages work** - Visit /generated/[slug].html

### Common Issues

**Issue: "NOTION_KEY not found"**
- Check `.env` file exists
- Verify variable names are correct
- Restart dev server

**Issue: "Cannot find database"**
- Verify database ID is correct
- Make sure database is connected to integration in Notion
- Check integration has access to the workspace

**Issue: "Failed to fetch projects"**
- Check Notion is accessible
- Verify integration token is valid
- Look at terminal for error messages

**Issue: Admin panel shows white screen**
- Open browser console (F12)
- Look for JavaScript errors
- Make sure all HTML files are built

**Issue: Images not showing**
- Notion image URLs expire quickly
- Use external hosting (Supabase, Imgur, Catbox)
- Or run `npm run process:images` if Supabase is configured

---

## Next Steps

### 1. Add Content to Notion

1. Open your Notion database
2. Add projects with:
   - Compelling titles
   - Good descriptions
   - High-quality images
   - Relevant tags
3. Set `Status` to "done" to publish
4. Use `ordering` number to control display order (lower = first)

### 2. Create an Index Page

1. Add a new page to your database
2. Set `Status` to "Index"
3. Fill in:
   - **Name**: Your site title or logo HTML
   - **slug**: Hero accent text
   - **description**: Hero subtitle
   - **Page content**: Your about/bio text
4. Restart dev server to see changes

### 3. Customize Styling

See [THEMING.md](./THEMING.md) for:
- Changing colors
- Updating fonts
- Modifying layout
- Creating custom themes

### 4. Deploy to Netlify

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Three deployment methods
- Setting up environment variables
- Continuous deployment
- Custom domains

### 5. Configure Supabase Images (Optional)

If you set up Supabase:

```bash
# Upload Notion images to Supabase
npm run process:images

# This will:
# 1. Download images from Notion
# 2. Upload to Supabase
# 3. Update Notion with new URLs
```

---

## Getting Help

### Resources

- **README**: Project overview and quick reference
- **THEMING.md**: Styling and customization guide
- **DEPLOYMENT.md**: Deployment instructions
- **API.md**: API endpoint documentation

### Troubleshooting

1. **Check the logs**: Terminal output often shows the issue
2. **Browser console**: Press F12 to see JavaScript errors
3. **Verify .env**: Most issues are environment variables
4. **Restart server**: Sometimes a restart fixes it
5. **Check Notion**: Make sure database is accessible

### Community Support

- **GitHub Issues**: https://github.com/lilyxia99/LeileiNotionCMS/issues
- **Notion Community**: https://notion.so/community
- **Netlify Community**: https://answers.netlify.com

---

## Summary

You've completed setup! You should now have:

✅ Node.js and dependencies installed
✅ Notion database created and connected
✅ Integration token generated
✅ Environment variables configured
✅ Development server running
✅ Admin panel accessible
✅ First project added

**You're ready to:**
- Add more projects
- Customize the design
- Deploy to production
- Share your portfolio with the world!

---

## Quick Reference

### Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Generate static pages
npm run generate:pages

# Process images to Supabase
npm run process:images

# Preview production build
npm run preview

# Deploy to Netlify
netlify deploy --prod
```

### Important Files

- `.env` - Environment variables (local only)
- `netlify.toml` - Netlify configuration
- `src/style.css` - All styles
- `functions/` - API endpoints
- `generated/` - Generated project pages

### URLs (Local Development)

- Homepage: http://localhost:8888
- Admin login: http://localhost:8888/admin-login.html
- Admin panel: http://localhost:8888/admin.html
- Project page: http://localhost:8888/generated/[slug].html

---

Need help? [Open an issue](https://github.com/lilyxia99/LeileiNotionCMS/issues) or check the other documentation guides!
