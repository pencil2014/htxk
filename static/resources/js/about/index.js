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
		'introduce_tpl':"/resources/js/about/introduce_tpl.js?v=bedc5fb83b"
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
require(['jquery', 'hhlyAction', 'layer','introduce_tpl','common','i18n','rightFloat','xSlider'], function($, hhlyAction, layer,template) {
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
		introInit:function(data){
			var html=template('intro_tpl',data);
			$('.intro_container>.know_box').html(html);
		},
		serviceInit:function(data){
			var html=template('service_tpl',data);
			$('.service_box').html(html);
		},
		shareInit:function(data){
			var html=template('share_tpl',data);
			$('.share_wrap').prepend(html);
		},
		advantageInit:function(data){
			var html=template('advantage_tpl',data);
			$('.advantage_wrap').prepend(html);
		},
		partnerInit:function(data){
			var html=template('partner_tpl',data);
			$('.partner_wrap').prepend(html);
		},
		introData:function(){
			$.get('/resources/json/about/index.json',{},function(data){
				about.introInit(data);
				about.serviceInit(data);
				about.shareInit(data);
				about.advantageInit(data);
				about.partnerInit(data);
				about.bannerInit(data);
			})
		},
		init:function(){
			this.introData();
		}
	}
	about.init();
});