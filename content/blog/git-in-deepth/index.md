---
title: 深度理解git
date: 2019-12-11
description: 深入探索git底层原理以及常用操作
---

### git 操作
1.	git(distributed version control system) 分布式版本控制系统
2.	git内部，git 通过一个key/value的形式保存，key是一个hash串，value是数据内容
3.	git 内容以blob blob标示 \0 分割符来保存内容，可以通过 echo ‘blob 14\0Hello, World!’ | git hash-object —stdin 来获取git hash串
4.	通过 echo ‘blob 14\0Hello, World!’ | openssl sha1 来验证第三条
5.	.git 目录保存我们的数据信息
6.	blob文件存储在.git/objects/
7.	但是blob文件丢失了文件名，文件夹信息等
8.	git 通过tree去存储这些信息，tree 存储 blobs或者其他tree的指针，以及一些头信息，包括指针类型，文件名或者文件夹名，文件权限等
9.	相同文件只会被保存一次，两个文件在不同目录，但是是拷贝过去的，那么这个文件在git中只会被保存一次
10.	git object 是压缩后的数据，如果object过多，git 会把资源数据打包成有个Packfile，Packfile保存文件内容，以及每次增量更新的修改。
11.	每个commit都会指向一个tree，并包含以下信息，
  + author 和 提交者
  + commit 信息
  + 父节点
12.	commit 的sha1是以上所有信息的计算
13.	git cat-file -t sha1 // 查看文件类型是tree/blob/commit
14.	git cat-file -p sha1 // 查看文件内容
15.	tags/branches/HEAD 都是对commit的一个引用，指针指向一个commit信息
16.	工作区存的是untracked files, 暂存区存的是已修改代码，准备加入到下一个commit的内容
17.	git ls-files -s 会显示所有已经加入到暂存区的文件内容
18.	git add -p 交互式的添加内容到暂存区
19.	git stash --include-untracked // 将包括未跟踪的文件加入到暂存区
20.	通过git reset 将加入到存储区的内容重置到工作区
21.	references 引用指向commit，包括tags/branches/HEAD
22.	HEAD 指向 Branch， Branch 指向 commit
23.	branch 指针随着commit提交向前演进
24.	tag 是一次快照，定下后不再改变
25.	列出所有已经合入到master的分支 git branch —merged master
26.	列出所有没有合入到master的分支 git branch --no-merged master
27.	git reset —soft HEAD~ 只是简单的移动HEAD指针
28.	git reset —hard 覆写工作区以及暂存区的内容，并且无法undone
29.	检出一个远程分支，并且track  git checkout -t origin/feature
30.	git branch -vv 查看本地分支和远程分支的追踪情况
31.	git pull = git fetch && git merge
32.	查看哪些分支没有被push  git cherry -v