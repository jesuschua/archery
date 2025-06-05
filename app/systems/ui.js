// UI rendering system for the archery game - Orange & White Minimalist Theme

// Reaction message state
let reactionMessage = '';
let reactionMessageOpacity = 0;
let reactionMessageTimer = 0;

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
    reactionMessageTimer = 60; // Show for ~1 second at 60fps
}

export function updateReactionMessage() {
    if (reactionMessageTimer > 0) {
        reactionMessageTimer--;
        // Smooth fade out in the last 15 frames
        if (reactionMessageTimer < 15) {
            reactionMessageOpacity = reactionMessageTimer / 15;
        }
    } else {
        reactionMessage = '';
        reactionMessageOpacity = 0;
    }
}

export function drawReactionMessage(ctx) {
    if (reactionMessage && reactionMessageOpacity > 0) {
        ctx.save();
        ctx.globalAlpha = reactionMessageOpacity;
        
        // Position just below the "New Round!" banner
        const messageWidth = 200;
        const messageHeight = 40;
        const messageX = ctx.canvas.width/2 - messageWidth/2;
        const messageY = 95;
        
        // Clean minimalist message design
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = '#FF8C42';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(messageX, messageY, messageWidth, messageHeight, 12);
        ctx.fill();
        ctx.stroke();
        
        // Clean text
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#FF6B00';
        ctx.font = 'bold 18px "Segoe UI", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(reactionMessage, ctx.canvas.width/2, messageY + 26);
        ctx.textAlign = 'start';
        
        ctx.restore();
    }
}
