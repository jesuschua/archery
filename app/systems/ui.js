// UI rendering system for the archery game
export function drawScore(ctx, score) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(5, 5, 150, 35);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

export function drawTriesLeft(ctx, triesLeft) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(5, 45, 180, 35);
    ctx.fillStyle = triesLeft <= 1 ? '#FF4444' : '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Tries Left: ${triesLeft}`, 10, 70);
}
