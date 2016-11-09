(function () {
var script = document.createElement("script");
script.src = "{{path}}?_=" + Math.random();
document.getElementsByTagName("head")[0].appendChild(script);

window.APP_VERSION_CALLBACK = function (version) {
    if (document.documentElement.getAttribute("version") != version) {
        if (location.search) {
            var sArr = location.search.split("&"), search = {}, temp;
            for (var i = 0;i < sArr.length; i++) {
                temp = sArr[i].split("=");
                search[temp[0]] = temp[1];
            }
        }
        // 得到search object
        search["version"] = window.APP__VERSION;
        // search.join("")
        temp = [];
        for (var name in search) {
            temp.push(name + "=" + search[name]);
        }
        reloadUrl = location.origin + location.pathname + temp.join("&") + location.hash;
        console.log(reloadUrl);
        location.href = reloadUrl;
    }           
}
}());
