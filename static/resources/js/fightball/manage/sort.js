define(['jquery', 'template', 'app', 'nav','cityCommon'], function ($, template, app, nav,cityCommon) {
    var docW = $(window).width();
    var sortBall = {
        sortMore: function (that,hHeight) {
            /*
             that是指当前的元素
             hHeight是被操作元素的高度值
             hText是设置的一个默认高度
             */
            var hText = '20px';
            var auto = 'auto';
            if (hHeight == hText) {
                that.text('收起');
                that.append("<i class='icon iconfont'>&#xe647;</i>");
                that.siblings('.sort_ul').css('height', 'auto');
                hHeight == 'auto';
            } else {
                that.text('更多');
                that.append("<i class='icon iconfont'>&#xe617;</i>");
                that.siblings('.sort_ul').css('height', hText);
                hHeight == hText;
            }
        },
        cityFn: function () {
            var hhly_city = $(".hhly_cityId").attr('hhly-cityId') || 11959;
            var areaId = app.getUrl('areaId');
            $.get(app.baseUrl + '/city/common/district', {cityId: hhly_city}, function (data) {
                /*全城区域的接口*/
                //console.log(data, '全城区域接口');
                if(data.result == 0){
                    data.docWidth = docW;
                    if(areaId){
                        data.areaId = areaId;
                    };
                    app.getId('cityCon', data, cityWrap);
                }
            });
        },
        sportFn: function () {
            var type = app.getUrl('type') || 1;
            $.get(app.baseUrl + '/city/common/sport', {type:type}, function (data) {
                /*运动类型/个人认证和排序的接口*/
                //console.log(data, 'sportSort是排序,sportType是运动类型');
                if(data.result == 0){
                    data.data.docWidth = docW;
                    app.getId('sportCon', data, sportWrap);
                }
            });
        },
        sortClick: function () {
            $(".sort_tpl").delegate('.sort_more', 'click', function () {
                /*点击“更多”的事件*/
                var that = $(this);
                var hHeight = $(that).siblings('.sort_ul').css('height');
                sortBall.sortMore(that,hHeight);
            });
            $(".sort_tpl").delegate('.cityClick li', 'click', function () {
                /*获取参数传给数据列表接口*/
                var classLi = $(".cityClick li");
                var cLi = classLi.index(this);
                cityCommon.hoverFn(cLi,classLi);

            });
            $(".sort_tpl").delegate('.sortClick li', 'click', function () {
                /*获取参数传给数据列表接口*/
                var classLi = $(".sortClick li");
                var cLi = classLi.index(this);
                cityCommon.hoverFn(cLi,classLi);

            });
            $(".sort_tpl").delegate('.orderClick li', 'click', function () {
                /*获取参数传给数据列表接口*/
                var classLi = $(".orderClick li");
                var cLi = classLi.index(this);
                cityCommon.hoverFn(cLi,classLi);
            });

        },
        loadTpl: function(){
            $(".sort_tpl").load('/resources/tpl/fightball/sort.html',function() {
                sortBall.cityFn();
                sortBall.sportFn();
            });
        },
    };
    $(function () {
        sortBall.sortClick();
        sortBall.loadTpl();

    });
    return sortBall;


});

























