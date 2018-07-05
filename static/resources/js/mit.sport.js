var mitSport={
	// 获得数据
	jIndex:0,
	judgePrev:false,
	judgeMenu:false,
	getData:function(url,container,callback){
		$.getJSON(url, function(json) {
			var content = mitSport.loadData(json);
			if(typeof (callback)=='function'){
				callback(container);
			}
			if(json.page<1){
				container.siblings('.prev_slide').addClass('hidden');
				container.siblings('.prev_slide').addClass('hidden');
			}else{
				container.siblings('.prev_slide').attr({ 'data-has-page': json.page > 1 ? 'true' : 'false', 'data-pre-page': json.page - 1 });
				container.siblings('.next_slide').attr({ 'data-has-page': json.hasNextPage, 'data-next-page': json.page + 1 });
			}
			container.find('ul').append(content);
			if(mitSport.judgePrev){
				container.find('ul').prepend(container.find('ul li').last());
				container.find('ul').prepend(container.find('ul li').last());
			}
			if(mitSport.judgeMenu){
				container.find('ul').prepend(container.find('ul li').last());
			}
		});
	},
	// 拼接数据
	loadData:function(data){
		var list = data["list"];// 数据列表
		var content = "";
		if (list && list.length > 0) {
			var close = false;
			for (var k = 0; k < list.length; k++) {
				var item = list[k];
				var radom=parseInt(Math.random()*100);
				if (k % 12 == 0) {
					content += "<li><div class='mit_pcontent'><dl>";
				}

				content += "<dd class='mit_cinfor'><div class='border_box'>"
						+ "<div class='img_box'><img src='"
						+ item.grassUrl
						+ "' width='100%'></div></div>"
						+ "<div class='content_title'><span><em class='text'>"
						+ item.grassName
						+ "</em><span class='text_icon sport_vip'></span></span></div>"
						+ "<div class='content_club'><span style='font-size: 0;'><em class='club_icon_box'><span class='club_icon engineer_icon'>&nbsp;</span>&nbsp;</em><span class='club_text'>"
						+ item.grassLabel + "</span></span>" + "</div></dd>";
				if ((k + 1) % 12 == 0) {
					content += "</dl></div></li>";
					close = true;
				}
			}
			if (!close) {
				content += "</dl></div></li>";
			}
		}
		return content;
	},
	sportManEvent:function(){
		// 轮播绑定
		var sliderball=$(".mit_slider").sportTable({width:'100%',height:410,control:'.mit_slidebtn',during:4000,speed:800,callback:mitSport.ballData});
		var sliderPerson=$(".mit_personslider").sportTable({width:'100%', height:410, control:'.mit_slidebtn', during:4000, speed:800,callback:mitSport.ballData });
		var sliderOrg=$(".mit_organizationslider").sportTable({width:'100%', height:410, control:'.mit_slidebtn', during:4000, speed:800,callback:mitSport.ballData });
		// 宽度变化重置绑定
		$(window).resize(function(event) {
            var boxWidth=$(window).width();
            var setWidth="";
            if(boxWidth<1200){
                setWidth=900;
            }else{
                setWidth=1092;
            }
            sliderball.dataInt(setWidth);
            sliderPerson.dataInt(setWidth);
            sliderOrg.dataInt(setWidth);
        });
        //
	},
	ballData:function(offset,obj){
		var page,container;
		if(obj.hasClass('next_slide')){
			mitSport.jIndex=mitSport.jIndex+1;
			page=obj.attr('data-next-page');
		}else if(obj.hasClass('prev_slide')){
			mitSport.jIndex=mitSport.jIndex-1;
			page=obj.attr('data-pre-page');
		}
		//往后翻页
		var judgeIndex=5;
		mitSport.prevControl();
		if(mitSport.jIndex === judgeIndex && $(obj).attr("data-has-page") === 'true'){
			mitSport.judgePrev=false;
			var url=obj.parents('.mit_box').siblings('.mit_title').find('.players_table li.active').attr('url') + "?page="+page+"&_t=" + new Date().getTime();
			container=obj.siblings('.slider_box');
			mitSport.getData(url,container,mitSport.deleteData);
			mitSport.jIndex=0;
		}
		//往前翻页

		if(mitSport.jIndex === -1 && $(obj).attr("data-has-page") === 'true'){
			mitSport.judgePrev=true;
			url=obj.parents('.mit_box').siblings('.mit_title').find('.players_table li.active').attr('url') + "?page="+page+"&_t=" + new Date().getTime();
			container=obj.siblings('.slider_box');
			mitSport.getData(url,container,mitSport.deleteData);
			mitSport.jIndex=4;
		}
	},
	// 删除旧数据
	deleteData:function(container){
		var nowLi=container.find('ul li').eq(mitSport.jIndex).clone();
		if(mitSport.judgePrev){
			nowLi=container.find('ul li').eq(mitSport.jIndex-2).clone();
		}
		container.find('ul li').remove();
		if(!mitSport.judgeMenu){
			container.find('ul').append(nowLi);
			mitSport.judgeMenu=false;
		}
	},
	// 顶层按钮获取数据
	menuDataload:function(){
		$(".players_table").off('click').on("click",'li',function() {
			mitSport.judgeMenu=true;
			var url = $(this).attr("url") + "?_t=" + new Date().getTime();
			var container = $(this).parents('.mit_title').siblings('.mit_box').find('.slider_box');
			$(this).addClass("active").siblings().removeClass("active");
			mitSport.getData(url,container,mitSport.deleteData);
			mitSport.jIndex=0;
		});
	},
	prevControl:function(){
		// 隐藏上一页按钮
		/*$('.mit_box .mit_slidebtn').each(function(index, el) {
			var prevPage=$(this).attr('pre_page_no')||1;
			if(prevPage==0 && mitSport.jIndex==0){
				$(this).addClass('hidden');
			}else{
				$(this).removeClass('hidden');
			}
		});*/
		$('.mit_box .mit_slidebtn').each(function(){
			var judgePage=$(this).attr('data-has-page');
			if(judgePage=='false'&&mitSport.jIndex==0){
				$(this).addClass('hidden');
			}else{
				$(this).removeClass('hidden');
			}
		});
	},
	init:function(){
		this.sportManEvent();
		this.menuDataload();
		mitSport.prevControl();
	}
};
$(function(){
	mitSport.init();

});
