---
title: xpath和css selector实现
date: '2019-11-21'
description: 实现xpath和css selector
---

XPath 即为 XML 路径语言（XML Path Language），它是一种用来确定 XML 文档中某部分位置的计算机语言。

DOM 中的 xpath 通常用作唯一 id，用来标识 dom 元素在页面中的位置，用于以下功能

1. 爬虫 dom 元素定位
2. 可视化埋点 dom 节点标示

以下是 xpath 和 css selector 的实现

```typescript
/**
 * 获取某个dom的xpath
 * @param target dom 节点
 */
export const getDomXPath = (el: HTMLElement): string => {
  let curXPath = ''
  const tagName = el.tagName.toLowerCase()

  if (tagName === 'body' || tagName === 'html') {
    return tagName
  }

  let id = el.id
  let elIndex = Array.prototype.indexOf.call(el.parentElement.children, el)
  curXPath = id ? `${tagName}[@id=${id}]` : `${tagName}[${elIndex}]`

  const parentXpath = getDomXPath(el.parentElement)

  return `${parentXpath}\\${curXPath}`
}
```

```typescript
/**
 * 获取某个dom的css选择器路径
 * @param target dom节点
 */
export const getDomCssPath = (el: HTMLElement): string => {
  let cssPath = ''
  const tagName = el.tagName.toLowerCase()

  if (tagName === 'body' || tagName === 'html') {
    return tagName
  }

  let id = el.id
  let elClsList = Array.prototype.join.call(el.classList, '.')
  cssPath = id ? `${tagName}#${id}` : `${tagName}.${elClsList}`

  const parentCssPath = getDomCssPath(el.parentElement)

  return `${parentCssPath}>${cssPath}`
}
```
