require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
		'personal':'/resources/js/manage/userCenter/common.js?v=5352b1e182',
		'template':'/resources/js/manage/userCenter/attention/template.js?v=8662666b63',
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
require(['jquery','paging','template', 'hhlyAction', 'layer','common','i18n','personal'],function($,Paging,template){
	var focus={
		attention:function(){
			$('.followClick').off('click').on('click', function() {
				var url = $(this).attr("hhly-url");
				var that = $(this);
				//提交数据
				$.hhly.ajax({
					url: url,
					success: function(obj) {
						if (obj.result == '2001') {
							layer.open({
								title: '温馨提示',
								content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">未登录，不能关注！</span></div>',
								scrollbar: false,
								move: false,
								area: ['440px'],
								yes: function(index, lay) {
									window.location.href = '/member/login';
								}
							});

						}else if (obj.result == '0' && obj.data == 'add') {
							that.attr("hhly-url", url.replace("add", "del"));
							that.addClass("star_focus");
							that.html(msgUtil.getTxt('common_followed'));
						}else if (obj.result == '0' && obj.data == 'del') {
							that.attr("hhly-url", url.replace("del", "add"));
							that.removeClass("star_focus");
							that.html("+ " + msgUtil.getTxt('common_follow'));
						}
						else {
							layer.open({
								area: '440px',
								content: '<span class="at_span warn"></span><span class="dialog_tips">' + obj.msg + '</span>',
								scrollbar: false
							});
						}
					}
				});
			});
		},
		// 加载更多
		loadMore:function(){
			$('#manage_contents').off('click','.load_more').on('click','.load_more',function(){

			});
		},
		// page分页初始化
		pageInt:function(total,page){
			var total=$('.page_box').attr('hhly-total');
			var pageDom = new Paging();
			pageDom.init({
				target:'.page_box',
				pagesize:10,
				count:total,
				toolbar:true,
				callback:function(page,size,count){
					$.hhly.ajax({
						url:'/manage/personal/focus/page',
						type:'get',
						data:{page:page},
						success:function(data){
							console.log(data)
							var html=template('attention_tpl',data);
							$('.personal_focus_list').empty().append(html);
						}
					})
				}
			});
		},
		init:function(){
			this.attention();
			this.loadMore();
			this.pageInt();
		}
	};
	focus.init();
});

