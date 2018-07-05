require.config({
  paths: {
    "jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
    "hhlyAction": "/resources/js/jquery/hhlyAction.js?v=e060756375",
    "template": "/resources/js/match/template.js?v=90fc02a1d0",
    'layer': '/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92',
    'common':'/resources/js/common/common.js?v=f486ed9e43',
    'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
    'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15'
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
  }
});
require(['jquery', 'hhlyAction', 'layer', 'template','common','i18n'], function($, hhlyAction, layer,template) {
  var details = {
    judge:false,
    ajaxXhr:'',
    // 详情数据加载
    inforData: function() {
      details.ajaxXhr=$.hhly.ajax({
        url:'/match/basic',
        type:'get',
        data:{
          matchId:$('#matchId').val()
        },
        success:function(data){
          if(parseInt(data.result)==0){
            var data= data.data;
            var html = template('details_content',data);
            $('.details_wrap').html(html);
            details.changeInit();
          }
          details.judge=false;
        }
      });
    },
    // 赛事章程
    ruleData:function(){
      details.ajaxXhr=$.hhly.ajax({
        url:"/match/rules",
        type:'get',
        data:{
          matchId:$('#matchId').val()
        },
        success:function(data){
          if(parseInt(data.result)==0){
            var data= data.data;
            var html = template('rules_content',data);
            $('.details_wrap').html(html);
          }
          details.judge=false;
        }
      })
    },
    // 赛事公告
    noticeData:function(){
      details.ajaxXhr=$.hhly.ajax({
        url:'/match/notice',
        type:'get',
        data:{
          matchId:$('#matchId').val()
        },
        success:function(data){
          if(parseInt(data.result)==0){
            var html = template('notice_content',data);
            $('.details_wrap').html(html);
          }
          details.judge=false;
        }
      })
    },
    // 参赛者
    playerData:function(){
      var page = 1
      var matchId = $('#matchId').val()
      var matchType = $('#matchType').val()
      var groupType = ''
      var initPlayer = true
      var getPlayerList = function(callback) {
        details.ajaxXhr=$.hhly.ajax({
          url:'/match/joins',
          type:'get',
          data:{
            matchType: matchType,
            matchId:matchId,
            page:page,
            rows:10,
            groupType:groupType
          },
          success:function(data){
            if(parseInt(data.result)==0){
              if(!callback){
                if($('ul.player_list').length==0&&!groupType){
                  if(!$('.details_wrap .tab').length){
                    var html = template('player_content',data);
                    $('.details_wrap').html(html);
                  }
                }else{
                  data.data.page = page
                  var html = template('player_list',data.data);
                  if(page==1){
                    $('ul.player_list').html(html);
                  }else{
                    $('ul.player_list').append($(html).not('.title'));
                  }
                  if(!data.data.hasNextPage){
                    $('.load_more').hide();
                  }else{
                    $('.load_more').show().attr('hhly-data-page',page);
                  }
                }
              }else{
                callback(data)
              }
             $('.player_wrap .load_more').off('click').on('click', function(e) { //更多事件
                e.stopPropagation();
                page++
                getPlayerList()
              })
            }
            details.judge=false;
          }
        });
      }
      if (matchType == 3006) {
        details.ajaxXhr=$.hhly.ajax({
          url:'/match/getMatchGroupType',
          type:'get',
          data: {
            matchId: matchId
          },
          success: function(groupTypeData) {
            getPlayerList(function(data){
              data.groupTypeObject = {
                22024: '全马',
                22025: '半马',
                22026: '10公里',
                22027: '5公里',
                1: '待摇号',
                7:'已中签'
              }
              data.groupTypeData = groupTypeData.data
              var html = template('player_content',data);
              $('.details_wrap').html(html);
              $('.tab').on('click','li',function(){
                $(this).addClass('active').siblings().removeClass('active')
                groupType = $(this).attr('data-value')
                page=1
                getPlayerList()
              })
            })
            details.judge=false;
          },
          error: function() {
            details.judge=false;
          }
        })
      }else{
        getPlayerList()
      }
      
    },
    // 数据/榜单
    sortData:function(page){
      details.ajaxXhr=$.hhly.ajax({
        url:'/match/getMatchRanking',
        type:'get',
        data:{
          matchId:$('#matchId').val(),
          page:page,
          rows:10
        },
        success:function(data){
          if(parseInt(data.result)==0){
            if($('.sort_box').length==0){
              var html = template('sort_content',data.data);
              $('.details_wrap').html(html).find('.load_more').off('click').on('click', function(e) {
                e.stopPropagation();
                var page=parseInt($(this).attr('hhly-data-page'))+1;
                details.sortData(page);
              })
            }else{
              var html = $(template('sort_content',data.data)).find('.table_body_group');
              $('.sort_box .table_layout').append(html);
              if(!(data.data.footballPage || data.data.basketballPage || {}).hasNextPage){
                $('.load_more').remove();
              }else{
                $('.load_more').attr('hhly-data-page',page);
              }
            }
          }
          details.judge=false;
        },
        error: function(){
          details.judge=false;
        }
      });
    },
    // 赛程
    scheduleData: function() {
      var params = {
        page: 1,
        grade: 1,
        matchId:$('#matchId').val(),
        rows:10
      }
      var disabledButton = function($items) {//上下页disabled状态更新
        var index = $items.filter('.show').first().index()
        var $prev = $('.schedule_week_prev')
        var $next = $('.schedule_week_next')
        if(index == 0){
          $prev.addClass('disabled')
        }else{
          $prev.removeClass('disabled')
        }
        index = $items.filter('.show').last().index()
        if(index == $items.length-1 || $items.length<8){
          $next.addClass('disabled')
        }else{
          $next.removeClass('disabled')
        }
      }
      var matchId = $('#matchId').val()
      details.ajaxXhr=$.hhly.ajax({//获取轮次
        url: '/match/getMatchRounds',
        type: 'get',
        data:{
          matchId:matchId,
          page:1,
          rows:100000
        },
        success:function(roundsData){
          details.ajaxXhr=$.hhly.ajax({//获取赛程日期
            url: '/match/getMatchWrokDate',
            type: 'get',
            data:{
              matchId:matchId,
            },
            success:function(dateData){
              details.ajaxXhr=$.hhly.ajax({ //获取场地
                url: '/match/getMatchPlace',
                type: 'get',
                data:{
                  matchId:matchId,
                },
                success: function(placeData){
                  var placeNumberData = []
                  for (var i = 0;i<placeData.data.length;i++){
                    if (placeData.data[i].placeNumber) {
                      placeNumberData = placeNumberData.concat(placeData.data[i].placeNumber.split(','))
                    }
                  }
                  var html = template('schedule_content',{
                    roundsData:roundsData.data.list,
                    dateData:dateData.data,
                    placeData:placeData.data,
                    placeNumberData:placeNumberData
                  });
                  $('.details_wrap').html(html)
                  $('.schedule_week_items li').slice(0,7).addClass('show')
                  var $bar = $('.schedule_filter_bar')
                  var $items = $('.schedule_week_items li')
                  $bar.on('click', '.schedule_week_items li, .schedule_wheel', function(e){ //轮次和赛程事件
                    var $this = $(this)
                    var $target = $(e.target)
                    if($this.hasClass('active')&&!$target.hasClass('schedule_wheel_item')) return
                    $bar.find('.schedule_week_items li.active, .schedule_wheel.active').removeClass('active')
                    $this.addClass('active')
                    if($target.hasClass('schedule_wheel_item')){//轮次项目事件
                      $target.addClass('active').siblings().removeClass('active')
                      var grade = e.target.innerText
                      $('.schedule_wheel_inner span').html(grade)
                      $('.schedule_wheel').attr('data-value',grade)
                      params.grade = grade
                      delete params.startTime
                    }else if($this.hasClass('schedule_wheel')){//轮次事件
                      params.grade = $this.attr('data-value')
                      delete params.startTime
                    }else{//赛程事件
                      params.startTime = new Date($this.attr('data-value')).getTime()
                      delete params.grade
                    }
                    params.page = 1
                    details.scheduleList(params)
                  }).on('click', '.schedule_week_prev', function() {//赛程上一页事件
                    var index = $items.filter('.show').first().index()
                    if(index>0){
                      $items.removeClass('show').slice(index-7, index).addClass('show')
                      disabledButton($items)
                    }
                  }).on('click', '.schedule_week_next', function() {//赛程下一页事件
                    var index = $items.filter('.show').last().index()+1
                    if(index<$items.length){
                      $items.removeClass('show').slice(index, index+7).addClass('show')
                      disabledButton($items)
                    }
                  })
                  $.hhly.inputbox({ //场地联动事件
                    wrap:'.schedule_search .select_common',
                    width:'250',
                    callback:function(target){
                      var $target = $(target)
                      var value = $target.attr('data-value')
                      if(value){
                        var html = ['<a val="" data-name="placeNumber">全部场区</a>']
                        value.split(',').forEach(function(item){
                          html.push('<a val="'+item+'" data-name="placeNumber" title="'+item+'">'+item+'</a>')
                        })
                        var $select = $('.schedule_search .select_common').eq(1)
                        $select.find('.opts').html(html.join(''))
                        var placeNumber = value.split(',')[0]
                        $select.find('.selected').text('全部场区')
                        params.placeNumber = ''
                      }
                      params[$target.attr('data-name')]=$target.attr('val')
                      params.page=1
                      details.scheduleList(params)
                    }
                  });
                  details.scheduleList(params)
                }
              })
            }
          })
          details.judge=false;
        },
        error: function() {
          details.judge=false;
        }
      })
    },
    scheduleList: function(params) { //赛程列表
      details.ajaxXhr=$.hhly.ajax({
        url:'/match/getMatchSchedule',
        type:'get',
        data:params,
        success:function(data){
          if(parseInt(data.result)==0){
            if(params.page==1){
              var html = template('schedule_list',data);
              $('.schedule_list_wrapper').html(html).find('.load_more').off('click').on('click', function(e) {
                e.stopPropagation();
                var page=parseInt($(this).attr('hhly-data-page'))+1;
                params.page++
                details.scheduleList(params);
              })
            }else{
              var html = $(template('schedule_list',data)).find('.table_body_group');
              $('.schedule_list .table_layout').append(html);
              if(!(data.data.footballPage || data.data.footballPage || {}).hasNextPage){
                $('.load_more').remove();
              }else{
                $('.load_more').attr('hhly-data-page',page);
              }
            }
          }
        }
      });
    },
    // table切换
    matchTable:function(){
      $('.infor_subtitle span').click(function(){
          if(details.judge){
            return false;
          }
          if($(this).hasClass('on')){
            return false;
          }
          details.judge=true;
          var type=parseInt($(this).attr('data-type'));
          if(type==1){
            if(details.ajaxXhr){
              details.ajaxXhr.abort();
            }
            details.inforData();
          }else if(type==2){
            if(details.ajaxXhr){
              details.ajaxXhr.abort();
            }
            details.ruleData();
          }else if(type==3){
            if(details.ajaxXhr){
              details.ajaxXhr.abort();
            }
            details.noticeData();
          }else if(type==4){
            if(details.ajaxXhr){
              details.ajaxXhr.abort();
            }
            details.scheduleData()
          }else if(type==5){
            if(details.ajaxXhr){
              details.ajaxXhr.abort();
            }
            details.playerData(1);
          }else if(type==6){
            if(details.ajaxXhr){
              details.ajaxXhr.abort();
            }
            details.sortData(1)
          }
          $(this).addClass('on').siblings().removeClass('on');
      });
    },
    changeInit:function(){
      $.hhly.slideChange({
        box: '.pic_con',
        wrap: '.pic_content',
        container: '.pic_lists',
        li: 'li',
        pageNum: 4,
        prev: '.left_btn',
        next: '.right_btn',
        ajaxJudge: false
      })
    },
    quitMatch:function(){
   	 $('.details_wrap').on('click','.exit_btn',function(){
          layer.open({
            scrollbar: false,
            move: false,
            title: '温馨提示',
            area:'440px',
            content: '<div class="dialog_login_box text"><span class="at_span warn"></span><span class="dialog_tips">是否退出此赛事？</span></div>',
            btn:['确定','取消'],
            yes:function(index, layero){
              layer.close(index);
              var thisLi = $(this).parents('li.bg');
              $.hhly.ajax({
                  url:'/match/quit',
                  type:'post',
                  data:{
                    matchId:$('#matchId').val()
                  },
                  success:function(data){
                    data = JSON.parse(data);
                    if(data.result=='0'){
                      layer.open({
                        scrollbar: false,
                        move: false,
                        title: '温馨提示',
                        area:'440px',
                        content: '<div class="dialog_login_box text"><span class="at_span success"></span><span class="dialog_tips">成功退出</span></div>',
                        btn: ['确定'],
                        end:function(){
                          window.location.href=window.location.href;
                        }
                      });
                    }else{
                      layer.open({
                        scrollbar: false,
                        move: false,
                        title: '温馨提示',
                        area:'440px',
                        content: '<div class="dialog_login_box text"><span class="at_span error"></span><span class="dialog_tips">'+data.msg+'</span></div>',
                        btn: ['确定'],
                      });
                    }
                  }
              });
            }
          });
	      });
    },
    init:function(){
      this.matchTable();
      details.quitMatch();
      $('.infor_subtitle span').eq(0).trigger('click');
    }
  }
  details.init();
});