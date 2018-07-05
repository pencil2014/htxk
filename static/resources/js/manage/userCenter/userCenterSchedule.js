require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
		'personal':'/resources/js/manage/userCenter/common.js?v=5352b1e182'
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
		}
    },
});
require(['jquery', 'hhlyAction', 'layer','common','i18n','personal'], function($, hhlyAction, layer) {
	var personal={
		inputInt:function(){
			$.hhly.inputbox({
				wrap:'div[name="timeplantwo_select"]',
				width: 99,
				height: 26
			})
		},
		//数据处理
		dataControl: function() {
			var tHtml = '';
			var dataBox = $(".l_user_day .l_user_ul .li").find("span").eq(0).find('div'),
			len = dataBox.length;
			for (var i = 0; i < len; i++) {
				if (len == 0) {
					$(".sbox").html("")
				} else if (len == 1) {
					$(".sd_select").html("")
				} else {
					var margin = $(".sd_select").width() / 2;
					$(".sd_select span").eq(0).addClass("tsp");
					$(".sd_select").append('<span class="osp"></span>').css({"margin-left": -0 + "px"})
				};
				var thisData=dataBox.eq(i);
				
				if (thisData.hasClass('match')) {
					var homeUrl = thisData.attr('hhly-hometeamiconurl') || '/resources/images/default_team_logo.png',
					guestUrl = thisData.attr('hhly-guestteamiconurl') || '/resources/images/default_team_logo.png';
					tHtml += "<div class='ccbox'>" +
								"<div class='ttork'>" +
									"<ul>" +
										"<li>" +
											"<dl class='first_dl'>" +
												"<dt><img src=" + homeUrl + "></dt>" +
												"<dd><p>" + thisData.attr('hhly-hometeamname') + "</p><span>[主队]</span></dd>" +
											"</dl>" +
										"</li>" +
										"<li class='ttork_li'><p>vs</p><span>" + thisData.attr('hhly-matchtypename') + "</span></li>" +
										"<li>" +
											"<dl class='two_dl'>" +
												"<dt><img src=" + guestUrl + "></dt>" +
												"<dd><p>" + thisData.attr('hhly-guestteamname') + "</p></dd>" +
											"</dl>" +
										"</li>" +
									"</ul>" +
								"</div>" +
								"<div class='today_tip'>" +
									"<p class='one_tip'>天气 : <span>晴天 36°C</span></p>" +
									"<p class='two_tip'>时间 : <span>" + thisData.attr('hhly-matchtime') + "</span></p>" +
									"<p class='three_tip'>球场 : <span>" + thisData.attr('hhly-fieldname') + "</span></p>" +
									"<p class='four_tip'>赛制 : <span>" + thisData.attr('hhly-formatname') + "</span></p>" +
								"</div>" +
							"</div>";
				} else {
					var hidden = i == 0 ? "" : "hidden",
					userUrl = thisData.attr('hly-usericon') || '/resources/images/default_photo.jpg';
					
					var status=thisData.attr('hhly-fightStatus');
					var statusClass='';
					if(status=='1'){
						statusClass='green';
					}else if(status=='2'){
						statusClass='success';
					}else if(status=='3'){
						statusClass='firld';
					}else if(status=='4'){
						statusClass='close';
					}else{
						statusClass='finished';
					}

					tHtml += "<div class='ccbox "+hidden+"'>" +
								"<div class='sbox_img'>" +
									"<div class='pic'><img src=" + userUrl + "></div>" +
									"<div class='sbox_messg'>" +
										"<p>" + thisData.attr('hhly-username') + "</p>" +
									"</div>" +
									"<div class='l_time statusClass '"+hidden+"'>" +
										"<p class='timeInfo'>"+thisData.attr('hhly-fightStatusName')+"</p>" +
									"</div>" +
								"</div>" +
								"<ul>" +
									"<li class='first_li'><span></span><p>" + thisData.attr('hhly-fightname') + "</p></li>" +
									"<li>时间：<span>" + thisData.attr('hhly-fightShowTime') + "</span></li>" +
									"<li>球场：<span>" + thisData.attr('hhly-fightplace') + "</span></li>" +
									"<li>赛制：<span>" + thisData.attr('hhly-fightformat') + "</span></li>" +
									"<li>费用：<span>" + thisData.attr('hhly-fightplay') + "</span></li>" +
									"<li><span class='fl'>备注：</span><span class='l_remarks'>" + thisData.attr('hhly-remark') + "</span></li>" +
								"</ul>" +
							"</div>";
				}
			}
			return tHtml
		},
		// 点击日期处理
		liEvent:function(){
			$(".user_day li").not($(".user_day_li")).click(function() {
				$(".sd_select").html('');
				$(".ccbox:gt(0)").hide();
				$(".user_day li").not($(".user_day_li")).removeClass("li").find("span,p").removeClass("li");
				$(this).addClass("li").siblings().removeClass("li");
				$(this).find("p,span").addClass("li");
				personal.publicList();
				var thisDay=$(this).find('p').text();
				var thisMonth=$('.personal_sched .timeplan_select').find('div.selected').text().split('-');
				var serverDay=$('#manage_contents>.user_day').attr('time').slice(0,10).split('-');
				if(thisMonth[0]<serverDay[0]){
					$('.user_today a.user_btn').addClass('hidden');
				}else if(thisMonth[0]==serverDay[0]){
					if(thisMonth[1]<serverDay[1]){
						$('.user_today a.user_btn').addClass('hidden');
					}else if(thisMonth[1]==serverDay[1]){
						if(thisDay<parseInt(serverDay[2])){
							$('.user_today a.user_btn').addClass('hidden');
						}else{
							$('.user_today a.user_btn').removeClass('hidden');
						}
					}else{
						$('.user_today a.user_btn').removeClass('hidden');
					}
				}else{
					$('.user_today a.user_btn').removeClass('hidden');
				}
			}).hover(function() {
				$(this).addClass("schedule_color").children().addClass("schedule_color");
			}, function() {
				$(this).removeClass("schedule_color").children().removeClass("schedule_color");
			});
		},
		circleEvent:function(){
			$(".sd_select").on("click", "span", function() {
				var index = $(this).index();
				var thisObj = $(".l_user_day .l_user_ul .li");
				var divStatus = thisObj.find('span').find('div').eq(index).attr('hhly-hometeamname');
				if (!(divStatus)) {
					var status = thisObj.find("span").find('i').eq(index).attr("hhly-fightstatus");
				}
				$(".ccbox").hide().eq(index).show();
				$(".sd_select .osp").removeClass("tsp");
				$(this).addClass("tsp");
			});
		},
		publicList:function(){
			var oCon = $(".l_user_day .l_user_ul .li").find("span").eq(0).find('div'),
			status = oCon.eq(0).attr("hhly-fightstatus"), //状态
			oLen = oCon.length;
			if (oLen == 0 || oLen == undefined) {
				$(".not_plan").css('display', 'block');
				$(".sbox").hide();
			} else {
				$(".not_plan").css('display', 'none');
				$(".sbox").show();
			};
			if (oLen) {
				$(".not_plan").css("display", "none");
				$(".sbox").html(personal.dataControl(oLen, oCon));

			} else {
				$(".not_plan").show();
				$(".sd_select").html("");
			};
			if (oLen == 1) {
				$(".sd_select").html("");
			}
		},
		init:function(){
			this.inputInt();
			this.liEvent();
			this.circleEvent();
			this.publicList();
			$('.user_day .l_user_ul li.li').trigger('click');
			$('.user_btn').removeClass('hidden');
			var judgeGroup=$('.user_calendar').attr('hhly-authtype')=='1'?true:false;
			if(!judgeGroup){
				$('.user_today a.user_btn').css('display','none');
			}
		}
	};
	personal.init();
});