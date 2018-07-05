var manageMessage ={
	operateMsg: function(msgId,status,callback,errorback){
		$.hhly.ajax({
			url:'/message/messageOperate',
			data:{status:status,msgId:msgId},
			success:callback,
			error:errorback
		});
	},
	changePage: function(page,type){
		$.hhly.ajax({
			url:'/message/list?page='+page+'&type='+type,
			dataType: 'html',
			success:function(data){
				$('#manage_contents').html(data);
				//消息重新统计
				countMessage.count(type);
			},
			error:function(error){
				layer.open({
					crollbar: false,
					move: false,
					area:['440px'],
					title: msgUtil.getTxt("common_dialog_title"),
					content: '<div class="dialog_tip_box text"><span class="at_span success"></span><span class="dialog_tips">'+msgUtil.getTxt("common_network_error")+'</span></div>'
				});
			}
		});
	},
	jumpPage: function(jumpUrl, type, msgId,changeDom){
		window.open(jumpUrl);
		manageMessage.operateMsg(msgId,2,function(data){
			if(data.result == 0 || data.result == '0'){
				changeDom.html(msgUtil.getTxt("msg_hasread")+'<div class="clearx"></div>');
			}
		},function(){});
		setTimeout("countMessage.count("+type+")",5000);
	},
	init: function(){
		$('#manage_contents').off('click','.operateMsg').on('click','.operateMsg',function(){
			var operateCode = $(this).attr("hhly-operateCode");
			var msgId = $(this).attr("hhly-msgId");
			var dom = $(this);
			manageMessage.operateMsg(msgId,operateCode,function(data){
				if(data.result == 0 || data.result == '0'){
					dom.parent().html((operateCode=='4')?msgUtil.getTxt("msg_approved"):msgUtil.getTxt("msg_refused"));
					//消息重新统计
					var type = $('#messageType').val();
					countMessage.count(type);
				}
				else{
					layer.open({
						crollbar: false,
						move: false,
						area:['440px'],
						title: msgUtil.getTxt("common_dialog_title"),
						content: '<div class="dialog_tip_box text"><span class="at_span success"></span><span class="dialog_tips">'+(data.msg==null?msgUtil.getTxt("msg_operate_fail"):data.msg)+'</span></div>'
					});
				}
			},function(error){
				layer.open({
					crollbar: false,
					move: false,
					area:['440px'],
					title: msgUtil.getTxt("common_dialog_title"),
					content: '<div class="dialog_tip_box text"><span class="at_span success"></span><span class="dialog_tips">'+msgUtil.getTxt("common_network_error")+'</span></div>'
				});
			});
		});
		$('#manage_contents').off('click','.messagePage .pageGo').on('click','.messagePage .pageGo',function(){
			var page = $(this).attr("hhly-messagePage");
			var type = $('#messageType').val();
			manageMessage.changePage(page,type);
		});
		$('#manage_contents').off('click','.messagePage .skip_page').on('click','.messagePage .skip_page',function(){
			var page = $(this).parent().parent().find('.messageGoPage').val();
			var type = $('#messageType').val();
			if(manageMessage.isPositiveNum(page)){
				manageMessage.changePage(page,type);
			}
		});
/*		$('#manage_contents').on('click','.message_apply_result',function(){
			if($(this).attr("hhly-operationType")=='3'){
				var jumpUrl = $(this).attr("hhly-url");
				var msgId = $(this).attr("hhly-msgId");
				if(jumpUrl != '' && jumpUrl != '#'){
					var type = $('#messageType').val();
					var changeDom = $(this).find('.message_apply_btn');
					manageMessage.jumpPage(jumpUrl, type, msgId,changeDom);
				}
			}
			return false;
		});*/
		/*$('#manage_contents').on('click','.message_detail',function(){
			$(this).parents('.message_apply_result').trigger('click');
			return false;
		});*/
		$('#manage_contents').off('click','.messageLi').on('click','.messageLi',function(){
			if($(this).find('.message_apply_result').length == 1){
				var that=$(this).find('.message_apply_result')
				if($(that).attr("hhly-operationType")=='3'){
					var jumpUrl = $(that).attr("hhly-url");
					var msgId = $(that).attr("hhly-msgId");
					if(jumpUrl != '' && jumpUrl != '#'){
						var type = $('#messageType').val();
						var changeDom = $(that).find('.message_apply_btn');
						manageMessage.jumpPage(jumpUrl, type, msgId,changeDom);
					}
				}
			}
		});
		$('#manage_contents').on('click','.message_head_a',function(e){
			e.stopPropagation();
		});
	},
	/*是否为正整数*/
	isPositiveNum:function(s){
		var re = /^[0-9]*[1-9][0-9]*$/ ;
	    return re.test(s);
	},
}

$(function(){
	manageMessage.init();
})