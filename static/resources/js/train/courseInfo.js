
require.config({
  baseUrl: hhly_base_path,
  paths: {
    "jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
    "layer":"/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92",
    "template": "/resources/js/common/template.js?v=a19711611b",
    "app": "/resources/js/fightball/app.js?v=901ec15346",
    'i18n':'/resources/js/i18n/i18n_zh_CN',
    "bootstrap":'/resources/js/fightball/lib/bootstrap.min',
    "datetimepicker": "/resources/js/fightball/lib/bootstrap-datetimepicker",
    'validator':'/resources/js/jquery/jquery.validate.min.js?v=37393e7134',
    "datetimepickerZhCN": "/resources/js/fightball/lib/bootstrap-datetimepicker.zh-CN",
    "inputbox":"/resources/js/jquery/jquery.inputbox"
  },
  shim: {
    'bootstrap': {
      deps: ['jquery']
    },
    'app': {
      deps: ['jquery','layer']
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
    'inputbox':{
        deps: ['jquery']
    }
  }
});
require(['jquery' , 'template' , 'datetimepickerZhCN', 'datetimepicker', 'inputbox','app','layer','validator','i18n'],
  function ($, template, datetimepickerZhCN, datetimepicker,inputbox,app,layer,validator) {

    var fightBall={
      //初始化
      init:function() {
        fightBall.initDatePick();


      },
      //日期选择
      // datePickChange:function() {
      //   $('#datetimepicker').datetimepicker().on('changeDate', function(ev){
      //     fightBall.date=$(this).val();
      //     $(this).attr('value',$(this).val())
      //     var today=new Date();
      //     var timeArr=[]
      //     function numFormat(num) {
      //       var _num=num;
      //       if(_num<10){
      //         _num='0'+_num
      //       }
      //       return _num;
      //     }
      //     var todayH=today.getHours();
      //     var todayM=today.getMinutes();
      //     if($(this).val()==today.format('yyyy-MM-dd')){//今天
      //       for(var i=todayH+3;i<24;i++){
      //         if(i!=todayH+3){
      //           timeArr.push(numFormat(i)+':00');
      //         }
      //         if(todayM<30 || i>todayH+3){
      //           timeArr.push(numFormat(i)+':30');
      //         }
      //       }
      //     }else{//未来
      //       if(todayH>21 && (new Date($(this).val())-new Date(today.format('yyyy-MM-dd')))==86400000){//明天
      //         console.log()
      //         for(var i=todayH-21;i<24;i++){
      //           if(i!=todayH-21){
      //             timeArr.push(numFormat(i)+':00');
      //           }
      //           if(todayM<30 || i>todayH-21){
      //             timeArr.push(numFormat(i)+':30');
      //           }
      //         }
      //       }else {
      //         for(var i=0;i<24;i++){
      //           timeArr.push(numFormat(i)+':00');
      //           timeArr.push(numFormat(i)+':30');
      //         }
      //       }

      //     }
      //     // $('.beginTime').find('.opts').html(template('beginTime',{data:timeArr})).siblings('.selected').html('开始时间').siblings('input[name="beginTime"]').attr('data-value','');
      //     // $('.endTime').find('.opts').html(template('endTime',{data:timeArr})).siblings('.selected').html('结束时间');



      //   });
      // },
      // 实例化日期选择控件
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
            weekStart: 1, todayBtn: 1, autoclose: 1, todayHighlight: 1,language: 'zh-CN',
            startView: 2, minView: 2, forceParse: 0, startDate: today, format: 'yyyy-mm-dd'

          });

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
    	$('div[name="sex"]').inputbox();
	     fightBall.init();
    });

  });
