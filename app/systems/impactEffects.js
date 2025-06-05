// Target impact effects system - handles visual effects when arrows hit the target

// Array to store impact effects
let impactEffects = [];

/**
 * Create a new impact effect where an arrow hits the target
 * @param {number} x - X coordinate of impact
 * @param {number} y - Y coordinate of impact
 */
export function createImpactEffect(x, y) {
    // Create an impact effect with initial properties
    impactEffects.push({
        x: x,
        y: y,
        radius: 5,
        opacity: 1.0,
        lifespan: 20, // Number of frames the effect will last
    });
}

/**
 * Update all impact effects (fade out, grow, etc.)
 */
export function updateImpactEffects() {
    // Update each effect
    for (let i = impactEffects.length - 1; i >= 0; i--) {
        const effect = impactEffects[i];
        
        // Decrease lifespan
        effect.lifespan--;
        
        // Increase radius
        effect.radius += 1.5;
        
        // Decrease opacity
        effect.opacity = effect.lifespan / 20; // Fade out linearly based on lifespan
        
        // Remove effects that have faded out
        if (effect.lifespan <= 0) {
            impactEffects.splice(i, 1);
        }
    }
}

/**
 * Draw all impact effects on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 */
export function drawImpactEffects(ctx) {
    // Skip if there are no effects
    if (impactEffects.length === 0) return;
    
    // Save context state
    ctx.save();
    
    // Draw each effect
    impactEffects.forEach(effect => {
        // Set style for impact circle
        ctx.fillStyle = 'transparent';
        ctx.strokeStyle = `rgba(255, 140, 66, ${effect.opacity})`;
        ctx.lineWidth = 2;
        
        // Draw expanding circle
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw smaller inner highlight circle for impact point
        if (effect.lifespan > 15) { // Only show for a short time
            ctx.fillStyle = `rgba(255, 255, 255, ${effect.opacity * 1.5})`;
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    // Restore context state
    ctx.restore();
}

/**
 * Clear all impact effects
 */
export function clearImpactEffects() {
    impactEffects = [];
}
