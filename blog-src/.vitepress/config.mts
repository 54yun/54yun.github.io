import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh',
  title: '暴风城茶馆',
  description: '暴风城茶馆的个人博客',
  base: '/blog/',
  cleanUrls: true,
  lastUpdated: true,
  outDir: '../blog',
})
