# 豆瓣存档(来源与更新方式)

这个目录是被构建成 <https://54yun.github.io/douban/> 的 Hugo 站点源码。

## 组成

| 路径 | 来源 | 是否可手改 |
| --- | --- | --- |
| `content/` `static/` `site-profile.json` | 豆备(Doubak)导出的 Markdown 数据树 | 否,重新导出时整体覆盖 |
| `layouts/` `assets/` `hugo.toml` | 豆备内置的极简 Hugo 主题 | 可以,改过的部分已在 `hugo.toml` 里注明 |
| `LICENSE` | 上述主题的 Apache-2.0 许可证 | 否 |

主题取自 <https://github.com/Doubak/doubak-site-generator> 的 `theme/hugo/`
(commit `d1f1632b545ee15c98128b8fcf334a49e9cdd1a9`, Apache-2.0)。
本站相对上游的改动:

- `hugo.toml`:站点标题、页脚源码链接、`baseURL` 的部署路径说明
- `layouts/_default/single.html`:书页(`douban_medium == "book"`)加一行「电子版」微信读书搜索入口
- `static/site.css`:上面那一行的样式(`.ebook-links`)

## 本仓库的裁剪范围

存进本站的只有 **书** 与 **影视** 两类作品。豆备导出的其余部分(广播、日记、
评论、相册、小组、豆列)没有提交,`static/uploads/`(广播配图与日记插图)也一并删掉了,
所以相对完整导出有三处是手工裁剪过的:

- `content/` 只保留 `book/`、`movie/`、`search.md`,以及重写过的 `_index.md`
  (首页只陈列书与影视两节);
- `static/search-index.js` 由全量索引过滤为 `k == "book" || k == "movie"`,`content/search.md`
  里的 `douban_count` 同步改成条目数;
- `static/uploads/` 不再存在。

重新导出时若想保持现状,记得同样处理,否则被删掉的栏目会随着 `rsync` 一起回来。

## 站点如何构建

```bash
bash scripts/build-douban.sh   # 产出 ./douban/(已 gitignore)
```

Hugo 版本固定为 0.164.0,PATH 里没有时脚本会自动下载并校验 SHA-256。
`scripts/build-site.sh`(CI 与 Cloudflare 共用)会把 `douban/` 一起放进 `dist/douban/`。

## 从新的导出更新数据

1. 用豆备重新导出,得到含 `content/`、`static/`、`site-profile.json` 的目录(即 `npm run md` 的产物);
2. 替换本目录下这三项:

   ```bash
   rsync -a --delete <新导出目录>/content/          douban-src/content/
   rsync -a --delete <新导出目录>/static/           douban-src/static/
   cp <新导出目录>/site-profile.json                douban-src/
   ```

   注意 `static/` 里要保留主题的 `static/site.css`,所以上面的 `--delete` 之后再补一次:

   ```bash
   cp <上游 theme/hugo>/static/site.css douban-src/static/
   ```

3. 跑 `bash scripts/build-douban.sh` 确认无警告、无断链,再提交。
