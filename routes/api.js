var express = require('express');
var router = express.Router();

const deck = {
    id: 1,
    name: 'Radford Ellenburg - Alabama States',
    cards: [
      '1 Shinka, the Bloodsoaked Keep',
      '1 Eiganjo Castle',
      '3 City of Brass',
      '3 Mountain',
      '12 Plains',
      '4 Samurai of the Pale Curtain',
      '1 Nagao, Bound by Honor',
      '3 Kami of Ancient Law',
      '3 Hearth Kami',
      '1 Eight-and-a-Half-Tails',
      '4 Savannah Lions',
      '4 Leonin Skyhunter',
      '1 Masako the Humorless',
      '2 Isamaru, Hound of Konda',
      '4 Lantern Kami',
      '4 Electrostatic Bolt',
      '3 Otherworldly Journey',
      '2 Raise the Alarm',
      '4 Glorious Anthem',
      'Sideboard',
      '1 Mountain',
      '2 Auriok Champion',
      '2 Sacred Ground',
      '3 Shatter',
      '3 Karma',
      '4 Guerrilla Tactics',
    ]
};

router.get('/api/decks', function(request, response, next) {
    response.json({
      decks: [
          deck
      ]
  })
});

router.get('/api/decks/:id', function(request, response, next) {
    const id = request.params.id
    response.json(deck)
});

module.exports = router;
