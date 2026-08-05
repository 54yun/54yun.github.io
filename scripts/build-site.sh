#!/usr/bin/env bash
# 构建整个站点(主页 + 博客)到 dist/,供 Cloudflare Pages 部署
# Cloudflare Pages 构建设置:
#   Build command:        bash scripts/build-site.sh
#   Build output directory: dist
set -euo pipefail

npm ci
npm run build

rm -rf dist
mkdir -p dist

rsync -a \
  --exclude '.git' \
  --exclude '.github' \
  --exclude '.gitignore' \
  --exclude '.gitattributes' \
  --exclude 'node_modules' \
  --exclude 'blog' \
  --exclude 'blog-src' \
  --exclude 'dist' \
  --exclude 'scripts' \
  --exclude 'package.json' \
  --exclude 'package-lock.json' \
  ./ dist/

mkdir -p dist/blog
cp -r blog/. dist/blog/

echo "构建完成: dist/ 已包含主页与 /blog/"
