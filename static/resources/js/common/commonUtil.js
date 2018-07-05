/**
 * creator	liu.li.yang
 * desc		国际化工具类
 */
var msgUtil = {
	//资源国际化页面JS获取
	getTxt : function(key){
		return i18n[key];
	}		
}
/**
 * creator	liu.li.yang
 * desc		字符串处理对象
 */
var stringUtil = {	
	//判断字符串是否为空
	isNull : function(s){
		if(s && s.length>0){
			return false;
		}
		return true;
	}
		
};
/**
 * creator	liu.li.yang
 * desc		数字处理对象
 */
var numberUtil = {
	//格式化数字，10000.11---->10,000.11
	number_format_separator : function(nStr) {
	    nStr += '';
	    var x = nStr.split('.');
	    var x1 = x[0];
	    var x2 = x.length > 1 ? '.' + x[1] : '';
	    var rgx = /(\d+)(\d{3})/;
	     
	    while (rgx.test(x1)) {
	        x1 = x1.replace(rgx, '$1' + ',' + '$2');
	    }  
	    return x1 + x2;
	},
	//数字转换
	number_format : function(number){
		//非法数字返回0
		if(isNaN(number)){
			return '0';
		}
		if(number < 10000){
			return numberUtil.number_format_separator(number);
		}
		// 万单位计算
		var mod = number % 10000;
		number = parseInt(number / 10000);
		var tenThousand = msgUtil.getTxt('common_tenThousand');
		if(number < 1000){
			mod =  parseInt(mod / 1000);
			if(mod > 0){
				return number + '.' + mod + tenThousand;
			}else{
				return number + tenThousand;
			}
		} else if (number < 10000) {
			return numberUtil.number_format_separator(number) + tenThousand;
		}
		// 亿单位计算
		mod = number % 10000;
		number = parseInt(number / 10000);
		var billion = msgUtil.getTxt("common_billion");
		if (number < 1000) {
			mod = parseInt(mod / 1000);
			if(mod > 0){
				return number + '.' + mod + billion;
			}else{
				return number + billion;
			}
		} else if (number < 10000) {
			return numberUtil.number_format_separator(number) + billion;
		}
		return '0';
	}	
};

/**
 * 扩展时间函数格式化功能
 */
var dateTimeUtil = {
	timeFormat : function(timestamp){
		 return new Date(parseFloat(timestamp)).format('yyyy/MM/dd hh:mm:ss');
	},
	dayFormat : function(timestamp){
		return new Date(timestamp).format('yyyy-MM-dd');
	},
	timeByFormat : function(timestamp,format){
		return new Date(timestamp).format(format);
	},
	monthsFormat:function(timestamp){
		return new Date(timestamp).format('yyyy-MM');
	},
	hourFormat:function(timestamp){
		return new Date(timestamp).format('hh:mm');
	},
	hourFormat:function(timestamp){
		return new Date(timestamp).format('hh:mm');
	}
}
Date.prototype.format = function(format) {
    var date = {
           "M+": this.getMonth() + 1,
           "d+": this.getDate(),
           "h+": this.getHours(),
           "m+": this.getMinutes(),
           "s+": this.getSeconds(),
           "q+": Math.floor((this.getMonth() + 3) / 3),
           "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
           format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
           if (new RegExp("(" + k + ")").test(format)) {
                  format = format.replace(RegExp.$1, RegExp.$1.length == 1
                         ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
           }
    }
    return format;
};
function dateFormat(dateString,format) { // 兼容IE8以上
    if(!dateString)return "";
    var time = new Date(dateString.replace(/-/g,'/').replace(/T|Z/g,' '));
    var o = {
        "M+": time.getMonth() + 1, //月份
        "d+": time.getDate(), //日
        "h+": time.getHours(), //小时
        "m+": time.getMinutes(), //分
        "s+": time.getSeconds(), //秒
        "q+": Math.floor((time.getMonth() + 3) / 3), //季度
        "S": time.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return format;
}
/**
 * creator	liu.li.yang
 * desc		日期时间处理工具类
 */

