

define(['jquery'], function ($) {
  function Gaodemap(inputNode,ltyArr,mapcont) {
    this.inputNode = $(inputNode);
    this.map = null;
    this.ltyArr = ltyArr;
    this.markers = [];
    this.lnglatXY = []; // 已知点坐标
    this.adcode = null; // 区域编号
    this.mapcont = mapcont;
    this.init();
  };

  // 地图初始化
  Gaodemap.prototype.init = function () {
    this.createMap();
    this.addTollbar();
    if(!!!this.ltyArr){
      this.getInitlocation();
    }else{
      this.lnglatXY = this.ltyArr;
      this.getCoordinate();
    }
    if(!!!this.mapcont){    // 不需要定位
      this.autoComplate();
    }

    if (typeof navigator.geolocation != "object") {   // 检测IE8浏览器
      this.showCityInfo();
    }
  };

  //创建高德地图对象
  Gaodemap.prototype.createMap = function () {
    var that = this,
    //初始化地图对象，加载地图]
      mapContentStr = this.mapcont ? 'mapcont' : 'mapContent';
    this.map = new AMap.Map(mapContentStr, {
      resizeEnable: true,
      zoom: 5
    });
    this.map.on('click', function (e) {
      that.map.remove(that.markers);                                            // 移除所有的定位图标
      that.lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];               // 获取当前经纬度
      that.getCoordinate();
    });

  };

  //获取用户所在城市信息
  Gaodemap.prototype.showCityInfo = function () {
    //加载IP定位插件
    var that = this;
    this.map.plugin(["AMap.CitySearch"], function () {
      //实例化城市查询类
      var citysearch = new AMap.CitySearch();

      define(['jquery'], function ($) {
        function Gaodemap(inputNode,ltyArr,mapcont) {
          this.inputNode = $(inputNode);
          this.map = null;
          this.ltyArr = ltyArr;
          this.markers = [];
          this.lnglatXY = []; // 已知点坐标
          this.adcode = null; // 区域编号
          this.mapcont = mapcont;
          this.init();
        };

        // 地图初始化
        Gaodemap.prototype.init = function () {
          this.createMap();
          this.addTollbar();
          if(!!!this.ltyArr){
            this.getInitlocation();
            this.inputNode.val('')
          }else{
            this.lnglatXY = this.ltyArr;
            this.getCoordinate();
          }
          if(!!!this.mapcont){    // 不需要定位
            this.autoComplate();
          }

          if (typeof navigator.geolocation != "object") {   // 检测IE8浏览器
            this.showCityInfo();
          }
        };

        //创建高德地图对象
        Gaodemap.prototype.createMap = function () {
          var that = this,
            //初始化地图对象，加载地图]
            mapContentStr = this.mapcont ? 'mapcont' : 'mapContent';
          this.map = new AMap.Map(mapContentStr, {
            resizeEnable: true,
            zoom: 5
          });
          this.map.on('click', function (e) {
            that.map.remove(that.markers);                                            // 移除所有的定位图标
            that.lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];               // 获取当前经纬度
            that.getCoordinate();
          });

        };

        //获取用户所在城市信息
        Gaodemap.prototype.showCityInfo = function () {
          //加载IP定位插件
          var that = this;
          this.map.plugin(["AMap.CitySearch"], function () {
            //实例化城市查询类
            var citysearch = new AMap.CitySearch();
            //自动获取用户IP，返回当前城市
            citysearch.getLocalCity();
            AMap.event.addListener(citysearch, "complete", function (result) {
              if (result && result.city && result.bounds) {
                var cityinfo = result.city;
                var citybounds = result.bounds;
                that.inputNode.val(cityinfo);  // IE8初始化显示当前城市
                console.log(5555)
                //地图显示当前城市
                that.map.setBounds(citybounds);
              } else {
                console.log("您当前所在城市：" + result.info + "");
              }
            });
            AMap.event.addListener(citysearch, "error", function (result) {
              console.log(result.info);
            });
          });
        };

        // 加载工具条插件
        Gaodemap.prototype.addTollbar = function () {
          var that = this;
          this.map.plugin(["AMap.ToolBar"], function () {
            that.map.addControl(new AMap.ToolBar());
          });
          if (location.href.indexOf('&guide=1') !== -1) {
            this.map.setStatus({scrollWheel: false})
          }
        };

        //获取初始化位置
        Gaodemap.prototype.getInitlocation = function () {
          var that = this;
          this.map.plugin('AMap.Geolocation', function () {
            geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,//是否使用高精度定位，默认:true
              timeout: 10000,          //超过10秒后停止定位，默认：无穷大
              buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
              buttonPosition: 'RB'
            });
            that.map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', that.onComplete.bind(that));//返回定位信息,bind()方法，阻止this的隐式丢失
            AMap.event.addListener(geolocation, 'error', that.onError);      //返回定位出错信息
          })
        };

        // 地址提示输入
        Gaodemap.prototype.autoComplate = function () {
          var that = this;
          this.map.plugin('AMap.Autocomplete', function () {//回调函数
            var autoOptions = {         //实例化Autocomplete
              city: "",               //城市，默认全国
              input: "addressSearch"        //使用联想输入的input的id
            };
            var autocomplete = new AMap.Autocomplete(autoOptions);
            AMap.service(["AMap.PlaceSearch"], function () {
              var placeSearch = new AMap.PlaceSearch({
                map: that.map
              });
              //构造地点查询类
              AMap.event.addListener(autocomplete, "select", select);//注册监听，当选中某条记录时会触发
              function select(e) {
                console.log(e);
                that.lnglatXY = [e.poi.location.lng,e.poi.location.lat];
                placeSearch.setCity(e.poi.adcode);
                placeSearch.search(e.poi.name);  //关键字查询查询
                that.adcode = e.poi.adcode;
                $('.amap-layers').on('click', '.selected', function (e) {
                  that.map.remove(that.markers);          // 移除自定义选择图标
                  setTimeout(function () {                  // 异步处理等待dom生成再获取DOM节点
                    //var addressDetail = $('.amap-pl-pc .amap-lib-infowindow-content-wrap').children('div').text(); // 获取地址详情
                    var addressName = $('.amap-pl-pc .poi-name').text();                                           // 获取地址名
                    if (typeof navigator.geolocation == "object") {   // 检测IE8浏览器
                      that.inputNode.val(addressName);
                    }
                  }, 100);
                });
              };
            });
          });
        };
        // 你地理编码进行定位
        Gaodemap.prototype.regeocoder = function(){

        };

        //初始化定位成功调用函数
        Gaodemap.prototype.onComplete = function (data) {
          this.lnglatXY = [data.position.getLng(), data.position.getLat()];
          this.adcode = data.addressComponent.adcode;
          this.getCoordinate();
        };

        Gaodemap.prototype.onError = function (data) {

        };

        // 获取位置经纬度
        Gaodemap.prototype.getCoordinate = function () {
          var that = this;
          // console.log(this.lnglatXY);
          this.map.plugin(["AMap.Geocoder"], function () {
            var geocoder = new AMap.Geocoder({                              // 实例化逆向编码对象
              radius: 1000,
              extensions: "all"
            });
            geocoder.getAddress(that.lnglatXY, function (status, result) {        // 获取逆向编码状态
              if (status === 'complete' && result.info === 'OK') {
                console.log(result,88888)
                that.geocoder_CallBack(result);
              }
            });
          });
          // console.log(that.lnglatXY);
          marker = new AMap.Marker({                                           // 在当前经纬度添加定位图标
            'map': that.map,
            'position': that.lnglatXY
          });
          this.markers.push(marker);
          this.map.setFitView();
        };

        Gaodemap.prototype.geocoder_CallBack = function (data) {
          var that = this,
            address = data.regeocode.formattedAddress;         //返回地址描述
          // console.log(address);
          this.inputNode.val(address);
          console.log(22222222)

        };
        // $(function (window) {
        //实例化高德地图对象
        // var gaoMap = new Gaodemap($('#addressSearch'));
        // // window.gaodeMap = gaoMap;
        // console.log(gaoMap)
        return {gaoMap:Gaodemap}
        // });

      });

      //自动获取用户IP，返回当前城市
      citysearch.getLocalCity();
      AMap.event.addListener(citysearch, "complete", function (result) {
        if (result && result.city && result.bounds) {
          var cityinfo = result.city;
          var citybounds = result.bounds;
          that.inputNode.val(cityinfo);  // IE8初始化显示当前城市
          console.log(5555)
          //地图显示当前城市
          that.map.setBounds(citybounds);
        } else {
          console.log("您当前所在城市：" + result.info + "");
        }
      });
      AMap.event.addListener(citysearch, "error", function (result) {
        console.log(result.info);
      });
    });
  };

  // 加载工具条插件
  Gaodemap.prototype.addTollbar = function () {
    var that = this;
    this.map.plugin(["AMap.ToolBar"], function () {
      that.map.addControl(new AMap.ToolBar());
    });
    if (location.href.indexOf('&guide=1') !== -1) {
      this.map.setStatus({scrollWheel: false})
    }
  };

  //获取初始化位置
  Gaodemap.prototype.getInitlocation = function () {
    var that = this;
    this.map.plugin('AMap.Geolocation', function () {
      geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        buttonPosition: 'RB'
      });
      that.map.addControl(geolocation);
      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, 'complete', that.onComplete.bind(that));//返回定位信息,bind()方法，阻止this的隐式丢失
      AMap.event.addListener(geolocation, 'error', that.onError);      //返回定位出错信息
    })
  };

  // 地址提示输入
  Gaodemap.prototype.autoComplate = function () {
    var that = this;
    this.map.plugin('AMap.Autocomplete', function () {//回调函数
      var autoOptions = {         //实例化Autocomplete
        city: "",               //城市，默认全国
        input: "addressSearch"        //使用联想输入的input的id
      };
      var autocomplete = new AMap.Autocomplete(autoOptions);
      AMap.service(["AMap.PlaceSearch"], function () {
        var placeSearch = new AMap.PlaceSearch({
          map: that.map
        });
        //构造地点查询类
        AMap.event.addListener(autocomplete, "select", select);//注册监听，当选中某条记录时会触发
        function select(e) {
          console.log(e);
          that.lnglatXY = [e.poi.location.lng,e.poi.location.lat];
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name);  //关键字查询查询
          that.adcode = e.poi.adcode;
          $('.amap-layers').on('click', '.selected', function (e) {
            that.map.remove(that.markers);          // 移除自定义选择图标
            setTimeout(function () {                  // 异步处理等待dom生成再获取DOM节点
              //var addressDetail = $('.amap-pl-pc .amap-lib-infowindow-content-wrap').children('div').text(); // 获取地址详情
              var addressName = $('.amap-pl-pc .poi-name').text();                                           // 获取地址名
              if (typeof navigator.geolocation == "object") {   // 检测IE8浏览器
                that.inputNode.val(addressName);
              }
            }, 100);
          });
        };
      });
    });
  };
  // 你地理编码进行定位
  Gaodemap.prototype.regeocoder = function(){

  };

  //初始化定位成功调用函数
  Gaodemap.prototype.onComplete = function (data) {
    this.lnglatXY = [data.position.getLng(), data.position.getLat()];
    this.adcode = data.addressComponent.adcode;
    this.getCoordinate();
  };

  Gaodemap.prototype.onError = function (data) {

  };

  // 获取位置经纬度
  Gaodemap.prototype.getCoordinate = function () {
    var that = this;
    // console.log(this.lnglatXY);
    this.map.plugin(["AMap.Geocoder"], function () {
      var geocoder = new AMap.Geocoder({                              // 实例化逆向编码对象
        radius: 1000,
        extensions: "all"
      });
      geocoder.getAddress(that.lnglatXY, function (status, result) {        // 获取逆向编码状态
        if (status === 'complete' && result.info === 'OK') {
          that.geocoder_CallBack(result);
        }
      });
    });
    marker = new AMap.Marker({                                           // 在当前经纬度添加定位图标
      'map': that.map,
      'position': that.lnglatXY
    });
    this.markers.push(marker);
    this.map.setFitView();
  };

  Gaodemap.prototype.geocoder_CallBack = function (data) {
    var that = this,
      address = data.regeocode.formattedAddress;         //返回地址描述
    this.inputNode.val(address);
    that.adcode=data.regeocode.addressComponent.adcode;
  };
    return {gaoMap:Gaodemap}

});
