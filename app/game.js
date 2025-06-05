// Import modules
import Bow from './entities/bow.js';
import Arrow from './entities/Arrow.js';
import Target from './entities/target.js';
import { drawBow, drawArrow, drawTarget } from './systems/rendering.js';
import { setupInputHandlers } from './systems/input.js';
import { updateArrow } from './systems/gameLogic.js';
import { randomWind } from './utils/gameUtils.js';
import { drawBackground } from './systems/background.js';
import { drawWind, drawWindIndicator } from './systems/wind.js';
import { drawScore, drawTriesLeft } from './systems/ui.js';
import { drawTracer } from './systems/tracer.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gravity = 0.025;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', resizeCanvas);

let time = 0;
let targetColor = 'red';
let target_ratio = 0.012;
let wind = randomWind();

let bow = new Bow(canvas.width * 0.3, canvas.height * 0.5, canvas.width * 0.05, canvas.height * 0.2);
let arrow = new Arrow(bow.x, bow.y, canvas.width * 0.02, canvas.height * 0.01);
let target = new Target(canvas.width * 0.9, canvas.height * 0.5, canvas.width * target_ratio, 100, 0.01);

let score = 0;
let triesLeft = 3;
let arrowPath = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bow.x = canvas.width * 0.3;
    bow.y = canvas.height * 0.5;
    bow.width = canvas.width * 0.05;
    bow.height = canvas.height * 0.2;
    arrow.x = bow.x;
    arrow.y = bow.y;
    arrow.width = canvas.width * 0.02;
    arrow.height = canvas.height * 0.01;
    target.x = canvas.width * 0.9;
    target.y = canvas.height * 0.5;
    target.radius = canvas.width * target_ratio;
}

function updateWind() {
    wind = randomWind();
}

function onArrowHit() {
    score += 1;
    targetColor = 'green';
    setTimeout(() => { targetColor = 'red'; }, 500);
    resetArrow();
}

function onArrowMiss() {
    resetArrow();
}

function resetArrow() {
    arrow.fired = false;
    arrow.x = bow.x;
    arrow.y = bow.y;
    arrow.vx = 0;
    arrow.vy = 0;
    arrow.speed = 0;
    arrow.angle = bow.angle;
    arrowPath = [];
    triesLeft -= 1;
    if (triesLeft <= 0) {
        setTimeout(() => {
            alert(`Game Over! Your score: ${score}`);
            resetGame();
        }, 500);
    }
}

function resetGame() {
    score = 0;
    triesLeft = 3;
    targetColor = 'red';
    arrow.fired = false;
    arrow.x = bow.x;
    arrow.y = bow.y;
    arrow.vx = 0;
    arrow.vy = 0;
    arrow.speed = 0;
    arrow.angle = bow.angle;
    arrowPath = [];
}

function gameLoop() {
    drawBackground(ctx, canvas);
    time += 1;
    target.update(time, canvas.height);
    drawBow(ctx, bow);
    drawArrow(ctx, arrow, bow);
    drawTarget(ctx, target, targetColor);
    drawScore(ctx, score);
    drawTriesLeft(ctx, triesLeft);
    drawTracer(ctx, arrowPath);
    drawWind(ctx, canvas, wind);
    drawWindIndicator(ctx, canvas, wind);
    updateArrow(arrow, wind, gravity, arrowPath, target, onArrowHit, onArrowMiss);
    requestAnimationFrame(gameLoop);
}

setupInputHandlers(bow, arrow, updateWind);
gameLoop();
