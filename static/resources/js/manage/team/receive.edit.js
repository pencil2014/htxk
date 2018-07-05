var BasicReceive = {
	judgeForm:true,
	getTitle : function(){
		var titleValue=$("input[name='receive_title']").val();
		if($("input[name='receive_title']").val().length===0){
			titleValue=$("input[name='receive_title']").attr('placeholder');
		}
		return titleValue;
	},
	getMinAge : function(){
		var value = $("#range_age").val();
		return value.split(";")[0];
	},
	getMaxAge : function(){
		var value =  $("#range_age").val();
		return value.split(";")[1];
	},
	getMinAttendance : function(){
		var value =  $("#range_work").val();
		return value.split(";")[1];
	},
	getPositionNum : function(){
		var nums = new Array();
		$(".pelop_place").find("strong").each(function(){
			nums.push(parseInt($(this).text()));
		});
		return nums;
	},
	getRemarks : function(){
		return $("#receive_remarks").val();
	},
	getHasValidTime : function(){
		var hasChecked = $("input[name='compet_rbttwo']").attr("checked");
		if(hasChecked){
			return 1;
		}else{
			return 2;
		}
	},
	getValidTime : function(){
		return $("input[name='timeplantwo_select']").val();
	},
	getOrgId : function(){
		return $("#orgId").val();
	},
	reloadData:function(url,param){
		$.hhly.ajax({
			url:url,
			data:param,
			type:'GET',
			dataType:'html',
			success:function(data){
				$("#manage_contents").html(data);
			}
		});
	},
	getData:function(){
		var data={};
		data.orgId = BasicReceive.getOrgId();
		data.title = BasicReceive.getTitle();
		data.minAge = BasicReceive.getMinAge(); // 最小年龄
		data.maxAge = BasicReceive.getMaxAge(); // 最大年龄
		data.minAttendance = BasicReceive.getMinAttendance(); // 最小出勤率
		data.remarks = BasicReceive.getRemarks();//备注
		data.hasValidTime = BasicReceive.getHasValidTime();//是否设置过期时间
		data.validTime = BasicReceive.getValidTime();//过期时间
		
		var positionNum = BasicReceive.getPositionNum();//位置数量
		if(positionNum[0] > 0){			
			data.forward = positionNum[0];// 前锋人员
		}
		if(positionNum[1] > 0){			
			data.wingForward = positionNum[1];// 边锋
		}
		if(positionNum[2] > 0){			
			data.fullBacks = positionNum[2];// 后腰
		}
		if(positionNum[3] > 0){			
			data.midfieldDefender = positionNum[3];// 中后卫
		}
		if(positionNum[4] > 0){			
			data.insideDefender = positionNum[4];// 边后卫
		}
		if(positionNum[5] > 0){			
			data.defender = positionNum[5];// 前后卫
		}
		if(positionNum[6] > 0){	
			data.midfield = positionNum[6];// 中场
		}
		if(positionNum[7] > 0){			
			data.goalkeeper = positionNum[7];// 门将
		}
		if(positionNum[8] > 0){			
			data.coachPlayer = positionNum[8];// 教练兼球员
		}
		if(positionNum[9] > 0){			
			data.insideForward = positionNum[9];// 前腰
		}
		return data;
	},
	//提交
	editSave:function(){
		var ok2 = false;
		$(".pelop_box em,.pelop_box span").click(function() {
			var y = 0;
			var $scolet = $(".pelop_box strong");
			for (var i = 0; i < $scolet.length; i++) {
				var count = parseInt($scolet.eq(i).html());
				y += count;
			}
			if (y == 0) {
				$(".place_tip p").show();
			} else {
				$(".place_tip p").hide();
				return ok2 = true;
			}
		});
		$("#mit_submit_team").click(function(){
			if(!BasicReceive.judgeForm){
				return false;
			}
			BasicReceive.judgeForm=false;
			var data = BasicReceive.getData();
            if($("#range_work").val()!="0;0"){
                $(".age_tip p").hide();
                if(ok2){
                	$.hhly.ajax({
                		url:'/team/manage/receive/save',
                		data:data,
                		success:function(msgData){
                			var orgId = BasicReceive.getOrgId();
                			layer.open({
								crollbar: false,
								move: false,
								area:['440px'],
								title: '温馨提示',
								content: '<div class="dialog_tip_box text"><span class="at_span success"></span><span class="dialog_tips">保存成功</span></div>',
								btn: ['确定']
							});
            				BasicReceive.reloadData("/team/manage/receive",{"teamId":orgId});
            				BasicReceive.judgeForm=true;
                		},
                		error:function(){
							BasicReceive.judgeForm=true;
						}
                	});
                }else{
                    $(".place_tip p").show();
                }
            }else{
                $(".age_tip p").show();
            }
		});
	},
	// 重置
	editReset:function(){
		$("#mit_reset_team").click(function(){
			var orgId = BasicReceive.getOrgId();
			BasicReceive.reloadData("/team/manage/receive/edit",{"teamId":orgId});
		})
	}
};

$(function($){
	BasicReceive.editSave();
	BasicReceive.editReset();
});
