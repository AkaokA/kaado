var kaadoCardList = [];
class kaadoCard {
  constructor (cardID, frontImage, backImage) {
    this.cardID = cardID;
    this.frontImage = frontImage;
    this.backImage = backImage;
  }
}

// Kaado parameters
var animationTime = 200;

// global vars
var rotateXdeg = 0;
var rotateYdeg = 0;

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

function startDragging(helper) {
  helper.addClass("active");
  
  // lift card
  var cardPickupHeight = 100;
  helper.children(".card-height-wrapper").css({
    "transform": "translateZ("+ cardPickupHeight +"px)"
  });
  
  // set initial card rotation
  setCardRotation(helper);
  
  // allow per-frame rotation after initial transition
  setTimeout(function() {
    helper.find(".card-rotation-wrapper").css({
      "transition": "transform 0"
    });
  }, animationTime)
}

function stopDragging(helper) {
  helper.removeClass("active");
  
  // put card back down
  helper.children(".card-height-wrapper").removeAttr("style");
        
  // reset card rotation
  helper.find(".card-rotation-wrapper").removeAttr("style");
  
  // reset rotation variables
  rotateXdeg = 0;
  rotateYdeg = 0;
}

function setCardRotation($cardElement) {
  var rotationMagnitude = 45;
  rotateXdeg = 1 * ($cardElement.offset().top - $kaadoContainer.outerHeight()/2)/$kaadoContainer.outerHeight() * rotationMagnitude/2;
//   var rotateXdeg = 0;
  rotateYdeg = -1 * ($cardElement.offset().left + $cardElement.outerWidth()/2 - $kaadoContainer.outerWidth()/2)/$kaadoContainer.outerWidth() * rotationMagnitude;
  $cardElement.find(".card-rotation-wrapper").css({
    "transform": "rotateX("+ rotateXdeg +"deg) rotateY("+ rotateYdeg +"deg)"
  })
};

function specularParallax($cardElement) {
	var adjustment = 0;
	var gradientString = "linear-gradient(120deg, rgba(255,255,255,0) "+ (-20 - adjustment) +"%,rgba(255,255,255,0.4) "+ (50 - adjustment) +"%,rgba(255,255,255,0) "+ (80 - adjustment) +"%, rgba(255,255,255,0) 100%), ";
				
	$cardElement.css({
	  "background-image": gradientString,
	});
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