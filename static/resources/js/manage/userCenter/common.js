var personal={
	slideToggle:function(){
		var oUls= $(".team_manage_btn").parent("li").find("ul");
		var oI=$(".team_manage_btn").parent("li").find("i")
		$(".team_manage_btn").click(function(){
			oUls.stop().slideUp();
			$(this).parent("li").find("ul").stop().slideDown();
			$(oI).removeClass("slider_up");
			$(this).children("i").addClass("slider_up");
		})
		$(".manage_list_btn").click(function(){
			oUls.stop().slideUp();
			setTimeout(function(){
				$(oI).removeClass("slider_up");
			},100)
		})
	},
	// 发布渲染
	publishMenu:function(){
		$('.phblish_btn').on('click','li',function(){
			if(!$('.middle>.manage_r').hasClass('publish')){
				window.location.href=$(this).find('a').attr('data-href');
			}
		});
	},
	init:function(){
		this.slideToggle();
		this.publishMenu();
	}
}
$(function(){
	personal.init();
})