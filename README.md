# require-split-chunk-webpack-plugin

该插件用于在 Nodejs 环境下代码分割中自动`require`分割出去的文件。

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

本插件是为运行在`Nodejs`平台代码做代码分割用的，所以插件内部运行时会检测 webpack 的 target 属性。  
当 target 为下列值时，该插件才会启动：  

* node
* electron-main
* electron-renderer
* electron-preload
* node-webkit
