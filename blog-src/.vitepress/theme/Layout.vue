<script setup lang="ts">
/*
 * 给豆瓣存档的页面套一个作用域类。
 *
 * 存档并进博客后不再自带样式表,只有封面需要收敛(小缩略图)。VitePress 没有
 * 「按路径给 body 加类」的开关,而覆盖 Layout 是最轻的做法:
 * 外层 div 用 display: contents(见 style.css),不影响默认主题的栅格与定位。
 */
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { computed } from 'vue'

const { Layout } = DefaultTheme
const route = useRoute()
const isDouban = computed(() => route.path.includes('/douban/'))
</script>

<template>
  <div :class="{ 'douban-scope': isDouban }">
    <Layout />
  </div>
</template>
