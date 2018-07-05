define(['jquery','template','layer'], function($, template,layer) {
  var App = {
    // Ajax服务地址
    baseUrl: '',//默认
    //是否显示头部导航
    //showNav:true,
    // 计时器id
    intervalId: 0,
    //layer  模态框
    layer: layer,
    init: function() {

      /**
       *
       对Date的扩展，将 Date 转化为指定格式的String
       月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
       年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
       例子：
       (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2015-07-02 08:09:04.423
       (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2015-7-2 8:9:4.18
       * @param fmt
       * @returns {*}
       * @constructor
       */
      Date.prototype.format = function(fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) :
              (("00" + o[k]).substr(("" + o[k]).length)));
          }
        return fmt;
      };

      // Ajax公共配置
      $.ajaxSetup({
        timeout: 30000,
        error: function(jqXHR, exception) {
          var msg = '';
          //App.unblockUI();
          if (jqXHR.status == 0) {
            msg = '没有连接，请检查网络';
          } else if (jqXHR.status == 404) {
            msg = '请求页面未找到';
          } else if (jqXHR.status == 500) {
            msg = '服务器错误';
          } else if (exception == 'parsererror') {
            msg = '请求JSON解析错误';
          } else if (exception == 'timeout') {
            msg = '请求超时';
          } else if (exception == 'abort') {
            msg = 'Ajax请求取消';
          } else {
            msg = '未知错误' + '<br/>' + jqXHR.responseText;
          }
          console.log(msg);
        }
      });
      //ajax 请求成功后处理
      $("document").ajaxSuccess(function(evt, jqXHR, settings) {

        console.log(jqXHR, 9999)

      });
    },
    getId:function (test,data,id){
      var html = template(test, data);
      $(id).html(html);
      //document.getElementById(id).innerHTML = html;
    },
    getUrl: function (par) {
      //获取URL的参数值
      //获取当前URL
      var local_url = document.location.href;
      //获取要取得的get参数位置
      var get = local_url.indexOf(par +"=");
      if(get == -1){
        return undefined;
      }
      //截取字符串
      var get_par = local_url.slice(par.length + get + 1);
      //判断截取后的字符串是否还有其他get参数
      var nextPar = get_par.indexOf("&");
      if(nextPar != -1){
        get_par = get_par.slice(0, nextPar);
      }

      return get_par;
    },
    _underscore:{
      /**
       * 读取url参数
       * @param key
       * @returns {String}
       */
      getQueryString: function(key) {
        var re = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var index = location.href.indexOf('?');
        var s = location.search || location.href.substr(index);
        var arr = s.substr(1).match(re);
        if (arr) {
          return decodeURIComponent(arr[2]);
        }
        return '';
      }
    }

  }


  /**
   * 相关处理
   */
  $(function() {
    App.init();
  });


  return App;
});