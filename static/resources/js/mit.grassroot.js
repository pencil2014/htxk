var grass={
	// table切换
	tableSlide:function(cwrap,cbox,cbtn){
		$(cwrap).on('click',cbtn,function(){
			var index=$(this).index();
			$(this).addClass('on').siblings().removeClass('on');
			$(this).parents(cwrap).siblings(cbox).find('.table_box').eq(index).removeClass('hidden').siblings().addClass('hidden');
		});
	},
	//订阅处理
	subscribe:function(){
		$('.rank_listcontainer').on('click','.rank_btn',function(){
			if($(this).hasClass('on')){
				$(this).removeClass('on');
			}else{
				$(this).addClass('on');
			}
		})
	},
	init:function(){
		this.tableSlide('.table_menu','.table_contentbox','span');
		this.subscribe();
	}
};
$(function(){
	grass.init();
});
