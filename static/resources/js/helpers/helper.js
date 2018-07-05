require.config({
  paths: {
    "jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
    "hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
    'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
    'common':'/resources/js/common/common.js?v=f486ed9e43',
    'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
    'rightFloat':'/resources/js/common/footer_rightFloat.js?v=a2fe4f17b3',
    'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15'
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
    'rightFloat':{
      deps: ['jquery']
    }
    },
});
require(['jquery', 'hhlyAction', 'layer','common','i18n','rightFloat'], function($, hhlyAction, layer) {
var helperObj={
  typeId:1,
  menuData:{},
  //初始化数据
  init:function(){
    template.config("escape", false);
    $.get('/resources/json/helpers.json',{},function(_data){
      helperObj.menuData=_data;
      var menuList=template('menu-list-template',helperObj.menuData);
      $('#menu-list-box').html(menuList);
      helperObj.getInfoList();
    })
  },
  //menu选项切换
  menuTab:function(){
    $('#menu-list-box').delegate('li','click',function(){
      $(this).addClass('active').siblings().removeClass('active');
      helperObj.typeId=$(this).attr('qa-id')
      helperObj.getInfoList();
    })
  },
  //arrow 切换
  arrowTab:function(){
    $('#info-list-box').delegate('.qa-list li','click',function(){
      if($(this).find(".icon-arrow").hasClass('arrow-bottom')){
        $(this).find(".icon-arrow").removeClass('arrow-bottom').addClass('arrow-top');
        $(this).find(".icon-arrow").siblings('.question-a').stop();
        $(this).find(".icon-arrow").siblings('.question-a').show(400);
      }else{
        $(this).find(".icon-arrow").removeClass('arrow-top').addClass('arrow-bottom');
        $(this).find(".icon-arrow").siblings('.question-a').stop();
        $(this).find(".icon-arrow").siblings('.question-a').hide(400);
      }
    })

  },
  //获取数据
  getInfoList:function(){
    var infoList=template('info-list-template',helperObj.menuData.data[helperObj.typeId-1]);
    $('#info-list-box').html(infoList)
  }

}

  helperObj.init();
  helperObj.menuTab();
  helperObj.arrowTab();


})