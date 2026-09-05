# Independently Thinking Human — static Vercel site

This is the deployable React/Vite frontend for Independently Thinking Human. It is a static site: article data is bundled from `content/articles.json`, and article images are served from `public/library`. It does not require Django, a database, API credentials, or a running server.

## Local development

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
npm run preview
```

## Publishing through GitHub

1. Create a GitHub repository and push this directory (including `package-lock.json`). The included `.gitignore` keeps `node_modules/`, `dist/`, environment files, and local machine metadata out of the repository.
2. In Vercel, choose **Add New → Project**, import the GitHub repository, and select the repository's project directory if this app is in a monorepo.
3. Use these project settings:
   - **Framework Preset:** Vite
   - **Root Directory:** the directory containing this README and `package.json`
   - **Install Command:** `npm install` (or leave Vercel's default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Node.js Version:** the current LTS version supported by Vercel
   - **Environment Variables:** none required
4. Deploy. Future pushes to the connected GitHub branch create preview deployments; the production branch publishes the live site.

### Updating articles

Edit `content/articles.json` and commit the change to GitHub. Each article contains `title`, `slug`, `author`, `date`, `excerpt`, `content`, `image`, `section`, and `tags`. Put any new article image in `public/library/<section>/` and set `image` to its path relative to that directory (for example, `mindset/new-image.png`). Vercel rebuilds the bundled content on the next deployment.

The original admin/API workflow is intentionally not included in this static project. Routes retained from the frontend are `/`, `/library`, `/library/:section`, `/library/:section/:slug`, `/data`, and `/contact`.
