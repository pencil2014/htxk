var SportIPModule = {		
	//点击"换一批",加载数据	
	loadData:function(){
		$("span[hhly-index='sportIP']").click(function(){
			var that = $(this);
			var url = that.attr("hhly-url");
			$.getJSON(url).done(function(data){
				SportIPModule.buildData(that,url,data);
				SportIPModule.focus();
			});
		});
	},
	//构建数据
	buildData:function(node,url,data){
		var content = "";
		for(var k=0;k<data.list.length;k++){
			var item = data.list[k];
			if(stringUtil.isNull(item.headerUrl)){
				item.headerUrl = '/resources/images/default_photo.jpg';
			}
			if(stringUtil.isNull(item.ipName)){
				item.ipName = '';
			}	
			
			if(item.isFollow == false){
				content += "<li>" +
							"<a class='star_user_head fl' href='/common/center?route=" + item.ipType + "&id=" + item.ipId + "' target='_blank'><img width='100%' title='" + item.ipName + "'  src='" + item.headerUrl + "'></a>" +
							"<div class='star_user_name fl'><b>" + item.ipName + "</b><span><i>" + numberUtil.number_format(item.followNum) + "</i>" + msgUtil.getTxt('common_fan') + "</span></div>" +
							"<div class='foucs_warp fr'><a href='javascript:;'  hhly-url='/collect/follow/add/" + item.ipId + "'>+ " + msgUtil.getTxt('common_follow') + "</a></div>" +
							"<div class='clearx'></div>" +
							"</li>";
			}else{
				content += "<li>" +
							"<a class='star_user_head fl' href='/common/center?route=" + item.ipType + "&id=" + item.ipId + "' target='_blank'><img width='100%' title='" + item.ipName + "' src='" + item.headerUrl + "'></a>" +
							"<div class='star_user_name fl'><b>" + item.ipName + "</b><span><i>" + numberUtil.number_format(item.followNum) + "</i>" + msgUtil.getTxt('common_fan') + "</span></div>" +
							"<div class='foucs_warp fr'><a href='javascript:;' class='star_focus' hhly-url='/collect/follow/del/" + item.ipId + "'>" + msgUtil.getTxt('common_followed') + "</a></div>" +
							"<div class='clearx'></div>" +
							"</li>";
			}
		}
		//如果有下一页，page就是当前页码加一；如果没有下一页，则从第一页开始
		$(node).attr("hhly-url",url.replace(new RegExp("\\d+"),data.hasNextPage?(data.page + 1):1));
		$(node).parent().parent().next("ul").html(content);
	},
	// 新闻详情页面
	newsDetail:function(){
		//关注，取消关注监听事件
		$("#recommend").find("a").click(function(){
			SportIPModule.follow(this);
		});
	},
	// 视频播放页面
	play:function(){
		//视频作者关注事件
		$("#recommend").find("a").click(function(){
			var span = $(this).prev("span").prev("span");
			var num = span.text();
			var focus = 0;
			if($(this).hasClass("star_focus")){
				focus = parseInt(num) - 1;
			}else{
				focus =parseInt(num) + 1;
			}
			span.text(Math.abs(focus));
			SportIPModule.follow(this);
		});
	},
	//添加,取消关注
	focus:function(){
		$(".foucs_warp").off('click').on('click','a',function(){
			SportIPModule.follow(this);
		})
	},
	//触发关注事件
	follow:function(e){
		var url = $(e).attr("hhly-url");
		var that = $(e);
		//提交数据
		$.hhly.ajax({
			url:url,
			success:function(obj){
				if(obj.result == '2001'){
					/*layer.open({
						title:'温馨提示',
					  content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">未登录，不能关注！</span></div>',
					  scrollbar: false,
					  move: false,
					  area:['440px'],
					  yes:function(index,lay){
						  window.location.href='/member/login';
					  }
					});*/
				}else if(obj.result == '0' && obj.data == 'add'){
					that.attr("hhly-url",url.replace("add","del"));
					that.addClass("star_focus");
					that.html(msgUtil.getTxt('common_followed'));
				}else if(obj.result == '0' && obj.data == 'del'){
					that.attr("hhly-url",url.replace("del","add"));
					that.removeClass("star_focus");
					that.html("+ " + msgUtil.getTxt('common_follow'));
				}else{
					layer.open({
						area: '440px',
						content: '<span class="at_span warn"></span><span class="dialog_tips">' + obj.msg + '</span>',
						scrollbar: false
					});
				}
			}
		});
	},
	//首页调用的方法
	index:function(){
		SportIPModule.loadData();
		SportIPModule.focus();
	}
};
