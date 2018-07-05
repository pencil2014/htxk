define(['jquery','app'],function($,app){
    var type = app.getUrl('type');
    var nav = {
        listLoad: function () {
            //var url = app.baseUrl + '/city/common/banner';
            var hhly_city = $(".hhly_areaId").attr('hhly-areaId') || 11959;
            $.get(app.baseUrl + '/city/common/banner',{areaId:hhly_city},function(data){
                /*导航列表的接口*/
                if(data.result == 0){
                    //console.log(data,'导航列表的接口');
                    data.data.dictArea.type = type;
                    localStorage.setItem("areaId", data.data.dictArea.areaId);
                    app.getId('navListCon',data,navListWrap);
                }
            });
        },
        loadTpl:function(){
            if(app.showNav){
                $(".nav_tpl").load( '/resources/tpl/fightball/nav.html',function(){
                    nav.listLoad();
                });

            }

        },
        navClick:function(){
            $('.nav_tpl').delegate('.mit_link a','click',function(){
                var typeA = $('.mit_link a').attr('type');
                console.log(type);

            });
        }

    };
    $(function(){
        nav.loadTpl();
    });




});


