/**
 * date:2020/02/27
 * author:Mr.Chung
 * version:2.0
 * description:layuimini 菜单框架扩展
 */
const versions = "1.1.0"
layui.define(["i18n", "element", "laytpl", "jquery"], function (exports) {
    var element = layui.element,
        $ = layui.$,
        laytpl = layui.laytpl,
        i18n = layui.i18n,
        layer = layui.layer;

    var miniMenu = {

        /**
         * 菜单初始化
         * @param options.menuList   菜单数据信息
         * @param options.multiModule 是否开启多模块
         * @param options.menuChildOpen 是否展开子菜单
         */
        render: function (options) {
            options.menuList = options.menuList || [];
            options.multiModule = options.multiModule || false;
            options.menuChildOpen = options.menuChildOpen || false;
            if (options.multiModule) {
                miniMenu.renderMultiModule(options.menuList, options.menuChildOpen);
            } else {
                miniMenu.renderSingleModule(options.menuList, options.menuChildOpen);
            }
            miniMenu.listen();
        },

        /**
         * 单模块
         * @param menuList 菜单数据
         * @param menuChildOpen 是否默认展开
         */
        renderSingleModule: function (menuList, menuChildOpen) {
            menuList = menuList || [];
            var leftMenuHtml = '',
                childOpenClass = '',
                leftMenuCheckDefault = 'layui-this';
            var me = this;
            if (menuChildOpen) childOpenClass = ' layui-nav-itemed';
            leftMenuHtml = this.renderLeftMenu(menuList, { childOpenClass: childOpenClass });
            $('.layui-layout-body').addClass('layuimini-single-module'); //单模块标识
            $('.layuimini-header-menu').remove();
            $('.layuimini-menu-left').html(leftMenuHtml);

            element.init();
        },

        /**
         * 渲染一级菜单
         */
        compileMenu: function (menu, isSub) {
            // 国际化
            if (menu.i18nKey) {
                if (typeof (i18n.map[menu.i18nKey]) != "undefined") {
                    menu.title = i18n.map[menu.i18nKey]
                }
            }

            var menuHtml = `<li {{#if( d.menu){ }}  data-menu="{{d.menu}}" {{#}}} class="layui-nav-item menu-li {{d.childOpenClass}} {{d.className}}"  
            {{#if( d.id){ }}  id="{{d.id}}" {{#}}}> <a {{#if( d.href){ }} layuimini-href="{{d.href}}" {{#}}} 
            {{#if( d.target){ }}  target="{{d.target}}" {{#}}} href="javascript:location.href.includes('ImportCommodity')&&document.getElementById('addImportTab').contentWindow.location.reload();">
            {{#if( d.icon){ }}  <i style="font-size: 24px;float: left;padding-top: 5px;margin-right: 12px; " class="{{d.icon}}"></i> {{#}}} <span class="layui-left-nav">{{d.title}}</span></a>  
            {{# if(d.children){}} {{d.children}} {{#}}} </li>`;
            if (isSub) {
                menuHtml = '<dd class="menu-dd {{d.childOpenClass}} {{ d.className }}"> <a href="javascript:;"  {{#if( d.menu){ }}  data-menu="{{d.menu}}" {{#}}} {{#if( d.id){ }}  id="{{d.id}}" {{#}}} {{#if(( !d.child || !d.child.length ) && d.href){ }} layuimini-href="{{d.href}}" {{#}}} {{#if( d.target){ }}  target="{{d.target}}" {{#}}}> {{#if( d.icon){ }}  <i style="font-size: 24px;float: left;padding-top: 5px;margin-right: 12px; " class="{{d.icon}}"></i> {{#}}} <span class="layui-left-nav"> {{d.title}}</span></a> {{# if(d.children){}} {{d.children}} {{#}}}</dd>'
            }
            return laytpl(menuHtml).render(menu);
        },
        compileMenuContainer: function (menu, isSub) {
            var wrapperHtml = '<ul class="layui-nav layui-nav-tree layui-left-nav-tree " id="{{d.id}}">{{d.children}}</ul>';
            if (isSub) {
                wrapperHtml = '<dl class="layui-nav-child ">{{d.children}}</dl>';
            }
            if (!menu.children) {
                return "";
            }
            return laytpl(wrapperHtml).render(menu);
        },

        each: function (list, callback) {
            var _list = [];
            for (var i = 0, length = list.length; i < length; i++) {
                _list[i] = callback(i, list[i]);
            }
            return _list;
        },
        renderChildrenMenu: function (menuList, options) {
            var me = this;
            menuList = menuList || [];
            var html = this.each(menuList, function (idx, menu) {
                if (menu.child && menu.child.length) {
                    menu.children = me.renderChildrenMenu(menu.child, { childOpenClass: options.childOpenClass || '' });
                }
                menu.className = "";
                menu.childOpenClass = options.childOpenClass || ''
                return me.compileMenu(menu, true)
            }).join("");
            return me.compileMenuContainer({ children: html }, true)
        },
        renderLeftMenu: function (leftMenus, options) {
            options = options || {};
            var me = this;
            var leftMenusHtml = me.each(leftMenus || [], function (idx, leftMenu) { // 左侧菜单遍历
                var children = me.renderChildrenMenu(leftMenu.child, { childOpenClass: options.childOpenClass });
                /*         console.log("children:" + children);*/
                var href = leftMenu.href;
                if (!children) { href = leftMenu.href + '?v=' + new Date().valueOf() + versions }
                /* console.log("href:" + href);*/
                var leftMenuHtml = me.compileMenu({
                    id: new Date().valueOf(),
                    href: href,
                    target: leftMenu.target,
                    childOpenClass: options.childOpenClass,
                    icon: leftMenu.icon,
                    title: leftMenu.title,
                    children: children,
                    className: '',
                    i18nKey: leftMenu.i18nKey
                });
                return leftMenuHtml;
            }).join("");

            leftMenusHtml = me.compileMenuContainer({ id: options.parentMenuId, className: options.leftMenuCheckDefault, children: leftMenusHtml });
            return leftMenusHtml;
        },
        /**
         * 多模块
         * @param menuList 菜单数据
         * @param menuChildOpen 是否默认展开
         */
        renderMultiModule: function (menuList, menuChildOpen) {
            menuList = menuList || [];
            var me = this;
            var headerMenuHtml = '',
                headerMobileMenuHtml = '',
                leftMenuHtml = '',
                leftMenuCheckDefault = 'layui-this',
                childOpenClass = '',
                headerMenuCheckDefault = 'layui-this';

            if (menuChildOpen) childOpenClass = ' layui-nav-itemed';

            var headerMenuHtml = this.each(menuList, function (index, val) { //顶部菜单渲染
                if (val.child.top) {
                    var menu = 'multi_module_top';
                    var id = menu + "HeaderId";
                    var topMenuItemHtml = "";
                    topMenuItemHtml = me.compileMenu({
                        className: headerMenuCheckDefault,
                        menu: menu,
                        id: id,
                        title: val.title,
                        href: "",
                        target: "",
                        children: "",
                        i18nKey: val.i18nKey
                    });
                    leftMenuHtml += me.renderLeftMenu(val.child.top, {
                        parentMenuId: menu,
                        childOpenClass: childOpenClass,
                        leftMenuCheckDefault: leftMenuCheckDefault
                    });
                }

                if (val.child.bottom) {
                    var menu = 'multi_module_bottom';
                    var id = menu + "HeaderId";
                    var topMenuItemHtml = "";
                    topMenuItemHtml = me.compileMenu({
                        className: headerMenuCheckDefault,
                        menu: menu,
                        id: id,
                        title: val.title,
                        href: "",
                        target: "",
                        children: "",
                        i18nKey: val.i18nKey
                    });
                    leftMenuHtml += me.renderLeftMenu(val.child.bottom, {
                        parentMenuId: menu,
                        childOpenClass: childOpenClass,
                        leftMenuCheckDefault: leftMenuCheckDefault
                    });
                }
                headerMobileMenuHtml += me.compileMenu({ id: id, menu: menu, id: id, icon: val.icon, title: val.title, i18nKey: val.i18nKey }, true);
                headerMenuCheckDefault = "";
                return topMenuItemHtml;
            }).join("");
            $('.layui-layout-body').addClass('layuimini-multi-module'); //多模块标识
            $('.layuimini-menu-header-pc').html(headerMenuHtml); //电脑
            $('.layuimini-menu-left').html(leftMenuHtml);
            $('.layuimini-menu-header-mobile').html(headerMobileMenuHtml); //手机
            element.init();
        },

        /**
         * 监听
         */
        listen: function () {
            /**
             * 菜单缩放
             */
            $('body').on('click', '.layuimini-site-mobile', function () {
                var loading = layer.load(0, { shade: false, time: 2 * 1000 });
                var isShow = $('.layuimini-tool [data-side-fold]').attr('data-side-fold');
                if (isShow == 1) { // 缩放
                    $('.layuimini-tool [data-side-fold]').attr('data-side-fold', 0);
                    $('.layuimini-tool [data-side-fold]').attr('class', 'fa fa-indent');
                    $('.layui-layout-body').removeClass('layuimini-all');
                    $('.layui-layout-body').addClass('layuimini-mini');
                } else { // 正常
                    $('.layuimini-tool [data-side-fold]').attr('data-side-fold', 1);
                    $('.layuimini-tool [data-side-fold]').attr('class', 'fa fa-outdent');
                    $('.layui-layout-body').removeClass('layuimini-mini');
                    $('.layui-layout-body').addClass('layuimini-all');
                    $('.layui-header').show();
                }

                element.init();
                layer.close(loading);
            });
            /**
             * 菜单缩放
             */
            $('body').on('click', '[data-side-fold]', function () {
                var loading = layer.load(0, { shade: false, time: 2 * 1000 });
                var isShow = $('.layuimini-tool [data-side-fold]').attr('data-side-fold');
                if (isShow == 1) { // 缩放
                    $('.layuimini-tool [data-side-fold]').attr('data-side-fold', 0);
                    $('.layuimini-tool [data-side-fold]').attr('class', 'fa fa-indent');
                    $('.layui-layout-body').removeClass('layuimini-all');
                    $('.layui-layout-body').addClass('layuimini-mini');
                    // $(".menu-li").each(function (idx,el) {
                    //     $(el).addClass("hidden-sub-menu");
                    // });

                } else { // 正常
                    $('.layuimini-tool [data-side-fold]').attr('data-side-fold', 1);
                    $('.layuimini-tool [data-side-fold]').attr('class', 'fa fa-outdent');
                    $('.layui-layout-body').removeClass('layuimini-mini');
                    $('.layui-layout-body').addClass('layuimini-all');
                    // $(".menu-li").each(function (idx,el) {
                    //     $(el).removeClass("hidden-sub-menu");
                    // });
                    layer.close(window.openTips);
                }
                element.init();
                layer.close(loading);
            });

            /**
             * 手机端点开模块
             */
            $('body').on('click', '.layuimini-header-menu.layuimini-mobile-show dd', function () {
                var loading = layer.load(0, { shade: false, time: 2 * 1000 });
                var check = $('.layuimini-tool [data-side-fold]').attr('data-side-fold');
                if (check === "1") {
                    $('.layuimini-site-mobile').trigger("click");
                    element.init();
                }
                layer.close(loading);
            });
        },

    };


    exports("miniMenu", miniMenu);
});
