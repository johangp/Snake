document.addEventListener("keydown", keyDownHandler, false);

    // Canvas definition
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");

    // Snake direction
    var rightDirection = true;
    var leftDirection = false;
    var downDirection = false;
    var upDirection = false;

    // Snake definition
    var initialX = 60;
    var initialY = 40;
    var snakeWidth = 9;
    var snakeHeight = 9;
    var snakePadding = 1;
    var snakeDimension = snakePadding + snakeWidth;
    var snakeLength = 3;
    var snakeBody = [{x: initialX, y: initialY}];
    var snakeHead = snakeBody[0];
    var snakeColor = "#0095DD";

    // Snake movement
    var dx = snakeDimension;
    var dy = snakeDimension;

    var onGrowth = false;
    var score = 0;

    // Food definition
    var foodWidth = snakeWidth;
    var foodHeight = snakeHeight;
    var foodColor = "#dd2126";
    var foodX = 0;
    var foodY = 0;

    function randomIntFromInterval(min, max) {
        var value = Math.floor(Math.random() * (max - min + 1) + min)
        if (value % 10 !== 0)
            return randomIntFromInterval(min, max);
        return value;
    }


    function checkDirection() {
        if (rightDirection && dx < 0) {
            dx = -dx;
        } else if (leftDirection && dx > 0) {
            dx = -dx;
        } else if (downDirection && dy < 0) {
            dy = -dy;
        } else if (upDirection && dy > 0) {
            dy = -dy;
        }
    }

    function keyDownHandler(e) {
        if (e.keyCode === 37 && !rightDirection) {
            leftDirection = true;
            downDirection = false;
            upDirection = false;
        }
        else if (e.keyCode === 38 && !downDirection) {
            upDirection = true;
            leftDirection = false;
            rightDirection = false;
        }
        else if (e.keyCode === 39 && !leftDirection) {
            rightDirection = true;
            downDirection = false;
            upDirection = false;

        } else if (e.keyCode === 40 && !upDirection) {
            downDirection = true;
            rightDirection = false;
            leftDirection = false;
        }
        checkDirection();
    }

    function drawSnake() {
        for (var i = 0; i < snakeLength; i++) {
            context.beginPath();
            context.rect(snakeBody[i].x, snakeBody[i].y, snakeWidth, snakeHeight);
            context.fillStyle = snakeColor;
            context.fill();
            context.closePath();
        }
    }

    function moveBody() {
        for (var i = snakeLength - 1; i > 0; i--) {
            snakeBody[i].x = snakeBody[i - 1].x;
            snakeBody[i].y = snakeBody[i - 1].y;
        }
    }

    function moveHead() {
        if (rightDirection || leftDirection) {
            if (snakeHead.x + dx > canvas.width) {
                snakeHead.x = 0;
            } else if (snakeHead.x + dx < 0) {
                snakeHead.x = canvas.width;
            } else {
                snakeHead.x += dx;
            }
        } else {
            if (snakeHead.y + dy > canvas.height) {
                snakeHead.y = 0;
            } else if (snakeHead.y + dy < 0) {
                snakeHead.y = canvas.height;
            } else {
                snakeHead.y += dy;
            }
        }
    }

    function drawFood() {
        context.beginPath();
        context.rect(foodX, foodY, foodWidth, foodHeight);
        context.fillStyle = foodColor;
        context.fill();
        context.closePath();
    }

    function drawScore() {
        context.font = "16px Arial";
        context.fillStyle = "#4fdd20";
        context.fillText("Score: " + score, 8, 20);
    }

    function checkFood() {
        if (snakeHead.x === foodX && snakeHead.y === foodY) {
            score += 10;
            snakeLength++;
            snakeBody.unshift({x: foodX, y: foodY});
            snakeHead = snakeBody[0];
            onGrowth = true;
            generateFoodPosition();
        }
    }

    function generateFoodPosition() {
        foodX = randomIntFromInterval(10, canvas.width - 10);
        foodY = randomIntFromInterval(10, canvas.height - 10);
    }

    function generateSnakeBody() {
        for (var i = 1; i < snakeLength; i++) {
            var current = {x: snakeBody[i - 1].x - (snakeWidth + snakePadding), y: initialY};
            snakeBody.push({x: current.x, y: current.y});
        }
    }

    function initializeValues() {
        generateFoodPosition();
        generateSnakeBody();
    }

    function checkGameOver() {
        for (var i = 4; i < snakeLength; i++) {
            if (snakeHead.x + dx === snakeBody[i].x && snakeHead.y === snakeBody[i].y) {
                alert("GAME OVER, YOUR SCORE: " + score);
                document.location.reload();
            }
        }
    }

    function draw() {
        setTimeout(function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            checkGameOver();
            drawFood();
            drawSnake();
            drawScore();
            if (!onGrowth) {
                moveBody();
                moveHead();
            } else {
                moveHead();
                onGrowth = false;
            }
            checkFood();
            requestAnimationFrame(draw);
        }, 1000 / 15);
    }

    initializeValues();
    draw();