(function($){
	var hhly={
		/*
		container:'.tab_container',tab选项卡容器
		menuClass:'active',tab选项卡菜单切换选中类
		menuBox:'.menu_box',tab选项卡菜单容器
		menuLi:'li',tab选项卡具体菜单类
		tab:'.tab_box',tab选项阿卡目标容器
		tabContent:'.tab_content',tab选项阿卡目标容器具体类
		tabClass:'hidden'隐藏类
		 */
		tabSlider:function(setting){
			var opts=$.extend({
				container:'.slider_container',
				menuClass:'active',
				menuBox:'.slider_menu',
				menuLi:'li',
				tab:'.tab_box',
				tabContent:'.tab_content',
				tabClass:'hidden'
			},setting);
			$(opts.container).find(opts.menuBox).on('click',opts.menuLi, function(event) {
				event.preventDefault();
				var index=$(this).index();
				$(this).addClass(opts.menuClass).siblings(opts.menuLi).removeClass(opts.menuClass);
				$(this).parents(opts.container).find(opts.tabContent).eq(index).removeClass(opts.tabClass).siblings().addClass(opts.tabClass);
			});
		},
		/*
		url:请求地址，
		type:数据传输类型，
		datatype:数据格式，
		data:请求所带的参数，
		success:成功回调，
		error:失败回调,
		blocker:是否开启拦截器，默认开启，
		blockerFn:拦截器函数，默认3秒跳转首页，
		dataOption:成功回调内所需使用的其他参数
		 */
		ajax:function(setting){
			var opts=$.extend({
				url:'',
				type:'post',
				dataType:'json',
				timeout:'30000',
				async:true,
				cache:true,
				ifModified:false,
				processData:true,
				data:{},
				success:function(data){
				},
				error:function(error){
				},
				beforeSend:function(xhr){
				},
				complete:function(xhr,status){
				},
				dataFilter:function(data, type){
				},
				blocker:true,
				blockerFn:function(data){
					var dataTips='';
					if(opts.dataType==='html'){
						var dataCopy=JSON.stringify(data).slice(0, 80);
						if(dataCopy.indexOf('result')!=-1 && dataCopy.indexOf('<div') ==-1){
							dataTips=eval('(' + data + ')');
						}
					}else{
						dataTips=data;
					}
					switch(dataTips.result){
						case '2001':
						layer.open({
							scrollbar: false,
							move: false,
							title: '温馨提示',
							area:'440px',
							content: '<div class="dialog_login_box text"><span class="at_span error"></span><span class="dialog_tips">'+dataTips.msg+'</span><p><soan class="login_timeout">3</soan>秒后跳转到<a href="http://pc.sport.com/member/login">登录页</a></p></div>',
							btn: ['确定', '取消'],
							success:function(){
								var timer=setInterval(function(){
									var time=$('.login_timeout').text();
									if(time>1){
										time=time-1;
										$('.login_timeout').text(time);
									}
									else{
										clearInterval(timer);
										window.location.href='/member/login';
									}
								},1000);
							}
						});
						break;
					}
				},
				dataOption:{}
			},setting);
			opts.data['_time']=new Date();
			var ajax=$.ajax({
				url:opts.url,
				type: opts.type,
				dataType: opts.dataType,
				timeout:'30000',
				async:true,
				cache:true,
				contentType:'application/x-www-form-urlencoded',
				global:true,
				ifModified:false,
				processData:true,
				traditional:false,
				context:document,
				data: opts.data,
				success:function(data){
					if(opts.blocker){
						if (typeof opts.blockerFn != 'undefined') { opts.blockerFn(data); }
					}
					if (typeof opts.success != 'undefined') { opts.success(data); }
				},
				error:function(data){
					if (typeof opts.error != 'undefined') { opts.error(data); }
				},
				beforeSend:function(xhr){
					if (typeof opts.beforeSend != 'undefined') { opts.beforeSend(xhr); }
				},
				complete:function(xhr,status){
					if (typeof opts.complete != 'undefined') { opts.complete(xhr,status); }
				},
			});
			return ajax;
		},
		/*
		时间增减插件
		wrap:'body',插件容器默认body
		hours:date.getHours(),插件时间，默认当前时间
		minute:date.getMinutes()插件分钟，默认当前分钟
		 */
		timer:function(setting){
			var opts=$.extend({
				wrap:'body',
				hours:'',
				minute:'',
				syncData:function(value,max,that){
				},
				blur:function(value,max,that){
				}
			},setting);
			var handle={
				add:function(value,max){
					if(value<max){
						value++;
					}
					if(value<10){
						value='0'+value;
					}
					return value;
				},
				reduce:function(value){
					if(value>0){
						value--;
						if(value<10){
							value='0'+value;
						}
					}
					return value;
				},
				refuseEvent:function(event){
					var e=window.event || event;
					if(e.stopPropagation){
						e.stopPropagation();
						e.preventDefault();
					}else{
						e.cancelBubble = true;
					}
				},
				numberFormat:function(value){
					if(value.toString().length==1){
						value='0'+value;
					}
					return value;
				}
			};
			if($(opts.wrap).find('.defined_hours').length==0){
				var html='<div class="timer_box"><input type="text" name="hours" class="defined_hours time_input" value="'+handle.numberFormat(opts.hours)+'" hhly-max="23" />:<input type="text" name="minute" hhly-max="59" class="defined_minute selected time_input" value="'+handle.numberFormat(opts.minute)+'" /></div>';
				html+='<div class="defined_btn_box"><span class="defined_add time_btn"></span><span class="defined_reduce time_btn"></span></div>';
				$(opts.wrap).append(html);
			}else{
				opts.hours=opts.hours||$(opts.wrap).find('.timer_box .defined_hours').val();
				opts.minute=opts.minute||$(opts.wrap).find('.timer_box .defined_minute').val();
				$(opts.wrap).find('.timer_box .defined_hours').val(handle.numberFormat(opts.hours));
				$(opts.wrap).find('.timer_box .defined_minute').val(handle.numberFormat(opts.minute));
			}
			$(document).click(function(){
				$(opts.wrap).find("input.selected").blur();
				$(opts.wrap).find('input').removeClass('selected');
			});
			$(opts.wrap).off('click.add').on('click.add', '.defined_add', function(event) {
				handle.refuseEvent(event);
				var selectInput=$(opts.wrap).find('input.selected');
				if(selectInput.length===0){
					selectInput=$(opts.wrap).find('input').last();
					selectInput.addClass('selected');
				}
				var value=selectInput.val();
				var max=selectInput.attr('hhly-max');
				var result=handle.add(value,max);
				selectInput.val(result);
				// if (typeof opts.syncData != 'undefined') { opts.syncData(result,max); }
			});
			$(opts.wrap).off('click.reduce').on('click.reduce', '.defined_reduce', function(event) {
				handle.refuseEvent(event);
				var selectInput=$(opts.wrap).find('input.selected');
				if(selectInput.length===0){
					selectInput=$(opts.wrap).find('input').last();
					selectInput.addClass('selected');
				}
				var max=selectInput.attr('hhly-max');
				var value=selectInput.val();
				var result=handle.reduce(value);
				selectInput.val(result);
				// if (typeof opts.blur != 'undefined') { opts.syncData(result,max); }
			});
			$(opts.wrap).on('focus', 'input', function(event) {
				$(this).addClass('selected').siblings('input').removeClass('selected');
			});
			$(opts.wrap).find("input").blur(function(event) {
				var max=$(this).attr('hhly-max');
				var value=$(this).val()||'00';
				if(value>max){
					value=max;
				}
				value=handle.numberFormat(value);
				if (typeof opts.blur != 'undefined') { opts.blur(value,max); }
				if (typeof opts.syncData != 'undefined') { opts.syncData(value,max); }
			});
			$(opts.wrap).off('click.refuse').on('click.refuse', 'input', function(event) {
				handle.refuseEvent(event);
			});
			$(opts.wrap).find("input").keydown(function(event) {
				if($(this).val().length>4){
					$(this).val($(this).val().slice(-3,0));
				}
			});
			$(opts.wrap).find("input").keyup(function(event) {
				var max=$(this).attr('hhly-max');
				key=event.keyCode||event.charCode;
				var result='';
				var value=$(this).val();
				if(isNaN(value)){
					value=0;
				}
				value=value||0;
				value=new Number(value);
				if (key == 38 || key == 39) {
					var result=handle.add(value,max);
				}else if(key == 37 || key == 40){
					var result=handle.reduce(value);
				}else if(key>47 && key<58 || key>95 && key <106){
					result=value;
					if(parseInt(result)>max){
						result=max;
					}
				}else if(key==8){
					result=value;
				}

				result=handle.numberFormat(result);
				$(this).val(result);
				// if (typeof opts.syncData != 'undefined') { opts.syncData(result,max); }
			});
		},
		/*
		字数统计
		wrap:'body'input容器
		input:'input',
		max：'50'字符串最大长度
		 */
		textAccount:function(setting){
			var opts=$.extend({
				wrap:'.input_box',
				input:'input',
				max:50
			},setting);
			if($(opts.wrap).find('.text_account_wrap').length===0){
				var textHtml='<div class="text_account_wrap"><span class="text_now">0</span><span class="text_line">/</span><span class="text_total">'+opts.max+'</span></div>';
				$(opts.wrap).append(textHtml);
			}
			$(opts.wrap).off('input.text propertychange.text keydown.text keyup.text blur.text').on('input.text propertychange.text keydown.text keyup.text blur.text',opts.input,function(){
				var textarea=$(this).val();
				var counter = textarea.length;
				var area = $(this);
				if (opts.max > 0) {
					if (counter > opts.max) { //textarea的文本长度大于maxlength
						area.val(textarea.substr(0, opts.max)); //截断textarea的文本重新赋值
					}
				}
				if (counter > opts.max) {
					counter = opts.max;
				}
				$(this).siblings('.text_account_wrap').find('.text_now').empty().text(counter);
			});
			/*文字剪切复制*/
			$(opts.wrap).off('blur.copy').on('blur.copy',opts.input,function(){
				var area = $(this);
				var textarea=$(this).val();
				var counter=textarea.length;
				if (opts.max > 0) {
					if (counter > opts.max) { //textarea的文本长度大于maxlength
						area.val(textarea.substr(0, opts.max)); //截断textarea的文本重新赋值
					}
				}
			});
		},
		/*
		单选框，复选框，下拉框组件
		wrap 必填项，需要初始化的容器；选择器，
		width 选填项，容器宽度，
		height 选填项，容器高度
		 */
		inputbox:function(setting){
			var opt=$.extend({
				wrap:'.check_box',
				width : 'auto',
				height : 28
			},setting);
			var opts = {};
			var selectbox = {
				//初始化自定义selectbox
				init: function(o) {
					var nowOpts=opts[$(o)[0].getAttribute('name')];
					var $o = $(o),
						_name = $o.attr('name'),
						_selectValue = $o.find('.opts > a.selected').attr('val')? $o.find('.opts > a.selected').attr('val'):$o.find('.opts > a:first').attr('val'),
						_selectHtml = $o.find('.opts > a.selected').html()? $o.find('.opts > a.selected').html():$o.find('.opts > a:first').html();
					$o.addClass('sb');
					$o.append($('<div class="sb_icon arrow" />'))
					if($o.children(':first').find('div.selected').length==0){
						$('<div class="selected">' + _selectHtml + '</div>').insertBefore($o.children(':first'));
					}else{
						$o.children(':first').find('div.selected').text(_selectHtml);
					}
					if($o.find('input').length==0){
						$o.append($('<input type="text" style="position:absolute;left:-10000px;" name="' + _name + '" value="' + _selectValue + '">'));
					}else{
						$o.find('input').prop('value',_selectValue);
					}
					$o.children('.opts').show();
					var optsWidth = $o.children('.opts').width();
					if(optsWidth == 0){
						var optsChildWidth = [];
						var tempWidth = 0;
						$o.children('.opts').children('a').each(function(){
							optsChildWidth.push($(this).width());
						});
						for(var i=0; i<optsChildWidth.length ; i++){
							if(optsChildWidth[i] > tempWidth)
								tempWidth = optsChildWidth[i]
						}
						optsWidth = tempWidth + 10;
					}
					$o.children('.opts').hide();
					$o.children('.opts').css('width', (optsWidth + 15));
					var _width = (nowOpts.width != 'auto')? nowOpts.width : $o.children('.opts').width();
					$o.css({'width': _width, 'height': nowOpts.height}).find('div.selected').css({'height': nowOpts.height, 'line-height': nowOpts.height +'px'});
					$o.find('.sb_icon').css({'top': ($o.height() - $o.find('.sb_icon').height())/2});
					$o.off('click.input').on('click.input', selectbox.toggle);
					$o.off('click.input', '.opts > a').on('click.input', '.opts > a', selectbox.select);
					$o.find('.opts').off('mouseenter mouseleave').on('mouseenter', selectbox.mouseenter).on('mouseleave', selectbox.mouseleave);
					$(document).off('click.input').on('click.input', selectbox.hide);
					// $o.click(selectbox.toggle);
					// $o.find('.opts > a').click(selectbox.select).hover(selectbox.hover);
					// $(document).click(selectbox.hide);

				},
				toggle: function(e) {
					e.stopPropagation();
					var $o = $(this);
					if($(this).hasClass('disabled')){
						return false;
					}
					var $opts = $o.children('.opts');
					$o.find('a.selected').removeClass('none');
					selectbox.hide(null, $('.sb').not($o));
					$o.toggleClass('sb_active');
					$opts.css({
						'width':$o.width()+2,
						'top': $o.height(),
						'left': - parseInt($o.css('border-left-width'))
					}).toggle($o.hasClass('sb_active'));

				},
				hide: function(e, objs) {
					var $o = objs ? objs : $('.sb');
					$o.removeClass('sb_active').children('.opts').hide().find('a.selected').removeClass('none');
				},
				select: function(e) {
					e.stopPropagation();
					var $o = $(this).parents('.sb:first');
					var nowOpts=opts[$o[0].getAttribute('name')];
					$o.trigger('click.input');
					if(typeof(nowOpts.callback)==='function'){
						nowOpts.callback(this);
					}
					$o.find('a.selected').removeClass('selected').addClass('old_select').siblings().removeClass('old_select');
					$(this).addClass('selected');
					var value=$o.find('a.selected').attr('val');
					var $input=$o.find('input');
					$input.attr('data-value',value);
					$o.find('div.selected').html($(this).html());
					$input.attr('value',value);
					$input.val(value);
				},
				mouseenter: function(e){
					e.stopPropagation();
					var $o = $(this);
					$o.find('a.selected').addClass('none');
				},
				mouseleave: function(e){
					e.stopPropagation();
					var $o = $(this);
					$o.find('a.selected').removeClass('none');
				}
			};
			var checkbox = {
				judgecontrol:true,
				//初始化checkbox
				init: function(o) {
					var $o = $(o),
						_name = $o.attr('name'),
						_value = $o.attr('val')? $o.attr('val'): '',
						_isChecked = $o.hasClass('checked')? true : false;
					$o.addClass('cb');
					$o.find('span.hidden').removeClass('hidden');
					$o.append($('<input type="hidden" name="' + _name + '" value="' + _value + '" />'));
					$o.click(checkbox.toggle);
					if($o.hasClass('all')) $o.click(checkbox.allOrNone);
					if(_isChecked){
						$o.removeClass('checked');
						$o.click();
					}
				},
				toggle: function(e) {
					var that=this;
					var nowOpts=opts[$(this)[0].getAttribute('name')];
					if(typeof(nowOpts.callback)==='function'){
						nowOpts.callback(that);
					}else{
		        		$(this).toggleClass('cb_active').children().attr('checked', ($(this).hasClass('cb_active') ? true : false));
					}
				},
				allOrNone: function(e) {
					var cbAllName = $(this).attr('name');
					if(cbAllName.length > 3){
						var cbOneName = cbAllName.substring(0, cbAllName.length - 3);
						var isChecked = $(this).hasClass('cb_active')? true : false;
						if(isChecked){
							$('.cb[name='+ cbOneName +']').not($('.cb_active[name='+ cbOneName +']')).click();
						}else{
							$('.cb_active[name='+ cbOneName +']').click();
						}
					}
				}
			};
			var radiobox = {
				//初始化radiobox
				init: function(o) {
					var $o = $(o),
						_name = $o.attr('name'),
						_value = $o.attr('val')? $o.attr('val'): '';
						_isChecked = $o.hasClass('checked')? true : false;
					$o.addClass('rb');
					$o.find('span.hidden').removeClass('hidden');
					$o.append($('<input type="hidden" name="' + _name + '" value="' + _value + '" />'));
					$o.click(radiobox.toggle);
					if(_isChecked){
						$o.removeClass('checked');
						$o.click();
					}
				},
				toggle: function() {
					var $o = $(this),
						_name = $o.attr('name');
					$('[name="'+ _name +'"]').removeClass('rb_active').children().attr('checked', false);
					$o.addClass('rb_active').children().attr('checked', true);
				}
			},
			_init = function(o){
				var type = $(o).attr('type')|| $(o).attr('data-type');
				if(type == 'selectbox'){
					selectbox.init(o);
				}else if(type == 'checkbox'){
					checkbox.init(o);
				}else if(type == 'radiobox'){
					radiobox.init(o);
				}
			};
			$(opt.wrap).each(function(){
	       		opts[$(this)[0].getAttribute('name')]= $.extend({}, opt);
	            _init(this);
	        });
		},
		/*
		左右切换插件
			box:'.box',整个容器，必填项
			wrap:'.pic_content',内容容器，必填项
			container:'.pic_lists',内容ul容器，必填项
			li:'li',内容项,默认li
			pageNum:'3',一个横排内内容数量
			prev:'.prev_change',上一个按钮，必填项
			next:'.next_change',下一个按钮，必填项
			ajaxJudge：是否开启上一页下一页向数据库请求数据，默认false
			prevLoad上一个回调，默认打印数据，非必填项
			nextLoad下一个回调，默认打印数据，非必填项
		 */
		slideChange:function(setting){
			var opts=$.extend({
				box:'.box',
				wrap:'.pic_content',
				container:'.pic_lists',
				li:'li',
				pageNum:'3',
				prev:'.prev_change',
				next:'.next_change',
				ajaxJudge:false,
				prevLoad:function(data){
					console.log(data);
				},
				nextLoad:function(data){
					console.log(data)
				}
			},setting);
			var page,liObj,picNum,liWidth,page_count,changeBox;
			var changeInit=function(oldPage,oldCount){
				page=1;
				liObj=$(opts.container).find("ul").children(opts.li);
				picNum=liObj.length;
				var marginValue=parseInt(liObj.css('margin-left'))+parseInt(liObj.css('margin-right'));
				liWidth=liObj.width()+marginValue+2*parseInt(liObj.css('border-left-width')||0);
				page_count=Math.ceil(picNum/opts.pageNum);
				changeBox=liWidth*opts.pageNum;
				$(opts.wrap).css('width',changeBox);
			}
			var judgePrev=true,judgeNext=true;
			changeInit();
			$('.pic_con').off('click.slide',opts.next).on('click.slide',opts.next,function(){
				if(!judgeNext){
					return false;
				}
				judgeNext=false;
				if(opts.ajaxJudge && page_count==page+1){
					var oldPage=page;
					var oldCount=page_count;
					var that=this;
					if (typeof opts.nextLoad != 'undefined') { opts.nextLoad(that); }
					var deNum=(oldCount-2)*opts.pageNum;
					for(var i=0;i<deNum;i++){
						$(opts.container).find("ul").children(opts.li).first().remove();
					}
					$(opts.container).css('left','0');
					changeInit(oldPage,oldCount);
				}
				if(page_count>page){
					$(opts.container).animate({left:'-'+page*changeBox+"px"},400,function(){
						judgeNext=true;
					});
					page++;
				}else{
					judgeNext=true;
				}
			});
			$('.pic_con').off('click.slide',opts.prev).on('click.slide',opts.prev,function(){
				if(!judgePrev){
					return false;
				}
				judgePrev=false;
				if(opts.ajaxJudge && page==2){
					var that=this;
					if (typeof opts.prevLoad != 'undefined') { opts.prevLoad(that); }
					var oldPage=page;
					var oldCount=page_count;
					var deNum=(oldCount-2)*opts.pageNum;
					for(var i=0;i<deNum;i++){
						$(opts.container).find("ul").children(opts.li).last().remove();
					}
					changeInit(oldPage,oldCount);
					$(opts.container).css('left','-'+(page_count-1)*changeBox+'px');
					page=page_count;
				}
				if(page>1){
					var left=$(opts.container).css('left');
					if(left>0){
						$(opts.container).css('left','-'+changeBox+'px');
					}
					$(opts.container).animate({left:"+="+changeBox+'px'},400,function(){
						judgePrev=true;
					});
					page--;
				}else{
					judgePrev=true;
				}
			});
		}
	};
	$.extend($,{hhly:hhly});
})(jQuery);