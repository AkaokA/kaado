var kaadoCardList = [];

class kaadoCard {
  constructor (cardID, frontImage, backImage) {
    this.cardID = cardID;
    this.frontImage = frontImage;
    this.backImage = backImage;
  }
}

var $kaadoContainer;
var $kaadoCard;
var $kaadoPlayArea;
var $kaadoDeck;
var $kaadoHand;
var $kaadoLoupe;

function kaadoCacheElements() {
  $kaadoContainer = $(".kaado-container");
  $kaadoPlayArea = $(".kaado-play-area");
  $kaadoDeck = $(".kaado-deck");
  $kaadoHand = $(".kaado-hand");
  $kaadoLoupe = $(".kaado-loupe");
}

function kaadoSetUpCardAreas() {
  var revertDuration = 200;
  
  $kaadoPlayArea.droppable({
		drop: function(event, ui) {
			ui.draggable.removeClass("active");
		},
  })
  
	$kaadoDeck.droppable({
  	revert: revertDuration,
		over: function(event, ui) {
			ui.draggable.addClass("facedown");
		},
		out: function(event, ui) {
			ui.draggable.removeClass("facedown");
      kaadoUpdateLoupe(ui.draggable);
		},
		drop: function(event, ui) {
  		ui.draggable.addClass("facedown");
			ui.draggable.removeClass("active");
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
		},
		receive: function(event, ui) {
  		ui.item.addClass("active");
  		ui.item.draggable("disable");
		},
	});
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

function kaadoBuildDeck(kaadoCardList) {
	for (var i = 0; i < kaadoCardList.length; i++) {
		kaadoCreateCardElement($kaadoDeck, kaadoCardList[i], "facedown");
	}
};

var animationTime = 200;
var cardPickupHeight = 100;
var rotateXdeg = 0;
var rotateYdeg = 0;

function kaadoCreateCardElement(container, cardData, facedown) {
  var cardPrototype = "<div class='kaado-card'><div class='card-shadow'></div><div class='card-height-wrapper'><div class='card-rotation-wrapper'><div class='card'><div class='back'></div><div class='front'></div></div></div></div></div>"
  
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
	
	var enableRotation = false;
	// make card draggable
  $kaadoCard.draggable({
    connectToSortable: ".kaado-hand",
    stack: ".kaado-card",
    start: function(event, ui) {
      enableRotation = false;
      ui.helper.children(".card-height-wrapper").css({
        "transform": "translateZ("+ cardPickupHeight +"px)"
      });
      kaadoDragTransform(ui.helper);
      setTimeout(function() {
        enableRotation = true;
      }, animationTime)
    },
    drag: function(event, ui) {
      kaadoDragTransform(ui.helper);
      if (enableRotation) {
        disableTransition(ui.helper)
      }
    },
    stop: function(event, ui) {
      enableTransition(ui.helper);
      ui.helper.children(".card-height-wrapper").css({
        "transform": "translateZ(0)"
      });
      ui.helper.find(".card-rotation-wrapper").css({
        "transform": "translateZ(0)"
      });
      rotateXdeg = 0;
      rotateYdeg = 0;
    },
  });
	
	// hover events
  $kaadoCard.mouseover( function() {
    $(this).addClass("hover");
    if (!$(this).hasClass("facedown")) {
      kaadoUpdateLoupe($(this));
    }
  });
  $kaadoCard.mouseout( function() {
    $(this).removeClass("hover");
  });
};

function enableTransition($cardElement) {
  $cardElement.find(".card-rotation-wrapper").css({
    "transition": "transform "+ animationTime +"ms cubic-bezier(0.77, 0, 0.175, 1)"
  });
}

function disableTransition($cardElement) {
  $cardElement.find(".card-rotation-wrapper").css({
    "transition": "transform 0"
  });
}

function kaadoDragTransform($cardElement) {
  var rotationMagnitude = 45;
  rotateXdeg = 1 * ($cardElement.offset().top - $kaadoContainer.outerHeight()/2)/$kaadoContainer.outerHeight() * rotationMagnitude/2;
//   var rotateXdeg = 0;
  rotateYdeg = -1 * ($cardElement.offset().left + $cardElement.outerWidth()/2 - $kaadoContainer.outerWidth()/2)/$kaadoContainer.outerWidth() * rotationMagnitude;
  $cardElement.find(".card-rotation-wrapper").css({
    "transform": "rotateX("+ rotateXdeg +"deg) rotateY("+ rotateYdeg +"deg)"
  })
};

function kaadoUpdateLoupe($cardElement) {
  $kaadoLoupe.css({
		"background-image": "url("+ $cardElement.data("cardData").frontImage +")"
	});
};

$(document).ready(function() {
  kaadoCacheElements();
  kaadoSetUpCardAreas();
});