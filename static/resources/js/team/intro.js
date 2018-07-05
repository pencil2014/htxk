var introCommon = {
		//申请加入球队
		addTeamPlayer:function(){
			var teamId = $("#orgId").val();
			var params = {"teamId":teamId};
			$.hhly.ajax({
				url:"/team/player/apply",
				data:params,
				success:function(obj){
					if(obj.result === '2001'){
						layer.open({
						  title:'温馨提示',
						  content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">未登录，不能申请加入球队！</span></div>',
						  scrollbar: false,
						  move: false,
						  area:['440px'],
						  yes:function(index,lay){
							  window.location.href='/member/login';
						  }
						});
					}else if(obj.result === '0'){
						layer.open({
							area: '440px',
						  content: '<span class="at_span warn"></span><span class="dialog_tips">'+obj.msg+'</span>',
						  scrollbar: false
						});
					}else{
						layer.open({
							area: '440px',
						  content: '<span class="at_span warn"></span><span class="dialog_tips">'+obj.msg+'</span>',
						  scrollbar: false
						});
					}
				}
			});
		},
		//球员类型筛选
		selectMembers:function(){
			var members_list=$('.members_list li');
			var members_inputs=$('.members_type input:checkbox');
			members_inputs.prop('checked',true);
			members_inputs.click(function(){
				var flag=$(this).prop('checked');
				var typeId=$(this).attr('id')
				if(typeId=='all'){
					if(flag){
						members_list.show();
						members_inputs.prop('checked',true);
					}else{
						members_list.hide();
						members_inputs.prop('checked',false);
					}
				}else{
					members_list.each(function(){

						if(typeId==$(this).attr('hhly-position')){
							if(flag){
								$(this).show();
							}else{
								$(this).hide();
							}
						}
					})
				}
				
			})
		},
	    randerBackground : function(){
	    	$(".members_list li").each(function(index,el){
	    		if(index%2==0){
	    			$(this).addClass("active");
	    		}else if(index%2==1){
	    			$(this).addClass("border_bottom");
	    		}
	    	});
	    },		
		init:function(){
			//申请加入球队
			$("#addTeamPlayer").click(function(){
				introCommon.addTeamPlayer();
			});
		}
}
$(function(){
	introCommon.init();
	introCommon.selectMembers();
	introCommon.randerBackground();
});
