var teamCommon = {	
		//头部球队关注
		teamFocus:function(){
			$(".team_attention").click(function(){
				SportIPModule.follow(this);
			});
		},
		//tab监听事件
		tabNav:function(){
			$(".mit_teamnav").find("li").click(function(){
				var url = $(this).find('a').attr("hhly-url");
				//请求数据，填充数据  //如果相同tab，不要请求
				if(!$(this).QhasClass("on")){	
					var that = $(this);
					var teamId = $("#orgId").val();
					var data = {"teamId":teamId};	
					$.hhly.ajax({
						url:url,
						data:data,
						dataType:'html',
						type:'GET',
						success:function(respData){
							$(".mit_content").html(respData);
							that.siblings('li').removeClass("on");
							that.addClass("on");
						}
					});
				}
			});
			//初始化加载新闻
			$(".mit_teamnav").find("a").eq(0).trigger("click");
		},
		init:function(){
			//tab监听事件
			this.tabNav();
			//球队关注事件监听
			this.teamFocus();
		}
};

$(function(){
	
	teamCommon.init();
})