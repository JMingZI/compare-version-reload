/**
 * 版本控制 缓存
 * 注解：约定项目入口文件都会动态加载version.js文件
 * 在webpack里动态生成文件并移动到对应的打包目录
 * 文件内容是：版本号+回调函数
 *
 * 在项目入口文件中，用正则匹配替换版本号，通过在回调中比对版本号
 * 来判断当前html是否是缓存
 */
var fs = require("fs");
var path = require("path");
var checkVersionPath = path.resolve(__dirname, "./lib/check-version.js");

module.exports = {
    _OPT_: {
        VERSION: "", 
        CONTENT: ""
    },
    // obj = { filename, path, templateHtmlPath, version }
    // 传入的参数：生成的js文件名，生成的js文件路径，需要处理的html文件及路径，需要添加的版本
    init: function (obj) {
        // 去除路径 ./ 
        obj.path = obj.path.replace(/\.\//, "");
        obj.templateHtmlPath = obj.templateHtmlPath.replace(/\.\//, "");

        this.obj = obj;
        this._OPT_.VERSION = obj.version;
        this._OPT_.CONTENT = "window.APP__VERSION = '"+ obj.version 
            +"';APP_VERSION_CALLBACK && APP_VERSION_CALLBACK()";

        this.createVersion();
        this.handleTemplateHtml();
    },
    /**
     * 创建指定文件并移动文件到指定目录
     */
    createVersion: function() {
        var filename = this.obj.filename + ".js";
        var path = this.obj.path + this.obj.filename + ".js";
        console.log(path);
        fs.writeFile(filename, this._OPT_.CONTENT, function (err) {
            if (err) throw err;
            console.log('//**创建写入' + filename); 

            fs.rename(filename, path, function(err){
                if(err) throw err;
                console.log('//**移动' + filename + "到" + path); 
            });
        });
    },
    handleTemplateHtml: function () {
        // 操作模版文件
        var destHtml = this.obj.templateHtmlPath;
        var version = this.obj.version;
        var jsname = this.obj.templateLinkPath + this.obj.filename + ".js";

        fs.readFile(destHtml, 'utf8', function (err, data) {
            if (err) throw err;
            // 增加版本标识
            data = data.replace(/<html.*?>/, '<html version="' + version + '">');
            console.log('//**增加版本标识' + version); 

            // 如果check-version.js内容存在，则remove掉
            if (/id="version"/.test(data)) {
                data = data.replace(/\s*?<script id="version">(.|\s)*?<\/script>/, "");
            }

            fs.readFile(checkVersionPath, "utf8", function (err, versionJs) {
                if (err) throw err;

                console.log("//**模版文件引入js的路径" + jsname);
                var versionJs = '<script id="version">\n'+ versionJs.replace(/\{\{path\}\}/, jsname) +'</script>';
                data = data.replace(/<title>(.*?)<\/title>/, versionJs + '\n<title>$1</title>');

                fs.writeFile(destHtml, data, function (err) {
                    if (err) throw err;
                    console.log('//**重写模版文件成功'); 
                });
            });
        });
    }
}; 

