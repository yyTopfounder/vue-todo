module.exports = (isDev) =>{
  var config = {
    preserveWhitespace: true, //去除.vue文件html模板中的空格
    extractCss: !isDev, //是否将vue中的css样式添加至单独打包的css文件中
    hotReload:true, //是否开启热重载功能，这个会根据环境而自动设置，一般不指定
    cssModules:{
      localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]',
      camelCase: true
    }
    //loaders:{},preLoader:{},postLoader:{}用于处理在.vue文件中自定义模块Loader
  }

  return config;
}
