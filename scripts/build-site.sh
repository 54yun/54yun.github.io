#!/usr/bin/env bash
# 构建整个站点(主页 + 博客 + 豆瓣存档)到 dist/,供 Cloudflare Pages 部署
# Cloudflare Pages 构建设置:
#   Build command:        bash scripts/build-site.sh
#   Build output directory: dist
set -euo pipefail

npm ci
npm run build
bash scripts/build-douban.sh

rm -rf dist
mkdir -p dist

# 复制主页文件(纯 bash,兼容无 rsync 的构建环境)
for entry in ./* ./.??*; do
  [ -e "$entry" ] || continue
  case "$entry" in
    ./.git|./.github|./node_modules|./blog|./blog-src|./douban|./douban-src|./dist|./scripts|./.gitignore|./.gitattributes|./.hugo|./AGENTS.md|./reasonix.toml|./package.json|./package-lock.json)
      ;;
    *)
      cp -r "$entry" dist/
      ;;
  esac
done

mkdir -p dist/blog dist/douban
cp -r blog/. dist/blog/
cp -r douban/. dist/douban/

echo "构建完成: dist/ 已包含主页、/blog/ 与 /douban/"
