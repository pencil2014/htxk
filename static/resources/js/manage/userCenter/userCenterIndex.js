var PersonalIndex = {
	liInit:function(){
		$('.l_per_menu .personal_li').on('click',function(){
			var item = $(this).index();
			$(".l_per_con").removeClass("liHover");
			$(".li_my_message1 li,.li_my_message2 li").removeClass("liHover active");
			$(".l_per_con").eq(item).addClass("liHover");
		});
		$(".li_my_message1 li").on('click',function(){
			
			var item = $(this).index();
			$(".l_per_con").removeClass("liHover");
			$(".li_my_message1 li,.li_my_message2 li").removeClass("liHover active");
			$(".li_my_message1 li").eq(item).addClass("liHover");

		});
		$(".li_my_message2 li").on('click',function(){
			var item = $(this).index();
			$(".l_per_con").removeClass("liHover");
			$(".li_my_message2 li,.li_my_message1 li").removeClass("liHover active");
			$(".li_my_message2 li").eq(item).addClass("liHover");

		});
		$(".l_flag").on('click',function(){
			$(".l_per_con").removeClass("liHover");
			$(".li_my_message1 li,.li_my_message2 li").removeClass("liHover active");
			
		});
		$(".icon_em").hide();
//		$('.name_edit').click();
	}
}

$(function(){
	PersonalIndex.liInit();
});


