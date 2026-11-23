#!/usr/bin/env bash
# 构建豆瓣存档(Hugo 站点)到 ./douban/
#
# 源目录 douban-src/ 分两部分:
#   content/ static/ site-profile.json  ← 豆备(Doubak)导出的 Markdown 与图片,由工具生成,勿手改
#   layouts/ assets/ hugo.toml          ← 豆备内置的极简 Hugo 主题(见 douban-src/README.md)
#
# 用法: bash scripts/build-douban.sh
# 需要 Hugo 0.164.0。PATH 里没有时按固定版本 + 固定校验和自动下载到 .hugo/
# (仅 Linux x86_64;macOS 请先 brew install hugo,Windows 用 winget install Hugo.Hugo)。
set -euo pipefail
cd "$(dirname "$0")/.."

HUGO_VERSION=0.164.0
HUGO_SHA256_LINUX_AMD64=d9c8b17285ea4ec004d9f814273ea910f2051ce02c284993fd1f91ba455ae50d

if command -v hugo >/dev/null 2>&1; then
  hugo_bin=$(command -v hugo)
else
  cache=.hugo
  hugo_bin="$cache/hugo"
  if [ ! -x "$hugo_bin" ]; then
    case "$(uname -s)-$(uname -m)" in
      Linux-x86_64) ;;
      *)
        echo "未找到 hugo,且自动下载只支持 Linux x86_64。请先安装 Hugo ${HUGO_VERSION}。" >&2
        exit 1
        ;;
    esac
    mkdir -p "$cache"
    tmp=$(mktemp -d)
    trap 'rm -rf "$tmp"' EXIT
    echo "下载 Hugo ${HUGO_VERSION} ..."
    curl -sSfL -o "$tmp/hugo.tar.gz" \
      "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux-amd64.tar.gz"
    echo "${HUGO_SHA256_LINUX_AMD64}  $tmp/hugo.tar.gz" | sha256sum -c -
    tar xzf "$tmp/hugo.tar.gz" -C "$cache" hugo
  fi
fi

rm -rf douban
"$hugo_bin" --source douban-src --destination "$PWD/douban" --cleanDestinationDir

echo "构建完成: douban/ 共 $(find douban -name '*.html' | wc -l) 个页面"
