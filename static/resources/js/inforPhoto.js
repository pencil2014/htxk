$(function(){
	$('.image_banner').css({
		'display': 'none'
	});
	imageInfor.loadImg();
	imageInfor.prev();
	imageInfor.next();
	imageInfor.collect();
	imageInfor.creator();
	imageInfor.share();
})
var imageInfor={
	slide : function(){
			var tn1 = $('.mygallery').tn3({
				imageClick:"fullscreen",
				image:{
					maxZoom:1.5,
					crop:true,
					clickEvent:"dblclick"
				},
				autoplay:true,
				mouseWheel:false,
				autohideControls:false,
				responsive:true
			});
	},
	// 图片预加载
	loadImg:function(){
		var imgObj=[];
		var imageBox=$('.image_banner .tn3 li').find('a');
		var totalimages = imageBox.length-1;
		imageBox.each(function(index, el) {
			imgObj[index]=$(this).attr('href');
			var loadedimages = 0;
			var img = new Image();
			img.src=imgObj[index];
			$(img).load(function() {
				if(index==totalimages){
					$('.image_banner').css({'display': 'block'});
					$('.small_images').css('display','block');
					imageInfor.slide();
				}
			});
		});
	},
	//数据收集
	collect : function(){
		var newsId = $("#articleId").val();
		$.post("/collect/news", {"newsId":newsId,"operation":"click"});
	},
	//上一组图片资讯
	prev : function(){
		var newsId = $("#articleId").val();
		$.getJSON("/news/prev", {"newsId":newsId,"infoType":2}, function(data){
			if(data.articleId != null){			
				var nodes = '<a href="' + data.url + '" class="prev_grounp_box">' +
				'   <img src="' + data.coverUrl[0] + '">' +
				'</a>' +
				'<span class="prev_grounp_bgF"></span>' +
				'<span class="prev_grounp_bgS"></span>' +
				'<p>' + data.title + '</p>';
				$(".prev_grounp").html(nodes);	
			}
			
		});
	},
	//下一组图片资讯
	next : function(){
		var newsId = $("#articleId").val();
		$.getJSON("/news/next", {"newsId":newsId,"infoType":2}, function(data){
			if(data.articleId != null){
			 var nodes = '<a href="' + data.url + '" class="next_grounp_box">' +
						 '   <img src="' + data.coverUrl[0] + '">' +
						 '</a>' +
						 '<span class="prev_grounp_bgF"></span>' +
						 '<span class="prev_grounp_bgS"></span>' +
						 '<p>' + data.title + '</p>';
			 	$(".next_grounp").html(nodes);
			} 
		});
	},
	share : function(){
		//分享插件使用
		var shareTitle='#'+$('.image_content h3.pr p').text()+'#';
		var shareUrl=window.location.href;
		var sharePic=$('.image_banner .tn3 li').find('a').first().attr('href');
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
		//with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion='+~(-new Date()/36e5)];
	},
	creator : function(){
		var creatorId = $("#creatorId").val();//作者ID
		var params = {"creatorId":creatorId};
		//ajax提交数据
		$.hhly.ajax({
    			url:"/news/author",
    			data:params,
    			success:function(data){
	    			var userInfo = data['userInfo'];
	    			var isFollowed = data['isFollowed'];
	    			var ipAuthCate = data['ipAuthCate'];
	    			var imgTxt = "";
	    			var content = "";
	    			if(stringUtil.isNull(userInfo.iconUrl)){
	    				userInfo.iconUrl = '/resources/images/default_photo.jpg';
	    			}
	    			if(ipAuthCate.pcImgTxtUrl){
	    				imgTxt = "<div class='approve_show_icon'><img src='" + ipAuthCate.pcImgTxtUrl + "' height='100%' /></div>";
	    			}
	    			if(isFollowed == false){				
	    				content =   '<li class="image_star">'+
	    							'	<i class="fl"><a href="/common/center?route=' + userInfo.authType + '&id=' + userInfo.userId +'" target="_blank"><img src="' + userInfo.iconUrl + '" width="100%"></a></i>'+
				    				'	<span class="fl">' + userInfo.nickName + '</span>' + imgTxt + 
				    				'</li>'+
				    				'<li class="image_foucs">'+
				    				'	<a href="javascript:;" hhly-url="/collect/follow/add/' + userInfo.userId + '">+ 关注</a>'+
				    				'</li>';
	    			}else{
	    				content =   '<li class="image_star">'+
	    							'	<i class="fl"><a href="/common/center?route=' + userInfo.authType + '&id=' + userInfo.userId +'" target="_blank"><img src="' + userInfo.iconUrl + '" width="100%"></a></i>'+
	    							'	<span class="fl">' + userInfo.nickName + '</span>'+ imgTxt + 
				    				'</li>'+
				    				'<li class="image_foucs">'+
				    				'	<a class="star_focus" href="javascript:;" hhly-url="/collect/follow/del/' + userInfo.userId + '">已关注</a>'+
				    				'</li>';
	    				
	    			}
	    			$(".image_title").prepend(content);	
	    			//关注监听
	    			$(".image_title").find("a").click(function(){
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