var videoList={
	getData:function(surl,status,page,dom,name,type){
		var data={};
		if(type==1){
			data={page:page,status:status,articleName:name};
		}else if(type==2){
			data={page:page,status:status,videoName:name};
		}
		$.hhly.ajax({
			url:surl,
			data:data,
			dataType: "html",
			success:function(data){
				dom.html(data);
			}
		});
	},
	menuSlide:function(){
		$('#manage_contents').on('click','.infor_manage .title_list li',function(){
			type=$(this).parents('.infor_manage').find('.manage_title').attr('hhly-type');
			$('.infor_manage .title_list li').removeClass("publishActive");
			$(this).addClass("publishActive");
			var index = $('.infor_manage .title_list li').index(this);
			$(".infor_manage .infor_list").hide().eq(index).show();
			var status = $(this).attr("hhly-newsStuts");
			if($(".infor_manage .infor_list:visible").html().length < 20){
				var url=$(this).parents('.infor_manage').attr('hhly-url');
				videoList.getData(url,status,1,$(".infor_manage .infor_list").eq(index),'',type);
				$('.infor_manage .seach_infor_input').val('');
			}
			else{
				$('.infor_manage .seach_infor_input').val($(".infor_manage .infor_list:visible .videoNameHide").val());
			}
		});
	},
	// 翻页
	pageNext:function(){
		$('#manage_contents').on('click', '.infor_manage .skip_page', function(){
			type=$(this).parents('.infor_manage').find('.manage_title').attr('hhly-type');
			var status = $(this).attr("hhly-newsStuts");
			var page = $(this).parent().parent().find('.newsGoPage').val();
			var dom = $(".infor_manage .infor_list:visible");
			var videoName = $(this).parent().parent().parent().find('.videoNameHide').val();
			var url=$('#manage_contents .infor_manage').attr('hhly-url');
			if(videoList.isPositiveNum(page)){
				videoList.getData(url,status,page,dom,videoName,type);
			}
		});
	},
	// 页面跳转
	pageSkip:function(){
		$('#manage_contents').on('click', '.infor_manage .pageGo', function(){
			type=$(this).parents('.infor_manage').find('.manage_title').attr('hhly-type');
			var status = $(this).attr("hhly-newsStuts");
			var page = $(this).attr("hhly-newsPage");
			var dom = $(".infor_manage .infor_list:visible");
			var videoName = $(this).parent().parent().parent().find('.videoNameHide').val();
			var url=$('#manage_contents .infor_manage').attr('hhly-url');
			videoList.getData(url,status,page,dom,videoName,type);
		});
	},
	// 视频搜索
	search:function(){
		$('#manage_contents').on('click', '.infor_manage .manage_search_btn', function(){
			type=$(this).parents('.infor_manage').find('.manage_title').attr('hhly-type');
			var status = $('.infor_manage .infor_list:visible').attr("hhly-newsStuts");
			var page = 1;
			var dom = $(".infor_manage .infor_list:visible");
			var videoName = $('.infor_manage .seach_infor_input').val();
			var url=$('#manage_contents .infor_manage').attr('hhly-url');
			videoList.getData(url,status,page,dom,videoName,type);
		});
	},
	searchEnter:function(){
		$('#manage_contents').on('keyup', '.seach_infor_input', function (e) {
            var key = e.which;
            if (key == 13) {
                e.preventDefault();
                $('.infor_manage .manage_search_btn').trigger('click');
            }
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
		$('#manage_contents').on('click', '#article_manage .rebackItem', function(){
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
	/*是否为正整数*/
	isPositiveNum:function(s){
		var re = /^[0-9]*[1-9][0-9]*$/ ;
	    return re.test(s);
	},
	init:function(){
		this.menuSlide();
		this.pageNext();
		this.pageSkip();
		this.search();
		this.searchEnter();
		this.deleteItem();
		this.editItem();
		this.rebackItem();
	}

};
$(function(){
	videoList.init();
});

