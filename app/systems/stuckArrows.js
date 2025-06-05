// Stuck arrows system - handles arrows that stick to the target
import { drawArrow } from './rendering.js';

// Array to store arrows that have stuck to the target
let stuckArrows = [];

/**
 * Add an arrow to the stuck arrows collection
 * @param {Object} arrow - The arrow object to add
 * @param {Object} target - The target object (for position)
 */
export function addStuckArrow(arrow, target) {
    // Calculate the arrow tip position (where collision occurred)
    const arrowLength = 150;
    const arrowTipX = arrow.x + Math.cos(arrow.angle) * (arrowLength / 2);
    const arrowTipY = arrow.y + Math.sin(arrow.angle) * (arrowLength / 2);
    
    // Calculate how far the arrow should penetrate into the target
    // We want the arrow to appear to stick partway into the target surface
    const penetrationDepth = 15; // Pixels the arrow penetrates into target
    
    // Calculate the final stuck position: tip position minus penetration depth
    const stuckX = arrowTipX - Math.cos(arrow.angle) * penetrationDepth;
    const stuckY = arrowTipY - Math.sin(arrow.angle) * penetrationDepth;
    
    // Create a deep copy of the arrow to avoid reference issues
    const stuckArrow = {
        x: stuckX,
        y: stuckY,
        width: arrow.width,
        height: arrow.height,
        angle: arrow.angle,
        // Calculate and store position relative to target center for stable sticking
        targetRelativeX: stuckX - target.x,
        targetRelativeY: stuckY - target.y,
        // Calculate distance from target center (used for visual consistency)
        distanceFromCenter: Math.sqrt(
            Math.pow(stuckX - target.x, 2) + 
            Math.pow(stuckY - target.y, 2)
        ),
        // Store hit angle relative to target center for consistent positioning
        hitAngle: Math.atan2(stuckY - target.y, stuckX - target.x),
        // Add a small random jitter to prevent perfect overlapping of arrows
        jitterX: (Math.random() - 0.5) * 2,
        jitterY: (Math.random() - 0.5) * 2
    };
    
    // Limit the number of arrows for performance (keep the most recent ones)
    const maxArrows = window.responsive && window.responsive.isSmallMobile ? 5 : 10;
    if (stuckArrows.length >= maxArrows) {
        stuckArrows.shift(); // Remove the oldest arrow
    }
    
    // Add to collection
    stuckArrows.push(stuckArrow);
}

/**
 * Draw all stuck arrows on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Object} target - The target object (for position tracking)
 */
export function drawStuckArrows(ctx, target) {
    if (stuckArrows.length === 0) return;
      // Draw each stuck arrow
    stuckArrows.forEach(stuckArrow => {
        // Update position to move with target using hit angle and distance
        // This ensures arrows stay consistently positioned on target even as it moves
        stuckArrow.x = target.x + Math.cos(stuckArrow.hitAngle) * stuckArrow.distanceFromCenter;
        stuckArrow.y = target.y + Math.sin(stuckArrow.hitAngle) * stuckArrow.distanceFromCenter;
        
        // Small random offset to prevent arrows from perfectly overlapping if they hit the same spot
        const jitterX = stuckArrow.jitterX || 0;
        const jitterY = stuckArrow.jitterY || 0;
        
        // Save current context to restore after drawing
        ctx.save();
        
        // Translate to the arrow position with jitter
        ctx.translate(stuckArrow.x + jitterX, stuckArrow.y + jitterY);
        ctx.rotate(stuckArrow.angle);
        
        // Draw a subtle shadow for depth (only if not on a small mobile device)
        if (window.responsive && !window.responsive.isSmallMobile) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
        }
        
        // Use a simplified arrow rendering for better performance
        // Arrow shaft
        const shaftGradient = ctx.createLinearGradient(-45, 0, 45, 0);
        shaftGradient.addColorStop(0, '#FFFFFF'); 
        shaftGradient.addColorStop(0.3, '#FFE4CC');
        shaftGradient.addColorStop(1, '#FF8C42');
        
        ctx.fillStyle = shaftGradient;
        ctx.fillRect(-45, -1, 90, 2);
        
        // Simple arrow head
        ctx.fillStyle = '#FF6B00';
        ctx.beginPath();
        ctx.moveTo(45, 0);
        ctx.lineTo(37.5, -2);
        ctx.lineTo(37.5, 2);
        ctx.closePath();
        ctx.fill();
          ctx.restore();
    });
}

/**
 * Clear all stuck arrows
 */
export function clearStuckArrows() {
    stuckArrows = [];
}

/**
 * Get the count of stuck arrows
 * @returns {number} The number of stuck arrows
 */
export function getStuckArrowCount() {
    return stuckArrows.length;
}
