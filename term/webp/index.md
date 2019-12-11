---
title: webp
date: 2019-12-12
description: webp
---

### webp 优势

### webp 兼容情况

### webp 兼容处理方案

#### js 支持

写个插件，集成到 webpack，判断浏览器是否是 webp, 是则请求 webp，否 jpg

#### 服务端支持

在 header 的 accept 中判断是否支持 webp，是则返回 webp 的图片

#### webview 支持

直接由 ios 在 webview 拦截，如果是 webp，就返回一个 png
