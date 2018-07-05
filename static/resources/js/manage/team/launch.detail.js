var launchCommon = {
		look : function () {
	        $(".fight_title .one_li i").click(function () {
	            $(this).toggleClass("i")
	        });
	        $(".fight_title_togg").click(function () {
	            $(".fight_show").show();
	            $(this).hide();
	        });
	        $(".fight_togg").click(function () {
	            $(".fight_show").hide();
	            $(".fight_title_togg").show();
	        });
	    },
		//应战
		agree : function(){
			var acceptJudge=true;
			$("#launchAgree").click(function(){
				if(!acceptJudge){
					return false;
				}
				acceptJudge=false;
				var teamId = $("#teamId").val();
				var launchId = $("#launchId").val();
				var params = {"teamId":teamId,"launchId":launchId}
				$.hhly.ajax({
					url:"/team/manage/launch/agree",
					data:params,
					success:function(msg){
						var obj = $.parseJSON(msg);
						if (obj.result == "0") {
							layer.open({
								crollbar: false,
								move: false,
								area:['440px'],
								title: '温馨提示',
								content: '<div class="dialog_tip_box text"><span class="at_span success"></span><span class="dialog_tips">申请成功</span></div>',
								btn: ['确定'],
								yes:function(lay,index){
									$('#launchRefuse,#launchAgree').addClass('hidden');
									$('.fight_title .fight_btn').append('<p class="p_btn">约战成功</p>')
									layer.close(lay);
									
								}
							});
						}else{
							layer.open({
								crollbar: false,
								move: false,
								area:['440px'],
								title: '温馨提示',
								content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">申请失败</span></div>',
								btn: ['确定']
							});
						}
					}
				});
			});
		},
		//拒绝
		refues:function(){
			var refuseJudge=true;
			$("#launchRefuse").click(function(){
				if(!refuseJudge){
					return false;
				}
				refuseJudge=false;
				var teamId = $("#teamId").val();
				var launchId = $("#launchId").val();
				var params = {"teamId":teamId,"launchId":launchId}
				$.hhly.ajax({
					url:"/team/manage/launch/refuse",
					data:params,
					success:function(msg){
						var obj = $.parseJSON(msg);
						if (obj.result == "0") {
							layer.open({
								crollbar: false,
								move: false,
								area:['440px'],
								title: '温馨提示',
								content: '<div class="dialog_tip_box text"><span class="at_span success"></span><span class="dialog_tips">拒绝成功</span></div>',
								btn: ['确定'],
								yes:function(lay,index){
									$('#launchRefuse,#launchAgree').addClass('hidden');
									$('.fight_title .fight_btn').append('<p class="p_btn">拒绝成功</p>')
									layer.close(lay);
									
								}
							});
						}else{
							layer.open({
								crollbar: false,
								move: false,
								area:['440px'],
								title: '温馨提示',
								content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">拒绝失败</span></div>',
								btn: ['确定']
							});
						}
					}
				});
			});
		},
		//关注
		focus:function(){
			
		}
}
$(function(){
	launchCommon.agree();
	launchCommon.refues();
	launchCommon.focus();
	//加载同城球队
	SportIPModule.loadData();
	$("span[hhly-index='sportIP']").trigger("click");	
	//launchCommon.look();
});