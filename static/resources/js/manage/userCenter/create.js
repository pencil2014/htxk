require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
		'webuploader':'/resources/js/jquery/webuploader/webuploader.min.js?v=77f65ac437',
		'ganged':'/resources/js/jquery/jquery.ganged.js?v=6f8a2b7f9a',
		'validate':'/resources/js/jquery/jquery.validate.min.js?v=37393e7134',
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
		'webuploader':{
			deps:['jquery']
		},
		'ganged':{
			deps:['jquery','hhlyAction']
		},
		'validate':{
			deps:['jquery']
		},
		'personal':{
			deps:['jquery']
		}
    },
});
require(['jquery', 'hhlyAction', 'layer','webuploader','ganged','validate','common','i18n','personal'], function($, hhlyAction, layer,WebUploader) {
	var BasicTeamSet = {
		//组织名称
		getOrgName : function(){
			return $("input[name='nickname_input']").val();
		},
		//赛事类型
		getFormatId : function(){
			return $("input[name='people_rbt'][checked='checked']").val();
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
		getOrgId : function(){
			return $("#orgId").val();
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
			return teamData;
		}
	}
	//球队信息编辑
	var teamInfor={
		responseImg:'',
		judgeSubmit:true,
		uploadImg:function(){
			var orgId = BasicTeamSet.getOrgId();
			// 初始化Web Uploader
			var uploader = WebUploader.create({
			    // 选完文件后，是否自动上传。
			    auto: true,
			    // swf文件路径
			    swf:'/webuploader/Uploader.swf',
			    // 文件接收服务端。
			    server: '/team/manage/info/upload',
			    // 选择文件的按钮。可选。
			    pick: '#filePicker',
			    fileNumLimit:1,
			    // 只允许选择图片文件。
			    accept: {
		            title: 'Images',
		            extensions: 'gif,jpg,jpeg,bmp,png',
		            mimeTypes: 'image/jpg,image/png,image/jpeg,'
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
				onkeyup: false,
				submitHandler: function(form) { //表单提交句柄,为一回调函数，带一个参数：form
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
			      }
			    },
			    messages: {
			    	nickname_input: {
			        required: "请输入球队名",
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
			      }
			    }
			});
		},
		//提交
		formSubmit:function(){
			if(!teamInfor.judgeSubmit){
				return false;
			}
			teamInfor.judgeSubmit=false;
			var data = BasicTeamSet.getData();
			data.iconFileUrl=teamInfor.responseImg.iconFileUrl;
			var munuData={};
			munuData.province=$('#province>.selected').text();
			munuData.city=$('#city>.selected').text();
			munuData.area=$('.area_boxs .area_box>.selected').text();
			if(!stringUtil.isNull(teamInfor.responseImg.url)){	
				munuData.imgSrc=teamInfor.responseImg.url;
			}
			munuData.imgSrc=teamInfor.responseImg.url;
			munuData.provinceId=data.areaProv;
			munuData.cityId=data.areaCity;
			munuData.areaId=data.areaDist;
			//读取数据ajax提交	
			$.hhly.ajax({
				url: '/team/manage/create',
				data: data,
				success: function(dataMsg) {
					if (dataMsg.result && dataMsg.result == '0') {
						sportCommon.popMsg('success','保存成功');
						sportCommon.login();//重新加载登录信息
					} else {
						sportCommon.popMsg('error',dataMsg.msg);
					}
					teamInfor.judgeSubmit=true;
				},
				eCallback: function(obj) {
					sportCommon.popMsg('success','保存失败');
					teamInfor.judgeSubmit=true;
				}
			})
		},
		inputInit:function(){
			$.hhly.inputbox({
				wrap:'div[name="people_rbt"],[name="match_select"],[name="create_year"],[name="create_month"],div[name="create_day"]',
				width:100
			});
			// 省市县初始化
			$.getJSON('/resources/json/area.json', function(data) {
				$('.city_box .team_location_control').ganged({
					'data': data,
					'width': 110,
					'height': 28
				});
			});
		},
		init:function(){
			this.uploadImg();
			this.formVaridate();
			this.inputInit();
		}
	}
	teamInfor.init();
});
