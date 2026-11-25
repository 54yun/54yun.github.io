#!/usr/bin/env node
/*
 * 把豆备(Doubak)导出的 Markdown 数据树转换成 VitePress 页面。
 *
 * 用法:
 *   node scripts/import-douban.mjs <豆备导出目录>
 *
 * <豆备导出目录> 即 `npm run md` 的产物,至少要包含:
 *   content/book/  content/movie/  static/covers/
 *
 * 产出(会先清空再写):
 *   blog-src/douban/**            页面
 *   blog-src/public/douban/covers 封面
 *
 * 只保留书与影视两类,广播/日记/评论/相册/小组/豆列一律跳过。
 * 数据本身(mm/dd 文件)是工具生成的,不要在 blog-src 里手改,重新导出后重跑本脚本。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = process.argv[2]

if (!srcDir) {
  console.error('用法: node scripts/import-douban.mjs <豆备导出目录>')
  process.exit(1)
}

const contentDir = path.join(srcDir, 'content')
const coversDir = path.join(srcDir, 'static', 'covers')
const pagesDir = path.join(repoRoot, 'blog-src', 'douban')
const publicCovers = path.join(repoRoot, 'blog-src', 'public', 'douban', 'covers')

for (const dir of [contentDir, coversDir]) {
  if (!fs.existsSync(dir)) {
    console.error(`缺少目录: ${dir}`)
    process.exit(1)
  }
}

/* ── 极简 front matter 解析 ─────────────────────────────────────────
 * 这里只需要标量字段,数组与嵌套原样跳过——页面正文照抄,不重建数据。
 */
function parseFrontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { head: '', data: {}, body: text }
  const data = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!kv) continue
    let v = kv[2].trim()
    if (v.length >= 2 && ((v[0] === '"' && v.at(-1) === '"') || (v[0] === "'" && v.at(-1) === "'"))) {
      v = v.slice(1, -1)
    }
    if (v === 'null' || v === '~') v = null
    data[kv[1]] = v
  }
  return { head: m[0], data, body: text.slice(m[0].length) }
}

/*
 * 内容排除名单(按豆瓣条目 id)。
 * 主题上的取舍不交给脚本判断,这里只留一份显式清单:重新导出后也不会回来。
 * 想恢复某本,删掉对应行重跑即可。
 */
const EXCLUDED_BOOK_IDS = new Set([
  '1003479', // 中国历代政治得失
  '25933193', // 大国政治的悲剧
  '26986713', // 政治分肥
  '26371591', // 常识(托马斯·潘恩)
])

const MEDIA = [
  { key: 'book', name: '书', unit: '本' },
  { key: 'movie', name: '影视', unit: '部' },
]

function readMedium(medium) {
  const dir = path.join(contentDir, medium)
  const items = []
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const id = file.replace(/\.md$/, '')
    const text = fs.readFileSync(path.join(dir, file), 'utf8')
    const { head, data, body } = parseFrontMatter(text)
    if (medium === 'book' && EXCLUDED_BOOK_IDS.has(id)) continue
    const coverFile = data.douban_cover ? path.basename(data.douban_cover) : null
    items.push({
      id,
      title: data.title || id,
      status: data.douban_status || '',
      verb: data.douban_verb || '',
      date: data.date || '',
      head,
      body,
      cover: coverFile && fs.existsSync(path.join(coversDir, coverFile)) ? coverFile : null,
    })
  }
  // 新的在前;没有日期的排最后
  items.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  return items
}

function writePage(relPath, content) {
  const target = path.join(pagesDir, relPath)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, content.endsWith('\n') ? content : content + '\n')
}

fs.rmSync(pagesDir, { recursive: true, force: true })
fs.rmSync(publicCovers, { recursive: true, force: true })
fs.mkdirSync(publicCovers, { recursive: true })

// 封面:只复制被引用到的
const usedCovers = new Set()

const byMedium = {}
for (const media of MEDIA) {
  byMedium[media.key] = readMedium(media.key)
  for (const item of byMedium[media.key]) if (item.cover) usedCovers.add(item.cover)
}
for (const cover of usedCovers) {
  fs.copyFileSync(path.join(coversDir, cover), path.join(publicCovers, cover))
}

const rootSections = []

for (const media of MEDIA) {
  const items = byMedium[media.key]

  // 详情页:front matter 原样保留,正文开头插封面与书页的合法电子版入口
  for (const item of items) {
    const parts = [`# ${item.title}`]
    if (item.cover) {
      parts.push(
        `<img class="douban-cover" src="/douban/covers/${item.cover}" alt="${item.title}" width="120">`,
      )
    }
    if (media.key === 'book') {
      // 关键词去掉结尾版本括注:「心理学与生活 (第20版)」按字面搜是 0 条,
      // 去掉后同名书会一起出来,按作者/出版社再挑。
      const keyword = item.title.replace(/\s*[（(][^）)]*[）)]\s*$/, '') || item.title
      const url = `https://weread.qq.com/web/search/books?keyword=${encodeURIComponent(keyword)}`
      parts.push(`<p class="douban-ebook">电子版:<a href="${url}" target="_blank" rel="noreferrer">微信读书</a></p>`)
    }
    const body = item.body.replace(/\r\n/g, '\n')
    writePage(
      path.join(media.key, `${item.id}.md`),
      item.head.replace(/\r\n/g, '\n') + parts.join('\n\n') + '\n' + body,
    )
  }

  // 栏目页:不再按想读/在读/读过分页,一个封面网格铺完(相对链接,raw HTML 不补 base)
  const cells = items
    .map((item) => {
      const cover = item.cover
        ? `<img src="/douban/covers/${item.cover}" alt="" loading="lazy">`
        : '<span class="no-cover"></span>'
      return `  <li><a href="${item.id}"><span class="cover">${cover}</span><span class="t">${item.title}</span></a></li>`
    })
    .join('\n')

  writePage(
    path.join(media.key, 'index.md'),
    `---
title: ${media.name}
---

# ${media.name}

<p class="douban-summary">共 ${items.length} ${media.unit}</p>

<ul class="douban-grid">
${cells}
</ul>
`,
  )

  rootSections.push({ media, total: items.length })
}

writePage(
  'index.md',
  `---
title: 豆瓣存档
---

# 豆瓣存档

<p class="douban-lede">从本地档案生成的个人存档,与豆瓣网无关。只收录书与影视。</p>

<div class="douban-cards">
${rootSections
  .map(
    ({ media, total }) => `  <a class="douban-card" href="${media.key}/">
    <h2>${media.name} <b>${total}</b></h2>
  </a>`,
  )
  .join('\n')}
</div>
`,
)

console.log(
  `已生成 ${path.relative(repoRoot, pagesDir)}: ` +
    MEDIA.map((m) => `${m.name} ${byMedium[m.key].length}`).join(' / ') +
    `,封面 ${usedCovers.size} 张`,
)
