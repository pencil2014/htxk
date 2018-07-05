require.config({
  baseUrl: hhly_base_path,
  paths: {
    "jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
    "hhly": "/resources/js/jquery/hhlyAction.js?v=e060756375",
    "layer":"/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92",
    "template": "/resources/js/common/template.js?v=a19711611b",
    'common':'/resources/js/common/common.js?v=f486ed9e43',
    'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
    'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
    "Gaodemap": "/resources/js/fightball/gaodeMap.js?v=3081bc75a2",
    "ionRangeSlider": "/resources/js/fightball/ion.rangeSlider.js?v=f0558ba006",
    "datetimepicker": "/resources/js/fightball/lib/bootstrap-datetimepicker.js?v=fc79319ce6",
    "app": "/resources/js/fightball/app.js?v=901ec15346",
    'validator':'/resources/js/jquery/jquery.validate.min.js?v=37393e7134',
    "bootstrap":'/resources/js/fightball/lib/bootstrap.min.js?v=04c84852e9',
    "datetimepickerZhCN": "/resources/js/fightball/lib/bootstrap-datetimepicker.zh-CN.js?v=6f68761049",
  },
  shim: {
    'bootstrap': {
      deps: ['jquery']
    },
    'Gaodemap': {
      deps: ['jquery']
    },
    'app': {
      deps: ['jquery','layer']
    },
    'hhly': {
      deps: ['jquery']
    },
    "layer":{
      deps:['jquery']
    },
    'validator':{
      deps:['jquery']
    },
    "datetimepickerZhCN":{
      deps:['jquery','bootstrap','datetimepicker']
    },
    'common':{
        deps: ['jquery','commonUtil','hhly']
    }
  }
});
require(['jquery', 'Gaodemap', 'template', 'ionRangeSlider', 'datetimepickerZhCN', 'datetimepicker', 'app','hhly','layer','validator',,'common','i18n'],
  function ($, Gaodemap, template, ionRangeSlider, datetimepickerZhCN, datetimepicker, app,hhly,layer,validator) {

    var fightBall={
      data:{},//存放city/fight/create 数据
      date:'',//存放日期数据,
      fightId:'',
      Gaodemap:{},
      //获取数据
      getInfo:function(callback) {
        $.get(app.baseUrl+'/city/fight/create?fightId='+fightBall.fightId,function(data) {
          if(data.result==='0'){
            fightBall.data=data.data;
            callback();
          }

        })
      },
      //初始化
      init:function() {
        //获取 fightId
        this.fightId=app._underscore.getQueryString('fightId');
        fightBall.initDatePick();
        //拼球日期选择  开始时间 与结束时间 初始化
        $.hhly.inputbox({
          wrap:'.select_test',
          width:'180',
          height:'32'
        });

        
        //备注字数统计初始化
        $.hhly.textAccount({
          wrap:'.input_account',
          input:'textarea',
          max:100
        });
        $.hhly.inputbox({
          wrap:'div[name="argreement"]',
        });
        this.datePickChange();
        $('.layer-argreement').click(function() {
          layer.open({
            scrollbar: false,
            move: false,
            area:['800px','660px'],
            type: 2,
            content: ['/resources/html/agreement/publish.html']
          })
        })

      },
      //日期选择
      datePickChange:function() {
        $('#datetimepicker').datetimepicker().on('changeDate', function(ev){
          fightBall.date=$(this).val();
          $(this).attr('value',$(this).val())
          var today=new Date();
          var timeArr=[]
          function numFormat(num) {
            var _num=num;
            if(_num<10){
              _num='0'+_num
            }
            return _num;
          }
          var todayH=today.getHours();
          var todayM=today.getMinutes();
          if($(this).val()==today.format('yyyy-MM-dd')){//今天
            for(var i=todayH+3;i<24;i++){
              if(i!=todayH+3){
                timeArr.push(numFormat(i)+':00');
              }
              if(todayM<30 || i>todayH+3){
                timeArr.push(numFormat(i)+':30');
              }
            }
          }else{//未来
            if(todayH>21 && (new Date($(this).val())-new Date(today.format('yyyy-MM-dd')))==86400000){//明天
              console.log()
              for(var i=todayH-21;i<24;i++){
                if(i!=todayH-21){
                  timeArr.push(numFormat(i)+':00');
                }
                if(todayM<30 || i>todayH-21){
                  timeArr.push(numFormat(i)+':30');
                }
              }
            }else {
              for(var i=0;i<24;i++){
                timeArr.push(numFormat(i)+':00');
                timeArr.push(numFormat(i)+':30');
              }
            }

          }
          $('.beginTime').find('.opts').html(template('beginTime',{data:timeArr})).siblings('.selected').html('开始时间').siblings('input[name="beginTime"]').attr('data-value','');
          $('.endTime').find('.opts').html(template('endTime',{data:timeArr})).siblings('.selected').html('结束时间');



        });
      },
      //实例化日期选择控件
      initDatePick:function() {
        var date;
        var today;
        if(new Date().getHours()>21){
          date=new Date(new Date().getTime()+24*3600*1000)
        }else {
          date=new Date();
        }
        today= date.format("yyyy-MM-dd");
        $('.datetimepicker-box').attr('data-date',today)
          //实例化日期选择插件
          $('#datetimepicker').datetimepicker({
            language: 'zh-CN', weekStart: 1, todayBtn: 1, autoclose: 1, todayHighlight: 1,
            startView: 2, minView: 2, forceParse: 0, startDate: today, format: 'yyyy-mm-dd'

          });

      },
      // 实例化滑动条
      initRange:function(min,max) {
        var $range = $("#range");
        $range.ionRangeSlider({
          hide_min_max: true, keyboard: true, min: 1, max: 99, from: min?min:5,
          to: max?max:11, type: 'double', step: 1, prefix: "", postfix: "人"
        });

        // 获取每次拖动的范围值
        $range.on("change", function () {
          value = $(this).prop("value").split(";");
        });
      },
      //数据渲染
      render:function() {

        var minNum=fightBall.data.fightBall?fightBall.data.fightBall.minNumber:0;
        var maxNum=fightBall.data.fightBall?fightBall.data.fightBall.maxNumber:0;
        if(fightBall.fightId){
          _Gaodemap=new Gaodemap.gaoMap($('#addressSearch'),[fightBall.data.fightBall.longitude,fightBall.data.fightBall.latitude]);
          $('#remarks').val(fightBall.data.fightBall.remarks);
        }else{
          _Gaodemap=new Gaodemap.gaoMap($('#addressSearch'));
        }
        fightBall.Gaodemap=_Gaodemap;
        fightBall.initRange(minNum,maxNum);
        //运动类型选择
        $('#fight-ball-selectType').html(template('fight-ball-selectType-template',{
          data:fightBall.data.sportTypeList,
          fightBall:fightBall.data.fightBall}));
        this.sportsMore();
        //拼球费用
        $('#fight-ball-space').html(template('fight-ball-space-template',{
          data:fightBall.data.payMethodList,
          fightBall:fightBall.data.fightBall
        }));
        //拼球赛制选择
        $('#fight-ball-format').html(template('fight-ball-format-template',{
          data:fightBall.data.formatList,
          fightBall:fightBall.data.fightBall}));
        //拼球上场时间选择
        $('#fight-ball-time').html(template('fight-ball-time-template',{
          data:fightBall.data.playTimeList,
          fightBall:fightBall.data.fightBall}));
        //拼球加入方式-
        $('#fight-ball-jointype').html(template('fight-ball-jointype-template',{
          data:fightBall.data.joinTypeList,
          fightBall:fightBall.data.fightBall}));
        //拼球截止时间
        $('#fight-ball-endtime').html(template('fight-ball-endtime-template',{
          data:fightBall.data.endTimeList,
          fightBall:fightBall.data.fightBall}));
      },
      //sports get more
      sportsMore:function() {
        var flag=true;
        $('.sport_type_more').click(function(){
          if(flag){
            $(this).find('i').css({
              "background-image":'url(hhly_base_path+"/images/icon/icon_arr_top.jpg")'
            });
            $(this).find('.txt').html('收起');
            $(this).parent().animate({"height":'auto'})
            flag=false;

          }else{
            $(this).find('i').css({
              "background-image":'url(hhly_base_path+"/images/icon/icon_arr_top.jpg")'
            });
            $(this).find('.txt').html('更多');
            $(this).parent().animate({"height":60})
            flag=true;
          }
        })
      },

      //表单验证
      validator:function() {
        //手机号码验证
        $.validator.addMethod("phone", function(value, element) {
          var length = value.length;
          var mobile = /^1[3|7|5|8][0-9]\d{8}$/;
          return this.optional(element) || (length == 11 && mobile.test(value));
        }, "请输入11位数字手机号！");

        //日期选择验证
        $.validator.addMethod("date", function(value, element) {
          return value !='选择日期'
        }, "请选择活动日期");
        //结束时间验证
        $.validator.addMethod("validTime", function(value, element) {
          var beginTime=$('input[name=beginTime]').val().split(':');
          var endTime=value.split(':');
          return (parseInt(endTime[0])*60+parseInt(endTime[1]))>(parseInt(beginTime[0])*60+parseInt(beginTime[1]))
        }, "开始时间必需小于结束时间");
        //截止报名时间验证
        $.validator.addMethod("signEnd", function(value, element) {
          value=$('div[name="signEnd"].rb_active').attr('val');
          var today=new Date().getTime()+value*60*60*1000;
          var startDay=new Date((fightBall.date+' '+$('input[name=beginTime]').val()).replace(/-/g,"/")).getTime();
          return startDay>today
        }, "开始时间小于4小时，只能提前2小时截止！");
        //同意协议验证
        $.validator.addMethod("argreement", function(value, element) {
          // $('div[name="argreement"]').hasClass('cb_active')
          return $('div[name="argreement"]').hasClass('cb_active')
        }, "请查看协议");

        $("#fight_ball").validate({
          ignore: "",
          onfocusout:false,
          onkeyup:false,
          focusInvalid:false,
          rules: {
            date:{
              required:false,
              date:true
            },
            beginTime:'required',
            endTime:{
              required:true,
              validTime:true

            },
            phone: {
              required: true,
              phone:true
            },
            signEnd:{
              signEnd:true
            },
            place:'required',
            argreement:{
              argreement:true
            }
          },
          messages: {
            phone: {
              required: "请填写电话号码",
            },
            beginTime:'请选择开始时间!',
            endTime:{
              required:'请选择结束时间!'
            },
            place:"请选择活动场地！"
          },
          submitHandler: function(form) {
            fightBall.submit(form);

          }
        })
      },
      //表单提交
      submit:function(form) {
        var obj={}
        $.each($(form).serializeArray(),function(index,item) {
          var name=item.name;
          obj[name]=item.value;
        })
        obj.sportType=$('div[name="sportType"].rb_active').attr('val');
        obj.payMethod=$('div[name="payMethod"].rb_active').attr('val');
        obj.formatId=$('div[name="formatId"].rb_active').attr('val');
        obj.playTime=$('div[name="playTime"].rb_active').attr('val');
        obj.joinWay=$('div[name="joinWay"].rb_active').attr('val');
        obj.signEnd=$('div[name="signEnd"].rb_active').attr('val');
        console.log(obj)
        obj.minNumber=obj.minmax.split(';')[0];
        obj.maxNumber=obj.minmax.split(';')[1];
        delete obj.minmax;
        delete obj.argreement;
        obj.adCode=fightBall.Gaodemap.adcode
        obj.longitude=fightBall.Gaodemap.lnglatXY[0]
        obj.latitude=fightBall.Gaodemap.lnglatXY[1]
        console.log(obj,333)
        $.post(app.baseUrl+'/city/fight/save',obj,function(_data) {
          var data=JSON.parse(_data);
          app.layer.open({
            scrollbar: false,
            move: false,
            title: '温馨提示',
            btn: [data.result=='0'?'确定':'重新提交'],
            area:['440px'],
            content: data.result=='0'?'<span class="lay_tips success"></span><span class="dialog_tips">成功发起拼球！</span>':'<span class="lay_tips error"></span><span class="dialog_tips">'+data.msg  +'</span>',
            yes:function(layero,index){
              if(data.result=='0'){
                window.location='/city/common/index'
              }
              app.layer.close(layero)
            },
            success:function(){

            }
          });
        })


      }

    };
    $(function () {
      fightBall.init();
      fightBall.getInfo(function() {
        fightBall.render();
        $.hhly.inputbox({
          wrap:'.radio_box.sport_type_radio',
        });
      });

      // fightBall.submit();
      fightBall.validator();
    });

  });
