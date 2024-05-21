var config  = require('../config.json');
var express = require('express');
var router  = express.Router();
var lib = require('../lib.js');

var lastDirection = [];

// Get the state of the snake
router.get(config.routes.state, function (req, res) {
  // Do something here to calculate the returned state

  // Response data
  var data = {
    name: config.snake.name,
    color: config.snake.color,
    head_url: config.snake.head_url,
    taunt: config.snake.taunt.state,
    state: "alive",
    coords: [],
    score: 0
  };

  return res.json(data);
});

// Start
router.post(config.routes.start, function (req, res) {
  console.log('Game ID:', req.body.game_id);

  lastDirection[req.body.game_id] = null;

  // Response data
  var data = {
    name: config.snake.name,
    color: config.snake.color,
    head_url: (process.env.HEAD_IMAGE_URL || config.snake.head_url),
    taunt: lib.generateStartTaunt(req.body.game_id)
  };

  return res.json(data);
});


// Move
router.post(config.routes.move, function (req, res) {

  var id = req.body.game_id;

  var ourLocation = lib.getOurHeadLocation(req.body.snakes);
  var foodLocation = lib.findClosestFood(ourLocation, req.body.food);
  var move = lib.nextMove(ourLocation, foodLocation, req.body.snakes, req.body.board, lastDirection[id]);
  lastDirection[id] = move;

  var taunt = '';
  if (move === lib.oppositeDirection(lastDirection[id])) {
    taunt = "I'd rather kill myself than feed you.";
    console.log(taunt);
  }

  // Response data
  var data = {
    move: move, // one of: ["up", "down", "left", "right"]
    taunt: taunt
  };

  return res.json(data);
});

// End the session
router.post(config.routes.end, function (req, res) {
  lastDirection[req.body.game_id] = null;

  // We don't need a response so just send back a 200
  res.status(200);
  res.end();
  return;
});


module.exports = router;
