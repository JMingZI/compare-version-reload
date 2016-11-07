var version = require('compare-version-reload');
version.init({
    filename: "version",
    path: "./",
    templateHtmlPath: "./index.html",
    version: "1.0.0"
});