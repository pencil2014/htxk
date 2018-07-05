var trecruit = {
    // 拖动条
    dragBar:function(){
        var ageSet={
            from:$("#range_age").attr('data-value').split(';')[0],
            to:$("#range_age").attr('data-value').split(';')[1],
            postfix:$("#range_age").attr('data-suffix')
        };
        var workSet={
            to:$("#range_work").attr('data-value'),
            postfix:$("#range_work").attr('data-suffix')
        };
        var ageBegin=$("#range_age").val().split(';')[0];
        var age=$("#range_age").val().split(';')[0];
        $("#range_age").ionRangeSlider({
            min: 16,
            max: 50,
            from:ageSet.from,
            to: ageSet.to,
            type: 'double',//设置类型
            step: 1,
            prefix: "",//设置数值前缀
            postfix: ageSet.postfix,
            prettify: true,
            hasGrid: false
        });
        $("#range_work").ionRangeSlider({
            min: 0,
            max: 100,
            from:0,
            to: workSet.to,
            type: 'double',//设置类型
            step: 1,
            prefix: "",//设置数值前缀
            postfix: workSet.postfix,
            prettify: true,
            hasGrid: false
        });
    },
    //球员数量控制
    couemt:function () {
        var $x = 0;
        $(".pelop_box span").on("click",function () {
            $y = $(this).prev().html();
            $x = parseInt($y) + 1;
            $(this).prev().html($x);
            if($x>=5){
                $(this).prev().html(5)
            }
        });

        $(".pelop_box em").on("click",function () {
            $y = $(this).prev().prev().html();
            $x = parseInt($y) - 1;
            $(this).prev().prev().html($x);
            if($x<=0){
                $(this).prev().prev().html(0)
            }
        });
    },
    inputbox:function () {
        $('div[name="compet_rbttwo"]').inputbox();
        $('div[name=timeplantwo_select]').inputbox({
            width:110
        })
    },
    tpush:function () {


    },
    init:function () {
        trecruit.couemt();
        trecruit.inputbox();
        trecruit.tpush();
        trecruit.dragBar();
    }
};
(function () {
    trecruit.init();
})();