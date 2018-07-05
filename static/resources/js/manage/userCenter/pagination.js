(function () {
	$('.pages_list').off('click','.pageGo').on('click','.pageGo',function(){
		var page = $(this).attr('hhly-page');
		var url = $(this).attr('hhly-url');
		if(url){
			$.get(url,{page:page},function(data){
				$("#manage_contents").html(data);
			},"html");
		}
	});
	$('.pages_list').off('click','.skip_page').on('click','.skip_page',function(){
		if($('.newsGoPage').val().length>0){
			var page = $('.newsGoPage').val();
			var url = $(this).attr('hhly-url');
			if(url){
				$.get(url,{page:page},function(data){
					$("#manage_contents").html(data);
				},"html");
			}
		}
	});	
})();