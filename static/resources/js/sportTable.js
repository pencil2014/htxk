! function($) {
    $.fn.extend({
        sportTable: function(option) {
            var defaults = {
                    width: 640,
                    height: 360,
                    during: 3e3,
                    speed: 800,
                    callback:''
                },
                opts = $.extend(defaults,option);
                opts.width=$('.mit_pcontent').width()||opts.width;
                var _that=this;
                var b = $(this),
                    c = $("ul", b),
                    e = $("li", b),
                    f = e.length,
                    g = 0,
                    h = null;
                var m = 0,
                    method = {
                        dataInt:function(w){
                            opts.width=w;
                            method.style();
                            b.add(".mit_pcontent", b).width(opts.width).height(opts.height), c.width(f * opts.width);
                            method.bindControl();
                        },
                        init: function(w) {
                            method.dataInt(w);
                            f > 2 && c.prepend($("li", c).last()).css({left: -opts.width});
                        },
                        bindControl: function() {
                            $(_that).siblings(opts.control) && $(_that).siblings(opts.control).off('click').on("click", function() {
                                var judge=false;
                                if($(this).hasClass('prev_slide')){
                                    judge=false;
                                }else{
                                    judge=true;
                                }
                                if(typeof(opts.callback)=='function'){
                                    opts.callback(g,$(this));
                                }
                                method.tabmove(judge);
                            });
                        },
                        tabmove: function(b) {
                            if (1 != f) {
                                var e = 0,
                                    h = !0;
                                "boolean" == typeof b ? h = b : (h = b > 0 ? !1 : !0, e = b),
                                g = h ? g >= f - 1 ? 0 : g + 1 : 0 >= g ? f - 1 : g - 1,
                                f > 2 ? (h ? c.append($("li", c).first()).css({
                                    left: 0 + e
                                }) : c.prepend($("li", c).last()).css({
                                    left: -2 * opts.width + e
                                }), c.stop().animate({
                                    left: [-opts.width, "easeOutExpo"]
                                }, opts.speed)) : h ? c.stop().animate({
                                    left: -opts.width
                                }, .6 * opts.speed, function() {
                                    $(this).append($("li", this).first()).css({
                                        left: 0
                                    })
                                }) : c.prepend($("li", c).last()).css({
                                    left: -opts.width + e
                                }).stop().animate({
                                    left: 0
                                }, .6 * opts.speed)
                            }
                        },
                        style: function() {
                            b.css({
                                position: "relative",
                                overflow: "hidden"
                            }).fadeIn(450), e.css({
                                display: "inline",
                                "float": "left"
                            }), c.add($(".bg", b)).add($(".desc", b)).add($(".num", b)).css({
                                position: "absolute"
                            }), $(".bg", b).css({
                                background: "#000",
                                filter: "alph$(opacity=50)",
                                opacity: .5
                            })
                        }
                    };
                method.init(opts.width);
                return method;

        }
    })
}(jQuery), $.extend($.easing, {
    easeOutExpo: function(a, b, c, d, e) {
        return b == e ? c + d : d * (-Math.pow(2, -10 * b / e) + 1) + c
    }
});
