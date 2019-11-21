## TCP 三次握手为什么是3次而不是2次或者4次

### TCP协议是什么，为什么需要TCP

要搞懂为什么是三次握手，首先得搞懂什么是TCP协议，为什么网络协议中需要TCP协议。

**传输控制协议**（英语：**T**ransmission **C**ontrol **P**rotocol，缩写：**TCP**）是一种面向连接的、可靠的、基于[字节流](https://zh.wikipedia.org/wiki/字節流)的[传输层](https://zh.wikipedia.org/wiki/传输层)通信协议，由[IETF](https://zh.wikipedia.org/wiki/IETF)的[RFC](https://zh.wikipedia.org/wiki/RFC) [793](https://tools.ietf.org/html/rfc793)定义。在简化的计算机网络[OSI模型](https://zh.wikipedia.org/wiki/OSI模型)中，它完成第四层传输层所指定的功能。[用户数据报协议](https://zh.wikipedia.org/wiki/用户数据报协议)（UDP）是同一层内另一个重要的传输协议。

在网络协议中，TCP位与IP层之上，应用层之下，与UDP不同的是，TCP需要保证在数据传输过程中不丢失，以及数据到达之后精确，可靠，而不是被篡改。

注意这里，数据的可靠与精确，这个是TCP协议需要保证的最基本功能。



### TCP三次握手的具体流程

TCP协议的运行可划分为三个阶段：连接创建(*connection establishment*)、数据传送（*data transfer*）和连接终止（*connection termination*）

我们说的TCP三次握手是TCP客户端和服务端连接创建时候的工作。

以下是TCP连接的具体流程，

![](http://www.tcpipguide.com/free/diagrams/tcpopen3way.png)

1. 客户端client向服务端server发送一个SYN(synchronize)报，包上带随机序号A
2. server接收到client的SYN初始化包之后，回复一个SYN/ACK包，ACK包上带上序号A+1，表示我正确收到了这个客户端client的消息，同时自己的SYN上带上随机序号B
3. client收到server的SYN/ACK包后，回复一个ACK包，带上序号B+1，告诉客户端我们我正确接收到你的请求

了解以上流程之后，我们再来回答为什么是3次，而不是2次或者4次。



##### 为什么不是2次

如果只有2次，那么能做的只有

1. client 向 server 发送一个连接请求，SYN带上随机数A
2. server回复ACK/SYN，ACK带上A+1，SYN带上自己的随机数B

以上保证了client向server发送请求的准确性，如果server发送的ACK/SYN包丢失，那么server向client发送消息的初始序号号B就无法同步



##### 为什么不是4次

以上第二次的ACK/SYN包可以被拆分成两个ACK包和SYN包两次发送，但是没必要，就比如以下对话

1. how are you
2. I'm fine, thanks, and you?

I'm fine的回应和and you 完全可以放到同一个消息里，没必要拆分。



#### 参考

[维基百科: TCP](https://zh.wikipedia.org/wiki/传输控制协议)