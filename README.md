# linhuiba

> m.linhuiba.com Vue.js 重构

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9000
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### 开发环境配置说明

nodejs   版本6.10及以上
  [link](https://nodejs.org/en/)
  推荐下载稳定版
+ 更新npm包：
    ```npm install npm@latest -g```为最新版本

+ 推荐淘宝镜像
    ```npm config set registry http://registry.npm.taobao.org/```

    需要时再改回去
    ```npm config set registry https://registry.npmjs.org/```

___

###vue-cli#2.0 webpack 配置分析
如果你不太懂vue-cli相关webpack文件，可以戳下面链接：

	https://juejin.im/post/584e48b2ac502e006c74a120

# ☆ 表示重要程度

# 参数处理说明

+ 支付宝回调链接

	- 订单支付成功 http://m.lanhanba.net?shareRedirect=order/paySuccess
	- 拼团支付成功 http://m.lanhanba.net?shareRedirect=group/paySuccess
	- 票据支付成功 http://m.lanhanba.net?shareRedirect=invoice/paySuccess
+ 链接中参数说明
  - shareRedirect   处理支付回调链接的  与pc分享相关
  - BackKey=1       处理分享的链接可以展示  在app中打开  的按钮，同时隐藏返回按钮
  - key='dsafdsa...'处理app加载页面的授权问题
  - from=singlemessage  APP分享和微信分享的链接，需要能在app中打开
  - from=timeline   1.公众号分享的链接，2.pc和微信互相跳转的控制

    http://m.lanhanba.net/?from=timeline#/group/groupDetail/70
  ** 这些参数不能在路由中使用，避免出现不可预料的bug **
