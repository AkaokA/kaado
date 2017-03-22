function getNetrunnerJSON() {
  $.ajax({
    type: "GET",
    url: "https://netrunnerdb.com/api/2.0/public/deck/884983", 
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
  var cardBackImage = "assets/images/cardback-corp.png";
  
	var cards = nrdbData.data[0].cards;	
	
	$.each(cards, function(cardID, quantity) {
		for (i = 0; i < quantity; i++) {
			decklist.push(new kaadoCard(cardID, "https://netrunnerdb.com/card_image/"+ cardID +".png", cardBackImage));
		}
	});
	
	kaadoShuffle(decklist);
	console.log(decklist);
	kaadoBuildDeck(decklist);
}