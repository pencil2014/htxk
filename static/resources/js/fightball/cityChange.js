/**
 * Created by dell on 2017/3/27.
 */
require.config({
  baseUrl: hhly_base_path,
  paths: {
    "jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
    "hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
    "layer":"/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92",
    "template": "/resources/js/common/template.js?v=a19711611b",
    'common':'/resources/js/common/common.js?v=f486ed9e43',
    'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
    'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
    "suggestQuery": "/resources/js/fightball/jq.suggestQuery.js?v=1129e03fdd",
    "bootstrap":'/resources/js/fightball/bootstrap.min.js?v=04c84852e9',
    "nav": "/resources/js/fightball/manage/nav.js?v=088f341198",
    "app": "/resources/js/fightball/app.js?v=901ec15346",
  },
  shim:{
    'suggestQuery':{
      deps:['jquery']
    },
    "bootstrap":{
      deps:['jquery']
    },
    layer:{
      deps:['jquery']
    },
    "hhlyAction": {
        deps: ['jquery','layer']
    },
    'template': {
        deps: ['jquery']
    },
    'common':{
        deps: ['jquery','commonUtil','hhlyAction']
    }
  }
});
require(['jquery','template','bootstrap','app','suggestQuery','nav','common','i18n'],function($,template,bootstrap,app,suggestQuery,nav){
  var cityChange={
    cityId:'',
    //获取区域数据
    getAreaData:function(){
      cityChange.cityId=app._underscore.getQueryString('cityId')
      $.get(app.baseUrl+"/city/common/district",{},function(data){
        $('#area-box').html(template('area-box-template',data));
        cityChange.toggleGetMore();
      })
    },
    //获取城市数据
    getCityData:function(){
      $.get('/resources/json/city.json',{},function(data){
        var hotCity=data.hotCity;
        var city=data.cityData;
        $('#hot-city-box').html(template('hot-city-box-template',hotCity));
        $('#city-list-box').html(template('city-list-box-template',data));
      })
    },
    //获取更多切换
    toggleGetMore:function(){
      var flag=1;
      $('.get-more').click(function(){
        if(flag){

          $(this).parent().css({height:'auto'});
          $(this).find('.more-txt').html('收起');
          flag=0;
        }else{
          $(this).parent().css({height:40});
          $(this).find('.more-txt').html('更多');
          flag=1;
        }
      })
    },
    //搜索跳转
    searchAction:function(){
      var areaJson=[];
      $(".button-search").click(function(){
        if(areaJson.length==0){
          $.get('/resources/json/cityAndArea.json',{},function(data){
            areaJson=data.concat();
            filter();
          })
        }else{
          filter();
        }
        function filter(){
          var flag=0;
          var cityId;
          for(var i=0;i<areaJson.length;i++){
            if($('.city-key').val()==areaJson[i].name){
              flag=1;
              cityId=areaJson[i].cityid
              break;
            }
          }
          if(flag){
            var type=app._underscore.getQueryString('type')
            window.location='/city/common/index?type='+type+'&cityId='+cityId;
          }else {
            if($('.city-list').find('li').length==0){
              $('.city-list').append('<li>抱歉，未找到相关地点，请修改后重试</li>');
            }
            $('.city-list').css('display','block');
            $('#search-city input').focus();
          }
        }

      })
      $('.city-key').keyup(function(e){
        if(e.which==13){
          $(".button-search").trigger('click')
        }
      })
    },
    redirect:function(){
      $('body').delegate('a.redirect','click',function() {
        var type=app._underscore.getQueryString('type')
        if($(this).hasClass('hot')){
          window.location='/city/common/index?type='+type+'&cityId='+cityChange.cityId+"&areaId="+$(this).attr('areaid');
        }else{
          window.location='/city/common/index?type='+type+'&cityId='+$(this).attr('areaid');
        }
      })
    }
  }

  $(function(){
    cityChange.getAreaData();
    cityChange.getCityData();

    $('#search-city').suggestQuery('/resources/json/cityAndArea.json',function() {
      $(".button-search").trigger('click')
    });

    cityChange.searchAction();
    cityChange.redirect();
  })
})