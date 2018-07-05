require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
		'personal':'/resources/js/manage/userCenter/common.js?v=5352b1e182'
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
    },
});
require(['jquery', 'hhlyAction', 'layer','common','i18n','personal'],function($){
	var approveDesc={
		inputInt:function(){
			$.hhly.inputbox({
				wrap:'div[name="compet_rbt"]'
			});
		},
		agreeInt:function(){
			$('.agreement_btn').click(function(){
				layer.open({
					scrollbar: false,
					move: false,
					area:['800px','660px'],
					type: 2,
					content: ['/resources/html/agreement/approve.html']
				})
			})
		},
		init:function(){
			this.inputInt();
			this.agreeInt();
		}
	}
	approveDesc.init();
});