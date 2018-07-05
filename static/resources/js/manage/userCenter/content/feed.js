require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
		'personal':'/resources/js/manage/userCenter/common.js?v=5352b1e182',
		'template':'/resources/js/manage/userCenter/content/template.js?v=a8321adb8a',
		'paging':'/resources/js/jquery/paging.js?v=b76500a88a',
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
		'personal':{
			deps:['jquery']
		},
		'paging':{
			deps:['jquery']
		}
    },
});
require(['jquery','template','paging', 'hhlyAction', 'layer','common','i18n','personal'],function($,template,Paging){
	var feed={
		pageInt:function(){
			var total=$('.page_box').attr('hhly-total');
			var page=$('.page_box').attr('hhly-page');
			var pageDom = new Paging();
			pageDom.init({
				target:'.page_box',
				pagesize:10,
				count:total,
				toolbar:true,
				callback:function(page,size,count){
					console.log(page)
					$.hhly.ajax({
						url:'/manage/personal/feed/page',
						type:'get',
						data:{page:page},
						success:function(data){
							var html=template('feed_tpl',data);
							$('.news_box .infor_list').empty().append(html);
							$(window).scrollTop(0);
						}
					})
				}
			});
		},
		init:function(){
			this.pageInt();
		}
	}
	feed.init();
});

