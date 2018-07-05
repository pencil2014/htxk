var manageCommon={
	//  下划菜单
	slideToggle:function(){
		var oUls= $(".team_manage_btn").parent("li").find("ul");
		var oI=$(".team_manage_btn").parent("li").find("i")
		$(".team_manage_btn").click(function(){
			if($('#contents #videoForm').length>0){
				videoEdit.videoReload();
			}
			oUls.stop().slideUp();
			$(this).parent("li").find("ul").stop().slideDown();
			$(oI).removeClass("slider_up");
			$(this).children("i").addClass("slider_up");
		})
		$(".manage_list_btn").click(function(){
			if($('#contents #videoForm').length>0){
				videoEdit.videoReload();
			}
			oUls.stop().slideUp();
			setTimeout(function(){
				$(oI).removeClass("slider_up");
			},100)
		})
	},
	tabs:function(tabBtn,tabList){
		$(tabBtn).children("li").click(function(){
			$(tabBtn).children("li").removeClass("publishActive");
			$(this).addClass("publishActive");
			$(tabList).hide().eq($(tabBtn).children("li").index(this)).show(); 
		});
	},
	// 公用文字统计
    textAccount:function(max){
		//判断文本域是否为空
		$("#manage_contents ").on('input propertychange keydown keyup blur', '.account_area' , function(event) {
			var textarea=$(this).val();
			var counter=textarea.length;
			var area=$(this);
			var max = $(this).siblings('.tips_box').find('.total').text()||max;//获取maxlength的值
			if (max > 0) {
				if (counter > max) { //textarea的文本长度大于maxlength
					area.val(textarea.substr(0, max)); //截断textarea的文本重新赋值
				}
			}
			if(counter>max){
				counter=max;
			}
			 $(this).siblings('.tips_box').find('.account').text(counter);
		});
		//复制的字符处理问题
		$("#manage_contents ").on('blur','.account_area',function() {
			var area = $(this);
			var textarea=$(this).val();
			var counter=textarea.length;
			var max = $(this).siblings('.tips_box').find('.total').text()||max; //获取maxlength的值
			if (max > 0) {
				if (counter > max) { //textarea的文本长度大于maxlength
					area.val(textarea.substr(0, max)); //截断textarea的文本重新赋值
				}
			}
		});
	},
	//弹窗
    tselect:function () {
        $(".cover_container_content li").on("click",function () {
            var $list = $(".cover_content_li");
         if($list.length <3){
             $(this).toggleClass("cover_content_li");
         }else{
             $(this).removeClass("cover_content_li");
         }
        });
    },
   	//ajax请求数据
	ajax:function(url,params){
		$('.sport_loading').removeClass('hidden');
		$.hhly.ajax({
			"url":url,
			"dataType":"html",
			"data":params,
			"success":function(data){
				$("#manage_contents").html(data);
				$('body').scrollTop(0);
				$('.sport_loading').addClass('hidden');
				//消息未读数据重新统计
				if(url.toString().indexOf('/message/') != -1){
					var start = url.indexOf('type=');
					if(start != -1){
						var type = url.substring(start+5,url.indexOf('&',start));
						countMessage.count(type);
					}
				}
    		}
		});
	},
	// 左侧菜单定位
	menuControl:function(){
		var orgId = $("#orgId").val();
		var param = {"teamId":orgId}
		var current_url = $("#current_url").val();
		//监听点击事件
		$(".manage_list ul li").click(function(){
			var url = $(this).attr("hhly-url");
			$(this).parents('.manage_list').find('li').removeClass('active');
			$(this).addClass('active');
			//请求数据
			manageCommon.ajax(url,param);
		});
		$('.manage_list li.manage_no_list,.personal_menu .name_edit.personal_li,.personal_focus.personal_li,.personal_fancs.personal_li').click(function(){
			var url = $(this).attr("hhly-url");
			$(this).parents('.manage_list').find('li').removeClass('active');
			$(this).addClass('active');
			manageCommon.ajax(url,param);
		});
		//记忆事件
		if(current_url != ''){
			//请求数据，上次的链接
			// manageCommon.ajax(current_url,param);
			$('.manage_list li').each(function(){
				var value=$(this).attr('hhly-url');
				if(current_url==value){
					$(this).parents('.manage_list_menu').siblings('.team_manage_btn').trigger('click');
					$(this).trigger('click');
					return false;
				}
			})
		}else{
			var centerType=$("#current_url").attr('hhly-center-type');
			if(centerType==2){
				manageCommon.ajax("/team/manage/index",param);//球队主页
			}else{
				$('.manage_list li').first().find('.manage_list_btn').trigger('click');
				// manageCommon.ajax("/manage/personal/schedule",param);// 个人主页
			}
		}
		
	},
	// 菜单切换
	menuLeftSlide:function(){
		$('.manage_list').on('click','.left_menu',function(){
			var childUl=$(this).find('ul');
			if(childUl.length>0){
				if($(this).find('ul:hidden').length>0){
					childUl.slideDown();
				}
			}
			$(this).siblings('.left_menu').find('ul').slideUp();
		});
	},
	init:function(){
		manageCommon.textAccount();
		//  弹窗
		manageCommon.tselect();
		this.menuLeftSlide();
		manageCommon.slideToggle();
		//manageCommon.menuControl();
	}
};
$(function(){
	manageCommon.init();
})