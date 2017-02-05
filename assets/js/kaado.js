var cardPrototype = "<div class='card-element facedown'><div class='card-shadow'></div><div class='card-position-wrapper'><div class='card'><div class='back'></div><div class='front'></div></div></div></div>"
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

function buildDeck(decklist) {
	for (var i = 0; i < decklist.length; i++) {
		createCard($(".play-area"));
		$(".card-element:last-child .front").css({
			"background-image": "url('https://netrunnerdb.com/card_image/"+ decklist[i] +".png')"
		})
		$(".card-element:last-child .back").css({
			"background-image": "url('assets/images/cardback-runner.png')"
		})
	}
};

var referencePoint = {top: 0, left: 0};

function createCard(container) {
	container.append(cardPrototype);
	
	$(".card-element:last-child").draggable({
		scroll: false,
		stack: ".card-element",
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
};

function getDistance(pointA, pointB) {
	var distance = Math.sqrt( Math.pow(pointA.top - pointB.top, 2) + Math.pow(pointA.left - pointB.left, 2) );
	return distance;
};

$(document).ready(function() {
	$(".hand-area, .deck-area").droppable({
		accept: ".card-element"
	});
	
	getNetrunnerJSON();
});