// Select Canvas Element From Html
const cvs = document.getElementById('game');
const ctx = cvs.getContext("2d");

// To make Color Theck
ctx.lineWidth = 2;

// paddle 
const paddle_width = 100;
const paddle_margin_bottom = 50;
const paddle_height = 20;
const ballRadius = 8;
const scoreUnite = 10;

let leftArrow = false;
let rightArrow = false;
let life = 3;
let score = 0;
let level = 1;
let maxLevel = 3;
let gameEnd = false;

// Start The Game
function startTheGame() {
    let overlay = document.createElement("div");
    // Add Class To Overlay
    overlay.className = "popup-overlay";
    // Append Overlay To The Body
    document.body.appendChild(overlay);
    // Create The Popup Box
    let popupBox = document.createElement("div");
    // Add Class To Popup Box
    popupBox.className = "popup-box";
    // create text for heading
    let textHeading = document.createElement("h3");
    textHeading.innerText = `Hello There !`;
    // append the heading to the popup box
    popupBox.appendChild(textHeading);
    // Append The Popup Box TO Body
    document.body.appendChild(popupBox);
    // add image
    let image = document.createElement("img");
    image.src = "img/welcome.png";
    image.className = "popupImge moving";
    popupBox.appendChild(image);
    // Create Play Again Button
    let start = document.createElement("button");
    // Add Class Name to button
    start.className = "btn";
    // Inner Play Again Text
    start.innerText = "Start";
    // Append The Buttom To Popup Box
    popupBox.appendChild(start);

    document.addEventListener('click', function(ev) {
        brickHit.play();
        if(ev.target.className == "btn") {
            // Remove The Popup
            ev.target.parentNode.remove();
            // remove overlay
            document.querySelector(".popup-overlay").remove();
            loop();
        }
    })
}
startTheGame();

// Create The Paddle
const paddle = {
    x: cvs.width/2 - paddle_width/2,
    y: cvs.height - paddle_margin_bottom - paddle_height,
    width: paddle_width,
    height: paddle_height,
    dx: 5
}

