var basicTeamLaunch = {
	// table切换
	judgecontrol:true,
	judgeCloth:false,
	tableSlide:function(){
		$('.troop_menu li').click(function(){
			var index=$(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			$(this).parents('.troop_menu').siblings('.troop_box').find('.troop_list').eq(index).removeClass('hidden').siblings().addClass('hidden').find('div.cb_active').trigger('click');
			basicTeamLaunch.judgecontrol=true;
		});
	},
	// 场地设置切换
	tablePlace:function(){
		$('.ball_set').on('click','.radio_box',function(){
			var index=$(this).index();
			if(index==0){
				$('.where_hold').removeClass('tc').addClass('tl').val($(this).attr("hhly-place")).removeAttr('disabled');
			}else{
				$('.where_hold').removeClass('tl').addClass('tc').val('待定').attr('disabled','true');
			}
		});
	},
	getMatchTypeId : function(){
		return $("input[name='match_type']").val();
	},
	getFormatId : function(){
		return $("input[name='match_system']").val();
	},
	getMatchDate : function(){
		var array = $("input[name='compete_time']").val().split('-');
		var d = new Date()
		d.setFullYear(parseInt(array[0]),parseInt(array[1])-1,parseInt(array[2]));
		return d;
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
	getFieldPlan : function(){
		return $("input[name='diamond_plan'][checked='checked']").val();
	},
	getPlace : function(){
		return $("input[name='match_place']").val();
	},
	getTeams : function(){
		var array = [];
		$("input[name='mteam_select'][checked='checked']").each(function(){
			array.push(parseInt($(this).val()));
		});
		return array;
	},
	getIsAutoReferee : function(){
		var hasChecked = $("input[name='mjudge_select']").attr("checked");
		if(hasChecked){
			return 1;
		}else{
			return 2;
		}
	},
	getBeginTime:function(){
		var beginBox=$('.launch_timer_box').find('.start_time');
		var beginValue=beginBox.find('input.defined_hours').val()||0;
		var endValue=beginBox.find('input.defined_minute').val()||0;
		return beginValue+':'+endValue;
	},
	getEndTime:function(){
		var beginBox=$('.launch_timer_box').find('.end_time');
		var beginValue=beginBox.find('input.defined_hours').val()||0;
		var endValue=beginBox.find('input.defined_minute').val()||0;
		return beginValue+':'+endValue;
	},
	getData:function(){
		var data={};
		data.homeTeamId = $("#orgId").val();
    	data.formatId = this.getFormatId();
    	data.matchTypeId = this.getMatchTypeId();
    	data.matchDate = this.getMatchDate();
    	data.fieldPlan = this.getFieldPlan();
    	data.fieldName = this.getPlace();
    	data.clother = this.getTeamClothes();
    	data.teams = this.getTeams();
    	data.beginTime =this.getBeginTime();
    	data.endTime = this.getEndTime();
    	data.isAutoReferee = this.getIsAutoReferee();
    	return data;
	},
	// 保存数据
	formSubmit:function(){
		var launchJudge=true;
    	$("#mit_submit_launch").click(function(){
    		if(!launchJudge){
    			return false;
    		}
    		launchJudge=false;
			data=basicTeamLaunch.getData();
			$.ajax({
				type: "POST",
				url: "/team/manage/launch/save",
				data: data,
				dataType: "json",
				traditional: true,
				success:function(msg){
					var obj = $.parseJSON(msg);
					if (obj.result == "0") {
						$("#id").val(obj.data);
						layer.open({
							crollbar: false,
							move: false,
							area:['440px'],
							title: '温馨提示',
							content: '<div class="dialog_tip_box text"><span class="at_span success"></span><span class="dialog_tips">保存成功</span></div>',
							btn: ['确定', '取消'],
							yes:function(index,lay){
								$('.manage_list .manage_list_title li').each(function(){
									if($(this).attr('hhly-url')=='/team/manage/schedule'){
										$(this).trigger('click');
									}
								});
								layer.close(index);
							}
						});
					}else{
						layer.open({
							crollbar: false,
							move: false,
							area:['440px'],
							title: '温馨提示',
							content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">'+obj.msg+'</span></div>',
							btn: ['确定', '取消']
						});
					}
					launchJudge=true;
				},
				error:function(error){
					layer.open({
						crollbar: false,
						move: false,
						area:['440px'],
						title: '温馨提示',
						content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">'+error.msg+'</span></div>',
						btn: ['确定', '取消']
					});
					launchJudge=true;
				}
			});
		});
	},
	// 重置
	formReset:function(){
		$("#mit_reset_launch").click(function(){
	    	var orgId = $("#orgId").val();
	    	$.hhly.ajax({
				url:'/team/manage/launch',
				type:"get",
				data:{"teamId":orgId},
				dataType:'html',
				success:function(data){
					$("#manage_contents").html(data);
				}
			});
	    });
	},
	setLength:function(that){
		if($(that).parents('.team_chose').find('.cb_active').length>=3){
			basicTeamLaunch.judgecontrol=false;
		}else{
			basicTeamLaunch.judgecontrol=true;
		}
    	if(!$(that).hasClass('cb_active')){
			if(basicTeamLaunch.judgecontrol){
				$(that).toggleClass('cb_active').children().attr('checked', ($(that).hasClass('cb_active') ? true : false));
			}
		}else{
    		$(that).toggleClass('cb_active').children().attr('checked', ($(that).hasClass('cb_active') ? true : false));
		}
	},
	timeInit:function(){
		var timeDate=new Date();
		var newTime=[];
		newTime.push(timeDate.getFullYear());
		newTime.push(timeDate.getMonth()+1);
		newTime.push(timeDate.getDate());
		var timeHour=timeDate.getHours();
		var timeMinute=timeDate.getMinutes();
		$.hhly.timer({wrap:'.launch_timer_box .start_time',hours:timeHour,minute:timeMinute,syncData:function(value,max,that){
			var selectDate=$('.compete_time div.selected').text().split('-');
			var oldVal='';
			var copyValue=value;
			if(max==23){
				if(value==23){
					$('.launch_timer_box .start_time').find('input.defined_minute').attr('hhly-max','30');
					$('.launch_timer_box .start_time').find('input.defined_minute').trigger('blur');
				}else{
                	$('.launch_timer_box .start_time').find('input.defined_minute').attr('hhly-max','59');
                }
				oldVal=$('.launch_timer_box .end_time').find('.timer_box .defined_hours').val();
				if(oldVal>value){
					value=oldVal;
				}
				$('.launch_timer_box .end_time').find('input.defined_hours').val(value);
			}else if(max>23){
				oldVal=$('.launch_timer_box .end_time').find('.timer_box .defined_minute').val();
				oldHourVal=$('.launch_timer_box .end_time').find('.timer_box .defined_hours').val();
				oldBeginVal=$('.launch_timer_box .start_time').find('.timer_box .defined_hours').val();
				if(oldBeginVal==oldHourVal){
					if(oldVal>value){
						value=oldVal;
					}
					$('.launch_timer_box .end_time').find('.defined_minute').val(value);
				}
			}
			if(newTime[0]==selectDate[0] && newTime[1]==selectDate[1] && newTime[2]==selectDate[2]){
				if( max==23 && copyValue<=timeHour){
					copyValue=timeHour;
					$('.launch_timer_box .start_time').find('input.defined_hours').val(copyValue);
				}
				if(max>23 && copyValue<=timeMinute){
					copyValue=timeMinute;
					$('.launch_timer_box .start_time').find('.defined_minute').val(copyValue);
				}
			}
		}});
		$.hhly.timer({
			wrap:'.launch_timer_box .end_time',
			hours:timeHour,minute:timeMinute,
			syncData:function(value,max,that){
				var oldVal='';
				if(max==23){
					oldVal=$('.launch_timer_box .start_time').find('.timer_box .defined_hours').val();
					var oldMin=$('.launch_timer_box .start_time').find('.timer_box .defined_minute').val();
					var endMin=$('.launch_timer_box .end_time').find('.timer_box .defined_minute').val();
						if(oldVal==value && parseInt(oldMin)>=parseInt(endMin)){
							value=oldVal;
							endMin=oldMin;
						}
						$('.launch_timer_box .end_time').find('.timer_box .defined_hours').val(value);
						$('.launch_timer_box .end_time').find('.timer_box .defined_minute').val(endMin);
				}
			},
			blur:function(value,max,that){
				var oldVal='';
				if(max==23){
					oldVal=$('.launch_timer_box .start_time').find('.timer_box .defined_hours').val();
					oldValArr=[oldVal.toString().slice(0,1),oldVal.toString().slice(-1)];
					valArr=[value.toString().slice(0,1),value.toString().slice(-1)];
					if(valArr[0]<oldValArr[0]){
						value=oldVal;
					}else if(valArr[0]==oldValArr[0] && valArr[1]<oldValArr[1]){
						value=oldVal;
					}
					$('.launch_timer_box .end_time').find('.timer_box .defined_hours').val(value);
				}else if(max>23){
					oldVal=$('.launch_timer_box .start_time').find('.timer_box .defined_minute').val();
					oldHourVal=$('.launch_timer_box .end_time').find('.timer_box .defined_hours').val();
					oldBeginVal=$('.launch_timer_box .start_time').find('.timer_box .defined_hours').val();
					if(oldBeginVal==oldHourVal){
						oldValArr=[oldVal.toString().slice(0,1),oldVal.toString().slice(-1)];
						valArr=[value.toString().slice(0,1),value.toString().slice(-1)];
						if(valArr[0]<oldValArr[0]){
							value=oldVal;
						}else if(valArr[0]==oldValArr[0] && valArr[1]<oldValArr[1]){
							value=oldVal;
						}
						$('.launch_timer_box .end_time').find('.timer_box .defined_minute').val(value);
					}
				}
			}
		});
	},
	inputInit:function(){
		$('[name="mteam_select"]').inputbox({callback:basicTeamLaunch.setLength});
		$('[name="diamond_plan"],[name="mjudge_select"]').inputbox();
		$('div[name="match_type"],div[name="match_system"],div[name="compete_time"]').inputbox({
			height:28,
			width:110,
			callback:function(that){
				if($(that).index()==0){
					$('.launch_timer_box .start_time').find('input.defined_hours').focus().blur();
					$('.launch_timer_box .start_time').find('.defined_minute').focus().blur();
					$('.launch_timer_box .end_time').find('input.defined_hours').focus().blur();
					$('.launch_timer_box .end_time').find('.defined_minute').focus().blur();
				}
			}
		});
		/*$('[name="shirt_rbt"]').inputbox({
			callback:function(that){
				if($(that).parents('.shirt_choice').find('.cb_active').length>=2){
					basicTeamLaunch.judgeCloth=false;
				}else{
					basicTeamLaunch.judgeCloth=true;
				}
		    	if(!$(that).hasClass('cb_active')){
					if(basicTeamLaunch.judgeCloth){
						$(that).toggleClass('cb_active').children().attr('checked', ($(that).hasClass('cb_active') ? true : false));
					}
				}else{
		    		$(that).toggleClass('cb_active').children().attr('checked', ($(that).hasClass('cb_active') ? true : false));
				}
			}
		});*/
		$('[name="shirt_rbt"]').inputbox();
	},
	init:function(){
		this.tableSlide();
		this.tablePlace();
		this.formSubmit();
		this.formReset();
		this.inputInit();
		this.timeInit();
	}
};
$(function(){
	basicTeamLaunch.init();
});