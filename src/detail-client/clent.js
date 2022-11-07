// easy_sock用来实现ajax和后端通信的模块
const EasySock = require('easy_sock')
const protobuf = require('protocol-buffers')
const fs = require('fs')
const schemas = protobuf(fs.readFileSync(`${__dirname}/detail.proto`))

// 创建easysock实例
const easySoke = new EasySock({
  ip: '127.0.0.1', //服务端的ip和端口
  port: 4000,
  timeout: 500,
  keepAlive: true //tcp连接为全双工
})

// 作为一个客户端要把一个请求编码出来
easySoke.encode = function (data, seq) {
  console.log(data,seq)
  const body = schemas.ColumnRequest.encode(data)
  // data结构化的数据，把它编成一个二进制数据流
  // seq区分包序号
  const head = Buffer.alloc(8)
  head.writeInt32BE(seq)
  head.writeInt32BE(body.length,4)
  return Buffer.concat([head, body])

}

// 客户端接受到服务端的数据后，解析成结构化数据
easySoke.decode = function (buffer) {
  const seq = buffer.readInt32BE()
  const body = schemas.ColumnResponse.decode(buffer.slice(8))
  return {
    result: body, // 解码数据
    seq
  }
}
// 判断包是否接受完了，用来处理粘包和缺包的情况
easySoke.isReceiveComplete = function (buffer) {
  if (buffer.length < 8) {
    return 0
  }
  const bodyLength = buffer.readInt32BE(4)
  if (buffer.length >= bodyLength + 8) {
    return bodyLength + 8
  } else {
    return 0
  }
}
module.exports=easySoke
