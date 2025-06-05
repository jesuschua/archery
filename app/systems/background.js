// Background rendering system for the archery game
export function drawBackground(ctx, canvas) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#98FB98');
    gradient.addColorStop(1, '#228B22');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawClouds(ctx, canvas);
}

function drawClouds(ctx, canvas) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    drawCloud(ctx, canvas.width * 0.2, canvas.height * 0.2, 40);
    drawCloud(ctx, canvas.width * 0.6, canvas.height * 0.15, 35);
    drawCloud(ctx, canvas.width * 0.8, canvas.height * 0.25, 30);
}

function drawCloud(ctx, x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.arc(x + size * 0.6, y, size * 0.8, 0, Math.PI * 2);
    ctx.arc(x + size * 1.2, y, size, 0, Math.PI * 2);
    ctx.arc(x + size * 0.6, y - size * 0.5, size * 0.7, 0, Math.PI * 2);
    ctx.fill();
}
