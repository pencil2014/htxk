(function ($) {
    /**
     * @param {Array} emailType Email类型, eg:['@qq.com','@163.com']
     */
    $.fn.emailSelector = function (emailType) {
        var $input = this;
        var input = $input[0];
        var $parent = $input.parent();
        var $ul = $('<ul></ul>');
        var _emailType; //真正用来遍历的数组
        var index = 0; //激活的li的索引

        //必须绑定在input标签上
        if (input.nodeName.toUpperCase() !== 'INPUT') {
            throw new Error('必须绑定在input标签上')
        }
        //父元素必须是相对定位
        if ($parent.css('position') !== 'relative') {
            throw new Error('input的父元素必须是相对定位');
        }
        //设置默认邮箱类型
        if (!emailType || !$.isArray(emailType) || emailType.length === 0) {
            emailType = [
                '',
                '@qq.com',
                '@163.com',
                '@126.com',
                '@sina.com',
                '@sina.cn',
                '@vip.sina.com',
                '@gmail.com',
                '@sohu.com',
                '@139.com',
                '@189.cn',
                '@outlook.com',
                '@hotmail.com'
            ];
        } else {
            emailType.unshift('');
        }

        //添加到父节点上
        $input.attr('autocomplete','off');
        $ul.css({top: $input.css('height')});
        $ul.addClass('emailSelector');
        $parent.append($ul);

        //绑定事件
        $(document).on('mouseup', function () {
            $ul.hide();
        });
        $ul.on('mouseover', 'li', function (e) {
            var target = e.target;
            index = $(target).attr('data-index') - 0;
            setActive();
        });
        $ul.on('click', 'li', function (e) {
            $input.val(e.target.innerHTML).blur().focus();
            $ul.hide();
        });
        $input.on('keyup', function (e) {
            //up
            if (e.keyCode == 38) {
                if (index <= 0) {
                    index = _emailType.length - 1;
                } else {
                    index--;
                }
                setActive();
            }
            //down
            else if (e.keyCode == 40) {
                if (index >= _emailType.length - 1) {
                    index = 0;
                } else {
                    index++;
                }
                setActive();
            }
            //enter
            else if (e.keyCode == 13) {
                $input.val($ul.find('li').eq(getIndex()).text()).blur().focus();
                $ul.hide();
            }
            //输入
            else {
                $ul.show();
                var text = $input.val();
                if (text.length > 0 && text.indexOf('@') == -1) {
                    _emailType = emailType;
                    init(text);
                } else if (text.length > 0 && text.indexOf('@') > 0) {
                    var i = text.indexOf('@');
                    var type = text.substr(i);
                    _emailType = emailType.filter(function (t) {
                        if (t.indexOf(type) != -1) return true;
                    });
                    init(text, type);
                } else {
                    $ul.hide();
                }
            }
        });

        //初始化DOM
        function init(text, replace) {
            $ul.html('');
            index = 0;
            if (replace !== undefined) {
                text = text.replace(replace, '');
            }
            $.each(_emailType, function (i, type) {
                type = type.toString();
                var $li = $('<li>' + text + type + '</li>');
                $li.attr('data-index', i);
                if (i == index) {
                    $li.addClass('active');
                }
                $ul.append($li);
            });
        }

        //设置激活样式
        function setActive() {
            $ul.find('li').removeClass('active');
            $ul.find('li').eq(getIndex()).addClass('active');
        }

        //获取Index
        function getIndex() {
            if (index < 0) {
                return 0;
            } else if (index >= _emailType.length) {
                return _emailType.length - 1;
            } else {
                return index;
            }
        }
    }
})(jQuery);