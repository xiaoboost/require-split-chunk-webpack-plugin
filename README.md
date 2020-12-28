# require-split-chunk-webpack-plugin

该插件用于在 Nodejs 环境下代码分割中自动`require`分割出去的文件。

## 这个插件有什么用

在 Web 浏览器的工程化解决方案中，代码分割和打包是很常见的步骤。在代码分割之后，通常将会有另外的插件将生成的文件加入到对应的`html`文件的引用中。  
比如说，在某个前端工程中我们生成了`common.js`和`main.js`两个文件，这两个文件实际上是在对应的`html`文件相关联的，`html`文件中通常会这么写：

```html
<html>
    <body>
        <script src="/js/common.js"></script>
        <script src="/js/main.js"></script>
    </body>
</html>
```

而在 Nodejs 环境中，就算是进行了代码打包和分割，由于是直接运行入口文件，没有`html`来完成对分割代码的自动引用，所以必然会发生错误。  
使用此插件后，会在打包完成的代码中插入一段`require`分割代码的代码，这样就能解决在 Nodejs 环境中自动引用的问题。  

## 用法

### 安装
```bash
npm install require-split-chunk-webpack-plugin -D
```

### webpack 配置
```javascript
const { RequireSplitChunkPlugin } = require('require-split-chunk-webpack-plugin');

module.exports = {
    target: 'node',
    plugins: [
        new RequireSplitChunkPlugin(),
    ],
};
```

插件内部运行时会检测 Webpack 的 target 属性。当 target 为下列值时，该插件才会启动：  

* node
* electron-main
* electron-renderer
* electron-preload
* node-webkit

## 兼容性

* v1 版本支持 webpack 4 版本
* v2 版本支持 webpack 5 版本
