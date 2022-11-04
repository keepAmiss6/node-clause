// 用es6模版字符串当作模版引擎来用
const user={
  name:'<script/>'
}
const result=`<h2>${user.name}</h2>`

// 如何用模版字符串实现ejs的效果
const vm = require('vm')
const templateMap = {
  templateA:'`<h2>${include("templateB")}</h2>`',
  templateB:'`<p>hahahahah</p>`'
}

// 抽取模版运行的沙箱环境
const context = {
  user,
  include:function(name){
    return templateMap[name]()
  },
  heilper:function(){},
  _:function (markus) {
    // 添加xss过滤方法
    if(!markus)return
    return String(markus)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;')

  }}

 Object.keys(templateMap).forEach(key=>{
   const temp =templateMap[key]
   templateMap[key]=vm.runInNewContext(`
      (function(){
          return ${temp}
      });
   `,context)
 })
console.log(templateMap['templateA']())

// _()表示对函数的调用
// console.log(vm.runInNewContext('`<h2>${_(user.name)}</h2>`', context));
// 原理：把一个es6字符串放到一个沙箱里去运行，在js里面重新编译运行一次js代码，这样就可以使这个js字符串像模版引擎一样使用出来了



// 使用ejs渲染
// const templeate='<h2><%= user.name %></h2>'
// ejs.render(templeate,user)
