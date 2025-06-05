// UI rendering system for the archery game

// Reaction message state
let reactionMessage = '';
let reactionMessageOpacity = 0;
let reactionMessageTimer = 0;

export function drawScore(ctx, score) {
    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = 'rgba(30, 30, 30, 0.85)';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(15, 15, 160, 48, 12);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 28px Segoe UI, Arial';
    ctx.fillText(`Score:`, 28, 45);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px Segoe UI, Arial';
    ctx.fillText(`${score}`, 110, 48);
    ctx.restore();
}

export function drawTriesLeft(ctx, triesLeft) {
    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = 'rgba(30, 30, 30, 0.85)';
    ctx.strokeStyle = triesLeft <= 1 ? '#FF4444' : '#00C853';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(15, 70, 200, 44, 12);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = triesLeft <= 1 ? '#FF4444' : '#00C853';
    ctx.font = 'bold 24px Segoe UI, Arial';
    ctx.fillText(`Tries Left:`, 28, 98);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px Segoe UI, Arial';
    ctx.fillText(`${triesLeft}`, 150, 100);
    ctx.restore();
}

export function drawRoundBanner(ctx, triesLeft) {
    if (triesLeft === 5) {
        ctx.save();
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(ctx.canvas.width/2-160, 30, 320, 54, 18);
        ctx.fill();
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 32px Segoe UI, Arial';
        ctx.textAlign = 'center';
        ctx.fillText('New Round!', ctx.canvas.width/2, 68);
        ctx.textAlign = 'start';
        ctx.restore();
    }
}

export function drawEndOfRoundBanner(ctx, score) {
    ctx.save();
    ctx.globalAlpha = 0.96;
    ctx.fillStyle = 'rgba(20, 20, 20, 0.92)';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(ctx.canvas.width/2-220, ctx.canvas.height/2-80, 440, 160, 32);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 40px Segoe UI, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Round Over!', ctx.canvas.width/2, ctx.canvas.height/2-20);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px Segoe UI, Arial';
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
        font-size: 24px;
        font-weight: bold;
        font-family: 'Segoe UI', Arial, sans-serif;
        background: rgba(0, 150, 50, 0.9);
        color: white;
        border: 3px solid #00FF66;
        border-radius: 20px;
        cursor: pointer;
        z-index: 10000;
        transition: all 0.2s ease;
    `;
    
    // Add hover effect
    button.addEventListener('mouseenter', () => {
        button.style.background = 'rgba(0, 180, 60, 0.95)';
        button.style.transform = 'translate(-50%, 120px) scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.background = 'rgba(0, 150, 50, 0.9)';
        button.style.transform = 'translate(-50%, 120px) scale(1)';
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
    reactionMessageTimer = 60; // Show for ~1 second at 60fps (shorter duration)
}

export function updateReactionMessage() {
    if (reactionMessageTimer > 0) {
        reactionMessageTimer--;
        // Quick fade out in the last 15 frames (more abrupt)
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
        
        // Position just below the "New Round!" banner (centered)
        const messageWidth = 200;
        const messageHeight = 40;
        const messageX = ctx.canvas.width/2 - messageWidth/2;
        const messageY = 95; // Just below the New Round banner (which ends at ~84)
        
        // Smaller, less intrusive background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.strokeStyle = '#FF6B35';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(messageX, messageY, messageWidth, messageHeight, 10);
        ctx.fill();
        ctx.stroke();
        
        // Smaller text for less distraction
        ctx.fillStyle = '#FF6B35';
        ctx.font = 'bold 20px Segoe UI, Arial';
        ctx.textAlign = 'center';
        ctx.fillText(reactionMessage, ctx.canvas.width/2, messageY + 26);
        ctx.textAlign = 'start';
        ctx.restore();
    }
}
