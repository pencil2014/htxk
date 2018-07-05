/*TMODJS:{"version":2,"md5":"d0435981141a9c336046e76d07145220"}*/
template('attention_tpl',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,data=$data.data,item=$data.item,index=$data.index,$escape=$utils.$escape,$out='';$each(data.list,function(item,index){
$out+=' <li> <div class="personal_focus_head fl"> <a href="/personal/index/';
$out+=$escape(item.userId);
$out+='"> <img src="';
$out+=$escape(item.iconUrl||'/resources/images/default_photo.jpg');
$out+='"> <i class="';
$out+=$escape(item.sex==2?'focus_girl':'focus_boy');
$out+='"></i> </a> </div> <div class="personal_focus_intro fl"> <h4>';
$out+=$escape(item.nickName);
$out+='</h4> <ul class="personal_focus_count"> <li class="personal_focus"> <span>关注：</span> <i>';
$out+=$escape(item.concernNum);
$out+='</i> </li> <li class="personal_fancs"> <span>粉丝：</span> <i>';
$out+=$escape(item.followNum);
$out+='</i> </li> <div class="clearx"></div> </ul> ';
if(item.areaCityName){
$out+=' <i class="personal_focus_address"> <i></i> <span>';
$out+=$escape(item.areaCityName||'');
$out+='</span> </i> ';
}
$out+=' ';
if(item.sign){
$out+=' <p class="personal_focus_signature"> 签名：';
$out+=$escape(item.sign);
$out+=' </p> ';
}
$out+=' </div> <div class="personal_focus_mark fr"> <div class="foucs_warp status fl"> <div class="foucs_warp fl"> ';
if((item.isFollowed == 1)){
$out+=' <a class="followClick star_focus" href="javascript:;">已关注</a> ';
}else{
$out+=' <a class="followClick" hhly-url="/collect/follow/add/';
$out+=$escape(item.userId);
$out+='" href="javascript:;">+ 关注</a> ';
}
$out+=' </div> </div> <div class="clearx"></div> </div> <div class="clearx"></div> </li> ';
});
return new String($out);
});