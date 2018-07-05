require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
		'personal':'/resources/js/manage/userCenter/common.js?v=5352b1e182',
		'ueConfig':'/resources/ueditor/ueditor.config.js?v=75d3a84804',
		'ueAll':'/resources/ueditor/ueditor.all.js?v=75dd069bb9',
		'webuploader':'/resources/js/jquery/webuploader/webuploader.min.js?v=77f65ac437',
		'ganged':'/resources/js/jquery/jquery.ganged.js?v=6f8a2b7f9a',
		'validate':'/resources/js/jquery/jquery.validate.min.js?v=37393e7134',
		'sortable':'/resources/js/jquery/jquery.sortable.js?v=67dc849663',
		'publish':'/resources/js/publish/publish.js?v=cb275857dd',
		'ZeroClipboard':'/resources/ueditor/third-party/zeroclipboard/ZeroClipboard.js?v=52f00fd2ad'
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
		'ueAll':{
			deps:['jquery','ueConfig','ZeroClipboard']
		},
		'webuploader':{
			deps:['jquery']
		},
		'ganged':{
			deps:['jquery']
		},
		'validate':{
			deps:['jquery']
		},
		'publish':{
			deps:['jquery']
		}
    },
});
require(['jquery', 'hhlyAction', 'layer','webuploader','validate','ZeroClipboard','publish','common','i18n','personal','ueAll'],function($,hhlyAction,layer,WebUploader,validate,ZeroClipboard,publish){
	var articleEdit={
		articleUEditor: null,
		insertFlag : true,
		judgeSubmit:true,
		judgeView:true,
		aueditorInit:function(){
			window.ZeroClipboard = ZeroClipboard;
			UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
			UE.Editor.prototype.getActionUrl = function(action){
				if (action == 'uploadimage') {
					return "/upload/image/";
				} else if (action == 'uploadvideo') {
					return "/upload/video/";
				} else if (action == "uploadfile") {
					return "/upload/image/";
				} else if (action == "listimage") {
					return "/upload/listimage/";
				} else if (action == 'uploadscrawl') {
					return "/upload/image/";
				} else if (action == "videolist"){
					return "/upload/listvideo/";
				} else {
					return this._bkGetActionUrl.call(this, action);
				}
			};
			var aueditor = UE.getEditor('publichArticelContainer', {
				toolbars : [ [ 'undo', 'redo', 'bold', 'italic', 'underline',
						'forecolor', 'justifyleft', 'justifyright',
						'justifycenter', 'justifyjustify', 'removeformat',
						'simpleupload', 'insertimage', 'pagebreak' ] ], //'insertvideo' 视频插入暂时去掉
				autoHeightEnabled : true,
				autoFloatEnabled : true,
				imageUrlPrefix : "",
				imageManagerUrlPrefix : "",
				scrawlUrlPrefix : "",
				snapscreenUrlPrefix : "",
				catcherUrlPrefix : "",
				videoUrlPrefix : "",
				fileUrlPrefix : "",
				fileManagerUrlPrefix : "",
				initialFrameHeight : 500
			});
			//监听ueditor编辑器内容变化做自动分页
			//避免触发多次
			aueditor.addListener( 'contentChange', function( editor ) {
				var resultArr = aueditor.getContent().split('_ueditor_page_break_tag_');
				if(resultArr[resultArr.length - 1].replace(/<[^>]+>/g,"").length >= 5000 && articleEdit.insertFlag){
					articleEdit.insertFlag = false;
					aueditor.execCommand( 'pagebreak');
					articleEdit.insertFlag = true;
				}
			});
			aueditor.ready(function() {//编辑器初始化完成再赋值
				var text = $("#articleContentHide").val();
				if(text.length > 0){
					var texts = text.split("_ueditor_page_break_tag_");
					for(var i = 0; i< texts.length;i++){
						var endLength = "<p><br/></p>".length;
						if(texts[i].length > endLength && texts[i].substring(texts[i].length - endLength,texts[i].length) == '<p><br/></p>'){
							texts[i] = texts[i].substring(0,texts[i].length - endLength);
						}
						console.log(texts[i])
						aueditor.execCommand( 'inserthtml', texts[i]);
						if(i < texts.length - 1){
							aueditor.execCommand( 'pagebreak');
						}
					}
				}
			});
			return aueditor;
		},
		videoShowWordNum:function(target,maxLength){
			var wordNum = $(target).val().length;
			if(wordNum > maxLength){
				$(target).val($(target).val().substring(0,maxLength));
				$(target).parent().find('.text_now').html(maxLength);
			}
			else{
				$(target).parent().find('.text_now').html(wordNum);
			}
		},
		textAccount:function(){
			articleEdit.videoShowWordNum($('#articleTitleInput'),30);
			articleEdit.videoShowWordNum($('#articleDigest'),120);
		},
		//选择封面弹窗
		coverSelect:function(aueditor){
			$("#add_article_cover").click(function(){
				var coverDialog=layer.open({
					scrollbar: false,
					move: false,
					area:['750px','630px'],
					title: msgUtil.getTxt("news_select_cover"),
					btn:[msgUtil.getTxt("common_sure"),msgUtil.getTxt("common_cancel")],
					content: '<div class="cover_dialog">'
							+'	<div class="cover_container">'
							+'		<div class="cover_title">'
							+'			'+msgUtil.getTxt("news_articleCover_tip")
							+'		</div>'
							+'		<div class="cover_content">'
							+'			<ul class="cover_dialog_list"></ul>'
							+'		</div>'
							+'	</div>'
							+'</div>',
					success: function(layero, index){
						$('.cover_dialog_list').html('');
						//获取文章里面的图片
						$(aueditor.getContent()).find('img').each(function(){
							if($(this).attr("src").indexOf('/f/') > 0 || $(this).attr("src").indexOf('/fv/') > 0){
								$('.cover_dialog_list').append('<li><img width="100%" src="'+$(this).attr("src")+'"></li>');
							}
						});
					},
					yes:function(){
						$(".cover_dialog .cover_dialog_list li.active").each(function(){
							$('#articleCoverList').append('<li class="cover_first"><img src="'+$(this).find("img").attr("src")+'"><b class="del_cover article_del_cover"></b></li>');
						});
						layer.close(coverDialog);
						if($("#articleCoverList .article_del_cover").length >= 3){
							$("#add_article_cover").hide();
						}
					}
				});
			});
		},
		// 封面图片选择高亮显示
		coverLight:function(){
			$("body").off("click", '.cover_dialog_list li'); //千万不要去掉
			$("body").on("click", '.cover_dialog_list li', function() {
				if ($(".cover_dialog_list li.active").length < (3 - $("#articleCoverList .article_del_cover").length)) {
					if ($(this).hasClass("active")) {
						$(this).removeClass("active");
					} else {
						$(this).addClass("active");
					}
				} else {
					$(this).removeClass("active");
				}
			});
		},
		//切换提示
		slideTips:function(){
			$(".lookProblems").click(function(){
				$(this).next().toggleClass("problems");
			});
		},
		// 删除封面图片
		deleteCoverPic:function(){
			$("#articleCoverList").on('click','.article_del_cover',function(){
				$(this).parent().remove();
				$("#add_article_cover").show();
			});
		},
		articleError:function(error){
			layer.open({
				scrollbar: false,
				move: false,
				area:['440px'],
				title: msgUtil.getTxt("common_dialog_title"),
				content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">'+msgUtil.getTxt("common_failSave")+'</span></div>'
			});
			$('#publishing').val('0');
			articleEdit.judgeSubmit=true;
		},
		// 咨询保存
		articleSave:function(type,timingPublish,aueditor,saveCallback){
			if(!articleEdit.judgeSubmit){
				return false;
			}
			var saving = $('#publishing').val();
			if(saving == '1'){
				return;
			}
			var cateId = $('#articleBigCategory .opts a[class="selected"]').attr("val");
			var content = $.trim(aueditor.getContent());
			if($(content).text().length < 10){
				layer.open({
					scrollbar: false,
					move: false,
					title: msgUtil.getTxt("common_dialog_title"),
					area:['440px'],
					content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">'+msgUtil.getTxt("news_content_minlength")+'</span></div>'
				});
				return;
			}
			var title = $('#articleTitleInput').val();
			var digest = $('#articleDigest').val();
			var covers = "";
			if($('#articleCoverList').find('img').length == 2){
				layer.open({
					scrollbar: false,
					move: false,
					title: msgUtil.getTxt("common_dialog_title"),
					area:['440px'],
					content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">'+msgUtil.getTxt("news_cover_length")+'</span></div>'
				});
				return;
			}
			$('#articleCoverList').find('img').each(function(){
				var url = $(this).attr("src");
				if(url.indexOf("://")!=-1){
					url = url.substring(url.indexOf("/",10),url.length);
				}
				covers += ","+url;
			});
			if(covers.length > 0){
				covers.substring(1,covers.length);
			}
			var plainpublishtime = "";
			if(timingPublish){
				plainpublishtime = $('.time_publish .publish_date').text()+" "+$('.time_publish .publish_hour').text()+":"+$('.time_publish .publish_minute').text()+":00";
			}
			var status = type;
			var articleId = $('#articleId').val();
			var typeUrl='/manage/news/articleSave';
			var tagsObj = $('.tags_box').find('.cb_active');
			var tags='';
			if (tagsObj.length === 0) {
				layer.open({
					scrollbar: false,
					move: false,
					title: msgUtil.getTxt("common_dialog_title"),
					area:['440px'],
					content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">请选择标签！！</span></div>'
				});
				return
			}
			$('#publishing').val('1');
			tagsObj.each(function(index, el) {
				// tags.push($(this).attr('val'))
				if(index!=0){
					tags=tags +',' + $(this).attr('val')
				} else {
					tags = $(this).attr('val')
				}
			});
			var articleData={title:title,cateId:cateId,content:content,cateId:cateId,articleId:articleId,
		        	covers:covers,summary:digest,plainpublishtime:plainpublishtime,publishStatus:status,labels:tags};
	    	articleEdit.judgeSubmit=false;
			$.hhly.ajax({
				url:typeUrl,
				data:articleData,
				success:function(data){
					$('#publishing').val('0');
					if (data.result == '0' || data.result == 0) {
						$('#articleId').val(data.data);
						if($(".publish_list").length == 3){//新增发布页面才刷
							//成功后刷新当前页面为空白
							var menuUrl = '/manage/news/goAdd';
							var menuData = {
								type: 0
							};
							$.hhly.ajax({
								url: menuUrl,
								data: menuData,
								dataType: 'html',
								success: function(data) {
									$(".publish_list").eq(0).html(data);
								}
							});
						}
						var goStatus = 1;
						if(status == 0 || status == 3){
							goStatus = 0;
						}
						layer.open({
							scrollbar: false,
							move: false,
							title: msgUtil.getTxt("common_dialog_title"),
							area:['440px'],
							content: '<div class="dialog_tip_box text"><span class="at_span success"></span><span class="dialog_tips">'+msgUtil.getTxt("common_successSave")+'</span></div>',
							btn: [msgUtil.getTxt("news_stay"),msgUtil.getTxt("news_go_admin")],
							btn2:function(layero, index){
								location.href="/manage/content/news?type="+type;
								layer.close(layero);
							}
						});	
					} else {
						layer.open({
							scrollbar: false,
							move: false,
							area:['440px'],
							title: msgUtil.getTxt("common_dialog_title"),
							content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">'+data.msg+'</span></div>'
						});
					}
					articleEdit.judgeSubmit=true;
				},
				eCallback:articleEdit.articleError
			});
		},
		//发布按钮
		articlePublish:function(aueditor){
			$('#articlePublishButton').click(function(){
				articleEdit.formVaridate(1,false,aueditor);
			});
		},
		// 草稿按钮
		draftBtn:function(aueditor){
			$('#articleDraftButton').click(function(){
				articleEdit.formVaridate(3,false,aueditor);
			});
		},
		//表单验证
		formVaridate:function(type,timingPublish,aueditor,saveCallback){
			$('#articleTitleInput').val($.trim($('#articleTitleInput').val()));
			$('#articleDigest').val($.trim($('#articleDigest').val()));
			articleEdit.videoShowWordNum($('#articleTitleInput'),30);
			articleEdit.videoShowWordNum($('#articleDigest'),120);
			var content = $.trim(aueditor.getContent());
			var digest = $('#articleDigest').val();
			if($.trim(digest).length==0){
				if($(content).text().length > 10){
					$('#articleDigest').val($(content).text().substring(0,120));
				}
			}
			var validator=$("#ImforPublishForm").validate({
				focusInvalid: true, //当为false时，验证无效时，没有焦点响应
				onfocusout: function(element) {
					$(element).valid();
				},
				onkeyup: false,
				submitHandler: function(form) { //表单提交句柄,为一回调函数，带一个参数：form
					articleEdit.articleSave(type,timingPublish,aueditor,saveCallback);
				},
				rules: {
					articleTitleInput: {
						required: true,
						minlength: 8
					},
					bigArticleCategory: {
						required: true,
						range: [1, 1000]
					}
				},
				messages: {
					articleTitleInput: {
						required: msgUtil.getTxt("news_title_required"),
						minlength: msgUtil.getTxt("news_title_minlength")
					},
					bigArticleCategory: {
						required: msgUtil.getTxt("news_cateone_required"),
						range: msgUtil.getTxt("news_cateone_range")
					}
				}
			});
			$("#ImforPublishForm").submit();
		},
		// 预览功能
		preview:function(aueditor){
			var newData=new Date();
			var year=newData.getFullYear();
			var month=articleEdit.addZero(newData.getMonth()+1);
			var date=articleEdit.addZero(newData.getDate()); 
			var h=articleEdit.addZero(newData.getHours());    
			var m=articleEdit.addZero(newData.getMinutes());
			var now=year+'-'+month+"-"+date+" "+h+':'+m;
			$('#articlePreviewButton').click(function(){
				if(!articleEdit.judgeView){
					return false;
				}
				articleEdit.judgeView=false;
				if(aueditor.getContent().replace(/_ueditor_page_break_tag_/g,"").length>0){
					layer.open({
						scrollbar: false,
						move: false,
						area:['700px','600px'],
						title: msgUtil.getTxt("common_preview"),
						content: '<h2 class="preview_title">'+$('#articleTitleInput').val()+'</h2>'
								+'<span class="preview_date">'+now+'</span>'
								+'<div class="preview_wrap">'
								+'	<div class="preview_digest">'
								+'		<span class="digest_title" style="font-weight: bold;">'+msgUtil.getTxt("news_digest")+'：</span>'
								+'		<span>'
								+			$.trim($('#articleDigest').val())
								+'		</span>'
								+'	</div>'
								+'	<div class="preview_content">'
								+aueditor.getContent().replace(/_ueditor_page_break_tag_/g,"")
								+'	</div>'
								+'</div>'
					});
					articleEdit.judgeView=true;
				}else{
					layer.open({
						scrollbar: false,
						move: false,
						title: msgUtil.getTxt("common_dialog_title"),
						area:['440px'],
						content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">'+msgUtil.getTxt("news_preview_default")+'</span></div>',
						yes: function(index){
							layer.close(index);
							if(saveCallback){
								saveCallback();
							}
						}
					});
					articleEdit.judgeView=true;
				}
			});
		},
		inputInit:function(){
			$.hhly.inputbox({
				wrap:'div[name="bigArticleCategory"]'
			});
			$.hhly.inputbox({
				wrap:'div[name="define_tags"]',
				callback: function(that){
					if ($(that).hasClass('cb_active')){
						$(that).removeClass('cb_active');
					}else{
						var parentNode = $(that).parents('.tags_box');
						if (parentNode.find('.cb_active').length>2) {
							return false;
						} else {
							$(that).addClass('cb_active');
						}
					}
				}
			})
		},
		addZero:function(num){
			return (num < 10)?("0"+num):num;
		},
		reload:function(aueditor){
			aueditor.execCommand('cleardoc');
			$('#articleTitleInput').val('');
			$('#articleDigest').val('');
			$('body').find('label.error').empty();
			$('#articleCoverList').empty();
			$(document).trigger('click.input');
			$('#add_images_cover').css('display','block');
		},
		init:function(){
			var aueditor=articleEdit.aueditorInit();
			this.articleUEditor = aueditor;
			$.hhly.textAccount({wrap:'#ImforPublishForm .add_title',input:'input',max:30});
			$.hhly.textAccount({wrap:'.publish_digest_content',input:'textarea',max:120});
			this.coverSelect(aueditor);
			this.coverLight();
			this.slideTips();
			this.deleteCoverPic();
			this.articlePublish(aueditor);
			this.draftBtn(aueditor);
			this.preview(aueditor);
			this.inputInit();
			publish.init(articleEdit);
		}
	};
	articleEdit.init();

});

