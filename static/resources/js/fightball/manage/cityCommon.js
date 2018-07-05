define(['jquery','app','template','sort','layer','nav','blockUI'],function($,app,template,sort,layer,nav,blockUI){
    var c_common = {
        changeMoreDate:{
            '1':{},
            '2':{},
            '3':{}
        },
        blockFn:function(){
            $.blockUI({ message: "<h1>正在请求数据...</h1>" });
        },
        appendMore: function (url,param,moreCon,moreWrap,that) {
            /*点击"更多"的函数事件
            * url 是接口地址
            * param 是接口地址的参数
            * moreCon 是数据页面的id
            * moreWrap 是数据插入的id
            * that 是当前的元素
            */
            //c_common.blockFn();
            $.get(url, param, function (data,status) {
                /*数据列表的"更多"接口,more*/
                //console.log(data, '数据列表的"更多"接口,more');
                if(status == 'success'){
                    //$.unblockUI();
                    if(data.result == 0){
                        var html = template(moreCon, data);
                        $(moreWrap).append(html);
                        // console.log(data.data.list.length,'>>>> data.data.list.length的长度值');
                        if(data.data.page >= data.data.pages){
                            if(data.data.list.length<=10){
                                $(that).removeClass('moreClick');
                                $(that).text('没有更多了');
                                $(that).css('cursor','default');
                            }
                        };
                    }

                }

            });
        },
        changeTime: function (url,param,sideCon,sideWrap) {
            /*点击"周,月,总榜"的函数事件
            *url 是接口地址
            * param 是接口地址的参数
            * sideCon 是数据页面的id
            * sideWrap 是数据插入的id
            */
            if((JSON.stringify(c_common.changeMoreDate[param.type])=='{}')){
                //判断本地是否有缓存到有数据，如果没有则拉取ajax，否则就用本地缓存到的数据渲染
                //c_common.blockFn();
                //console.log(param.type);
                $.get(url, param, function (data,status) {
                    c_common.changeMoreDate[param.type] = data;
                   //console.log(c_common.changeMoreDate,"推荐数据列表的 周,月,总榜接口,more");
                    if(status == 'success'){
                        //$.unblockUI();
                        if(c_common.changeMoreDate[param.type].result == 0){
                            app.getId(sideCon, c_common.changeMoreDate[param.type], sideWrap);
                        }
                    }
                });
            }else{
                if(c_common.changeMoreDate[param.type].result == 0){
                    app.getId(sideCon, c_common.changeMoreDate[param.type], sideWrap);
                }
            }
        },
        changeMore:function(url,param,sideCon,sideWrap,that){
            /*点击"换一批"的函数事件
             *url 是接口地址
             * param 是接口地址的参数
             * sideCon 是数据页面的id
             * sideWrap 是数据插入的id
             * that 是当前的元素
             */
            //c_common.blockFn();
            $.get(url, param, function (data,status) {
                if(status == 'success'){
                    //$.unblockUI();
                    if(data.result == 0){
                        //console.log(data,"推荐数据列表的"换一批"接口,more");
                        app.getId(sideCon, data, sideWrap);
                        if(data.data.hasNextPage == false){
                            $(that).removeClass('changeClick');
                            $(that).css('cursor','default');
                        };
                    }
                }
            });
        },
        commonClick: function () {
            /*
            *点击关注的函数事件
            * opt +关注：1，相互关注：2，取消关注：3
            */
            $(".mod_wrap").delegate('.followClick','click',function(){
                var userId = $(this).attr("userid"),
                    that = this;
                    opt = $(this).attr('opt'),
                    f_parm = {
                        opt:opt,
                        followerId:userId
                    };
                $.post(app.baseUrl +'/city/common/follow',f_parm, function (data) {
                    var data = JSON.parse(data);
                    if(data.result == '2001'){
                        layer.msg(data.msg);
                    }else if(data.result == '2'){
                        layer.msg(data.msg);
                    }else if(data.result == '0'){
                        $(that).text('已关注').removeClass('btn_return').addClass('btn_focus');
                        $(that).removeClass('followClick');
                    }
                    //console.log(data,'关注接口');
                });
            });
        },
        hoverFn: function (cLi, classLi) {
            /*搜索条件给当前条件添加选中样式*/
            $(classLi).removeClass('modHover');
            $(classLi).eq(cLi).addClass('modHover');
        },
        windowHeight:function(){
            //页面的最小高度值
            var wH = $(window).height(),
                navH = $(".nav_tpl").outerHeight() || 60,
                footH = $(".footer-wrap").outerHeight() || 124,
                navT = parseInt($(".mit_nav").css('marginBottom') || 40);
                footT = parseInt($(".footer-wrap").css('marginTop') || 20);

            conH = wH - navH - footH - navT - footT;
            $(".mod_wrap").css('minHeight',conH);

        },
    };

$(function(){
    c_common.commonClick();
    c_common.windowHeight();
    //c_common.loadShow();
});
    return c_common;

});
