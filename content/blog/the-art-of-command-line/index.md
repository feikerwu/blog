---
title: the art of cammand line
date: '2019-11-21'
description: 《the-art-of-command-line》读书笔记
---

鉴于最近在服务器上操作比较多，之前对命令行一直是似懂非懂，所以趁此机会重学一下命令行，在 github 上找到一个 6w 多 star 的库，[the art of cammand line](https://github.com/jlevy/the-art-of-command-line), 这里做一下阅读笔记

#### tips

- `ctrl + r` 可以在 bash 搜索脚本执行的历史记录
- `ctrl + l` 清屏，类似与 clear
- `man readline` 查看命令行的快捷键(osx 内不行)
- `cd -` 回到前一个工作路径
- `!!` 执行上一个命令
- 在命令的最前面添加#可以将这条命令给注释掉，example, 命令写到一半，通过`ctrl a #`注释命令，下次通过`ctrl + r`进入命令搜索再次执行

#### xargs

xargs 标准输入转化为命令行参数，有些命令不支持标准输入，必须得在命令行输入参数，这时候就可以用 xargs 转化

- xargs 用法

xargs 使用格式

```bash
xargs [-options] [command]
```

- tee 用于将标准输出写到文本文件

```bash
ls -al | tee file.txt # 将当前的文件信息保存到file.txt文件
```

- sort 用来对文本排序并将排序内容输出
- grep 全称(global search regular expression(RE) and print out the line) 全面搜索正则表达式并把行打印出来
  用的比较多的是 `grep -E 'reg' file` 在 file 里面去搜索某些正则可以匹配出来的内容
- du (disk usage) 用于查看当前文件的大小
- lsof(list open file)打开所有打开的文件
- type 来查看命令的类型

#### 参考

- [explainshell 一个解释 bash 命令的一个工具](https://explainshell.com/)
