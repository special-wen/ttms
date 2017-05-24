$(document).ready(function() {
	$("#film").mouseenter(function() {
		$("#film").css("background-color", rgb(255, 70, 70));
	});
	$("#film").mouseleave(function() {
		$("#film").css("background-color", white);
	});
	$('p').click(function() {　　　　 alert('Hello');　　 });
});