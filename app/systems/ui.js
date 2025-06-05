// UI rendering system for the archery game - Orange & White Minimalist Theme with Mobile Support

import { responsive } from '../utils/responsiveUtils.js';

// Reaction message state
let reactionMessage = '';
let reactionMessageOpacity = 0;
let reactionMessageTimer = 0;
let spotterAnimationFrame = 0;

export function drawGamePanel(ctx, score, triesLeft, helperEnabled, wind) {
    const config = responsive.getGamePanelConfig();
    
    ctx.save();
    
    // Main panel background with elegant shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 12 * responsive.scaleFactor;
    ctx.shadowOffsetX = 3 * responsive.scaleFactor;
    ctx.shadowOffsetY = 3 * responsive.scaleFactor;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 3 * responsive.scaleFactor;
    ctx.beginPath();
    ctx.roundRect(config.x, config.y, config.width, config.height, 18 * responsive.scaleFactor);
    ctx.fill();
    ctx.stroke();
    
    ctx.shadowColor = 'transparent';
    
    // Compact mobile layout
    if (responsive.isMobile) {
        // Two-row grid layout for mobile
        const topRowY = config.y + config.height * 0.3;
        const bottomRowY = config.y + config.height * 0.7;
        const colWidth = config.width / 2;
        
        // Top Left: Score
        ctx.fillStyle = '#FF6B00';
        ctx.font = responsive.getScaledFont(config.fontSize.title);
        ctx.fillText('Score:', config.x + config.padding, topRowY);
        
        ctx.fillStyle = '#333333';
        ctx.font = responsive.getScaledFont(config.fontSize.value);
        ctx.fillText(`${score}`, config.x + config.padding + 50 * responsive.scaleFactor, topRowY);
        
        // Top Right: Tries Left
        ctx.fillStyle = triesLeft <= 1 ? '#FF4757' : '#FF6B00';
        ctx.font = responsive.getScaledFont(config.fontSize.title);
        ctx.fillText('Tries:', config.x + colWidth, topRowY);
        
        ctx.fillStyle = '#333333';
        ctx.font = responsive.getScaledFont(config.fontSize.value);
        ctx.fillText(`${triesLeft}`, config.x + colWidth + 50 * responsive.scaleFactor, topRowY);
        
        // Bottom Left: Wind speed
        if (wind) {
            ctx.fillStyle = '#FF6B00';
            ctx.font = responsive.getScaledFont(config.fontSize.title);
            ctx.fillText('Wind:', config.x + config.padding, bottomRowY);
            
            ctx.fillStyle = '#333333';
            ctx.font = responsive.getScaledFont(config.fontSize.value);
            ctx.fillText(`${wind.strength.toFixed(1)} m/s`, config.x + config.padding + 50 * responsive.scaleFactor, bottomRowY);
        }
        
        // Bottom Right: Wind Direction
        if (wind) {
            ctx.fillStyle = '#FF6B00';
            ctx.font = responsive.getScaledFont(config.fontSize.title);
            ctx.fillText('Dir:', config.x + colWidth, bottomRowY);
            
            ctx.fillStyle = '#333333';
            ctx.font = responsive.getScaledFont(config.fontSize.value);
            ctx.fillText(`${Math.round(wind.direction * 180 / Math.PI)}°`, config.x + colWidth + 40 * responsive.scaleFactor, bottomRowY);
        }
        
        // Helper indicator (positioned at top-right corner)
        if (helperEnabled) {
            ctx.fillStyle = '#FF8C42';
            ctx.beginPath();
            ctx.arc(config.x + config.width - 15 * responsive.scaleFactor, 
                   config.y + 15 * responsive.scaleFactor, 
                   6 * responsive.scaleFactor, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = responsive.getScaledFont(10);
            ctx.textAlign = 'center';
            ctx.fillText('H', config.x + config.width - 15 * responsive.scaleFactor, 
                        config.y + 19 * responsive.scaleFactor);
            ctx.textAlign = 'start';
        }
    } else {
        // Desktop layout (existing)
        const sectionHeight = 35;
        
        // Section 1: Score
        const scoreY = config.y + config.padding + 20;
        ctx.fillStyle = '#FF6B00';
        ctx.font = responsive.getScaledFont(config.fontSize.title);
        ctx.fillText('Score:', config.x + config.padding, scoreY);
        
        ctx.fillStyle = '#333333';
        ctx.font = responsive.getScaledFont(config.fontSize.value);
        ctx.fillText(`${score}`, config.x + 100, scoreY);
        
        // Divider line
        ctx.strokeStyle = 'rgba(255, 140, 66, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(config.x + config.padding, scoreY + 12);
        ctx.lineTo(config.x + config.width - config.padding, scoreY + 12);
        ctx.stroke();
        
        // Section 2: Tries Left
        const triesY = scoreY + sectionHeight;
        const isLow = triesLeft <= 1;
        const triesColor = isLow ? '#FF4757' : '#FF6B00';
        
        ctx.fillStyle = triesColor;
        ctx.font = responsive.getScaledFont(20);
        ctx.fillText('Tries Left:', config.x + config.padding, triesY);
        
        ctx.fillStyle = '#333333';
        ctx.font = responsive.getScaledFont(24);
        ctx.fillText(`${triesLeft}`, config.x + 130, triesY);
        
        // Divider line
        ctx.strokeStyle = 'rgba(255, 140, 66, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(config.x + config.padding, triesY + 12);
        ctx.lineTo(config.x + config.width - config.padding, triesY + 12);
        ctx.stroke();
        
        // Section 3: Helper Mode
        const helperY = triesY + sectionHeight;
        const helperStatusColor = helperEnabled ? '#FF8C42' : '#999999';
        const helperBgColor = helperEnabled ? 'rgba(255, 140, 66, 0.1)' : 'transparent';
        
        // Helper status background highlight
        if (helperEnabled) {
            ctx.fillStyle = helperBgColor;
            ctx.beginPath();
            ctx.roundRect(config.x + 8, helperY - 18, config.width - 16, 28, 8);
            ctx.fill();
        }
        
        ctx.fillStyle = helperStatusColor;
        ctx.font = responsive.getScaledFont(18);
        ctx.fillText(`Helper: ${helperEnabled ? 'ON' : 'OFF'}`, config.x + config.padding, helperY);
        
        // Helper instruction
        ctx.fillStyle = helperEnabled ? '#FF8C42' : '#BBBBBB';
        ctx.font = responsive.getScaledFont(config.fontSize.small);
        ctx.fillText('Press H to toggle', config.x + 150, helperY);
    }
    
    ctx.restore();
}

export function drawRoundBanner(ctx, triesLeft) {
    if (triesLeft === 5) {
        const config = responsive.getBannerConfig();
        
        ctx.save();
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 12 * responsive.scaleFactor;
        ctx.shadowOffsetX = 3 * responsive.scaleFactor;
        ctx.shadowOffsetY = 3 * responsive.scaleFactor;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
        ctx.strokeStyle = '#FF8C42';
        ctx.lineWidth = 4 * responsive.scaleFactor;
        ctx.beginPath();
        ctx.roundRect(config.x, config.y, config.width, config.height, 20 * responsive.scaleFactor);
        ctx.fill();
        ctx.stroke();
        
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#FF6B00';
        ctx.font = responsive.getScaledFont(config.fontSize);
        ctx.textAlign = 'center';
        
        // Calculate vertical centering based on font size
        const textY = config.y + config.height / 2 + (config.fontSize * 0.33);
        ctx.fillText('New Round!', config.x + config.width / 2, textY);
        
        ctx.textAlign = 'start';
        
        ctx.restore();
    }
}

export function drawEndOfRoundBanner(ctx, score) {
    const config = responsive.getEndGameBannerConfig();
    
    ctx.save();
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 16 * responsive.scaleFactor;
    ctx.shadowOffsetX = 4 * responsive.scaleFactor;
    ctx.shadowOffsetY = 4 * responsive.scaleFactor;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 5 * responsive.scaleFactor;
    ctx.beginPath();
    ctx.roundRect(config.x, config.y, config.width, config.height, 32 * responsive.scaleFactor);
    ctx.fill();
    ctx.stroke();
    
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#FF6B00';
    ctx.font = responsive.getScaledFont(config.fontSize.title);
    ctx.textAlign = 'center';
    
    // Calculate title position - adjust vertical spacing based on banner size
    const titleY = config.y + config.height * 0.4;
    ctx.fillText('Round Over!', config.x + config.width / 2, titleY);
    
    // Calculate score position with proper spacing from title
    const scoreY = config.y + config.height * 0.7;
    ctx.fillStyle = '#333333';
    ctx.font = responsive.getScaledFont(config.fontSize.score);
    ctx.fillText(`Your Score: ${score}`, config.x + config.width / 2, scoreY);
    
    ctx.textAlign = 'start';
    ctx.restore();
}

export function createPlayAgainButton(onPlayAgain) {
    // Remove existing button if present
    const existingButton = document.getElementById('play-again-btn');
    if (existingButton) {
        existingButton.remove();
    }
    
    const config = responsive.getPlayAgainButtonConfig();
    
    const button = document.createElement('button');
    button.id = 'play-again-btn';
    button.textContent = 'Play Again';
    button.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, ${config.offsetY}px);
        width: ${config.width}px;
        height: ${config.height}px;
        font-size: ${config.fontSize}px;
        font-weight: 600;
        font-family: "Inter", "Segoe UI", system-ui, sans-serif;
        background: #FF8C42;
        color: white;
        border: ${Math.max(2, 3 * responsive.scaleFactor)}px solid #FF6B00;
        border-radius: ${config.height / 2}px;
        cursor: pointer;
        z-index: 10000;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 ${4 * responsive.scaleFactor}px ${12 * responsive.scaleFactor}px rgba(255, 140, 66, 0.3);
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
    `;
    
    // Enhanced hover/touch effects
    const addActiveStyle = () => {
        button.style.background = '#FF6B00';
        button.style.transform = `translate(-50%, ${config.offsetY}px) scale(1.05)`;
        button.style.boxShadow = `0 ${6 * responsive.scaleFactor}px ${20 * responsive.scaleFactor}px rgba(255, 107, 0, 0.4)`;
    };
    
    const removeActiveStyle = () => {
        button.style.background = '#FF8C42';
        button.style.transform = `translate(-50%, ${config.offsetY}px) scale(1)`;
        button.style.boxShadow = `0 ${4 * responsive.scaleFactor}px ${12 * responsive.scaleFactor}px rgba(255, 140, 66, 0.3)`;
    };
    
    // Desktop events
    button.addEventListener('mouseenter', addActiveStyle);
    button.addEventListener('mouseleave', removeActiveStyle);
    
    // Mobile-friendly touch events
    button.addEventListener('touchstart', addActiveStyle);
    button.addEventListener('touchend', removeActiveStyle);
    button.addEventListener('touchcancel', removeActiveStyle);
    
    // Add click handler
    button.addEventListener('click', onPlayAgain);
    
    document.body.appendChild(button);
    return button;
}

export function removePlayAgainButton() {
    const button = document.getElementById('play-again-btn');
    if (button) {
        button.remove();
    }
}

export function showReactionMessage(message) {
    reactionMessage = message;
    reactionMessageOpacity = 1;
    reactionMessageTimer = 90; // Show for ~1.5 seconds at 60fps (longer for reading)
    spotterAnimationFrame = 0;
}

export function updateReactionMessage() {
    if (reactionMessageTimer > 0) {
        reactionMessageTimer--;
        spotterAnimationFrame++;
        // Smooth fade out in the last 15 frames
        if (reactionMessageTimer < 15) {
            reactionMessageOpacity = reactionMessageTimer / 15;
        }
    } else {
        reactionMessage = '';
        reactionMessageOpacity = 0;
        spotterAnimationFrame = 0;
    }
}

function drawSpotter(ctx, canvas, showingReaction = false) {
    // Position spotter near the base of the windsock mast (properly scaled)
    const poleX = canvas.width * 0.85; // Same X as windsock pole
    const spotterX = poleX - 20; // Slightly to the left of mast
    const spotterY = canvas.height * 0.75 - 15; // On island surface (horizon at 0.75) with character height offset
    
    ctx.save();
    
    // Silhouette style - much smaller scale to match mast proportions
    const headRadius = 4;
    const bodyHeight = 12;
    const bodyWidth = 6;
    const armLength = 8;
    const legLength = 10;
    
    // Subtle animation for reactions
    const bounce = showingReaction ? Math.sin(spotterAnimationFrame * 0.4) * 0.5 : 0;
    const armWave = showingReaction ? Math.sin(spotterAnimationFrame * 0.3) * 3 : 0;
    
    // Fill silhouette with dark color for contrast
    ctx.fillStyle = '#333333';
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 1;
    
    // Head - simple circle
    ctx.beginPath();
    ctx.arc(spotterX, spotterY + bounce, headRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Body - simple rectangle
    ctx.fillRect(spotterX - bodyWidth/2, spotterY + headRadius + bounce, bodyWidth, bodyHeight);
    
    // Arms - simple lines with animation
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    // Left arm
    ctx.beginPath();
    ctx.moveTo(spotterX - bodyWidth/2, spotterY + headRadius + 3 + bounce);
    ctx.lineTo(spotterX - armLength + armWave, spotterY + headRadius + 8 + bounce);
    ctx.stroke();
    
    // Right arm - pointing gesture when reacting
    const rightArmAngle = showingReaction ? -0.3 + armWave * 0.02 : 0.2;
    ctx.beginPath();
    ctx.moveTo(spotterX + bodyWidth/2, spotterY + headRadius + 3 + bounce);
    ctx.lineTo(spotterX + bodyWidth/2 + Math.cos(rightArmAngle) * armLength, 
               spotterY + headRadius + 8 + bounce + Math.sin(rightArmAngle) * armLength);
    ctx.stroke();
    
    // Legs - simple lines
    ctx.beginPath();
    ctx.moveTo(spotterX - 2, spotterY + headRadius + bodyHeight + bounce);
    ctx.lineTo(spotterX - 3, spotterY + headRadius + bodyHeight + legLength + bounce);
    ctx.moveTo(spotterX + 2, spotterY + headRadius + bodyHeight + bounce);
    ctx.lineTo(spotterX + 3, spotterY + headRadius + bodyHeight + legLength + bounce);
    ctx.stroke();
    
    // Optional hat silhouette for coach identity
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.ellipse(spotterX, spotterY - 2 + bounce, headRadius + 1, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function drawSpeechBubble(ctx, canvas, message, opacity) {
    // Calculate spotter position (same as in drawSpotter)
    const poleX = canvas.width * 0.85;
    const spotterX = poleX - 20;
    const spotterY = canvas.height * 0.75 - 15; // On island surface (horizon at 0.75) with character height offset
    
    // Get responsive configuration
    const config = responsive.getSpeechBubbleConfig();
    
    // Position bubble above and to the left of spotter
    const bubbleX = spotterX - config.width + 20; // Position to left of spotter
    const bubbleY = spotterY - config.height - 20; // Position above spotter
    
    ctx.save();
    ctx.globalAlpha = opacity;
    
    // Main bubble with responsive shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 8 * responsive.scaleFactor;
    ctx.shadowOffsetX = 3 * responsive.scaleFactor;
    ctx.shadowOffsetY = 3 * responsive.scaleFactor;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 3 * responsive.scaleFactor;
    
    // Bubble body
    ctx.beginPath();
    ctx.roundRect(bubbleX, bubbleY, config.width, config.height, 16 * responsive.scaleFactor);
    ctx.fill();
    ctx.stroke();
    
    // Speech bubble tail pointing correctly to spotter
    ctx.shadowColor = 'transparent';
    ctx.beginPath();
    // Calculate tail position to point toward spotter's head
    const tailCenterX = bubbleX + config.width - 40 * responsive.scaleFactor; // Tail on right side of bubble
    const tailBaseY = bubbleY + config.height;
    const tailWidth = 8 * responsive.scaleFactor;
    
    ctx.moveTo(tailCenterX - tailWidth, tailBaseY);
    ctx.lineTo(spotterX, spotterY - 4); // Point directly to spotter's head
    ctx.lineTo(tailCenterX + tailWidth, tailBaseY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Text with coaching enthusiasm and responsive sizing
    ctx.fillStyle = '#FF6B00';
    ctx.font = responsive.getScaledFont(config.fontSize);
    ctx.textAlign = 'center';
    
    // Add some animation to the text
    const textY = bubbleY + config.height/2 + config.fontSize / 3;
    const bounce = Math.sin(spotterAnimationFrame * 0.3) * 1;
    ctx.fillText(message, bubbleX + config.width/2, textY + bounce);
    
    // Add some coaching-style emphasis marks (responsive)
    if (message === "Perfect!" || message === "Excellent!") {
        ctx.fillStyle = '#FFD700';
        ctx.font = responsive.getScaledFont(Math.max(10, 12 * responsive.scaleFactor));
        ctx.fillText('★', bubbleX + config.width - 15 * responsive.scaleFactor, bubbleY + 15 * responsive.scaleFactor);
        ctx.fillText('★', bubbleX + 10 * responsive.scaleFactor, bubbleY + 15 * responsive.scaleFactor);
    }
    
    ctx.textAlign = 'start';
    ctx.restore();
}

export function getSpotterHitbox(canvas) {
    // Calculate spotter position (same as in drawSpotter)
    const poleX = canvas.width * 0.85;
    const spotterX = poleX - 20;
    const spotterY = canvas.height * 0.75 - 15;
    
    // Spotter dimensions for hitbox
    const headRadius = 4;
    const bodyHeight = 12;
    const bodyWidth = 6;
    const legLength = 10;
    
    // Total character dimensions for hitbox
    const totalWidth = Math.max(bodyWidth, headRadius * 2);
    const totalHeight = headRadius * 2 + bodyHeight + legLength;
    
    return {
        x: spotterX,
        y: spotterY - headRadius, // Top of head
        width: totalWidth,
        height: totalHeight,
        centerX: spotterX,
        centerY: spotterY + (totalHeight / 2) - headRadius
    };
}

export function drawReactionMessage(ctx) {
    const canvas = ctx.canvas;
    
    // Always draw the spotter character
    const isShowingReaction = reactionMessage && reactionMessageOpacity > 0;
    drawSpotter(ctx, canvas, isShowingReaction);
    
    // Draw speech bubble if there's a reaction
    if (isShowingReaction) {
        drawSpeechBubble(ctx, canvas, reactionMessage, reactionMessageOpacity);
    }
}
