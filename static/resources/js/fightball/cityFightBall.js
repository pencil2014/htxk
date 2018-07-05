require.config({
    baseUrl: hhly_base_path,
    paths: {
        "jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
        "hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
        "layer":"/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92",
        "template": "/resources/js/common/template.js?v=a19711611b",
        'common':'/resources/js/common/common.js?v=f486ed9e43',
        'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
        'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
        "sort": "/resources/js/fightball/manage/sort.js?v=5c6b4cbfbc",
        "nav": "/resources/js/fightball/manage/nav.js?v=088f341198",
        "app": "/resources/js/fightball/app.js?v=901ec15346",
        "cityCommon":"/resources/js/fightball/manage/cityCommon.js?v=d410370883",
        'blockUI':'/resources/js/jquery/jquery.blockUI.js?v=f436a3ff73'

    },
    shim:{
        'layer': {
            deps: ['jquery']
        },
        "hhlyAction": {
            deps: ['jquery','layer']
        },
        'template': {
            deps: ['jquery']
        },
        'common':{
            deps: ['jquery','commonUtil','hhlyAction']
        }
    }
});


define(['jquery', 'template', 'sort', 'nav', 'app','cityCommon','common','i18n'], function ($, template, sort, nav, app,cityCommon) {
    //var hhly_city = localStorage.getItem('areaId') || 11959,
    var hhly_city = $(".hhly_cityId").attr('hhly-cityId') || 11959,
        areaId = app.getUrl('areaId') || 0;
        //url = {
        //    fightPage: app.baseUrl + '/city/fight/page',
        //    fightStar:app.baseUrl + '/city/fight/star'
        //},
        p_param = {
            sportType: 0, /*运动类型*/
            cityId: hhly_city, /*城市ID*/
            areaId: areaId, /*区域ID 此参数以后要改*/
            orderId: 0, /*排序参数*/
            page: 1,
            rows: 10
        },
        s_param = {
            type:1
        };
    //console.log(hhly_city);
    var fight = {
        listLoad: function () {
            $.get(app.baseUrl + '/city/fight/page', p_param, function (data) {
                /*拼球数据列表的接口*/
                //console.log(data, '拼球数据列表的接口');
                if(data.result == 0){
                    app.getId('fightListCon', data, fightListWrap);   
                }
            });
        },

        sideLoad: function () {
            $.get(app.baseUrl + '/city/fight/star', s_param, function (data) {
                /*球队拼球达人推荐数据列表的接口*/
                //console.log(data, '球队拼球达人推荐数据列表的接口');
                if(data.result == 0){
                    app.getId('fightSideCon', data, fightSideWrap);
                }
            });
        },
        fightClick: function () {
            $(".sort_tpl").delegate('.cityClick li', 'click', function () {
                /*全城区域 获取参数传统给数据列表接口*/
                var areaId = $(this).attr('area_id');
                p_param.areaId = areaId;
                p_param.page = 1;
                fight.listLoad();
            });
            $(".sort_tpl").delegate('.sortClick li', 'click', function () {
                /*运动类型 获取参数传统给数据列表接口*/
                var sportType = $(this).attr('sport_type');
                p_param.sportType = sportType;
                p_param.page = 1;
                fight.listLoad();
            });
            $(".sort_tpl").delegate('.orderClick li', 'click', function () {
                /*排序 获取参数传统给数据列表接口*/
                var orderId = $(this).attr('order_id');
                p_param.orderId = orderId;
                p_param.page = 1;
                fight.listLoad();
            });
            $(".mod_ball").delegate('.moreClick', 'click', function () {
                p_param.page++;
                p_param.page = p_param.page;
                var that = $(this);
                cityCommon.appendMore(app.baseUrl + '/city/fight/page',p_param,'fightUlCon',fightUlWrap,that);
            });
            $(".mod_side").delegate('.rankClick span', 'click', function () {
                var type = $(this).attr("type"),
                classLi = $('.rankClick span'),
                cLi = classLi.index(this);
                s_param.type = type;
                cityCommon.hoverFn(cLi,classLi);
                cityCommon.changeTime(app.baseUrl + '/city/fight/star',s_param,'fightSideCon',fightSideWrap);


            });
        }
    };
    $(function () {
        fight.listLoad();
        fight.sideLoad();
        $('.fightball_footer').removeClass('hidden');
        fight.fightClick();
    });


});


