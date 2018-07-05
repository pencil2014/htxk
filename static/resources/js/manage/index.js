var BasicIndex = {
		ajax : function(url,params){
			$.hhly.ajax({
    			"url":url,
    			"dataType":"html",
    			"data":params,
    			"success":function(data){
    				 $("#manage_contents").html(data);
	    		}
			});
		},
		/*完善球队资料*/
		updateMatch : function(){
			$("#updateMatch").click(function(){
				 var teamId = $("#orgId").val();
				 var params = {"teamId":teamId};
				 BasicIndex.ajax("/team/manage/info",params);  
			});
		},
		/*招募队员*/
		receviePlayer : function(){
			$("#receviePlayer").click(function(){
				 var teamId = $("#orgId").val();
				 var params = {"teamId":teamId};
				 BasicIndex.ajax("/team/manage/receive",params);
			});
		},
		/*发起约战*/
		launchMatch : function(){
			$("#launchMatch").click(function(){
				 var teamId = $("#orgId").val();
				 var params = {"teamId":teamId};
				 BasicIndex.ajax("/team/manage/launch",params);
			});
		},
	 	matchGetData:function(that,type){
	        var status='';
	        if(type===1){
	            status='<div class="team_center_vs">'
	                +'    <p class="op">vs</p>'
	                +'    <p class="trp">未开始</p>'
	                +'</div>';
	        }else if(type===2){
	            status='<div class="team_center_vs">'
	                +'        <p class="op">vs</p>'
	                +'        <p class="trp">约战中</p>'
	                +'   </div>';
	        }
	        homeIcon=that.attr('hhly-homeTeamIconUrl')||'/resources/images/default_team_logo.png';
	        guestIcon=that.attr('hhly-guestTeamIconUrl')||'/resources/images/default_team_logo.png';
	        var setHtml='<div class="match_dialog">'
	                +'    <div class="team_box">'
	                +'        <div class="team_left">'
	                +'            <span class="team_logo"><img width="100%" src="'+homeIcon+'"></span>'
	                +'            <span class="team_text">' + that.attr('hhly-homeTeamName') + '</span>'
	                +'        </div>'
	                +status
	                +'        <div class="match_right">'
	                +'             <span class="team_logo"><img width="100%" src="'+guestIcon+'"></span>'
	                +'            <span class="team_text">'+ that.attr('hhly-guestTeamName') + '</span>'
	                +'        </div>'
	                +'        <div class="match_item">'
	                +'            <label class="match_label fl">比赛时间:</label>'
	                +'            <div class="match_item_box">'
	                +'                <span class="date fl">'+ that.attr('hhly-matchDate') +'</span>'
	                +'                <div class="launch_timer_box">'
	                +'                    <div class="start_time fl">'
	                +'                    </div>'
	                +'                    <div class="end_time fl">'
	                +'                    </div>'
	                +'                </div>'
	                +'            </div>'
	                +'        </div>'
	                +'        <div class="clear"></div>'
	                +'        <div class="match_item">'
	                +'            <label class="match_label fl">比赛场地:</label>'
	                +'            <div class="match_item_box">'
	                +'                <input type="text" id="match_place" class="alert_place" value="'+ that.attr('hhly-fieldName') +'">'
	                +'                <input type="hidden" id="match_date" value="'+ that.attr('hhly-matchDate') +'">'
	                +'                <input type="hidden" id="match_id" value="' + that.attr('hhly-matchId') +'">'
	                +'            </div>'
	                +'        </div>'
	                +'    </div>'
	                +'</div>';
	                return setHtml;
	    },
	    // 更新比赛
	    updateMatch:function(){
	        $(".edit_match").click(function(){
	            var that = $(this).next("div");
				var beginTime=$(that).attr('hhly-begintime').split(':');
            	var endTime=$(that).attr('hhly-endtime').split(':');
	            var html=BasicIndex.matchGetData(that,1);
	                layer.open({
	                    scrollbar: false,
	                    move: false,
	                    title: '修改比赛',
	                    area:['600px','420px'],
	                    content: html,
	                    btn: ['确定', '取消'],
	                    yes: function(index, layero) {
	                        BasicIndex.alterSubmit(that);
	                        layer.close(index);
	                    },
	                    success: function(layero, index){
	                    	var timeDate=new Date();
							var newTime=[];
							newTime.push(timeDate.getFullYear());
							newTime.push(timeDate.getMonth()+1);
							newTime.push(timeDate.getDate());
							var timeHour=timeDate.getHours();
							var timeMinute=timeDate.getMinutes();
	                        $.hhly.timer({wrap:'.launch_timer_box .start_time',hours:beginTime[0],minute:beginTime[1],syncData:function(value,max,that){
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
								hours:endTime[0],minute:endTime[1],
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
											if(valArr[0]>oldValArr[0]){
												value=oldVal;
											}else if(valArr[0]==oldValArr[0] && valArr[1]<oldValArr[1]){
												value=oldVal;
											}
											$('.launch_timer_box .end_time').find('.timer_box .defined_minute').val(value);
										}
									}
								}
							});
	                    }
	                });
	        });
	    },
	    // 修改比赛提交
	    alterSubmit:function(that){
	        var matchId = $("#match_id").val();
	        var matchDate = $("#match_date").val();
	        var beginTime =$('.launch_timer_box').find('.start_time').find('.defined_hours').val()+':'+$('.launch_timer_box').find('.start_time').find('.defined_minute').val();
       		var endTime =$('.launch_timer_box').find('.end_time').find('.defined_hours').val()+':'+$('.launch_timer_box').find('.end_time').find('.defined_minute').val();
	        var matchPlace = $("#match_place").val();
	        var matchDateTime = matchDate;
	        var params = {"matchId":matchId,"matchDateTime":matchDateTime,"matchPlace":matchPlace,'beginTime':beginTime,'endTime':endTime};
	        //ajax提交数据
	        $.hhly.ajax({
	            "url":"/team/manage/match/update",
	            "data":params,
	            "success":function(data){
	                //更新相应的字段
	                that.attr("hhly-begintime", beginTime);
                	that.attr("hhly-endtime", endTime);
	                that.attr("hhly-fieldName",matchPlace);
	                that.parents('.next_competition').find(".next_competition_time").text(matchDateTime+' '+beginTime);
	                that.parents('.next_competition').find(".next_competition_address").find('span').last().text("球场：" + matchPlace);
	            }
	        });
	    },
		/*修改比赛 */
		//下一场比赛自动播放
		nextGamePlay:function(){
			$(".index_manage_top li:gt(0)").hide();
			setInterval(function() {
			 $('.index_manage_top  li:first')
			  .fadeOut(1000)
			  .next()
			  .fadeIn(1000)
			  .end()
			  .appendTo('.index_manage_top');
			}, 5000);			
		},
		//关注
		teamFoucs:function(){
			$(".foucs_warp a").click(function(){
				var that = $(this);
				url = that.attr("hhly-url");
				//提交数据
				$.hhly.ajax({
					url:url,
					success:function(obj){
						if(obj.result == '2001'){
							layer.open({
								title:'温馨提示',
							  content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">未登录，不能关注！</span></div>',
							  scrollbar: false,
							  move: false,
							  area:['440px'],
							  yes:function(index,lay){
								  window.location.href='/member/login';
							  }
							});
						}else if(obj.result == '0' && obj.data == 'add'){
							that.attr("hhly-url",url.replace("add","del"));
							that.addClass("star_focus");
							that.html(msgUtil.getTxt('common_followed'));
						}else if(obj.result == '0' && obj.data == 'del'){
							that.attr("hhly-url",url.replace("del","add"));
							that.removeClass("star_focus");
							that.html("+ " + msgUtil.getTxt('common_follow'));
						}else{
							layer.open({
								area: '440px',
								content: '<span class="at_span warn"></span><span class="dialog_tips">' + obj.msg + '</span>',
								scrollbar: false
							});
						}
					}
				});
				
			});
		}
}

$(function(){
	BasicIndex.updateMatch();
	BasicIndex.receviePlayer();
	BasicIndex.launchMatch();
	BasicIndex.teamFoucs();
	//BasicIndex.nextGamePlay();	
});