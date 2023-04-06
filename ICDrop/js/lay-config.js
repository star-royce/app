/**
 * date:2019/08/16
 * author:Mr.Chung
 * description:此处放layui自定义扩展
 * version:2.0.4
 */

if (!location.href.includes("https") && location.href.includes("app.anderdrop.com")) {
    location.href = location.href.replace("http", "https")
}

window.rootPath = (function (src) {
    src = document.scripts[document.scripts.length - 1].src;
    return src.substring(0, src.lastIndexOf("/") + 1);
})();

// TODO 本地测试
var BackgroundDomain = "https://app.anderdrop.com";
// var BackgroundDomain = "";
// if (location.href.includes("127.0.0.1") || location.href.includes("localhost")) {
//     BackgroundDomain = "http://localhost"
// }

layui.config({
    base: rootPath + "lay-module/",
    version: true
}).extend({
    miniAdmin: "layuimini/miniAdmin", // layuimini后台扩展
    miniMenu: "layuimini/miniMenu", // layuimini菜单扩展
    miniTab: "layuimini/miniTab", // layuimini tab扩展
    miniTheme: "layuimini/miniTheme", // layuimini 主题扩展
    miniTongji: "layuimini/miniTongji", // layuimini 统计扩展
    step: 'step-lay/step', // 分步表单扩展
    treetable: 'treetable-lay/treetable', //table树形扩展
    tableSelect: 'tableSelect/tableSelect', // table选择扩展
    iconPickerFa: 'iconPicker/iconPickerFa', // fa图标选择扩展
    echarts: 'echarts/echarts', // echarts图表扩展
    echartsTheme: 'echarts/echartsTheme', // echarts图表主题扩展
    wangEditor: 'wangEditor/wangEditor', // wangEditor富文本扩展
    layarea: 'layarea/layarea', //  省市县区三级联动下拉选择器    
    app: 'app/app',// 权限控制
    i18n: 'i18n/i18n',
});

window.GetRequest = (function (key) {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    var value = theRequest[key];
    return value;
});

        function setCookie(cname,cvalue,exdays)
        {
          var d = new Date();
          d.setTime(d.getTime()+(exdays*24*60*60*1000));
          var expires = "expires="+d.toGMTString();
          var domain = "";
          if (location.href.includes("127.0.0.1") || location.href.includes("localhost")) {
            domain = ";domain=localhost"
        }
        var path = "";
          if (location.href.includes("127.0.0.1") || location.href.includes("localhost")) {
            path = ";path=/"
        }
          document.cookie = cname + "=" + cvalue + ";" + expires+domain+path;
        }

        function getCookie(cname)
        {
          var name = cname + "=";
          var ca = document.cookie.split(';');
          for(var i=0; i<ca.length; i++) 
          {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
          }
          return "";
        }