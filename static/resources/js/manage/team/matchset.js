var BasicMatchSet={
	//赛事类型
	judgecontrol:false,
	jdSubmit:true,
	getFormatId : function(){
		return $("input[name='people_rbt'][checked='checked']").val();
	},
	//比赛费用
	getCostTypeId : function(){
		return $("input[name='cost_rbt'][checked='checked']").val();
	},
	//竞技水平
	getLevelId : function(){
		var levelId = "0";
		$("#dictLevelList").children("div").each(function(){
			if($(this).hasClass("rb_active")){
				levelId = $(this).attr("val");
				return ;
			}
		});
		return levelId;
	},
	//时间日期选择
	getWeekSet : function(){
		var array = new Array();
		$("#weekSetList").children("div").each(function(){
			if($(this).hasClass("cb_active")){
				array.push($(this).attr("val"));
			}
		});
		return array.toString();
	},
	//时间段选择
	getTimeBetweenId : function(){
		return $("input[name='timeplan_select']").val();
	},
	//球衣选择
	getTeamClothes : function(){
		var inputSelect=$("input[name='shirt_rbt'][checked='checked']");
		var cloth=[];
		inputSelect.each(function(){
			cloth.push($(this).val());
		});
		return cloth.toString();
	},
	//是否自动约战选择
	getAutoEngage : function(){
		var hasChecked = $("input[name='auto_engage']").attr("checked");
		if(hasChecked){
			return 1;
		}else{
			return 2;
		}
	},
	getOrgId : function(){
		return  $("#orgId").val();
	},
	//自动约战人数设定
	getEngageNum : function(){
		return $("input[name='match_account']").val();
	},
	getData:function(){
		var data={};
		data.id =  $("#matchSetId").val();//赛事设定ID
		data.teamId = BasicMatchSet.getOrgId();
		data.formatId = BasicMatchSet.getFormatId();
		data.costTypeId = BasicMatchSet.getCostTypeId();
		data.levelId = BasicMatchSet.getLevelId();
		data.weekSet = BasicMatchSet.getWeekSet();
		data.timeBetweenId = BasicMatchSet.getTimeBetweenId();
		data.teamClothes = BasicMatchSet.getTeamClothes();
		data.isAutoEngage = BasicMatchSet.getAutoEngage();
		data.engageNum = BasicMatchSet.getEngageNum();
		return data;
	},
	// 确定
	formSubmit:function(){
		$("#mit_submit").click(function(){
			if(!BasicMatchSet.jdSubmit){
				return false;
			}
			
			data=BasicMatchSet.getData();
			BasicMatchSet.jdSubmit=false;
			//读取数据ajax提交
			$.hhly.ajax({
				url:'/team/manage/matchSet/save',
				data:data,
				success:function(msg){
					var obj = $.parseJSON(msg);
					if (obj.result == "0") {
						$("#matchSetId").val(obj.data);
						layer.open({
							crollbar: false,
							move: false,
							area:['440px'],
							title: '温馨提示',
							content: '<div class="dialog_tip_box text"><span class="at_span success"></span><span class="dialog_tips">保存成功</span></div>',
							btn: ['确定', '取消']
						});
					}else{
						layer.open({
							crollbar: false,
							move: false,
							area:['440px'],
							title: '温馨提示',
							content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">保存失败</span></div>',
							btn: ['确定', '取消']
						});
					}
					BasicMatchSet.jdSubmit=true;
				},
				error:function(error){
					layer.open({
						crollbar: false,
						move: false,
						area:['440px'],
						title: '温馨提示',
						content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">保存失败</span></div>',
						btn: ['确定', '取消']
					});
					BasicMatchSet.jdSubmit=true;
				}
			})
		});

	},
	formReset:function(){
		$("#mit_reset").click(function(){
			var teamId = BasicMatchSet.getOrgId();
			$.hhly.ajax({
				url:'/team/manage/matchSet',
				type:"get",
				data:{"teamId":teamId},
				dataType:'html',
				success:function(data){
					$("#manage_contents").html(data);
				}
			});
		});
	},
	init:function(){
		this.formSubmit();
		this.formReset();
		$('[name="people_rbt"],[name="cost_rbt"],[name="compet_rbt"],div[name="auto_engage"]').inputbox();
		$('[name="shirt_rbt"]').inputbox({
			callback:function(that){
				if($(that).parents('.shirt_choice').find('.cb_active').length>=2){
					BasicMatchSet.judgecontrol=false;
				}else{
					BasicMatchSet.judgecontrol=true;
				}
		    	if(!$(that).hasClass('cb_active')){
					if(BasicMatchSet.judgecontrol){
						$(that).toggleClass('cb_active').children().attr('checked', ($(that).hasClass('cb_active') ? true : false));
					}
				}else{
		    		$(that).toggleClass('cb_active').children().attr('checked', ($(that).hasClass('cb_active') ? true : false));
				}
			}
		});
	    $('div[name="timeplan_select"],div[name="timeplantwo_select"]').inputbox({height:28,width:110});
	    $('div[name="match_account"]').inputbox({height:28,width:80});
	    $(".dialog_btn,.monolayer_top span").click(function(){
			$(".tip_container,.mit_maskhidden").hide();
			$("body").css("overflow","auto");
		});
	    var y = $(".tip_container").height();
	    $(".tip_container").css("margin-top",-y/2);
	}
};
$(function(){
	BasicMatchSet.init();
});



