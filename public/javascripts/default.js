$(window).ready(() => {
	$('a').click(() => {
		console.log('blabla')
		$('#add-load').removeClass('hide');
	});
});