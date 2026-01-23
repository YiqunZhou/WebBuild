# Deployment Guide

Complete guide for deploying your Notion CMS template to Netlify.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Methods](#deployment-methods)
- [Environment Variables Setup](#environment-variables-setup)
- [Continuous Deployment](#continuous-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- ✅ A working local build (`npm run build` succeeds)
- ✅ All required environment variables configured
- ✅ A Netlify account (free tier works great)
- ✅ Your code in a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Methods

### Method 1: Netlify CLI (Recommended for First Deploy)

This method gives you full control and is great for testing.

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Login to Netlify

```bash
netlify login
```

This will open your browser to authenticate.

#### Step 3: Initialize Your Site

```bash
# From your project root
netlify init
```

Follow the prompts:
1. **Create & configure a new site**
2. Choose your team
3. **Site name**: Enter a unique name (e.g., `my-portfolio-cms`)
4. **Build command**: `npm run build`
5. **Publish directory**: `dist`

#### Step 4: Set Environment Variables

```bash
# Required variables
netlify env:set NOTION_KEY "secret_xxxxxxxxxxxxx"
netlify env:set NOTION_DB "your-database-id"
netlify env:set ADMIN_PASSWORD "your-secure-password"

# Optional: Supabase variables (if using image hosting)
netlify env:set SUPASPACE_ACCESS_KEY "your-key"
netlify env:set SUPASPACE_PROJECT_URL "https://your-project.supabase.co"
netlify env:set SUPASPACE_API "your-anon-key"
netlify env:set SUPASPACE_ENDPOINT "your-storage-endpoint"
netlify env:set SUPASPACE_JWT "your-jwt"
netlify env:set SUPASPACE_SERVICE_KEY "your-service-key"
netlify env:set SUPASPACE_REGION "your-region"
```

**Important**: Use quotes around values to preserve special characters!

#### Step 5: Deploy

```bash
# Deploy to production
netlify deploy --prod
```

The CLI will:
1. Run your build command
2. Upload the `dist` folder
3. Deploy your functions
4. Give you a live URL

Your site is now live! 🎉

---

### Method 2: GitHub Integration (Recommended for Continuous Deployment)

This method automatically deploys when you push to GitHub.

#### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### Step 2: Connect to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"New site from Git"**
3. Choose **GitHub** (or your Git provider)
4. Select your repository
5. Configure build settings:
   - **Branch**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `functions`

#### Step 3: Set Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Add each variable:

| Key | Value | Notes |
|-----|-------|-------|
| `NOTION_KEY` | `secret_xxx...` | From Notion integration |
| `NOTION_DB` | `abc123...` | Your database ID |
| `ADMIN_PASSWORD` | `your-password` | Admin panel password |
| `SUPASPACE_ACCESS_KEY` | `xxx` | Optional |
| `SUPASPACE_PROJECT_URL` | `https://...` | Optional |
| `SUPASPACE_API` | `xxx` | Optional |

4. Click **Save**

#### Step 4: Trigger Deploy

Netlify will automatically start building. You can:
- Watch the build logs in real-time
- See any errors in the deploy log
- Get your live URL when complete

---

### Method 3: Netlify Drop (Manual Upload)

Quick one-time deploy without Git or CLI.

#### Step 1: Build Locally

```bash
npm run build
```

#### Step 2: Deploy

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag your `dist` folder onto the page
3. Wait for upload to complete

**Limitations:**
- No environment variables
- No continuous deployment
- No Netlify Functions support
- Good for: Quick testing only

---

## Environment Variables Setup

### Finding Your Values

#### Notion Integration Token (`NOTION_KEY`)

1. Go to https://www.notion.so/my-integrations
2. Click **"New integration"**
3. Give it a name (e.g., "Portfolio CMS")
4. Select your workspace
5. Copy the **"Internal Integration Token"** (starts with `secret_`)

#### Notion Database ID (`NOTION_DB`)

1. Open your Notion database in browser
2. Look at the URL:
   ```
   https://notion.so/workspace/abc123def456?v=...
   ```
3. The database ID is the 32-character code: `abc123def456`
4. Copy just that part (no hyphens)

#### Admin Password (`ADMIN_PASSWORD`)

Choose a strong password for your admin panel.

**Tips:**
- Use 12+ characters
- Mix letters, numbers, symbols
- Don't reuse passwords
- Store securely (password manager)

### Setting Variables via Netlify UI

1. Navigate to **Site settings** → **Environment variables**
2. Choose scope:
   - **All**: Available in all contexts (recommended)
   - **Production**: Only production deploys
   - **Deploy previews**: Only preview builds
   - **Branch deploys**: Specific branches

3. Click **Add a variable**
4. Enter:
   - **Key**: Variable name (e.g., `NOTION_KEY`)
   - **Value**: The actual value
   - **Scopes**: Select appropriate scope(s)

5. Click **Create variable**

### Setting Variables via CLI

```bash
# Link to your site first (if not already linked)
netlify link

# Set variables
netlify env:set NOTION_KEY "secret_xxxxx"
netlify env:set NOTION_DB "database-id-here"
netlify env:set ADMIN_PASSWORD "your-password"

# Verify variables are set
netlify env:list
```

### Updating Variables

Variables can be updated anytime without redeploying:

**Via UI:**
1. Go to Environment variables
2. Find the variable
3. Click **Options** → **Edit**
4. Update value
5. Click **Save**

**Via CLI:**
```bash
netlify env:set NOTION_KEY "new-value"
```

**Important**: After updating variables, trigger a new deploy for changes to take effect:
```bash
netlify deploy --prod
```

---

## Continuous Deployment

Once connected to Git, Netlify automatically deploys when you push code.

### Deploy Contexts

Netlify creates different deploy contexts:

1. **Production**: `main` branch → your live site
2. **Deploy Previews**: Pull requests → temporary preview URL
3. **Branch Deploys**: Other branches → unique URLs

### Controlling Deploys

#### Skip a Deploy

Add `[skip ci]` or `[skip netlify]` to commit message:
```bash
git commit -m "Update README [skip ci]"
```

#### Deploy Only Certain Paths

Edit `netlify.toml`:
```toml
[build]
  ignore = "git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF -- src/"
```

This skips deploy if only non-`src/` files changed.

#### Deploy Notifications

Get notified of deploy status:
1. Go to **Site settings** → **Build & deploy** → **Deploy notifications**
2. Add notifications for:
   - Email
   - Slack
   - Webhook
   - GitHub commit status

---

## Troubleshooting

### Build Fails: "NOTION_KEY not found"

**Problem**: Environment variables not set or not accessible during build.

**Solution**:
1. Verify variables are set:
   - Go to Site settings → Environment variables
   - Or run `netlify env:list`
2. Check variable names match exactly (case-sensitive)
3. Ensure scopes include your deploy context
4. Retry deploy

### Build Fails: "Command not found: npm"

**Problem**: Node.js version mismatch or not specified.

**Solution**: Specify Node version in `netlify.toml`:
```toml
[build.environment]
  NODE_VERSION = "18"
```

### Functions Not Working

**Problem**: API endpoints return 404 or 500 errors.

**Solution**:
1. Check `netlify.toml` has functions directory:
   ```toml
   [build]
     functions = "functions"
   ```
2. Verify redirects are configured:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```
3. Check function logs: Site → Functions → View logs

### Admin Panel Not Accessible

**Problem**: `/admin-login.html` returns 404 on deployed site.

**Solution**:
1. Check `admin.html` and `admin-login.html` are in `dist/` after build
2. Verify `vite.config.js` includes them:
   ```js
   input: {
     main: resolve(__dirname, 'index.html'),
     admin: resolve(__dirname, 'admin.html'),
     'admin-login': resolve(__dirname, 'admin-login.html')
   }
   ```
3. Run `npm run build` locally to verify
4. Check Netlify deploy logs for these files

### Images Not Loading

**Problem**: Notion image URLs show broken images.

**Solution**:
1. Notion image URLs expire after ~1 hour
2. Use Supabase image hosting:
   ```bash
   npm run process:images
   ```
3. Redeploy after processing images

### Site Not Updating After Notion Changes

**Problem**: Content changes in Notion don't appear on site.

**Solution**:
1. Notion CMS template generates static pages during build
2. After changing Notion content, trigger a new deploy:
   ```bash
   netlify deploy --prod
   ```
3. Or: Set up a webhook for auto-deploy (advanced)

### Custom Domain Not Working

**Problem**: Custom domain shows error or doesn't load.

**Solution**:
1. Go to **Domain settings** → **Add custom domain**
2. Follow DNS configuration instructions
3. Wait for DNS propagation (up to 48 hours)
4. Enable HTTPS (automatic with Netlify)

---

## Advanced: Deploy Hooks

Trigger deploys via HTTP request (useful for Notion webhooks).

### Create Deploy Hook

1. Go to **Site settings** → **Build & deploy** → **Build hooks**
2. Click **Add build hook**
3. Name it (e.g., "Notion Update Hook")
4. Choose branch (usually `main`)
5. Click **Save**
6. Copy the webhook URL

### Trigger Deploy

```bash
curl -X POST -d '{}' YOUR_WEBHOOK_URL
```

### Automate with Notion

Use a service like Zapier or Make to trigger the webhook when Notion database changes.

---

## Post-Deployment Checklist

After your first successful deploy:

- [ ] Test admin panel login at `/admin-login.html`
- [ ] Verify all pages load correctly
- [ ] Check that images display properly
- [ ] Test dark mode toggle
- [ ] Verify project filtering works
- [ ] Test responsive design on mobile
- [ ] Check generated project pages
- [ ] Set up custom domain (if desired)
- [ ] Configure deploy notifications
- [ ] Test environment variables are working

---

## Need Help?

- **Netlify Docs**: https://docs.netlify.com
- **Support**: https://answers.netlify.com
- **Status**: https://netlifystatus.com

For template-specific issues, [open an issue on GitHub](https://github.com/lilyxia99/LeileiNotionCMS/issues).
