var BasicTeamSet = {
	//组织名称
	getOrgName : function(){
		return $("input[name='nickname_input']").val();
	},
	//赛事类型
	getFormatId : function(){
		return $("input[name='people_rbt'][checked='checked']").val();
	},
	//签名
	getSignature : function(){
		return $("input[name='signature']").val();
	},
	//简介
	getIntro : function(){
		return $("textarea[name='infor_desc']").val();
	},
	//省份
	getAreaProv : function(){
		return $("input[name='province']").val();
	},
	//城市
	getAreaCity : function(){
		return $("input[name='city']").val();
	},
	//区
	getAreaDist : function(){
		return $("input[name='area']").val();
	},
	//组织类型
	getGroupType : function(){
		return $("input[name='match_select']").val();
	},
	//电话号码
	getPhone : function(){
		return $("input[name='telphone']").val();
	},
	//场地
	getPlace1 : function(){
		return $("input[name='place1']").val();
	},
	//球场地址
	getCourtAddr : function(){
		return $("input[name='courtAddr']").val();
	},
	//地铁
	getMetro : function(){
		return $("input[name='metro']").val();
	},
	//公交
	getTransit : function(){
		return $("input[name='transit']").val();
	},
	getQq : function(){
		return $("input[name='wchat']").val();
	},
	getWchat : function(){
		return $("input[name='qq']").val();
	},
	getOrgId : function(){
		return $("#orgId").val();
	},
	getCreateTime : function(){
		var year = $("input[name='create_year']").val();
		var mouth = $("input[name='create_month']").val();
		var createTime = new Date()
		createTime.setFullYear(year,mouth,1);
		return createTime;
	},
	getData:function(){
		var teamData={};
		teamData.orgId = BasicTeamSet.getOrgId();
		teamData.orgName = BasicTeamSet.getOrgName();
		teamData.formatId = BasicTeamSet.getFormatId();
		teamData.areaProv = BasicTeamSet.getAreaProv();
		teamData.areaCity = BasicTeamSet.getAreaCity();
		teamData.areaDist = BasicTeamSet.getAreaDist();
		teamData.groupType = BasicTeamSet.getGroupType();
		teamData.signature = BasicTeamSet.getSignature();
		teamData.intro = BasicTeamSet.getIntro();
		teamData.phone = BasicTeamSet.getPhone();
		teamData.createTime = BasicTeamSet.getCreateTime();
		teamData.place1 = BasicTeamSet.getPlace1();
		teamData.courtAddr = BasicTeamSet.getCourtAddr();
		teamData.metro = BasicTeamSet.getMetro();
		teamData.transit = BasicTeamSet.getTransit();
		teamData.wchat = BasicTeamSet.getWchat();
		teamData.qq = BasicTeamSet.getQq();
		return teamData;
	}
}
//球队信息编辑
var teamInfor={
	responseImg:'',
	judgeSubmit:true,
	judgeCommit:true,
	showMore : function(){
		$('.infor_morebtn').click(function(){
			$(this).addClass('hidden');
			$(this).parents('.infor_box').siblings('.team_moreinfor').removeClass('hidden');
		});
	},
	//	修改昵称
	editNickName:function(){
		$('.nickname_edit').click(function(){
			teamInfor.judgeSubmit=false;
			var oldText=$(this).siblings('.text_box').text();
			$(this).siblings('.text_box').empty().append('<input type="text" class="nickname_input" name="nickname_input" id="team_name" value="'+oldText+'" />');
			$(this).addClass('hidden');
			$(this).siblings('.nickname_btn').removeClass('hidden');
		});
		$('.nickname_submit').click(function(){
			var orgId = BasicTeamSet.getOrgId();
			var orgName = BasicTeamSet.getOrgName();
			var data = {"orgId":orgId,"orgName":orgName};
			var nickname_text=$(".nickname_input").val();
			var nickname_len=nickname_text.length;
			if(nickname_text!="" && nickname_len>=3 && nickname_len<=20){
				$.hhly.ajax({
					url:'/team/manage/info/save',
					data:data,
					success:function(dataMsg){
						dataMsg=JSON.parse(dataMsg);
						if(dataMsg.result == '0'){
							$('.star_intro p').text(nickname_text);
							$('.nickname_exit').click();
							sportCommon.login();//重新加载登录信息
						}else{
							layer.open({
								scrollbar: false,
								move: false,
								area:['440px'],
								title: '温馨提示',
								content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">'+dataMsg.msg+'</span></div>',
								btn: ['确定', '取消']
							});
						}
					}
				});
			}else{
				return false;
			}

		});
		$('.nickname_exit').click(function(){
			var text=$(this).siblings('.text_box').find('input').val();
			$(this).siblings('.text_box').empty().text(text);
			$(this).siblings('.nickname_edit').removeClass('hidden');
			$(this).parent().find('.nickname_btn').addClass('hidden');
			teamInfor.judgeSubmit=true;
		});
	},
	uploadImg:function(){
		var orgId = BasicTeamSet.getOrgId();
		// 初始化Web Uploader
		var uploader = WebUploader.create({
		    // 选完文件后，是否自动上传。
		    auto: true,
		    // swf文件路径
		    swf:'/resources/js/jquery/webuploader/Uploader.swf',
		    // 文件接收服务端。
		    server: '/team/manage/info/upload',
		    // 选择文件的按钮。可选。
		    pick: '#filePicker',
		    fileNumLimit:1,
		    // 只允许选择图片文件。
		    accept: {
		        title: 'Images',
		        extensions: 'gif,jpg,jpeg,bmp,png',
		        mimeTypes: 'image/jpg,image/jpeg,image/png'
		    }
		});
		uploader.on('fileQueued', function( file ) {
		    var $li = $(
		            '<div  class="file-item thumbnail head_box">' +
		                '<img>' +
		                '</div>'
		            ),
		        $img = $li.find('img');
		    // $list为容器jQuery实例
		    $(".head_box").empty();
		    $(".head_box").append( $li );
		    // 创建缩略图
		    uploader.makeThumb( file, function( error, src ) {
		        if ( error ) {
		            $img.replaceWith('<span>不能预览</span>');
		            return;
		        }
		        $img.attr('src', src );
		    } );
		});
		uploader.on( 'uploadSuccess', function( file,response) {
            teamInfor.responseImg=response;
			uploader.removeFile( file );
			uploader.reset();
        });
	},
	//表单验证
	formVaridate:function(){
		jQuery.validator.addMethod("telphone_num", function(value, element) {
			var length = value.length;
			var mobileNum =/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
			return this.optional(element) || (length == 11 && mobileNum.test(value));
			}, "请您输入正确格式的手机号码00000");
		var validator=$("#teamIforForm").validate({
			//errorClass: "label.error", //默认为错误的样式类为：error
			focusInvalid: true, //当为false时，验证无效时，没有焦点响应
			onfocusout: function(element) {
				$(element).valid();
			},
			onkeyup:function(element){
				//$("#manage_contents .account_area").trigger('blur');
			},
			submitHandler: function(form) { //表单提交句柄,为一回调函数，带一个参数：form
				if(!teamInfor.judgeCommit){
					return false;
				}
				teamInfor.judgeCommit=false;
				teamInfor.formSubmit(); //提交表单
			},
			rules: {
		    	nickname_input: {
		        required: true,
		        minlength: 3,
		        maxlength:20
		      },
		      people_rbt:{
			     required: true
		      },
		      province:{
				 required: true,
				 range:[0,100000000]
		      },
		      city:{
				required: true,
				range:[0,100000000]
		      },
		      area:{
				required: true,
				range:[0,100000000]
		      },
		      match_select:{
		    	  required: true
		      },
		      signature:{
		    	  required: true,
		    	  maxlength:25
		      },
		      infor_desc:{
		    	  required: true,
		    	  maxlength:100
		      },
		      telphone:{
		    	  required: true,
		    	  minlength:11,
		    	  maxlength:11,
		    	  telphone_num:true
		      },
		      create_year:{
		    	  required: true
		      },
		      create_month:{
		    	  required: true
		      },
		      place1:{
		    	  required: true
		      }
		    },
		    messages: {
		    	nickname_input: {
		        required: "请输入用户名",
		        minlength: "用户名必需由三个字母组成",
		        maxlength:"用户名不允许超过二十个字符"
		      },
		      people_rbt:{
		    	  required:"赛制为必选项"
		      },
		      province:{
		    	  required:"省份不能为空",
		    	  range:'省份不能为空'
		      },
		      city:{
		    	  required:"市区不能为空",
		    	  range:'市区不能为空'
		      },
		      area:{
		    	  required:"区域不能为空",
		    	  range:'区域不能为空'
		      },
		      match_select:{
		    	  required:"组织类别为必选项"
		      },
		      signature:{
		    	  required:"签名为必填选",
		    	  maxlength:"最多输入25个字符"
		      },
		      infor_desc:{
		    	  required:"简介为必填选",
		    	  maxlength:"最多输入100个字符"
		      },
		      telphone:{
		    	  required:"手机号为必填",
		    	  minlength:"请您输入正确格式的手机号码",
		    	  maxlength:"请您输入正确格式的手机号码",
		    	  telphone_num:"请您输入正确格式的手机号码"
		      },
		      create_year:{
		    	  required: "创建日期为必选项"
		      },
		      create_month:{
		    	  required: "创建日期为必选项"
		      },
		      place1:{
		    	  required: "常驻地点为必选项"
		      }
		    }

		});

	},
	//提交
	formSubmit:function(){
		var data = BasicTeamSet.getData();
		data.iconFileUrl=teamInfor.responseImg.iconFileUrl;
		var munuData={};
		munuData.province=$('.province_box>.selected').text();
		munuData.city=$('.city_box>.selected').text();
		munuData.area=$('.area_boxs .area_box>.selected').text();
		if(!stringUtil.isNull(teamInfor.responseImg.url)){	
			munuData.imgSrc=teamInfor.responseImg.url;
		}
		munuData.provinceId=data.areaProv;
		munuData.cityId=data.areaCity;
		munuData.areaId=data.areaDist;
		//读取数据ajax提交
		$.hhly.ajax({
			url:'/team/manage/info/save',
			data:data,
			success:function(dataMsg){
				if(teamInfor.judgeSubmit){
					dataMsg=JSON.parse(dataMsg);
					if(dataMsg.result && dataMsg.result == '0'){
						layer.open({
							scrollbar: false,
							move: false,
							area:['440px'],
							title: '温馨提示',
							content: '<div class="dialog_tip_box text"><span class="at_span success"></span><span class="dialog_tips">保存成功</span></div>',
						});
						teamInfor.alterData(munuData);
						sportCommon.login();//重新加载登录信息
					}else{
						layer.open({
							scrollbar: false,
							move: false,
							area:['440px'],
							title: '温馨提示',
							content: '<div class="dialog_tip_box text"><span class="at_span error"></span><span class="dialog_tips">' + dataMsg.msg + '</span></div>',
						});
					}
				}
				teamInfor.judgeCommit=true;
			},
			error:function(){
				teamInfor.judgeCommit=true;
			}
		});
	},
	//重置
	formReset:function(){
		$("#mit_reset_team").click(function(){
			var orgId = BasicTeamSet.getOrgId();
			$.hhly.ajax({
				url:'/team/manage/info',
				data:{'teamId':orgId},
				dataType:'html',
				success:function(data){
					$("#manage_contents").html(data);
				}	
			});
		});
	},
	// 修改左侧数据显示
	alterData:function(data){
		if(data.imgSrc){
			$('.star_intro .head_img img').get(0).src=data.imgSrc;
		}
		var span='<span id="team_position" pid="'+data.provinceId+'" cid="'+data.cityId+'" aid="'+data.areaId+'">'+data.province+data.city+data.area+'</span>';
		$('.star_intro .area').find('#team_position').remove();
		$('.star_intro .area').append(span);
	},
	init:function(){
		this.showMore();
		this.editNickName();
	    this.uploadImg();
		this.formVaridate();
		this.formReset();
		//	input初始化
	    $('div[name="match_select"],div[name="create_year"],div[name="create_month"],div[name="create_day"]').inputbox({height:28,width:110});
	    $.hhly.ajax({
	    	url:'/resources/json/area.json',
	    	type:'GET',
	    	success:function(data){
	    		$('.team_location_control').ganged({'data':data, 'width': 110, 'height': 28});
	    	}
	    });
	    $('div[name="people_rbt"]').inputbox();
	    $('.monolayer_top span,.monolayer_container_bottom input').click(function(){
		    $('.mit_maskhidden,.tip_container').hide();
		    $('body').css("overflow","auto")
		});
	    var y = $(".tip_container").height();
	    $(".tip_container").css("margin-top",-y/2);
	    $('input.account_area,textarea.account_area').trigger('keyup');
	}
}
$(function(){
	teamInfor.init();
});