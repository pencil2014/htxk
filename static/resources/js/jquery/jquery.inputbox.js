(function(f){var c={};var a={init:function(g){var m=c[f(g)[0].getAttribute("name")];var n=f(g),p=n.attr("name"),q=n.find(".opts > a.selected").attr("val")?n.find(".opts > a.selected").attr("val"):n.find(".opts > a:first").attr("val"),l=n.find(".opts > a.selected").html()?n.find(".opts > a.selected").html():n.find(".opts > a:first").html();n.addClass("sb");n.append(f('<div class="sb_icon arrow" />')).append(f('<input type="text" style="position:absolute;left:-10000px;" name="'+p+'" value="'+q+'">'));f('<div class="selected">'+l+"</div>").insertBefore(n.children(":first"));n.children(".opts").show();var r=n.children(".opts").width();if(r==0){var s=[];var j=0;n.children(".opts").children("a").each(function(){s.push(f(this).width())});for(var k=0;k<s.length;k++){if(s[k]>j){j=s[k]}}r=j+10}n.children(".opts").hide();n.children(".opts").css("width",(r+15));var h=(m.width!="auto")?m.width:n.children(".opts").width();n.css({"width":h,"height":m.height}).find("div.selected").css({"height":m.height,"line-height":m.height+"px"});n.find(".sb_icon").css({"top":(n.height()-n.find(".sb_icon").height())/2});n.off("click.input").on("click.input",a.toggle);n.off("click.input",".opts > a").on("click.input",".opts > a",a.select);n.find(".opts").off("mouseenter mouseleave").on("mouseenter",a.mouseenter).on("mouseleave",a.mouseleave);f(document).off("click.input").on("click.input",a.hide)},toggle:function(i){i.stopPropagation();var h=f(this);var g=h.children(".opts");h.find("a.selected").removeClass("none");a.hide(null,f(".sb").not(h));h.toggleClass("sb_active");g.css({"width":h.width(),"top":h.height(),"left":-parseInt(h.css("border-left-width"))}).toggle(h.hasClass("sb_active"))},hide:function(h,i){var g=i?i:f(".sb");g.removeClass("sb_active").children(".opts").hide().find("a.selected").removeClass("none")},select:function(i){i.stopPropagation();var g=f(this).parents(".sb:first");var h=c[g[0].getAttribute("name")];g.trigger("click.input");g.find("a.selected").removeClass("selected").addClass("old_select").siblings().removeClass("old_select");f(this).addClass("selected");var j=g.find("input");j.attr("data-value",j.val());g.find("div.selected").html(f(this).html());j.val(f(this).attr("val"));if(j.val()==-1){f(this).parents(".sb").siblings(".province_error").children().css("display","block");f(this).parents(".sb").find(".error").css("display","block")}else{f(this).parents(".sb").siblings(".province_error").children().css("display","none");f(this).parents(".sb").find(".error").css("display","none")}if(typeof(h.callback)==="function"){h.callback(this)}},mouseenter:function(h){h.stopPropagation();var g=f(this);g.find("a.selected").addClass("none")},mouseleave:function(h){h.stopPropagation();var g=f(this);g.find("a.selected").removeClass("none")}};var e={judgecontrol:true,init:function(j){var i=f(j),g=i.attr("name"),h=i.attr("val")?i.attr("val"):"",k=i.hasClass("checked")?true:false;i.addClass("cb");i.append(f('<input type="hidden" name="'+g+'" value="'+h+'" />'));i.click(e.toggle);if(i.hasClass("all")){i.click(e.allOrNone)}if(k){i.removeClass("checked");i.click()}},toggle:function(i){var h=this;var g=c[f(this)[0].getAttribute("name")];if(typeof(g.callback)==="function"){g.callback(h)}else{f(this).toggleClass("cb_active").children().attr("checked",(f(this).hasClass("cb_active")?true:false))}},allOrNone:function(i){var h=f(this).attr("name");if(h.length>3){var g=h.substring(0,h.length-3);var j=f(this).hasClass("cb_active")?true:false;if(j){f(".cb[name="+g+"]").not(f(".cb_active[name="+g+"]")).click()}else{f(".cb_active[name="+g+"]").click()}}}};var b={init:function(j){var i=f(j),g=i.attr("name"),h=i.attr("val")?i.attr("val"):"";_isChecked=i.hasClass("checked")?true:false;i.addClass("rb");i.append(f('<input type="hidden" name="'+g+'" value="'+h+'" />'));i.click(b.toggle);if(_isChecked){i.removeClass("checked");i.click()}},toggle:function(){var h=f(this),g=h.attr("name");f('[name="'+g+'"]').removeClass("rb_active").children().attr("checked",false);h.addClass("rb_active").children().attr("checked",true)}},d=function(h){var g=f(h).attr("type")||f(h).attr("data-type");if(g=="selectbox"){a.init(h)}else{if(g=="checkbox"){e.init(h)}else{if(g=="radiobox"){b.init(h)}}}};f.fn.inputbox=function(g){return this.each(function(){c[f(this)[0].getAttribute("name")]=f.extend({},f.fn.inputbox.defaults,g);d(this)})};f.fn.inputbox.defaults={width:"auto",height:28}})(jQuery);