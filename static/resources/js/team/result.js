$(".mit_content").on('click','.amidithion_option_box p',function () {
	var e=arguments.callee.caller.arguments[0]||event;
	if (e && e.stopPropagation) {
        e.stopPropagation();
    } else if (window.event) {
        window.event.cancelBubble = true;
    }
    $(this).parent().siblings().children().next().slideUp(50)
    $(this).next().slideToggle(50);
});

$(".mit_content").on('click','.amidithion_option_box ul li',function () {
    $(this).parent().slideUp(50);
    
});


$(document).click(function(){
    $(".amidithion_option_box ul").slideUp(50);
});
