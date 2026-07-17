# AGENTS.md — 54yun.github.io

## Repo overview
Personal homepage ([54yun.cc](https://54yun.cc)), hosted as GitHub Pages at `54yun.github.io`. Pure static HTML/CSS/JS for homepage; VitePress-based blog at `/blog/` (source in `blog-src/`, build output in `blog/`).

## Pages
- `index.html` — landing page with links to external profiles, dark/light mode via `prefers-color-scheme`. Press `B` key to jump to bookmarks.
- `bookmarks.html` — bookmark collection, same CSS + dark mode.
- `404.html` — runtime uptime counter (start date Aug 26 2015) and external links. Uses `animate-slide-in-down` CSS classes (defined only here, no corresponding CSS in `main.css`).
- `blog/` — VitePress-generated blog at `/blog/` (build artifact, not committed).

## Notable details
- **Custom icon font** via `assets/fonts/icomoon.*` — defines icons used in CSS classes: `quotes-left`, `quotes-right`, `map-pin`, `moon`, `sun`.
- **Dark mode** is CSS-only via `@media (prefers-color-scheme: dark)` in `assets/css/main.css`. No JS toggle. Blog uses VitePress `.dark` class + `prefers-color-scheme` media query for compatibility.
- **PWA manifest** (`site.webmanifest`) with dark theme colors, no service worker.
- **VitePress blog theme** (`blog-src/.vitepress/theme/style.css`) overrides CSS variables to match homepage colors.

## Commands
- `npm run dev` — local VitePress dev server (hot reload)
- `npm run build` — build blog to `blog/` directory
- `npm run preview` — preview built blog locally

## Deployment
- **Homepage**: `git push origin main` — GitHub Pages auto-deploys from the `main` branch.
- **Blog CI/CD**: `.github/workflows/deploy.yml` — push to `main` triggers `npm ci + npm run build + upload-pages-artifact + deploy-pages`. Requires `Settings → Pages → Source = "GitHub Actions"` (one-time setup).
- `.gitignore` ignores `node_modules/`, `.DS_Store`, `Thumbs.db`, `blog/`.
