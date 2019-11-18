---
title: vue.nextTick 原理解析
date: '2019-11-13'
description: vue.nextTick有什么作用，以及其实现原理
---

## Vue.nextTick()有什么作用？实现原理是什么？

1. vue 开发时，更新响应式数据后，如果想立马拿到 dom 元素做点什么，就需要用到 Vue.nextTick()
2. 那么什么是 nextTick，为什么要用到 nextTick，以及 nextTick 是如何实现的

#### 什么是 nextTick

在 vue 里面，数据更新后，我们是无法立马拿到响应数据更新后的 dom 的，nextTick 就是 vue 的 api，如果想要操作 dom，可以通过这个 api 获取

以下是[vue 官方文档](https://cn.vuejs.org/v2/api/#Vue-nextTick)

> 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

#### 为什么需要用到 nextTick

浏览器里面频繁操作 dom 会非常影响性能，某个 dom 的宽高变化可能都会引起整个页面的重排重绘，个人认为，vue 这种框架对开发者来说最重要的有两块，一个是数据绑定，另外一个就是虚拟 dom，这两个都去解决了一个问题，避免开发者直接去操作 dom。

vue.nextTick 就是上述背景的一个产物，我们在更改响应式数据的时候，vue 不会检测到一次数据更新，就去更新一下 dom，甚至不会去改 vdom，它会先有一个 diff 的计算，比如有个计数器`count`,如果`count`从 0 加到 1 了，diff 会算出 count 这个值从 0 变为了 1，然后把变化 1 这个结果 patch 到 vdom 上，最后再更新到真实 dom 上，如果
`count`从 0 加到 1000，同理，diff 只会算出 count 从 0 变到了 1000，然后做一次 patch 操作，并不会做 1000 次。

以上过程中，如果 count 多次变化，vue 会把 count 的 watcher 推到一个更新队列里面，在下一个`tick`去计算最终变化后的 count，然后去执行相关的 watcher，这样避免了不必要的性能开销，`nextTick` 就是在 count 所有变化后并更新到 dom 上之后去执行的。

#### nextTick 实现原理

上述下一个`Tick`其实就是下一次事件循环，所以只要是可以放到下一次事件循环的函数都可以用来实现 nextTick，vue 里面采取了以下策略去实现 nextTick

1. 如果浏览器支持 promise，就用 promise.resolve(fn) 来实现
2. 否则，如果浏览器支持 MutationObserver，用 MutationObserver
3. 如果浏览器支持 setImmediate，用 setImmediate
4. 如果上述都不支持，用 setTimeout 兜底

Vue 2.0 的源码见这 [nextTick 源码 ](https://github.com/vuejs/vue/blob/dev/src/core/util/next-tick.js)

自己实现一个不用 `mutionObserver` 的 `nextTick`

```js
const nextTick = cb => {
  const queueMicrotask =
    typeof queueMicrotask === 'function'
      ? queueMicrotask
      : Promise && (cb => Promise.resolve().then(cb))
      ? setImmediate && (cb => setImmediate(cb))
      : cb => setTimout(cb)

  queueMicrotask(cb)
}
```

_ps: 看了下 vue3 的 [nextTick](https://github.com/vuejs/vue-next/blob/555e3be69d39f4b35a312916253d9f38cbcab495/packages/runtime-core/src/scheduler.ts#L10) 好像只用了 promise，可能之后会补充_
