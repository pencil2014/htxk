var host = window.location.host;
if(host.indexOf('www')!=-1){
	var index=host.indexOf('.') ;
	var host=host.slice(index);
}else{
	host='.'+host;
}
if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
	window.location.href = 'http://m'+host;
}