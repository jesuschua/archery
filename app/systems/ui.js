// UI rendering system for the archery game - Orange & White Minimalist Theme

// Reaction message state
let reactionMessage = '';
let reactionMessageOpacity = 0;
let reactionMessageTimer = 0;
let spotterAnimationFrame = 0;

export function drawGamePanel(ctx, score, triesLeft, helperEnabled) {
    const panelX = 20;
    const panelY = 20;
    const panelWidth = 280;
    const panelHeight = 140;
    const sectionHeight = 35;
    const padding = 15;
    
    ctx.save();
    
    // Main panel background with elegant shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 18);
    ctx.fill();
    ctx.stroke();
    
    ctx.shadowColor = 'transparent';
    
    // Section 1: Score
    const scoreY = panelY + padding + 20;
    ctx.fillStyle = '#FF6B00';
    ctx.font = 'bold 22px "Inter", "Segoe UI", system-ui, sans-serif';
    ctx.fillText('Score:', panelX + padding, scoreY);
    
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 26px "Inter", "Segoe UI", system-ui, sans-serif';
    ctx.fillText(`${score}`, panelX + 100, scoreY);
    
    // Divider line
    ctx.strokeStyle = 'rgba(255, 140, 66, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(panelX + padding, scoreY + 12);
    ctx.lineTo(panelX + panelWidth - padding, scoreY + 12);
    ctx.stroke();
    
    // Section 2: Tries Left
    const triesY = scoreY + sectionHeight;
    const isLow = triesLeft <= 1;
    const triesColor = isLow ? '#FF4757' : '#FF6B00';
    
    ctx.fillStyle = triesColor;
    ctx.font = 'bold 20px "Inter", "Segoe UI", system-ui, sans-serif';
    ctx.fillText('Tries Left:', panelX + padding, triesY);
    
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 24px "Inter", "Segoe UI", system-ui, sans-serif';
    ctx.fillText(`${triesLeft}`, panelX + 130, triesY);
    
    // Divider line
    ctx.strokeStyle = 'rgba(255, 140, 66, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(panelX + padding, triesY + 12);
    ctx.lineTo(panelX + panelWidth - padding, triesY + 12);
    ctx.stroke();
    
    // Section 3: Helper Mode
    const helperY = triesY + sectionHeight;
    const helperStatusColor = helperEnabled ? '#FF8C42' : '#999999';
    const helperBgColor = helperEnabled ? 'rgba(255, 140, 66, 0.1)' : 'transparent';
    
    // Helper status background highlight
    if (helperEnabled) {
        ctx.fillStyle = helperBgColor;
        ctx.beginPath();
        ctx.roundRect(panelX + 8, helperY - 18, panelWidth - 16, 28, 8);
        ctx.fill();
    }
    
    ctx.fillStyle = helperStatusColor;
    ctx.font = 'bold 18px "Inter", "Segoe UI", system-ui, sans-serif';
    ctx.fillText(`Helper: ${helperEnabled ? 'ON' : 'OFF'}`, panelX + padding, helperY);
    
    // Helper instruction
    ctx.fillStyle = helperEnabled ? '#FF8C42' : '#BBBBBB';
    ctx.font = '14px "Inter", "Segoe UI", system-ui, sans-serif';
    ctx.fillText('Press H to toggle', panelX + 150, helperY);
    
    ctx.restore();
}

export function drawScore(ctx, score) {
    ctx.save();
    
    // Clean minimalist panel with orange accent
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(15, 15, 160, 48, 16);
    ctx.fill();
    ctx.stroke();
    
    // Clean typography
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#FF6B00';
    ctx.font = 'bold 24px "Segoe UI", system-ui, sans-serif';
    ctx.fillText(`Score:`, 28, 42);
    
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 28px "Segoe UI", system-ui, sans-serif';
    ctx.fillText(`${score}`, 110, 45);
    
    ctx.restore();
}

export function drawTriesLeft(ctx, triesLeft) {
    ctx.save();
    
    // Color scheme based on tries remaining
    const isLow = triesLeft <= 1;
    const accentColor = isLow ? '#FF4757' : '#FF8C42';
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(15, 70, 200, 44, 16);
    ctx.fill();
    ctx.stroke();
    
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 20px "Segoe UI", system-ui, sans-serif';
    ctx.fillText(`Tries Left:`, 28, 95);
    
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 24px "Segoe UI", system-ui, sans-serif';
    ctx.fillText(`${triesLeft}`, 150, 97);
    
    ctx.restore();
}

