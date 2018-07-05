var receive={
	//招募
	recruit:function(){
		$(".publish_recruit").click(function(){
			var teamId = $("#orgId").val();	
			$.hhly.ajax({
	    		url:'/team/manage/receive/edit',
	    		data:{"teamId": teamId},
	    		type:'GET',
				dataType:'html',
	    		success:function(data){	
	    			$("#manage_contents").html(data);
	    		}
	    	});		
		});
	},
	//删除事件
	reDelete:function(){
		$(".close_recruit").click(function(){
			var receiveId = $(this).attr('hhly-receive-id');
			var that = $(this);
			layer.open({
				scrollbar: false,
				move: false,
				area:'440px',
				title: msgUtil.getTxt("common_dialog_title"),
				content:'<span class="at_span warn"></span><span class="dialog_tips">确定要删除此招募吗？</span>',
				btn: [msgUtil.getTxt("common_sure"), msgUtil.getTxt("common_cancel")],
				yes:function(layero, index){
					$.hhly.ajax({
						url:'/team/manage/receive/del',
						data:{receiveId:receiveId},
						success:function(data){
							var data=JSON.parse(data);
							if(data.result == 0){
								that.parent().remove();
				        	}
				        	else{
				        		layer.open({
				        			scrollbar: false,
									move: false,
									area:'440px',
									title: msgUtil.getTxt("common_dialog_info"),
									content:'<span class="at_span error"></span><span class="dialog_tips">'+msgUtil.getTxt("common_failDelete")+'</span>',
				        		});
				        	}
				        	layer.close(layero);
						},
						error:function(error){
							layer.open({
								scrollbar: false,
								move: false,
								area:'440px',
								title: msgUtil.getTxt("common_dialog_info"),
								content:'<span class="at_span error"></span><span class="dialog_tips">'+msgUtil.getTxt("common_network_error")+'</span>',
							});
						}
					});
				}
			});			
			
			
			
			
			
			
			
			
			
			
		});
	},
	//重新招募
	recruitReset:function(){
		$(".re_publish").click(function(){
			var receiveId = $(this).attr('hhly-receive-id');
			var teamId = $("#orgId").val();
			
			$.hhly.ajax({
	    		url:'/team/manage/receive/pub',
	    		data:{"receiveId":receiveId},
	    		success:function(data){
	    			var obj = $.parseJSON(data);
	    			if(obj.result == "0"){
	    				$.hhly.ajax({
	    		    		url:'/team/manage/receive',
	    		    		data:{"teamId": teamId},
	    		    		type:'GET',
	    					dataType:'html',
	    		    		success:function(data){
	    		    			$("#manage_contents").html(data);
	    		    		}
	    		    	});	
					}else{
						layer.open({
							crollbar: false,
							move: false,
							area:['440px'],
							title: '温馨提示',
							content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">重新招募失败</span></div>',
							btn: ['确定']
						});
					}
	    		}
	    	});	
		});
	},
	init:function(){
		this.recruit();
		this.reDelete();
		this.recruitReset();
	}
};

$(function(){
	receive.init();
});
