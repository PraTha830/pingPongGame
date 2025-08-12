const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 12;
const PADDLE_MARGIN = 20;
const PLAYER_SPEED = 10;
const AI_SPEED = 5;

let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;

let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

let playerScore = 0;
let aiScore = 0;

// Mouse controls for player paddle
canvas.addEventListener('mousemove', function (evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle within canvas
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw middle dashed line
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT); // Player
    ctx.fillRect(canvas.width - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT); // AI

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.font = "36px Arial";
    ctx.fillText(playerScore, canvas.width / 2 - 60, 50);
    ctx.fillText(aiScore, canvas.width / 2 + 40, 50);
}

// Move ball and check collisions
function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom walls
    if (ballY <= 0) {
        ballY = 0;
        ballSpeedY = -ballSpeedY;
    }
    if (ballY + BALL_SIZE >= canvas.height) {
        ballY = canvas.height - BALL_SIZE;
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with player paddle
    if (
        ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballX = PADDLE_MARGIN + PADDLE_WIDTH;
        ballSpeedX = -ballSpeedX;
        // Add some "spin" based on where the ball hits the paddle
        let collidePoint = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
        ballSpeedY = collidePoint * 0.25;
    }

    // Ball collision with AI paddle
    if (
        ballX + BALL_SIZE >= canvas.width - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballX = canvas.width - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
        ballSpeedX = -ballSpeedX;
        let collidePoint = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
        ballSpeedY = collidePoint * 0.25;
    }

    // Score (ball out of bounds)
    if (ballX < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + BALL_SIZE > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI paddle movement (simple)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2 - 15) {
        aiY += AI_SPEED;
    } else if (aiCenter > ballY + BALL_SIZE / 2 + 15) {
        aiY -= AI_SPEED;
    }
    // Clamp AI paddle within canvas
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Reset ball to center with random direction
function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();