$(function(){
	newsDetail.share();
	newsDetail.creator();
	newsDetail.loadHot();
	newsDetail.collect();
	//newsDetail.obtain();
	//newsDetail.digg();第一期不做点赞
	
});
var newsDetail = {	
		//发送ajax请求，加载热门文章数据
		loadHot : function(){
			$.ajax({ 
		        type: "POST",
		        url: "/news/hot", 
		        data: "rows=10",
		        dataType: "json",
		        success: function (data) {
		        	if(data && data.data){
						data = data.data
					}
		    		var content = '';
		    		for(var i = 0;i<data.length;i++){
		    			content += '<li><a target="_blank" href="' + data[i].url + '"><label class="list_dot">▪</label><span>' + data[i].title + '</span></a></li>';	
		    		}
		        	$('.hot_list').children('ul').append(content);//填充数据
		        }
			});
		},	
		//数据收集
		collect : function(){
			var newsId = $("#articleId").val();
			$.post("/collect/news", {"newsId":newsId,"operation":"click"});	
		},
		//获取点赞量
		obtain : function(){

		},
		//点赞
		digg : function(){
			$(".praise").click(function(){				
				var newsId = $("#articleId").val();
				var that = this;
				$.post("/collect/news/digg", {"newsId":newsId,"operation":"digg"},function(data){
					$(that).find("span").text(parseInt($(that).find("span").text())+1);
				});	
			});	
		},
		share : function(){
			//分享插件使用
			var shareTitle='#'+$('.content_c #articleId').next().text()+'#';
			var shareUrl=window.location.href;
			var sharePic=$('.content_c_text ').find('img').first().attr('src');
			window._bd_share_config = {
				"common" : {
					"bdSnsKey" : {'bds_tsina':' 18129803273','popup_sqq':'468642723','bds_weixin':'htxk-open@13322.com','bds_qzone':'468642723'},
					"bdDesc": shareTitle,
					"bdText": shareTitle,
					"bdPic": sharePic,
					"bdUrl": shareUrl,
					"bdStyle" : "0",
					"bdSize" : "16"
				},
				share : [{
					"bdSize" : 32
				}]
			}
			document.getElementsByTagName(('head')[0]||body) && ((document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')).appendChild(document.createElement('script')).src='/static/api/js/share.js?cdnversion='+~(-new Date()/36e5))
			// with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion='+~(-new Date()/36e5)];		
		},
		creator : function(){
			var creatorId = $("#creatorId").val();//作者ID
			var params = {"creatorId":creatorId};
			//ajax提交数据
			$.hhly.ajax({
	    			url:"/news/author",
	    			data:params,
	    			success:function(data){
	    				data = data.data
		    			var userInfo = data['userInfo'];
		    			var isFollowed = data['isFollowed'];
		    			var ipAuthCate = data['ipAuthCate'];
		    			if (userInfo === undefined || isFollowed === undefined || ipAuthCate ===undefined) {
		    				return false
		    			}
		    			var imgTxt = "";
		    			var content = "";
		    			if(stringUtil.isNull(userInfo.iconUrl)){
		    				userInfo.iconUrl = '/resources/images/default_photo.jpg';
		    			}
		    			if(stringUtil.isNull(userInfo.intro)){
		    				userInfo.intro = '';
		    			}
		    			if(ipAuthCate){
		    				imgTxt = "<div class='approve_show_icon'><img src='" + ipAuthCate.pcImgTxtUrl + "' height='100%' /></div>";
		    			}
		    			if(isFollowed == false){				
		    				content =   '<div class="star_head fl">'+
		    							'		<a href="/common/center?route=' + userInfo.authType + '&id=' + userInfo.userId +'" target="_blank"><img src="' + userInfo.iconUrl + '" width="100%"></a>'+
		    							'</div>'+
		    							'<div class="star_name fl">'+
		    							'	<span title="'+userInfo.nickName+'">' + userInfo.nickName + '</span>' + imgTxt + 
		    							'	<br /><a href="javascript:;" hhly-url="/collect/follow/add/' + userInfo.userId + '">+ 关注</a>'+
		    							'</div>'+
		    							'<div class="clearx"></div>'+
		    							'<p class="introduc">'+ userInfo.intro + '</p>';
		    			}else{
		    				content =   '<div class="star_head fl">'+
		    							'		<a href="/common/center?route=' + userInfo.authType + '&id=' + userInfo.userId +'" target="_blank"><img src="' + userInfo.iconUrl + '" width="100%"></a>'+
		    							'</div>'+
		    							'<div class="star_name fl">'+
		    							'	<span>' + userInfo.nickName + '</span>' + imgTxt + 
		    							'	<a class="star_focus" href="javascript:;" hhly-url="/collect/follow/del/' + userInfo.userId + '">已关注</a>'+
		    							'</div>'+
		    							'<div class="clearx"></div>'+
		    							'<p class="introduc">'+ userInfo.intro + '</p>';
		    				
		    			}
		    			$(".star").append(content);	
		    			//关注监听
		    			$(".star").find("a").click(function(){
		    				var that = $(this);
		    				var url = that.attr("hhly-url");
		    				//提交数据
		    				$.hhly.ajax({
		    					url:url,
		    					success:function(obj){
		    						if(obj.result == '2001'){
										layer.open({
											title:'温馨提示',
										  content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">未登录，不能关注！</span></div>',
										  scrollbar: false,
										  move: false,
										  area:['440px'],
										  yes:function(index,lay){
											  window.location.href='/member/login';
										  }
										});
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
		    			});		
		    		}
    		});
		}
}