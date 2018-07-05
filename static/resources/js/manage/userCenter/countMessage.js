var countMessage ={
	//按照类别统计未读信息
	count: function(type){
		// 获取容器
		var inforBox='';
		if($('.manage_list.personal_menu').length>0){
			//如果是个人中心页面，则统计个人中心的获取个人中心容器
			inforBox=$('.manage_list.personal_menu').find('.myinfor_menu_icon').parent().siblings('ul.manage_list_menu').find('li');
		}else{
			//球队中心的，菜单是生成的，第二个菜单，获取球队中心容器
			inforBox=$('.manage_list li.manage_no_list').next().find('ul.manage_list_menu li');
		}
		inforBox.each(function(){
			var url = $(this).attr('hhly-url');
			var start='';
			if(url){
				start= url.indexOf('type=');
			}
			if(start != -1){
				var urlType = url.substring(start+5,url.indexOf('&',start));
				if(urlType==type){
					var typeUrl='/message/message/count?type='+type+'&time='+new Date().getTime();
					var that=this;
					$.hhly.ajax({
						url:typeUrl,
						success:function(data){
							var result=data.data;
							if(result>0){
								if(result>99){
									result='99+';
								}
								if($(that).find('span.menu_subtitle').find('em').length>0){
									$(that).find('span.menu_subtitle').find('em').text(result);
									$(that).find('span.menu_subtitle').find('em').show();
								}else{
									var circleHtml="<em class='message_circle'>"+result+"</em>";
									$(that).find('span.menu_subtitle').append(circleHtml);
								}
							}else{
								if($(that).find('span.menu_subtitle').find('em').length>0){
									$(that).find('span.menu_subtitle').find('em').text(result);
									$(that).find('span.menu_subtitle').find('em').hide();
								}
							}
							countMessage.sum(inforBox);
						}
					});
				}
			}
		});
	},
	sum:function(that){
		var messageAccount = 0;
		that.each(function(){
			if($(this).find('span.menu_subtitle').find('em').length>0){
				var numString = $(this).find('span.menu_subtitle').find('em').text();
				var num = 0;
				if(numString=='99+'){
					num = 100;
				}
				else{
					num = parseInt(numString);
				}
				messageAccount += num;
			}
		});
		var goalBox=that.parents('.manage_list_title');
		if(messageAccount>0){
			var messageAccountString = "";
			if(messageAccount>99){
				messageAccountString='99+';
			}
			else{
				messageAccountString = ""+messageAccount;
			}
			if(goalBox.find('span.team_manage_btn>em').length>0){
				goalBox.find('span.team_manage_btn>em').text(messageAccountString);
				goalBox.find('span.team_manage_btn>em').show();
			}else{
				var circleHtml="<em class='message_circle'>"+messageAccountString+"</em>";
				goalBox.find('span.team_manage_btn').append(circleHtml);
			}
			goalBox.addClass('message_center_infor');
			
			//导航栏加上数量
			$('#user_total_message_nav').html(messageAccountString);
			$('#user_total_message_nav').removeClass("hidden");
		}
		else{
			if(goalBox.find('span.team_manage_btn>em').length>0){
				goalBox.find('span.team_manage_btn>em').hide();
			}
			goalBox.removeClass('message_center_infor');
			
			//导航栏加上数量
			$('#user_total_message_nav').html("0");
			$('#user_total_message_nav').addClass("hidden");
		}
	},
	init: function(){
		setTimeout(function(){
			countMessage.count(1);
			countMessage.count(2);
			countMessage.count(3);
			countMessage.count(4);
			countMessage.count(5);
		},1000);
	}
};

$(function(){
	countMessage.init();
})