# require-split-chunk-webpack-plugin

该插件用于在 Nodejs 环境下代码分割中自动`require`分割出去的文件。

# 这个插件有什么用

在 Web 浏览器的工程化解决方案中，代码分割和打包是很常见的步骤。在代码分割之后，通常将会有另外的插件讲生成的文件加入带对应的`html`文件的引用中。  
而在 Nodejs 环境中，就算是进行了代码打包和分割，由于无法自动引用分割出去的代码，所以会发生错误，此插件就是为了解决在 Nodejs 环境中自动引用分割处去的代码所用的。

# 用法

## 安装
```bash
npm install require-split-chunk-webpack-plugin -D
```

## webpack 配置
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
