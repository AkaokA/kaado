var decklist = [];
var cardPrototype = "<div class='kaado-card'><div class='card-shadow'></div><div class='card-position-wrapper'><div class='card'><div class='back'></div><div class='front'></div></div></div></div>"

class kaadoCard {
  constructor (cardID, frontImage, backImage) {
    this.cardID = cardID;
    this.frontImage = frontImage;
    this.backImage = backImage;
  }
}

function kaadoShuffle(array) {
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

function kaadoCreateCardElement(container, cardData, facedown) {
	container.append(cardPrototype);

	$(".kaado-card:last-child").data("cardData", cardData);
	
	$(".kaado-card:last-child .front").css({
		"background-image": "url("+ cardData.frontImage +")"
	})
	$(".kaado-card:last-child .back").css({
		"background-image": "url("+ cardData.backImage +")"
	})
	
	if (facedown == "facedown" || facedown == true) {
  	$(".kaado-card:last-child").addClass("facedown");
	}
	
  $(".kaado-card").mouseover( function() {
    if (!$(this).hasClass("facedown")) {    
      $(".kaado-card-inset").css({
    		"background-image": "url("+ $(this).data("cardData").frontImage +")"
    	});
    }
  });
	
};

function kaadoBuildDeck(decklist) {
	for (var i = 0; i < decklist.length; i++) {
		kaadoCreateCardElement($(".kaado-deck-area"), decklist[i], "facedown");
	}
};

$(document).ready(function() {
  
	$(".kaado-deck-area").sortable({
  	connectWith: ".kaado-hand-area",
  	helper: "clone",
  	start: function(event, ui) {
			ui.helper.addClass("active");
		},
		over: function(event, ui) {
			ui.item.addClass("facedown");
			ui.helper.addClass("facedown");
		},
		out: function(event, ui) {
			ui.item.removeClass("facedown");
			ui.helper.removeClass("facedown");
      $(".kaado-card-inset").css({
    		"background-image": "url("+ ui.item.data("cardData").frontImage +")"
    	});
		},
		receive: function(event, ui) {
			ui.item.addClass("facedown");
			ui.helper.addClass("facedown");
		},
	});
	
	$(".kaado-hand-area").sortable({
  	connectWith: ".kaado-deck-area",
  	helper: "clone",
  	start: function(event, ui) {
			ui.helper.addClass("active");
		},
	});
	
	getNetrunnerJSON();
});