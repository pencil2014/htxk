var manageSched = {
    scheduleSelect:function () {
        $('div[name="timeplantwo_select"]').inputbox({
            width:110,
            height:24
        });
    },
    gest:function () {
        var e=arguments.callee.caller.arguments[0]||event;
        if (e && e.stopPropagation) {
            e.stopPropagation();
        } else if (window.event) {
            window.event.cancelBubble = true;
        }
    },
    //点击任意地方
    allClick:function () {
        $(document).on("click",function () {
            $(".an_position").slideUp(50)
        });
    },
    lTab:function(){
        //右侧切换
        $(".sd_select").on("click","span",function(){
            var tIndex = $(this).index();
                $(".cBox").hide().eq(tIndex).show();
                // $(".sd_select span").removeClass("oosp");
                $(this).addClass("oosp").siblings('span').removeClass('oosp');
        });
    },
    //数据处理
    dataControl:function(tThat){
        var dataHtml='',dataList=$(tThat).find('div.data_li');
        for(var i = 0;i<dataList.length;i++){
            if(dataList.length==1){
                $(".sd_select").empty();
            }else{
                $(".sd_select span").eq(0).addClass("oosp");
                $(".sd_select").append('<span class="span"></span>');
            }
            homeIcon=$(dataList[i]).attr('hhly-homeTeamIconUrl')||'/resources/images/default_team_logo.png';
            guestIcon=$(dataList[i]).attr('hhly-guestTeamIconUrl')||'/resources/images/default_team_logo.png';
            dataHtml += '<div class="cBox">'
                    +'<div class="schedule_right_top">'
                    +'    <dl>'
                    +'        <dt>'
                    +'            <img width="100%" src="'+homeIcon +'"></dt>'
                    +'        <dd>'
                    +'            <p>'+$(dataList[i]).attr('hhly-homeTeamName')+'</p>'
                    +'            <span>[主队]</span>'
                    +'        </dd>'
                    +'    </dl>'
                    +'    <div class="schedule_right_vs">'
                    +'        <p>vs</p>'
                    +'        <span>'+$(dataList[i]).attr("hhly-matchTypeName")+'</span>'
                    +'    </div>'
                    +'    <dl class="schedule_dl">'
                    +'        <dt>'
                    +'            <img width="100%" src='+guestIcon+'></dt>'
                    +'        <dd>'
                    +'            <p>'+$(dataList[i]).attr("hhly-guestTeamName")+'</p>'
                    +'            <span></span>'
                    +'        </dd>'
                    +'    </dl>'
                    +'</div>'
                    +'<div class="schedule_right_mid">'
                    +'    <p class="tipt">'
                    +'        时间 :'
                    +'        <span>'+$(dataList[i]).attr("hhly-matchTime")+'</span>'
                    +'    </p>'
                    +'    <p class="tipth">'
                    +'        球场 :'
                    +'        <span>'+$(dataList[i]).attr("hhly-fieldName")+'</span>'
                    +'    </p>'
                    +'    <p class="tipf">'
                    +'        赛制 :'
                    +'        <span>'+$(dataList[i]).attr("hhly-formatName")+'</span>'
                    +'    </p>'
                    +'</div>'
                    +'<div class="schedule_right_bottom">'
                    +'    <p>比赛说明 :</p>'
                    +'    <span>'+$(dataList[i]).attr("hhly-remark")+'</span>'
                    +'</div>'
                    +'</div>';
        }
        return dataHtml;
    },
    next:function(tLen,tHtml,tThat,time){
        //模板
         if(tLen === 0){
            var judgeControl=$('.schedule_left_buttom').attr('hhly-has-permission');
            $(".sd_select").html("");
            if(parseInt(judgeControl)==0){
                dataHtml = '<div class="sd_match"></div>';
            }else if(parseInt(judgeControl)==1){
                dataHtml = '<div class="sd_match"><div class="sd_box" id="pubLaunch" date-time="'+time+'">+</div><p>我要发起约战！</p></div>';
            }
            $(".scBox").html(dataHtml);
          }else{
            $(".sd_select").html('');
            var teamHtml=manageSched.dataControl(tThat);
            $(".scBox").html(teamHtml).find('.cBox').eq(0).show();
        }
    },
    // 按钮点击切换
    dClcik:function () {
        //点击日期
        $(".schedule_left_buttom").on("click",'li:not([class=schedule_li])',function(){
            var tIndex,html = "",tLen = $(this).find("div.data_li").length,tThat = $(this),tTime = $(this).attr("date-time");
            $(".schedule_right .scBox").html("");
            $(this).parents('.schedule_left_buttom').find('li').removeClass('bg');
            $(this).addClass("bg");
            manageSched.next(tLen,html,tThat,tTime);
        }).hover(function(){
            $(this).addClass('bg');
        },function(){
            $(this).removeClass('bg');
        });
    },
    //发起约战
    startMatch:function(){
        $(".scBox").on("click","#pubLaunch",function(){
            var teamId = $("#orgId").val();
            var dateTime = $(this).attr("date-time");
            $.get("/team/manage/launch",{"teamId":teamId,"dateTime":dateTime},function(data){
                $("#manage_contents").html(data);
            },"html");
        });
    },
    // 比赛数据拼接
    matchGetData:function(that,type){
        var status='';
        if(type===1){
            status='<div class="team_center_vs">'
                +'    <p class="op">vs</p>'
                +'    <p class="trp">未开始</p>'
                +'</div>';
        }else if(type===2){
            status='<div class="team_center_vs">'
                +'        <p class="op">vs</p>'
                +'        <p class="trp">约战中</p>'
                +'   </div>';
        }
        homeIcon=that.attr('hhly-homeTeamIconUrl')||'/resources/images/default_team_logo.png';
        guestIcon=that.attr('hhly-guestTeamIconUrl')||'/resources/images/default_team_logo.png';
         var setHtml='<div class="match_dialog">'
                +'    <div class="team_box">'
                +'        <div class="team_left">'
                +'            <span class="team_logo"><img width="100%" src="'+homeIcon+'"></span>'
                +'            <span class="team_text">' + that.attr('hhly-homeTeamName') + '</span>'
                +'        </div>'
                +status
                +'        <div class="match_right">'
                +'             <span class="team_logo"><img width="100%" src="'+guestIcon+'"></span>'
                +'            <span class="team_text">'+ that.attr('hhly-guestTeamName') + '</span>'
                +'        </div>'
                +'        <div class="match_item">'
                +'            <label class="match_label fl">比赛时间:</label>'
                +'            <div class="match_item_box">'
                +'                <span class="date fl">'+ that.attr('hhly-matchDate') +'</span>'
                +'                <div class="launch_timer_box">'
                +'                    <div class="start_time fl">'
                +'                    </div>'
                +'                    <div class="end_time fl">'
                +'                    </div>'
                +'                </div>'
                +'            </div>'
                +'        </div>'
                +'        <div class="clear"></div>'
                +'        <div class="match_item">'
                +'            <label class="match_label fl">比赛场地:</label>'
                +'            <div class="match_item_box">'
                +'                <input type="text" id="match_place" class="alert_place" value="'+ that.attr('hhly-fieldName') +'">'
                +'                <input type="hidden" id="match_date" value="'+ that.attr('hhly-matchDate') +'">'
                +'                <input type="hidden" id="match_id" value="' + that.attr('hhly-matchId') +'">'
                +'            </div>'
                +'        </div>'
                +'    </div>'
                +'</div>';
                return setHtml;
    },
    // 取消比赛、取消约战数据拼接
    cancelGetData:function(that,type){
        var status='';
        if(type===1){
            status='<div class="team_center_vs">'
                +'    <p class="op">vs</p>'
                +'    <p class="trp">未开始</p>'
                +'</div>';
        }else if(type===2){
            status='<div class="team_center_vs">'
                +'        <p class="op">vs</p>'
                +'        <p class="trp">约战中</p>'
                +'   </div>';
        }
        homeIcon=that.attr('hhly-homeTeamIconUrl')||'/resources/images/default_team_logo.png';
        guestIcon=that.attr('hhly-guestTeamIconUrl')||'/resources/images/default_team_logo.png';
        var html='<div class="match_dialog">'
                +'    <div class="team_box">'
                +'        <div class="team_left">'

                +'            <span class="team_logo"><img width="100%" src="'+homeIcon +'"></span>'
                +'            <span class="team_text">' + that.attr('hhly-homeTeamName') + '</span>'
                +'        </div>'
                +status
                +'        <div class="match_right">'
                +'             <span class="team_logo"><img width="100%" src="'+guestIcon + '"></span>'
                +'            <span class="team_text">'+ that.attr('hhly-guestTeamName') + '</span>'
                +'        </div>'
                +'        <div class="match_item">'
                +'            <label class="match_label fl">比赛时间:</label>'
                +'            <div class="match_item_box">'
                +'                <span class="date fl">' + that.attr('hhly-matchDate') + " " + that.attr('hhly-matchTime') +'</span>'
                +'            </div>'
                +'        </div>'
                +'        <div class="clear"></div>'
                +'        <div class="match_item">'
                +'            <label class="match_label fl">比赛场地:</label>'
                +'            <div class="match_item_box">' + that.attr('hhly-fieldName') +'</div>'
                +'        </div>'
                +'    </div>'
                +'</div>';
                return html;
    },
    // 更新比赛
    updateMatch:function(){
        $(".update_match").click(function(){
            var that = $(this).next("div");
            var beginTime=$(that).attr('hhly-begintime').split(':');
            var endTime=$(that).attr('hhly-endtime').split(':');
            var html=manageSched.matchGetData(that,1);
                layer.open({
                    scrollbar: false,
                    move: false,
                    title: '修改比赛',
                    area:['600px','420px'],
                    content: html,
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {
                        manageSched.alterSubmit(that);
                        layer.close(index);
                    },
                    success: function(layero, index){
                        var timeDate=new Date();
                        var newTime=[];
                        newTime.push(timeDate.getFullYear());
                        newTime.push(timeDate.getMonth()+1);
                        newTime.push(timeDate.getDate());
                        var timeHour=timeDate.getHours();
                        var timeMinute=timeDate.getMinutes();
                        $.hhly.timer({wrap:'.launch_timer_box .start_time',hours:beginTime[0],minute:beginTime[1],syncData:function(value,max,that){
                            var selectDate=$('.compete_time div.selected').text().split('-');
                            var oldVal='';
                            var copyValue=value;
                            if(max==23){
                                if(value==23){
                                    $('.launch_timer_box .start_time').find('input.defined_minute').attr('hhly-max','30');
                                    $('.launch_timer_box .start_time').find('input.defined_minute').trigger('blur');
                                }else{
                                    $('.launch_timer_box .start_time').find('input.defined_minute').attr('hhly-max','59');
                                }
                                oldVal=$('.launch_timer_box .end_time').find('.timer_box .defined_hours').val();
                                if(oldVal>value){
                                    value=oldVal;
                                }
                                $('.launch_timer_box .end_time').find('input.defined_hours').val(value);
                            }else if(max>23){
                                oldVal=$('.launch_timer_box .end_time').find('.timer_box .defined_minute').val();
                                oldHourVal=$('.launch_timer_box .end_time').find('.timer_box .defined_hours').val();
                                oldBeginVal=$('.launch_timer_box .start_time').find('.timer_box .defined_hours').val();
                                if(oldBeginVal==oldHourVal){
                                    if(oldVal>value){
                                        value=oldVal;
                                    }
                                    $('.launch_timer_box .end_time').find('.defined_minute').val(value);
                                }
                            }
                            if(newTime[0]==selectDate[0] && newTime[1]==selectDate[1] && newTime[2]==selectDate[2]){
                                if( max==23 && copyValue<=timeHour){
                                    copyValue=timeHour;
                                    $('.launch_timer_box .start_time').find('input.defined_hours').val(copyValue);
                                }
                                if(max>23 && copyValue<=timeMinute){
                                    copyValue=timeMinute;
                                    $('.launch_timer_box .start_time').find('.defined_minute').val(copyValue);
                                }
                            }
                        }});
                        $.hhly.timer({
                            wrap:'.launch_timer_box .end_time',
                            hours:endTime[0],
                            minute:endTime[1],
                            syncData:function(value,max,that){
                                var oldVal='';
                                if(max==23){
                                    oldVal=$('.launch_timer_box .start_time').find('.timer_box .defined_hours').val();
                                    var oldMin=$('.launch_timer_box .start_time').find('.timer_box .defined_minute').val();
                                    var endMin=$('.launch_timer_box .end_time').find('.timer_box .defined_minute').val();
                                        if(oldVal==value && parseInt(oldMin)>=parseInt(endMin)){
                                            value=oldVal;
                                            endMin=oldMin;
                                        }
                                        $('.launch_timer_box .end_time').find('.timer_box .defined_hours').val(value);
                                        $('.launch_timer_box .end_time').find('.timer_box .defined_minute').val(endMin);
                                }
                            },
                            blur:function(value,max,that){
                                var oldVal='';
                                if(max==23){
                                    oldVal=$('.launch_timer_box .start_time').find('.timer_box .defined_hours').val();
                                    oldValArr=[oldVal.toString().slice(0,1),oldVal.toString().slice(-1)];
                                    valArr=[value.toString().slice(0,1),value.toString().slice(-1)];
                                    if(valArr[0]<oldValArr[0]){
                                        value=oldVal;
                                    }else if(valArr[0]==oldValArr[0] && valArr[1]<oldValArr[1]){
                                        value=oldVal;
                                    }
                                    $('.launch_timer_box .end_time').find('.timer_box .defined_hours').val(value);
                                }else if(max>23){
                                    oldVal=$('.launch_timer_box .start_time').find('.timer_box .defined_minute').val();
                                    oldHourVal=$('.launch_timer_box .end_time').find('.timer_box .defined_hours').val();
                                    oldBeginVal=$('.launch_timer_box .start_time').find('.timer_box .defined_hours').val();
                                    if(oldBeginVal==oldHourVal){
                                        oldValArr=[oldVal.toString().slice(0,1),oldVal.toString().slice(-1)];
                                        valArr=[value.toString().slice(0,1),value.toString().slice(-1)];
                                        if(valArr[0]>oldValArr[0]){
                                            value=oldVal;
                                        }else if(valArr[0]==oldValArr[0] && valArr[1]<oldValArr[1]){
                                            value=oldVal;
                                        }
                                        $('.launch_timer_box .end_time').find('.timer_box .defined_minute').val(value);
                                    }
                                }
                            }
                        });
                    }
                });
        });
    },
    // 修改比赛提交
    alterSubmit:function(that){
        var matchId = $("#match_id").val();
        var matchDate = $("#match_date").val();
        var beginTime =$('.launch_timer_box').find('.start_time').find('.defined_hours').val()+':'+$('.launch_timer_box').find('.start_time').find('.defined_minute').val();
        var endTime =$('.launch_timer_box').find('.end_time').find('.defined_hours').val()+':'+$('.launch_timer_box').find('.end_time').find('.defined_minute').val();
        var matchPlace = $("#match_place").val();
        var matchDateTime = matchDate ;
        var params = {"matchId":matchId,"matchDateTime":matchDateTime,"matchPlace":matchPlace,'beginTime':beginTime,'endTime':endTime}
        //ajax提交数据
        $.hhly.ajax({
            "url":"/team/manage/match/update",
            "data":params,
            "success":function(data){
                //更新相应的字段
                that.attr("hhly-begintime", beginTime);
                that.attr("hhly-endtime", endTime);
                that.attr("hhly-fieldName",matchPlace);
                that.parent().siblings(".content_boxo").text(matchDateTime+' '+beginTime);
                that.parent().siblings(".content_boxe").children().last().text("球场：" + matchPlace);
            }
        });
    },
    // 取消约战
    cancelLaunch:function(){
        $('.cancel_launch').click(function(){
            var that = $(this).next().next("div");
            layer.open({
                crollbar: false,
                move: false,
                area: ['440px'],
                title: '温馨提示',
                content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">您确认要取消比赛？</span></div>',
                btn: ['是','否'],
                yes: function(index, layero) {
                    // commonPublish.draftSave(layero);
                    var launchId = that.attr("hhly-matchId");
                    var params = {
                            "launchId": launchId
                        }
                    //ajax提交数据
                    $.hhly.ajax({
                        "url": "/team/manage/launch/del",
                        "data": params,
                        "success": function(data) {
                            that.parents('.sf_content').remove();
                        }
                    });
                    layer.close(index);
                }
            });
        });
    },
    // 取消比赛
    cancelMatch:function(){
        $('.cancel_match').click(function(){
        var that = $(this).next().next("div");
            layer.open({
                crollbar: false,
                move: false,
                area: ['440px'],
                title: '温馨提示',
                content: '<div class="dialog_tip_box text"><span class="at_span warn"></span><span class="dialog_tips">您确认要取消约战？</span></div>',
                btn: ['是','否'],
                yes: function(index, layero) {
                    var matchId = that.attr("hhly-matchId");
                    var params = {
                            "matchId": matchId
                        }
                    //ajax提交数据
                    $.hhly.ajax({
                        "url": "/team/manage/match/del",
                        "data": params,
                        "success": function(data) {
                            that.parents('.sf_content').remove();
                        }
                    });
                    layer.close(index);
                }
            });
        });
    },
    //约战修改
    alterLaunch:function(){
        $(".update_launch").click(function() {
            var that = $(this).next("div");
            var beginTime=$(that).attr('hhly-begintime').split(':');
            var endTime=$(that).attr('hhly-endtime').split(':');
            var html=manageSched.matchGetData(that,2);
            layer.open({
                scrollbar: false,
                move: false,
                title: '约战',
                area:['600px','420px'],
                content: html,
                btn: ['确定', '取消'],
                yes: function(index, layero) {
                    manageSched.launchSubmit(that);
                    layer.close(index);
                },
                success: function(layero, index){
                    var timeDate=new Date();
                    var newTime=[];
                    newTime.push(timeDate.getFullYear());
                    newTime.push(timeDate.getMonth()+1);
                    newTime.push(timeDate.getDate());
                    var timeHour=timeDate.getHours();
                    var timeMinute=timeDate.getMinutes();
                    $.hhly.timer({wrap:'.launch_timer_box .start_time',hours:beginTime[0],minute:beginTime[1],syncData:function(value,max,that){
                        var selectDate=$('.compete_time div.selected').text().split('-');
                        var oldVal='';
                        var copyValue=value;
                        if(max==23){
                            if(value==23){
                                $('.launch_timer_box .start_time').find('input.defined_minute').attr('hhly-max','30');
                                $('.launch_timer_box .start_time').find('input.defined_minute').trigger('blur');
                            }else{
                                $('.launch_timer_box .start_time').find('input.defined_minute').attr('hhly-max','59');
                            }
                            oldVal=$('.launch_timer_box .end_time').find('.timer_box .defined_hours').val();
                            if(oldVal>value){
                                value=oldVal;
                            }
                            $('.launch_timer_box .end_time').find('input.defined_hours').val(value);
                        }else if(max>23){
                            oldVal=$('.launch_timer_box .end_time').find('.timer_box .defined_minute').val();
                            oldHourVal=$('.launch_timer_box .end_time').find('.timer_box .defined_hours').val();
                            oldBeginVal=$('.launch_timer_box .start_time').find('.timer_box .defined_hours').val();
                            if(oldBeginVal==oldHourVal){
                                if(oldVal>value){
                                    value=oldVal;
                                }
                                $('.launch_timer_box .end_time').find('.defined_minute').val(value);
                            }
                        }
                        if(newTime[0]==selectDate[0] && newTime[1]==selectDate[1] && newTime[2]==selectDate[2]){
                            if( max==23 && copyValue<=timeHour){
                                copyValue=timeHour;
                                $('.launch_timer_box .start_time').find('input.defined_hours').val(copyValue);
                            }
                            if(max>23 && copyValue<=timeMinute){
                                copyValue=timeMinute;
                                $('.launch_timer_box .start_time').find('.defined_minute').val(copyValue);
                            }
                        }
                    }});
                    $.hhly.timer({
                        wrap:'.launch_timer_box .end_time',
                        hours:endTime[0],minute:endTime[1],
                        syncData:function(value,max,that){
                            var oldVal='';
                            if(max==23){
                                oldVal=$('.launch_timer_box .start_time').find('.timer_box .defined_hours').val();
                                var oldMin=$('.launch_timer_box .start_time').find('.timer_box .defined_minute').val();
                                var endMin=$('.launch_timer_box .end_time').find('.timer_box .defined_minute').val();
                                    if(oldVal==value && parseInt(oldMin)>=parseInt(endMin)){
                                        value=oldVal;
                                        endMin=oldMin;
                                    }
                                    $('.launch_timer_box .end_time').find('.timer_box .defined_hours').val(value);
                                    $('.launch_timer_box .end_time').find('.timer_box .defined_minute').val(endMin);
                            }
                        },
                        blur:function(value,max,that){
                            var oldVal='';
                            if(max==23){
                                oldVal=$('.launch_timer_box .start_time').find('.timer_box .defined_hours').val();
                                oldValArr=[oldVal.toString().slice(0,1),oldVal.toString().slice(-1)];
                                valArr=[value.toString().slice(0,1),value.toString().slice(-1)];
                                if(valArr[0]<oldValArr[0]){
                                    value=oldVal;
                                }else if(valArr[0]==oldValArr[0] && valArr[1]<oldValArr[1]){
                                    value=oldVal;
                                }
                                $('.launch_timer_box .end_time').find('.timer_box .defined_hours').val(value);
                            }else if(max>23){
                                oldVal=$('.launch_timer_box .start_time').find('.timer_box .defined_minute').val();
                                oldHourVal=$('.launch_timer_box .end_time').find('.timer_box .defined_hours').val();
                                oldBeginVal=$('.launch_timer_box .start_time').find('.timer_box .defined_hours').val();
                                if(oldBeginVal==oldHourVal){
                                    oldValArr=[oldVal.toString().slice(0,1),oldVal.toString().slice(-1)];
                                    valArr=[value.toString().slice(0,1),value.toString().slice(-1)];
                                    if(valArr[0]>oldValArr[0]){
                                        value=oldVal;
                                    }else if(valArr[0]==oldValArr[0] && valArr[1]<oldValArr[1]){
                                        value=oldVal;
                                    }
                                    $('.launch_timer_box .end_time').find('.timer_box .defined_minute').val(value);
                                }
                            }
                        }
                    });
                }
            });
        });
    },
    // 约战数据提交
    launchSubmit:function(that){
        var matchId = $("#match_id").val();
        var matchDate = $("#match_date").val();
        var beginTime =$('.launch_timer_box').find('.start_time').find('.defined_hours').val()+':'+$('.launch_timer_box').find('.start_time').find('.defined_minute').val();
        var endTime =$('.launch_timer_box').find('.end_time').find('.defined_hours').val()+':'+$('.launch_timer_box').find('.end_time').find('.defined_minute').val();
        var matchPlace = $("#match_place").val();
        var matchDateTime = matchDate;
        var params = {
            "launchId": matchId,
            "launchDateTime": matchDateTime,
            "launchPlace": matchPlace,
            'beginTime':beginTime,
            'endTime':endTime
        };
        //ajax提交数据
        $.hhly.ajax({
            "url": "/team/manage/launch/update",
            "data": params,
            "success": function(data) {
                //更新相应的字段
                that.attr("hhly-begintime", beginTime);
                that.attr("hhly-endtime", endTime);
                that.attr("hhly-fieldName", matchPlace);
                that.parent().siblings(".content_boxo").text(matchDateTime+' '+beginTime);
                that.parent().siblings(".content_boxe").children().last().text("球场：" + matchPlace);
            }
        });
    },
    // 日期选择监听
    dateSelect:function(){
        $(".an_schedule_selct a").on("click",function(){
            var teamId = $("#orgId").val();
            var dateTime = $(this).attr('val');
            //请求数据
            $.get("/team/manage/schedule",{"teamId":teamId,"dateTime":dateTime},function(data){
                $("#manage_contents").html(data);
            },"html");
        });
    },
    init:function () {
        this.dateSelect();
        this.scheduleSelect();
        this.allClick();
        this.dClcik();
        $(".schedule_left_buttom li:not([class=schedule_li])").eq($(".schedule_left_buttom").attr("date-time-day") - 1).trigger('click');
        this.lTab();
        this.startMatch();
        this.updateMatch();
        this.cancelLaunch();
        this.cancelMatch();
        this.alterLaunch();
    }
};
(function () {
    manageSched.init();
})();