// Tracer rendering system for the archery game - Orange & White Minimalist Theme with Sparkles
let sparkles = [];

export function drawTracer(ctx, arrowPath) {
    if (arrowPath.length > 1) {
        // Generate sparkles behind the arrow based on its direction of travel
        if (arrowPath.length > 2) {
            const currentPos = arrowPath[arrowPath.length - 1];
            const prevPos = arrowPath[arrowPath.length - 2];
            
            // Calculate arrow's direction vector
            const dx = currentPos.x - prevPos.x;
            const dy = currentPos.y - prevPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                // Normalize direction vector
                const dirX = dx / distance;
                const dirY = dy / distance;
                
                // Create sparkles well behind the arrow's fletching (opposite to direction of travel)
                if (Math.random() < 0.7) { // 70% chance to create sparkle
                    const arrowLength = 90; // Arrow extends 90 pixels back from center
                    const gapDistance = 30; // Gap after arrow's back end
                    const trailDistance = arrowLength + gapDistance + Math.random() * 40; // Start after arrow + gap + random (120-160px total)
                    const sparkleX = currentPos.x - dirX * trailDistance + (Math.random() - 0.5) * 20;
                    const sparkleY = currentPos.y - dirY * trailDistance + (Math.random() - 0.5) * 20;
                    
                    sparkles.push({
                        x: sparkleX,
                        y: sparkleY,
                        size: Math.random() * 3 + 1,
                        life: 1.0,
                        decay: Math.random() * 0.02 + 0.015,
                        color: Math.random() > 0.5 ? '#FF8C42' : '#FFFFFF',
                        twinkle: Math.random() * Math.PI * 2
                    });
                }
            }
        }
    }
    
    // Draw and update sparkles
    drawSparkles(ctx);
}

function drawSparkles(ctx) {
    ctx.save();
    
    // Update and draw each sparkle
    for (let i = sparkles.length - 1; i >= 0; i--) {
        const sparkle = sparkles[i];
        
        // Update sparkle
        sparkle.life -= sparkle.decay;
        sparkle.twinkle += 0.2;
        
        // Remove dead sparkles
        if (sparkle.life <= 0) {
            sparkles.splice(i, 1);
            continue;
        }
        
        // Draw sparkle with twinkling effect
        const alpha = sparkle.life * (0.5 + 0.5 * Math.sin(sparkle.twinkle));
        const size = sparkle.size * sparkle.life;
        
        ctx.fillStyle = sparkle.color === '#FF8C42' 
            ? `rgba(255, 140, 66, ${alpha})`
            : `rgba(255, 255, 255, ${alpha})`;
        
        // Draw star-shaped sparkle
        ctx.shadowColor = sparkle.color;
        ctx.shadowBlur = size * 2;
        
        ctx.beginPath();
        // Main sparkle body
        ctx.arc(sparkle.x, sparkle.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add sparkle rays
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Horizontal ray
        ctx.moveTo(sparkle.x - size * 2, sparkle.y);
        ctx.lineTo(sparkle.x + size * 2, sparkle.y);
        // Vertical ray
        ctx.moveTo(sparkle.x, sparkle.y - size * 2);
        ctx.lineTo(sparkle.x, sparkle.y + size * 2);
        ctx.stroke();
    }
    
    ctx.restore();
}

// Clear sparkles when arrow stops or resets
export function clearSparkles() {
    sparkles = [];
}
