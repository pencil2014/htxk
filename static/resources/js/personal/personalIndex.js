$(function(){
	$.commonTabs(".personal_content_title","li",".personal_content_list","active");
	$(".foucs_warp").click(function (argument) {
		if($(this).hasClass('status')){
			$(this).removeClass('status');
		}else{
			$(this).addClass('status')
		}
	})
	//服务鼠标滑动效果
	$(".unapprove .btn").mouseenter(function () {
		$(this).hide()
			.siblings().show()
    });
    $(".unapprove .mbtn").mouseleave(function () {
        $(this).hide()
            .siblings().show()
    });
    var loading = false;
    $('.personal_content_title li').on('click',function(){
    	loading = true;
		var url = $(this).attr("hhly-url");
		if(url && loading){
			$.get(url,{},function(data){
				$("#manage_contents").html(data);
				loading = false;
			},"html");
		}
	});
    $('.followClick').off('click').on('click',function(){
    	var url = $(this).attr("hhly-url");
    	var that = this;
    	//提交数据
    	$.hhly.ajax({
    		url:url,
    		success:function(obj){
    			if(obj.retCode === 1 || obj.retCode === 3){
    				layer.open({
                        area: '440px',
                        content: '<span class="at_span warn"></span><span class="dialog_tips">' + obj.retMsg + '</span>',
                        scrollbar: false
    				});
    			}else if(obj.retCode === 2 && obj.operation == 'add'){
    				$(that).attr("hhly-url",url.replace("add","del"));
    				$(that).addClass("star_focus");
    				$(that).html("已关注");
    			}else if(obj.retCode === 2 && obj.operation == 'del'){
    				$(that).attr("hhly-url",url.replace("del","add"));
    				$(that).removeClass("star_focus");
    				$(that).html("+ 关注");
    			}
    		}
    	});
    });
    $('.personal_content_title li:first-child').click();
});