---
title: 大文件数据排序
description: 100亿排序问题：内存不足，一次只允许你装载和操作1亿条数据，如何对100亿条数据进行排序
date: 2019-12-14
---

talk is cheap, show me the code!

外排序算法

1. 将 100 亿数据拆分成 100 块，分块读取存到 100 个小文件
2. 对 100 个小文件(1 亿数据)排序
3. 因为内存只允许 1 亿数据操作，对 100 个文件，每次读取 100 万数据，做 100 路归并排序，将结果写入到目标文件
4. 重复 3 操作，依次读取剩下的数据，排序后追加到目标文件结尾

### 构造测试数据

100 亿数据，为了方便测试，用一个整数代表一条数据。
javascript 中，Number 类型采用 IEEE754 标准中的 “双精度浮点数” 来表示一个数字，不区分整数和浮点数。IEEE754，双精度浮点数采用 64 位存储，也就是 8 个 byte。
![](https://upload.wikimedia.org/wikipedia/commons/7/76/General_double_precision_float.png)
那么 100 亿数据大概就是 `100 * 100000000 * 8 = 80000000000 / 1024 / 1024 / 1024 = 74.5 G`, OK，看了下小霸王的剩余存储空间，可以下一题了。

以上纯属为了分析，因为只是为了模拟，所以数据量没必要那么大，减少数据量，改下题

> 100 万排序问题：内存不足，一次只允许你装载和操作 1 万条数据，如何对 100 万条数据进行排序

100 万大概是 `100 * 10000 * 8 = 8000000 / 1024 / 1024 = 7.62 M`, 大小上可以接受。

##### 生成文件

生成 100w 数据的文件

```typescript
import * as fs from 'fs'
import * as path from 'path'

const DATA_SIZE: number = 1000000
const DATA_RANGE: number = 1000000

const data: Array<number> = Array.from({ length: DATA_SIZE }).map(_ =>
  Math.floor(Math.random() * DATA_RANGE)
)

fs.writeFile(path.resolve(__dirname, 'big-data'), data.join(' '), () => {})
```

将文件分割成 100 分，根据上述分析，每次读取的文件大小应该是 `8 * 10000`

```typescript
import * as fs from 'fs'
import * as path from 'path'

const resolve = (filename: string) => path.resolve(__dirname, filename)

const splitedDir: string = 'splited'
fs.mkdir(resolve(splitedDir), { recursive: true }, err => console.error(err))

const readStream = fs.createReadStream(resolve('big-data'), {
  highWaterMark: 8 * 10000 // 以固定大小读取文件
})

let count = 0

readStream.on('data', chuck => {
  fs.writeFile(resolve(`${splitedDir}/${count++}`), chuck, err =>
    console.error(err)
  )
})

readStream.on('end', () => {
  console.log('write end')
})
```

用以上代码去分割，按照预期，应该分割成 100 个文件，每个文件 `8 * 10000 = 78.15k` 才对，当我自信满满的去看生成文件，发现只生成了 86 个文件，且每个文件的大小是 80k，86 \* 80k = 6.7M 和 预期的 7.6M 也不符合，看了下生成文件的确是 6.7M

```bash
du -h big-data
6.6M	big-data
```

仔细看了下生成的文件的代码，我们在存储数据的时候，是采用 `data.join(' ')` 转换成字符串来存储，这里的字符是用`utf-8`编码，UTF-8 编码把一个 Unicode 字符根据不同的数字大小编码成 1-6 个字节，常用的英文字母被编码成 1 个字节，汉字通常是 3 个字节，只有很生僻的字符才会被编码成 4-6 个字节，所以相比原来规规矩矩的双精度浮点数 8 个字节有压缩。

不过没关系，只是为了模拟操作，86 个文件也够用

##### 排序以及写入到目标文件

在排序之前，遇到一个新问题

> 如何从 86 个文件中同时读取固定大小的内容，处理后可以再次读取

google 了下，找到的都是如何从一个大文件分片读取，通过新建一个可读流，依靠触发'data'事件，来一点点读数据，但是我想要的是从 80 多个文件同时读取。
流既然可以分块读取文件，那么我能不能让它停下来，开 86 个可读性流，每个流读取一块数据后停下来，待 86 个数据都被读取后并处理后，让流继续读取文件。
问题规约为如何让可读文件流暂停，翻了下 node 文档, 可读流分为两种模式，其中一种叫`paused`, 在这种模式下，只有调用了`stream.read()`才能读取下一块内容。
具体可以看[node 的 stream 部分](https://nodejs.org/dist/latest-v13.x/docs/api/stream.html#stream_two_reading_modes)

> Readable streams effectively operate in one of two modes: flowing and paused. These modes are separate from object mode. A Readable stream can be in > object mode or not, regardless of whether it is in flowing mode or paused mode.
> In flowing mode, data is read from the underlying system automatically and provided to an application as quickly as possible using events via the > > EventEmitter interface.
> In paused mode, the stream.read() method must be called explicitly to read chunks of data from the stream.

前置问题都解决了，可以开始写排序代码了

```typescript
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

async function createReadlines() {
  const files = await fs.promises.readdir(path.resolve(__dirname, 'splited'))
  const channels: Array<readline.Interface> = files.map(file => {
    const stream = fs.createReadStream(
      path.resolve(__dirname, `splited/${file}`)
    )

    return readline.createInterface({
      input: stream
    })
  })

  return channels
}

async function sort() {
  const distFile = fs.createWriteStream(path.resolve(__dirname, 'out'))
  const channels = await createReadlines()
  const srcData = Array.from(channels).map(item => [])

  channels.forEach((channel, index) => {
    channel.on('line', num => {
      srcData[index].push(+num)
    })
  })

  let termData = []
  for (let i = 0; i < srcData.length; i++) {
    termData.push([i, srcData[i].shift()])
  }

  let c = 100
  while (c--) {
    let min = [-1, Infinity]
    let count = 0
    for (let i = 0; i < termData.length; i++) {
      if (termData[i][0] === -1) {
        count = count + 1
      } else {
        if (min[1] > termData[i][1]) {
          min = termData
        }
      }
    }

    const [index, value] = min
    if (index !== -1 && srcData[index].length !== 0) {
      termData[index] = [index, srcData[index].shift()]
    } else {
      termData[index] = [-1, Infinity]
    }

    distFile.write(`${value} `)

    // 数据被处理完了
    if (count === termData.length) {
      break
    }
  }
}

sort()
```

[原题地址](https://github.com/airuikun/Weekly-FE-Interview/issues/18)
