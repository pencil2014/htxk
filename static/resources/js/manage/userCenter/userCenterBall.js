require.config({
	paths: {
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
		'common':'/resources/js/common/common.js?v=f486ed9e43',
		'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
		'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
		'personal':'/resources/js/manage/userCenter/common.js?v=5352b1e182',
		'paging':'/resources/js/jquery/paging.js?v=b76500a88a',
		'teamlist':'/resources/js/model/teamList.js?v=fec9b885cd',
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
require(['jquery', 'hhlyAction', 'layer','paging','teamlist','common','i18n','personal'], function($, hhlyAction, layer,Paging,teamlist) {
	var pBall = {
		menuSlide:function(){
			$(".personal_tab li").click(function(){
				var index = $(this).index()+1;
				$(".personal_tab li").removeClass("li");
				$(this).addClass("li");
				$('#type').val(index);
				$.hhly.ajax({
					url:'/manage/personal/fight/ball/page',
					type:'get',
					data:{page:1,rows:5,type:index},
					success:function(data){
						if(data.data.list.length==0){
							$('.team_box .default_page_box').removeClass('hidden');
						}else{
							$('.team_box .default_page_box').addClass('hidden');
						}
						var html=teamlist('teamList',data);
						$('#teamContent .team_list_box').empty().append(html);
						if(data.data.hasNextPage){
							$('.page_box').removeClass('hidden').empty();
							var total=data.data.total;
							var page=data.data.page;
							pBall.pageInt(total,page);
						}
					}
				})
				// pBall.getData(index, 1);
			});
		},
		// page分页初始化
		pageInt:function(total,page){
			var pageDom = new Paging();
			pageDom.init({
				target:'.page_box',
				pagesize:5,
				count:total,
				toolbar:true,
				callback:function(page,size,count){
					var type=$('.personal_tab li.li').index()+1;
					$.hhly.ajax({
						url:'/manage/personal/fight/ball/page',
						type:'get',
						data:{page:page,rows:size,type:type},
						success:function(data){
							var html=teamlist('teamList',data);
							$(window).scrollTop(0);
							$('#teamContent .team_list_box').empty().append(html);
						}
					})
				}
			});

		},
		/*是否为正整数*/
		isPositiveNum:function(s){
			var re = /^[0-9]*[1-9][0-9]*$/ ;
		    return re.test(s);
		},
	    init:function () {
	        this.menuSlide();
	        $(".personal_tab li").eq(0).trigger('click');
	    }
	};
    pBall.init();
});

