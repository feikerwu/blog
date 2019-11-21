---
title: tcp三次握手
date: '2019-11-13'
description: tcp三次握手具体流程，为什么是3次而不是2次或者4次
---

## TCP 三次握手为什么是 3 次而不是 2 次或者 4 次

### TCP 协议是什么，为什么需要 TCP

要搞懂为什么是三次握手，首先得搞懂什么是 TCP 协议，为什么网络协议中需要 TCP 协议。

**传输控制协议**（英语：**T**ransmission **C**ontrol **P**rotocol，缩写：**TCP**）是一种面向连接的、可靠的、基于[字节流](https://zh.wikipedia.org/wiki/字節流)的[传输层](https://zh.wikipedia.org/wiki/传输层)通信协议，由[IETF](https://zh.wikipedia.org/wiki/IETF)的[RFC](https://zh.wikipedia.org/wiki/RFC) [793](https://tools.ietf.org/html/rfc793)定义。在简化的计算机网络[OSI 模型](https://zh.wikipedia.org/wiki/OSI模型)中，它完成第四层传输层所指定的功能。[用户数据报协议](https://zh.wikipedia.org/wiki/用户数据报协议)（UDP）是同一层内另一个重要的传输协议。

在网络协议中，TCP 位与 IP 层之上，应用层之下，与 UDP 不同的是，TCP 需要保证在数据传输过程中不丢失，以及数据到达之后精确，可靠，而不是被篡改。

注意这里，数据的可靠与精确，这个是 TCP 协议需要保证的最基本功能。

### TCP 三次握手的具体流程

TCP 协议的运行可划分为三个阶段：连接创建(_connection establishment_)、数据传送（_data transfer_）和连接终止（_connection termination_）

我们说的 TCP 三次握手是 TCP 客户端和服务端连接创建时候的工作。

以下是 TCP 连接的具体流程，

![](https://www.tcpipguide.com/free/diagrams/tcpopen3way.png)

1. 客户端 client 向服务端 server 发送一个 SYN(synchronize)报，包上带随机序号 A
2. server 接收到 client 的 SYN 初始化包之后，回复一个 SYN/ACK 包，ACK 包上带上序号 A+1，表示我正确收到了这个客户端 client 的消息，同时自己的 SYN 上带上随机序号 B
3. client 收到 server 的 SYN/ACK 包后，回复一个 ACK 包，带上序号 B+1，告诉客户端我们我正确接收到你的请求

了解以上流程之后，我们再来回答为什么是 3 次，而不是 2 次或者 4 次。

##### 为什么不是 2 次

如果只有 2 次，那么能做的只有

1. client 向 server 发送一个连接请求，SYN 带上随机数 A
2. server 回复 ACK/SYN，ACK 带上 A+1，SYN 带上自己的随机数 B

以上保证了 client 向 server 发送请求的准确性，如果 server 发送的 ACK/SYN 包丢失，那么 server 向 client 发送消息的初始序号号 B 就无法同步

##### 为什么不是 4 次

以上第二次的 ACK/SYN 包可以被拆分成两个 ACK 包和 SYN 包两次发送，但是没必要，就比如以下对话

1. how are you
2. I'm fine, thanks, and you?

I'm fine 的回应和 and you 完全可以放到同一个消息里，没必要拆分。

#### 参考

[维基百科: TCP](https://zh.wikipedia.org/wiki/传输控制协议)
