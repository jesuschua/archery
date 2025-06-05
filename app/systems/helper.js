// Helper system for trajectory prediction and aim assistance
import { lineCircleIntersection } from '../utils/gameUtils.js';

export function calculateOptimalAngle(bow, target, wind, gravity, arrowSpeed = 30) {
    const maxIterations = 100;
    const angleIncrement = 0.01; // Precision of angle search
    let bestAngle = 0;
    let bestDistance = Infinity;
    
    // Search through a range of angles to find the one that gets closest to target
    for (let angle = -Math.PI/2; angle <= Math.PI/2; angle += angleIncrement) {
        const distance = simulateTrajectory(bow, target, wind, gravity, angle, arrowSpeed);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestAngle = angle;
        }
    }
    
    return bestAngle;
}

function simulateTrajectory(bow, target, wind, gravity, angle, arrowSpeed) {
    // Simulate arrow trajectory with given angle
    let x = bow.x;
    let y = bow.y;
    let vx = arrowSpeed * Math.cos(angle);
    let vy = arrowSpeed * Math.sin(angle);
    
    const maxSteps = 1000;
    let step = 0;
    
    while (step < maxSteps) {
        // Apply wind and gravity (same physics as real arrow)
        vx += wind.strength * Math.cos(wind.direction) * 0.05;
        vy += wind.strength * Math.sin(wind.direction) * 0.05;
        x += vx;
        y += vy;
        vy += gravity;
        
        // Check if arrow would hit target
        const arrowLength = 150;
        const arrowAngle = Math.atan2(vy, vx);
        const arrowTipX = x + Math.cos(arrowAngle) * (arrowLength / 2);
        const arrowTipY = y + Math.sin(arrowAngle) * (arrowLength / 2);
        const arrowTailX = x - Math.cos(arrowAngle) * (arrowLength / 2);
        const arrowTailY = y - Math.sin(arrowAngle) * (arrowLength / 2);
        
        if (lineCircleIntersection(
            arrowTailX, arrowTailY,
            arrowTipX, arrowTipY,
            target.x, target.y, target.radius
        )) {
            return 0; // Perfect hit
        }
        
        // Check if arrow is out of bounds
        if (x > window.innerWidth || y > window.innerHeight || x < 0 || y < 0) {
            // Return distance from final position to target
            return Math.sqrt(Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2));
        }
        
        step++;
    }
    
    // If simulation didn't end, return distance from current position to target
    return Math.sqrt(Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2));
}

export function drawHelperMarker(ctx, bow, optimalAngle, helperEnabled) {
    if (!helperEnabled) return;
    
    ctx.save();
    
    // Draw helper line from bow to optimal aim point
    const helperLength = 300;
    const helperEndX = bow.x + Math.cos(optimalAngle) * helperLength;
    const helperEndY = bow.y + Math.sin(optimalAngle) * helperLength;
    
    // Orange-themed animated dashed line
    const time = Date.now() * 0.005;
    ctx.setLineDash([15, 10]);
    ctx.lineDashOffset = time * 20;
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(bow.x, bow.y);
    ctx.lineTo(helperEndX, helperEndY);
    ctx.stroke();
    
    // Orange-themed helper marker with pulsing effect
    ctx.setLineDash([]);
    const pulseSize = 8 + Math.sin(time * 3) * 3;
    
    // Outer glow
    ctx.shadowColor = '#FF8C42';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#FF8C42';
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(helperEndX, helperEndY, pulseSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner white circle
    ctx.shadowColor = 'transparent';    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(helperEndX, helperEndY, pulseSize * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Orange-themed crosshair
    ctx.strokeStyle = '#D14500';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(helperEndX - pulseSize, helperEndY);
    ctx.lineTo(helperEndX + pulseSize, helperEndY);
    ctx.moveTo(helperEndX, helperEndY - pulseSize);
    ctx.lineTo(helperEndX, helperEndY + pulseSize);
    ctx.stroke();
      ctx.restore();
}

// Helper UI is now integrated into the main game panel in ui.js
// This function is kept for compatibility but no longer draws anything
export function drawHelperUI(ctx, helperEnabled) {
    // Helper UI has been moved to the unified game panel
    // See drawGamePanel() in ui.js
}
