require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
		'template':'/resources/js/manage/userCenter/content/template.js?v=a8321adb8a',
		'paging':'/resources/js/jquery/paging.js?v=b76500a88a',
		'personal':'/resources/js/manage/userCenter/common.js?v=5352b1e182'
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
		},
		'personal':{
			deps:['jquery']
		},
		'paging':{
			deps:['jquery']
		}
    },
});
require(['jquery','template','paging', 'hhlyAction', 'layer','common','i18n','personal'],function($,template,Paging){
	var news={
		pageInt:function(total,page){
			var pageDom = new Paging();
			var status=$('.title_list li.publishActive').index()==0?1:0;
			pageDom.init({
				target:'.page_box',
				pagesize:10,
				count:total,
				toolbar:true,
				callback:function(page,size,count){
					$.hhly.ajax({
						url:'/manage/personal/news/page',
						type:'get',
						data:{page:page,status:status},
						success:function(data){
							var html=template('news_tpl',data);
							$('.news_box').empty().append(html);
							$(window).scrollTop(0);
						}
					})
				}
			});
		},
		newsSlide:function(){
			$('ul.title_list li').click(function(){
				var status=$(this).index()==0?1:0;
				var that=this;
				$.hhly.ajax({
					url:'/manage/personal/news/page',
					type:'get',
					data:{page:1,status:status},
					success:function(data){
						console.log(data)
						var html=template('news_tpl',data);
						$('.news_box').empty().append(html);
						$(that).addClass('publishActive').siblings().removeClass('publishActive');
						$('.page_box').empty();
						$(window).scrollTop(0);
						if(data.data.hasNextPage){
							news.pageInt(data.data.total,data.data.page);
						}
					}
				})
			});
		},
		//删除
		deleteItem:function(){
			$('#manage_contents').on('click', '.infor_manage .deleteItem', function(){
				type=$(this).parents('.infor_manage').find('.manage_title').attr('hhly-type');
				var newId = $(this).attr("hhly-newId");
				var url,data,text;
				if(type==1){
					url='/manage/news/articleDelete';
					text=msgUtil.getTxt("news_deleteNews_confirm");
					data={articleId:newId};
				}else if(type==2){
					url='/manage/news/videoDelete';
					text=msgUtil.getTxt("news_deleteVideo_confirm");
					data={videoId:newId};
				}
				var dom = $(this);
				layer.open({
					scrollbar: false,
					move: false,
					area:'440px',
					title: msgUtil.getTxt("common_dialog_title"),
					content:'<span class="at_span warn"></span><span class="dialog_tips">'+text+'</span>',
					btn: [msgUtil.getTxt("common_sure"),msgUtil.getTxt("common_cancel")],
					yes:function(layero, index){
						$.hhly.ajax({
							url:url,
							data:data,
							success:function(data){
								if(data.result == '0' || data.result == 0){
					        		dom.parent().parent().remove();
					        	}
					        	else{
					        		layer.open({
					        			scrollbar: false,
										move: false,
										area:'440px',
										title: msgUtil.getTxt("common_dialog_info"),
										content:'<span class="at_span error"></span><span class="dialog_tips">'+msgUtil.getTxt("common_failDelete")+'</span>',
					        		});
					        	}
					        	layer.close(layero);
							},
							error:function(error){
								layer.open({
									scrollbar: false,
									move: false,
									area:'440px',
									title: msgUtil.getTxt("common_dialog_info"),
									content:'<span class="at_span error"></span><span class="dialog_tips">'+msgUtil.getTxt("common_network_error")+'</span>',
								});
							}
						});
					}
				});
			});
		},
		//编辑
		editItem:function(){
			$('#manage_contents').on('click', '.infor_manage .editItem', function(){
				var type=$(this).parents('.infor_manage').find('.manage_title').attr('hhly-type');
				var newId = $(this).attr("hhly-newId");
				var url,data;
				if(type==1){
					url='/manage/news/articleEdit';
					data={articleId:newId};
				}else if(type==2){
					url='/manage/news/videoEdit';
					data={videoId:newId};
				}
				$.hhly.ajax({
					url:url,
					data:data,
					dataType: "html",
					success:function(data){
						$('#manage_contents').html(data);
					},
					error:function(error){
						layer.open({
							scrollbar: false,
							move: false,
							area: '440px',
							title: msgUtil.getTxt("common_dialog_info"),
							content:'<span class="at_span error"></span><span class="dialog_tips">'+msgUtil.getTxt("common_network_error")+'</span>',
						});
					}
				});
			});
		},
		//撤回
		rebackItem:function(){
			$('#manage_contents').on('click', ' .rebackItem', function(){
				var articleId = $(this).attr("hhly-newId");
				var that = $(this);
				var rebackFlag = that.attr('hhly-status');
				layer.open({
					scrollbar: false,
					move: false,
					area: '440px',
					title: msgUtil.getTxt("common_dialog_title"),
					content:'<span class="at_span warn"></span><span class="dialog_tips">'+(rebackFlag?msgUtil.getTxt("news_retreatNews_confirm"):msgUtil.getTxt("news_cancelpublish_confirm"))+'</span>',
					btn: [msgUtil.getTxt("common_sure"),msgUtil.getTxt("common_cancel")],
					yes:function(layero, index){
						$.hhly.ajax({
							url:'/manage/news/rebackarticle',
							data:{articleId:articleId},
							success:function(data){
								if(data== "0"){
									if(rebackFlag){
										that.parent().parent().remove();
										that.parents('.news_commonbox').remove();
									}
									else
									{   //取消定时发布
										that.parent().parent().find('.published_mark').html(msgUtil.getTxt("news_unpublish"));
										that.remove();
									}
					        	}
					        	else{
					        		layer.open({
					        			scrollbar: false,
										move: false,
										area: '440px',
										title: msgUtil.getTxt("common_dialog_info"),
										content:'<span class="at_span error"></span><span class="dialog_tips">'+(rebackFlag?msgUtil.getTxt("news_retreat_fail"):msgUtil.getTxt("news_cancelpublish_fail"))+'</span>',
					        		});
					        	}
					        	layer.close(layero);
							},
							error:function(error){
								layer.open({
									scrollbar: false,
									move: false,
									area: '440px',
									title: msgUtil.getTxt("common_dialog_info"),
									content:'<span class="at_span error"></span><span class="dialog_tips">'+msgUtil.getTxt("common_network_error")+'</span>',
								});
							}
						});
					}
				});
			});
		},
		init:function(){
			this.newsSlide();
			var type=location.search;
			if(type.length>0){
				type.split('?type=')[1];
			}
			type=type.split('?type=')[1];
			type=type==0?1:0;
			$('ul.title_list li').eq(type).trigger('click');
			this.rebackItem();
			this.deleteItem();
		}
	}
	news.init();
});

