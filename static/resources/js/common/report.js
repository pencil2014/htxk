$(function(){
	var report={
		responseImg:'',
		upload:function(){
			var uploader = WebUploader.create({
				// 选完文件后，是否自动上传。
				auto: true,
				// swf文件路径
				swf: '/webuploader/Uploader.swf',
				// 文件接收服务端。
				// server: '/team/manage/info/upload?teamId=' + orgId,
			    server: '/collect/img',
				// 选择文件的按钮。可选。
				pick: '#idcard_select',
				fileNumLimit: 1,
				// 只允许选择图片文件。
				accept: {
					title: 'Images',
					extensions: 'gif,jpg,jpeg,bmp,png',
					mimeTypes: 'image/jpg,image/jpeg,image/png'
				}
			});
			uploader.on('ready', function() {
				$('#idcard_select').find('input').attr('name','idcard_select_file');
			});
			uploader.on('fileQueued', function(file) {
				var $li = $(
						'<div  id="' + file.id + '" class="file-item thumbnail head_box">' +
						'<img width="100%">' +
						'</div>'
					),
					$img = $li.find('img');
				// $list为容器jQuery实例
				$('#idcard_box').empty().append($li);
				$('#idcard_select').addClass('reupload');
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
			uploader.on( 'uploadSuccess', function( file,response) {
	           	report.responseImg=response;
				uploader.removeFile( file );
				uploader.reset();
	        });
		},
		init:function(){
			this.upload();
			$.hhly.inputbox({
				wrap:'div[name="report_reason"]'
			});
			this.refreshCode();
			this.verityBlur();
		},
		verityBlur:function(){
			$('.report_verity').blur(function(){
				var inputVal=$(this).val();
				if($(this).val()==''){
					$(this).siblings('.dialog_tips').removeClass('hidden');
					return false;
				}
				$.hhly.ajax({
					url:'/collect/validate/code',
					data:{
						validateCode : $('.report_verity').val()
					},
					type:'post',
					success:function(data){
						if(data.result == '2'){
							$('.report_img').trigger('click');
							$('.report_verity').siblings('.verify_report').find('.dialog_tips').text(data.msg).removeClass('hidden').addClass('error');
						}else if(data.result == '0'){
							$('.report_verity').siblings('.verify_report').find('.dialog_tips').addClass('hidden').removeClass('error');
						}
					}
				})
			});
		},
		refreshCode:function(){
			$('.report_img').click(function(){
				var src=$(this).find('img').get(0).src;
				var time = new Date().getTime();
				$(this).find('img').get(0).src=(src.indexOf('&time')!=-1 ? src.split('&time')[0] : $(this).find('img').get(0).src) + '&time' + time;
			})
		},
		// 出发
		reportInit:function(){
			$('body').on('click','.report_common',function(){
				var type=2,resourceId='';
				if($('#videoId').length>0){
					resourceId=$('#videoId').val();
					type=3;
				}else if($('#articleId').length>0){
					resourceId=$('#articleId').val();
					type=2;
				}else if($('#feedId').length>0){
					resourceId=$('#feedId').val();
					type = 1;
				}
				var html='<div class="dialog_content">'
						+'	<div class="content_list">'
						+'		<label for="" class="dialog_label mgtop5">举报原因：</label>'
						+'		<div class="item_box">'
						+'			<div name="report_reason" type="radiobox" val="4001" class="checked radio_box">'
						+'				<div class="radio_icon"></div>'
						+'				<span>淫秽色情</span>'
						+'			</div>'
						+'			<div name="report_reason" type="radiobox" val="4002" class=" radio_box">'
						+'				<div class="radio_icon"></div>'
						+'				<span>涉嫌欺诈</span>'
						+'			</div>'
						+'			<div name="report_reason" type="radiobox" val="4003" class=" radio_box">'
						+'				<div class="radio_icon"></div>'
						+'				<span>人身攻击</span>'
						+'			</div>'
						+'			<div name="report_reason" type="radiobox" val="4004" class=" radio_box">'
						+'				<div class="radio_icon"></div>'
						+'				<span>营销广告</span>'
						+'			</div>'
						+'			<div name="report_reason" type="radiobox" val="4005" class=" radio_box">'
						+'				<div class="radio_icon"></div>'
						+'				<span>其它</span>'
						+'			</div>'
						+'		</div>'
						+'	</div>'
						+'	<div class="clear"></div>'
						+'	<div class="hspace10"></div>'
						+'	<div class="content_list">'
						+'		<label for="" class="dialog_label">'
						+'			<span>其他原因：</span>'
						+'		</label>'
						+'		<div class="item_box">'
						+'			<textarea name="content_feedback" placeholder="欢迎提出您在使用过程中遇到的问题或宝贵建议（200字以内），感谢您对中青体育提供宝贵建议。"></textarea>'
						+'			<div class="dialog_tips"></div>'
						+'		</div>'
						+'	</div>'
						+'	<div class="clear"></div>'
						+'	<div class="hspace10"></div>'
						+'	<div class="content_list">'
						+'		<label for="" class="dialog_label">'
						+'			<span>上传截图：</span>'
						+'			<span class="tc">（选填 ）</span>'
						+'		</label>'
						+'		<div class="item_box">'
						+'			<div class="upload_box">'
						+'				<div id="idcard_box" class="uploader-list head_box"></div>'
						+'				<div id="idcard_select">'
						+'					<div class="upload_icon"></div>'
						+'					<div class="reupload_text">重新上传</div>'
						+'				</div>'
						+'			</div>'
						+'		</div>'
						+'	</div>'
						+'	<div class="clear"></div>'
						+'	<div class="hspace10"></div>'
						+'	<div class="content_list">'
						+'		<label for="" class="dialog_label vmiddle">'
						+'			<span>验证码：</span>'
						+'		</label>'
						+'		<div class="item_box">'
						+'			<input type="text" class="report_verity" name="report_verity" />'
						+'			<a href="javascript:void(0)" class="report_img"><img src="/collect/generate/code?width=135&height=40" width="100%" alt="" /></a>'
						+'			<div class="verify_report"><div class="dialog_tips hidden">请输入验证码</div></div>'
						+'		</div>'
						+'	</div>'
						+'</div>';
				layer.open({
					scrollbar: false,
					move: false,
					area: '600px', //宽高
					title:'举报',
					content: html,
					success: function(){
						report.init();
					},
					yes: function (index, layero) {
						if($('.report_verity').val()=='' || $('.verify_report .dialog_tips').hasClass('error')){
							return false;
						}
						var selectVal=$('div[name="report_reason"].rb_active').find('input').val();
						var desc=$('textarea[name="content_feedback"]').val();
						var reportData={
							"causeCate":selectVal,"cause":desc,"tipoffType":type,"resId":resourceId,"shotImg":report.responseImg,validateCode : $('.report_verity').val()
						};
						$.hhly.ajax({
							url:'/collect/tipBack',
							data:reportData,
							success:function(data){
								$('.report_img').trigger('click');
								layer.close(index);
								layer.open({
									scrollbar: false,
									move: false,
									area: '440px', //宽高
									title:'温馨提示',
									content:'<span class="at_span warn"></span><span class="dialog_tips">'+data.msg+'</span>',
									btn:["确定"]
								});
							}

						})
					}
				});
			});

		}
	};
	report.reportInit();
})