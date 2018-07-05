require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		"recommend": "/resources/js/model/recommend.js?v=02dee115ad",
	},
	shim: {
		'layer': {
			deps: ['jquery']
		},
		"hhlyAction": {
			deps: ['jquery', 'layer']
		}
    }
});
define(['jquery','hhlyAction','layer','recommend'],function ($,hhlyAction,layer,recommend) {
	var sportIPModule = {
		//点击"换一批",加载数据
		loadData:function(){
			$("span[hhly-index='sportIP']").click(function(){
				var that = $(this);
				var url = that.attr("hhly-url");
				$.getJSON(url).done(function(data){
					var content = recommend('recommend',data);
					$(that).parents('.user_list_title').next("ul").html(content);
					$(that).attr("hhly-url",url.replace(new RegExp("\\d+"),data.hasNextPage?(data.page + 1):1));
					sportIPModule.focus();
				});
			});
		},
		// 新闻详情页面
		newsDetail:function(){
			//关注，取消关注监听事件
			$("#recommend").find("a").click(function(){
				sportIPModule.follow(this);
			});
		},
		//添加,取消关注
		focus:function(){
			$(".foucs_warp").off('click').on('click','a',function(){
				sportIPModule.follow(this);
			})
		},
		//触发关注事件
		follow:function(e){
			var url = $(e).attr("hhly-url");
			var that = $(e);
			//提交数据
			$.hhly.ajax({
				url:url,
				success:function(obj){
					if(obj.result == '2001'){
						layer.open({
							title:'温馨提示',
						  content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">未登录，不能关注！</span></div>',
						  scrollbar: false,
						  move: false,
						  area:['440px'],
						  yes:function(index,lay){
							  window.location.href='/member/login';
						  }
						});
					}else if(obj.result == '0' && obj.data == 'add'){
						that.attr("hhly-url",url.replace("add","del"));
						that.addClass("star_focus");
						that.html(msgUtil.getTxt('common_followed'));
					}else if(obj.result == '0' && obj.data == 'del'){
						that.attr("hhly-url",url.replace("del","add"));
						that.removeClass("star_focus");
						that.html("+ " + msgUtil.getTxt('common_follow'));
					}else{
						layer.open({
							area: '440px',
							content: '<span class="at_span warn"></span><span class="dialog_tips">' + obj.msg + '</span>',
							scrollbar: false
						});
					}
				}
			});
		},
		//首页调用的方法
		index:function(){
			sportIPModule.loadData();
			sportIPModule.focus();
		}
	};
	sportIPModule.index();
})