// Visual feedback for touch interactions on mobile devices
import { responsive } from '../utils/responsiveUtils.js';

let touchPoints = [];

// Create a touch feedback animation
export function createTouchFeedback(x, y, color = '#FF8C42') {
    if (!responsive.isMobile) return;
    
    touchPoints.push({
        x,
        y,
        radius: 30 * responsive.scaleFactor,
        alpha: 0.6,
        color
    });
}

// Update touch feedback animations
export function updateTouchFeedback() {
    if (!responsive.isMobile) return;
    
    // Remove completed animations
    touchPoints = touchPoints.filter(point => point.alpha > 0);
    
    // Update remaining animations
    touchPoints.forEach(point => {
        point.radius += 2;
        point.alpha -= 0.03;
    });
}

// Draw touch feedback animations
export function drawTouchFeedback(ctx) {
    if (!responsive.isMobile || touchPoints.length === 0) return;
    
    ctx.save();
    
    touchPoints.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'transparent';
        ctx.strokeStyle = `rgba(255, 140, 66, ${point.alpha})`;
        ctx.lineWidth = 2 * responsive.scaleFactor;
        ctx.stroke();
    });
    
    ctx.restore();
}
