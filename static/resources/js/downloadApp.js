$(function(){
	$('.download_wrap').fullpage({
		sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE', '#f90'],
		'navigation': true,
		'afterRender':function(){
			$('.first').addClass('first-init')
		}
	});

});