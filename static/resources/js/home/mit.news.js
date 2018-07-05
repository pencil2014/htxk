$(function(){
	//tab切换监听
	$(".infor_subtitle").children("span").click(function(){
		//请求数据，填充数据  //如果相同tab，不要请求
		if(!$(this).hasClass("on")){			
			$(this).siblings('span').removeClass("on");//兄弟节点删除样式
			$(this).addClass("on");	// 自己添加样式		
			var newsBox = $(".news_box").eq($(this).index());//寻找对应的内容div			
			newsBox.siblings('div').hide();//兄弟节点隐藏
			newsBox.show();//自己显示		
			var url = newsBox.attr("hhly-url");
			var page = newsBox.attr("hhly-next-page");
			var rows = newsBox.attr("hhly-page-size");
			
			//tab切换只第一次加载数据，后面只显示数据
			if(parseInt(page) == 1){			
				// ajax请求数据
				$.hhly.ajax({
					url:url,
					data:{"page":page,"rows":rows },
					success:function(data){
						var content = NewsItem.getNewsContent(data);//新闻数据拼接
						if(!data.hasNextPage){
							newsBox.children("div").eq(1).hide();//把更多的数据链接隐藏起来
						}	
						newsBox.attr("hhly-next-page",data.page + 1).attr("hhly-page-size",data.rows).attr("hhly-has-page",data.hasNextPage);
						newsBox.children("div").eq(0).append(content);//填充数据	
					}
				});	
			}
		}
	});
	//点击更多监听	
	$(".news_more").click(function(){		
		var newsBox = $(this).parent();//寻找对应的内容div
		var url = newsBox.attr("hhly-url");
		var page = newsBox.attr("hhly-next-page");
		var rows = newsBox.attr("hhly-page-size");
		var that = $(this);
		// ajax请求数据
		$.hhly.ajax({
			url:url,
			data:{"page":page,"rows":rows },
			success:function(data){
				var content = NewsItem.getNewsContent(data);//新闻数据拼接
				if(!data.hasNextPage){
					that.hide();//自己隐藏起来
				}	
				newsBox.attr("hhly-next-page",data.page + 1).attr("hhly-page-size",data.rows).attr("hhly-has-page",data.hasNextPage);
				newsBox.children("div").eq(0).append(content);//填充数据
			}	
		});		
	});
	//监听"换一批"按钮
	SportIPModule.loadData();
	SportIPModule.focus();
});
