var commonPublish = {
	// LAYER层
	zIndex:'',
	// 防重复按钮提交
	judgeSubmit:true,
	// 切换过程
	slide: function(index, pType) {
		$('#publishTitle li').removeClass("publishActive");
		$('#publishTitle li').eq(index).addClass('publishActive');
		$(".publish_list").hide().eq(index).show();
		if ($(".publish_list:visible").html().length < 50) {
			var menuUrl = '/manage/news/goAdd';
			var menuData = {
				type: pType
			};
			$.hhly.ajax({
				url: menuUrl,
				data: menuData,
				dataType: 'html',
				success: function(data) {
					$(".publish_list").eq(index).html(data);
				}
			});
		}
	},
	// 点击弹框
	slideDialog: function() {
		$("#publishTitle").on('click', 'li', function(event) {
			event.preventDefault();
			var hIndex=$(this).index();
			var pType=$(this).attr("hhly-publishType");
			var oldIndex=$('#publishTitle').find('li.publishActive').index();
			var aueditor=articleEdit.articleUEditor;
			if(!$(this).hasClass('publishActive') && oldIndex < 3){
				if((oldIndex == 0 && aueditor.getContent().replace(/_ueditor_page_break_tag_/g,"").length>0 ) 
						|| (oldIndex == 1 && $('#imagesList').find('li').length>1)
						|| (oldIndex == 2 && $('#start_video_div').hasClass('webuploader-element-invisible'))){
					commonPublish.zIndex=layer.open({
						scrollbar: false,
						move: false,
						title: msgUtil.getTxt("common_dialog_title"),
						area:['440px'],
						content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">'+msgUtil.getTxt("news_confirm_tab")+'</span></div>',
						btn: [ msgUtil.getTxt("common_leavel"), msgUtil.getTxt("common_cancel")],
						yes: function(index, layero) {
							commonPublish.draftGiveUp(layero);
							if(oldIndex == 0){
								articleEdit.reload(aueditor);
							}else if(oldIndex == 1){
								imageEdit.reload();
							}else if(oldIndex===2){
								videoEdit.videoReload();
							}
						},
						success: function(layero, index){
							$('.layui-layer-dialog').find('.layui-layer-btn a').attr('hhly-index',hIndex);
							$('.layui-layer-dialog').find('.layui-layer-btn a').attr('hhly-pType',pType);
						}
					});
				}
				else{ //如果内容没有变化，直接切换
					commonPublish.slide(hIndex, pType);
				}
			}
		});
	},
	// 存草稿
	draftSave: function(layero) {
		var index = layero.find('.layui-layer-btn a').attr('hhly-index');
		var pType = layero.find('.layui-layer-btn a').attr('hhly-pType');
		var oldIndex=$('#publishTitle').find('li.publishActive').index();
		layer.close(commonPublish.zIndex);
		if (oldIndex == 0) {
			articleEdit.formVaridate(1,false,articleEdit.articleUEditor,function(){
				commonPublish.slide(index,pType);
			});
		} else if (oldIndex == 1) {
			imageEdit.formVaridate(1,false,function(){
				commonPublish.slide(index,pType);
			});
		}
	},
	// 离开不保存
	draftGiveUp: function(layero) {
			var index = layero.find('.layui-layer-btn a').attr('hhly-index');
			var pType = layero.find('.layui-layer-btn a').attr('hhly-pType');
			commonPublish.slide(index, pType);
			layer.close(commonPublish.zIndex);
	},
	addZero:function(num){
		if(num < 10){
			return "0"+num;
		}
		return num;
	},
	// 定时发布弹框
	timeDialog:function(publishType){
		$.hhly.ajax({
			url:'/time/timestamp',
			type:'get',
			success:function(data){
				
				var addTime = 2*60*1000;//服务器时间调后2分钟，定时发布的时间不要太近，给用户一些反应操作时间
				
				var time=new Date(data.data + addTime);
				
				if(time.getMinutes() >= 55){
					addTime += (60 - time.getMinutes())*60*1000;
					time=new Date(data.data + addTime);
				}
				
				var time1=new Date(data.data + addTime + 86400000);
				var time2=new Date(data.data + addTime + 2*86400000);
				var year=time.getFullYear();
				var month=commonPublish.addZero(time.getMonth()+1);
				yearMonth=year+'-'+month+'-';
				var days=commonPublish.addZero(time.getDate());
				var hours=commonPublish.addZero(time.getHours());
				var minute=commonPublish.addZero(time.getMinutes());
				
				var yearObj=[yearMonth+days,
				             time1.getFullYear()+"-"+commonPublish.addZero(time1.getMonth()+1)+"-"+commonPublish.addZero(time1.getDate()),
				             time2.getFullYear()+"-"+commonPublish.addZero(time2.getMonth()+1)+"-"+commonPublish.addZero(time2.getDate())];
				var hoursObj=['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'];
				var minuteObj=['00','05','10','15','20','25','30','35','40','45','50','55'];
				var yearHtml='';
				for(var i=0;i<yearObj.length;i++){
					yearHtml+='<a href="javascript:;" hhly-min-day='+days+' hhly-min-hours='+hours+'  hhly-min-minute='+minute+' val='+(parseInt(days)+i)+'>'+yearObj[i]+'</a>';
				}
				var hoursHtml='';
				for(var j=0;j<hoursObj.length;j++){
					hoursHtml+='<a href="javascript:;" hhly-min-hours='+hours+'  hhly-min-minute='+minute+' val='+hoursObj[j]+'>'+hoursObj[j]+'</a>';
				}
				var minuteHtml='';
				for(var m=0;m<minuteObj.length;m++){
					minuteHtml+='<a href="javascript:;" hhly-min-minute='+minute+' val='+minuteObj[m]+'>'+minuteObj[m]+'</a>';
				}
				var html='<div class="time_publish">'
						+'	<div class="time_container">'
						+'		<form method="" action="" class="select_form">'
						+'			<span>'+msgUtil.getTxt("news_select_time")+'</span>'
						+'			<div class="timeplan_date" name="timeplan_date" type="selectbox">'
						+'				<div class="opts">'+yearHtml+'</div>'
						+'			</div>'
						+'			<div class="timeplan_hour" name="timeplan_hour" type="selectbox">'
						+'				<div class="opts">'+hoursHtml+'</div>'
						+'			</div>'
						+'			<div class="timeplan_minute" name="timeplan_minute" type="selectbox">'
						+'				<div class="opts">'+minuteHtml+'</div>'
						+'			</div>'
						+'		</form>'
						+'	</div>'
						+'	<div class="time_publish_footer">'
						+'		<span>'+msgUtil.getTxt("news_about_to")+'</span>'
						+'		<i>'
						+'			<span class="publish_date">'+yearObj[0]+'</span>'
						+'			<span class="selected_time publish_hour">'+hoursObj[0]+'</span>'
						+'			<span>:</span>'
						+'			<span class="selected_minu publish_minute">'+minuteObj[0]+'</span>'
						+'		</i>'
						+'		<span>'+msgUtil.getTxt("news_publish")+'</span>'
						+'	</div>'
						+'</div>';
				layer.open({
					scrollbar: false,
					move: false,
					area:['600px','320px'],
					title: msgUtil.getTxt("news_timing_publish"),
					content: html,
					btn:[msgUtil.getTxt("common_sure"), msgUtil.getTxt("common_cancel")],
					success: function(layero, index){
						$('div[name="timeplan_date"]').inputbox({
							width:'140px',
							callback:function(that){
								var value=$(that).attr('val');
								var minDayValue=$(that).attr('hhly-min-day');
								var minHourValue=$(that).attr('hhly-min-hours');
								if(parseInt(value)==parseInt(minDayValue)){
									$('.timeplan_hour .opts a').each(function(){
										var value=$(this).attr('val');
										if(parseInt(minHourValue)>parseInt(value)){
											$(this).addClass('hidden');
										}else{
											$(this).removeClass('hidden');
										}
									});
									$('.select_form .timeplan_hour .opts').find('a[val="'+minHourValue+'"]').trigger('click.input');
								}else{
									$('.timeplan_hour .opts a.hidden').each(function(){
										$(this).removeClass('hidden');
									});
									$('.timeplan_hour .opts a').first().trigger('click.input');
									$(document).trigger('click.input');
								}
								var text=$(that).text();
								$('.publish_date').text(text);
							}
						});
						$('div[name="timeplan_hour"]').inputbox({
							width:'80px',
							callback:function(that){
								var value=$(that).attr('val');
								var minHourValue=$(that).attr('hhly-min-hours');
								if(parseInt(value)==parseInt(minHourValue)){
									$('.timeplan_minute .opts a').each(function(){
										var minuteValue=$(this).attr('val');
										var minMinuteValue=$(this).attr('hhly-min-minute');
										if(parseInt(minMinuteValue)>parseInt(minuteValue)){
											$(this).addClass('hidden');
										}else{
											$(this).removeClass('hidden');
										}
										$('.timeplan_minute .opts a:not(.hidden)').first().trigger('click.input');
									});
								}else{
									$('.timeplan_minute .opts a.hidden').each(function(){
										$(this).removeClass('hidden');
									});
									$('.timeplan_minute .opts a').first().trigger('click.input');
									$(document).trigger('click.input');
								}
								var text=$(that).text();
								$('.publish_hour').text(text);
							}
						});
						$('div[name="timeplan_minute"]').inputbox({
							width:'80px',
							callback:function(that){
								var text=$(that).text();
								$('.publish_minute').text(text);
							}
						});
						$('.select_form .timeplan_date .opts').find('a').first().trigger('click.input');
						commonPublish.judgeSubmit=true;
					},
					yes:function(layero,index){
						layer.close(layero);
						var dates = $('.time_publish .publish_date').text().split("-");
						var hour = parseInt($('.time_publish .publish_hour').text());
						var minite = parseInt($('.time_publish .publish_minute').text());
						var chooseDate = new Date();
						chooseDate.setFullYear(dates[0]);
						chooseDate.setMonth(parseInt((dates[1])-1));
						chooseDate.setDate(dates[2]);
						chooseDate.setHours(hour);
						chooseDate.setMinutes(minite);
						chooseDate.setSeconds(0);
						$.hhly.ajax({
							url:'/time/timestamp',
							type:'get',
							success:function(data){
								var systemTime = new Date(data.data);
								if(chooseDate.getTime() - systemTime.getTime() < 1*60*1000 )
								{
									layer.open({
										scrollbar: false,
										move: false,
										title: msgUtil.getTxt("common_dialog_title"),
										area:['440px'],
										content: '<div class="dialog_tip_box text"><span class="at_span success"></span><span class="dialog_tips">'+msgUtil.getTxt("news_timing_publish_early")+'</span></div>',
									});
								}
								else
								{
									if(publishType==1){
										var aueditor=articleEdit.articleUEditor;
										articleEdit.formVaridate(0,true,aueditor);
									}else if(publishType==2){
										imageEdit.formVaridate(0,true);
									}
								}
							}
						});
					}
				});
			}
		});
	},
	// 定时发布触发
	timePublish:function(){
		$("body").off('click','.publish_options .btn_publish');//千万不能去掉
		$("body").on('click','.publish_options .btn_publish',function(){
			if(!commonPublish.judgeSubmit){
				return false;
			}
			commonPublish.judgeSubmit=false;
			var publishType=$(this).attr( 'hhly-publish-type' );
			commonPublish.timeDialog(publishType);
		});
	},
	// 字数统计
	videoShowWordNum:function(target,maxLength){
		var wordNum = $(target).val().length;
		if(wordNum > maxLength){
			$(target).val($(target).val().substring(0,maxLength));
			$(target).parent().find('i:first').html(maxLength);
		}
		else{
			$(target).parent().find('i:first').html(wordNum);
		}
	},
	init: function() {
		this.slideDialog();
		this.timePublish();
	}
};
$(function() {
	commonPublish.init();
});