var VideoModule = { 
	// 首页调用的方法		
	index : function(){
		//"换一批"监听事件
		$("span[hhly-index='video']").click(function(){
			var _this = $(this);	
			var url = _this.attr("hhly-url");
			$.getJSON(url).done(function(data){
				var content = VideoModule.build(data);
				//如果有下一页，page就是当前页码加一；如果没有下一页，则从第一页开始
				$(_this).attr("hhly-url",url.replace(new RegExp("\\d+"),data.hasNextPage?(data.page + 1):1));
				$(".hot_video_list").html(content);
				
			});	
			
		});
	},
	//视频播放页面
	play : function(){	
		var url = $(".hot_video_list").attr("hhly-url");
		$.getJSON(url).done(function(data){
			var content = VideoModule.build(data);
			$(".hot_video_list").html(content);
		});	
	},
	//数据收集
	collect : function(){
		var videoId = $("#videoId").val();
		$.post("/collect/video", {"videoId":videoId,"operation":"click"});
	},
	//热门榜单
	build : function(data){
		var content = "";
		for(var k=0;k<data.list.length;k++){
			var item = data.list[k];
			content += "<li>" +
						"<a href='/video/play/" + item.videoId + "' target='_blank'>" +
							"<div class='hot_video_cover fl'><img src='" + item.imgUrl + "' width='100%'></div>" +
								"<div class='hot_video_title fl'>" +
								"<span title='" + item.videoName + "'>" + item.videoName + "</span>" +
							"</div>" +
							"<div class='clearx'></div>" +
						"</a>" +
						"</li>";
		}
		return content;
	}
};


