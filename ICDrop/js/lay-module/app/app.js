layui.define(function (exports) {

    var BackgroundDomain = "";
    if (location.href.includes("127.0.0.1") || location.href.includes("localhost")) {
        BackgroundDomain = "http://127.0.0.1:5921"
    }

    $ = layui.$;
    var i18n = layui.i18n;
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
            if (!parent.app) {

                /*  window.location = "/client/WindowsLogin.html";*/
                var index = layer.open({
                    title: 'Login',
                    type: 2,
                    shade: 0.2,
                    maxmin: true,
                    shadeClose: true,
                    area: ['920px', '580px'],
                    content: '/client/WindowsLogin.html',
                })
            }
            if (!config.OnlineType)
                config.OnlineType = parent.app.config.OnlineType;

            var YDHConfig = layui.data(config.OnlineType);
            var currency = layui.data("currency");
            if (currency.currency) {
                req.setRequestHeader("currency", currency.currency.id);
            }
            if (YDHConfig.Secret) {

                req.setRequestHeader("YDHAuthToken", YDHConfig.Secret);
                req.setRequestHeader("ETag", 0);
                req.setRequestHeader("Last-Modified", 0);

            }
        },
        complete: function (err) {
            if (err.status === 401) {

                if (!config.OnlineType)
                    config.OnlineType = parent.app.config.OnlineType;
                if (config.OnlineType == "YDH-Customer") {
                    parent.layer.closeAll();
                    var index = parent.layer.open({
                        title: 'Login',
                        type: 2,
                        shade: 0.2,
                        maxmin: true,
                        shadeClose: true,
                        area: ['920px', '580px'],
                        content: BackgroundDomain + '/client/WindowsLogin.html',
                    })
                } else if (config.OnlineType == "YDH") {
                    app.AuthorizationPage();
                }

            }
            if (err.status == 400) {
                layui.layer.msg(err.responseJSON.i18nKey ? i18n.prop(err.responseJSON.i18nKey) : err.responseJSON.message);
            }
        }
    });


    var app = {};

    app.config = config;
    // 验证权限
    app.Load = function (OType) {
        if (OType === "manage") {
            config.OnlineType = "YDH";
            config.LoginLink = BackgroundDomain + "/manage/login.html";
        } else if (OType === "client") {
            config.OnlineType = "YDH-Customer";
            config.LoginLink = BackgroundDomain + "/client/index.html";
        } else {
            config.OnlineType = parent.app.config.OnlineType
            config.PermissionLink = parent.app.config.PermissionLink;
            config.LoginLink = parent.app.config.LoginLink;
        }

        var YDHConfig = layui.data(config.OnlineType);

        if (!YDHConfig.Secret) {

            //window.location = config.LoginLink;

        } else {
            if (!config.PermissionLink)
                config.PermissionLink = parent.app.config.PermissionLink;
            if (config.PermissionLink) {
                //$.ajax({
                //    type: "post",
                //    url: config.PermissionLink,
                //    contentType: "application/json;",
                //    data: JSON.stringify("ydh"),
                //    dataType: "json",
                //    success: function () {
                //        //不处理 
                //    }
                //});
            }
        }
    }
    // 没有登录进行跳转到登录页面
    app.AuthorizationPage = function () {
        layui.data(config.OnlineType, {
            key: 'Secret'
            , remove: true
        });
        layui.data(config.OnlineType, {
            key: 'UserName'
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

        if (!config.LoginLink)
            config.LoginLink = parent.app.config.LoginLink;
        if (config.LoginLink) {
            window.location = config.LoginLink;
        }

    }
    //退出
    app.SignOut = function () {
        $.ajax({
            type: "post",
            // TODO local test
            // url: BackgroundDomain +"/api/Login/SignOut",
            url: "https://app.anderdrop.com" + "/api/Login/SignOut",
            success: function () {
                app.AuthorizationPage();
            }
        });
    }
    exports("app", app);
});

