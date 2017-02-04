

$(document).ready(function() {
	$(".card").draggable();
	$( ".card" ).on( "dragstart", function( event, ui ) {
		ui.helper.removeClass("facedown");
	} );	
	$( ".card" ).on( "dragstop", function( event, ui ) {
		ui.helper.addClass("facedown");
	} );	
});