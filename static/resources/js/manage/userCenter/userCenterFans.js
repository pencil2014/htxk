$(function(){
	$('.followClick').off('click').on('click',function(){
    	var url = $(this).attr("hhly-url");
    	var that = $(this);
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
    });
});