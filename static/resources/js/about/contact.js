require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		'rightFloat':'/resources/js/common/footer_rightFloat.js?v=a2fe4f17b3',
		'xSlider':'/resources/js/jquery/xSlider.js?v=bedc5fb83b',
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
		'contact_tpl':"/resources/js/about/contact_tpl.js?v=bedc5fb83b"
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
		'xSlider':{
			deps:['jquery']
		},
		'rightFloat':{
			deps: ['jquery']
		}
    },
});
require(['jquery', 'hhlyAction', 'layer','contact_tpl','common','i18n','rightFloat','xSlider'], function($, hhlyAction, layer,template) {
	var about={
		slideInt:function(){
			// banner 轮播图
			var config = {
			  current: 0,
			  speed: 500,
			  intervalTime: 2000
			}
			$('.about_slide').xSlider(config);
		},
		bannerInit:function(data){
			var html=template('banner_tpl',data);
			$('.slider_list').html(html);
			about.slideInt();
		},
		contactInit:function(data){
			var html=template('contact_tpl',data);
			$('.contact_container').html(html);
		},
		addressInit:function(data){
			var html=template('address_tpl',data);
			$('.address_box').html(html);
		},
		introData:function(){
			$.get('/resources/json/about/contact.json',{},function(data){
				about.contactInit(data);
				about.addressInit(data);
				about.bannerInit(data);
			})
		},
		gadInt:function(){
			var map = new AMap.Map("map_box", {
		        resizeEnable: true,
		        zoom:20,
		    });
		    var placeSearch = new AMap.PlaceSearch();  //构造地点查询类
		    //详情查询
		    placeSearch.getDetails("B0FFI03G68", function(status, result) {
		        if (status === 'complete' && result.info === 'OK') {
		            placeSearch_CallBack(result);
		        }
		    });
		    var infoWindow = new AMap.InfoWindow({
		        autoMove: true,
		        offset: {x: 0, y: -30}
		    });
		    //回调函数
		    function placeSearch_CallBack(data) {
		        var poiArr = data.poiList.pois;
		        //添加marker
		        var marker = new AMap.Marker({
		            map: map,
		            position: poiArr[0].location
		        });
		        map.setCenter(marker.getPosition());     
		        infoWindow.setContent(createContent(poiArr[0]));
		        infoWindow.open(map, marker.getPosition());
		    }
		    function createContent(poi) {  //信息窗体内容
		        var s = [];
		        s.push("<b>名称：" + poi.name+"</b>");
		        s.push("地址：" + poi.address);
		        // s.push("电话：" + poi.tel);
		        return s.join("<br>");
		    }
		},
		init:function(){
			this.gadInt();
			this.introData();
		}
	}
	about.init();
});