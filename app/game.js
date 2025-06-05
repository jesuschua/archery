// Import modules
import Bow from './entities/bow.js';
import Arrow from './entities/arrow.js';
import Target from './entities/target.js';
import { drawBow, drawArrow, drawTarget } from './systems/rendering.js';
import { setupInputHandlers, setInputEnabled, isHelperModeEnabled } from './systems/input.js';
import { updateArrow, getReactionMessage, getSpotterHitMessage, getSpotterEndRoundMessage } from './systems/gameLogic.js';
import { randomWind } from './utils/gameUtils.js';
import { drawBackground } from './systems/background.js';
import { drawWind, drawWindIndicator } from './systems/wind.js';
import { drawGamePanel, drawRoundBanner, drawEndOfRoundBanner, createPlayAgainButton, removePlayAgainButton, showReactionMessage, updateReactionMessage, drawReactionMessage } from './systems/ui.js';
import { drawTracer, clearSparkles } from './systems/tracer.js';
import { calculateOptimalAngle, drawHelperMarker } from './systems/helper.js';
import { responsive } from './utils/responsiveUtils.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gravity = 0.025;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', resizeCanvas);

let time = 0;
let targetColor = 'red';
let wind = randomWind();

// Initialize game entities with responsive configurations
let bowConfig = responsive.getBowConfig();
let targetConfig = responsive.getTargetConfig();

let bow = new Bow(bowConfig.x, bowConfig.y, bowConfig.width, bowConfig.height);
let arrow = new Arrow(bow.x, bow.y, canvas.width * 0.01, canvas.height * 0.005);
let target = new Target(targetConfig.x, targetConfig.y, targetConfig.radius, 100, 0.01);

let score = 0;
let triesLeft = 5;
let arrowPath = [];

let leaves = Array.from({ length: 15 }, () => createLeaf());
let showEndOfRound = false;

function createLeaf() {
    // Create varied orange-toned leaves for the wind indicator
    const orangeHues = [20, 25, 30, 35, 40]; // Orange range in HSL
    const selectedHue = orangeHues[Math.floor(Math.random() * orangeHues.length)];
    const saturation = 70 + Math.random() * 20; // 70-90% saturation
    const lightness = 45 + Math.random() * 25;  // 45-70% lightness
    
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        size: 10 + Math.random() * 10,
        angle: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
        sway: Math.random() * 0.5 + 0.5,
        color: `hsl(${selectedHue}, ${saturation}%, ${lightness}%)`
    };
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Update responsive configurations
    bowConfig = responsive.getBowConfig();
    targetConfig = responsive.getTargetConfig();
    
    // Update bow position and size
    bow.x = bowConfig.x;
    bow.y = bowConfig.y;
    bow.width = bowConfig.width;
    bow.height = bowConfig.height;
    
    // Update arrow position and size
    arrow.x = bow.x;
    arrow.y = bow.y;
    arrow.width = canvas.width * 0.01;
    arrow.height = canvas.height * 0.005;
    
    // Update target position and size
    target.x = targetConfig.x;
    target.y = targetConfig.y;
    target.radius = targetConfig.radius;
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

