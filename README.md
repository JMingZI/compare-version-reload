# compare-version-reload

使用

```js
var compareVersion = require("compare-version-reload");
compareVersion.init({
    filename: "version",
    path: "./",
    templateHtmlPath: "./src/index.html",
    version: "2.0.0"
});
```

参数说明

```yaml
// obj = { filename, path, templateHtmlPath, version }
// 传入的参数：生成的js文件名，生成的js文件路径，需要处理的html文件及路径，需要添加的版本
```


原理

```yaml
/**
 * 版本控制 缓存
 * 注解：约定项目入口文件都会动态加载version.js文件
 * 在webpack里动态生成文件并移动到对应的打包目录
 * 文件内容是：版本号+回调函数
 *
 * 在项目入口文件中，用正则匹配替换版本号，通过在回调中比对版本号
 * 来判断当前html是否是缓存
 */
 ```