// Draw The Paddle
function drawPaddle() {
    ctx.fillStyle = "#f57f17";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// control the paddle with keyboard
document.addEventListener("keydown", function(e) {
    if(e.key == 'ArrowLeft') {
        leftArrow = true;
    } else if(e.key == 'ArrowRight') {
        rightArrow = true;
    }
})
document.addEventListener("keyup", function(e) {
    if(e.key == 'ArrowLeft') {
        leftArrow = false;
    } else if(e.key == 'ArrowRight') {
        rightArrow = false;
    }
})
// control the paddle with mouse
document.addEventListener("mousemove", mouseMoveHandler, false);
function mouseMoveHandler(e) {
    const relativeX = e.clientX - cvs.offsetLeft;
    if (relativeX > 0 && relativeX < cvs.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
}
// Move  Paddle Function
function movePaddle() {
    if(rightArrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if(leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}
// create the ball
const ball = {
    x: cvs.width/2,
    y: paddle.y - ballRadius,
    radius: ballRadius,
    speed: 7,
    dx: 3,
    dy: -3
}

// draw the ball function
function drawBall() {
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#ff7043";
    ctx.fill();

    ctx.strokeStyle = "#fff8b6";
    ctx.stroke();

    ctx.closePath();
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function ballCollision() {
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {    
        ball.dx = - ball.dx;
    }
    if(ball.y - ball.radius < 0) {
        ball.dy = - ball.dy;
    }
    if(ball.y + ball.radius > cvs.height) {
        life--;
        failed.play();
        resetBall();
    }
}

function resetBall() {

    ball.x = cvs.width/2;
    
    ball.y = paddle.y - ballRadius;
    
    ball.dx = 3;
    
    ball.dy = -3;
}

// The Collision Between Paddle And The Ball
function blpaddleCollision() {
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y < paddle.y + paddle.height && ball.y > paddle.y) {
        
        let collidePoint = ball.x - (paddle.x + paddle.width/2);
        collidePoint = collidePoint / (paddle.width/2);
        let angle = collidePoint * Math.PI/3;
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
        wallHit.play();
    }
}
// Draw Bricks
const brick = {
    row: 3,
    coulmn: 8,
    width: 54,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "#2e3548",
    strokeColor: "#FFF"
}
// function To Create Brickes
let bricks = [];
function createBrickes() {
    for(let row = 0; row < brick.row; row++) {
        bricks[row] = []
        for(let col = 0; col < brick.coulmn; col++) {
            bricks[row][col] = {
                x: col * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: row * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true,
                count: 0
            }
        }
    }
}
createBrickes()

function drawBricks() {
    for(let row = 0; row < brick.row; row++) {
        for(let col = 0; col < brick.coulmn; col++) {
            let brk = bricks[row][col];
            // check if the brick is not broken
            if(brk.status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(brk.x, brk.y, brick.width, brick.height);
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(brk.x, brk.y, brick.width, brick.height);
            }
            if(brk.count == 1) {
                ctx.fillStyle = "#eee";
                ctx.fillRect(brk.x, brk.y, brick.width, brick.height);
                ctx.strokeStyle = "#fff";
                ctx.strokeRect(brk.x, brk.y, brick.width, brick.height);
            }
        }
    }
}
// collision of ball brick
function ballBrickCollision() {
    for(let row = 0; row < brick.row; row++) {
        for(let col = 0; col < brick.coulmn; col++) {
            let brk = bricks[row][col];
            // check if the brick is not broken
            if(brk.status) {
                if(ball.x + ball.radius > brk.x && ball.x - ball.radius < brk.x + brick.width &&
                    ball.y + ball.radius > brk.y && ball.y - ball.radius < brk.y + brick.height) {
                        brk.count++;
                        if(brk.count == 1) {
                            brickHit.play();
                            ball.dy = - ball.dy;
                            brk.status = true;
                        }
                        if(brk.count == 2) {
                            brickHit.play();
                            ball.dy = - ball.dy;
                            brk.status = false;
                            score += scoreUnite;
                        }
                }
            }
        }
    }
}

function gameStatus(text, textX, textY, img, imgX, imgY) {
    // draw text
    ctx.fillStyle = '#FFF';
    ctx.font = "25px DRAGON HUNTER";
    ctx.fillText(text, textX, textY);

    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

// draw function

// have paddle and ball draw functions
function draw() {
    drawPaddle()
    drawBall()
    drawBricks()
    //Show Score
    gameStatus(score, 35, 25, scoreImg, 5, 5);
    //show Life
    gameStatus(life, cvs.width - 25, 25, lifeImg, cvs.width-55, 5);
    //Show Level
    gameStatus(level, cvs.width/2, 25, levelImg, cvs.width/2 - 30, 5);
}
// Game Over 
function gameOver() {
    if(life <= 0) {
        gameEnd = true;
        failed.play();
        popUp("ooh you are failed", "img/failed.png");
    } 
}

// New Levels
function levelsUp() {
    let levelDone = true;
    for(let row = 0; row < brick.row; row++) {
        for(let col = 0; col < brick.coulmn; col++) {
            levelDone = levelDone && ! bricks[row][col].status;
        }
    }
    if(levelDone) {
        if(level >= maxLevel) {
            gameEnd = true;
            win.play();
            popUp("Congratulations", "img/success.png");
        }
        win.play();
        brick.row++;
        createBrickes();
        ball.speed += 1;
        resetBall();
        level++;
    }
}
// update function 
function update() {
    movePaddle()

    moveBall()

    ballCollision()

    blpaddleCollision()

    ballBrickCollision()
    
    gameOver()
    
    levelsUp()
}
// repeate functions
function loop() {
    ctx.drawImage(bg, 0, 0);
    
    draw()

    update()
    if(!gameEnd) {
        requestAnimationFrame(loop);
    }
}

function popUp(message, img) {
    let overlay = document.createElement("div");
    // Add Class To Overlay
    overlay.className = "popup-overlay";
    // Append Overlay To The Body
    document.body.appendChild(overlay);
    // Create The Popup Box
    let popupBox = document.createElement("div");
    // Add Class To Popup Box
    popupBox.className = "popup-box";
    // create text for heading
    let textHeading = document.createElement("h3");
    textHeading.innerText = `${message}`;
    // append the heading to the popup box
    popupBox.appendChild(textHeading);
    // Append The Popup Box TO Body
    document.body.appendChild(popupBox);
    // add image
    let image = document.createElement("img");
    image.src = `${img}`;
    image.className = "popupImge";
    popupBox.appendChild(image);
    // Show Score
    let scoreTex = document.createElement('span');
    scoreTex.setAttribute("class", "score");
    scoreTex.innerText = `Your Score: ${score}`;
    popupBox.appendChild(scoreTex);
    // Create Play Again Button
    let playAgain = document.createElement("button");
    // Add Class Name to button
    playAgain.className = "btn";
    // Inner Play Again Text
    playAgain.innerText = "Play Again";
    // Append The Buttom To Popup Box
    popupBox.appendChild(playAgain);
    // create close span
    let closeButton = document.createElement("span");
    // create the close button text
    let closeButtonText = document.createTextNode("x");
    // append text to close button
    closeButton.appendChild(closeButtonText);
    // add class to close button
    closeButton.className = "close-button";
    // add close button to popup box
    popupBox.appendChild(closeButton);
    // close the popup
    document.addEventListener("click", function(e) {
    if (e.target.className == "close-button") {
    // Remove The Popup
    e.target.parentNode.remove();
    close();
    // remove overlay
    document.querySelector(".popup-overlay").remove();
}
});
document.addEventListener('click', function(ev) {
    brickHit.play();
    if(ev.target.className == "btn") {
        // Remove The Popup
        // ev.target.parentNode.remove();
        // document.querySelector(".popup-overlay").remove();
        location.reload();
    }
    })
}
