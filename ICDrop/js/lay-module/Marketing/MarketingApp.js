layui.define(function (exports) {
    $ = layui.$;
    var layer = layui.layer;
    var config = {};
    // 登录类型
    config.OnlineType = "";
    // 验证权限链接
    config.PermissionLink = "";
    // 登录链接
    config.LoginLink = "";
    $.ajaxSetup({

        beforeSend: function (req) {

            if (!MarketingApp) {
                  window.location = "/Marketing/MKLogin.html";
            }
            if (!config.OnlineType)
                config.OnlineType = MarketingApp.config.OnlineType;

            var YDHConfig = layui.data(config.OnlineType);

            if (YDHConfig.Secret) {

                req.setRequestHeader("YDHAuthToken", YDHConfig.Secret);
                req.setRequestHeader("ETag", 0);
                req.setRequestHeader("Last-Modified", 0);

            }
        },
        complete: function (err) {
            if (err.status === 401) {
                MarketingApp.AuthorizationPage();
            }
            if (err.status == 400) {
                layui.layer.msg(err.responseJSON.message, { icon: 2, time: 3000, shade: 0.4 });
            }
        }
    });
    var MarketingApp = {};

    MarketingApp.config = config;

    // 验证权限
    MarketingApp.Load = function (OType) {

        if (OType === "Marketing") {
            config.OnlineType = "YDH-Marketing";
            config.LoginLink = "/Marketing/MKLogin.html";
        } else {
            config.OnlineType = MarketingApp.config.OnlineType
            config.PermissionLink =MarketingApp.config.PermissionLink;
            config.LoginLink = MarketingApp.config.LoginLink;
        }

        var YDHConfig = layui.data(config.OnlineType);
        //如果超过24小时，则删除缓存
        var CreateTime = new Date(YDHConfig.CreateTime);
        var EndTime = new Date(CreateTime.setDate(CreateTime.getDate() + 1));
        var NowTime = new Date();
        if (EndTime < NowTime) {
            layui.data(config.OnlineType, {
                key: 'Secret'
                , remove: true
            });
            layui.data(config.OnlineType, {
                key: 'email'
                , remove: true
            });
            layui.data(config.OnlineType, {
                key: 'CreateTime'
                , remove: true
            });
            layui.data(config.OnlineType, {
                key: 'MarketingCode'
                , remove: true
            });
        }

        //if (!YDHConfig.Secret) {
        //    window.location = config.LoginLink;
        //} else {
        //    if (!config.PermissionLink)
        //        config.PermissionLink = MarketingApp.config.PermissionLink;
        //    if (config.PermissionLink) {
             
        //    }
        //}
    }

    // 没有登录进行跳转到登录页面
    MarketingApp.AuthorizationPage = function () {
        layui.data(config.OnlineType, {
            key: 'Secret'
            , remove: true
        });
        layui.data(config.OnlineType, {
            key: 'email'
            , remove: true
        });
        if (!config.LoginLink)
            config.LoginLink =MarketingApp.config.LoginLink;
        if (config.LoginLink) {
            window.location = config.LoginLink;
        }

    }
    //退出
    MarketingApp.SignOut = function () {
        $.ajax({
            type: "post",
            url: BackgroundDomain +"/api/Login/SignOut",
            success: function () {
                MarketingApp.AuthorizationPage();
            }
        });
    }
    exports("MarketingApp", MarketingApp);
})