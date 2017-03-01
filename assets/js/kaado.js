var decklist = [];

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getDistance(pointA, pointB) {
	var distance = Math.sqrt( Math.pow(pointA.top - pointB.top, 2) + Math.pow(pointA.left - pointB.left, 2) );
	return distance;
};

var referencePoint = {top: 200, left: 200};
var cardPrototype = "<div class='card-element facedown'><div class='card-shadow'></div><div class='card-position-wrapper'><div class='card'><div class='back'></div><div class='front'></div></div></div></div>"

function kaadoCreateCard(container) {
	container.append(cardPrototype);
	
	$(".card-element:last-child").draggable({
		scroll: false,
		stack: ".card-element",
		revert: false,
		revertDuration: 200,
		start: function( event, ui ) {
			
		},
		drag: function( event, ui ) {
			
		}
	});
};


$(document).ready(function() {
	$(".deck-area").droppable({
		accept: ".card-element",
		over: function (event, ui) {
			ui.helper.addClass("facedown");
		},
		out: function (event, ui) {
			ui.helper.removeClass("facedown");
		}
	});
	
	$(".hand-area").droppable({
		accept: ".card-element"
	});
	
	getNetrunnerJSON();
});