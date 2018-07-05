var NewsItem = {
	//资讯图文列表
	getNewsContent : function(data){
		var content = "";
		for(var k=0;k<data.list.length;k++){
			var newsVo = data.list[k];//单元项	
			var size = newsVo.coverUrl.length;
			var imgs = "";
			var authorName = newsVo.userId;
			if(newsVo.authorName){
				authorName = newsVo.authorName;
			}
			//资讯文章
			if(newsVo.infoType == 1){
				//有封面图
				if(size > 0){	
					//封面图片
					imgs += "<li><a href='" + newsVo.url +  "' target='_blank'><img src='" + newsVo.coverUrl[0] + "' width='100%'></a></li>";
					content += "<div class='news_commonbox textwrap_box'>" +
								"<div class='left_graphic'>" + imgs + "</div>" +
								"<div class='right_inforbox'>" +
									"<h4><a href='" + newsVo.url +  "' target='_blank'>" + newsVo.title + "</a></h4>" +
									"<div class='report_box'>" +
										"<div class='report_office'>" +
											"<span class='office_icon smalluser_icon'></span>" +
											"<span class='text'>" + authorName + "</span>" +
										"</div>" +
										"<div class='time_reply'>" +
											"<label class='time_label'>" + newsVo.publishTimeFormat + "</label>" +
											"<div class='report_replybox'>" +
												"<span class='reply_icon'></span>" +
												"<span class='number'>" + newsVo.commentCount + "</span>" +
											"</div>" +
											"<div class='report_likenumber'>" +
												"<span class='likenumber_icon'></span>" +
												"<span class='number'>" + newsVo.clickCount + "</span>" +
											"</div>" +
										"</div>" +
								  "</div>" +
							  "</div>" +
						  "</div>";				
				}else{					
					content += "<div class='news_commonbox article_newbox'>" +
								"<h4 class='title'><a href='" + newsVo.url +  "' target='_blank'>" + newsVo.title + "</a></h4>" +
								"<div class='article_box'>" +
								"<p class='article_desc'>" + newsVo.summary + "</p>" +
								"</div>" +
								"<div class='report_box report_footer'>" +
									"<div class='report_office '>" +
										"<span class='office_icon smalluser_icon'></span>" +
										"<span class='text'>" + authorName + "</span>" +
										"<div class='clearx'></div>" +
									"</div>" +
									"<div class='time_reply'>" +
										"<label class='time_label'>" + newsVo.publishTimeFormat + "</label>" +
										"<div class='report_replybox'>" +
											"<span class='reply_icon'></span>" +
											"<span class='number'>" + newsVo.commentCount + "</span>" +
										"</div>" +
										"<div class='report_likenumber'>" +
											"<span class='likenumber_icon'></span>" +
											"<span class='number'>" + newsVo.clickCount + "</span>" +
										"</div>" +
									"</div>" +
								"</div>" +
							"</div>";
				}

			}else{
				for(var i=0;i<size;i++){
					imgs += "<li><a href='" + newsVo.url +  "' target='_blank'><img src='" + newsVo.coverUrl[i] + "' width='100%'></a></li>";
				}
				content += "<div class='news_commonbox picture_newbox'>" +
							"<h4 class='title'><a href='" + newsVo.url +  "' target='_blank'>" + newsVo.title + "</a></h4>" +
							"<div class='picimg_box'>" +
								"<ul>" + imgs + "</ul>" +
								"<div class='picmore_btn'>" +
									"<a href='" + newsVo.url +  "' class='text' target='_blank'>" + msgUtil.getTxt('common_seeMore') + "></a>" +
									"<div class='img_accountbox'>" +
										"<span class='account'>" + newsVo.contentSize + "</span>" +
										"<span class='pic'>" + msgUtil.getTxt('news_picture') + "</span>" +
									"</div>" +
								"</div>" +
							"</div>" +
							"<div class='report_box report_footer'>" +
								"<div class='report_office'>" +
									"<span class='office_icon smalluser_icon'></span>" +
									"<span class='text'>" + authorName + "</span>" +
								"</div>" +
								"<div class='time_reply'>" +
									"<label class='time_label'> " + newsVo.publishTimeFormat + "</label>" +
									"<div class='report_replybox'>" +
										"<span class='reply_icon'></span>" +
										"<span class='number'> " + newsVo.commentCount + " </span>" +
									"</div>" +
									"<div class='report_likenumber'>" +
										"<span class='likenumber_icon'></span>" +
										"<span class='number'> " + newsVo.clickCount +  "</span>" +
									"</div>" +
								"</div>" +
							"</div>" +
						  "</div>";
			}
		}
		return content;
	}
};
