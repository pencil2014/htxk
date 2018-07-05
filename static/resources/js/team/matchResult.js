var result={
	inputInit:function(){
		$('.amidithion_container .time_year_select').inputbox({
			width:110
		});
		$('.amidithion_container .time_type_select').inputbox({
			width:110,
		});
		$('.amidithion_container .time_match_select').inputbox({
			width:110
		});
	},
	selectData:function(){
		$('#mit_submit_select').click(function(){
			var matchYear=$(this).siblings('.time_year_select').find('input').val();
			var matchTypeId=$(this).siblings('.time_type_select').find('input').val();
			var formatId=$(this).siblings('.time_match_select').find('input').val();
			var teamId=$('#orgId').val();
			var formData={"teamId":teamId,"matchYear":matchYear,"formatId":formatId,"matchTypeId":matchTypeId};
			$.hhly.ajax({
				url:'/team/result/page',
				data:formData,
				success:function(result){
					var list=result.list;
					var html='';	
					var winer='';
					for(var i=0;i<list.length;i++){
						var item = list[i];
						if(item.teamMatchFootballExtraVO.result == 3){
							winer='<span>胜</span>';
						}else if(item.teamMatchFootballExtraVO.result == 1){
							winer='<em>平</em>';
						}else{
							winer='<i>负</i>';
						}
						item.homeTeamIconUrl = item.homeTeamIconUrl || '/resources/images/default_team_logo.png';
						item.guestTeamIconUrl = item.guestTeamIconUrl || '/resources/images/default_team_logo.png';
						html+='<tr class="table_on">'
							+'    <td>'+item.teamMatchFootballExtraVO.matchTypeName+'</td>'
							+'    <td>'+item.teamMatchFootballExtraVO.formatName+'</td>'
							+'    <td>'+item.matchTime+'</td>'
							+'    <td class="option_right">'+item.homeTeamName+'</td>'
							+'    <td><img src="'+item.homeTeamIconUrl+'"></td>'
							+'    <td>'+item.homeScore+'-'+item.guestScore+'</td>'
							+'    <td><img src="'+item.guestTeamIconUrl+'"></td>'
							+'    <td class="option_left">'+item.guestTeamName+'</td>'
							+'    <td>'+winer+'</td>'
							+'</tr>'
					}
					$('#team_result_table').empty().append(html);
				}
			})
		})
	},
	init:function(){
		this.inputInit();
		this.selectData();
	}
};
$(function(){
	result.init();
});