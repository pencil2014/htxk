var tmagent = {
    delect:function () {
    	var judge=true;
        $(".tm_control").on("click","i",function () {
        	if(!judge){
        		return false;
        	}
        	judge=false;
        	tmagent.delPlayer($(this));//删除事件
        	judge=true;
        });
    },
    uodateInfor:function(o){
		var nowOpts=$(o).parents('.opts').find('a').not($(".hidden"));
		var opts=$(o).parents('.tm_select_box').siblings('.tm_select_box').find('.timeplan_match .opts');
		var value=$(o).attr('val');
		var oldValue=$(o).parents('.opts').find('a.old_select').attr('val');
		opts.each(function(){
			var otherLabel=$(this).find('[val="'+oldValue+'"]');
			if(otherLabel.hasClass('hidden')){
				otherLabel.removeClass('hidden');
			}
			var inputValue=$(this).find('input').val();
			if(value==inputValue){
				$(this).find('[val=0]').trigger('click.input');
				$(document).trigger('click.input');
			}
		});
		if(value != 0){
			opts.each(function(){
				var otherLabel=$(this).find('[val="'+value+'"]');
				if(otherLabel.hasClass('hidden')){
					otherLabel.removeClass('hidden');
				}else{
					otherLabel.addClass('hidden');
				}
			});
		}
    },
    inputBox:function () {
        $('div[name="match_select"]').inputbox({height:24,width:110,callback:tmagent.uodateInfor});
        $('div[name="match_account"]').inputbox({height:24,width:110});
        $('div[name="compet_rbttwo"]').inputbox();
    },
    edit:function () {
        $(".tm_control").on("click",'span',function () {
        	$("div[name='firstPosition'] div,div[name='secondPosition'] div").removeClass("selected").text("");
        	tmagent.editPlayer($(this));//编辑事件
        });
    },
    getFirstPosition : function(){
		return $("input[name='firstPosition']").val();
	},
	getSecondPosition : function(){	
		return $("input[name='secondPosition']").val();
	},
	getTeamPosition : function(){
		return $("input[name='rbt'][checked='checked']").val();
	},
	getPersonality : function(){
		var array = new Array();
		$(".personalityActive").each(function(){
			var v = $(this).children("input").val();
			array.push(v);
		});
		return array.toString();
	},
	getRemarks : function(){
		return $("textarea[name='remark']").val();
	},
	//球员信息编辑
	Compiles:function(){
		$('div[name="firstPosition"],div[name="secondPosition"]').inputbox({height:28,width:120});
		$('[name="rbt"], [name="rbt2"]').inputbox();
		$(".player_personality li").click(function(){
			if($(this).children("input").is(":checked")){
				$(this).addClass("personalityActive")
			}else{
				$(this).removeClass("personalityActive")
			}
		});
		$(".player_intro_title i").on("click",function () {
			$(".player_intro_box,.mit_maskhidden").hide();
			$("body").css("overflow","auto")
		})
		$("div[name='rbt'] input").attr("type","checkbox").hide();
	},
	//构造节点
	getNodeContent : function(list,edit,del){
		var content = "";
		for(var k=0 ; k<list.length;k++){
			var item = list[k];
			item.userIconUrl = item.userIconUrl || '/resources/images/default_photo.jpg';
			item.firstPositionName = item.firstPositionName || '';
			item.teamPositionName = item.teamPositionName || '';
			if(item.pcImgTxtUrl){
				pcImgTxt='<div class="approve_show_icon"><img src="${item.pcImgTxtUrl}" height="100%" /></div>';
			}else{
				pcImgTxt="";
			}
			content +=  '<div class="tm_off">'+
							'<div class="tm_pic"><img src="' + item.userIconUrl + '" width="100%"></div>'+
							'   <div class="tm_explain">'+
							'       <div class="tm_explain_top">'+
							'           <p>' + item.userName + '</p>' + (item.teamRole.roleName == null ? '' : '<span>' + item.teamRole.roleName+ '</span>') +
							'       </div>'+pcImgTxt+
							'       <div class="tm_explain_bottom">'+
							'           	惯用脚：<i>' + item.leftOrRightName + '</i>'+
							'       </div>'+
							'   </div>'+
							'   <div class="tm_place">' + item.firstPositionName + '</div>'+
							'   <div class="tm_property">' + item.teamPositionName + '</div>'+
							'   <div class="tm_time">' + item.inTeamTimeFormat + '</div>'+
							'   <div class="tm_control" hhly-player-id="' + item.userId + '" hhly-team-id="' + item.teamId + '">'+ (edit=='1'?'<span></span>':'') + (del == '1'?'<i></i>':'') +
							'</div>'+
						'</div>';
		}
		return content;
	},
	//删除
	delPlayer : function(obj){
		var p = $(obj).parent();
		var teamId = $("#orgId").val();
		var playerId = 	p.attr("hhly-player-id");
		$.hhly.ajax({
			url:'/team/manage/player/del',
			data:{"teamId":teamId,"playerId":playerId},
			success:function(data){
				var jsonObj = $.parseJSON(data);
				if(jsonObj.result == "0"){
					$(obj).parent().parent().remove();
				}else{
					layer.open({
						crollbar: false,
						move: false,
						area:['440px'],
						title: '温馨提示',
						content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">删除失败</span></div>',
						btn: ['确定']
					})
				}
			}
		});
	},
	//球员编辑
	editPlayer : function(obj){
		var p = $(obj).parent();
		var teamId = $("#orgId").val();
		var playerId = 	p.attr("hhly-player-id");
		var that=$(obj);
		$.hhly.ajax({
			url:'/team/manage/player/edit',
			type:'GET',
			data:{"teamId":teamId,"playerId":playerId },
			success:function(data){
				var dictSportList = data.dictSportList;
				var teamPosition = data.dictSportList3;
				var playerPersonality = data.dictSportList4;
				var playerName = data.teamPlayer;
				var playerHeadHtml = "";

				$("#userId").val(playerName.userId);
				
				var first_position="",second_position="",teamPositionHtml="",playerPersonalityHtml="";
				for(var i=0;i<dictSportList.length;i++){
					var item = dictSportList[i];
					first_position += '<a href="javascript:;"  class="' + (item.fieldValue == playerName.firstPosition ? 'selected' : '') + '" val="' + item.fieldValue + '">'+ item.fieldName + '</a>';	
					second_position += '<a href="javascript:;" class="' + (item.fieldValue == playerName.secondPosition ? 'selected' : '') + '" val="' + item.fieldValue + '">'+ item.fieldName + '</a>';
				}
				for(var i=0;i<teamPosition.length;i++){
					var item = teamPosition[i];
					var isChecked = ((playerName.teamPosition == null) && (i == 0)) || (item.fieldValue == playerName.teamPosition);
					teamPositionHtml += '<div name="rbt" class="' + ( isChecked ? 'checked' : '') + '" type="radiobox" val="' + item.fieldValue + '">'+
										'	<div class="radio_icon"></div>'+
										'	<span>' + item.fieldName + '</span>'+
										'</div>';
				}
				for(var i=0;i<playerPersonality.length;i++){
					var item = playerPersonality[i];
					var array = playerName.personalityList;
					var isOk = false;
					if(array != null){
						isOk = false;
						for(var k=0;k<array.length;k++){
							isOk = item.fieldValue == array[k];
							if(isOk){
								break;
							}
						}
					}
					playerPersonalityHtml += '<li class="' + (isOk ? 'personalityActive' : '') + '">'+
					'	<input type="checkbox" ' + (isOk ? 'checked="checked"' : '') + ' name="checkbox" id="' + item.fieldValue + '" value="' + item.fieldValue + '"> '+
					'	<label for="' + item.fieldValue + '"> ' + item.fieldName + ' </label>'+
					'</li>';
				}
				playerName.remarks = playerName.remarks || '';
				playerName.userIconUrl = playerName.userIconUrl || '/resources/images/default_photo.jpg';
				var html='<div class="player_intro_box">'
						+'    <div class="player_intro_name">'
						+'		<div class="player_head fl">'
						+'		    <img src="' + playerName.userIconUrl + '" width="100%">'
						+'		</div>'
						+'		<div class="player_name fl">'
						+'		    <p>'
						+'		        <strong>' + playerName.userName + '</strong>'+ (playerName.teamRole.roleName == null ? '' : '<i>' + playerName.teamRole.roleName + '</i>')
						+'		    </p>'
						+'		    <p class="player_join_years">'
						+'		        <span>惯用脚：<b>' + playerName.leftOrRightName + '</b></span>'
						+'		    </p>'
						+'		</div>'
						+'		<div class="clearx"></div>'
						+'    </div>'
						+'    <div class="play_location">'
						+'        <span>第一位置：</span>'
						+'        <div name="firstPosition" type="selectbox" class="location">'
						+'            <div class="opts first_position">'
						+first_position
						+'            </div>'
						+'        </div>'
						+'        <span>第二位置：</span>'
						+'        <div name="secondPosition" type="selectbox" class="location">'
						+'            <div class="opts second_position">'
						+second_position
						+'            </div>'
						+'        </div>'
						+'        <div class="clearx"></div>'
						+'    </div>'
						+'    <div class="team_position">'
						+'        <span>球队定位：</span>'
						+teamPositionHtml
						+'    </div>'
						+'    <div class="player_personality">'
						+'        <span>个性：</span>'
						+'        <ul>'
						+playerPersonalityHtml
						+'            <div class="clearx"></div>'
						+'        </ul>'
						+'    </div>'
						+'    <div class="player_remark">'
						+'        <span>备注：</span>'
						+'        <textarea name="remark">'+playerName.remarks +'</textarea>'
						+'        <div class="clearx"></div>'
						+'    </div>'
						+'    <input type="hidden" id="userId" value="' + playerId + '">'
						+'</div>';
				layer.open({
					scrollbar: false,
					move: false,
					title: '球员信息编辑',
					area:['600px','630px'],
					content: html,
					btn: ['确定', '取消'],
					success:function(){
						$('div[name="firstPosition"],div[name="secondPosition"]').inputbox({height:28,width:120});
						$('[name="rbt"], [name="rbt2"]').inputbox();
						$(".player_personality li").click(function() {
							if ($(this).children("input").is(":checked")) {
								$(this).addClass("personalityActive");
							} else {								
								$(this).removeClass("personalityActive")								
							}
						});
					},
					yes:function(index, layero){
						var data={};
						data.firstPosition = tmagent.getFirstPosition();
						data.secondPosition = tmagent.getSecondPosition();
						data.teamPosition = tmagent.getTeamPosition();
						data.personality = tmagent.getPersonality();
						data.remarks = tmagent.getRemarks();
						data.teamId = $("#orgId").val();
						data.userId = $("#userId").val();
						$.hhly.ajax({
							url:'/team/manage/player/save',
							data:data,
							success:function(msgData){
								var obj = $.parseJSON(msgData);
								layer.close(index);
								if(obj.result != "0"){
									layer.open({
										crollbar: false,
										move: false,
										area:['440px'],
										title: '温馨提示',
										content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">保存失败</span></div>',
										btn: ['确定']
									})
								}else{
									that.parents('.tm_control').siblings('.tm_place').text($('div[name="firstPosition"] div.selected').text());
									that.parents('.tm_control').siblings('.tm_property').text($('.team_position .rb_active').find('span').text());
								}
							}
						});
					}
				});
			}
		});
	},
	//上一页
	prevPage:function(){
		$(".tm_top_bottom span").click(function(){
	    	var p = $(this).parent();
	    	var url = p.attr("hhly-url");
	    	var page = p.attr("hhly-page-no");
	    	var rows = p.attr("hhly-page-size");
	    	var has = p.attr("hhly-has-page");
	    	var edit = p.attr("hhly-has-edit");
	    	var del = p.attr("hhly-has-del");
	    	var teamId = $("#orgId").val();
	    	//有上一页,读取数据ajax
	    	if(page != '1'){
	    		$.hhly.ajax({
	    			url:url,
	    			type:'GET',
	    			data:{"page":parseInt(page) - 1,"rows":rows,"teamId":teamId},
	    			success:function(data){
	    				if(data){
		    				 p.attr("hhly-page-no",data.page).attr("hhly-page-size",data.rows).attr("hhly-has-page",data.hasNextPage);
		    				 p.prev().html(tmagent.getNodeContent(data.list,edit,del));
		    				 $(".tm_top_bottom em").html(data.page + '/' + data.pages);
		    				 tmagent.init()
		    			 }
	    			}
	    		});
	    	}
	    });
	},
    //下一页
    nextPage:function(){
    	$(".tm_top_bottom i").click(function(){
	    	var p = $(this).parent();
	    	var url = p.attr("hhly-url");
	    	var page = p.attr("hhly-page-no");
	    	var rows = p.attr("hhly-page-size");
	    	var has = p.attr("hhly-has-page");
	    	var edit = p.attr("hhly-has-edit");
	    	var del = p.attr("hhly-has-del");
	    	var teamId = $("#orgId").val();
	    	//有下一页,读取数据ajax	
	    	if(has == 'true'){	
	    		$.hhly.ajax({
	    			url:url,
	    			type:'GET',
	    			data:{"page": parseInt(page) + 1,"rows":rows,"teamId":teamId},
	    			success:function(data){
	    				if(data){
		    				p.attr("hhly-page-no",data.page).attr("hhly-page-size",data.rows).attr("hhly-has-page",data.hasNextPage);
		    				p.prev().html(tmagent.getNodeContent(data.list,edit,del));
		    				$(".tm_top_bottom em").html(data.page + '/' + data.pages);
		    				tmagent.init()
		   			 	}
	    			}
	    		});
	    	}
	    });
    },
    //跳转
    pageHref:function(){
    	$(".tm_top_bottom b").click(function(){
	    	var p = $(this).parent();
	    	var url = p.attr("hhly-url");
	    	var page = $(".tm_top_bottom input").val();
	    	var pages = p.attr("hhly-page-total");
	    	var rows = p.attr("hhly-page-size");
	    	var edit = p.attr("hhly-has-edit");
	    	var del = p.attr("hhly-has-del");
	    	var teamId = $("#orgId").val();
	    	//有下一页,读取数据ajax
	    	if(parseInt(page) > 0 && parseInt(page) <= parseInt(pages)){
	    		$.hhly.ajax({
	    			url:url,
	    			type:'GET',
	    			data:{"page": page,"rows":rows,"teamId":teamId},
	    			success:function(data){
	    				if(data){
	    					p.attr("hhly-page-no",data.page).attr("hhly-page-size",data.rows).attr("hhly-has-page",data.hasNextPage);
		    				p.prev().html(tmagent.getNodeContent(data.list,edit,del));
		    				$(".tm_top_bottom em").html(data.page + '/' + data.pages);
		    				tmagent.init()
		   			 	}
	    			}
	    		});
	    	}
		});
    },
    //角色选择
    ruleEdit:function(){
    	$(".tm_bottom a").click(function(){
			var playerId = $(this).attr("val");
			var roleId = $(this).attr("role-id");
			$.hhly.ajax({
				url:'/team/manage/player/role',
				data:{"playerId":playerId,"roleId":roleId},
				success:function(msgData){
					var obj = $.parseJSON(msgData);
				}	
			});
		});
    },
    randerBackground : function(){
    	$(".tm_off").each(function(index,el){
    		if(index%2==0){
    			$(this).addClass("active");
    		}else if(index%2==1){
    			$(this).addClass("border_bottom");
    		}
    	});
    },
    
    init:function () {
        this.inputBox();
        this.delect();
        this.edit();
        this.prevPage();
        this.nextPage();
        this.pageHref();
        this.ruleEdit();
        this.randerBackground();
    }

};
$(function(){
    tmagent.init();//初始化
   
});
