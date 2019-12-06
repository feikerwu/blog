---
title: traceroute 实现原理
date: 2019-12-06
description: traceroute 作用以及实现原理
---

#### traceroute 作用

traceroute 常用于网络排错，网络中，主机和主机通信会通过很多个 ip 节点，如果某个 ip 节点出现问题，可以通过 traceroute 去定位具体的 ip 节点

#### 实现原理

traceroute 通过发送 UDP 包，在网络层 IP 数据包的头图修改 TTL，TTL 分别设置为 1，2，3，。。64，TTL 在每次经过一个节点的时候都会减 1，当 TTL === 0 的时候，机器会通过 ICMP(internet-control-message-protocol) 协议向源主机发送报错消息。

traceroute 通过这种方法来定位问题 ip
