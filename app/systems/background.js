// Background rendering system for the archery game - Orange & White Minimalist Theme
export function drawBackground(ctx, canvas) {
    // Clean minimalist gradient: light orange to white
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FFF8F0');  // Very light cream white
    gradient.addColorStop(0.3, '#FFEDE0'); // Light orange tint
    gradient.addColorStop(0.7, '#FFE4CC'); // Soft orange
    gradient.addColorStop(1, '#FFDAB3');   // Warmer orange base
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add subtle texture with minimalist geometric elements
    drawGeometricElements(ctx, canvas);
}

function drawGeometricElements(ctx, canvas) {
    // Very subtle white geometric shapes for depth
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#FFFFFF';
    
    // Large subtle circles
    ctx.beginPath();
    ctx.arc(canvas.width * 0.1, canvas.height * 0.3, 120, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(canvas.width * 0.9, canvas.height * 0.7, 80, 0, Math.PI * 2);
    ctx.fill();
    
    // Subtle lines for texture
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.08;
    
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * (0.2 + i * 0.15));
        ctx.lineTo(canvas.width, canvas.height * (0.25 + i * 0.15));
        ctx.stroke();
    }
    
    ctx.restore();
}
