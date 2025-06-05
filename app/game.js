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
import { createTouchFeedback, updateTouchFeedback, drawTouchFeedback } from './systems/touchFeedback.js';
import { addStuckArrow, drawStuckArrows, clearStuckArrows } from './systems/stuckArrows.js';
import { createImpactEffect, updateImpactEffects, drawImpactEffects, clearImpactEffects } from './systems/impactEffects.js';

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

// Initialize leaves with responsive count
let leaves = Array.from({ length: responsive.getParticleCount() }, () => createLeaf());
let showEndOfRound = false;

function createLeaf() {
    // Create varied orange-toned leaves for the wind indicator
    const orangeHues = [20, 25, 30, 35, 40]; // Orange range in HSL
    const selectedHue = orangeHues[Math.floor(Math.random() * orangeHues.length)];
    const saturation = 70 + Math.random() * 20; // 70-90% saturation
    const lightness = 45 + Math.random() * 25;  // 45-70% lightness
    
    // Adjust base size based on screen size
    const baseSizeMin = responsive.isMobile ? 6 : 10;
    const baseSizeMax = responsive.isMobile ? 12 : 20;
    const baseSize = baseSizeMin + Math.random() * (baseSizeMax - baseSizeMin);
    
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        size: baseSize * responsive.scaleFactor,
        width: baseSize * responsive.scaleFactor,
        height: (baseSize / 3) * responsive.scaleFactor,
        angle: Math.random() * Math.PI * 2,
        speed: (0.5 + Math.random() * 1.5) * responsive.scaleFactor, // Scale speed with device
        sway: Math.random() * 0.5 + 0.5,
        opacity: 0.5 + Math.random() * 0.5, // Vary opacity for depth
        color: `hsl(${selectedHue}, ${saturation}%, ${lightness}%)`
    };
}

function resizeCanvas() {
    // Save old dimensions to detect orientation change
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    
    // Update canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Check if orientation changed
    const orientationChanged = 
        (oldWidth > oldHeight && canvas.width < canvas.height) || 
        (oldWidth < oldHeight && canvas.width > canvas.height);
    
    // Provide haptic feedback for orientation change on mobile
    if (orientationChanged && responsive.isMobile) {
        responsive.provideTapFeedback('light');
    }
    
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
    
    // Recreate leaves with new responsive scaling
    leaves = Array.from({ length: responsive.getParticleCount() }, () => createLeaf());
}

function updateWind() {
    wind = randomWind(); // Wind changes for each shot
}

function onArrowHit(distance) {
    score += 1;
    targetColor = 'green';
    setTimeout(() => { targetColor = 'red'; }, 500);
    
    // Add the arrow to the stuck arrows collection before resetting it
    addStuckArrow(arrow, target);
    
    // Create visual impact effect at the arrow's tip position (where collision occurred)
    const arrowLength = 150;
    const arrowTipX = arrow.x + Math.cos(arrow.angle) * (arrowLength / 2);
    const arrowTipY = arrow.y + Math.sin(arrow.angle) * (arrowLength / 2);
    createImpactEffect(arrowTipX, arrowTipY);
    
    // Provide haptic feedback on hit (stronger than miss)
    if (responsive.isMobile) {
        responsive.provideTapFeedback('medium');
    }
    
    // Show reaction message based on accuracy (hit = perfect)
    const message = getReactionMessage(0, target.radius); // 0 distance for hit
    showReactionMessage(message);
    
    resetArrow();
}

function onArrowMiss(distance) {
    // Provide light haptic feedback on miss
    if (responsive.isMobile) {
        responsive.provideTapFeedback('light');
    }
    
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
    clearStuckArrows(); // Clear any arrows stuck to the target
    clearImpactEffects(); // Clear any impact effects
    updateWind(); // Set wind for the first shot of the round
}

