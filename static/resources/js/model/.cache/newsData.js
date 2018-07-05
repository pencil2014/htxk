/*TMODJS:{"version":1,"md5":"e6d7cfd21c65b51c9ac0930136bfa253"}*/
template('newsData',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,data=$data.data,item=$data.item,index=$data.index,picture=$data.picture,i=$data.i,$escape=$utils.$escape,$index=$data.$index,contentSize=$data.contentSize,$out='';$out+=' ';
$each(data.list,function(item,index){
$out+=' ';
if(item.infoType==1){
$out+=' ';
if(item.coverUrl.length>0){
$out+=' <li class="news_commonbox textwrap_box"> <dl class="left_graphic"> ';
$each(item.coverUrl,function(picture,i){
$out+=' ';
if(i==0){
$out+=' <dt><a href="';
$out+=$escape(item.url);
$out+='" target="_blank"><img src="';
$out+=$escape(picture);
$out+='" width="100%"></a></dt> ';
}
$out+=' ';
});
$out+=' </dl> <div class="right_inforbox"> <h4><a href="';
$out+=$escape(item.url);
$out+='" target="_blank">';
$out+=$escape(item.title);
$out+='</a></h4> <div class="report_box"> <div class="report_office"> <span class="office_icon smalluser_icon"></span> <span class="text">';
$out+=$escape(item.authorName||item.userId);
$out+='</span> </div> <div class="time_reply"> <label class="time_label">';
$out+=$escape(item.publishTimeFormat);
$out+='</label> <div class="report_replybox"> <i class="iconfont">&#xe628;</i> <span class="number">';
$out+=$escape(item.commentCount||0);
$out+='</span> </div> <div class="report_likenumber"> <i class="iconfont">&#xe65c;</i> <span class="number">';
$out+=$escape(item.clickCount||0);
$out+='</span> </div> </div> </div> </div> </li> ';
}else{
$out+=' <li class="news_commonbox article_newbox "> <h4 class="title"><a href="';
$out+=$escape(item.url);
$out+='" target="_blank">';
$out+=$escape(item.title);
$out+='</a></h4> <div class="article_box"> <p class="article_desc">';
$out+=$escape(item.summary);
$out+='</p> </div> <div class="report_box report_footer"> <div class="report_office "> <span class="office_icon smalluser_icon"></span> <span class="text">';
$out+=$escape(item.authorName||item.userId);
$out+='</span> </div> <div class="time_reply"> <label class="time_label">';
$out+=$escape(item.publishTimeFormat);
$out+='</label> <div class="report_replybox"> <i class="iconfont">&#xe628;</i> <span class="number">';
$out+=$escape(item.commentCount||0);
$out+='</span> </div> <div class="report_likenumber"> <i class="iconfont">&#xe65c;</i> <span class="number">';
$out+=$escape(item.clickCount||0);
$out+='</span> </div> </div> </div> </li> ';
}
$out+=' ';
}else{
$out+=' <li class="news_commonbox picture_newbox "> <h4 class="title"><a href="';
$out+=$escape(item.url);
$out+='" target="_blank">';
$out+=$escape(item.title);
$out+='</a></h4> <div class="picimg_box"> <dl> ';
$each(item.coverUrl,function(picture,$index){
$out+=' <dt><a href="';
$out+=$escape(item.url);
$out+='" target="_blank"><img src="';
$out+=$escape(picture);
$out+='" width="100%"></a></dt> ';
});
$out+=' </dl> <div class="picmore_btn"> <a href="';
$out+=$escape(item.url);
$out+='" class="text" target="_blank">查看更多&gt;</a> ';
if(contentSize>0){
$out+=' <div class="img_accountbox"> <span class="account">';
$out+=$escape(item.contentSize);
$out+='</span><span class="pic">图</span> </div> ';
}
$out+=' </div> </div> <div class="report_box report_footer"> <div class="report_office"> <span class="office_icon smalluser_icon"></span> <span class="text">';
$out+=$escape(item.authorName||item.userId);
$out+='</span> </div> <div class="time_reply"> <label class="time_label">';
$out+=$escape(item.publishTimeFormat);
$out+='</label> <div class="report_replybox"> <i class="iconfont">&#xe628;</i> <span class="number">';
$out+=$escape(item.commentCount);
$out+='</span> </div> <div class="report_likenumber"> <i class="iconfont">&#xe65c;</i> <span class="number">';
$out+=$escape(item.clickCount);
$out+='</span> </div> </div> </div> </li> ';
}
$out+=' ';
});
return new String($out);
});