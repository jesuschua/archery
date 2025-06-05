// Wind rendering system for the archery game
export function drawWind(ctx, canvas, wind) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(canvas.width - 220, 5, 215, 70);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Wind: ${wind.strength.toFixed(2)} m/s`, canvas.width - 210, 30);
    ctx.fillText(`Direction: ${Math.round(wind.direction * 180 / Math.PI)}°`, canvas.width - 210, 55);
}

export function drawWindIndicator(ctx, canvas, wind) {
    const centerX = canvas.width * 0.85;
    const centerY = canvas.height * 0.15;
    const maxArrowLength = 50;
    const arrowLength = Math.abs(wind.strength) * maxArrowLength;
    const arrowAngle = wind.direction;
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.translate(centerX, centerY);
    ctx.rotate(arrowAngle);
    const intensity = Math.abs(wind.strength);
    const red = Math.floor(255 * intensity);
    const blue = Math.floor(255 * (1 - intensity));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(arrowLength, 0);
    ctx.strokeStyle = `rgb(${red}, 100, ${blue})`;
    ctx.lineWidth = 4;
    ctx.stroke();
    if (arrowLength > 5) {
        ctx.beginPath();
        ctx.moveTo(arrowLength, 0);
        ctx.lineTo(arrowLength - 10, -5);
        ctx.lineTo(arrowLength - 10, 5);
        ctx.closePath();
        ctx.fillStyle = `rgb(${red}, 100, ${blue})`;
        ctx.fill();
    }
    ctx.restore();
}