function updateLeaves() {
    // Get the number of leaves based on device capability
    const targetLeafCount = responsive.getParticleCount();
    
    // Dynamically adjust leaf count based on device capability
    if (leaves.length < targetLeafCount) {
        // Add more leaves if needed
        while (leaves.length < targetLeafCount) {
            leaves.push(createLeaf());
        }
    } else if (leaves.length > targetLeafCount) {
        // Remove excess leaves for better performance on mobile
        leaves = leaves.slice(0, targetLeafCount);
    }
    
    for (let leaf of leaves) {
        // Scale wind effect based on device
        const windSpeed = (1 + Math.abs(wind.strength) * 2) * responsive.scaleFactor;
        
        // Smoother movement for mobile with less jitter
        leaf.x += windSpeed * Math.cos(wind.direction) * 0.7;
        
        // Gentler vertical movement on mobile
        const verticalFactor = responsive.isMobile ? 0.3 : 0.7;
        leaf.y += windSpeed * Math.sin(wind.direction) * verticalFactor + Math.sin(time * 0.05 + leaf.sway) * 0.5;
        
        // Gentler rotation on mobile
        const rotationFactor = responsive.isMobile ? 0.5 : 1.0;
        leaf.angle += 0.02 * wind.strength * rotationFactor;
        
        // Wrap around with smooth transitions
        if (leaf.x > canvas.width + leaf.width) {
            leaf.x = -leaf.width;
            // Randomize Y when wrapping for more natural effect
            leaf.y = Math.random() * canvas.height * 0.3;
        }
        if (leaf.x < -leaf.width) {
            leaf.x = canvas.width + leaf.width;
            leaf.y = Math.random() * canvas.height * 0.3;
        }
        if (leaf.y > canvas.height * 0.7) leaf.y = Math.random() * canvas.height * 0.3;
        if (leaf.y < 0) leaf.y = canvas.height * 0.7;
    }
}

