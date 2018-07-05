var ShareURLS={
	team:'/personal/index/share/moremyteam/'+$('#userId').val(),
	feed:'/personal/index/share/morefeed/'+$('#userId').val(),
	article:'/personal/index/share/morearticle/'+$('#userId').val(),
	photo:'/personal/index/share/morephoto/'+$('#userId').val(),
	video:'/personal/index/share/morevideo/'+$('#userId').val(),
	cityfight:'/personal/index/circle/morecityfight/'+$('#userId').val(),
	teamengage:'/personal/index/circle/moreteamengage/'+$('#userId').val(),
	fans:'/personal/index/fans/morefans/'+$('#userId').val(),
	follow:'/personal/index/fans/morefollow/'+$('#userId').val(),
}
$(function(){
	$.selectTab(".selectBox", "li", "active");
	//分享页面"加载更多"按钮事件
	//球队
	$('.viewMore').off('click','.myteam').on('click','.myteam',function(){
		var status = $(this).attr('hhly-status');
		var page = $(this).attr('hhly-page');
		var that = this;
		if(status && status == "true" && page){
			$.ajax({
				url:ShareURLS.team,
				type: "post",
				dataType: "json",
				data: {page:parseInt(page)+1},
				success:function(json){
					if(json && json.list){
						var html = '';
						$(json.list).each(function(index,element){
							var icon = '/resources/images/default_team_logo.png';
							if(element.iconUrl && element.iconUrl.length>0){
								icon = element.iconUrl; 
							}
							html += '<li class="infor_box">'+
									'<div class="mit_left">'+
										'<a href="/team/index/' + element.orgId + '" target="_blank"><img src="'+icon+'" width="100%"></a>'+
									'</div>'+
									'<div class="mit_right">'+
										'<h4 class="team_title">'+
											'<span class="title_text">'+element.teamName+'</span>'+					
										'</h4>'+
										'<p class="team_desc">'+
									'<span class="desc_left">'+
										'<em class="user_icon"></em>'+
										'<em>人数：</em>'+
										'<em class="text">'+element.joins+'</em>'+
									'</span>'+
										'<em class="desc_right">'+
										'<em class="desc_label">粉丝：</em>'+
										'<em class="text">'+element.fans+'</em>'+
									'</span>'+
										'<p class="team_area">'+
											'<span class="area_icon"></span>'+
											'<span class="area_label">地区：</span>'+
											'<span class="text">'+(element.area==null?"":element.area)+'</span>'+
										'</p>'+
									'</div>'+
								'</li>';
						});
						$(html).insertBefore($(that).parent('div'));
						$(that).attr('hhly-page',json.page);
						$(that).attr('hhly-status',json.hasNextPage);
					}
				}
			});
		}else{
			noMore(that);
		}
	});
    //帖子
	$('.viewMore').off('click','.feed').on('click','.feed',function(){
		var status = $(this).attr('hhly-status');
		var page = $(this).attr('hhly-page');
		var that = this;
		if(status && status == "true" && page){
			$.ajax({
				url:ShareURLS.feed,
				type: "post",
				dataType: "json",
				data: {page:parseInt(page)+1},
				success:function(json){
					if(json && json.list){
						var html = '';
						$(json.list).each(function(index,element){
							var userIcon = element.userIcon || '/resources/images/default_photo.jpg';
							var content = '';
							var imgcontent='';
							$(element.feedContents).each(function(ind,obj){
								if(obj.contentType == 1){
									content += obj.content;
								}else if(obj.contentType == 2){
									imgcontent += '<li><img src="'+obj.content+'"></li>';
								}
							});
							var label = '';
							if(element.labels){
								$(element.labels).each(function(ind,obj){
									label += '<span>'+obj.labelName+'</span>';
								});
							}
							var imgText = '';
							if(element.pcImgTxtUrl){
								imgText =  '<img src="' + element.pcImgTxtUrl +'"/>';
							}
							html += '<li><a href="/personal/index/feedetail/'+element.feedId+'" target="_blank">'+
								'<div class="share_people">'+
								'<div class="share_head fl">'+
									'<img src="'+userIcon+'">'+
								'</div>'+
								'<div class="share_author fl" >'+
									'<strong>'+element.nickName+'</strong>'+ imgText +
									'<i>'+dateTimeUtil.timeFormat(element.publishTime)+'</i>'+
								'</div>'+
								'<div class="clearx"></div>'+							
							'</div>'+
								'<p class="share_headline">'+content +'</p>'+
								'<ul class="share_images">'+imgcontent + '<div class="clearx"></div></ul>' +
							'<div class="share_footer">'+
								'<div class="share_remark fl">'+ label + '</div>'+
								'<div class="cbox_tp fr">'+
				                    '<p class="op"><i></i><span>'+element.commentCount+'</span></p>'+
			                    	'<p class="tp"><i></i><span>'+element.clickCount+'</span></p>'+									
								'</div>'+
								'<div class="clearx"></div>'+
							'</div>'+
						'</a></li>';
						});
						$(html).insertBefore($(that).parent('div'));
						$(that).attr('hhly-page',json.page);
						$(that).attr('hhly-status',json.hasNextPage);
					}
				}
			});
		}else{
			noMore(that);
		}
	});
	//资讯
	$('.viewMore').off('click','.article').on('click','.article',function(){
		var status = $(this).attr('hhly-status');
		var page = $(this).attr('hhly-page');
		var that = this;
		if(status && status == "true" && page){
			$.ajax({
				url:ShareURLS.article,
				type: "post",
				dataType: "json",
				data: {page:parseInt(page)+1},
				success:function(json){
					var html = '';
					if(json && json.list){
						$(json.list).each(function(index,element){
							var image = '';
							if(element.coverUrl && element.coverUrl.length > 0){
								if(element.coverUrl.length >= 3){
									$(element.coverUrl).each(function(ind,obj){
										image += '<div class="published_image fl">'+
										'<img src="'+obj+'">'+
										'</div>';
									});
									html += '<li class="Unpublished_image_list"><a href="'+element.url+'" target="_blank">'+
										'<div class="published_title fl">'+
											'<h3>'+element.title+'</h3>'+ image +
											'<div class="clearx"></div>'+													
											'<p>'+
												'<span class="published_time">'+dateTimeUtil.monthsFormat(element.publishTime)+'</span>'+
												'<span class="published_content_count"><i></i>'+element.commentCount+'</span>'+
												'<span class="published_look_count"><i></i>'+element.clickCount+'</span>'+
											'</p>'+
										'</div>'+				
										'<div class="clearx"></div></a>'+
									'</li>';
								}else{
									html += '<li><a href="'+element.url+'" target="_blank">'+
											'<div class="published_image fl">'+
												'<img src="'+element.coverUrl[0]+'">'+
											'</div>'+
											'<div class="published_title fl">'+
												'<h3>'+element.title+'</h3>'+
												'<p>'+
													'<span class="published_time">'+dateTimeUtil.timeFormat(element.publishTime)+'</span>'+
													'<span class="published_content_count"><i></i>'+element.commentCount+'</span>'+
													'<span class="published_look_count"><i></i>'+element.clickCount+'</span>'+
												'</p>'+
											'</div>'+			
											'<div class="clearx"></div></a>'+
										'</li>';
								}
							}else{
								html += '<li><a href="'+element.url+'" target="_blank">'+
									'<div class="published_title fl">'+
										'<h3>'+element.title+'</h3>'+
										'<p>'+
											'<span class="published_time">'+dateTimeUtil.timeFormat(element.publishTime)+'</span>'+
											'<span class="published_content_count"><i></i>'+element.commentCount+'</span>'+
											'<span class="published_look_count"><i></i>'+element.clickCount+'</span>'+
										'</p>'+
									'</div>'+			
									'<div class="clearx"></div></a>'+
								'</li>';
							}
						});
						$(html).insertBefore($(that).parent('div'));
						$(that).attr('hhly-page',json.page);
						$(that).attr('hhly-status',json.hasNextPage);
					}
				}
			});
		}else{
			noMore(that);
		}
	});
	//相册
	$('.viewMore').off('click','.photo').on('click','.photo',function(){
		var status = $(this).attr('hhly-status');
		var page = $(this).attr('hhly-page');
		var that = this;
		if(status && status == "true" && page){
			$.ajax({
				url:ShareURLS.photo,
				type: "post",
				dataType: "json",
				data: {page:parseInt(page)+1},
				success:function(json){
					if(json && json.list){
						$(json.list).each(function(index,element){
							var html = '';
							var thisMonth = dateTimeUtil.monthsFormat(element.createTime);
							var thisMonthObj = $('.'+thisMonth);
							if($('.'+thisMonth).length>0){
								html += '<li><img src="'+element.thumbFileName+'"></li>';
								$(html).insertBefore($(thisMonthObj).children('ul').children('.clearx'));
							}else{
								html += '<li class="'+thisMonth+'"><span>'+dateTimeUtil.timeByFormat(element.createTime,'yyyy-MM')+'</span><ul class="share_photoes_list">';
								html += '<li><img src="'+element.thumbFileName+'"></li>';
								html += '<div class="clearx"></div></ul></li>';
								$(html).insertBefore($(that).parent('div'));
							}
						});
						$(that).attr('hhly-page',json.page);
						$(that).attr('hhly-status',json.hasNextPage);
					}
				}
			});
		}else{
			noMore(that);
		}
	});
	//视频
	$('.viewMore').off('click','.video').on('click','.video',function(){
		var status = $(this).attr('hhly-status');
		var page = $(this).attr('hhly-page');
		var that = this;
		if(status && status == "true" && page){
			$.ajax({
				url:ShareURLS.video,
				type: "post",
				dataType: "json",
				data: {page:parseInt(page)+1},
				success:function(json){
					var html = '';
					if(json && json.list){
						$(json.list).each(function(index,element){
							html += '<li>'+
										'<a href="/video/play/'+element.videoId+'" target="_blank"><div class="published_image fl">'+
											'<img src="'+element.imgUrl+'">'+
											'<i></i>'+
											'<span><strong></strong>'+element.playTimeFormat+'</span>'+
										'</div></a>'+
										'<div class="published_title fl">'+
											'<h3>'+element.videoName+'</h3>'+
											'<p>'+
												'<span class="published_time">'+dateTimeUtil.timeFormat(element.createTime)+'</span>'+
												'<span class="published_look_count"><i></i>'+element.playCount+'</span>'+
											'</p>'+
										'</div>'+		
										'<div class="clearx"></div>'+
									'</li>';
						});
						$(html).insertBefore($(that).parent('div'));
						$(that).attr('hhly-page',json.page);
						$(that).attr('hhly-status',json.hasNextPage);
					}
				}
			});
		}else{
			noMore(that);
		}
	});
	
	//圈子页面
	//加载更多-拼球
	$('.viewMore').off('click','.cityfight').on('click','.cityfight',function(){
		var status = $(this).attr('hhly-status');
		var page = $(this).attr('hhly-page');
		var that = this;
		if(status && status == "true" && page){
			$.ajax({
				url:ShareURLS.cityfight,
				type: "post",
				dataType: "json",
				data: {page:parseInt(page)+1},
				success:function(json){
					var html = '';
					if(json && json.list){
						$(json.list).each(function(index,element){
							var statusValue = '';
							var startTime = dateTimeUtil.dayFormat(element.startTime,'yyyy-MM-dd');
							var begintime = dateTimeUtil.hourFormat(element.startTime,'hh:mm');
							var endtime = dateTimeUtil.hourFormat(element.endTime,'hh:mm');
							switch (element.status) {
							case 1:
								statusValue = '报名中';
								break;
							case 2:
								statusValue = '拼球成功';
								break;
							case 3:
								statusValue = '拼球失败';
								break;
							case 4:
								statusValue = '拼球关闭';
								break;
							case 5:
								statusValue = '已结束';
								break;
							}
							var payMethod = '';
							if(element.payMethod == 9001){
								payMethod = 'AA';
							}else if(element.payMethod == 9002){
								payMethod = '免费';
							}else{
								payMethod = '其它';
							}
							var iconUrl = element.iconUrl || '/resources/images/default_team_logo.png';
							html += '<li class="user_show">'+
										'<div class="usr_show_img">'+
									'<div class="box"><img src="'+iconUrl+'"><span></span></div>'+
								'</div>'+
								'<div class="user_show_content">'+
									'<ul>'+
										'<li class="one_li"><i>'+element.leaderUserName+'</i></li>'+
										'<li class="two_li"><a href="/city/fight/view/detail?fightBallId=' + element.fightId + '" target="_blank"><em></em><i>'+element.title+'</i></a></li>'+
										'<li class="three_li"><em></em><span>'+startTime+ "&nbsp;&nbsp;" +begintime+'-'+ endtime+'</span></li>'+
										'<li class="four_li"><em></em><i>'+element.place+'</i></li>'+
										'<li class="five_li"><em></em><i>'+payMethod+'</i></li>'+
									'</ul>'+
									'<div class="btn_box">'+
										'<div class="btn sbtn">'+
											statusValue+
										'</div>'+
										'<p><span>'+element.joins+'</span>已参与</p>'+
									'</div>'+
								'</div>'+
							'</li>';
						});
						$(html).insertBefore($(that).parent('div'));
						$(that).attr('hhly-page',json.page);
						$(that).attr('hhly-status',json.hasNextPage);
					}
				}
			});			
		}else{
			noMore(that);
		}
	});
	//加载更多-约战
	$('.viewMore').off('click','.teamengage').on('click','.teamengage',function(){
		var status = $(this).attr('hhly-status');
		var page = $(this).attr('hhly-page');
		var that = this;
		if(status && status == "true" && page){
			$.ajax({
				url:ShareURLS.teamengage,
				type: "post",
				dataType: "json",
				data: {page:parseInt(page)+1},
				success:function(json){
					var html = '';
					if(json && json.list){
						$(json.list).each(function(index,element){
							var matchState = '';
							var matchScore = '';
							var homeScore = '0';
							var guestScore = '0';
							if(element.status == 0){
								matchState = '<p class="p l_yuCancel">约战取消</p>';
							}else if(element.status == 1){
								matchState = '<p class="p l_yuIng">约战中</p>';
							}else if(element.status == 2){
								if(element.matchState == -1){
									if(element.homeScore){
										homeScore = element.homeScore;
									}
									if(element.guestScore){
										guestScore = element.guestScore;
									}
									matchState = '<p>'+ homeScore + '-' + guestScore + '</p>';;
									if(element.homeScore == element.guestScore){
										matchScore = '<span class="fsp">平</span>';
									}else if(element.homeScore > element.guestScore){
										matchScore = '<span class="vsp">胜</span>';
									}else{
										matchScore = '<span class="dsp">负</span>';
									}
								}else{
									matchState = '<span>vs</span>';
									matchScore = '<span class="dsp">待</span>';
								}
							}else if(element.status == 3){
								matchState = '<p class="p l_yuFail">约战失败</p>';
							}
							
							var guestTeamIcon = element.guestTeamIcon || '/resources/images/default_team_logo.png';
							var homeTeamIcon = element.homeTeamIcon || '/resources/images/default_team_logo.png';	
							var guestTeamName = element.guestTeamName || '';
							html += '<li>'+
										'<ul class="personal_compet">'+
									'<li class="one_li"><i>'+dateTimeUtil.timeByFormat(element.matchDate,'MM-dd')+"&nbsp;&nbsp;"+element.beginTime+"-"+element.endTime+'</i></li>'+
									'<li class="two_li"><span>'+element.homeTeamName+'</span></li>'+
									'<li class="three_li"><img src="'+homeTeamIcon+'"></li>'+
									'<li class="four_li">'+
										matchState+
									'</li>'+
									'<li class="five_li"><img src="'+guestTeamIcon+'"></li>'+
									'<li class="six_li"><span>'+guestTeamName+'</span></li>'+
									'<li class="seven_li">'+
										matchScore+
									'</li>'+
									'<li class="eight_li"><p>赛制 : <span>'+element.formatName+'</span></p><p>球场 : <span>'+element.fieldName+'</span></p></li>'+
							    '</ul>'+
							'</li>';
						});
						$(html).insertBefore($(that).parent('div'));
						$(that).attr('hhly-page',json.page);
						$(that).attr('hhly-status',json.hasNextPage);
					}
				}
			});
		}else{
			noMore(that);
		}
	});	
	
	//粉丝页面
	//加载更多---我的粉丝
	$('.viewMore').off('click','.myfans').on('click','.myfans',function(){
		var status = $(this).attr('hhly-status');
		var page = $(this).attr('hhly-page');
		var that = this;
		if(status && status == "true" && page){
			$.ajax({
				url:ShareURLS.fans,
				type: "post",
				dataType: "json",
				data: {page:parseInt(page)+1},
				success:function(json){
					var html = '';
					if(json && json.source.list){
						html = loadFans(json);
						$(html).insertBefore($(that).parent('div'));
						$(that).attr('hhly-page',json.source.page);
						$(that).attr('hhly-status',json.source.hasNextPage);
					}
				}
			});
		}else{
			noMore(that);
		}
	});	
	
	//加载更多---我的关注
	$('.viewMore').off('click','.myfollow').on('click','.myfollow',function(){
		var status = $(this).attr('hhly-status');
		var page = $(this).attr('hhly-page');
		var that = this;
		if(status && status == "true" && page){
			$.ajax({
				url:ShareURLS.follow,
				type: "post",
				dataType: "json",
				data: {page:parseInt(page)+1},
				success:function(json){
					var html = '';
					if(json && json.source.list){
						html = loadFans(json);
						$(html).insertBefore($(that).parent('div'));
						$(that).attr('hhly-page',json.source.page);
						$(that).attr('hhly-status',json.source.hasNextPage);
						bindFollowClickEvents();
					}
				}
			});
		}else{
			noMore(that);
		}
	});	
	
	//加载粉丝公用方法
	function loadFans(data){
		var html = '';
		$(data.source.list).each(function(index,element){
			var iconUrl = '/resources/images/sportman_headicon.jpg';
			if(element.iconUrl){
				iconUrl = element.iconUrl;
			}
			var sex = 'focus_boy';
			if(element.sex == 2){
				sex = 'focus_girl';
			}
			var isFollowed = '';
			if(element.userId != data.loginUserId){
				isFollowed = '<a href="javascript:;" hhly-url="/collect/follow/add/'+element.userId+'" class="followClick" >+ 关注</a>';
				if(data.relationList[index] == 1){
					isFollowed = '<a href="javascript:;" hhly-url="/collect/follow/del/'+element.userId+'" class="followClick star_focus" >取消关注</a>';
				}
			} 
			html += '<a href="/personal/index/'+element.userId+'"><li>'+
		 				'<div class="personal_focus_head fl">'+
						'<img src="'+iconUrl+'">'+
						'<i class="'+sex+'"></i>'+
					'</div></a>'+
					'<div class="personal_focus_intro fl">'+
						'<h4>'+element.nickName+
							((element.authName==null || element.authStatus!=1)?'':'<i>'+element.authName+'</i>')+
						'</h4>'+
					'<ul class="personal_focus_count">'+
						'<li class="personal_focus">'+
							'<span>关注：</span>'+
							'<i>'+element.concernNum+'</i>'+
						'</li>'+
						'<li class="personal_fancs">'+
							'<span>粉丝：</span>'+
							'<i>'+element.followNum+'</i>'+						
						'</li>'+
						'<div class="clearx"></div>'+
					'</ul>'+
					'<i class="personal_focus_address">'+
						'<i></i>'+
						'<span>'+(element.areaProvName==null?'':element.areaProvName)+
						(element.areaCityName==null?'':element.areaCityName)+
						(element.areaDistName==null?'':element.areaDistName)+
						(element.areaStreet==null?'':element.areaStreet)+'</span>'+
					'</i>'+
					'<p class="personal_focus_signature">'+
						'签名：'+(element.sign==null?'':element.sign)+
					'</p>'+								 					
					'</div>'+
					'<div class="personal_focus_mark fr">'+
					'<div class="foucs_warp status fl">'+
						isFollowed+
					'</div>'+
					'<div class="clearx"></div>'+
					'</div>'+
					'<div class="clearx"></div>'+
				'</li>';
		});
		return html;
	}
	bindFollowClickEvents();
	function bindFollowClickEvents(){
		$('.followClick').off('click').on('click',function(){
	    	var url = $(this).attr("hhly-url");
	    	var that = this;
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
						$(that).attr("hhly-url",url.replace("add","del"));
	    				$(that).addClass("star_focus");
	    				$(that).html(msgUtil.getTxt('common_followed'));
					}else if(obj.result == '0' && obj.data == 'del'){
						$(that).attr("hhly-url",url.replace("del","add"));
	    				$(that).removeClass("star_focus");
	    				$(that).html("+ " + msgUtil.getTxt('common_follow'));
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
	
	function noMore(obj){
		$(obj).text('没有更多了').fadeOut('slow');
	}
});
