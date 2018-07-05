require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		'rightFloat':'/resources/js/common/footer_rightFloat.js?v=a2fe4f17b3',
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
		'serve_tpl':"/resources/js/about/serve_tpl.js?v=bedc5fb83b"
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
require(['jquery', 'hhlyAction', 'layer','serve_tpl','common','i18n','rightFloat'], function($, hhlyAction, layer,template) {
	var about={
		/*slideInt:function(){
			// banner 轮播图
			var winWidth=$(window).width();
			$(".about_slide").hSlider({
				width:winWidth, //容器宽度
				height:600, //容器高度
				control:$('.control'), //绑定控制按钮
				sliderbox:'ul.slider_list',
				item:'li.item',
				during:4000, //间隔4秒自动滑动
				speed:800, //移动速度0.8秒
				mousewheel:true, //是否开启鼠标滚轮控制
				direkey:true //是否开启左右箭头方向控制
			});
		},*/
		bannerInit:function(data){
			var html=template('banner_tpl',data);
			$('.slider_list').html(html);
			// about.slideInt();
		},
		productInit:function(data){
			var html=template('product_tpl',data);
			$('.product_center').html(html);
		},
		advantageInit:function(data){
			var html=template('advantage_tpl',data);
			$('.product_advantage').prepend(html);
		},
		serveInit:function(data){
			var html=template('serve_tpl',data);
			$('.serve_container').prepend(html);
		},
		introData:function(){
			$.get('/resources/json/about/product.json',{},function(data){
				about.bannerInit(data);
				about.productInit(data);
				about.advantageInit(data);
				about.serveInit(data);
			})
		},
		init:function(){
			this.introData();
		}
	}
	about.init();
});