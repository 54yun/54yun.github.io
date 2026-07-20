# AGENTS.md — 54yun.github.io

## Repo overview
Personal homepage ([54yun.cc](https://54yun.cc)), hosted as GitHub Pages at `54yun.github.io`. Pure static HTML/CSS/JS homepage.

## Pages
- `index.html` — landing page with links to external profiles, dark/light mode via `prefers-color-scheme`. Press `B` key to jump to bookmarks.
- `bookmarks.html` — bookmark collection, same CSS + dark mode.
- `404.html` — runtime uptime counter (start date Aug 26 2015) and external links. Uses `animate-slide-in-down` CSS classes (defined only here, no corresponding CSS in `main.css`).

## Notable details
- **Custom icon font** via `assets/fonts/icomoon.*` — defines icons used in CSS classes: `quotes-left`, `quotes-right`, `map-pin`, `moon`, `sun`.
- **Dark mode** is CSS-only via `@media (prefers-color-scheme: dark)` in `assets/css/main.css`. No JS toggle.
- **PWA manifest** (`site.webmanifest`) with dark theme colors, no service worker.

## Deployment
- `git push origin main` — GitHub Pages auto-deploys from the `main` branch.
- `.gitignore` ignores `.DS_Store`, `Thumbs.db`.
