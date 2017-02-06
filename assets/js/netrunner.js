function getNetrunnerJSON() {
  $.ajax({
    type: "GET",
    url: "https://netrunnerdb.com/api/2.0/public/deck/863455", 
    dataType: "json",
    crossDomain: true,
    success: function (data) {
      console.log("NRDB data loaded: ", data);
      netrunnerData(data);
    },
    error: function (xhr, ajaxOptions, thrownError) {
	    console.log(thrownError);
    }
  });	
}

function netrunnerData(nrdbData) {
	var cards = nrdbData.data[0].cards;	
	
	$.each(cards, function(cardID, quantity) {
		for (i = 0; i < quantity; i++) {
			decklist.push(cardID);
		}
	});
	
	shuffle(decklist);
	console.log(decklist);
	
	buildDeck(decklist);
}

var hoveredCardID;
function buildDeck(decklist) {
	for (var i = 0; i < decklist.length; i++) {
		kaadoCreateCard($(".play-area"));
		
		$(".card-element:last-child .front").css({
			"background-image": "url('https://netrunnerdb.com/card_image/"+ decklist[i] +".png')"
		})
		$(".card-element:last-child .back").css({
			"background-image": "url('assets/images/cardback-runner.png')"
		})
	}
};

