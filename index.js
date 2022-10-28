const koa = require('koa')
const fs = require('fs')
const mount = require('koa-mount')
const static = require('koa-static')

const app = new koa()

// app.use(
//   static(__dirname+'/src/')
// )

app.use(
  mount('/',async (ctx)=>{
    ctx.body=fs.readFileSync(__dirname+'/src/index.html','utf-8')
  })
)

app.listen(3000)
