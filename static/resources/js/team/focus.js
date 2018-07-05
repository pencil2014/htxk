$(function(){
	//tab切换
	$(".foucs_title li").click(function(){
		$('.foucs_title li').children().removeClass("active");
		$(this).children().addClass("active");
		if($("#foucsT  ul").hide().eq($('.foucs_title li').index(this)).show().attr("hhly-has-page") == 'false'){
			$('.more_foucs').hide();
		}else{
			$('.more_foucs').show();
		}
	});
	
	//点击加载更多关注
	$(".more_foucs").click(function(){
		var index=0;
		$(".foucs_title").find("a").each(function(i){
			if($(this).hasClass("active")){
				index=i;
			}
		});
		var _this = $(this);
		var container=$(".foucs_list").eq(index);
		var url = container.attr("hhly-url");
		var page = container.attr("hhly-next-page");
		var rows = container.attr("hhly-page-size");
		$.getJSON(url,{"page":page,"rows":rows},function(data){
			var content = getFoucsContent(data);		
			if(!data.hasNextPage){
				$(_this).hide();
			}
			container.attr("hhly-next-page",data.page + 1).attr("hhly-page-size",data.rows).attr("hhly-has-page",data.hasNextPage).append(content);
			//关注，取消关注
			SportIPModule.focus();
		});	
	});
	//加载同城球队，推荐球队
	SportIPModule.loadData();
	$("span[hhly-index='sportIP']").trigger("click");
});
// 关注数据拼接
function getFoucsContent(data){
	var htmls="";
	for(var i=0;i<data.list.length;i++){
		var item=data.list[i];
		var _class = "";
		if((i+2)%7==0 || (i+1)%7==0){
			_class = "class='hide'";
		}
		
		if(stringUtil.isNull(item.headerUrl)){
			item.headerUrl = '/resources/images/default_photo.jpg';
		}	
		if(stringUtil.isNull(item.ipName)){
			item.ipName = '';
		}
		if(item.isFollow == false){				
			htmls+='<li '+_class+'>'+
						'<a href="/common/center?route='+item.ipType+'&id='+item.ipId+'" target="_blank" class="foucs_head">'+
							'<img src=" '+item.headerUrl+' " width="100%">'+
							'<span>'+item.ipName+'</span>'+							
						'</a>'+
						'<a href="javascript:;" class="foucs_mark" hhly-url="/collect/follow/add/' + item.ipId + '"><strong>+</strong> ' + msgUtil.getTxt('common_follow') + '</a>'+
					'</li>';
		}else{
			htmls+='<li '+_class+'>'+
						'<a href="/common/center?route='+item.ipType+'&id='+item.ipId+'" target="_blank" class="foucs_head">'+
							'<img src=" '+item.headerUrl+' " width="100%">'+
							'<span>'+item.ipName+'</span>'+							
						'</a>'+
						'<a href="javascript:;" class="foucs_mark star_focus" hhly-url="/collect/follow/del/' + item.ipId + '">' + msgUtil.getTxt('common_followed') + '</a>'+
					'</li>';
		}
	}
	htmls+='<div class="clearx"></div>';
	return htmls;
}
