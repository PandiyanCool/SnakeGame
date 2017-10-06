var app = angular.module('plunker', ['ngMaterial']);

app.controller('MainCtrl', function ($scope, $window, $timeout) {
  $scope.name = 'Gamer';
  $scope.score = 0;
  var boardSize = 25;

  // colors set used for paint the cell in board
  var paints = {
    game_end: '#820303',
    fruit: '#E80505',
    snake_head: '#FF33F9',
    snake_body: '#FFA500',
    cell: '#808080'
  };

  // key code of directions
  var runDirections = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, SPACE: 32 };

  // initialization of snake & fruit
  var snake = {
    direction: runDirections.LEFT,
    parts: [{ x: -1, y: -1 }]
  };

  var fruit = { x: -1, y: -1 };

  var interval, tempDirection, isGameOver;

  $scope.paintCell = function (col, row) {
    if (isGameOver) {
      return paints.game_end;
    }
    if (snake.parts[0].x == row && snake.parts[0].y == col) {
      return paints.snake_head;
    }
    if ($scope.board[col][row] === true) {
      return paints.snake_body;
    }
    if (fruit.x == row && fruit.y == col) {
      return paints.fruit;
    }
    return paints.cell;
  };

  function generateBoard() {
    $scope.board = [];
    for (var indexOne = 0; indexOne < boardSize; indexOne++) {
      $scope.board[indexOne] = [];
      for (var indexTwo = 0; indexTwo < boardSize; indexTwo++) {
        $scope.board[indexOne][indexTwo] = false;
      }
    }
  }
  generateBoard();

  $scope.startGame = function () {
    snake = { direction: runDirections.LEFT, parts: [] };
    isGameOver = false;
    interval = 500;
    tempDirection = runDirections.LEFT;

    // Set up initial snake
    for (var i = 0; i < 5; i++) {
      snake.parts.push({ x: 10 + i, y: 10 });
    }

    updateCells();
    updateFruit();
    console.log(snake);
  }

  function updateCells() {
    var newCell = getNewCell();
    
    // check violation of rules
    if (newCell.x === boardSize || newCell.x === -1 || newCell.y === boardSize || newCell.y === -1) {
      isGameOver = true;
      $timeout(function () {
        isGameOver = false;
      }, 500);
      generateBoard();
    }
    if (newCell.x === fruit.x && newCell.y === fruit.y) {
      eatFruit();
    }
    var oldTail = snake.parts.pop();
    $scope.board[oldTail.y][oldTail.x] = false;
    snake.parts.unshift(newCell);
    $scope.board[newCell.y][newCell.x] = true;
    snake.direction = tempDirection;
    $timeout(updateCells, interval);
  }

  function updateFruit() {
    var x = Math.floor(Math.random() * boardSize);
    var y = Math.floor(Math.random() * boardSize);

    if ($scope.board[y][x] === true) {
      return updateFruit();
    }
    fruit = { x: x, y: y };
  }

  function eatFruit() {
    $scope.score++;
    // Grow by 1
    var tail = angular.copy(snake.parts[snake.parts.length - 1]);
    snake.parts.push(tail);
    updateFruit();
  }

  function getNewCell() {
    var newCell = angular.copy(snake.parts[0]);

    // Update Location
    if (tempDirection === runDirections.LEFT) {
      newCell.x -= 1;
    } else if (tempDirection === runDirections.RIGHT) {
      newCell.x += 1;
    } else if (tempDirection === runDirections.UP) {
      newCell.y -= 1;
    } else if (tempDirection === runDirections.DOWN) {
      newCell.y += 1;
    }
    return newCell;
  }


  // Keyboard event capture
  $window.addEventListener("keyup", function (e) {
    if (e.keyCode == runDirections.LEFT && snake.direction !== runDirections.RIGHT) {
      tempDirection = runDirections.LEFT;
    } else if (e.keyCode == runDirections.UP && snake.direction !== runDirections.DOWN) {
      tempDirection = runDirections.UP;
    } else if (e.keyCode == runDirections.RIGHT && snake.direction !== runDirections.LEFT) {
      tempDirection = runDirections.RIGHT;
    } else if (e.keyCode == runDirections.DOWN && snake.direction !== runDirections.UP) {
      tempDirection = runDirections.DOWN;
    }

  });


}).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
  $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
  $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
  $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});
