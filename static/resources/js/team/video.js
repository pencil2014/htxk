var BasicVideo = {
		//视频数据拼接
		getVideoContent : function(data){
			var content = "";
			for(var k=0;k<data.list.length;k++){
				var item = data.list[k];
				var _class = "class='fl'";
				if((k+1)%5 == 0){
					_class = "class='fl hide'";
				}
				content += "<li " + _class + ">" +
								"<a href='javascript:;'>" +
									"<div class='video_img '>" +
										"<img src='" + item.imgUrl+ "'>" +
										"<b class='bg'></b>" +
										"<i class='qq'></i>" +
										"<strong class='play'></strong>" +
										"<div class='video_bottm'></div>" +
										"<span class='video_text'>" + numberUtil.number_format(item.playCount) + "</span>" +
									"</div>" +
									"<span class='video_list_t play_active'>" + item.videoName + "</span>" +
									"<span class='fl data'>" + item.createTimeFormat + "</span>" +
									"<div class='type fr'>" +
										"<i class='fl'></i>" +
										"<span class='fl'>" + item.cateName + "</span>" +
									"</div>" + 
								"</a>" +
							"</li>";
			}
			content += "<div class='clearx'></div>";
			return content;
		}
};

$(function(){
	//点击更多
	$(".more_videos").click(function(){
		var that = $(this);
		var container = $(".video_list");	
		var teamId = $("#orgId").val();
		var url = container.attr("hhly-url");
		var page = container.attr("hhly-next-page");
		var rows = container.attr("hhly-page-size");
		$.getJSON(url,{"page":page,"rows":rows,"teamId":teamId},function(data){	
			var content = BasicVideo.getVideoContent(data);
			if(!data.hasNextPage){
				that.hide();
			}
			container.attr("hhly-next-page",data.page + 1).attr("hhly-page-size",data.rows).attr("hhly-has-page",data.hasNextPage).append(content);
		});
	});
});
