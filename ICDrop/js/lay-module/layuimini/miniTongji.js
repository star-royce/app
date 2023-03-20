/**
 * date:2020/03/01
 * author:Mr.Chung
 * version:2.0
 * description:layuimini 统计框架扩展
 */
layui.define(["jquery"], function (exports) {
    var $ = layui.$;

    var miniTongji = {

        /**
         * 初始化
         * @param options
         */
        render: function (options) {
            options.specific = options.specific || false;
            options.domains = options.domains || [];
            var domain = window.location.hostname;
            if (options.specific === false || (options.specific === true && options.domains.indexOf(domain) >=0)) {
                miniTongji.listen();
            }
        }
    };

    exports("miniTongji", miniTongji);
});