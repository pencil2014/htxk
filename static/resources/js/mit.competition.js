var competition={
	userSelect:function(){
		$(document).click(function(){
			$('.select_list').slideUp('fast');
		});
		$('.select_text').click(function(){
			event.stopPropagation();
			$('.select_list').slideUp('fast');
			$(this).siblings('.select_list').slideToggle('fast');
		});
		$('.select_list li').click(function(){
			var value=$(this).attr('value');
			var text=$(this).text();
			$(this).parents('.select_list').siblings('.select_text').attr('value',value).find('span').text(text);
			$(this).parents('.select_list').slideToggle('fast');
		});
	},
	scrollInt:function(){
		$('.battle_container').panel({iWheelStep:32});
	}
};
$(function(){
	competition.userSelect();
	competition.scrollInt();
});