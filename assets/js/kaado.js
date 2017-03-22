class kaadoCard {
  constructor (cardID, frontImage, backImage) {
    this.cardID = cardID;
    this.frontImage = frontImage;
    this.backImage = backImage;
  }
}

var kaadoCardList = [];
var cardPrototype = "<div class='kaado-card'><div class='card-shadow'></div><div class='card-position-wrapper'><div class='card'><div class='back'></div><div class='front'></div></div></div></div>"

var $kaadoCard;
var $kaadoDeck;
var $kaadoHand;
var $kaadoLoupe;
function kaadoCacheElements() {
  $kaadoDeck = $(".kaado-deck");
  $kaadoHand = $(".kaado-hand");
  $kaadoLoupe = $(".kaado-loupe");
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
  $kaadoCard = $(".kaado-card");
  
  // attach card data to DOM element
	$kaadoCard.filter(":last-child").data("cardData", cardData);
	
	// set front & back card images
	$kaadoCard.filter(":last-child").find(".front").css({
		"background-image": "url("+ cardData.frontImage +")"
	})
	$kaadoCard.filter(":last-child").find(".back").css({
		"background-image": "url("+ cardData.backImage +")"
	})
	
	// spawn card facedown if necessary
	if (facedown == "facedown" || facedown == true) {
  	$kaadoCard.filter(":last-child").addClass("facedown");
	}
	
	// make card draggable
  $kaadoCard.draggable({
    connectToSortable: ".kaado-hand",
    stack: ".kaado-card",
    start: function(event, ui) {
      ui.helper.addClass("active");
    },
    stop: function(event, ui) {
      ui.helper.removeClass("active");
    }
  });
	
	// hover events
  $kaadoCard.mouseover( function() {
    if (!$(this).hasClass("facedown")) {
      updateLoupe($(this));
    }
  });
	
};

function kaadoBuildDeck(kaadoCardList) {
	for (var i = 0; i < kaadoCardList.length; i++) {
		kaadoCreateCardElement($kaadoDeck, kaadoCardList[i], "facedown");
	}
};

function updateLoupe(cardElement) {
  $kaadoLoupe.css({
		"background-image": "url("+ cardElement.data("cardData").frontImage +")"
	});
}

function kaadoSetUpCardAreas() {
  var revertDuration = 200;
  
	$kaadoDeck.droppable({
  	revert: revertDuration,
		over: function(event, ui) {
			ui.draggable.addClass("facedown");
		},
		out: function(event, ui) {
			ui.draggable.removeClass("facedown");
      updateLoupe(ui.draggable);
		},
		drop: function(event, ui) {
  		ui.draggable.addClass("facedown");
			ui.draggable.removeClass("active");
			ui.draggable.removeAttr("style");
		},
	});
	
	$kaadoHand.sortable({
  	connectWith: ".kaado-deck",
  	revert: revertDuration,
  	start: function(event, ui) {
			ui.item.addClass("active");
		},
		stop: function(event, ui) {
			ui.item.removeClass("active");
			ui.item.removeAttr("style");
		}
	});
  
}

$(document).ready(function() {
  kaadoCacheElements();
  kaadoSetUpCardAreas();
});