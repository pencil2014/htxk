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
		'sortable':'/resources/js/jquery/jquery.sortable.js?v=67dc849663',
		'publish':'/resources/js/publish/publish.js?v=cb275857dd',
		'tn3lite':'/resources/js/jquery/jquery.tn3lite.min.js?v=051502df92',
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
		'webuploader':{
			deps:['jquery']
		},
		'validate':{
			deps:['jquery']
		},
		'sortable':{
			deps:['jquery']
		},
		'publish':{
			deps:['jquery']
		},
		'tn3lite':{
			deps:['jquery']
		},
    },
});
require(['jquery', 'hhlyAction', 'layer','webuploader','validate','sortable','tn3lite','publish','common','i18n','personal'],function($,hhlyAction,layer,WebUploader,validate,sortable,tn3lite,publish){
	var imageEdit={
		selectUploadImgArr : [],
		selectExistImgArr : [],
		isSelectLocalImg : true,
		isSelectMyAlbum : false,
		judgeSave:true,
		judgeImage:true,
		addSuccess:function(data){
			if(!$('#imagesUploadDialog').is(":hidden")){
				$('#imagesRemoteImages').html('');
				for (var i = 0; i < data.list.length; i++) {
					$('#imagesRemoteImages').append('<div class="popup_pic_boxpic popup_select_item"><img src="' + data.list[i].url + '"><i></i></div>');
				}
			}
		},
		// 增加弹出弹窗
		addDialog:function(){
			$('#add_images_button').click(function(){
				var picDialog=layer.open({
					scrollbar: false,
					move: false,
					area:['800px','670px'],
					title: msgUtil.getTxt("news_select_image"),
					content: '	<div class="pic_dialog">'
							+'		<div class="popup_pic_slect">'
							+'			<span class="popup_pic_slect_span" id="local_pic_tab">'+msgUtil.getTxt("news_local_image")+'</span>'
							//+'			<span id="remote_pic_tab">'+msgUtil.getTxt("news_my_image")+'</span>' //暂时不要我的相册
							+'		</div>'
							+'		<div class="popup_pic_push">'
							+'			<span>'+msgUtil.getTxt("news_support_image")+'</span>'
							+'			<div class="popup_pic_push_box" id="imagesUploadDiv">'
							+'				<div id="imagesUploadButton">'+msgUtil.getTxt("news_upload_image")+'</div>'
							+'			</div>'
							+'		</div>'
							+'		<div class="popup_pic_bbox">'
							+'			<div class="popup_pic_box" id="imagesLocalImages"></div>'
							+'		</div>'
							+'		<div class="popup_pic_location">'
							+'			<div class="popup_pic_box_location" id="imagesRemoteImages"></div>'
							+'		</div>'
							+'		<div class="popup_pic_sure">'
							+'			<div class="popup_pic_sure_tip">'+msgUtil.getTxt("news_picked_image")+'</div>'
							+'			<ul>'
							+'				<li class="popup_selected_item"></li>'
							+'				<li class="popup_selected_item"></li>'
							+'				<li class="popup_selected_item"></li>'
							+'				<li class="popup_selected_item"></li>'
							+'				<li class="popup_selected_item"></li>'
							+'				<li class="popup_selected_item"></li>'
							+'				<li class="popup_selected_item"></li>'
							+'				<li class="popup_selected_item"></li>'
							+'				<li class="popup_selected_item"></li>'
							+'			</ul>'
							+'		</div>'
							+'</div>',
					success: function(layero, index){
						$('#imagesUploadDialog .popup_selected_item').each(function(){
							$(this).html('');
						});
						var dialogUrl='/upload/listimage?start=0&size=50';
						//$.hhly.ajax({url:dialogUrl,success:imageEdit.addSuccess}); //暂时去掉我的相册的加载
						imageEdit.imageUpload();
						imageEdit.tabSlide();
						imageEdit.imageSelect();
						imageEdit.clearHtml();
					},
					yes:function(layero, index){
						$('.popup_selected_item').each(function(){
							if($(this).children().length != 0){
								var selectedSrc = $(this).find('img').attr('src');
								var appendHtml = '<li class="sortable_li">'+
								'<div class="images_content_image">'+
									'<img src="'+selectedSrc+'">'+
								'</div>'+
								'<textarea class="imagesShowWordNum" placeholder="'+msgUtil.getTxt("news_image_infoinput")+'"></textarea>'+
								'<i class="del_image"></i>'+
								'</li>';
								$('#imagesList .add_grounpimage').before(appendHtml);
								$.hhly.textAccount({wrap:'.sortable_li',input:'textarea',max:120});
							}
						});
						
						//拖动图片
						layer.close(layero);
						imageEdit.dragInit();
					}
				});
			});
		},
		//删除图片
		deletePic:function(){
			$("#imagesList").on('click','.del_image',function(){
				$(this).parent().remove();
			});
		},
		// input初始化
		inputInit:function(){
			$.hhly.inputbox({
				wrap:'div[name="bigImagesCategory"]'
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
		//切换提示
		slideTips:function(){
			$(".lookProblems").click(function(){
				$(this).next().toggleClass("problems");
			});
		},
		// 选择封面弹窗
		selectCoverDialog:function(){
			$("#add_images_cover").click(function(){
				var coverDialog = layer.open({
					scrollbar: false,
					move: false,
					area: ['800px', '630px'],
					title: msgUtil.getTxt("news_select_cover"),
					content:'<div class="cover_dialog">'
							+'	<div class="cover_container">'
							+'		<div class="cover_title">'
							+'			'+msgUtil.getTxt("news_imagesCover_tip")
							+'		</div>'
							+'		<div class="cover_content">'
							+'			<ul class="cover_dialog_list"></ul>'
							+'		</div>'
							+'	</div>'
							+'</div>',
					success: function(layero, index) {
						$('.cover_dialog_list').html('');
						//获取文章里面的图片
						$('#imagesList').find('img').each(function() {
							if ($(this).attr("src").indexOf('/f/') > 0 || $(this).attr("src").indexOf('/fv/') > 0) {
								$('.cover_dialog_list').append('<li><img width="100%" src="' + $(this).attr("src") + '"></li>');
							}
						});
					},
					yes: function(layero) {
						$(".cover_dialog .cover_dialog_list li.active").each(function(){
							$('#imagesCoverList').append('<li class="cover_first"><img src="'+$(this).find("img").attr("src")+'"><b class="del_cover images_del_cover"></b></li>');
						});
						layer.close(layero);
						if($("#imagesCoverList .images_del_cover").length >= 3){
							$("#add_images_cover").hide();
						}
					}
				});
			});
		},
		// 关闭封面选择弹窗
		closeCoverDialog:function(){
			$("#imagesImage .cover_container_close").click(function(){
				$("#imagesImage").hide();
			});
		},
		//封面图片选择高亮显示
		selectCoverLight:function(){
			$("body").off("click", '.cover_dialog_list li'); //千万不要去掉
			$("body").on("click",'.cover_dialog_list li',function () {
				if ($(".cover_dialog_list li.active").length < (3 - $("#imagesCoverList .images_del_cover").length)) {
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

		deleteCoverPic:function(){
			$("#imagesCoverList").on('click','.images_del_cover',function(){
				$(this).parent().remove();
				$("#add_images_cover").show();
			});
		},
		// 保存
		imageSave:function(type, timingPublish,saveCallback){
			if(!imageEdit.judgeSave){
				return false;
			}
			var saving = $('#imagesPublishing').val();
			if (saving == '1') {
				return;
			}
			var cateId = $('#imagesBigCategory .opts a[class="selected"]').attr("val");
			var content = "";
			var title = $('#imagesTitle').val();
			if ($('#imagesList').find('li').length < 4) {
				layer.open({
					scrollbar: false,
					move: false,
					title: msgUtil.getTxt("common_dialog_title"),
					area:['440px'],
					content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">'+msgUtil.getTxt("news_image_required")+'</span></div>'
				});
				return;
			}
			var contentJson = [];
			var i = 0;
			var imageTextFlag = true;
			$('#imagesList').find('li').each(function(index) {
				if (!($(this).attr("id") == 'add_images_button')) {
					var text = $.trim($(this).find('.imagesShowWordNum').val());
					if(text.length<5){
						layer.open({
							scrollbar: false,
							move: false,
							title: msgUtil.getTxt("common_dialog_title"),
							content: '<span class="at_span warn"></span><span class="dialog_tips">'+msgUtil.getTxt("news_image_at")+(index+1)+msgUtil.getTxt("news_imagetips_minlength")+'</span>'
						});
						imageTextFlag = false;
						return false;
					}
					var imgSrc = $(this).find('.images_content_image').find('img').attr("src");
					if (imgSrc.indexOf("://") != -1) {
						imgSrc = imgSrc.substring(imgSrc.indexOf("/", 10), imgSrc.length);
					}
					var objectJson = {};
					objectJson[imgSrc] = text;
					contentJson[i] = objectJson;
					i++;
				}
			});
			if(!imageTextFlag){
				return;
			}
			var covers = "";
			var coverLength = $('#imagesCoverList').find('img').length;
			if(coverLength == 0 || coverLength == 2){
				layer.open({
					scrollbar: false,
					move: false,
					title: msgUtil.getTxt("common_dialog_title"),
					area:['440px'],
					content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">'+((coverLength==0)?msgUtil.getTxt("news_cover_required"):msgUtil.getTxt("news_cover_length"))+'</span></div>'
				});
				return;
			}
			$('#imagesCoverList').find('img').each(function() {
				var url = $(this).attr("src");
				if (url.indexOf("://") != -1) {
					url = url.substring(url.indexOf("/", 10), url.length);
				}
				covers += "," + url;
			});
			var plainpublishtime = "";
			if (timingPublish) {
				plainpublishtime = $('.time_publish .publish_date').text()+" "+$('.time_publish .publish_hour').text()+":"+$('.time_publish .publish_minute').text()+":00";
			}
			var status = type;
			var articleId = $('#imagesArticleId').val();

			imageUrl='/manage/news/imagesSave';
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
			$('#imagesPublishing').val('1');
			tagsObj.each(function(index, el) {
				// tags.push($(this).attr('val'))
				if(index!=0){
					tags=tags +',' + $(this).attr('val')
				} else {
					tags = $(this).attr('val')
				}
			});
			imageData={title:title,cateId:cateId,content:JSON.stringify(contentJson),articleId:articleId,
	    	covers:covers,plainpublishtime:plainpublishtime,publishStatus:status,labels:tags};
	    	imageEdit.judgeSave=false;
			$.hhly.ajax({
				url:imageUrl,
				data:imageData,
				success:function(data){
					$('#imagesPublishing').val('0');
					if (data.result == '0' || data.result == 0) {
						$('#imagesArticleId').val(data.data);
						if($(".publish_list").length == 3){//新增发布页面才刷
							//成功后刷新当前页面为空白
							var menuUrl = '/manage/news/goAdd';
							var menuData = {
								type: 1
							};
							$.hhly.ajax({
								url: menuUrl,
								data: menuData,
								dataType: 'html',
								success: function(data) {
									$(".publish_list").eq(1).html(data);
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
							title: msgUtil.getTxt("common_dialog_title"),
							area:['440px'],
							content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">'+data.msg+'</span></div>'
						});
					}
					imageEdit.judgeSave=true;
				},
				eCallback:imageEdit.imageError
			});
		},
		// 保存失败回调
		imageError:function(error){
			layer.open({
				scrollbar: false,
				move: false,
				title: msgUtil.getTxt("common_dialog_title"),
				area:['440px'],
				content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">'+msgUtil.getTxt("common_failSave")+'</span></div>'
			});
			$('#imagesPublishing').val('0');
			imageEdit.judgeSave=true;
		},
		//草稿按钮
		draftBtn:function(){
			$('#imagesDraftButton').click(function(){
				imageEdit.formVaridate(3,false);
			});
		},
		//发布按钮
		imagesPublish:function(){
			$('#imagesPublishButton').click(function(){
				imageEdit.formVaridate(1,false);
			});
		},
		// 组图预览
		previewPic:function(){
			$('#imagesPreviewButton').click(function() {
				debugger
				if(!imageEdit.judgeImage){
					return false;
				}
				imageEdit.judgeImage=false;
				var coverAllPageNode = $(".mit_maskhidden").clone();
				$(".mit_maskhidden").remove();
				$('#contents').append(coverAllPageNode);
				if($('#imagesList').find('li').length>1){
					$('#imagesPreview').show();
					var imagesHtml = '';
					$('#imagesList').find('li').each(function() {
						if (!($(this).attr("id") == 'add_images_button')) {
							var text = $(this).find('.imagesShowWordNum').val();
							var imgSrc = $(this).find('.images_content_image').find('img').attr("src");
							imagesHtml += '<li>' +
								'<div class="tn3 description">' +
								'<div class="desc_box pr">' +
								'<div class="text">' +
								text +
								'</div>' +
								'<div class="tn3_likeaccount pa">' +
								//'<span class="like_icon"></span>' + //点赞去掉
								//'<span>23</span>' +
								'</div>' +
								'</div>' +
								'</div>' +
								'<a href="' + imgSrc + '">' +
								'<img src="' + imgSrc + '" width="100%" />' +
								'</a>' +
								'</li>';
						}
					});
					$('#imagesPreviewContent').html(imagesHtml);
					var newSlide = $('#imagesPreview .mygallery').clone();
					$('#imagesPreview .preview_images_box .image_banner').prepend(newSlide);
					$(newSlide).addClass('mygallery_copy').show();
					var tn1 = $(newSlide).tn3({
						imageClick: "fullscreen",
						image: {
							maxZoom: 1.5,
							crop: true,
							clickEvent: "dblclick"
						},
						autoplay: true,
						mouseWheel: false,
						autohideControls: false,
						responsive: true
					});
					$('.mit_maskhidden').removeClass('hidden');
					$('body').css({
						'overflow':'hidden'
					});
					imageEdit.judgeImage=true;
				}else{
					layer.open({
						scrollbar: false,
						move: false,
						area:['440px'],
						title: msgUtil.getTxt("common_dialog_title"),
						content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">'+msgUtil.getTxt("news_imageview_required")+'</span></div>'
					});
					imageEdit.judgeImage=true;
				}
				
			});
		},
		// 预览弹窗关闭
		previewClose:function(){
			$('#imagesPreviewClose').click(function(){
				$(".mygallery_copy").remove();
				$('#imagesPreview').hide();
				$('.mit_maskhidden').addClass('hidden');
					$('body').css({
						'overflow':'auto'
					});
			});
		},
		// 图片上传
		imageUpload:function(){
			WebUploader.Uploader.register({
				'before-send': 'setServer'
			}, {
				setServer: function(file) {
					deferred = $.Deferred();
					//文件接收服务端，防止ie下缓存
					//console.log('setServer');
					uploader.option('server', '/upload/imgImage?time=' + new Date().getTime());
					deferred.resolve();
					return deferred.promise();
				}
			});
			var uploader = new WebUploader.Uploader({
				//文件上传可以拖拽的区域，默认没有
				dnd: '#imagesUploadDiv',
				//是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
				disableGlobalDnd: 'true',
				// 选完文件后，是否自动上传。
				auto: true,
				// swf文件路径
				swf: '/resources/js/jquery/webuploader/Uploader.swf',
				// 选择文件的按钮。可选。
				// 内部根据当前运行是创建，可能是input元素，也可能是flash.
				pick: {
					'id': '#imagesUploadButton'
				},
				// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
				resize: false,
				// 只允许选择图片。
				accept: {
					title: 'Image',
					extensions: 'png,jpg,jpeg,gif',
					mimeTypes: 'image/jpg,image/jpeg,image/pnf,image/gif'
				},
				//[默认值：false] 是否要分片处理大文件上传
				chunked: false,
				//验证文件总数量, 超出则不允许加入队列。
				fileNumLimit: 9,
				//验证文件总大小是否超出限制, 超出则不允许加入队列。
				fileSizeLimit: 52428800,
				// {int} [可选] [默认值：undefined] 验证单个文件大小是否超出限制, 超出则不允许加入队列。
				fileSingleSizeLimit: 5242880,
			});

			uploader.on('fileQueued', function(file) {
				$('#imagesLocalImages').append('<div class="popup_pic_boxpic popup_select_item">' + '<div id="images_fail_tip_' + file.id + '"></div>' //失败icon
					+ '<div id="images_fail_back_' + file.id + '">' //失败背景
					+ '</div><div class="popup_pic_boxpic_chlid_back"></div>' //下方进度条背景
					+ '<div class="popup_pic_boxpic_chlid_bar" id="image_local_bar_' + file.id + '">'+"<i class='top_zero'></i>"+'</div>' //进度条成功
					+ '<div class="popup_pic_boxpic_chlid_min" id="image_local_tip_' + file.id + '">'+msgUtil.getTxt("news_wait_upload")+'</div><div id="image_local_' + file.id + '" class="popup_selsect_img"></div>'); //文字与图片
					//+ '<div class="popup_pic_boxpic_chlid_min" id="image_local_tip_' + file.id + '">'+msgUtil.getTxt("news_wait_upload")+'</div><div id="image_local_' + file.id + '"></div>'); //文字与图片
				uploader.makeThumb(file, function(error, src) {
					if (error) {
						$('#image_local_tip_' + file.id).html(msgUtil.getTxt("news_imageview_fail"));
						return;
					}
					$('#image_local_' + file.id).html('<img src="' + src + '" alt="' + file.name + '">');
				}, 116, 114);
			});
			var tempUrl = "";
			uploader.on('uploadAccept', function(file, response) {
				if (response.state == 'SUCCESS') {
					tempUrl = response.url;
					return true;
				} else {
					// 通过return false来告诉组件，此文件上传有错。
					return false;
				}
			});
			uploader.on('uploadSuccess', function(file) {
				$('#image_local_' + file.id).html('<img src="' + tempUrl + '" alt="' + file.name + '">');
				$('#image_local_bar_' + file.id).css("width", "100%");
				$('#image_local_tip_' + file.id).html(msgUtil.getTxt("news_upload_success"));
				//上传成功默认加入已选图片
				var addFlag = false
				$('.popup_selected_item').each(function(){
					if($(this).children().length == 0){
						$(this).html('<img src="'+tempUrl+'" />');
						addFlag = true;
						return false;
					}
				});
				if(addFlag){
					$('#image_local_' + file.id).parent().parent().find("i").addClass("active");
				}
			});
			uploader.on('uploadError', function(file) {
				$('#images_fail_tip_' + file.id).addClass('popup_pic_boxpic_chlid_tip');
				$('#images_fail_back_' + file.id).addClass('popup_pic_boxpic_chlid');
				$('#image_local_tip_' + file.id).html(msgUtil.getTxt("news_upload_fail"));
				$('#image_local_tip_' + file.id).addClass("popup_pic_boxpic_chlid_min_error");
				$('#image_local_tip_' + file.id).removeClass("popup_pic_boxpic_chlid_min");
			});
			//文件上传过程中创建进度条实时显示。
			uploader.on('uploadProgress', function(file, percentage) {
				if (percentage != 1) {
					$('#image_local_tip_' + file.id).html(msgUtil.getTxt("news_uploading") + parseFloat(percentage * 100).toFixed(1) + "%");
					$('#image_local_bar_' + file.id).css("width", parseFloat(percentage * 100).toFixed(1) + "%");
				}
			});
		},
		// tab切换
		tabSlide:function(){
			$('.pic_dialog #local_pic_tab').click(function(){
				$(this).css("color","rgb(0, 187, 144)");
				$('.pic_dialog #remote_pic_tab').css("color","rgb(153, 153, 153)");
				$('.pic_dialog .popup_pic_bbox').show();
				$('.pic_dialog .popup_pic_push').show();
				$('.pic_dialog .popup_pic_location').hide();
				imageEdit.isSelectLocalImg = true;
				imageEdit.isSelectMyAlbum = false;
				imageEdit.tabRanderIcon($('#imagesLocalImages'));
				
			});
			$('.pic_dialog #remote_pic_tab').click(function(){
				$(this).css("color","rgb(0, 187, 144)");
				$('.pic_dialog #local_pic_tab').css("color","rgb(153, 153, 153)");
				$('.pic_dialog .popup_pic_bbox').hide();
				$('.pic_dialog .popup_pic_push').hide();
				$('.pic_dialog .popup_pic_location').show();
				imageEdit.isSelectLocalImg = false;
				imageEdit.isSelectMyAlbum = true;
				imageEdit.tabRanderIcon($('#imagesRemoteImages'));
			});
		},
		//切换渲染图片图标
		tabRanderIcon : function(node){
			var selectImgSrcArr = [];
			$('.popup_pic_sure').find('img').each(function(index,el){
				selectImgSrcArr.push($(el).attr('src'));
			});
			node.find("i").removeClass('active');
			for(var i = 0 ; i < selectImgSrcArr.length ; i ++){
				node.find('img').each(function(index,el){
					if($(el).attr('src') == selectImgSrcArr[i]){
						$(el).parents('.popup_select_item').find('i').addClass('active');
					}
				});
			}
		},
		//清楚选择的图片
		clearHtml:function(){
			$('.popup_selected_item').click(function(){
				var index = imageEdit.selectUploadImgArr[$(this).index()];
				$('.popup_pic_location').find('i').eq(index).removeClass('active');
				var imgContentNode = null,
					index = -1,
					src =  $(this).find('img').attr("src");
				if(imageEdit.isSelectLocalImg){
					$('#imagesLocalImages img').each(function(index,el){
						if($(el).attr('src') == src){
							$(el).parents('.popup_select_item').find("i").removeClass('active');
						}
					});
				}else{
					$('#imagesRemoteImages img').each(function(index,el){
						if($(el).attr('src') == src){
							$(el).parents('.popup_select_item').find("i").removeClass('active');
						}
					});
				}
				//imgContentNode.removeClass('active');
				$(this).html('');
				
			});
		},
		// 图片选择
		imageSelect:function(){
			$('.pic_dialog').on('click','.popup_select_item',function(){
				if($('.popup_pic_sure').find('img').length > 8){
					return;
				}
				$(this).find("i").addClass("active");
				var imageSrc = $(this).find('img').attr("src");
				if(imageSrc.substring(0,5) != 'data:'){
					var selectedFlag = false;
					$('.popup_selected_item').each(function(){
						if($(this).children().length != 0){
							var selectedSrc = $(this).find('img').attr('src');
							if(selectedSrc == imageSrc){
								selectedFlag = true;
								return false;
							}
						}
					});
					if(!selectedFlag){
						$('.popup_selected_item').each(function(){
							if($(this).children().length == 0){
								$(this).html('<img src="'+imageSrc+'" />');
								return false;
							}
						});
					}
				}
			});
		},
		// 初始化图片内容
		imageContentInit:function(){
			var imagesContent = $('#imageContentHide').val();
			if(imagesContent != ''){
				var contentObject = $.parseJSON(imagesContent);
				var appendHtml = "";
				for(var i = 0; i < contentObject.length; i++){
					appendHtml += '<li>'+
					'<div class="images_content_image">'+
						'<img src="'+contentObject[i].imgUrl+'">'+
					'</div>'+
					'<textarea class="imagesShowWordNum">'+((contentObject[i].content == null || contentObject[i].content == 'null')?"":contentObject[i].content)+'</textarea>'+
					'<span><i>'+((contentObject[i].content == null || contentObject[i].content == 'null')?"0":contentObject[i].content.length)+'</i>/120</span>'+
					'<i class="del_image"></i>'+
					'</li>';
				}
				$('#imagesList').prepend(appendHtml);
			}
		},
		// 字数统计
		textAccount:function(){
			
			/*重新编辑内容的的时候需要用到 初始化*/
			imageEdit.videoShowWordNum($('#imagesTitle'),30);
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
		//表单验证
		formVaridate:function(type,timingPublish,saveCallback){
			$('#imagesTitle').val($.trim($('#imagesTitle').val()));
			imageEdit.videoShowWordNum($('#imagesTitle'),30);
			var validator=$(".image_publish").validate({
				focusInvalid: true, //当为false时，验证无效时，没有焦点响应
				onfocusout: function(element) {
					$(element).valid();
				},
				onkeyup: false,
				submitHandler: function(form) { //表单提交句柄,为一回调函数，带一个参数：form
					imageEdit.imageSave(type,timingPublish,saveCallback);
				},
				rules: {
					image_publish_title: {
						required: true,
						minlength: 8
					},
					bigImagesCategory: {
						required: true,
						range: [1, 1000]
					}
				},
				messages: {
					image_publish_title: {
						required: msgUtil.getTxt("news_title_required"),
						minlength: msgUtil.getTxt("news_title_minlength")
					},
					bigImagesCategory: {
						required: msgUtil.getTxt("news_cateone_required"),
						range: msgUtil.getTxt("news_cateone_range")
					}
				}
			});
			$(".image_publish").submit();
		},
		// 图片拖拽初始化
		dragInit:function(){
			$("#manage_contents").on('focus','textarea',function(){
				$('.gbin1_list').sortable("disable");
			});
			
			$("#manage_contents").on('blur','textarea',function(){
				$('.gbin1_list').sortable("enable");
			})
			
			$('.gbin1_list').sortable();
		},
		reload:function(){
			$('#imagesList').find('li.sortable_li').remove();
			$("body").find('input').val('');
			$('body').find('label.error').empty();
			$('#imagesCoverList').empty();
			$(document).trigger('click.input');
			$('#add_images_cover').css('display','block');
		},
		init:function(){
			var imageLength=$('#imagesList').find('img').length;
			$('#imagesList').find('input').val(imageLength);
			this.addDialog();
			this.deletePic();
			this.inputInit();
			this.slideTips();
			this.selectCoverDialog();
			this.closeCoverDialog();
			this.selectCoverLight();
			this.deleteCoverPic();
			this.draftBtn();
			this.imagesPublish();
			this.previewPic();
			this.previewClose();
			this.imageContentInit(); //编辑页面内容初始化
			$.hhly.textAccount({wrap:'.image_publish .add_title',input:'input',max:30});
			this.dragInit();
			publish.init(imageEdit);
		}
	};
	imageEdit.init();
});