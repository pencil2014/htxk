require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
		'personal':'/resources/js/manage/userCenter/common.js?v=5352b1e182',
		'webuploader':'/resources/js/jquery/webuploader/webuploader.min.js?v=77f65ac437',
		'validate':'/resources/js/jquery/jquery.validate.min.js?v=37393e7134',
		'emailAutoComplete':'/resources/js/jquery/jquery.emailAutoComplete.js?v=e1861acf80'
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
		'emailAutoComplete':{
			deps:['jquery']
		},
    },
});
require(['jquery', 'hhlyAction','webuploader','validate', 'emailAutoComplete','layer','common','i18n','personal'],function($,hhlyAction,WebUploader){
	var approve={
		firstSelectId : null,
		secondSelect : false,
		secondSelectArr:[],
		relevanceFirstMenuArr : [],
		relevanceSecondMenuArr : [],
		relevanceThirdMenuArr : [],
		firstSelectNode : null,			//一级菜单当前选择节点
		secondSelectNode : null,		//一级菜单当前选择节点
		thridSelectNode : null,			//一级菜单当前选择节点
		sendDataArr :[],
		uploadInit:function(box,btn){
			var uploader = WebUploader.create({
				// 选完文件后，是否自动上传。
				auto: true,
				// swf文件路径
				swf: '/resources/js/jquery/webuploader/Uploader.swf',
				// 文件接收服务端。
				// server: '/team/manage/info/upload?teamId=' + orgId,
		        server: '/manage/personal/approve/uploadSource',
				// 选择文件的按钮。可选。
				pick: btn,
				fileNumLimit: 1,
				// 只允许选择图片文件。
				accept: {
					title: 'Images',
					extensions: 'gif,jpg,jpeg,bmp,png',
					mimeTypes: 'image/jpg,image/jpeg,image/png'
				}
			});
			uploader.on('ready', function() {
				var name=btn.slice(1)+'_file';
				$(btn).find('input').attr('name',name);
	        });
			uploader.on('fileQueued', function(file) {
				var $li = $(
						'<div  id="' + file.id + '" class="file-item thumbnail head_box">' +
						'<img width="100%">' +
						'</div>'
					),
					$img = $li.find('img');
				// $list为容器jQuery实例
				$(box).empty().append($li);
				$(btn).addClass('reupload');
				$('#idcard_select_file-error').addClass('hidden');

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
				if(btn == '#idcard_select'){
					$('#idcardUrl').val(response.path);
				}else{
					$('#ortherUrl').val(response.path);
				}
				uploader.removeFile(file);
				uploader.reset();
			});
			// 文件上传失败，现实上传出错。
		    uploader.on( 'uploadError', function( file ) {
		        var $li = $( '#'+file.id ),
		            $error = $li.find('div.error');

		        // 避免重复创建
		        if ( !$error.length ) {
		            $error = $('<div class="error"></div>').appendTo( $li );
		        }
		        $error.text('上传失败');
		    });

		    // 完成上传完了，成功或者失败，先删除进度条。
		    uploader.on( 'uploadComplete', function( file ) {
		        $( '#'+file.id ).find('.progress').remove();
		    });
		},
		stepSlide:function(){
			$('.prove_wrap').on('click','.mit_submit',function(){
				//$(this).parents('.approve_container').addClass('hidden').next().removeClass('hidden');
				if($(this).hasClass('first-page')){
					approve.setFirstValue();
					$('.aprove_navbox li').eq(1).addClass('active');
					$(this).parents('.approve_container').addClass('hidden').next().removeClass('hidden').find("form").show();
				}else if($(this).hasClass('thrid-page')){
					$('.aprove_navbox li').eq(1).addClass('active');
				}else{
					approve.secondSelect = true;
				}
			});
		},
		inforForm:function(callback){
			var html='<div class="form_error"></div>';
			jQuery.validator.addMethod("checkPic", function(value, element) {
				var img = $("#idcard_box").find('img');
				//console.log(img);
				if (img.length>0) {
					return true;
				} else {
					return false;
				}
			}, html+"请上传身份证正面照");
			jQuery.validator.addMethod("telphone", function(value, element) {
				var length = value.length;
				var mobileNum =/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
				return  mobileNum.test(value);
			}, html+"请您输入正确格式的手机号码");
			jQuery.validator.addMethod("defineEmail", function(value, element) {
				var email =/^[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+$/;
				return  email.test(value);
			}, html+"请您输入正确格式的邮箱");
			$('.infor_form').validate({
				//errorClass: "label.error", //默认为错误的样式类为：error
				focusInvalid: true, //当为false时，验证无效时，没有焦点响应
				onfocusout: function(element) {
					var name=$(element).attr('name');
					if(name.indexOf('email')!=-1){
						setTimeout(function(){
							$(element).valid();
						},500);
					}else{
						$(element).valid();
					}

				},
				onkeyup: false,
				submitHandler: function(form) { //表单提交句柄,为一回调函数，带一个参数：form
					if(typeof(callback)==='function'){
						callback(form);
					}
				},
				rules: {
					personName: {
			    		required: true
					},
					phone:{
						required: true,
						telphone:true
					},
					email:{
						required: true,
						defineEmail:true
					},
					idcard_select_file:{
						checkPic: true
					}
			    },
			    messages: {
			    	personName: {
			    		required: html+'请输入真实姓名'
					},
					phone:{
						required: html+'请输入手机号'
					},
					email:{
						required: html+'请输入电子邮箱'
					},
					idcard_select_file:{
						required: html+'请上传身份证正面照'
					}
			    }
			});
		},
		setAttribute:function(form){
			$(form).parents('.approve_container').addClass('hidden').next().removeClass('hidden');
		},
		setMenuState : function(){
		},
		//获取二级菜单节点
		getIpCateList:function(){
			$('.step_list ').on('click','li', function(){
				var cateId=$(this).attr('hhly-value');
				var cateData = {parentId:cateId};
				var that = this;
				approve.firstSelectNode = $(this);		//获取当前点击的一级菜单节点
				$('.content_type_list').empty();
				$(this).parents('.approve_container').find('.step_menu_list').empty();
				$(this).parents('.approve_container').find('.other_content_list').empty();
				if(!approve.secondSelect){
					approve.firstSelectId = cateId;
				}else if(approve.secondSelect && approve.firstSelectId == cateId){	//同一页选中节点相同，提示
					layer.open({
						scrollbar: false,
						move: false,
						area: '440px',
						title: '温馨提示',
						content: '<span class="at_span warn"></span><span class="dialog_tips">所选属性不能与一级属性相同</span>',
					});
					return;
				}else{}
				$(this).addClass('active');
				approve.getFirstMenuData(this,cateData);
				
			});
			$('.aprove_navbox').find('li').eq(0).addClass('active');
			$('.step_list li').eq(0).click();		//初始化进入第一个页面默认选中第一个
		},
		getFirstMenuData : function(self,cateData){
			$.hhly.ajax({
				url:'/manage/personal/approve/ipCateList',
				data:cateData,
				success:function(data){
					var subMenu='',
						subMenuContent = $(self).parent('ul').next().find('.step_menu_list');
					$('.step_content').addClass('hidden');
					if(data.length>0){
						if(!approve.secondSelect){		//判断是否为第三页一级身份选择
							$(self).addClass('active').siblings().removeClass('active');
							$(self).find('.first_text').css('color','#00cd9d');
							$(self).siblings().find('.first_text').css('color',"#000");
						}
						$(self).addClass('active').siblings('.active').removeClass('active').find('.first_text').css('color','#00cd9d');
						for(var i=data.length-1;i>=0;i--){
							subMenu+='<li hhly-value="'+data[i].ipCateId+'">'+data[i].cateName+'</li>';
						}
						subMenuContent.empty().append(subMenu);//.find('li').eq(0).click();	//初始化进入第一个页面默认选中第一个.removeClass('active')
						var dataArr = [];
						$('.fouth_menu_content li').each(function(index,el){
							dataArr.push($(el).attr('hhly-value'));
						});
						subMenuContent.find('li').each(function(index,el){
							if(dataArr.indexOf($(el).attr('hhly-value')) != -1){
								$(el).addClass('active');
							}
						});
						$('.step_content').removeClass('hidden');
					}else{
						//$(self).addClass('active');
						var value = $(self).attr('hhly-value');
						var text = $(self).text();
						if(!approve.secondSelect){		//判断是否为第三页一级身份选择
							$(self).addClass('select').find('.first_text').css('color','#00cd9d');
							$(self).removeClass('active');
							$(self).siblings().removeClass('select').find('.first_text').css('color',"#000")
							return;
						}
						$(self).addClass('active').siblings('.active').removeClass('active').find('.first_text').css('color','#00cd9d');
						$(self).removeClass('active').find('.first_text').css('color','#00cd9d');
						

						if(approve.sendDataArr.indexOf(value) != -1){
							return;
						}
						approve.sendDataArr.push(value);
						var html = '<li hhly-value="'+value+'"><div class="selected_text">'+text+'</div><div class="selected_icon"></div></li>';
						$('.fouth_menu_content').append(html);
						$('.fouth_menu_content').parents('.selected_menu').removeClass('hidden');
					}
					$(".fouth_menu_content li").each(function(index,el){
						$('.second_menu_content li').each(function(index,node){
							if($(node).attr("hhly-value") == $(el).attr("parentid")){
								$(node).addClass("active");
							}
						});
					});
				}
			});
		},
		//渲染二级菜单样式
		randenSecondMenu : function(){
			$('.thrid_menu_content li').each(function(index,el){
				if(approve.relevanceThirdMenuArr.indexOf(($(el).attr('hhly-ipcateid'))) != -1){
					$(el).addClass('active');
				}
			});
		},
		// 得到第三级菜单
		getThereMenu:function(){
			$('.step_content .step_menu_list').on('click',' li', function(){
				var cateId=$(this).attr('hhly-value');
				var isThidePage = $(this).parents('h3').hasClass('second_menu_content');
				if(isThidePage && approve.relevanceSecondMenuArr.indexOf(cateId) == -1){  //二级菜单数组判断 当前节点id是否存在
					approve.relevanceSecondMenuArr.push(cateId);
				}
				approve.secondSelectNode = $(this);		//获取当前点击的二级菜单节点
				var that=this;
				var cateData = {parentId:cateId};
				var firstMrnuCateId = approve.firstSelectNode.attr('hhly-value');	//获取当前父级一级节点的id
				var index = approve.relevanceFirstMenuArr.indexOf(firstMrnuCateId);	
				$(this).parents('.approve_container').find('.other_content_list').empty();//清空三级显示框
				if(index != -1){
					approve.relevanceFirstMenuArr.splice(index,1);		//将当前父级一级节点的id从保存父级id的一级菜单数组中删除
				}
				if($(that).parents('h3').hasClass('second_menu_content')){		//若是第三页点击添加样式
					$(that).addClass('active')
				}else{
					$(that).addClass('active').removeClass('select_active').siblings().removeClass('active');//第一页点击样式切换
				}
				$.hhly.ajax({
					url:'/manage/personal/approve/ipCateList',
					data:cateData,
					success:function(data){
						$('.step_content .content_box').addClass('hidden');
						var listContentNode = $(that).parents('.step_menu').next().find('.content_type_list');
						if(data.length>0){
							var subMenu="";
							for(var i=data.length-1;i>=0;i--){
								subMenu+='<li hhly-ipCateId="'+data[i].ipCateId+'">'+data[i].cateName+'</li>';
							}

							$('.step_content .content_box').removeClass('hidden');
							listContentNode.empty().append(subMenu);
							approve.randenSecondMenu();			//二级菜单切换，添加三级菜单样式
							if(!approve.secondSelect){		//为第一个页面 三级菜单默认选中第一个
								listContentNode.find('li').eq(0).click();//三级菜单默认选中第一个;
							}
						}else{
							listContentNode.empty()
							if($(this).parents('.approve_type').hasClass('approve_container')){
								$(that).addClass('select_active').siblings().removeClass('active').removeClass('select_active');
							}
							
							$(that).addClass('active');
							var value = $(that).attr('hhly-value');
							var text = $(that).text();
							if(!approve.secondSelect){		//判断是否为第三页一级身份选择
								return;
							}
							if(approve.sendDataArr.indexOf(value) != -1){
								return;
							}
							approve.sendDataArr.push(value);
							var html = '<li hhly-value="'+value+'"><div class="selected_text">'+text+'</div><div class="selected_icon"></div></li>';
							$('.fouth_menu_content').append(html);
							$('.fouth_menu_content').parents('.selected_menu').removeClass('hidden');
						}
					}
				});
			});
		},
		getThereMenuSuccess:function(data){
			var thereMenu='';
			for(var i=data.length-1;i>=0;i--){
				thereMenu+='<li hhly-ipCateId="'+data[i].ipCateId+'">'+data[i].cateName+'</li>';
			}
			$('.step_content .content_type_list').empty().append(thereMenu);
		},
		applyApprove:function(data){
			$('#approveSubmit').on('click', function(){
				var paramteArr = [];
				//paramteArr = approve.relevanceThirdMenuArr.concat(approve.relevanceSecondMenuArr).concat(approve.relevanceFirstMenuArr);
				$('.fouth_menu_content li').each(function(index,el){
					paramteArr.push($(el).attr('hhly-value'));
				});
				paramteArr = approve.uniqueArr(paramteArr);		//数组去重
				approve.getParemater(paramteArr)		//设置隐藏域的值
				$.hhly.ajax({url:'/manage/personal/approve/apply',data:$("#approveForm").serialize(),success:approve.applySuccess});
			});
		},
		applySuccess:function(data){
			layer.open({
				scrollbar: false,
				move: false,
				area: '440px',
				title: '温馨提示',
				content: '<span class="at_span success"></span><span class="dialog_tips">'+data.msg+'</span>',
			});
			$.get('/manage/personal/editInfor',"",function(data){
				$("#manage_contents").html(data);
			},"html");
			return;
		},
		// 三级菜单点击选中
		selectLabel:function(){
			$('.content_box ul').on('click', 'li', function(event) {
				event.preventDefault();
				var type = $(this).parent("ul").attr('list_type');	
				var value = $(this).attr('hhly-ipcateid');
				var secondMenuCateId = approve.secondSelectNode.attr('hhly-ipcateid');	//获取当前父级二级节点的id
				var index = approve.relevanceSecondMenuArr.indexOf(secondMenuCateId);	
				if(index != -1){
					approve.relevanceSecondMenuArr.splice(index,1);							//将当前父级二级节点的id从保存父级id的数组中删除
				}

				if(approve.relevanceThirdMenuArr.indexOf(value) == -1){
					approve.relevanceThirdMenuArr.push(value);
				}
				approve.thridSelectNode = $(this);

				if(type==1){
						$(this).addClass('active').siblings('li').removeClass('active');
						var text=$(this).text();
						var value=$(this).attr('hhly-value');
						var input=$(this).parents('.step_content').siblings('.step_list').find('input');
						if(input.length>0){
							var text=input.val()+','+value;
							input.val(text);
						}else{
							$(this).parents('.step_content').siblings('.step_list').append('<input type="hidden" value=",'+value+'" >');
						}
				}else if(type==2){
					if(!$(this).hasClass('active')){
						$(this).addClass('active');
						var text=$(this).text();
						var value=$(this).attr('hhly-ipcateid');
						var html='<li parentId="'+$('.second_menu_content .active').attr('hhly-value')+'" hhly-value="'+value+'"><div class="selected_text">'+text+'</div><div class="selected_icon"></div></li>';
						var thirdComtemtNode = $(this).parents('.step_content').siblings('.selected_menu').show().find('.item_box ul');
						thirdComtemtNode.find('li').each(function(key,node){
							approve.secondSelectArr.push($(node).attr('hhly-value'));
						})
						thirdComtemtNode.append(html);
						var input=$(this).parents('.step_content').siblings('.selected_menu').find('input');
						if(input.length>0){
							var text=input.val()+','+value;
							input.val(text);
						}else{
							$(this).parents('.step_content').siblings('.selected_menu').append('<input type="hidden" value=",'+value+'" >');
						}
						//approve.setThridPage();
					}
				}
				
			});
			
			//三级菜单点击选中
			/*$(".content_type_list").on('click','li',function(){
				$(".content_type_list li").removeClass("active");
				$(this).addClass("active");
			});*/
		},
		selectTypeTab : function (selectBox, childrens, className) {
			$(selectBox).children(childrens).on("click", function () {
				$(selectBox).children(childrens).removeClass(className);
				$(this).addClass(className);
				var $sibling = $(this).parent().parent().next().children();
				var showIndex = $(this).index();
				$sibling.hide().eq(showIndex).show();
			});
		},
		// 删除已选择
		delectSelect:function(){
			$('.selected_menu .item_box ul').on('click', '.selected_icon', function(){
				var value=$(this).parent('li').attr('hhly-value');
				var input=$(this).parents('.selected_menu').find('input');
				var inputValue=input.val();
				//inputValue=inputValue.toString().replace(','+value,'');
				//if(inputValue.length==0){
				//	$(this).parents('.selected_menu').addClass('hidden');
				//}
				input.val(inputValue);
				var test=$(this).parents('.selected_menu').siblings('.step_content').find('.list_box').not(".hidden").find('.content_box>ul>li');
				test.each(function(index, el) {
					var btnValue=$(this).attr('hhly-ipcateid');
					if(btnValue==value){
						$(this).removeClass('active');
					}
				});
				var newIndex = approve.sendDataArr.indexOf(value)
				approve.sendDataArr.splice(newIndex,1);
				
				var paramteArr = [];
				$('.fouth_menu_content li').each(function(index,el){
					paramteArr.push($(el).attr('hhly-value'));
				});
				$('.relevance_attr li.active').each(function(index,el){
					var valueId = $(el).attr('hhly-value') ||　$(el).attr('hhly-ipcateid');
					if(paramteArr.indexOf(valueId) != -1){
						$(el).removeClass('active').find('.first_text').css('color','#000');
					}
				});
				
				var index = approve.relevanceThirdMenuArr.indexOf(value);	
				if(index != -1){								//删除三级数组中的当前元素id值
					approve.relevanceThirdMenuArr.splice(index,1);
					$('.other_content_list li').each(function(index,el){
						var value = $(el).attr('hhly-ipcateid');
						if(approve.relevanceThirdMenuArr.indexOf(value) == -1){
							$(el).removeClass('active');
						}else{
							//$(el).addClass('active');
						}
					})
				}
				$(this).parent('li').remove();
				var currentParentId = null;
				var parentId = $(this).parent('li').attr('parentId');
				var parentNode = $("[parentId*='"+parentId+"']");
				if(parentNode.length == 0){							//当前三级子节点为0时，将当前元素的父级id从新装入二级数组中
					approve.relevanceSecondMenuArr.push(parentId);
				}
			});
		},
		//返回上一页
		returnPrevPage : function(){
			$('.btn_cencle').on('click',function(){
				if($(this).hasClass('to_first_page')){
					$('.approve_type').removeClass('hidden');
					$('.fill_infor').addClass('hidden');
					$('.relevance_attr').addClass('hidden');
					$('.aprove_navbox li').first().addClass('active').siblings().removeClass('active');
					approve.secondSelect = false;		//返回第一页approve.secondSelect置为false，用于第一页点击判断
				}else if($(this).hasClass('to_second_page')){
					$('.approve_type').addClass('hidden');
					$('.fill_infor').removeClass('hidden');
					$('.relevance_attr').addClass('hidden');
				}
			})
		},
		//设置第一页隐藏域参数值
		setFirstValue : function(){
			if($('.approve_type .content_type_list .active').length){
				$('#ipCateId').val($('.approve_type .content_type_list .active').attr('hhly-ipCateId'));
			}else if($('.approve_type .step_list_content .active').length){
			    $('#ipCateId').val($('.step_menu_list .active').attr('hhly-value'));
			}else{
				$('#ipCateId').val($('.approve_type .step_list .select').attr('hhly-value'));
			}
			var ipCateId = $("#ipCateId").val();			//判断第三页中是否存在第一页选择的id
			$(".thrid_page_list").find("[hhly-value*='"+ipCateId+"']").removeClass("active").find(".first_text").css({"color":"#000"});//移出第三页中已选择相同id值得样式
			$(".fouth_menu_content").find("[hhly-value*='"+ipCateId+"']").remove();	//移出第三页已选择框中相同id值得li
		},
		//设置第三页隐藏域参数值
		setThridPage : function(){
			var activeNode = $('.relevance_attr .content_type_list .active');
			var	hideInputStr = '';
			var paramteArr = [];
			if(this.relevanceThirdMenuArr.length){
				paramteArr = this.relevanceThirdMenuArr;
			}else if(this.relevanceSecondMenuArr.length){
				paramteArr = this.relevanceSecondMenuArr;
			}else{
				paramteArr = this.relevanceFirstMenuArr;
			}
		},
		getParemater : function(paramteArr){
			var htmlStr = "",
			 newValue = null;
			if(paramteArr.length > 0){
				for(var i = 0 ; i < paramteArr.length ; i ++){
					newValue = paramteArr[i]
					htmlStr += '<input type = "hidden"  class="catIds"  name = "catIds" value="'+newValue+'"/>';
				}
			}else{
				newValue = "";
				htmlStr += '<input type = "hidden"  class="catIds"  name = "catIds" value="'+newValue+'"/>';
			}

			$('.catIds').remove();
			$('.input-value-content').empty().append(htmlStr);
			$('.other_content_list li').each(function(index,el){
				var value = $(el).attr('hhly-ipcateid');
				if(approve.relevanceThirdMenuArr.indexOf(value) == -1){
					$(el).removeClass('active');
				}else{
					$(el).addClass('active');
				}
			})
		},
		//点击menu节点，将节点id装入相应数组
		selectThirdTab : function(parentNode,children){
			$(parentNode).on('click',children,function(){
				var value = null,
					paramteArr = [],
					index = -2;
				if($(this).parent(parentNode).hasClass('step_list')){
					value = $(this).attr('hhly-value');
					paramteArr = approve.relevanceFirstMenuArr;
				}else if($(this).parent(parentNode).hasClass('step_menu_list')){
					value = $(this).attr('hhly-ipcateid');
					paramteArr = approve.relevanceSecondMenuArr;
				}else{
					value = $(this).attr('hhly-ipcateid');
					paramteArr = approve.relevanceThirdMenuArr;
				}
				$(this).addClass('active').children('.first_text').addClass('active');		//设置当前点击节点的样式
				index = paramteArr.indexOf(value);		//判断数组是存在这个id
				if(index == -1){
					paramteArr.push(value);
				}
				//approve.setThridPage();
			})
		},
		//数组去重方法
		uniqueArr : function(paramteArr){
			paramteArr.sort(); //先排序
			 var res = [paramteArr[0]];
				for(var i = 1; i < paramteArr.length; i++){
				  if(paramteArr[i] !== res[res.length - 1]){
					  res.push(paramteArr[i]);
				  }
				}
			 return res;
		},
		init:function(){
			this.uploadInit('#idcard_box','#idcard_select');
			this.uploadInit('#othercard_box','#othercard_select');
			this.selectLabel();
			this.delectSelect();
			this.stepSlide();
			this.getIpCateList();
			this.applyApprove();
			this.inforForm(this.setAttribute);
			this.selectTypeTab(".approve_type .first_Page","li","active");
			this.selectTypeTab(".second_menu_content","li","active");
			this.getThereMenu();
			this.returnPrevPage();
		}
	};
	approve.init();
});