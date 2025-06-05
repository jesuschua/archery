// Wind rendering system for the archery game - Orange & White Minimalist Theme

export function drawWind(ctx, canvas, wind) {
    ctx.save();
    
    // Clean minimalist wind panel
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(canvas.width - 220, 5, 215, 70, 16);
    ctx.fill();
    ctx.stroke();
    
    // Clean typography
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#FF6B00';
    ctx.font = 'bold 18px "Segoe UI", system-ui, sans-serif';
    ctx.fillText(`Wind: ${wind.strength.toFixed(2)} m/s`, canvas.width - 210, 30);
    
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 16px "Segoe UI", system-ui, sans-serif';
    ctx.fillText(`Direction: ${Math.round(wind.direction * 180 / Math.PI)}°`, canvas.width - 210, 55);
    
    ctx.restore();
}

export function drawWindIndicator(ctx, canvas, wind) {
    const centerX = canvas.width * 0.85;
    const centerY = canvas.height * 0.15;
    const maxArrowLength = 50;
    const arrowLength = Math.abs(wind.strength) * maxArrowLength;
    const arrowAngle = wind.direction;
    
    ctx.save();
    
    // Clean circular background
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fill();
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Wind direction arrow
    ctx.shadowColor = 'transparent';
    ctx.translate(centerX, centerY);
    ctx.rotate(arrowAngle);
    
    const intensity = Math.abs(wind.strength);
    // Orange gradient based on intensity
    const orangeIntensity = Math.floor(255 * intensity);
    const orangeBase = 255 - Math.floor(100 * intensity);
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(arrowLength, 0);
    ctx.strokeStyle = `rgb(255, ${orangeBase}, ${Math.floor(orangeBase * 0.3)})`;
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Arrow head with orange styling
    if (arrowLength > 5) {
        ctx.beginPath();
        ctx.moveTo(arrowLength, 0);
        ctx.lineTo(arrowLength - 10, -5);
        ctx.lineTo(arrowLength - 10, 5);
        ctx.closePath();
        ctx.fillStyle = `rgb(255, ${orangeBase}, ${Math.floor(orangeBase * 0.3)})`;
        ctx.fill();
    }
    
    ctx.restore();
}
