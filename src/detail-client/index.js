const mount = require('koa-mount')
const static = require('koa-static')
const app = new (require('koa'))
const rpcClient = require('./clent.js')
const template = require('./template')
const detailTemplate = template(__dirname + '/template/index.html')

app.use(mount('/static', static(`${__dirname}/source/static/`)))
app.use(async (ctx) => {
  console.log('3e3e3e3', ctx.request)
  const res = await new Promise((resolve, reject) => {
    console.log(ctx.query.columnid);
    rpcClient.write({
      columnid: ctx.query.columnid
    }, function (err, data) {
      err ? reject(err) : resolve(data)
    })
  })

  ctx.status = 200
  ctx.body = detailTemplate(res)
  console.log(res);

})
app.listen(3000)