function drawLeaves(ctx) {
    // Skip rendering some leaves on mobile for performance if there are many
    const skipFactor = responsive.isSmallMobile && leaves.length > 10 ? 2 : 1;
    
    for (let i = 0; i < leaves.length; i += skipFactor) {
        const leaf = leaves[i];
        ctx.save();
        
        // Leaf location
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.angle);
        
        // Use opacity for depth effect
        ctx.globalAlpha = leaf.opacity;
        
        // Fill with proper color
        ctx.fillStyle = leaf.color;
        
        // Draw leaf as ellipse with responsive size
        ctx.beginPath();
        ctx.ellipse(0, 0, leaf.width, leaf.height, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle detail line for larger leaves (skip on small mobile for performance)
        if (!responsive.isSmallMobile && leaf.width > 5) {
            ctx.strokeStyle = `hsla(${leaf.color.split('(')[1].split(',')[0]}, ${leaf.opacity * 100}%, 40%, 0.3)`;
            ctx.lineWidth = 1 * responsive.scaleFactor;
            ctx.beginPath();
            ctx.moveTo(-leaf.width * 0.5, 0);
            ctx.lineTo(leaf.width * 0.5, 0);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

function drawWindsock(ctx, canvas, wind, time) {
    // Use responsive positioning based on screen size
    const poleX = canvas.width * 0.85;
    const poleBottomY = canvas.height * 0.75; // Position on island surface (horizon level)
    const poleTopY = canvas.height * 0.58; // Adjust top accordingly to maintain pole height
    
    // Apply responsive scaling to elements
    const poleWidth = 6 * responsive.scaleFactor;
    const poleCapRadius = 4 * responsive.scaleFactor;
    const attachmentOffset = 8 * responsive.scaleFactor;
    const ringRadius = 7 * responsive.scaleFactor;
    const innerRingRadius = 4 * responsive.scaleFactor;
    const lineWidth = 2 * responsive.scaleFactor;
    
    // Calculate attachment point with responsive positioning
    const sockAttachY = poleTopY + 15 * responsive.scaleFactor;
    
    ctx.save();
    
    // Draw pole with gradient for 3D effect
    const poleGradient = ctx.createLinearGradient(poleX - poleWidth/2, 0, poleX + poleWidth/2, 0);
    poleGradient.addColorStop(0, '#555555');
    poleGradient.addColorStop(0.5, '#777777');
    poleGradient.addColorStop(1, '#444444');
    
    ctx.fillStyle = poleGradient;
    ctx.fillRect(poleX - poleWidth/2, poleTopY, poleWidth, poleBottomY - poleTopY);
    
    // Pole cap
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(poleX, poleTopY, poleCapRadius, 0, Math.PI * 2);
    ctx.fill();
      // Calculate windsock properties based on wind with responsive scaling
    const windStrength = Math.abs(wind.strength);
    const windDirection = wind.direction;    // Use fixed windsock size based on device
    const baseSockLength = responsive.isMobile ? 40 : 60;
    const sockLength = baseSockLength * responsive.scaleFactor;
    
    // Keep waviness to show wind strength through animation
    const waviness = Math.sin(time * (0.3 + windStrength * 0.8)) * (3 + windStrength * 8) * responsive.scaleFactor;
    
    // Position windsock attachment point
    const attachX = poleX + attachmentOffset;
    const attachY = sockAttachY;
    
    // Draw attachment ring with more detail and responsive sizing
    ctx.fillStyle = '#FF8C42';
    ctx.beginPath();
    ctx.arc(attachX, attachY, ringRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FF6B00';
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    // Inner ring
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(attachX, attachY, innerRingRadius, 0, Math.PI * 2);
    ctx.fill();
      // Draw windsock fabric with segments
    const segments = responsive.isSmallMobile ? 4 : 6; // Reduce segments on small mobile for performance
    const segmentLength = sockLength / segments;
    
    for (let i = 0; i < segments; i++) {
        const segmentProgress = i / segments;
        const nextSegmentProgress = (i + 1) / segments;
        
        // Calculate positions for this segment with smoother wave motion - scale waviness by device
        const waveScale = responsive.scaleFactor;
        const waveOffset1 = Math.sin(time * (0.4 + windStrength * 0.8) + i * 0.7) * (2 + windStrength * 4) * waveScale;
        const waveOffset2 = Math.sin(time * (0.4 + windStrength * 0.8) + (i + 1) * 0.7) * (2 + windStrength * 4) * waveScale;
        
        const segStartX = attachX + Math.cos(windDirection) * segmentProgress * sockLength;
        const segStartY = attachY + Math.sin(windDirection) * segmentProgress * sockLength + waveOffset1;
        
        const segEndX = attachX + Math.cos(windDirection) * nextSegmentProgress * sockLength;
        const segEndY = attachY + Math.sin(windDirection) * nextSegmentProgress * sockLength + waveOffset2;
          // Base segment width that scales with device
        const baseSegmentWidth = 14 * responsive.scaleFactor;
        
        // Segment width decreases along the sock with fixed tapering
        const startWidth = baseSegmentWidth - i * 2 * responsive.scaleFactor;
        const endWidth = baseSegmentWidth - (i + 1) * 2 * responsive.scaleFactor;
        
        // Perpendicular vector for width
        const perpX = -Math.sin(windDirection);
        const perpY = Math.cos(windDirection);
        
        // Alternating orange and white stripes
        const isOrangeStripe = i % 2 === 0;
        ctx.fillStyle = isOrangeStripe ? '#FF8C42' : '#FFFFFF';
        ctx.strokeStyle = '#FF6B00';
        ctx.lineWidth = 1 * responsive.scaleFactor; // Scale line width
        
        // Add subtle shadow for depth - only on higher-end devices for performance
        if (isOrangeStripe && !responsive.isSmallMobile) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 3 * responsive.scaleFactor;
            ctx.shadowOffsetX = 1 * responsive.scaleFactor;
            ctx.shadowOffsetY = 1 * responsive.scaleFactor;
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
    ctx.lineWidth = 1 * responsive.scaleFactor;
    
    // Skip detailed connecting lines on small mobile for performance
    if (!responsive.isSmallMobile || segments <= 4) {
        for (let i = 1; i < segments; i++) {
            const segmentProgress = i / segments;
            const waveScale = responsive.scaleFactor;
            const waveOffset = Math.sin(time * (0.4 + windStrength * 0.8) + i * 0.7) * (2 + windStrength * 4) * waveScale;
            const segX = attachX + Math.cos(windDirection) * segmentProgress * sockLength;
            const segY = attachY + Math.sin(windDirection) * segmentProgress * sockLength + waveOffset;
              // Scale segment width properly
            const baseSegmentWidth = 14 * responsive.scaleFactor;
            const segWidth = baseSegmentWidth - i * 2 * responsive.scaleFactor;
            
            const perpX = -Math.sin(windDirection);
            const perpY = Math.cos(windDirection);
            
            ctx.beginPath();
            ctx.moveTo(segX + perpX * segWidth, segY + perpY * segWidth);
            ctx.lineTo(segX - perpX * segWidth, segY - perpY * segWidth);
            ctx.stroke();
        }
    }
    
    // Add subtle pole ground base with responsive sizing
    const baseWidth = 16 * responsive.scaleFactor;
    const baseHeight = 4 * responsive.scaleFactor;
    ctx.fillStyle = '#555555';
    ctx.fillRect(poleX - baseWidth/2, poleBottomY, baseWidth, baseHeight);
    
    ctx.restore();
}

// Add frame rate limiting for mobile optimization
let lastFrameTime = 0;
let frameCount = 0;
let frameRateDivisor = 1; // For frame skipping on mobile

function gameLoop(timestamp) {
    // Check for orientation change - reduce quality during transitions
    if (responsive.isOrientationChanging()) {
        // Render at lower quality during orientation changes
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw only essential elements during orientation change
        drawBackground(ctx, canvas, time);
        drawBow(ctx, bow);
        drawTarget(ctx, target, targetColor);
        
        // Continue the loop but skip heavy rendering
        requestAnimationFrame(gameLoop);
        return;
    }
    
    // Frame rate limiting for mobile devices
    const targetFPS = responsive.getOptimalFrameRate();
    const frameInterval = 1000 / targetFPS;
    
    // Skip frames if needed based on device performance
    if (responsive.isMobile) {
        frameRateDivisor = responsive.isSmallMobile ? 2 : 1;
        frameCount = (frameCount + 1) % frameRateDivisor;
        if (frameCount !== 0 && timestamp - lastFrameTime < frameInterval * 0.8) {
            requestAnimationFrame(gameLoop);
            return;
        }
    }
    
    // Only update if enough time has passed (for smoother consistent animation)
    if (timestamp - lastFrameTime >= frameInterval || !lastFrameTime) {
        lastFrameTime = timestamp;
          // Clear canvas for clean rendering
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw game elements
        drawBackground(ctx, canvas, time);
        time += 1;
        target.update(time, canvas.height);
        drawLeaves(ctx);
        drawBow(ctx, bow);
        
        // Mobile touch feedback        updateTouchFeedback();
        drawTouchFeedback(ctx);
        drawArrow(ctx, arrow, bow);
        drawTarget(ctx, target, targetColor);
        
        // Draw any arrows that are stuck in the target
        drawStuckArrows(ctx, target);
            // Draw unified control panel with all game info
        const helperEnabled = isHelperModeEnabled();
        drawGamePanel(ctx, score, triesLeft, helperEnabled, wind);
        
        drawRoundBanner(ctx, triesLeft);
        
        // Update and draw impact effects
        updateImpactEffects();
        drawImpactEffects(ctx);
        
        // Conditionally draw tracer for performance on mobile
        if (!responsive.isSmallMobile || !responsive.shouldReduceEffects()) {
            drawTracer(ctx, arrowPath);        }
        
        // Only draw separate wind panel on desktop
        if (!responsive.isMobile) {
            drawWind(ctx, canvas, wind);
        }
        drawWindsock(ctx, canvas, wind, time);
        updateLeaves();
          // Helper mode - calculate and draw optimal aim (only when needed)
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
            }
        } else {
            // Remove button if present and update arrow when game is active
            removePlayAgainButton();
            updateArrow(arrow, wind, gravity, arrowPath, target, onArrowHit, onArrowMiss, canvas, onSpotterHit);
        }
    }
    
    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Remove updateWind from setupInputHandlers (so wind does not change on mousedown/touchstart)
setupInputHandlers(bow, arrow, () => {}, /* onArrowRelease */);
gameLoop();