export function drawRoundBanner(ctx, triesLeft) {
    if (triesLeft === 5) {
        ctx.save();
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
        ctx.strokeStyle = '#FF8C42';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(ctx.canvas.width/2-160, 30, 320, 54, 20);
        ctx.fill();
        ctx.stroke();
        
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#FF6B00';
        ctx.font = 'bold 32px "Segoe UI", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('New Round!', ctx.canvas.width/2, 68);
        ctx.textAlign = 'start';
        
        ctx.restore();
    }
}

export function drawEndOfRoundBanner(ctx, score) {
    ctx.save();
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(ctx.canvas.width/2-220, ctx.canvas.height/2-80, 440, 160, 32);
    ctx.fill();
    ctx.stroke();
    
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#FF6B00';
    ctx.font = 'bold 36px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Round Over!', ctx.canvas.width/2, ctx.canvas.height/2-20);
    
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 28px "Segoe UI", system-ui, sans-serif';
    ctx.fillText(`Your Score: ${score}`, ctx.canvas.width/2, ctx.canvas.height/2+30);
    ctx.textAlign = 'start';
    
    ctx.restore();
}

export function createPlayAgainButton(onPlayAgain) {
    // Remove existing button if present
    const existingButton = document.getElementById('play-again-btn');
    if (existingButton) {
        existingButton.remove();
    }
    
    const button = document.createElement('button');
    button.id = 'play-again-btn';
    button.textContent = 'Play Again';
    button.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, 120px);
        width: 200px;
        height: 60px;
        font-size: 22px;
        font-weight: 600;
        font-family: "Segoe UI", system-ui, sans-serif;
        background: #FF8C42;
        color: white;
        border: 3px solid #FF6B00;
        border-radius: 30px;
        cursor: pointer;
        z-index: 10000;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);
    `;
    
    // Enhanced hover effect
    button.addEventListener('mouseenter', () => {
        button.style.background = '#FF6B00';
        button.style.transform = 'translate(-50%, 120px) scale(1.05)';
        button.style.boxShadow = '0 6px 20px rgba(255, 107, 0, 0.4)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.background = '#FF8C42';
        button.style.transform = 'translate(-50%, 120px) scale(1)';
        button.style.boxShadow = '0 4px 12px rgba(255, 140, 66, 0.3)';
    });
    
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
    
    // Position bubble above and to the left of spotter
    const bubbleWidth = 140;
    const bubbleHeight = 50;
    const bubbleX = spotterX - bubbleWidth + 20; // Position to left of spotter
    const bubbleY = spotterY - bubbleHeight - 20; // Position above spotter
    const tailSize = 12;
    
    ctx.save();
    ctx.globalAlpha = opacity;
    
    // Main bubble with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 3;
    
    // Bubble body
    ctx.beginPath();
    ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 16);
    ctx.fill();
    ctx.stroke();
    
    // Speech bubble tail pointing correctly to spotter
    ctx.shadowColor = 'transparent';
    ctx.beginPath();
    // Calculate tail position to point toward spotter's head
    const tailCenterX = bubbleX + bubbleWidth - 40; // Tail on right side of bubble
    const tailBaseY = bubbleY + bubbleHeight;
    ctx.moveTo(tailCenterX - 8, tailBaseY);
    ctx.lineTo(spotterX, spotterY - 4); // Point directly to spotter's head
    ctx.lineTo(tailCenterX + 8, tailBaseY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Text with coaching enthusiasm
    ctx.fillStyle = '#FF6B00';
    ctx.font = 'bold 16px "Inter", "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    
    // Add some animation to the text
    const textY = bubbleY + bubbleHeight/2 + 6;
    const bounce = Math.sin(spotterAnimationFrame * 0.3) * 1;
    ctx.fillText(message, bubbleX + bubbleWidth/2, textY + bounce);
    
    // Add some coaching-style emphasis marks
    if (message === "Perfect!" || message === "Excellent!") {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 12px "Inter", "Segoe UI", system-ui, sans-serif';
        ctx.fillText('★', bubbleX + bubbleWidth - 15, bubbleY + 15);
        ctx.fillText('★', bubbleX + 10, bubbleY + 15);
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
