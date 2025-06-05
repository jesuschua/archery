// Rendering system for the archery game - Orange & White Minimalist Theme
import { lineCircleIntersection } from '../utils/gameUtils.js';

export function drawBow(ctx, bow) {
    ctx.save();
    ctx.translate(bow.x, bow.y);
    ctx.rotate(bow.angle);
    
    // Update pull distance animation
    if (bow.pulling) {
        bow.pullDistance = Math.min(bow.pullDistance + bow.pullAnimationSpeed, 1);
    } else {
        bow.pullDistance = Math.max(bow.pullDistance - bow.pullAnimationSpeed * 2, 0);
    }
    
    // Calculate current pull distance in pixels
    const currentPull = bow.pullDistance * bow.maxPullDistance;
    
    // Clean, minimalist bow design with orange gradients
    const bowGradient = ctx.createLinearGradient(-2.5, -50, 7.5, 50);
    bowGradient.addColorStop(0, '#FF8C42');  // Vibrant orange
    bowGradient.addColorStop(0.5, '#FF7A28'); // Mid orange
    bowGradient.addColorStop(1, '#E85A00');   // Deeper orange
    
    // Main bow body - sleek and minimal with slight bend when pulled
    ctx.fillStyle = bowGradient;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    if (bow.pulling && bow.pullDistance > 0.3) {
        // Slight bow bend when pulling - make the bow curve slightly backward
        ctx.save();
        ctx.scale(1 + bow.pullDistance * 0.1, 1); // Slight horizontal stretching effect
        ctx.fillRect(4, -47.5, 7, 95);
        ctx.restore();
    } else {
        ctx.fillRect(4, -47.5, 7, 95);
    }
    
    // Animated bow string - pulls back when drawing
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5 + bow.pullDistance * 0.5; // String gets slightly thicker when taut
    
    // String with dynamic curvature based on pull
    const stringCurve = -10 - currentPull; // String curves back more when pulled
    ctx.beginPath();
    ctx.moveTo(5, -45);
    
    if (bow.pulling && bow.pullDistance > 0.1) {
        // Draw taut string with nocking point when pulling
        const nockPointY = 0; // Center of bow where arrow nocks
        const nockPointX = stringCurve;
        
        // Upper string segment
        ctx.lineTo(nockPointX, nockPointY);
        // Lower string segment  
        ctx.lineTo(5, 45);
        
        // Add slight vibration effect when string is fully drawn
        if (bow.pullDistance > 0.8) {
            const vibration = Math.sin(Date.now() * 0.05) * 0.5;
            ctx.save();
            ctx.translate(vibration, 0);
            ctx.stroke();
            ctx.restore();
        } else {
            ctx.stroke();
        }
        
        // Draw nocking point indicator
        ctx.fillStyle = '#FFE4CC';
        ctx.beginPath();
        ctx.arc(nockPointX, nockPointY, 2, 0, Math.PI * 2);
        ctx.fill();
        
    } else {
        // Relaxed string curve
        ctx.quadraticCurveTo(stringCurve, 0, 5, 45);
        ctx.stroke();
    }
    
    // Add subtle glow effect when bow is fully drawn
    if (bow.pullDistance > 0.9) {
        ctx.shadowColor = '#FF8C42';
        ctx.shadowBlur = 8;
        ctx.strokeStyle = 'rgba(255, 140, 66, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(5, -45);
        ctx.lineTo(stringCurve, 0);
        ctx.lineTo(5, 45);
        ctx.stroke();
    }
    
    // Grip area - subtle orange accent
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#D14500';
    ctx.fillRect(3, -7.5, 9, 15);
    
    ctx.restore();
}

export function drawArrow(ctx, arrow, bow) {
    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.rotate(arrow.fired ? arrow.angle : bow.angle);
    
    // Minimalist arrow design
    const shaftGradient = ctx.createLinearGradient(-45, 0, 45, 0);
    shaftGradient.addColorStop(0, '#FFFFFF');    // White tail
    shaftGradient.addColorStop(0.3, '#FFE4CC');  // Light orange
    shaftGradient.addColorStop(1, '#FF8C42');    // Orange tip
    
    // Arrow shaft - clean and sleek
    ctx.fillStyle = shaftGradient;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 2;
    ctx.fillRect(-45, -1, 90, 2);
    
    // Arrow fletching - realistic feathers extending backward from nock end
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 0.5;
    
    // Draw three fletching feathers that extend backward from nock end
    // Feather 1 (top) - larger feather extending backward and upward
    ctx.beginPath();
    ctx.moveTo(-45, 0);          // Start exactly at shaft end
    ctx.lineTo(-55, -6);         // Extend further backward and up
    ctx.lineTo(-52.5, -5);       // Feather outer edge
    ctx.lineTo(-47.5, -4);       // Mid point
    ctx.lineTo(-45, -0.5);       // Back to shaft end (thin attachment point)
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Feather 2 (bottom) - larger feather extending backward and downward  
    ctx.beginPath();
    ctx.moveTo(-45, 0);          // Start exactly at shaft end
    ctx.lineTo(-55, 6);          // Extend further backward and down
    ctx.lineTo(-52.5, 5);        // Feather outer edge
    ctx.lineTo(-47.5, 4);        // Mid point
    ctx.lineTo(-45, 0.5);        // Back to shaft end (thin attachment point)
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Feather 3 (side) - straight back feather for stability
    ctx.beginPath();
    ctx.moveTo(-45, 0);          // Start exactly at shaft end
    ctx.lineTo(-54, 0);          // Extend straight backward
    ctx.lineTo(-53, -2.5);       // Upper feather edge
    ctx.lineTo(-53, 2.5);        // Lower feather edge
    ctx.lineTo(-45, 0.5);        // Back to shaft end
    ctx.lineTo(-45, -0.5);       // Complete the thin attachment at shaft end
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Arrow point - sharp pointed tip at the front
    ctx.fillStyle = '#FF6B00';
    ctx.beginPath();
    ctx.moveTo(45, 0);     // Sharp tip point
    ctx.lineTo(37.5, -2);  // Upper edge
    ctx.lineTo(37.5, 2);   // Lower edge
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

export function drawTarget(ctx, target, color) {
    ctx.save();
    
    // Subtle shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    
    // Minimalist target with orange and white rings
    const colors = ["#FF6B00", "#FFFFFF", "#FF8C42", "#FFFFFF", "#FFB366"];
    const ringSize = target.radius / colors.length;
    
    for (let i = 0; i < colors.length; i++) {
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius - (i * ringSize), 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.fill();
        
        // Clean, minimal ring borders
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
    }
    
    ctx.restore();
    
    // Special highlighting for helper mode
    if (color === 'green') {
        ctx.save();
        ctx.shadowColor = '#00FF88';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(target.x, target.y, ringSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 136, 0.6)';
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}
