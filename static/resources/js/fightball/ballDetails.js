
  require.config({
    baseUrl: hhly_base_path,
    paths: {
      "jquery": "/resources/js/jquery/jquery-1.11.3.min.js?v=13c0a5055c",
      "hhly": "/resources/js/jquery/hhlyAction.js?v=e060756375",
      "layer":"/resources/js/jquery/jquery.layer.min.js?v=6ed4e1cc92",
      "template": "/resources/js/fightball/detail/template.js?v=0778c1bec8",
      'common':'/resources/js/common/common.js?v=f486ed9e43',
      'commonUtil':'/resources/js/common/commonUtil.js?v=e97071eff8',
      'i18n':'/resources/js/i18n/i18n_zh_CN.js?v=6e86a3fb15',
      "Gaodemap": "/resources/js/fightball/gaodeMap.js?v=3081bc75a2",
      "App": "/resources/js/fightball/app.js?v=901ec15346",
      "bootstrap":'/resources/js/fightball/lib/bootstrap.min.js?v=04c84852e9',
    },
    shim: {
      'bootstrap': {
        deps: ['jquery']
      },
      'App': {
        deps: ['jquery']
      },
      'template':{
        deps: ['jquery']
      },
      "layer": {
        deps: ['jquery']
      },
      'Gaodemap': {
        deps: ['jquery']
      },
      'hhly': {
        deps: ['jquery']
      },
      'common':{
          deps: ['jquery','commonUtil','hhly']
      }
    }
  });
  require(['jquery', 'bootstrap', 'template', "App", "layer","Gaodemap",'hhly','common','i18n'], function($, bootstrap, template, App, layer,Gaodemap,hhly,common) {
      template.helper('phone',function(item,str){
        return item.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      })
    var ballDetail = {
      playerList: [], // 保存列表数据
      isManager: null,
      fightBallId: null,
      pageStatus: 3,       // 初始化获取待处理分页类型数据参数
      selectValue: null,  // 保存选中的加入方式
      row: 12,
      joinWay:'',
      Gaodemap:{},
      // tab切换获取出何种分页类型数据判断
      getInitPageData: function(index) {
        $('.player_box').empty();   // 清空当前列表
        ballDetail.playerList = [];   // 清空列表数据
        ballDetail.pageStatus = index == 0 ? 2 : 3;   // 根据索引或获取当前分页类型的参数 2 未处理 3 已加入
        $(".handle_title").children("li").removeClass("active").eq(index).addClass("active");
        if (ballDetail.isManager == 0) {  // 判断是否为游客
          ballDetail.pageStatus = 3;      // 加载更多是判断的状态，当为游客是 状态为3
          ballDetail.getPageData(3);      // 获取已加入列表
        }else{
          index == 0 ? ballDetail.getPageData(2) : ballDetail.getPageData(3);   // 根据index获取不同也数据
        }

      },
      /*
       * @title:标题
       * @btn:显示的按钮数组
       * @area:按钮的尺寸数组
       * @content:显示的内容
       * @okCallback:实例化成功的回调
       * @confirmCallback:点击确认按钮的回调
       * @node:确认按钮的回调使用的参数
       * @concelCallBack:取消按钮的回调
       * */
      popModal: function(title, btn, area, content, okCallback, confirmCallback, node, concelCallBack) {
        layer.open({
          scrollbar: false,
          type: 1,
          title: title,
          btn: btn,
          area: area, //宽高
          content: content,
          success: function() {             // 实例化成功的回调
            if (okCallback) okCallback(node);
          },
          yes: function(layero) {           // 点击确认按钮的回调
            layer.close(layero);
            if ($.isFunction(confirmCallback)) confirmCallback();
          },
          btn2: function(index, layero) {    // 点击取消按钮的回调
            if (concelCallBack) concelCallBack();
          },
        });
      },
      // 弹出消息框
      popMsg: function(textStr, callBack) {
        layer.open({
            scrollbar: false,
            move: false,
            title:'温馨提示',
            area:['440px'],
            content:textStr,
            btn:['确定'],
            end:function(layero,index){
              if ($.isFunction(callBack)) callBack();
            }
        });
      },
      // 权限转移列表点击
      modalChecked: function() {
        $('body').on('click', '.layui-layer-dialog .check_btn', function() {
          $('.transfer_list .check_btn').find('img').addClass('hide').next().attr("checked", false).parents("li").removeClass("active");
          $(this).children('img').removeClass('hide').next().attr("checked", true).parents("li").addClass("active");// 选中当前点击的checkbox
        });
      },
      //终止报名
      terminationFight: function() {
        $("#terminationFight").click(function() {
          var content = '<span class="lay_tips warn"></span><span class="dialog_tips">确定要提前结束报名?</span>';
          ballDetail.popModal("温馨提示", ["是", "否"], ['600px', '650px'], content, function() {
            $.post(App.baseUrl + '/city/fight/pause', {   // 调用终止报名接口
              fightId: ballDetail.fightId
            }, function() {
              ballDetail.getInitData(function() {        // 获取页面数据
                ballDetail.popMsg('<span class="lay_tips success"></span><span class="dialog_tips green">已成功结束报名！</span>')
              });
            })
          });
        })
      },
      // 获取选中的userId
      getSelectUsers: function() {
        var personIdArr = [];
        $('.player_list .check_btn img').each(function(index, node) {     // 获取当前页面选中的id值
          if (!$(node).hasClass('hide')) {
            personIdArr.push($(node).next().val());
          }
        });
        return personIdArr;
      },
      // 处理待处理和已加入人员
      handleUser: function(url, parameObj, callBack) {
        $.ajax({
          url: App.baseUrl + url,
          type: "POST",
          contentType: "application/x-www-form-urlencoded",
          data: parameObj,
          dataType: 'json',
          success: function(res) {
            ballDetail.playerList = [];             // 清空数据刷新页面，获取第一页数据
            if ($.isFunction(callBack)) {
              callBack(res);
            }
          }
        });
      },
      init:function(){
        ballDetail.fightBallId = App.getUrl('fightBallId');
        $.hhly.ajax({
            url:App.baseUrl + "/city/fight/detail",
            type:'get',
            cache:false,
            data:{"fightBallId": ballDetail.fightBallId},
            success:function(res){
              if (res.result == 0) {
                $(".detail_wrap").html(template("detailTem", res));
                $(".join_type").html(template('joinType', res));
                $(".map_content").html(template('mapContent', res));
                ballDetail.joinWay=res.data.fightBall.joinWay;
                new Gaodemap.gaoMap($('#addressSearch'),[res.data.fightBall.longitude,res.data.fightBall.latitude],'mapcont');
                ballDetail.isManager = res.data.fightBall.isManager;
                ballDetail.getInitData(function() {                                                             // 获取初始化数据
                  ballDetail.isManager == 1 ? ballDetail.getPageData(2) : ballDetail.getPageData(3);// 获取列表第一页数据
                });
                ballDetail.fightId = res.data.fightBall.fightId;        // 初始化获取当前用户id
                ballDetail.selectValue = $('.join_type select').val();  // 获取初始化select加入方式的值
                $('.mod_main,.fightball_footer,.advertisement_content').removeClass('hidden');
                if($('.select_join').find('input').length==0){
                  $.hhly.inputbox({
                    wrap:'.select_join',
                    width:'120',
                    height:'32',
                    callback:ballDetail.joinSlide
                  });
                }
              }
            }
        })                                             // 获取查询字符串

      },
      //获取初始化数据
      getInitData: function(callBack) {
        $.hhly.ajax({
            url:App.baseUrl + "/city/fight/detail",
            type:'get',
            cache:false,
            data:{"fightBallId": ballDetail.fightBallId},
            success:function(res){
              if (res.result == 0) {
                $(".fight_ball_handle").html(template("permissionsBtn", res));
                $(".handle_title_box").html(template('handleTitle', res));
                $(".user_intro").html(template("userIntro", res));
                if (typeof callBack != 'undefined') {callBack(); }
              }
            }
        })
      },
      /*加入方式切换*/
      joinSlide:function(that){
          if($(that).hasClass('selected')){
            return false;
          }
          var value = $(that).attr('value'),
            content = '<span class="lay_tips warn"></span><span class="dialog_tips">确定要修改加入方式?</span>';
          ballDetail.popModal("温馨提示", ["确定", "取消"], ['440px'], content, "", function() {
            $.post(App.baseUrl + "/city/fight/update/join/type", { // 调用改变加入方式的接口
              fightId: ballDetail.fightId,
              joinType: value
            }, function(res) {
              ballDetail.selectValue = value;                     // 保存当前选择的加入方式
              ballDetail.popMsg('<span class="lay_tips success"></span><span class="dialog_tips green">已成功修改加入方式！</span>');
            })
          }, '', function() {
            var  text='';
            if($(that).hasClass('old_select')){
              text=$(that).text();
            }else{
              $(that).removeClass('selected').addClass('old_select').siblings('.old_select').addClass('selected').removeClass('old_select');
              text=$(that).parents('.opts').find('a.selected').text();
            }
            $(that).parents('.opts').siblings('div.selected').empty().text(text);
            // $(that).val(ballDetail.selectValue);                  // 切换回改变之前的加入方式
          });
      },
      /*
       * 获取分页数据
       * @status:2为获取待处理分页数据，3为获取已加入分页数据
       * */
      getPageData: function(status, callBack) {
        $.hhly.ajax({
          url:App.baseUrl + '/city/fight/join/users',
          type:'get',
          cache:false,
          data:{fightId: ballDetail.fightId,status: status,page: Math.ceil(ballDetail.playerList.length / ballDetail.row) + 1,row: ballDetail.row},
          success:function(res){
            res.isManager = ballDetail.isManager;                     // 获取当前操作用户身份
            status == 2 ? res.isJoinUser = 0 : res.isJoinUser = 1;    // 当前用户为已加入还是待处理
            $(".handle_btn_box").html(template("handleBtn", res));
            $(".player_box").html(template("athleteList", res));
            ballDetail.playerList = res.data.list;
            if ($.isFunction(callBack)) callBack(res);
          }
        });
      },
      // 将所有的权限按钮绑定事件
      initButtonEvent: function() {
        // 列表tab切换
        $('.handle_title_box').on('click', 'li', function() {
          var index = $(this).index();                    // 获取分页类型参数
          if (ballDetail.getSelectUsers().length > 0) {   // 判断当前列表数据是否未处理
            var content = '<span class="lay_tips warn"></span><span class="dialog_tips">放弃当前选择?</span>'
            ballDetail.popModal("温馨提示", ["是", "否"], ['440px', '260px'], content, "", function() {
              ballDetail.getInitPageData(index);          // 获取第一页数据
            });
          } else {
            ballDetail.getInitPageData(index);            // 获取第一页数据
          }
        });
        // 关闭拼球按钮事件
        $('.fight_ball_handle').on('click', '.close_fight_ball', function() {
          var content = '<span class="lay_tips warn"></span><span class="dialog_tips">确认关闭拼球?</span>';
          ballDetail.popModal("温馨提示", ["是", "否"], ['440px', '260px'], content, "", function() {
            $.post(App.baseUrl + '/city/fight/close', {               // 调用关闭拼球接口
              fightId: ballDetail.fightId
            }, function() {
              ballDetail.popMsg('<span class="lay_tips success"></span><span class="dialog_tips green">已成功删除此拼球！</span>', function() {    // 弹框提示
                window.location.href ='/city/common/index';                         //跳转到同城首页
              });
            });
          });
        });
        // 终止报名
        $('.fight_ball_handle').on('click', '#terminationFight', function() {
          var content = '<span class="lay_tips warn"></span><span class="dialog_tips">确定要提前结束报名?</span>';
          ballDetail.popModal("温馨提示", ["是", "否"], ['440px', '260px'], content, "", function() {
            $.post(App.baseUrl + '/city/fight/pause', {      // 调用终止报名接口
              fightId: ballDetail.fightId
            }, function(res) {
              ballDetail.getInitData(function(res) {        // 获取页面数据
                ballDetail.popMsg('<span class="lay_tips success"></span><span class="dialog_tips">已成功结束报名！</span>',function(){
                  window.location.href = window.location.href;
                })
              });
            });
          });
        });
        //再次发起
        $('.fight_ball_handle').on('click', '.init_again', function() {
          var content = '<span class="lay_tips warn"></span><span class="dialog_tips">确认再次发起?</span>';
          ballDetail.popModal("温馨提示", ["确定", "取消"], ['440px', '260px'], content, "", function() {
            location.href = '/city/fight/create/detail?fightId=' + ballDetail.fightId; // 跳转到发起拼球页面
          });
        });
        //我要加入
        $('.fight_ball_handle').on('click', '.join_fight_ball', function() {
          var that = this,
            content = '<span class="lay_tips warn"></span><span class="dialog_tips">确认加入拼球?</span>';
          ballDetail.popModal("温馨提示", ["确定", "取消"], ['440px', '260px'], content, "", function() {
            $.post(App.baseUrl + '/city/fight/add', {                              // 我要加入接口
              fightId: ballDetail.fightId
            }, function(res) {
              res = JSON.parse(res);
              if (res.result == 0) {
                ballDetail.getPageData(3,function(){
                  $('ul.handle_title ').find('li').eq(0).trigger('click');
                });
                ballDetail.getInitData(3);
                var msg='';
                if(ballDetail.joinWay==1){
                  msg='您已成功加入拼球！';
                  layer.open({
                      scrollbar: false,
                      move: false,
                      title:'温馨提示',
                      area:['440px'],
                      content:'<span class="lay_tips success"></span><span class="dialog_tips green">'+msg+'</span>',
                      btn:['确定'],
                      end:function(){
                        location.href=location.href;
                      }
                  });
                }else{
                  msg='您已提交加入拼球申请，只需要耐心等待管理员同意即可！';
                  layer.open({
                      scrollbar: false,
                      move: false,
                      title:'温馨提示',
                      time:'2000',
                      area:['440px','260px'],
                      content:'<span class="lay_tips success"></span><span class="dialog_tips green">'+msg+'</span>',
                      btn:['确定']
                  });
                }
              } else {
                var content = '<span class="lay_tips error"></span>'
                  + '<span class="dialog_tips">' + res.msg + '</span>';
                ballDetail.popMsg(content);
              }
            });
          });
        });
        // 退出拼球事件
        $('.fight_ball_handle').on('click', '.exit_fight', function() {
          $.get(App.baseUrl + '/city/fight/join/users', {
            fightId: ballDetail.fightId,
            status: 3,
            page: 1,
            row: 99
          }, function(res) {
            layer.confirm(template("join_list", res.data), {        // 确定退出拼球？
              btn: ['确认', '取消'],
              area:'440px',
              title:'退出拼球?您想把管理权转让给谁？'
            }, function(index, layero) {                            // 点击确认按钮回调
              var userId = $('.layui-layer-content .active').find('input').val() // 获取权限接受者id
              if (userId) {                                         // 判断当前是否选中权限移交者
                $.get(App.baseUrl + '/city/fight/transfer', {        // 调用退出拼球接口
                  fightId: ballDetail.fightId,
                  userId: userId
                }, function(res) {
                  ballDetail.getInitData(function() {             // 刷新页面
                    ballDetail.popMsg('<span class="lay_tips success"></span><span class="dialog_tips green">您已成功退出此拼球！</span>',function(){
                      location.href=location.href;
                    });
                    // ballDetail.popMsg("您已成功退出此拼球！");
                  });
                });
              }
            }, function(index) {                                    // 点击取消按钮回调
              layer.close(index);
            });
          });
        });
        // 列表全选按钮事件
        $('.handle_title_box').on("click", ".all_checked", function() {
          $(".judge_btn").removeAttr("disabled");                 // 全选事批量处理按钮可点击
          $(".player_list .check_btn img").removeClass("hide").next().attr("checked", "true").parents('li').addClass("active");
        });
        // 列表按钮单选事件
        $('.player_box').on("click", ".check_btn", function() {
          if ($(this).children('img').hasClass('hide')) {         //  判断当前点击checkBox背景图是否显示
            $(this).children('input').attr("checked", true).prev().removeClass('hide').parents("li").addClass("active");
          } else {
            $(this).children('input').removeAttr("checked").prev().addClass('hide').parents("li").removeClass("active");
          }
          if (ballDetail.getSelectUsers().length == 0) {          // 判断 同意，决绝，踢出批量按钮是否可以点击
            $(".handle_btn").children(".judge_btn").attr("disabled", "disabled");
          } else {
            $(".handle_btn").children(".judge_btn").removeAttr("disabled");
          }
        });
        // 重置按钮事件
        $(".handle_title_box").on('click', '.reset_btn', function() {
          $(".judge_btn").attr("disabled", "disabled");           // 重置事批量处理按钮不可点击
          $(".player_list .check_btn img").addClass('hide').next().removeAttr("checked").parents('li').removeClass("active");
        });
        // 已加入人员点击退出
        $('.player_box').on('click', '.exit_fight_btn', function() {
          var content = '<span class="lay_tips warn"></span><span class="dialog_tips">确定退出拼球?</span>';
          ballDetail.popModal("温馨提示", ["确定", "取消"], ['440px', '260px'], content, "", function() {
            $.post(App.baseUrl + '/city/fight/quit', {
              fightId: ballDetail.fightId
            }, function(res) {
              ballDetail.playerList = [];               // 清空数据刷新页面
              ballDetail.getInitData(function() {       // 刷新页面
                ballDetail.getPageData(3, function() {  // 刷新页面
                  // ballDetail.popMsg("您已退出拼球！");
                  ballDetail.popMsg('<span class="lay_tips success"></span><span class="dialog_tips green">您已成功退出此拼球！</span>');
                });
              });
            });
          });
        });
        // 批量处理按钮事件
        $(".handle_title_box").on('click', '.batch_btn', function() {
          var btns = $(".player_list").find(".handle_btn");
          $(".player_list li").removeClass("active");
          if ($(this).prev().hasClass('hide')) {
            btns.hide().next().show();
            $(this).text('退出编辑').prev().removeClass('hide');
          } else {
            btns.show().next().hide();
            $(this).text('批量管理').prev().addClass('hide');
            $(".player_list").find('.check_btn').find('img').addClass('hide').next().removeAttr("checked").parents("li").removeClass("active");
          }
        });
        // 同意
        $(".user_join_list").on('click', '.agree_btn', function() {
          var that = this,
            isAgreeSingle = $(this).attr('isSingle'),     // 判断是否为单个列表处理
            content = '<span class="lay_tips warn"></span><span class="dialog_tips">允许TA加入拼球?</span>';
          ballDetail.popModal("温馨提示", ["确定", "取消"], ['440px'], content, "", function() {
            var url = "",
              parameObj = {
                fightId: ballDetail.fightId,
                operateType: 1
              };
            if (isAgreeSingle == 'true') {
              url = '/city/fight/handle/user';                  // 同意单个接口
              parameObj.userId = $(that).parents('li').find('input').val();
            } else {
              url = '/city/fight/batch/handle/user';            // 批量同意接口
              parameObj.userIds = ballDetail.getSelectUsers();
            }
            ballDetail.handleUser(url, parameObj, function() { // 调用同意接口
              ballDetail.getInitData(function() {              // 刷新页面
                ballDetail.getPageData(2, function() {
                  ballDetail.popMsg('<span class="lay_tips success"></span><span class="dialog_tips green">已同意该用户加入！</span>')
                });
              });
            });
          });
        });
        // 拒绝
        $('.user_join_list').on('click', '.refused_btn', function() {
            var that = this,
              isRefuseSingle = $(this).attr('isSingle'),        // 判断是否为单个列表处理
              content = '<span class="lay_tips warn"></span><span class="dialog_tips">不让TA加入拼球?</span>';
            ballDetail.popModal("温馨提示", ["确定", "取消"], ['440px'], content, "", function() {
              var url = "",
                parameObj = {
                  fightId: ballDetail.fightId,
                  operateType: 2
                };
              if (isRefuseSingle == 'true') {
                url = '/city/fight/handle/user';
                parameObj.userId = $(that).parents('li').find('input').val();
              } else {
                url = '/city/fight/batch/handle/user';
                parameObj.userIds = ballDetail.getSelectUsers()
              }
              ballDetail.handleUser(url, parameObj, function() {    // 调用拒绝接口
                ballDetail.getInitData(function() {                 // 刷新页面
                  ballDetail.getPageData(2, function() {
                    ballDetail.popMsg('<span class="lay_tips success"></span><span class="dialog_tips green">已拒绝该用户加入！</span>');

                  });
                });
              });
            });
        });
        // 剔除已加入者
        $(".user_join_list").on('click', '.kickout_btn', function() {
          var isDeleteSingle = $(this).attr('isSingle'),
            content = '<span class="lay_tips warn"></span><span class="dialog_tips">确定把TA踢出拼球?</span>',
            that = this;
          ballDetail.popModal("温馨提示", ["确定", "取消"], ['440px', '260px'], content, "", function() {
            var url = "",
              parameObj = {
                fightId: ballDetail.fightId
              };
            if (isDeleteSingle == 'true') {
              url = '/city/fight/delete/user';                   // 踢出单个接口
              parameObj.userId = $(that).parents('li').find('input').val();
            } else {
              url = '/city/fight/batch/delete/user';             // 批量提出接口
              parameObj.userIds = ballDetail.getSelectUsers();
            }
            ballDetail.handleUser(url, parameObj, function() {  // 踢出加入者
              ballDetail.getInitData(function() {               // 刷新页面
                ballDetail.getPageData(3, function() {
                  ballDetail.popMsg('<span class="lay_tips success"></span><span class="dialog_tips green">已成功踢出该用户！</span>');
                });
              });
            });
          });
        });
        // 点击记载更多
        $(".player_box").on('click', '.view_more', function() {
          $.get(App.baseUrl + "/city/fight/join/users", {
            fightId: ballDetail.fightId,
            status: ballDetail.pageStatus,
            page: Math.ceil(ballDetail.playerList.length / ballDetail.row) + 1,
            rows: ballDetail.row
          }, function(res) {
            res.isManager = ballDetail.isManager;                                                     // 获取当前操作用户身份
            res.data.list = ballDetail.playerList = ballDetail.playerList.concat(res.data.list);      // 拼接列表数据
            ballDetail.pageStatus == 2 ? res.isJoinUser = 0 : res.isJoinUser = 1;                     // 当前用户为已加入还是待处理
            $(".player_box").html(template("athleteList", res));
            var isHandleBtnShow = $('.handle_title_box').find('.handle_btn').hasClass('hide'),        // 判断批量处理按钮是否显示
              checkBtn = $(".player_list").find(".check_btn");                                        // 获取列表点击的圆标
            isHandleBtnShow == true ? checkBtn.hide().prev().show() : checkBtn.show().prev().hide();  // 控制列表选中按钮显示
          });
        });
        ballDetail.modalChecked();                                                                    // 模态框checkbox添加点击事件
      }
    };
    $(function() {
      ballDetail.init();
      ballDetail.initButtonEvent();                                                                // 初始化权限按钮事件
      // setTimeout(function(){
      //   $('.user_join_list .handle_title_box .handle_title li').eq(0).trigger('click');
      // },500);
      
    });
  });
