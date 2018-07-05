require.config({
	paths:{
		"jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
		"hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
		"layer":"/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92",
		"template": "/resources/js/common/template.js?v=a19711611b",
        'common':'/resources/js/common/common.js?v=f486ed9e43',
        'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
        'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15'
	},
	shim: {
        'layer': {
            deps: ['jquery']
        },
        "hhlyAction": {
            deps: ['jquery','layer']
        },
        'template': {
            deps: ['jquery']
        },
        'common':{
            deps: ['jquery','commonUtil','hhlyAction']
        }
    }
});
require(['jquery','template','hhlyAction','layer','common','i18n'],function($,template,hhlyAction,layer){
    var match = {
        ajaxAbort:'',
        clickJudge:false,
        searchParam:{
            matchType: function(){
                return $("input[name='type_select']").val()
            },
            matchTime: function(){
                return $("input[name='apply_time']").val()
            },
            matchStatus: function(){
                return $("input[name='match_status']").val()
            },
            matchName: function(){
                return $("input[name='search_input']").val()
            }
        },
    	loadMatch : function(that,param){
            if(match.ajaxAbort){
                match.ajaxAbort.abort();
            }
    		match.ajaxAbort = $.get('/match/page', param , function (data) {
                if(data.result == 0){
                	var html = template('match_list_script', data);
                	$('.match_list').append(html);
                	$(that).attr('hhly-has-next',data.data.hasNextPage);
                	$(that).attr('hhly-page',(data.data.page + 1));
                	if(data.data.hasNextPage == false){
                		$(that).addClass('hidden');
                		$(that).text('没有更多了');
                	}
                }
            });
    	},
    	searchMatch : function(param){
            if(match.ajaxAbort){
                match.ajaxAbort.abort();
            }
    		match.ajaxAbort = $.get('/match/page', param , function (data) {
                if(data.result == 0){
                	var html = template('match_list_script', data);
                	$('.match_list').html(html);
                	var more = $('.load_more');
                	more.attr('hhly-has-next',data.data.hasNextPage);
                	more.attr('hhly-page',(data.data.page + 1));
                	if(data.data.hasNextPage == true){
                		more.removeClass('hidden');
                	}else{
                		if(!more.hasClass('hidden')){
                			more.addClass('hidden');
                		}
                	}
                }
            });
    	},
    	refreshMatchIp : function(that,param){
            if(match.ajaxAbort){
                match.ajaxAbort.abort();
            }
    		match.ajaxAbort = $.get('/match/recommend', param , function (data) {
                if(data.result == 0){
                	var html = template('matchIp_refresh', data);
                	$('.matchIp_list').html(html);
                	if(data.data.hasNextPage == true){	
                		$(that).attr('hhly-page',(data.data.page + 1));
                	}else{
                		$(that).attr('hhly-page',1);
                	}
                }
            });
    	},
    	attention: function () {
            $(".matchIp_list").delegate('.attention.btn_return','click',function(){
                var url = $(this).attr("hhly-url");
                var that = this;
                $.post(url,{}, function (data) {
                	if(typeof data == 'string'){
                		data = JSON.parse(data);
                	}
                    if(data.result == '2001'){
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
                    }else if(data.result == '2'){
                        layer.open({
                            title:'温馨提示',
                            content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">'+data.msg+'</span></div>',
                            scrollbar: false,
                            move: false,
                            area:['440px'],
                        });
                    }else if(data.result == '0'){
                        $(that).text('已关注').removeClass('btn_return').addClass('btn_focus');
                    }
                });
            });
        },
        loadMore:function(){
            $('.load_more').click(function(){
                var hasNext = $(this).attr('hhly-has-next');
                var page = $(this).attr('hhly-page');
                match.searchParam.page=page;
                if (hasNext && hasNext == 'true') {
                    match.loadMatch(this, match.searchParam);
                }
            });
        },
        refresh:function(){
            $('.refresh').click(function(){
                var page = $(this).attr('hhly-page');
                match.refreshMatchIp(this,{"page":page});
            });
        },
        search:function(){
            $('.search_btn').click(function(){
                match.clickJudge=true;
                match.searchParam.matchType=0;
                match.searchParam.matchName=0;
                match.searchParam.matchName=0;
                $('div[name="type_select"]').find('.opts a').eq(0).click();
                $('div[name="apply_time"]').find('.opts a').eq(0).click();
                $('div[name="match_status"]').find('.opts a').eq(0).click();
                match.searchParam.matchName=$("input[name='search_input']").val();
                match.searchMatch(match.searchParam);
                match.clickJudge=false;
            });
        },
        init:function(){
            $.hhly.inputbox({
              wrap:'div[name="type_select"]',
              width:'150px',
              callback:function(that){
                match.searchParam.matchType=$(that).attr('val');
                if(match.clickJudge){
                    return false;
                }
                $("input[name='search_input']").val('');
                match.searchParam.matchName=null;
                match.searchMatch(match.searchParam);
              }
            });
            $.hhly.inputbox({
              wrap:'div[name="apply_time"]',
              width:'150px',
              callback:function(that){
                match.searchParam.matchTime=$(that).attr('val');
                if(match.clickJudge){
                    return false;
                }
                $("input[name='search_input']").val('');
                match.searchParam.matchName=null;
                match.searchMatch(match.searchParam);
              }
            });
            $.hhly.inputbox({
              wrap:'div[name="match_status"]',
              width:'150px',
              callback:function(that){
                match.searchParam.matchStatus=$(that).attr('val');
                if(match.clickJudge){
                    return false;
                }
                $("input[name='search_input']").val('');
                match.searchParam.matchName=null;
                match.searchMatch(match.searchParam);
              }
            });
            $('.filter_box').removeClass('hidden');
            this.attention();
            this.loadMore();
            this.refresh();
            this.search();
            this.enterSearch();

        },
        enterSearch:function(){
            $(document).keyup(function(event) {
                if (event.keyCode == 13) {
                    $('.search_btn').click();
                }
            });
        }
    }
    match.init();
});