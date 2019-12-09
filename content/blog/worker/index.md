---
title: worker 在浏览器中的作用
date: 2019-12-10
description: 探索worker在浏览器中的功能以及comlink的功能
---

# worker
javascript 是单线程的，意味着任务只能分时排队进行，在进程UI计算的时候，js线程只能等待，不能做其它的事情，web worker的出现是为了支持web多线程运行，在做高负担计算的同时，也不会影响到主线程UI交互的流畅性。

worker线程可以理解为是主线程的打工小弟，主线程可以把任务派发给worker，worker通过计算之后，把计算的结果回传给主线程。

![](https://davidea.st/assets/articles/2018-05-31-comlink-simple-web-worker/worker-post-message.gif)

相比主线程，worker线程有以下限制

1. 同源限制，worker 脚本地址需要和主线程脚本同域
2. DOM 限制，worker 获取不了除了navigator和location之外的dom对象
3. 通信限制，worker 线程和主线程不能直接通信，需要通过消息传递完成


### 使用

主线程和worker线程通过message进行消息传递

主线程监听message事件，并向worker传递消息，注意消息可以是string，blob等各种内容

``` javascript

const worker = new Worker('./worker.js');

worker.addEventListener('message', e => {
  console.log('get message from worker: ', e.data);
});

worker.postMessage('hello world')
```

同理，worker 线程监听message事件来获取消息，postMessage发送消息

```javascript

self.addEventListener('message', e => {
  console.log('[worker] get message', e);
  self.postMessage('postMessage to main');
});

```






