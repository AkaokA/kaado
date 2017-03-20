var decklist = [];
var cardPrototype = "<div class='card-element'><div class='card-shadow'></div><div class='card-position-wrapper'><div class='card'><div class='back'></div><div class='front'></div></div></div></div>"

class kaadoCard {
  constructor (cardID, frontImage, backImage) {
    this.cardID = cardID;
    this.frontImage = frontImage;
    this.backImage = backImage;
  }
}

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

function kaadoCreateCardElement(container, cardData, facedown) {
	container.append(cardPrototype);

	$(".card-element:last-child").data("inset-image", cardData.frontImage);
	
	$(".card-element:last-child .front").css({
		"background-image": "url("+ cardData.frontImage +")"
	})
	$(".card-element:last-child .back").css({
		"background-image": "url("+ cardData.backImage +")"
	})
	
	if (facedown == "facedown" || facedown == true) {
  	$(".card-element:last-child").addClass("facedown");
	}
	
  $(".card-element").mouseover( function() {
    if (!$(this).hasClass("facedown")) {    
      $(".card-inset").css({
    		"background-image": "url("+ $(this).data("insetImage") +")"
    	});
    }
  });

/*
  $(".card-element").mouseout( function() {    
    $(".card-inset").css({
  		"background-image": "none"
  	});
  });
*/

	
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

function kaadoBuildDeck(decklist) {
	for (var i = 0; i < decklist.length; i++) {
		kaadoCreateCardElement($(".play-area"), decklist[i], "facedown");
	}
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