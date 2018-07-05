require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
		'personal':'/resources/js/manage/userCenter/common.js?v=5352b1e182',
		'template':'/resources/js/message/template.js?v=2a396bcb2d',
		'paging':'/resources/js/jquery/paging.js?v=b76500a88a',
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
		'paging':{
			deps:['jquery']
		}
    },
});
require(['jquery', 'hhlyAction', 'layer','paging','template','common','i18n','personal'],function($, hhlyAction, layer,Paging,template){
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
					window.location.href=window.location.href;
					//消息重新统计
					// countMessage.count(type);
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
					window.location.href=window.location.href;
					changeDom.html(msgUtil.getTxt("msg_hasread")+'<div class="clearx"></div>');
				}
			},function(){});
		},
		// page分页初始化
		pageInt:function(total,page){
			var total=$('.page_box').attr('hhly-total');
			var page=$('.page_box').attr('hhly-page');
			var type=$('.page_box').attr('hhly-type');
			var tpl=$('.page_box').attr('hhly-tpl');
			var pageDom = new Paging();
			pageDom.init({
				target:'.page_box',
				pagesize:10,
				count:total,
				toolbar:true,
				callback:function(page,size,count){
					$.hhly.ajax({
						url:' /message/list/page',
						type:'get',
						data:{page:page,type:type},
						success:function(data){
							var html=template(tpl,data);
							$('.message_me_list').empty().append(html);
						}
					})
				}
			});
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
						// countMessage.count(type);
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
			this.pageInt();
		},
		/*是否为正整数*/
		isPositiveNum:function(s){
			var re = /^[0-9]*[1-9][0-9]*$/ ;
		    return re.test(s);
		},
	}
	manageMessage.init();
});
