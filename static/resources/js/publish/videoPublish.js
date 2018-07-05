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
		'publish':'/resources/js/publish/publish.js?v=cb275857dd',
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
		'publish':{
			deps:['jquery']
		},
    },
});
require(['jquery', 'hhlyAction', 'layer','webuploader','validate','publish','common','i18n','personal'],function($,hhlyAction,layer,WebUploader,validate,publish){
	var videoEdit={
		uploadFail:false,
		uploadSizeTempOld:0,
		uploadSizeTemp:0,
		uploadTimeTemp:0,
		file:'',
		percent:0,
		uuid:0,
		judgeVideo:true,
		videoProject:'',
		// 视频初始化
		videoUploadInit:function(){
			(function(){
				WebUploader.Uploader.register({
					'before-send': 'checkchunk'
				},
				{
					checkchunk: function(block) {
						deferred = $.Deferred();
						var chunk = block.chunk;
						var chunks = block.chunks;
						if (!videoEdit.uploadFail) { //如果没有失败，则不用检验，直接上传
							deferred.resolve();
						} else if (chunks - chunk < 2) {
							//最后一块不能检验，必须上传
							deferred.resolve();
						} else {
							$.ajax({
								type: "POST",
								url: '/upload/confirmUploaded?time=' + new Date().getTime(),
								data: {
									chunk: chunk,
									chunks: chunks,
									uuid: uuid
								},
								dataType: "json",
								timeout: 5000,
								async: false,
								success: function(data) {
									if (data.status == 0 || data.status == '0') {
										deferred.reject(); //不需要传输
									} else {
										deferred.resolve(); //需要传输
										videoEdit.uploadFail = false;
									}
								},
								error: function(request) {
									deferred.resolve(); //需要传输
								},
							});
						}
						return deferred.promise();
					}
				});
				var videoUpload = new WebUploader.Uploader({
					//文件上传可以拖拽的区域，默认没有
					dnd: '#start_video_div',
					// 选完文件后，是否自动上传。
					auto: true,
					// swf文件路径
					swf: '/resources/js/jquery/webuploader/Uploader.swf',
					// 选择文件的按钮。可选。
					// 内部根据当前运行是创建，可能是input元素，也可能是flash.
					pick: {
						'id': '#upload_video_button',
						'multiple': false
					},
					// 只允许选择视频。
					accept: {
						title: 'Video',
						extensions: 'mp4',
						mimeTypes: 'video/mpeg,video/3gpp,video/x-msvideo,video/isivideo,video/mp4'
					},
					//[默认值：false] 是否要分片处理大文件上传
					chunked: true,
					//[默认值：5242880] 如果要分片，分多大一片？ 默认大小为5M.
					chunkSize: 2097152,
					//[默认值：2] 如果某个分片由于网络问题出错，允许自动重传多少次？
					chunkRetry: 2,
					// [默认值：3] 上传并发数。允许同时最大上传进程数。
					threads: 3,
					//验证文件总数量, 超出则不允许加入队列。
					fileNumLimit: 1,
					//验证文件总大小是否超出限制, 超出则不允许加入队列。
					fileSizeLimit: 2147483648, //2G
					// {int} [可选] [默认值：undefined] 验证单个文件大小是否超出限制, 超出则不允许加入队列。
					fileSingleSizeLimit: 2147483648, //2G
				});
				videoUpload.on( 'fileQueued', function( file ) {
					$('#video_uploading').show();
					$('#video_choice').show();
					$('#video_save').attr('disabled','true').addClass('gray');
					//不能这样用，隐藏会导致ie8下flash停止运行，找不到exec函数， $('#start_video_div').hide(); 请参考http://blog.csdn.net/banbianliushui/article/details/53009838?locationNum=2&fps=1
					$('#start_video_div').addClass('webuploader-element-invisible');
					$('#video_cancelupload').show();
					$('#video_reupload').hide();
					$('#video_upload').hide();
					$('#video_upload_tip').hide();
					videoEdit.uploadSizeTempOld = 0;
					videoEdit.uploadSizeTemp = 0;
					videoEdit.uploadTimeTemp = 0;
					videoEdit.percent = 0;
					videoEdit.uploadFail = false;
					$('#video_upload_progress .file_name').html(file.name);
					$('#video_upload_progress .up_percent').html("0%");
					$('#video_upload_progress .file_upload_size').html("0KB");
					$('#video_upload_progress .upload_speed').html("0B");
					$('#video_upload_progress .progress_bar_show').css("width", "0%");
					$('#video_upload_progress .file_total_size').html(videoEdit.getSizeName(file.size));
					$('#video_upload_progress .uploadedUrl').val('');
					$('#video_upload_progress .uploadedPath').val('');
					//文件接收服务端，防止ie下缓存
					videoUpload.option('server', '/upload/video?time=' + new Date().getTime());
					uuid = videoEdit.getUuid();
					videoUpload.option('formData', {
						"uuid": uuid
					});
					if (file.size <= 10485760) {
						videoUpload.option('chunkSize', 2097152); //小于等于10MB的文件，分片为2MB
					} else if (file.size <= 104857600) {
						videoUpload.option('chunkSize', 5242880); //10MB~100MB的文件，分片为5MB
					} else {
						videoUpload.option('chunkSize', 10485760); //100MB~500MB的文件，分片为10MB
					}
				});

				videoUpload.on('uploadAccept', function(file, response) {
					if (response.state == 'SUCCESS') {
						$('#video_upload_progress .uploadedUrl').val(response.url);
						$('#video_upload_progress .uploadedPath').val(response.path);
						$('#video_upload_progress .uploadedSize').val(file.size);
						$('#video_upload_progress .uploadedTime').val(response.time);
						$('#video_upload_progress .uploadedFileId').val(response.fileId);
						$('#video_upload_progress .uploadedCover').val(response.videoCover);
						if (file.ext == 'mp4' || file.ext == 'ogg' || file.ext == 'webm') {
							$('#video_preshow_div').show();
							$('#video_preshow').html('<video width="750" controls="">' +
								'<source id="videoPlay" src="' + response.url + '" type="video/' + file.ext + '">' +
								msgUtil.getTxt("news_unsupport_video") +
								'</video>');
						}
						return true;
					} else {
						// 通过return false来告诉组件，此文件上传有错。
						return false;
					}
				});

				videoUpload.on('uploadSuccess', function(file) {
					$('#video_save').removeAttr('disabled').removeClass('gray');
					$('#video_upload_tip').show();
					$('#video_upload_tip').css("color", "#31d2ad");
					$('#video_upload_tip').html(msgUtil.getTxt("news_upload_success"));
					$('#video_cancelupload').hide();
					$('#video_upload_progress .up_speed').hide();
					$('#video_upload_progress .ed_up').hide();
					errorFile = null;
					if (file.size > 2097152) { //大于2MB的需要去服务器合并文件
						videoEdit.merge(file);
					}
				});
				$('#video_upload_merge').click(function(){
					videoEdit.merge(videoUpload.getFiles()[0]);
				});

				videoUpload.on( 'uploadError', function( file ) {
					videoEdit.uploadFail = true;
					$('#video_upload_tip').show();
					$('#video_upload_tip').css("color","red");
				    $('#video_upload_tip').html(msgUtil.getTxt("news_upload_fail"));
					$('#video_cancelupload').hide();
					$('#video_upload').show();
					percentage = videoEdit.uploadSizeTempOld/file.size;
					$('#video_upload_progress .upload_speed').html("0B");
					$('#video_upload_progress .file_upload_size').html( videoEdit.getSizeName(videoEdit.uploadSizeTempOld));
				    $('#video_upload_progress .progress_bar_show').css("width",parseFloat(percentage * 100).toFixed(2)+"%");
					$('#video_upload_progress .up_percent').html(parseFloat(percentage * 100).toFixed(2) + "%");
				});

				videoUpload.on( 'uploadComplete', function( file ) {
				});

				//文件上传过程中创建进度条实时显示。
				videoUpload.on( 'uploadProgress', function( file, percentage ) {
					if(videoEdit.uploadSizeTemp == 0){
						videoEdit.uploadSizeTemp = percentage*file.size;
						videoEdit.uploadTimeTemp = videoEdit.getAccurateTime();
						percent = percentage;
					}
					else {
						var uploadSizeNow = percentage*file.size;
						var uploadTimeNow = videoEdit.getAccurateTime();
						if(percentage * 100 != 100 && percent != 1){
							var passTime = uploadTimeNow - videoEdit.uploadTimeTemp;
							var countPassTime = passTime;
							if(passTime <= 0){
								countPassTime = 1;
								// return false;
							}
							if((uploadSizeNow - videoEdit.uploadSizeTemp) == 0 || passTime < 500){
								return false;
							}
							if(!((uploadSizeNow - videoEdit.uploadSizeTemp) == 0 || passTime < 500) || (uploadSizeNow - videoEdit.uploadSizeTemp) > 0){
								var bytePerSecond = (uploadSizeNow - videoEdit.uploadSizeTemp)/countPassTime*1000;
								if(bytePerSecond<0){
									bytePerSecond=0;
								}
								$('#video_upload_progress .upload_speed').html(videoEdit.getSizeName(bytePerSecond));
								if(uploadTimeNow - videoEdit.uploadTimeTemp > 0){
									videoEdit.uploadSizeTempOld = videoEdit.uploadSizeTemp;
									videoEdit.uploadSizeTemp = uploadSizeNow;
									videoEdit.uploadTimeTemp = uploadTimeNow;
								}
							}	
						}
					    $('#video_upload_progress .file_upload_size').html( videoEdit.getSizeName(uploadSizeNow));
					    $('#video_upload_progress .progress_bar_show').css("width",parseFloat(percentage * 100).toFixed(2)+"%");
						$('#video_upload_progress .up_percent').html(parseFloat(percentage * 100).toFixed(2) + "%");
						percent = percentage;
					}
				});

				$('#video_reupload').click(function(){
					layer.open({
						scrollbar: false,
						move: false,
						title: msgUtil.getTxt("common_dialog_title"),
						area:['440px'],
						content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">'+msgUtil.getTxt("news_reupload_confirm")+'</span></div>',
						yes:function(layero, index){
							for(var i = 0;i<videoUpload.getFiles().length;i++){
								videoUpload.cancelFile(videoUpload.getFiles()[i]);
								videoUpload.removeFile( videoUpload.getFiles()[i],true );
								videoUpload.reset();
							}
							$('#video_uploading').hide();
							$('#start_video_div').removeClass('webuploader-element-invisible');
							$('#video_upload_progress .uploadedUrl').val('');
							$('#video_upload_progress .uploadedPath').val('');
							$('#video_preshow_div').show();
							$('#video_preshow').html('');
							$('#video_preshow_div').hide();
							$('#video_upload_progress .up_speed').show();
							$('#video_upload_progress .ed_up').show();
							layer.close(layero);
						}
					});
				});

				$('#video_upload').click(function(){
					videoUpload.retry();
					$('#video_cancelupload').show();
					$('#video_reupload').hide();
					$('#video_upload').hide();
					$('#video_upload_tip').hide();
				});
				$('#video_cancelupload').click(function(){
					layer.open({
						scrollbar: false,
						move: false,
						title: msgUtil.getTxt("common_dialog_title"),
						area:['440px'],
						content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">'+msgUtil.getTxt("news_uploadcancel_confirm")+'</span></div>',
						yes:function(layero, index){
							for(var i = 0;i<videoUpload.getFiles().length;i++){
								videoUpload.cancelFile(videoUpload.getFiles()[i]);
								videoUpload.removeFile( videoUpload.getFiles()[i],true );
								videoUpload.reset();
							}
							$('#video_uploading').hide();
							$('#start_video_div').removeClass('webuploader-element-invisible');
							layer.close(layero);
						}
					});
				});
				videoEdit.videoProject=videoUpload;
			})();
		},
		// 图片初始化
		imgUploadInit:function(){
			(function(){
				var imgUpload = new WebUploader.Uploader({
					//文件上传可以拖拽的区域，默认没有
					dnd: '#video_image',
					//是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
					disableGlobalDnd: 'true',
					// 选完文件后，是否自动上传。
				    auto: true,
				    // swf文件路径
				    swf: '/resources/js/jquery/webuploader/Uploader.swf',
				    // 选择文件的按钮。可选。
				    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
				    pick: {'id':'#video_image_div','multiple':false},
				    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
				    resize: false,
				 	// 只允许选择图片。
				    accept: {
				        title: 'Image',
				        extensions: 'png,jpg,jpeg',
				        mimeTypes: 'image/png,image/jpeg,image/jpg'
				    },
				    //[默认值：false] 是否要分片处理大文件上传
				    chunked: false,
				    //验证文件总数量, 超出则不允许加入队列。
				    fileNumLimit: 1,
				    //验证文件总大小是否超出限制, 超出则不允许加入队列。
				    fileSizeLimit: 2097152,
				    // {int} [可选] [默认值：undefined] 验证单个文件大小是否超出限制, 超出则不允许加入队列。
				    fileSingleSizeLimit: 2097152,
				    paste: document.body,
				});
				var persent = -1;
				var persentOld = -1;
				imgUpload.on('fileQueued', function(file) {
					//文件接收服务端，防止ie下缓存
					imgUpload.option('server', '/upload/imgImage?time=' + new Date().getTime());
					$('.video_image_tip').html('');
					$('.video_image_retry').hide();
					$('.video_image_delete').hide();
					persent = -1;
					persentOld = -1;
				});

				imgUpload.on('uploadAccept', function(file, response) {
					$('#video_image').addClass("webuploader-element-invisible");
					$('#video_image_show').find(".cover_first").html('<img src="' + response.url + '" width="100%" height="100%" /><b class="del_cover"></b>')
					$('#video_image_show').show();
					$('#video_image_path').val(response.path);
					if (response.state == 'SUCCESS') {
						return true;
					} else {
						// 通过return false来告诉组件，此文件上传有错。
						return false;
					}
				});

				imgUpload.on('uploadSuccess', function(file) {
					$('.video_image_tip').html("");
				});


				imgUpload.on('uploadError', function(file) {
					if (persentOld != -1) {
						$('.video_image_tip').html(msgUtil.getTxt("news_upload_fail") + " " +msgUtil.getTxt("news_uploaded") + parseFloat(persentOld * 100).toFixed(2) + "%");
					} else {
						$('.video_image_tip').html(msgUtil.getTxt("news_upload_fail"));
					}
					$('.video_image_retry').show();
				});

				imgUpload.on('uploadComplete', function(file) {
				});

				//文件上传过程中创建进度条实时显示。
				imgUpload.on('uploadProgress', function(file, percentage) {
					if (percentage != 1) {
						persentOld = persent;
					}
					persent = percentage;
					$('.video_image_tip').html(parseFloat(percentage * 100).toFixed(2) + "%");
				});
				$("#video_image_show").off('click','.del_cover');
				$("#video_image_show").on('click','.del_cover',function(){
					for (var i = 0; i < imgUpload.getFiles().length; i++) {
						imgUpload.cancelFile(imgUpload.getFiles()[i]);
					}
					$('#video_image').removeClass("webuploader-element-invisible");
					$('#video_image_show').hide();
					$('#video_image_path').val('');
				});
				$('.video_image_retry').click(function() {
					$('.video_image_tip').html("");
					imgUpload.retry();
				});
			})();
		},
		// 大于2MB的需要去服务器合并文件
		merge:function(file){
			$('#video_upload_merge').hide();
			$('#video_upload_tip').show();
			$('#video_upload_tip').html(msgUtil.getTxt("news_upload_handling"));
			$.ajax({
				type: "POST",
				url: '/upload/merge?time=' + new Date().getTime(),
				data: {
					uuid: uuid,
					ext: file.ext,
					size: file.size
				},
				dataType: "json",
				timeout: 20000,
				success: function(data) {
					if (data.status == 0 || data.status == '0') {
						$('#video_reupload').show();
						$('#video_upload_tip').css("color", "#31d2ad");
						$('#video_upload_tip').html(msgUtil.getTxt("news_upload_success"));
						$('#video_upload_merge').hide();
						$('#video_upload_progress .uploadedUrl').val(data.url);
						$('#video_upload_progress .uploadedPath').val(data.path);
						$('#video_upload_progress .uploadedSize').val(file.size);
						$('#video_upload_progress .uploadedTime').val(data.time);
						$('#video_upload_progress .uploadedFileId').val(data.fileId);
						$('#video_upload_progress .uploadedCover').val(data.videoCover);
						if (file.ext == 'mp4' || file.ext == 'ogg' || file.ext == 'webm') {
							$('#video_preshow_div').show();
							$('#video_preshow').html('<video width="750" controls="">' +
								'<source id="videoPlay" src="' + data.url + '" type="video/' + file.ext + '">' +
								msgUtil.getTxt("news_unsupport_video") +
								'</video>');
						}
					} else {
						videoEdit.videoMergeError();
					}
				},
				error: function(request) {
					videoEdit.videoMergeError();
				},
			});
		},
		// 错误信息处理
		videoMergeError:function(){
			$('#video_upload_tip').show();
			$('#video_upload_tip').css("color", "red");
			$('#video_upload_tip').html(msgUtil.getTxt("news_handle_fail"));
			$('#video_cancelupload').hide();
			$('#video_upload_merge').show();
		},
		// 获取大小
		getSizeName:function(size){
			if (size > 1024 * 1024 * 1024) {
				return parseFloat(size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
			} else if (size > 1024 * 1024) {
				return parseFloat(size / (1024 * 1024)).toFixed(2) + "MB";
			} else if (size > 1024) {
				return parseFloat(size / 1024).toFixed(2) + "KB";
			} else if (size >= 0) {
				return parseFloat(size).toFixed(2) + "B";
			} else {
				return "0B";
			}
		},
		//生成uuid
		getUuid:function() {
			var len = 32;
			//32长度
			var radix = 16;
			//16进制
			var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
			var uuid = [],
				i;
			radix = radix || chars.length;
			if (len) {
				for (i = 0; i < len; i++)
					uuid[i] = chars[0 | Math.random() * radix];
			} else {
				var r;
				uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
				uuid[14] = '4';
				for (i = 0; i < 36; i++) {
					if (!uuid[i]) {
						r = 0 | Math.random() * 16;
						uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
					}
				}
			}
			return videoEdit.getDateStr() + uuid.join('');
		},
		getDateStr: function() {
			var now = new Date();
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var day = now.getDate();
			var hh = now.getHours();
			var mm = now.getMinutes();
			var ss = now.getSeconds();
			var clock = year;
			if (month < 10) clock += "0";
			clock += month;
			if (day < 10) clock += "0";
			clock += day;
			if (hh < 10) clock += "0";
			clock += hh;
			if (mm < 10) clock += '0';
			clock += mm;
			if (ss < 10) clock += '0';
			clock += ss;
			return clock;
		},
		//获取精确时间
		getAccurateTime: function() {
			// 浏览器
			if (typeof window.performance !== 'undefined' && typeof performance.now !== 'undefined') {
				return performance.now();
			} else {
				return (new Date()).getTime();
			}
		},
		// 验证
		formVaridate: function() {
			$('#videoTitle').val($.trim($('#videoTitle').val()));
			$('#videoIntroduce').val($.trim($('#videoIntroduce').val()));
			videoEdit.videoShowWordNum($('#videoTitle'),40);
			videoEdit.videoShowWordNum($('#videoIntroduce'),2000);
			var validator = $("#videoForm").validate({
				focusInvalid: true, //当为false时，验证无效时，没有焦点响应
				onfocusout: function(element) {
					$(element).valid();
				},
				onkeyup: false,
				submitHandler: function(form) { //表单提交句柄,为一回调函数，带一个参数：form
					videoEdit.videoSave();
				},
				rules: {
					videoTitle: {
						required: true,
						minlength: 2
					},
					videoIntroduce: {
						required: true,
						minlength: 2
					},
					bigVideoCategory: {
						required: true,
						range: [1, 1000]
					},
					smallVideoCategory: {
						required: true,
						range: [1, 1000]
					}

				},
				messages: {
					videoTitle: {
						required: msgUtil.getTxt("news_title_required"),
						minlength: msgUtil.getTxt("news_videotitle_minlength")
					},
					videoIntroduce: {
						required: msgUtil.getTxt("news_introduce_required"),
						minlength: msgUtil.getTxt("news_introduce_minlength")
					},
					bigVideoCategory: {
						required: msgUtil.getTxt("news_cateone_required"),
						range: msgUtil.getTxt("news_cateone_range")
					},
					smallVideoCategory: {
						required: msgUtil.getTxt("news_catetwo_required"),
						range: msgUtil.getTxt("news_catetwo_range")
					}
				}
			});
			$("#videoForm").submit();
		},
		// 字数统计
		textAccount:function(){
			videoEdit.videoShowWordNum($('#videoTitle'),40);
			videoEdit.videoShowWordNum($('#videoIntroduce'),2000);
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
		// 分类选择成功回调
		typeSuccess:function(data){
			var optionHtml="";
			var cloneHtml=$('#videoSmallCategory .opts').find('a').first().clone();
			for (var i = 0; i < data.length; i++) {
				optionHtml += '<a href="javascript:;" val="' + data[i].cateId + '">' + data[i].cateName + '</a>';
			}
			$('#videoSmallCategory .opts').empty().append(cloneHtml).append(optionHtml);
		},
		// 分类选择
		typeSelect:function(){
			$('#videoBigCategory').on('click','a',function(){
				var parentId = $(this).attr("val");
				var test=$('#videoSmallCategory .opts').find('a').first().text();
				$('#videoSmallCategory .selected').text(test);
				if(parentId != 0){
					var typeUrl='/manage/news/getCategoryVideoList?parentId='+parentId;
					$.hhly.ajax({url:typeUrl,success:videoEdit.typeSuccess});
				}else{
					var cloneTips=$('#videoSmallCategory .opts').find('a:first').clone();
					$('#videoSmallCategory .opts').empty().append(cloneTips);
				}
			});
		},
		//编辑数据初始化
		editDataInit:function(){
			var editCoverPath = $('#video_upload_progress .uploadedCover').val();
			if (editCoverPath.indexOf("://") != -1) {
				editCoverPath = editCoverPath.substring(editCoverPath.indexOf("/", 10), editCoverPath.length);
			}
			editCoverPath = editCoverPath.replace("/fv/","/f/");
			var editCoverPathArray = editCoverPath.split("_");
			if(editCoverPathArray.length == 3){
				editCoverPath = editCoverPathArray[0]+"_"+editCoverPathArray[1]+"."+editCoverPathArray[2].split(".")[1];
			}
			else if(editCoverPathArray.length == 2 && editCoverPathArray[1].indexOf("x")!=-1){
				editCoverPath = editCoverPathArray[0]+"."+editCoverPathArray[1].split(".")[1];
			}
			$('#video_upload_progress .uploadedCover').val(editCoverPath);

			var editUploadedPath = $('#video_upload_progress .uploadedPath').val();
			if (editUploadedPath.indexOf("://") != -1) {
				if (editUploadedPath.length > 3) {
					var editUploadedPathExt = editUploadedPath.substring(editUploadedPath.length - 6, editUploadedPath.length).split(".")[1];
					if (editUploadedPathExt == 'mp4' || editUploadedPathExt == 'ogg' || editUploadedPathExt == 'webm') {
						$('#video_preshow_div').show();
						$('#video_preshow').html('<video width="750" controls="">' +
							'<source id="videoPlay" src="' + editUploadedPath + '" type="video/' + editUploadedPathExt + '">' +
							msgUtil.getTxt("news_unsupport_video") +
							'</video>');
					}
				}
				editUploadedPath = editUploadedPath.substring(editUploadedPath.indexOf("/", 10), editUploadedPath.length);
				$('#video_upload_progress .uploadedPath').val(editUploadedPath);
			}

			$('#video_image_path').val(editCoverPath);
		},
		//重新刷新当前页面为空白
		reload:function(){
			var menuUrl = '/manage/news/goAdd';
			var menuData = {
				type: 2
			};
			$.hhly.ajax({
				url: menuUrl,
				data: menuData,
				dataType: 'html',
				success: function(data) {
					$(".publish_list").eq(2).html(data);
				}
			});
		},
		videoReload:function(){
			project=videoEdit.videoProject;
			for(var i = 0;i<project.getFiles().length;i++){
				project.cancelFile(project.getFiles()[i]);
				project.removeFile( project.getFiles()[i],true );
			}
			project.reset();
			videoEdit.reload();
		},
		// 提交数据
		saveData:function(upData){
			if(!videoEdit.judgeVideo){
				return false;
			}
			videoEdit.judgeVideo=false;
			$.ajax({
				type: "POST",
				cache: false,
				url: '/manage/news/videoSave',
				dataType: "json",
				data: upData,
				timeout: 20000,
				success: function(data) {
					if (data.result == '0' || data.result == 0) {
						$('#videoFileId').val(data.data);
						$('#video_upload_progress .file_name').html(upData.title);
						$('#video_reupload').hide();
						if($(".publish_list").length == 3){//新增发布页面才刷
							videoEdit.reload();
						}
						var goStatus = 0;
						layer.open({
							scrollbar: false,
							move: false,
							title: msgUtil.getTxt("common_dialog_title"),
							area:['440px'],
							content: '<div class="dialog_tip_box text"><span class="at_span success"></span><span class="dialog_tips">'+msgUtil.getTxt("common_successSave")+'</span></div>',
							btn: [msgUtil.getTxt("news_stay"),msgUtil.getTxt("news_go_admin")],
							btn2:function(layero, index){
								layer.close(layero);
								location.href="/manage/content/videos";
								/*$.hhly.ajax({
									"url":"/manage/news/video?status="+goStatus,
									"dataType":"html",
									"success":function(data){
										$("#manage_contents").html(data);
										scroll(0,0);
						    		}
								});
								layer.close(layero);*/
							}
						});
					} else {
						layer.open({
							crollbar: false,
							move: false,
							area:['440px'],
							title: msgUtil.getTxt("common_dialog_title"),
							content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">'+data.msg+'</span></div>'
						});
					}
					$('#video_save').removeAttr("disabled");
					videoEdit.judgeVideo=true;
				},
				error: function() {
					layer.open({
						crollbar: false,
						move: false,
						area:['440px'],
						title: msgUtil.getTxt("common_dialog_title"),
						content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">'+msgUtil.getTxt("common_failSave")+'</span></div>'
					});
					$('#video_save').removeAttr("disabled");
					videoEdit.judgeVideo=true;
				}
			});
		},
		// 视频提交
		videoSave:function(){
			var title = $('#videoTitle').val();
			var introduce = $('#videoIntroduce').val();
			var path = $('#video_upload_progress .uploadedPath').val();
			var cateFirst = $('#videoBigCategory .opts a[class="selected"]').attr("val");
			var cateSecond = $('#videoSmallCategory .opts a[class="selected"]').attr("val");
			var coverPath = $('#video_image_path').val();
			var size = $('#video_upload_progress .uploadedSize').val();
			var time = $('#video_upload_progress .uploadedTime').val();

			var fileId = $('#video_upload_progress .uploadedFileId').val();
			var videoFileId = $('#videoFileId').val();
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
			tagsObj.each(function(index, el) {
				// tags.push($(this).attr('val'))
				if(index!=0){
					tags=tags +',' + $(this).attr('val')
				} else {
					tags = $(this).attr('val')
				}
			});
			var uData={
				videoName: title,
				intro: introduce,
				path: path,
				cateFirst: cateFirst,
				cateId: cateSecond,
				videoCover: coverPath,
				videoSize: size,
				videoTime: time,
				fileId: fileId,
				videoId: videoFileId,
				labels:tags
			};
			if (coverPath == '') {
				layer.open({
					scrollbar: false,
					move: false,
					area: '440px',
					title: msgUtil.getTxt("common_dialog_title"),
					content: '<span class="at_span warn"></span><span class="dialog_tips">'+msgUtil.getTxt("news_nocover_confirm")+'</span>',
					btn:[msgUtil.getTxt("common_sure"),msgUtil.getTxt("common_cancel")],
					yes:function(lay,index){
						uData.videoCover = $('#video_upload_progress .uploadedCover').val();
						videoEdit.saveData(uData);
						layer.close(lay);
					}
				});
			}else{
				videoEdit.saveData(uData);
			}
		},
		// 协议弹框
		detalDialog:function(){
			$('.manage_content ').off('click','.video_deal').on('click','.video_deal',function(){
				layer.open({
					scrollbar: false,
					move: false,
					area:['800px','660px'],
					type: 2,
					content: ['/resources/html/agreement/video.html']
				})
			});
		},
		bindSave : function(){
			$('#video_save').off('click').on('click',function(){
				videoEdit.formVaridate();
			})
		},
		init:function(){
			//选择分类初始化
			$.hhly.inputbox({
				wrap:'#videoBigCategory,#videoSmallCategory',
				width:110
			})
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
			this.videoUploadInit();
			this.typeSelect();
			this.editDataInit();
			this.detalDialog();
			this.bindSave();
			$.hhly.textAccount({wrap:'.upvideo_title p.pr',input:'textarea',max:40});
			$.hhly.textAccount({wrap:'.upvideo_intro p.pr',input:'textarea',max:2000});
			publish.init(videoEdit);
		},
		laterInit: function(){
			$('#upload_video_button .webuploader-pick').next().css("height","38px"); //切换tab会变小，导致很难选中，直接扩大跟按钮一样大
			try{
			   videoEdit.imgUploadInit();
			}catch(err)
			{
			   //在此处理错误
			}
		}
	};
	videoEdit.init();
	videoEdit.laterInit();
});