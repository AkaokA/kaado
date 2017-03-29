var kaadoCardList = [];
class kaadoCard {
  constructor (cardID, frontImage, backImage) {
    this.cardID = cardID;
    this.frontImage = frontImage;
    this.backImage = backImage;
  }
}

// Kaado parameters
var animationTime = 100;

// cacheable elements
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
  var revertDuration = animationTime;
  
  $kaadoPlayArea.droppable({
  })
  
	$kaadoDeck.droppable({
  	revert: revertDuration,
		out: function(event, ui) {
			ui.draggable.removeClass("facedown");
      kaadoUpdateLoupe(ui.draggable);
		},
		over: function(event, ui) {
			ui.draggable.addClass("facedown");
		},
		drop: function(event, ui) {
  		ui.draggable.removeAttr("style");
		},
	});
	
	$kaadoHand.sortable({
  	revert: revertDuration,
  	helper: "original",
  	start: function(event, ui) {
			startDragging(ui.item);
		},
		sort: function(event, ui) {
  		setCardRotation(ui.item);
		},
		stop: function(event, ui) {
			stopDragging(ui.item);
		},
		receive: function(event, ui) {
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

function kaadoBuildDeck(container, kaadoCardList) {
	for (var i = 0; i < kaadoCardList.length; i++) {
		kaadoCreateCardElement(container, kaadoCardList[i], "facedown");
	}
};

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
		
	// make card draggable
  $kaadoCard.draggable({
    connectToSortable: ".kaado-hand",
    stack: ".kaado-card",
    scroll: false,
    start: function(event, ui) {
      startDragging(ui.helper)
    },
    drag: function(event, ui) {
      // dynamic card rotation
      setCardRotation(ui.helper);
      addSpecularEffect(ui.helper);
    },
    stop: function(event, ui) {
      stopDragging(ui.helper)
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

// global vars
var rotateXdeg = 0;
var rotateYdeg = 0;

var currentCardBG;

var kaadoContainerWidth;
var kaadoContainerHeight;

var currentCardWidth;
var currentCardHeight;

var $currentCardHeightWrapper;
var $currentCardRotationWrapper;
var $currentCardFront;
var $currentCardBack;

function startDragging($cardElement) {
  // cache elements
  $currentCardHeightWrapper = $cardElement.children(".card-height-wrapper");
  $currentCardRotationWrapper = $cardElement.find(".card-rotation-wrapper");
  $currentCardFront = $cardElement.find(".front")
  $currentCardBack = $cardElement.find(".back")
  
  // get dimensions
  kaadoContainerWidth = $kaadoContainer.outerWidth();
  kaadoContainerHeight = $kaadoContainer.outerHeight();
  currentCardWidth = $cardElement.outerWidth();
  currentCardHeight = $cardElement.outerHeight();

  // set 'active' class
  $cardElement.addClass("active");

  // lift card
  var cardPickupHeight = 100;
  $currentCardHeightWrapper.css({
    "transform": "translateZ("+ cardPickupHeight +"px)"
  });
  
  // set initial card rotation
  setCardRotation($cardElement);
  
  // allow per-frame rotation after initial transition
  setTimeout(function() {
    $currentCardRotationWrapper.css({
      "transition": "transform 0"
    });
  }, animationTime)
  
  // get initial background for specular animation
  currentCardBG = $currentCardFront.css("background-image");
}

function setCardRotation($cardElement) {
  var rotationMagnitude = 45;
  rotateXdeg = 1 * ($cardElement.offset().top - $kaadoContainer.outerHeight()/2)/$kaadoContainer.outerHeight() * rotationMagnitude/2;
  rotateYdeg = -1 * ($cardElement.offset().left + $cardElement.outerWidth()/2 - $kaadoContainer.outerWidth()/2)/$kaadoContainer.outerWidth() * rotationMagnitude;
  
  $currentCardRotationWrapper.css({
    "transform": "rotateX("+ rotateXdeg +"deg) rotateY("+ rotateYdeg +"deg)"
  })
};

function addSpecularEffect($cardElement) {  
  // constants
  var parallaxSpeed = 2;
  var gradientSize = 1.5;
  var gridXSize = 1;
  var gridYSize = 1;
  
  var cardXPos = $cardElement.offset().left;
  cardXPos = cardXPos % (currentCardWidth * gridXSize*2);
  cardXPos = cardXPos - currentCardWidth;

  var cardYPos = $cardElement.offset().top;
  cardYPos = cardYPos % (currentCardWidth * gridYSize*2);
  cardYPos = cardYPos - currentCardWidth;
  
  var cardXPercent = (1 - (currentCardWidth - cardXPos) / currentCardWidth) * -2 * 100;
  var cardYPercent = (1 - (currentCardHeight - cardYPos) / currentCardHeight) * -2 * 100;
	
	var gradientXpos = ( cardXPercent * parallaxSpeed ) + currentCardWidth/2;
	var gradientYpos = ( cardYPercent * parallaxSpeed ) + currentCardHeight/2;
  
	var gradientString = "radial-gradient("+ (currentCardWidth * gradientSize) +"px at "+ gradientXpos +"px "+ gradientYpos +"px, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.1) 80%, rgba(255,255,255,0) 100%)";
  
	$currentCardFront.css({
	  "background-image": gradientString + ", " + currentCardBG
	});
}

function stopDragging($cardElement) {
  // remove 'active' class
  $cardElement.removeClass("active");
  
  // put card back down
  $currentCardHeightWrapper.removeAttr("style");
        
  // reset card rotation
  $currentCardRotationWrapper.removeAttr("style");
  
  // reset specular
	$currentCardFront.css({
	  "background-image": currentCardBG
	});

  // reset global variables
  rotateXdeg = 0;
  rotateYdeg = 0;
  currentCardBG = null;
}


function kaadoUpdateLoupe($cardElement) {
  $kaadoLoupe.css({
		"background-image": "url("+ $cardElement.data("cardData").frontImage +")"
	});
};

$(document).ready(function() {
  kaadoCacheElements();
  kaadoSetUpCardAreas();
});