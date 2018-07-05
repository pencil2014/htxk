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
		'about_tpl':"/resources/js/about/about_tpl.js?v=bedc5fb83b"
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
require(['jquery', 'hhlyAction', 'layer','about_tpl','common','i18n','rightFloat','xSlider'], function($, hhlyAction, layer,template) {
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
		tabSlide:function(){
			$.hhly.tabSlider({
				container: '.about_slide_container',
				menuBox: '.title',
				tab: '.tab_slide',
				tabContent: '.tab_container'
			});
		},
		bannerInit:function(data){
			var html=template('banner_tpl',data);
			$('.slider_list').html(html);
			about.slideInt();
		},
		introInit:function(data){
			var html=template('intro_tpl',data);
			$('.introduce_box').html(html);
		},
		manageInit:function(data){
			var html=template('manage_tpl',data);
			$('.manage_box').html(html);
		},
		goalInit:function(data){
			/*var html=template('goal_tpl',data);
			$('.brand_box').prepend(html);*/
		},
		introData:function(){
			$.get('/resources/json/about/about.json',{},function(data){
				about.introInit(data);
				about.manageInit(data);
				about.goalInit(data);
				about.tabSlide();
				about.bannerInit(data);
			})
		},
		init:function(){
			this.introData();
		}
	}
	about.init();
});