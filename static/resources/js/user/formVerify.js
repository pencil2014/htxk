define(['jquery','validate','hhlyAction'],function(){
	var publicForm={
		judgeNext:true,
		passwordVerify:function(cbox,callback){
			var htmlTips='<div class="form_error"></div>';
			jQuery.validator.addMethod("validPasswordReg", function(value, element) {
				//匹配有特殊字符，数字和大写字母组成的字符串。sanzhong
				// var passwordReg = /^(?=.*[A-Z])(?=.*[0-9])(?!.*([~!@&%$^\(\)#_]).*\1.*\1)[A-Z0-9~!@&%$^\(\)#_]{8,16}$/;
				var passwordReg =  /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,20}$/ ;
				return  passwordReg.test(value);
			},  htmlTips + "密码设置不符合要求，请重新输入");
			jQuery.validator.addMethod("validNickNameReg", function(value, element, reg) {
				if(value.length==0){
					return true;
				}
				var nickNameReg = /^(?!\d+$)[A-Za-z0-9_、.\u4e00-\u9fa5]{4,20}$/;
				return  nickNameReg.test(value);
			}, htmlTips + "昵称格式错误");
			$(cbox).validate({
				//errorClass: "label.error", //默认为错误的样式类为：error
				focusInvalid: true, //当为false时，验证无效时，没有焦点响应
				onfocusout: function(element) {
					$(element).valid();
				},
				onkeyup: false,
				submitHandler: function(form) { //表单提交句柄,为一回调函数，带一个参数：form
					//提交表单
					if(typeof(callback)==='function'){
						callback(form);
					}
				},
				rules: {
				    set_password: {
				    	required: true,
				    	rangelength: [6,20],
				    	validPasswordReg: true
				    },
				    repeat_password:{
				    	required: true,
				    	equalTo:"#set_password"
				    },
				    nick_name:{
				    	validNickNameReg: true,
				    	remote: {
				    	    url: "/member/validate/checkNickname",
				    	    type: "post",
				    	    data: {
				    	    	nickname: function() {
				    	            return $("input[name='nick_name']").val();
				    	        }
				    	    }
				     	}
				    }
			    },
			    messages: {
			    	set_password: {
			    		required: htmlTips+"密码不能为空",
			    		rangelength:htmlTips+"长度只能在6-20个字符之间",
			    	},
			    	repeat_password:{
			    		required:htmlTips+"密码不能为空",
			    		equalTo:htmlTips+"请输入同样的密码"

			    	},
			    	nick_name:{
			    		rangelength:htmlTips+"长度只能在4-20个字符之间",
			    		remote: htmlTips+'昵称已经存在'
			    	}
			    }
			});
		},
		noPermission:function(){
			layer.open({
				scrollbar: false,
				move: false,
				area:['440px'],
				title:"温馨提示",
				content:'无权限操作！！！',
				btn:['确定','取消'],
				end:function(){
					window.location.href=window.location.href;
				}
			});
			return false;
		},
		messageTips:function(times){
			if(parseInt(times)==8||parseInt(times)==9||parseInt(times)==10){
				layer.open({
					scrollbar: false,
					move: false,
					title:'温馨提示',
					area:['440px'],
					content:'<span class="lay_tips warn"></span><span class="dialog_tips green"><p>验证码每天只能获取10次。</p><p>你已获取'+times+'次！</p></span>',
					btn:['确定']
				})
			}else if(parseInt(times)>10){
				layer.open({
					scrollbar: false,
					move: false,
					title:'温馨提示',
					area:['440px'],
					content:'<span class="lay_tips warn"></span><span class="dialog_tips green"><p>你今天已获取验证码10次！</p><p>次数已用完，请明天再试！</p></span>',
					btn:['确定']
				})
			}
		},
		timeSet:function(that){
			that.addClass('count_down');
			var number = that.find('.number');
			var totalNumber = 60;
			var time = setInterval(function() {
				totalNumber = totalNumber - 1;
				if (totalNumber == 0) {
					totalNumber = 60;
					that.removeClass('count_down');
					that.find('span.text').text('重新获取验证码');
					clearInterval(time);
				}
				number.text(totalNumber);
			}, 1000);
			return time;
		},
		// 重新发送邮件
		sendEmail:function(value){
			// 后台发送验证邮件
			var emailHash = {
				'qq.com': 'http://mail.qq.com',
				'vip.qq.com': 'http://mail.qq.com',
				'foxmail.com': 'http://mail.qq.com',
				'gmail.com': 'http://mail.google.com',
				'sina.cn': 'http://mail.sina.com.cn',
				'sina.com': 'http://mail.sina.com.cn',
				'sina.com.cn': 'http://mail.sina.com.cn',
				'vip.sina.com': 'http://mail.sina.com.cn',
				'163.com': 'http://mail.163.com',
				'vip.163.com': 'http://vip.163.com',
				'126.com': 'http://mail.126.com',
				'yeah.net': 'http://www.yeah.net',
				'tom.com': 'http://mail.tom.com',
				'sohu.com': 'http://mail.sohu.com',
				'sogou.com': 'http://mail.sohu.com',
				'139.com': 'http://mail.10086.cn',
				'hotmail.com': 'http://www.hotmail.com',
				'outlook.com.': 'http://www.outlook.com',
				'live.com': 'http://login.live.com',
				'yahoo.com': 'https://login.yahoo.com',
				'eyou.com': 'http://www.eyou.com',
				'21cn.com': 'http://mail.21cn.com',
				'188.com': 'http://www.188.com',
				'189.cn': 'http://mail.189.cn',
				'wo.cn': 'http://mail.wo.cn'
			};
			// 邮箱登录链接
			var emailExt = value.split('@')[1].toLocaleLowerCase();
			var href = emailHash[emailExt];
			if(href){
				$('.login_email').attr("href", href);
			}
		},
		// 关闭显示密码
		showPassword:function(){
			var eyeJudge=false;
			$('.form_text .eye_icon').click(function(){
				if(eyeJudge){
					return false;
				}
				eyeJudge=true;
				if($(this).hasClass('close')){
					var name=$(this).parents('.form_text').find('input').attr('name');
					var value=$(this).parents('.form_text').find('input').val();
					var id=$(this).parents('.form_text').find('input').attr('id');
					var placeholder=$(this).parents('.form_text').find('input').attr('placeholder');
					$(this).parents('.form_text').find('input').remove();
					if(id){
						$(this).parents('.form_text').prepend('<input type="password" name="'+name+'" id="'+id+'" value="'+value+'" placeholder="'+placeholder+'" />');
					}else{
						$(this).parents('.form_text').prepend('<input type="password" name="'+name+'" value="'+value+'" placeholder="'+placeholder+'" />');
					}
					$(this).removeClass('close');
				}else{
					var name=$(this).parents('.form_text').find('input').attr('name');
					var value=$(this).parents('.form_text').find('input').val();
					var id=$(this).parents('.form_text').find('input').attr('id');
					var placeholder=$(this).parents('.form_text').find('input').attr('placeholder');
					$(this).parents('.form_text').find('input').remove();
					if(id){
						$(this).parents('.form_text').prepend('<input type="text" name="'+name+'" id="'+id+'"  value="'+value+'"  placeholder="'+placeholder+'" />');
					}else{
						$(this).parents('.form_text').prepend('<input type="text" name="'+name+'" value="'+value+'"  placeholder="'+placeholder+'" />');
					}
					
					$(this).addClass('close');
				}
				eyeJudge=false;
			})
		},
		// 清楚文本框内内容
		clearInput:function(){
			$('.form_text .clear_icon').click(function(){
				if($(this).parents('.form_text').find('input').val()!=''){
					$(this).parents('.form_text').find('input').val('');
				}
			});
		},
		//placeholder  IE8兼容性  节点生成后调用
		placeholderCompatibility: function() {
			function placeholderSupport() {
			    return 'placeholder' in document.createElement('input');
			}
			if(!placeholderSupport()){
				$('[placeholder]').focus(function() {
					var input = jQuery(this);
					if (input.val() == input.attr('placeholder')) {
						input.val('');
						input.removeClass('placeholder');
					}
					// if (input.attr("type") == "password") {
						input.siblings('.password_span').empty();
					// }
				}).blur(function() {
					var input = jQuery(this);
					if (input.val() == '' || input.val() == input.attr('placeholder')) {
						// if (input.attr("type") == "password") {
							var passTips='<span class="password_span">'+input.attr('placeholder')+'</span>';
							if(input.siblings('.password_span').length==0){
								input.parent().append(passTips);
							}else{
								input.siblings('.password_span').empty().text(input.attr('placeholder'));
							}
							input.siblings('.password_span').click(function(){
								input.trigger('focus');
							})
						// } else {
						// 	$(this).addClass('placeholder');
						// 	input.val(input.attr('placeholder'));
						// }
					}
				}).blur().parents('form').submit(function() {
					jQuery(this).find('[placeholder]').each(function() {
						var input = jQuery(this);
						if (input.val() == input.attr('placeholder')) {
							input.val('');
						}
					})
				});
			}
		},
		verifyInit:function(){
			//切换验证码
			$('.mit_container').off('click','.verify_img .refresh_verity').on('click','.verify_img .refresh_verity',function(){
				var pos = this.src.indexOf("40");
				var imgUrl = pos == -1 ? this.src : this.src.substr(0, pos+2);
				this.src = imgUrl +'&'+ Math.random();
			});
		},
		nickVerity:function(){
			/*$('input[name="nick_name"]').blur(function(){
				if($(this).val().length==0){
					return false;
				}
				var nickNameReg = /^(?!\d+$)[A-Za-z0-9_、.\u4e00-\u9fa5]{4,20}$/;
			});*/
		},
		// 清除远程校验结果
		clearVerify:function(){
			function  clearPreviousValue() {      
				if ($("input[name='message_verify']").data("previousValue")) {          
					$("input[name='message_verify']").removeData("previousValue");     
				}  
			};
			$("input[name='message_verify']").blur(function(){  
			    clearPreviousValue();  
			});  
		}
	};
	$(function(){
		publicForm.showPassword();
		publicForm.clearInput();
		publicForm.placeholderCompatibility();
		publicForm.clearVerify();
	})
	return publicForm;
});