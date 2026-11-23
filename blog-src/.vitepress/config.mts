import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh',
  title: '暴风城茶馆',
  description: '暴风城茶馆的个人博客',
  base: '/blog/',
  cleanUrls: true,
  lastUpdated: {
    text: '最后更新于',
    formatOptions: { dateStyle: 'medium', timeStyle: 'short' },
  },
  outDir: '../blog',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '豆瓣存档', link: '/douban/' },
    ],
    // 离线本地搜索:175 条书/影视 + 博客文章都在索引里,不发任何外部请求
    search: {
      provider: 'local',
    },
    outline: {
      level: [2, 3],
      label: '本页目录',
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
})
