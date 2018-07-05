$(function(){
	$(".news_more").click(function(){
		var container = $(this).prev();	
		var url = container.attr("hhly-url");
		var page = container.attr("hhly-next-page");
		var rows = container.attr("hhly-page-size");
		var teamId = $("#orgId").val();
		var _this = $(this);
		//如果有下一页数据，请求服务器
		$.getJSON(url, {"teamId":teamId,"page":page,"rows":rows }, function(data){
			var content = NewsItem.getNewsContent(data);//新闻数据拼接
			if(!data.hasNextPage){
				$(_this).hide();//没有更多的数据，自己隐藏起来
			}
			container.attr("hhly-next-page",data.page + 1).attr("hhly-page-size",data.rows).attr("hhly-has-page",data.hasNextPage).append(content);
		});
	});
	//加载同城球队，推荐球队
	SportIPModule.loadData();
	$("span[hhly-index='sportIP']").trigger("click");
});

