// Import modules
import Bow from './entities/bow.js';
import Arrow from './entities/Arrow.js';
import Target from './entities/target.js';
import { drawBow, drawArrow, drawTarget } from './systems/rendering.js';
import { setupInputHandlers, setInputEnabled } from './systems/input.js';
import { updateArrow, getReactionMessage } from './systems/gameLogic.js';
import { randomWind } from './utils/gameUtils.js';
import { drawBackground } from './systems/background.js';
import { drawWind, drawWindIndicator } from './systems/wind.js';
import { drawScore, drawTriesLeft, drawRoundBanner, drawEndOfRoundBanner, createPlayAgainButton, removePlayAgainButton, showReactionMessage, updateReactionMessage, drawReactionMessage } from './systems/ui.js';
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
let triesLeft = 5;
let arrowPath = [];

let leaves = Array.from({ length: 15 }, () => createLeaf());
let windGaugeFlapAngle = 0;
let windGaugeFlapSpeed = 0;
let showEndOfRound = false;

function createLeaf() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        size: 10 + Math.random() * 10,
        angle: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
        sway: Math.random() * 0.5 + 0.5,
        color: `hsl(${90 + Math.random() * 40}, 60%, 50%)`
    };
}

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
    wind = randomWind(); // Wind changes for each shot
}

function onArrowHit(distance) {
    score += 1;
    targetColor = 'green';
    setTimeout(() => { targetColor = 'red'; }, 500);
    
    // Show reaction message based on accuracy (hit = perfect)
    const message = getReactionMessage(0, target.radius); // 0 distance for hit
    showReactionMessage(message);
    
    resetArrow();
}

function onArrowMiss(distance) {
    // Show reaction message based on how close the miss was
    const message = getReactionMessage(distance, target.radius);
    showReactionMessage(message);
    
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
        showEndOfRound = true;
        setInputEnabled(false); // Disable game input when round ends
    } else {
        updateWind();
    }
}

function startNewRound() {
    showEndOfRound = false;
    removePlayAgainButton();
    resetGame();
    setInputEnabled(true);
}

function resetGame() {
    score = 0;
    triesLeft = 5;
    targetColor = 'red';
    arrow.fired = false;
    arrow.x = bow.x;
    arrow.y = bow.y;
    arrow.vx = 0;
    arrow.vy = 0;
    arrow.speed = 0;
    arrow.angle = bow.angle;
    arrowPath = [];
    updateWind(); // Set wind for the first shot of the round
}

function updateLeaves() {
    for (let leaf of leaves) {
        // Wind effect
        const windSpeed = 2 + Math.abs(wind.strength) * 4;
        leaf.x += windSpeed * Math.cos(wind.direction) * 0.7;
        leaf.y += windSpeed * Math.sin(wind.direction) * 0.7 + Math.sin(time * 0.05 + leaf.sway) * 0.5;
        leaf.angle += 0.02 * wind.strength;
        // Wrap around
        if (leaf.x > canvas.width + 20) leaf.x = -20;
        if (leaf.x < -20) leaf.x = canvas.width + 20;
        if (leaf.y > canvas.height * 0.7) leaf.y = Math.random() * canvas.height * 0.3;
        if (leaf.y < 0) leaf.y = canvas.height * 0.7;
    }
}

function drawLeaves(ctx) {
    for (let leaf of leaves) {
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.angle);
        ctx.fillStyle = leaf.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, leaf.size, leaf.size / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawWindGauge(ctx, canvas, wind, time) {
    // Gauge base
    const centerX = canvas.width * 0.85;
    const centerY = canvas.height * 0.15;
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 36, Math.PI * 0.7, Math.PI * 2.3, false);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#888';
    ctx.stroke();
    // Needle
    const needleLength = 32;
    const needleAngle = wind.direction;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(needleAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(needleLength, 0);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#e33';
    ctx.stroke();
    ctx.restore();
    // Flapping flag
    ctx.save();
    ctx.translate(centerX + Math.cos(needleAngle) * needleLength, centerY + Math.sin(needleAngle) * needleLength);
    // Flap angle and speed depend on wind strength
    windGaugeFlapSpeed = 0.2 + Math.abs(wind.strength) * 0.8;
    windGaugeFlapAngle = Math.sin(time * windGaugeFlapSpeed) * (10 + 20 * Math.abs(wind.strength)) * Math.PI / 180;
    ctx.rotate(needleAngle + windGaugeFlapAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -8);
    ctx.lineTo(28 + 30 * Math.abs(wind.strength), 0);
    ctx.lineTo(0, 8);
    ctx.closePath();
    ctx.fillStyle = '#f7e96b';
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.restore();
}

function gameLoop() {
    drawBackground(ctx, canvas);
    time += 1;
    target.update(time, canvas.height);
    drawLeaves(ctx);
    drawBow(ctx, bow);
    drawArrow(ctx, arrow, bow);
    drawTarget(ctx, target, targetColor);
    drawScore(ctx, score);
    drawTriesLeft(ctx, triesLeft);
    drawRoundBanner(ctx, triesLeft);
    drawTracer(ctx, arrowPath);
    drawWind(ctx, canvas, wind);
    drawWindGauge(ctx, canvas, wind, time);
    updateLeaves();
    
    // Update and draw reaction messages
    updateReactionMessage();
    drawReactionMessage(ctx);
    
    if (showEndOfRound) {
        drawEndOfRoundBanner(ctx, score);
        // Create the Play Again button if it doesn't exist
        if (!document.getElementById('play-again-btn')) {
            createPlayAgainButton(startNewRound);
        }
    } else {
        // Remove button if present and update arrow when game is active
        removePlayAgainButton();
        updateArrow(arrow, wind, gravity, arrowPath, target, onArrowHit, onArrowMiss);
    }
    requestAnimationFrame(gameLoop);
}

// Remove updateWind from setupInputHandlers (so wind does not change on mousedown/touchstart)
setupInputHandlers(bow, arrow, () => {}, /* onArrowRelease */);
gameLoop();
