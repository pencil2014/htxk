/**
 * Created by dell on 2017/1/19.
 */
// $(".cbox_tp .tp").click(function () {
//     $(this).find("span").html(parseInt($(this).find("span").html()) + 1);
//     //只能点一次赞
//     $(this).unbind();
//     $(this).find("i").addClass("i");
// });
$(function(){
	$('.card_content .cbox_tli').each(function(){
		var maxwidth=200;
		if($(this).text().length>maxwidth){
			$(this).text($(this).text().substring(0,maxwidth));
			$(this).html($(this).html()+'…');
		}
	});
});