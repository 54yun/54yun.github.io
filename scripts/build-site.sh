#!/usr/bin/env bash
# 构建整个站点(主页 + 博客)到 dist/,供 Cloudflare Pages 部署
# 豆瓣存档并进了博客源码(blog-src/douban),随 VitePress 一起构建,不再单独跑 Hugo。
# Cloudflare Pages 构建设置:
#   Build command:        bash scripts/build-site.sh
#   Build output directory: dist
set -euo pipefail

npm ci
npm run build

rm -rf dist
mkdir -p dist

# 复制主页文件(纯 bash,兼容无 rsync 的构建环境)
for entry in ./* ./.??*; do
  [ -e "$entry" ] || continue
  case "$entry" in
    ./.git|./.github|./node_modules|./blog|./blog-src|./dist|./scripts|./.gitignore|./.gitattributes|./AGENTS.md|./reasonix.toml|./package.json|./package-lock.json)
      ;;
    *)
      cp -r "$entry" dist/
      ;;
  esac
done

mkdir -p dist/blog
cp -r blog/. dist/blog/

echo "构建完成: dist/ 已包含主页与 /blog/(含 /blog/douban/)"
