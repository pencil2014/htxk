require(['jquery','validate','formVeriy','cookie','md5'],function($,validate,publicForm,form){
	var login={
		// 添加杨正吗
		validCode:function(){
			var verify_box = $(".form_text.verify_box").html();
			if(!verify_box){
				//去后台判断是否需要录入验证码
				var str = '<div class="form_text verify_box">' + 
				'<div class="item_content fl">' + 
					'<input type="text" name="phone_verify" placeholder="请输入右侧验证码">' + 
					'<div class=" userform_icon verify_icon"></div>' + 
					'<div class="verify_img">' + 
						'<img class="refresh_verity" src="/member/validate/generatePictureValidateCode?type=1&width=135&height=40" title="看不清楚?请点击刷新" width="100%">' + 
					'</div>' + 
				'</div>' + 
				'<div class="normal_tips fl"><label id="phone_verify-error" class="error" for="phone_verify"></label></div>' + 
				'</div>';
				$('.form_text.password').after(str);
			}
		},
		// 验证
		verify:function(){
			/*jQuery.validator.addMethod("telphone_email", function(value, element) {
				var username = /^([0-9A-Za-z\-_\.]+)$/g;
				var email = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
				var mobileNum = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
				// let password=/^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,16}$/;
				return  username.test(value) || email.test(value) || mobileNum.test(value);
			}, "请您输入正确格式的手机号码或邮箱");*/
			/*jQuery.validator.addMethod("defineEmail", function(value, element) {
				var email = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
				var mobileNum =/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
				return  email.test(value)||mobileNum.test(value);
			}, "请您输入正确格式的手机号码或邮箱");*/
			$('.login_box').validate({
				//errorClass: "label.error", //默认为错误的样式类为：error
				focusInvalid: true, //当为false时，验证无效时，没有焦点响应
				onfocusout: function(element) {
					$('#user_id_password-error').empty().css('display','none');
					$(element).valid();
				},
				onkeyup: false,
				submitHandler: function(form) { //表单提交句柄,为一回调函数，带一个参数：form
					//提交表单
					/*login.validCode();*/
					var user_password = $("input[name='user_password']").val();
	                var user_data={
						account:$('input[name="user_id"]').val(),
	                	password:$.md5(user_password),
	                	// password:user_password,
	                	pictureValidateCode:$('input[name="phone_verify"]').val()
	                }
	                $.ajax({
	                	url:'/member/login/login',
	                	type:'post',
	                	data:user_data,
	                	success:function(obj){
	                		if (obj.result == 0) {
								//登录成功后,判断是否保存cookie
								// TODO 存在安全问题，待改进。
								login.saveCookie();
								var historyUrl = sessionStorage.getItem('historyUrl');
								if(historyUrl && historyUrl.length > 5){
									window.location = historyUrl;
									sessionStorage.removeItem('historyUrl');
								}else{
									window.location = "/manage/personal/index";
								}
							} else {
								if(obj.times>=3){
									login.validCode();
								}
								var str = '<label id="user_id_password-error" class="error" style="display: block;">' + obj.msg + '</label>';
								$(".form_tips").prepend(str);
								if($(".refresh_verity").length>0){
									$(".refresh_verity").click();
								}
							}
	                	}
	                })
				},
				rules: {
					user_id: {
						required: true,
						remote:{
							url:'/member/validate/checkAccount',
							type:'get',
							data:{
								account:function(){
									return $('[name="user_id"]').val()
								},
								extisted:true
							}
						},
						rangelength:[6,50]
			        },
			        user_password:{
			        	required: true
			        },
			        phone_verify:{
			        	required: true,
			        	remote: {
				    	    url: "/member/validate/checkPictureValidateCode",
				    	    type: "get",
				    	    data: {
				    	    	validateCode: function() {
				    	            return $("input[name='phone_verify']").val();
				    	        },
				    	        type:1
				    	    }
				     	}
			        }
			    },
			    messages: {
			    	user_id: {
			    		required: "请输入账号",
			    		remote:'您输入的账号不存在，立即注册',
			    		rangelength:'请输入6-50位字符'
			    	},
			    	user_password:{
			    		required:"密码不能为空"
			    	},
			    	phone_verify:{
			    		required:"请输入验证码",
			    		remote:'校验码错误'

			    	}
			    }
			});
		},
		//保存cookie
		saveCookie : function() {
			var username = $("input[name='user_id']").val();
			var password = $.md5($("input[name='user_password']").val());
			var remember = $("div[name='auto_login']").hasClass('cb_active');
			if(remember){
				// 存储一个带7天期限的cookie
				$.cookie('remember', 'true', { expires: 14, path: '/' });
				if(username && password) {
					$.cookie('username', username, { expires: 14, path: '/' });
					$.cookie('password', password, { expires: 14, path: '/' });
				}
			} else {
				login.clearCookie();
			}
		},
		// 清除cookie
		clearCookie : function() {
			$.removeCookie('remember', { path: '/' });
			$.removeCookie('username', { path: '/' });
			$.removeCookie('password', { path: '/' });
		},
		openOAuth:function(){
			$('.login_content .login_way').on('click','li',function(){
				var type=0;
				if($(this).hasClass('qq')){
					type=1;
				}else if($(this).hasClass('wechat')){
					type=2;
				}else if($(this).hasClass('sina')){
					type=3;
				}
				$.ajax({
					url:"/member/login/thirdPartyLogin",
					type:"get",
					data:{
						thirdPartyType:type
					},
					success:function(data){
						if(data.result=='0'){
							window.location.href=data.authorizeUrl;
						}
					}
				})
			});
		},
		inputInt:function(){
			$.hhly.inputbox({
				wrap:'div[name="auto_login"]'
			})
		},
		init:function(){
			this.verify();
			this.openOAuth();
			this.inputInt();
			$(".user_exit").click(function(){
				clearCookie();
			});
			publicForm.verifyInit();
			// 获取cookie的值
			var username = $.cookie('username');
			var password = $.cookie('password');
			var remember = $.cookie('remember');
			if(username && password && remember) {
				$('.login_tips .define_check').click();
				// 将获取的值填充入输入框中
				/*$("input[name='user_id']").val(username).focus().blur();
				$("input[name='user_password']").val(password).focus().blur();
				//触发点击事件
				$("input[name='login_submit']").click();*/
				var user_data={
					account:username,
                	password:password
                	// password:user_password,
                }
                $.ajax({
                	url:'/member/login/login',
                	type:'post',
                	data:user_data,
                	success:function(obj){
                		if (obj.result == 0) {
							//登录成功后,判断是否保存cookie
							// TODO 存在安全问题，待改进
							// login.saveCookie();
							window.location = "/manage/personal/index";
						} else {
							login.clearCookie();
						}
                	}
                })
			}
			$('.login_tips .define_check').click(function(){
				if($(this).hasClass('cb_active')){
					$(this).parents('.remember').siblings('.auto_login_tips').find('.hidden').removeClass('hidden');
				}else{
					$(this).parents('.remember').siblings('.auto_login_tips').children('div').addClass('hidden');
				}
			})
		}
	};
	$(function(){
		login.init();
	})
});