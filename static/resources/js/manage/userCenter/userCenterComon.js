var personalComme={
	init:function(){
		$.commonTabs(".title_list","li",".videos_list","publishActive");
		$.commonTabs(".title_list","li",".infor_list","publishActive");	
		$.commonTabs(".title_list","li",".publish_list","publishActive");			
		//拖动图片
		$('.gbin1_list').sortable();

		//删除封面
		$(".del_cover").click(function(){
			$(this).parent().hide();
		});
		$('div[name="city"]').inputbox({
			height:24,
			width:110
		});
		//切换提示
		$(".lookProblems").click(function(){
			$(this).next().toggleClass("problems");
		});	

	},
    //组图预览轮播图
	slide:function(){
		var newSlide=$('.mygallery').clone();
		$('.preview_images_box .image_banner').prepend(newSlide);
		$(newSlide).addClass('mygallery_copy').show();
		var tn1=$(newSlide).tn3({
			imageClick:"fullscreen",
			image:{
			maxZoom:1.5,
			crop:true,
			clickEvent:"dblclick"
			},
			autoplay:false,
			mouseWheel:false,
			autohideControls:false,
			responsive:true
		});
	},	
	//弹窗
	alertBox:function(){
		$(".del_videos").click(function(){
			$(".del_alertbox").show();
		});
		$(".close_alertbox").click(function(){
			$(".del_alertbox").hide();
		})
		$(".recall_infor").click(function(){
			$(".recall_alertbox").show();
		});
		$(".close_alertbox").click(function(){
			$(".recall_alertbox").hide();
		});
		$(".del_infor").click(function(){
			$(".del_alertbox").show();
		});
		$(".close_alertbox").click(function(){
			$(".del_alertbox").hide();
		})
	 	$(".add_cover").click(function(){
			$(".cover_image").show();
		});
		$(".cover_container_close").click(function(){
			$(".cover_image").hide();
		});
		$(".cover_first span").click(function(){
			$(".coverImage").show();
		});
		$(".timingPubBtn").click(function(){
			$(".timing_publish").show();
		});
		$(".cover_container_close").click(function(){
			$(".timing_publish").hide();
		});
		$(".infor_preview").click(function(){
			$("body").css("overflow","hidden")
			$(".preview_infors").show();
		})
		$(".close_preview").click(function(){
			$("body").css("overflow","auto")
			$(".preview_infors").hide();
		})
		$(".images_preview").click(function(){
			$("body").css("overflow","hidden");
			$(".preview_images").show();

			personalComme.slide();
		})
		$(".close_images").click(function(){
			$(".mygallery_copy").remove();
			$(".preview_images").hide();
			$("body").css("overflow","auto");
		})

	  	$(".del_image").click(function(){
	  		$(this).parent().remove();
	  	});

		$(".video_box_select_span").click(function () {
		    $(".video_box_container_location").css({
		        display:"none"
		    });
		    $(".video_box_container_upload").css({
		        display:"block"
		    });
		    $(".video_box_upvideo").css({
		        display:"none"
		    });
		});
		$(".video_box_select_span").next().click(function () {
		    $(".video_box_container_location").css({
		        display:"block"
		    });
		    $(".video_box_container_upload").css({
		        display:"none"
		    });
		    $(".video_box_upvideo").css({
		        display:"none"
		    })
		});

		$(".video_box_up").click(function () {
		    $(".video_box_container_location").css({
		        display:"none"
		    });
		    $(".video_box_container_upload").css({
		        display:"none"
		    });
		    $(".video_box_upvideo").css({
		        display:"block"
		    })
		});
		$(".video_box_close").click(function () {
			$(".up_videos").hide();
		});

		$(".video_box_select span").on("click",function () {
		    $(".video_box_select span").css("color","#999");
		    $(this).css("color","#00bb90");
		}); 

		$(".add_grounpimage").click(function(){
			$(".ground_image").show();
		})
		$(".popup_pic_slect_span").click(
		    function () {
		        $(".popup_pic_push").css({
		            display:"block"
		        }).next().css({
		            display:"block"
		        })
		        $(".popup_pic_location").css({
		            display:"none"
		        })
		        $(this).css({
		            color:"#00bb90"
		        }).siblings().css({
		            color:"#999"
		        })
		    }
		).next().click(function () {
		    $(".popup_pic_push").css({
		        display:"none"
		    }).next().css({
		        display:"none"
		    })
		    $(".popup_pic_location").show();
		    $(this).css({
		        color:"#00bb90"
		    }).siblings().css({
		        color:"#999"
		    })
		});

		$(".popup_pic_close").click(function () {
		    $(".ground_image").hide();
		})

	},
    //定时发布
    time_publish:function(){
	 	$(".select_date").change(function(){
			$(".select_time option").attr("selected",false);
			$(".select_time option").eq(0).attr("selected",true);
			$(".select_minu option").attr("selected",false);		
			$(".select_minu option").eq(0).attr("selected",true);
			$(".selected_date").text($(".select_date option:selected").text());	
		})
		$(".select_time").change(function(){
			$(".selected_time").text($(".select_time option:selected").text());			
		})
		$(".select_minu").change(function(){
			$(".selected_minu").text($(".select_minu option:selected").text());			
		})   	
    }		
}

$(function(){
	personalComme.init();
	personalComme.alertBox();
	personalComme.time_publish();
})