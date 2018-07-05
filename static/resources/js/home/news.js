require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		"newsData": "/resources/js/model/newsData.js?v=8024f73fd1",
		"attention": "/resources/js/common/attention.js?v=db3dba1a5c",
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',

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
		}
    },
});
require(['jquery', 'hhlyAction', 'layer','newsData','common','i18n','attention'], function($, hhlyAction, layer,newsData,attention) {
	var news={
		tabSlide:function(){
			//tab切换监听
			$(".infor_subtitle").children("span").click(function(){
				//请求数据，填充数据  //如果相同tab，不要请求
				if(!$(this).hasClass("on")){
					$(this).siblings('span').removeClass("on");//兄弟节点删除样式
					$(this).addClass("on");	// 自己添加样式
					var newsBox = $(".news_box").eq($(this).index());//寻找对应的内容div
					var page = newsBox.attr("hhly-next-page");
					//tab切换只第一次加载数据，后面只显示数据
					if(parseInt(page) == 1){
						news.loadData(newsBox);
					}
					newsBox.siblings('div').hide();//兄弟节点隐藏
					newsBox.show();//自己显示
				}
			});
		},
		loadData:function(newsBox){
			var url = newsBox.attr("hhly-url");
			var page = newsBox.attr("hhly-next-page");
			var rows = newsBox.attr("hhly-page-size");
			// ajax请求数据
			$.hhly.ajax({
				url:url,
				data:{"page":page,"rows":rows },
				success:function(data){
					var content = newsData('newsData',data);//新闻数据拼接
					if(!data.data.hasNextPage){
						newsBox.children("div").eq(1).hide();//把更多的数据链接隐藏起来
					}
					newsBox.attr("hhly-next-page",data.data.page + 1).attr("hhly-page-size",data.data.rows).attr("hhly-has-page",data.data.hasNextPage);
					newsBox.children("div").eq(0).append(content);//填充数据
				}
			});
		},
		// 加载更多
		loadMore:function(){
			$(".news_more").click(function(){
				var newsBox = $(this).parent();//寻找对应的内容div
				var url = newsBox.attr("hhly-url");
				var page = newsBox.attr("hhly-next-page");
				var rows = newsBox.attr("hhly-page-size");
				news.loadData(newsBox);
			});
		},
		init:function(){
			this.tabSlide();
			this.loadMore();
		}
	}
	news.init();
});
