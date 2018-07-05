require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		"template": "/resources/js/personal/template.js?v=69ff237647",
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15'
	},
	shim: {
		'layer': {
			deps: ['jquery']
		},
		"hhlyAction": {
			deps: ['jquery', 'layer']
		},
		'common':{
			deps: ['jquery','commonUtil','hhlyAction']
		}
    },
});
require(['jquery', 'hhlyAction', 'layer','template','common','i18n'], function($, hhlyAction, layer,template) {
var index={
	userId:$('#user_id').val(),
	ajaxXhr:'',
	//load子菜单
	loadSubMenu:function(){
		$('.infor_subtitle span').click(function(){
			var type=parseInt($(this).attr('data-type'));
			if($(this).hasClass('on')){
				return false;
			}
			if(type==4){
				$('.subnav_box').addClass('hidden');
				$('.content_box>div').addClass('hidden');
				index.loadService();
				$(this).addClass('on').siblings().removeClass('on');
				return false;
			}else if(type==5){
				$('.subnav_box').addClass('hidden');
				$('.content_box>div').addClass('hidden');
				index.loadMatch();
				$(this).addClass('on').siblings().removeClass('on');
				return false;
			}
			var data={
				type:type
			}
			var html = template('sub_nav',data);
			$('.subnav_box').removeClass('hidden');
            $('.subnav_box').html(html);
            $(this).addClass('on').siblings().removeClass('on');
            $('.left_content .content_title li').eq(0).trigger('click');
		});
	},
	// 子菜单绑定事件
	subMenuClick:function(){
		$('.left_content').on('click','.content_title li',function(){
			var type=parseInt($(this).attr('data-type'));
			if($(this).hasClass('on')){
				return false;
			}
			if(index.ajaxXhr){
              index.ajaxXhr.abort();
            }
			if(type==1){
				index.shareData();
			}else if(type==2){
				index.newsData();
			}else if(type==3){
				index.photoData();
			}else if(type==4){
				index.videoData();
			}else if(type==5){
				index.teamData();
			}else if(type==6){
				index.ballData();
			}else if(type==7){
				index.matchData();
			}else if(type==8){
				index.fansData();
			}else if(type==9){
				index.attData();
			}
			$(this).addClass('on').siblings().removeClass('on');
		});
	},
	// load 分享
	shareData:function(page){
		index.ajaxXhr=$.hhly.ajax({
			url:'/personal/index/share/feed',
			type:'get',
			data:{
				userId:index.userId,
				page:page
			},
			success:function(data){
				if(data.result=='0'){
					if($('.content_box .share_box>ul li').length==0){
						var html = template('share_tpl',data);
						$('.content_box>div').addClass('hidden');
	            		$('.content_box').html(html);
					}else{
						var html = template('share_subtpl',data);
						$('.content_box .share_box>ul').append(html);
						if(data.data.page==page){
		                  $('.load_more').remove();
		                }else{
		                  $('.load_more').attr('data-page',page);
		                }
					}
				}
			}
		})
	},
	// 资讯加载
	newsData:function(page){
		index.ajaxXhr=$.hhly.ajax({
			url:'/personal/index/share/article',
			type:'get',
			data:{
				userId:index.userId,
				page:page
			},
			success:function(data){
				if(data.result=='0'){
            		if($('.content_box .news_box>ul li').length==0){
						var html = template('news_tpl',data);
						$('.content_box>div').addClass('hidden');
	            		$('.content_box').html(html);
					}else{
						var html = template('news_subtpl',data);
						$('.content_box .news_box>ul').append(html);
						if(data.data.page==page){
		                  $('.load_more').remove();
		                }else{
		                  $('.load_more').attr('data-page',page);
		                }
					}
				}
			}
		})
	},
	// 相册加载
	photoData:function(page){
		index.ajaxXhr=$.hhly.ajax({
			url:'/personal/index/share/photo',
			type:'get',
			data:{
				userId:index.userId,
				page:page
			},
			success:function(data){
				if(data.result=='0'){
					if($('.content_box .share_photo>ul li').length==0){
						var html = template('photo_tpl',data);
						$('.content_box>div').addClass('hidden');
	            		$('.content_box').html(html);
					}else{
						var html = template('photo_subtpl',data);
						$('.content_box .share_photo>ul').append(html);
						if(data.data.page==page){
		                  $('.load_more').remove();
		                }else{
		                  $('.load_more').attr('data-page',page);
		                }
					}
				}
			}
		})
	},
	// 视频加载
	videoData:function(page){
		index.ajaxXhr=$.hhly.ajax({
			url:'/personal/index/share/video',
			type:'get',
			data:{
				userId:index.userId,
				page:page
			},
			success:function(data){
				if(data.result=='0'){
            		if($('.content_box .share_video>ul li').length==0){
						var html = template('video_tpl',data);
						$('.content_box>div').addClass('hidden');
	            		$('.content_box').html(html);
					}else{
						var html = template('video_subtpl',data);
						$('.content_box .share_video>ul').append(html);
						if(data.data.page==page){
		                  $('.load_more').remove();
		                }else{
		                  $('.load_more').attr('data-page',page);
		                }
					}
				}
			}
		});
	},
	// 加载球队
	teamData:function(page){
		index.ajaxXhr=$.hhly.ajax({
			url:'/personal/index/circle/team',
			type:'get',
			data:{
				userId:index.userId,
				page:page
			},
			success:function(data){
				if(data.result=='0'){
            		if($('.content_box .cicle_team>ul li').length==0){
						var html = template('team_tpl',data);
						$('.content_box>div').addClass('hidden');
	            		$('.content_box').html(html);
					}else{
						var html = template('team_subtpl',data);
						$('.content_box .cicle_team>ul').append(html);
						if(data.data.page==page){
		                  $('.load_more').remove();
		                }else{
		                  $('.load_more').attr('data-page',page);
		                }
					}
				}
			}
		})
	},
	// 加载拼球
	ballData:function(page){
		index.ajaxXhr=$.hhly.ajax({
			url:'/personal/index/circle/fight',
			type:'get',
			data:{
				userId:index.userId,
				page:page
			},
			success:function(data){
				console.log(data)
				if(data.result=='0'){
            		if($('.content_box .circle_ball>ul li').length==0){
						var html = template('ball_tpl',data);
						$('.content_box>div').addClass('hidden');
						$('.content_box').html(html);
					}else{
						var html = template('ball_tpl',data);
						$('.content_box .circle_ball>ul').append(html);
						if(data.data.page==page){
		                  $('.load_more').remove();
		                }else{
		                  $('.load_more').attr('data-page',page);
		                }
					}
				}
			}
		})
	},
	// 加载约战
	matchData:function(page){
		index.ajaxXhr=$.hhly.ajax({
			url:'/personal/index/circle/engage',
			type:'get',
			data:{
				userId:index.userId,
				page:page
			},
			success:function(data){
				if(data.result=='0'){
            		if($('.content_box .circle_match>ul li').length==0){
						var html = template('match_tpl',data);
						$('.content_box>div').addClass('hidden');
						$('.content_box').html(html);
					}else{
						var html = template('match_subtpl',data);
						$('.content_box .circle_match>ul').append(html);
						if(data.data.page==page){
		                  $('.load_more').remove();
		                }else{
		                  $('.load_more').attr('data-page',page);
		                }
					}
				}
			}
		})
	},
	// 加载粉丝
	fansData:function(page){
		index.ajaxXhr=$.hhly.ajax({
			url:'/personal/index/fans/page',
			type:'get',
			data:{
				userId:index.userId,
				page:page
			},
			success:function(data){
				if(data.result=='0'){
            		if($('.content_box .fans_content>ul li').length==0){
						var html = template('fans_tpl',data);
						$('.content_box>div').addClass('hidden');
	            		$('.content_box').html(html);
					}else{
						var html = template('fans_subtpl',data);
						$('.content_box .fans_content>ul').append(html);
						if(data.data.page==page){
		                  $('.load_more').remove();
		                }else{
		                  $('.load_more').attr('data-page',page);
		                }
					}
				}
			}
		});
	},
	// 加载关注
	attData:function(page){
		index.ajaxXhr=$.hhly.ajax({
			url:'/personal/index/follow/page',
			type:'get',
			data:{
				userId:index.userId,
				page:page
			},
			success:function(data){
				if(data.result=='0'){
            		if($('.content_box .attention_box>ul li').length==0){
						var html = template('att_tpl',data);
						$('.content_box>div').addClass('hidden');
	            		$('.content_box').html(html);
					}else{
						var html = template('att_subtpl',data);
						$('.content_box .attention_box>ul').append(html);
						if(data.data.page==page){
		                  $('.load_more').remove();
		                }else{
		                  $('.load_more').attr('data-page',page);
		                }
					}
				}
			}
		});
	},
	// 加载赛事
	loadMatch:function(page){
		index.ajaxXhr=$.hhly.ajax({
			url:'/match/center/page',
			type:'get',
			data:{
				userId:index.userId,
				page:page
			},
			success:function(data){
				if(data.result=='0'){
            		if($('.content_box .match_box>ul li').length==0){
						var html = template('cba_tpl',data);
						$('.content_box>div').addClass('hidden');
	            		$('.content_box').html(html);
					}else{
						var html = template('cba_subtpl',data);
						$('.content_box .match_box>ul').append(html);
						if(data.data.page==page){
		                  $('.load_more').remove();
		                }else{
		                  $('.load_more').attr('data-page',page);
		                }
					}
				}
			}
		});
	},
	// 加载服务
	loadService:function(){
		index.ajaxXhr=$.hhly.ajax({
			url:'/personal/index/service',
			type:'get',
			data:{
				userId:index.userId,
			},
			success:function(data){
				if(data.result=='0'){
					var html = template('service_tpl',data);
					$('.content_box>div').addClass('hidden');
            		$('.content_box').html(html);
				}
			}
		});
	},
	// 加载更多事件定义
	loadMore:function(btn,callback){
		$('.content_box').off('click',btn).on('click',btn,function(){
			var page=parseInt($(this).attr('data-page'))+1;
			callback(page);
		});
	},
	// 关注
	attention:function(){
		$('.index_head .btn.attention').click(function(){

			var url=$(this).attr('hhly-url');
			if(!url){
				return;
			}
			var that=$(this);
			$.ajax({
				url:url,
				success:function(obj){
					if(!obj.data){
						obj=JSON.parse(obj);
					}
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
						that.html('取消关注');
					}else if(obj.result == '0' && obj.data == 'del'){
						that.attr("hhly-url",url.replace("del","add"));
						that.removeClass("star_focus");
						that.html("+ 关注");
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
	},
	// 粉丝关注
	fansAtt:function(){
		$('.content_box').off('click','.fans_box .attention').on('click','.fans_box .attention',function(){
			var url=$(this).attr('hhly-url');
			if(!url){
				return;
			}
			var that = this;
            $.post(url,{}, function (data) {
            	if(!data.data){
					data=JSON.parse(data);
				}
                if(data.result == '2001'){
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
                }else if(data.result == '2'){
                    layer.open({
						title:'温馨提示',
						content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">'+data.msg+'</span></div>',
						scrollbar: false,
						move: false,
						area:['440px'],
						yes:function(index,lay){
							window.location.href='/member/login';
						}
					});
                }else if(data.result == '0'){
                    $(that).text('已关注').removeClass('attention');
                }
            });
		});
	},
	
	init:function(){
		this.subMenuClick();
		this.loadSubMenu();
		$('.infor_subtitle span').eq(0).trigger('click');
		setTimeout(function(){
			index.loadMore('.share_box .load_more',index.shareData);
			index.loadMore('.news_box .load_more',index.newsData);
			index.loadMore('.share_photo .load_more',index.photoData);
			index.loadMore('.share_video .load_more',index.videoData);
			index.loadMore('.cicle_team .load_more',index.teamData);
			index.loadMore('.circle_ball .load_more',index.ballData);
			index.loadMore('.circle_match .load_more',index.matchData);
			index.loadMore('.attention_box .load_more',index.attData);
			index.loadMore('.fans_content .load_more',index.fansData);
			index.loadMore('.match_box .load_more',index.loadMatch);
			index.attention();
			index.fansAtt();
		},1000);
	}
}
index.init();
});