function onSpotterHit() {
    // Show special spotter hit message
    const spotterMessage = getSpotterHitMessage();
    showReactionMessage(spotterMessage);
    
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
    clearSparkles(); // Clear sparkle effects when arrow resets
    triesLeft -= 1;
    if (triesLeft <= 0) {
        // Check for special end-of-round spotter messages
        const specialMessage = getSpotterEndRoundMessage(score, 5);
        if (specialMessage) {
            showReactionMessage(specialMessage);
        }
        
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
    clearSparkles(); // Clear sparkle effects when game resets
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

function drawWindsock(ctx, canvas, wind, time) {
    const poleX = canvas.width * 0.85;
    const poleBottomY = canvas.height * 0.75; // Position on island surface (horizon level)
    const poleTopY = canvas.height * 0.58; // Adjust top accordingly to maintain pole height
    const sockAttachY = poleTopY + 15;
    
    ctx.save();
    
    // Draw pole with gradient for 3D effect
    const poleGradient = ctx.createLinearGradient(poleX - 3, 0, poleX + 3, 0);
    poleGradient.addColorStop(0, '#555555');
    poleGradient.addColorStop(0.5, '#777777');
    poleGradient.addColorStop(1, '#444444');
    
    ctx.fillStyle = poleGradient;
    ctx.fillRect(poleX - 3, poleTopY, 6, poleBottomY - poleTopY);
    
    // Pole cap
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(poleX, poleTopY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Calculate windsock properties based on wind
    const windStrength = Math.abs(wind.strength);
    const windDirection = wind.direction;
    const sockLength = 60 + windStrength * 50; // Length increases with wind strength
    const sockInflation = 0.4 + windStrength * 0.6; // How inflated the sock appears
    const waviness = Math.sin(time * (0.3 + windStrength * 0.8)) * (3 + windStrength * 8);
    
    // Position windsock attachment point
    const attachX = poleX + 8;
    const attachY = sockAttachY;
    
    // Draw attachment ring with more detail
    ctx.fillStyle = '#FF8C42';
    ctx.beginPath();
    ctx.arc(attachX, attachY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FF6B00';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Inner ring
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(attachX, attachY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw windsock fabric with segments
    const segments = 6;
    const segmentLength = sockLength / segments;
    
    for (let i = 0; i < segments; i++) {
        const segmentProgress = i / segments;
        const nextSegmentProgress = (i + 1) / segments;
        
        // Calculate positions for this segment with smoother wave motion
        const waveOffset1 = Math.sin(time * (0.4 + windStrength * 0.8) + i * 0.7) * (2 + windStrength * 4);
        const waveOffset2 = Math.sin(time * (0.4 + windStrength * 0.8) + (i + 1) * 0.7) * (2 + windStrength * 4);
        
        const segStartX = attachX + Math.cos(windDirection) * segmentProgress * sockLength;
        const segStartY = attachY + Math.sin(windDirection) * segmentProgress * sockLength + waveOffset1;
        
        const segEndX = attachX + Math.cos(windDirection) * nextSegmentProgress * sockLength;
        const segEndY = attachY + Math.sin(windDirection) * nextSegmentProgress * sockLength + waveOffset2;
        
        // Segment width decreases along the sock and varies with inflation
        const startWidth = (14 - i * 2) * sockInflation;
        const endWidth = (14 - (i + 1) * 2) * sockInflation;
        
        // Perpendicular vector for width
        const perpX = -Math.sin(windDirection);
        const perpY = Math.cos(windDirection);
        
        // Alternating orange and white stripes
        const isOrangeStripe = i % 2 === 0;
        ctx.fillStyle = isOrangeStripe ? '#FF8C42' : '#FFFFFF';
        ctx.strokeStyle = '#FF6B00';
        ctx.lineWidth = 1;
        
        // Add subtle shadow for depth
        if (isOrangeStripe) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
        } else {
            ctx.shadowColor = 'transparent';
        }
        
        ctx.beginPath();
        ctx.moveTo(segStartX + perpX * startWidth, segStartY + perpY * startWidth);
        ctx.lineTo(segStartX - perpX * startWidth, segStartY - perpY * startWidth);
        ctx.lineTo(segEndX - perpX * endWidth, segEndY - perpY * endWidth);
        ctx.lineTo(segEndX + perpX * endWidth, segEndY + perpY * endWidth);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    
    // Draw connecting lines between segments for definition
    ctx.strokeStyle = '#FF6B00';
    ctx.lineWidth = 1;
    for (let i = 1; i < segments; i++) {
        const segmentProgress = i / segments;
        const waveOffset = Math.sin(time * (0.4 + windStrength * 0.8) + i * 0.7) * (2 + windStrength * 4);
        const segX = attachX + Math.cos(windDirection) * segmentProgress * sockLength;
        const segY = attachY + Math.sin(windDirection) * segmentProgress * sockLength + waveOffset;
        const segWidth = (14 - i * 2) * sockInflation;
        
        const perpX = -Math.sin(windDirection);
        const perpY = Math.cos(windDirection);
        
        ctx.beginPath();
        ctx.moveTo(segX + perpX * segWidth, segY + perpY * segWidth);
        ctx.lineTo(segX - perpX * segWidth, segY - perpY * segWidth);
        ctx.stroke();
    }
    
    // Add subtle pole ground base
    ctx.fillStyle = '#555555';
    ctx.fillRect(poleX - 8, poleBottomY, 16, 4);
    
    ctx.restore();
}

function gameLoop() {
    drawBackground(ctx, canvas, time);
    time += 1;
    target.update(time, canvas.height);
    drawLeaves(ctx);
    drawBow(ctx, bow);
    drawArrow(ctx, arrow, bow);
    drawTarget(ctx, target, targetColor);
    
    // Draw unified control panel with all game info
    const helperEnabled = isHelperModeEnabled();
    drawGamePanel(ctx, score, triesLeft, helperEnabled);
    
    drawRoundBanner(ctx, triesLeft);    drawTracer(ctx, arrowPath);
    drawWind(ctx, canvas, wind);
    drawWindsock(ctx, canvas, wind, time);
    updateLeaves();
    
    // Helper mode - calculate and draw optimal aim
    if (helperEnabled && !arrow.fired && !showEndOfRound) {
        const optimalAngle = calculateOptimalAngle(bow, target, wind, gravity);
        drawHelperMarker(ctx, bow, optimalAngle, helperEnabled);
    }
    
    // Update and draw reaction messages
    updateReactionMessage();
    drawReactionMessage(ctx);
    
    if (showEndOfRound) {
        drawEndOfRoundBanner(ctx, score);
        // Create the Play Again button if it doesn't exist
        if (!document.getElementById('play-again-btn')) {
            createPlayAgainButton(startNewRound);
        }    } else {
        // Remove button if present and update arrow when game is active
        removePlayAgainButton();
        updateArrow(arrow, wind, gravity, arrowPath, target, onArrowHit, onArrowMiss, canvas, onSpotterHit);
    }
    requestAnimationFrame(gameLoop);
}

// Remove updateWind from setupInputHandlers (so wind does not change on mousedown/touchstart)
setupInputHandlers(bow, arrow, () => {}, /* onArrowRelease */);
gameLoop();
