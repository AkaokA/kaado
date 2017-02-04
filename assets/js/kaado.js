var cardPrototype = "<div class='card facedown'><div class='shadow'></div><div class='back'></div><div class='front'></div></div>" 

function buildDeck() {
	var numCards = 10;
	for (var i = 0; i < numCards; i++) {
		createCard($(".deck-area"));
	}
};

function createCard(container) {
	container.append(cardPrototype);
};

var referencePoint = {top: 0, left: 0};

function getDistance(pointA, pointB) {
	var distance = Math.sqrt( Math.pow(pointA.top - pointB.top, 2) + Math.pow(pointA.left - pointB.left, 2) );
	return distance;
};

$(document).ready(function() {
	$(".hand-area").droppable({
		accept: ".card-element"
	});
	
	$(".card-element").draggable({
		scroll: false,
		start: function( event, ui ) {
			
		},
		drag: function( event, ui ) {
			var distance = getDistance(referencePoint, ui.position);
			
			if (distance > 100) {
				ui.helper.removeClass("facedown");
			} else {
				ui.helper.addClass("facedown");
			}
		}
	});
		
/* 	buildDeck(); */
		
});