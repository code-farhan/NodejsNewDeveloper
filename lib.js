'use strict';

var config = require('./config');

function getOurHeadLocation(snakes) {
  var i, snake;

  for (i = 0; i < snakes.length; i++) {
    snake = snakes[i];
    if (snake.name === config.snake.name) {
      return {
        x: snake.coords[0][0],
        y: snake.coords[0][1]
      };
    }
  }

  throw new Error("We are not in the map.");
}
exports.getOurHeadLocation = getOurHeadLocation;

function distance(x1, y1, x2, y2) {
  return Math.sqrt(
    Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)
  );
}

function findClosestFood(ourLocation, food) {
  var closest = {
    distance: Number.MAX_VALUE,
    coords: {
      x: 0,
      y: 0
    }
  };
  var i, d;
  for (i = 0; i < food.length; i++) {
    d = distance(ourLocation.x, ourLocation.y, food[i][0], food[i][1]);
    if (d <= closest.distance) {
      closest.distance = d;
      closest.coords = {
        x: food[i][0],
        y: food[i][1]
      };
    }
  }

  return {
    x: closest.coords.x,
    y: closest.coords.y
  };
}
exports.findClosestFood = findClosestFood;

function oppositeDirection(direction) {
  switch (direction) {
  case 'up':
    return 'down';
  case 'down':
    return 'up';
  case 'left':
    return 'right';
  case 'right':
    return 'left';
  default:
    throw new Error("Unknown direction: " + direction);
  }
}
exports.oppositeDirection = oppositeDirection;

function isLocationSafe(pos, board) {
  var tile = board[pos.x][pos.y];

  if (tile === undefined) { // Outside of board.
    return false;
  }

  switch (tile.state) {
  case 'food':
  case 'empty':
    return true;
  default:
    return false;
  }
}


exports.nextMove = function nextMove(ourLocation, foodLocation, snakes, board, lastDirection) {
  var move;

  var deltaX = foodLocation.x - ourLocation.x;
  var deltaY = foodLocation.y - ourLocation.y;

  var newCoords = {
    x: ourLocation.x,
    y: ourLocation.y
  };

  if (deltaX > 0) {
    move = 'right';
    newCoords.x++;
  } else if (deltaX < 0) {
    move = 'left';
    newCoords.x--;
  } else if (deltaY > 0) {
    move = 'down';
    newCoords.y++;
  } else if (deltaY < 0) {
    move = 'up';
    newCoords.y--;
  } else {
    console.log('Both deltaX and deltaY are zero.');
  }

  var allMoves = ['up', 'down', 'left', 'right'];

  while (true) {
    if (isLocationSafe(newCoords, board)) {
      break;
    }

    var index = allMoves.indexOf(move);
    allMoves.splice(index, 1);

    newCoords.x = ourLocation.x;
    newCoords.y = ourLocation.y;

    if (allMoves.length === 0) {
      // No possible moves.
      if (lastDirection === null) {
        return 'right'; // Why not.
      } else {
        return oppositeDirection(lastDirection);
      }
    }

    move = allMoves[0];

    switch (move) {
    case 'up':
      newCoords.y--;
      break;
    case 'down':
      newCoords.y++;
      break;
    case 'left':
      newCoords.x--;
      break;
    case 'right':
      newCoords.x++;
      break;
    }
  }

  return move;
};

exports.generateStartTaunt = function generateStartTaunt(gameId) {
  var idParts = gameId.split('-');
  return "Time for a " + idParts[idParts.length - 1] + "-nado!";
};


