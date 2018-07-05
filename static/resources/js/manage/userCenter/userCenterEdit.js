require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
		'webuploader':'/resources/js/jquery/webuploader/webuploader.min.js?v=77f65ac437',
		'ganged':'/resources/js/jquery/jquery.ganged.js?v=6f8a2b7f9a',
		'validate':'/resources/js/jquery/jquery.validate.min.js?v=37393e7134',
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
		'webuploader':{
			deps:['jquery']
		},
		'ganged':{
			deps:['jquery','hhlyAction']
		},
		'validate':{
			deps:['jquery']
		},
		'personal':{
			deps:['jquery']
		}
    },
});
require(['jquery', 'hhlyAction', 'layer','webuploader','ganged','validate','common','i18n','personal'], function($, hhlyAction, layer,WebUploader) {
	var privateEdit = {
		judgecontrol: false,
		judgeCommit:true,
		ajaxAbort:'',
		getOrgName: function() {
			return $("input[name='nickname_input']").val();
		},
		hideBack:function(thisObj) {
			thisObj.siblings('.nickname_edit').removeClass('hidden');
			thisObj.parent().find('.nickname_btn').addClass('hidden');
		},
		//修改用户昵称
		editNickName: function() {
			$('.nickname_edit').click(function() {
				privateEdit.judgecontrol = false;
				var oldText = $(this).siblings('.name_box').text();
				$(this).siblings('.name_box').empty().append('<input type="text" class="nickname_input" name="nickname_input" maxlength="15" id="team_name" value="' + oldText + '"/>');
				$(this).addClass('hidden');
				$(this).siblings('.nickname_btn').removeClass('hidden');
			});
			$('.nickname_sure').click(function() {
				var nickName = $(".nickname_input").val();
				var data = {
					"nickName": nickName
				};
				var nickname_len = nickName.length;
				if (nickName != "" && nickname_len >= 3 && nickname_len <= 15) {
					$.hhly.ajax({
						url: '/manage/personal/update/nick/name',
						data: {
							nickName: nickName
						},
						success: function(dataMsg) {
							if (dataMsg.result == '0') {
								var thisObj = $('.nickname_exit');
								$('.name_box').text(nickName);
								privateEdit.hideBack(thisObj);
								localStorage.setItem('keyName',nickName);

								sportCommon.login(); //重新加载登录信息
								if (nickName.length > 6) {
									nickName = nickName.substring(0, 6);
									$('.personal_name .l_nickName').html(nickName + "...");
								} else {
									$('.personal_name .l_nickName').html(nickName);
								}

							} else {
								sportCommon.popMsg('error',dataMsg.msg);
							}
						}
					});
				} else {
					return false;
				}
			});
			$('.nickname_exit').click(function() {
				var nickName = localStorage.getItem('keyName');
				var thisObj = $(this);
				thisObj.siblings('.name_box').empty().text(nickName);
				privateEdit.hideBack(thisObj);
				privateEdit.judgecontrol = false;
			});
		},
		//保存用户头像
		updateicon: function() {
			// 初始化Web Uploader
			var uploader = WebUploader.create({
				// 选完文件后，是否自动上传。
				auto: true,
				// swf文件路径
				swf: '/webuploader/Uploader.swf',
				// 文件接收服务端。
				server: '/manage/personal/update/icon',
				// 选择文件的按钮。可选。
				pick: '#filePicker',
				fileNumLimit: 1,
				// 只允许选择图片文件。
				accept: {
					title: 'Images',
					extensions: 'gif,jpg,jpeg,bmp,png',
					mimeTypes: 'image/jpg,image/jpeg,image/png'
				}
			});
			uploader.on('fileQueued', function(file) {
				var $li = $(
						'<div  class="file-item thumbnail head_box">' +
						'<img>' +
						'</div>'
					),
					$img = $li.find('img');
				// $list为容器jQuery实例
				$(".head_box").empty();
				$(".head_box").append($li);
				// 创建缩略图
				uploader.makeThumb(file, function(error, src) {
					if (error) {
						$img.replaceWith('<span>不能预览</span>');
						return;
					}
					$img.attr('src', src);
				});
			});
			uploader.on('uploadSuccess', function(file, response) {
				//            teamInfor.responseImg=response;
				uploader.removeFile(file);
				uploader.reset();
				sportCommon.login(); //重新加载登录信息
				$('.personal_head img').attr('src', response.iconFileUrl);
			});
		},
		//保存提交
		updateuserinfor: function(form) {
			if(!privateEdit.judgeCommit){
				return false;
			}
			if(privateEdit.ajaxAbort){
				privateEdit.ajaxAbort.abort();
			}
			var data = {};
			data.province = $('input[name="province"]').val();
			data.city = $('input[name="city"]').val();
			data.area = $('input[name="area"]').val();
			data.signature = $('input[name="signature"]').val();
			data.userAge = $('input[name="userAge"]').val();
			data.height = $('input[name="height"]').val();
			data.weight = $('input[name="weight"]').val();
			data.sex = $("input[name='sex'][checked='checked']").val();
			privateEdit.judgeCommit=false;
			privateEdit.ajaxAbort=$.ajax({
				type: "POST",
				url: "/manage/personal/update/user/info",
				data: data,
				dataType: "json",
				traditional: true,
				success: function(data) {
					layer.open({
						scrollbar: false,
						move: false,
						area:'440px',
						title: '温馨提示',
						content: '<span class="at_span success"></span><span class="dialog_tips">保存成功</span>',
						btn: ['确定', '取消'],
						yes:function(index,layero){
							privateEdit.judgeCommit=true;
							layer.close(index);
						},
						end:function(){
							privateEdit.judgeCommit=true;
						}
					});
				},
				error: function(error) {
					privateEdit.judgeCommit=true;
					sportCommon.popMsg('error','系统异常');
				}
			});
		},
		// 表单验证
		formVaridate: function() {
			var validator = $(".person_edit").validate({
				focusInvalid: true, //当为false时，验证无效时，没有焦点响应
				onfocusout: function(element) {
					$(element).valid();
				},
				onkeyup: function(element) {
				},
				submitHandler: function(form) { //表单提交句柄,为一回调函数，带一个参数：form
					privateEdit.updateuserinfor(form); //提交表单
				},
				rules: {
					province: {
						required: true,
						range: [0, 100000000]
					},
					city: {
						required: true,
						range: [0, 100000000]
					},
					area: {
						required: true,
						range: [0, 100000000]
					},
					signature: {
						required: true,
						maxlength: 22
					},
					userAge: {
						required: true,
						digits: true,
						range: [0, 99]
					},
					height: {
						required: true,
						number: true,
						range: [120, 250]
					},
					weight: {
						required: true,
						number: true,
						range: [40, 250]
					}
				},
				messages: {
					province: {
						required: "省份不能为空",
						range: '省份不能为空'
					},
					city: {
						required: "市区不能为空",
						range: '市区不能为空'
					},
					area: {
						required: "区域不能为空",
						range: '区域不能为空'
					},
					signature: {
						required: "签名为必填选",
						maxlength: "最多输入22个字符"
					},
					userAge: {
						required: "请输入年龄",
						digits: "年龄必须为整数",
						range: '年龄范围在0~99'
					},
					height: {
						required: '请输入身高',
						number: '必须输入数字',
						range: '身高范围是120~250'
					},
					weight: {
						required: '请输入体重',
						number: '必须输入数字',
						range: '体重范围是40~250'
					}
				}

			});
		},
		// input初始化
		inputInit: function() {
			$.hhly.inputbox({
				wrap:'div[name="compet_positon"],div[name="compet_tag"]',
				callback:function(that){
					if ($(that).parents('.time_plan').find('.cb_active').length >= 2) {
						privateEdit.judgecontrol = false;
					} else {
						privateEdit.judgecontrol = true;
					}
					if (!$(that).hasClass('cb_active')) {
						if (privateEdit.judgecontrol) {
							$(that).toggleClass('cb_active').children().attr('checked', ($(that).hasClass('cb_active') ? true : false));
						}
					} else {
						$(that).toggleClass('cb_active').children().attr('checked', ($(that).hasClass('cb_active') ? true : false));
					}
				}
			});
			$.hhly.inputbox({
				wrap:'div[name="match_select"],[name="sex"]',
				width:100
			});
			// 省市县初始化
			$.getJSON('/resources/json/area.json', function(data) {
				$('.city_box .team_location_control').ganged({
					'data': data,
					'width': 110,
					'height': 28
				});
			});
		},
		// 认证初始化
		authLoad:function(){
			$('.inAuth').off('click').on('click', function() {
				$.get($(this).attr('hhly-url'), {}, function(data) {
					$('.personal_menu .my_approve .l_per_con').addClass('liHover');
					$("#manage_contents").html(data);
				}, "html");
			});
		},
		init: function() {
			this.formVaridate();
			this.inputInit();
			this.editNickName();
			this.updateicon();
			$.hhly.textAccount({
				wrap: '.team_signbox',
				max: 22
			});
			$('.team_signbox input').trigger('blur');//此句加上有bug
		}
	};
	var defName = $(".name_box").text();
	var setName = localStorage.setItem('keyName',defName);
	privateEdit.init();


});