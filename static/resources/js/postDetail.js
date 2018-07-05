var postDetail={
	postShare:function(){
		window._bd_share_config = {
			common : {
				bdText : '自定义分享内容',	
				bdDesc : '自定义分享摘要',	
				bdUrl : 'www.baidu.com', 	
				bdPic : '../images/graphic_testimg.jpg'
			},
			share : [{
				"bdSize" : 32
			}]
		}
		document.getElementsByTagName(('head')[0]||body) && ((document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')).appendChild(document.createElement('script')).src='/static/api/js/share.js?cdnversion='+~(-new Date()/36e5))
		// with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion='+~(-new Date()/36e5)];
	},
	focusTab:function(){
		$(".focus_btn").click(function(){
	    	var url = $(this).attr("hhly-url");
	    	var that = this;
	    	//提交数据
	    	$.hhly.ajax({
	    		url:url,
	    		success:function(obj){
	    			if(obj.retCode === 1 || obj.retCode === 3){
	    				layer.open({
	    					area: '440px',
	    				  content: '<span class="at_span warn"></span><span class="dialog_tips">'+obj.retMsg+'</span>',
	    				  scrollbar: false
	    				});
	    			}else if(obj.retCode === 2 && obj.operation == 'add'){
	    				$(that).attr("hhly-url",url.replace("add","del"));
	    				$(that).addClass("already_focus").text("已关注");
	    			}else if(obj.retCode === 2 && obj.operation == 'del'){
	    				$(that).attr("hhly-url",url.replace("del","add"));
	    				$(that).removeClass("already_focus").text("+ 关注");
	    			}
	    		}
	    	});
		});
		$(".post_praise").click(function(){
	    	var url = $(this).attr("hhly-url");
	    	var that = this;
	    	//提交数据
	    	$.hhly.ajax({
	    		url:url,
	    		success:function(obj){
	    			if(obj.retCode === 1 || obj.retCode === 3){
	    				layer.open({
	    					area: '440px',
	    				  content: '<span class="at_span warn"></span><span class="dialog_tips">'+obj.retMsg+'</span>',
	    				  scrollbar: false
	    				});
	    			}else if(obj.retCode === 2 && obj.operation == 'add'){
	    				$(that).attr("hhly-url",url.replace("add","del"));
	    				$(that).children('span').text(parseInt($(that).children('span').text())+1);
	    			}else if(obj.retCode === 2 && obj.operation == 'del'){
	    				$(that).attr("hhly-url",url.replace("del","add"));
	    				$(that).children('span').text(parseInt($(that).children('span').text())-1);
	    			}
	    		}
	    	});
		});
		$('.addMore').off('click').on('click',function(){
			var status = $(this).attr('hhly-status');
			var page = $(this).attr('hhly-page');
			var feedId = $(this).attr('hhly-id');
			var that = this;
			if(status && status == "true" && page){
				$.ajax({
					url:'/personal/index/getfeedcommont',
					type: "post",
					dataType: "json",
					data: {page:parseInt(page)+1,feedId:feedId},
					success:function(json){
						var html = '';
						if(json && json.list){
							$(json.list).each(function(index,element){
								var icon = '/resources/images/sportman_headicon.jpg';
								if(element.iconUrl){
									icon = element.iconUrl;
								}
								html += '<li>'+
											'<div class="comments_head fl">'+
												'<img src="'+icon+'">'+
											'</div>'+
											'<div class="comments_content fl">'+
												'<p>'+
													'<span class="fl">'+element.userInfoBasicRespVO.nickName+'</span>'+
													'<span class="fr">'+dateTimeUtil.timeFormat(element.createTime)+'</span>'+
													'<div class="clearx"></div>'+
												'</p>'+
												'<strong>'+element.content+'</strong>'+
												'<div class="post_praise fr">'+
													'<i></i>'+
													'<span>'+element.diggCount+'</span>'+
												'</div>'+
												'<div class="clearx"></div>'+
											'</div>'+
											'<div class="clearx"></div>'+
										'</li>';
							});
							$('.post_comments_list').append(html);
							$(that).attr('hhly-page',json.page);
							$(that).attr('hhly-status',json.hasNextPage);
						}
					}
				});
			}
		});
	}
};
$(function(){
	postDetail.postShare();
	postDetail.focusTab();
})