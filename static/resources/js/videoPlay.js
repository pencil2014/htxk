var video = {
	jIndex : 0,
	judgePrev : false,
	firstInt : false,
	videoTimer:'',
	// table切换
	tableSlide : function(cwrap, cbox, cbtn) {
		$(cwrap).off('click', cbtn).on('click',cbtn,function() {
			var index = $(this).index();
			$(this).addClass('on').siblings().removeClass('on');
			$(this).parents(cwrap).siblings(cbox).find('.table_box').eq(index).removeClass('hidden').siblings().addClass('hidden');
			$(this).parents(cwrap).siblings(cbox).find('.table_box').eq(index).scrollTop(0);
		});
	},
	sliderVideo : function() {
		var sliderball = $(".video_sidebox").sportTable({
			width : 780,
			height : 156,
			control : '.mit_slidebtn',
			during : 4000,
			speed : 800,
			callback : video.videoData
		});
	},
	videoData : function(offset, obj) {
		var page, container;
		if (obj.hasClass('next')) {
			video.jIndex = video.jIndex + 1;
			page = parseInt(obj.parents('#alllook').attr('hhly-next-page')) + 1;
		} else if (obj.hasClass('prev')) {
			video.jIndex = video.jIndex - 1;
			page = parseInt(obj.parents('#alllook').attr('hhly-next-page')) - 1;
			;
		}
		// 往后翻页
		if (video.jIndex === 5) {
			video.judgePrev = false;
			var url = obj.parents('#alllook').attr('hhly-url') + "?page="
					+ page + "&_t=" + new Date().getTime();
			container = obj.siblings('.video_sidebox');
			video.getData(url, container);
			video.jIndex = 0;
		}
		if (page == 0 && video.jIndex == 0) {
			$('.prev_slide').addClass('hidden');
		} else {
			$('.prev_slide').removeClass('hidden');
		}
		// 往前翻页
		if (video.jIndex === -1) {
			video.judgePrev = true;
			var url = obj.parents('#alllook').attr('hhly-url') + "?page="
					+ page + "&_t=" + new Date().getTime();
			container = obj.siblings('.video_sidebox');
			video.getData(url, container);
			video.jIndex = 4;
		}
	},
	getData : function(url, container) {
		$.getJSON(url, function(json) {
			var content = video.loadData(json);
			container.parents('#alllook').attr('hhly-next-page', json.page)
			var nowLi = container.find('ul li').eq(video.jIndex).clone();
			if (video.judgePrev) {
				nowLi = container.find('ul li').eq(video.jIndex - 2).clone();
			}
			container.find('ul li').remove();
			container.find('ul').append(nowLi);
			container.find('ul').append(content);
			if (video.firstInt) {
				container.find('ul li').remove();
				video.firstInt = false;
				container.find('ul').append(content);
				video.sliderVideo();
			}
			if (video.judgePrev) {
				container.find('ul').prepend(container.find('ul li').last());
				container.find('ul').prepend(container.find('ul li').last());
			}
			if (video.judgeMenu) {
				container.find('ul').prepend(container.find('ul li').last());
			}
		});
	},
	// 拼接数据
	loadData : function(data) {
		var list = data["list"];// 数据列表
		var content = "";
		if (list && list.length > 0) {
			var close = false;
			for (var k = 0; k < list.length; k++) {
				var item = list[k];
				var radom = parseInt(Math.random() * 100);
				if (k % 4 == 0) {
					content += '<li class="item"><div class="mit_videoitem"><dl>';
				}

				content += '<dd class="fl"><a href="/video/play/'
						+ item.videoId
						+ '"><div class="video_img "><img src="'
						+ item.imgUrl
						+ '" width="100%" /></div>'
						+ '<div class="video_list_t play_active"><span>'
						+ item.videoName
						+ '</span></div><div class="like_l_l_b"><div class="author fl"><i class="left"></i><span class="left">'
						+ item.nickName + '</span></div><div class="type fr">'
						+ '<i class="fl"></i><span class="fl">'
						+ item.cateName + '</span></div></div></a></dd>';
				if ((k + 1) % 4 == 0) {
					content += "</dl></div></li>";
					close = true;
				}
			}
			if (!close) {
				content += "</dl></div></li>";
			}
		}
		return content;
	},
	initSlideData : function() {
		url = $('#alllook').attr('hhly-url') + "?page=1&_t="
				+ new Date().getTime();
		container = $('#alllook').find('.video_sidebox');
		video.firstInt = true;
		video.getData(url, container);
		$('.prev_slide ').addClass('hidden');

	},
	videoListUp : function() {
		$('.video_retraction').click(function() {
			var bodyWidth=$("body").width();
			if ($(this).parent().hasClass('on')) {
				$(this).parents('.video_content_l').siblings('.video_content_r').show();
				$('.video_content_l').addClass('fl').width("66%");
				$(this).parent().removeClass('on');
			} else {
				$(this).parents('.video_content_l').siblings('.video_content_r').hide();
				$('.video_content_l').removeClass('fl').width("90%");
				$(this).parent().addClass('on');
			}
		});
		// if($(".vjs-control").click()){
		// 	//console.log(bodyWidth);
		// }
	},
	videoSlide : function() {
		$(".videotable_list  li.item")
				.click(
						function() {
							clearTimeout(video.videoTimer);
							$(".videotable_list  li.item")
									.removeClass("active")
							$(this).addClass("active")
							var videoId = $(this).attr("hhly-video-id");
							// 请求视频数据
							$
									.post(
											"/video/get",
											{
												"videoId" : videoId
											},
											function(data) {
												var videoVo = data["videoVo"];
												var userInfo = data["userInfo"];
												var isFollowed = data["isFollowed"];
												var followCount = data["followCount"];
												// 重置视频数据
												$('.video_title')
														.find('h2')
														.text(videoVo.videoName);
												$("#videoId").val(
														videoVo.videoId);
												videojs.options.flash.swf = "/resources/images/video-js.swf";
												var url = videoVo.videoUrl;
												$("#video_player").attr('src',
														url);
												var myPlayer = videojs("video_player"); // 初始化视频
												$("#video_player").show();
												myPlayer.src(url); // 重置video的src
												// myPlayer.load(url); // 使video重新加载
												/*$('.vjs-slider-handle').css({
													'left' : '0'
												});*/
												$('.vjs-play-progress').css({
													'width' : '0'
												});
												$('.vjs-load-progress').css({
													'width' : '0'
												});
												$('#video_player').addClass(
														'vjs-paused');
												// 重置用户数据
												var content = video.userInfo(
														isFollowed,
														followCount, userInfo);
												$(".recommend_l").html(content);
												SportIPModule.play();
											});
							$.post("/collect/video", {
								"videoId" : videoId,
								"operation" : "click"
							});// 监听点击事件
						});
	},
	userInfo : function(isFollowed, followCount, userInfo) {
		var content = "";
		if (stringUtil.isNull(userInfo.iconUrl)) {
			userInfo.iconUrl = '/resources/images/default_photo.jpg';
		}
		if (stringUtil.isNull(userInfo.intro)) {
			userInfo.intro = '';
		}
		if (isFollowed == true) {
			content = '<div class="star_head fl">' + '	<img src="'
					+ userInfo.iconUrl + '" width="100%" />' + '</div>'
					+ '<div class="star_recom fl">' + '	<strong>'
					+ userInfo.nickName + '</strong>' + '	<span>'
					+ userInfo.intro + '</span>' + '</div>'
					+ '<div class="star_fans fr">' + '	<span>'
					+ numberUtil.number_format(followCount)
					+ '</span><span>粉丝</span>'
					+ '	<a href="javascript:;" hhly-url="/collect/follow/del/'
					+ userInfo.userId + '" class="star_focus">已关注</a>'
					+ '</div>';
		} else {
			content = '<div class="star_head fl">' + '	<img src="'
					+ userInfo.iconUrl + '" width="100%" />' + '</div>'
					+ '<div class="star_recom fl">' + '	<strong>'
					+ userInfo.nickName + '</strong>' + '	<span>'
					+ userInfo.intro + '</span>' + '</div>'
					+ '<div class="star_fans fr">' + '	<span>'
					+ numberUtil.number_format(followCount)
					+ '</span><span>粉丝</span>'
					+ '	<a href="javascript:;" hhly-url="/collect/follow/add/'
					+ userInfo.userId + '">+ 关注</a>' + '</div>';
		}
		return content;
	},
	likeCount : function() {
		$('.like_box .like_icon').click(
				function() {
					if (!$(this).parents('.like_box').hasClass('active')) {
						$(this).parents('.like_box').addClass('active');
						var that = this;
						var videoId = $("#videoId").val();
						// 监听点赞事件
						$.post("/collect/video/digg", {
							"videoId" : videoId,
							"operation" : "digg"
						}, function(data) {
							var text = parseInt($(that).parents('.like_box')
									.find('.like_text').text()) + 1;
							$(that).parents('.like_box').find('.like_text')
									.text(text);
						});
					}
				});
	},
	// 视频播放页面
	recommend:function(){
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
	init : function() {
		videojs.options.flash.swf = "/resources/images/video-js.swf";
		myPlayer = videojs("video_player", {
			"autoplay" : true,
			controlBar : {
				captionsButton : false,
				chaptersButton : false,
				liveDisplay : false,
				playbackRateMenuButton : false,
				subtitlesButton : false
			},
		});
		myPlayer.on("ended", function(){
			// console.log("视频已播放完成");
			var nextVideo=$('.videotable_list ul.table_box li.active').next();
			if(nextVideo.length>0){
				video.videoTimer=setTimeout(function(){
					nextVideo.trigger('click');
				},5000);
			}
		});
		var shareTitle='#'+$('.video_title h2').text()+'#';
		var shareUrl=window.location.href;
		var sharePic=$('#video_player video').attr('poster');
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
			"share" : {}
		};
		document.getElementsByTagName(('head')[0]||body) && ((document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')).appendChild(document.createElement('script')).src='/static/api/js/share.js?cdnversion='+~(-new Date()/36e5))
		// with (document)0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+ ~(-new Date() / 36e5)];
		video.initSlideData();
		video.recommend();
		VideoModule.play();
		VideoModule.collect();
		video.videoListUp();
		// video.likeCount();第一期不做点赞
		video.videoSlide();
		video.tableSlide('.list_titles', '.videotable_list', 'li');
		myPlayer.on('error',function(){
			$('.video_mask').removeClass('hidden');
		});
		myPlayer.on('canplay', function() {
			$('.video_mask').addClass('hidden');
		});
	}
};
$(function() {
	video.init();
});
