$(".mit_content").on('click','.an_tip',function(){
	return false;
});

$(".mit_content").on('click','.an_position a',function () {
	var newDate = $(this).html();
    var oldDate = $(".an_schedule_selct i").html();
    $(".an_position").slideUp(50);
    if(newDate != oldDate){
    	$(".an_schedule_selct i").html(newDate);
    	getSchedule();
    }
    return false;
});
$('div[name="timeplantwo_select"]').inputbox({
    width:110,
    height:30
});
$(".alert_tite span,.alert_btn .btn_success,.alert_btn .btn").click(function () {
    $(this).parents("div").hide()
});
//日期选择监听
$(".an_schedule_selct a").on("click",function(){
    var teamId = $("#orgId").val();
    var dateTime = $(this).attr('val');
    //请求数据
    $.get("/team/schedule",{"teamId":teamId,"dateTime":dateTime},function(data){
        $(".mit_content").html(data);
    },"html");
});

var teamShow={
    //数据处理
    dataControl:function(tThat){
        // console.log(tThat)
        var dataHtml='',dataList=$(tThat).find('div.data_li');
        for(var i = 0;i<dataList.length;i++){
            if(dataList.length==1){
                $(".sd_select").empty();
            }else{
                $(".sd_select span").eq(0).addClass("oosp");
                $(".sd_select").append('<span class="span"></span>');
            }
            var matchtime = dateTimeUtil.timeByFormat($(dataList[i]).attr("hhly-matchTime"), 'yyyy-MM-dd');
            var begintime = $(dataList[i]).attr('hhly-beginTime');
            var endtime = $(dataList[i]).attr('hhly-endTime');
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
                    +'        <span>'+matchtime+'&nbsp;&nbsp;'+begintime+'-'+endtime+'</span>'
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
            $(".sd_select").html("");
            var dataHtml = '<div class="sd_match"><div class="sd_box" id="pubLaunch" date-time="'+time+'">+</div><p>我要发起约战！</p></div>';
            $(".scBox").html(dataHtml);
          }else{
            $(".sd_select").html('');
            var teamHtml=teamShow.dataControl(tThat);
            $(".scBox").html(teamHtml).find('.cBox').eq(0).show();
        }
    },
    // 点击切换
    dataClick:function(){
        $(".schedule_left_buttom").on("click", 'li:not([class=schedule_li])', function() {
            var tIndex, html = "",
                tLen = $(this).find("div.data_li").length,
                tThat = $(this),
                tTime = $(this).attr("date-time");
            $(".schedule_right .scBox").html("");
            $(this).parents('.schedule_left_buttom').find('li').removeClass('bg');
            $(this).addClass("bg");
            teamShow.next(tLen, html, tThat, tTime);
        }).hover(function() {
            $(this).addClass('bg');
        }, function() {
            $(this).removeClass('bg');
        });
    },
    init:function(){
        teamShow.dataClick();
        $(".schedule_left_buttom li").not($(".schedule_li")).eq($(".schedule_left_buttom").attr("date-time-day") - 1).trigger('click');
    }
};
(function () {
    teamShow.init();
})();
