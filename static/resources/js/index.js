require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
		'hslider':'/resources/js/hslider.min.js?v=bedc5fb83b',
		'sportIP':'/resources/js/home/mit.sportIP.js?v=550c0a3650',
		'video':'/resources/js/home/mit.video.js?v=ef3d8c9a40'

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
		'hslider':{
			deps:['jquery']
		},
		'sportIP':{
			deps:['jquery']
		},
		'video':{
			deps:['jquery']
		}
    },
});
require(['jquery','sportIP','video', 'hhlyAction', 'layer','common','i18n','hslider'],function($){
	// banner 轮播图
	$(".index_slider").hSlider({
		width:580, //容器宽度
		height:290, //容器高度
		control:$('.control'), //绑定控制按钮
		sliderbox:'ul.slider_list',
		item:'li.item',
		during:4000, //间隔4秒自动滑动
		speed:800, //移动速度0.8秒
		mousewheel:true, //是否开启鼠标滚轮控制
		direkey:true //是否开启左右箭头方向控制
	});
	console.log(SportIPModule)
	//首页媒体人，换一批，关注，取消关注监听事件
	SportIPModule.index();
	//首页视频，换一批监听事件
	VideoModule.index();

});
