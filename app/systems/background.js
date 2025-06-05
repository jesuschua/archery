// Background rendering system for the archery game - Orange & White Minimalist Theme with Mobile Support

import { responsive } from '../utils/responsiveUtils.js';

export function drawBackground(ctx, canvas, time = 0) {
    // Simple gradient background - Orange & White minimalist theme
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FFF8F0');    // Very light cream at top
    gradient.addColorStop(0.5, '#FFEDE0');  // Light orange-cream middle
    gradient.addColorStop(1, '#FFE4CC');    // Slightly deeper cream at bottom
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw silhouette elements with animated lighthouse
    drawIslandLighthouseSilhouette(ctx, canvas, time);
}

function drawIslandLighthouseSilhouette(ctx, canvas, time) {
    ctx.save();
    
    // Dark silhouette color for contrast against the light background
    const silhouetteColor = '#2C3E50'; // Dark blue-gray
    
    // Horizon line - positioned at lower third
    const horizonY = canvas.height * 0.75;
    
    // Draw distant island silhouette on the left side
    ctx.fillStyle = silhouetteColor;
    ctx.globalAlpha = 0.4; // Semi-transparent for distance effect
    
    // Use responsive scaling for island dimensions
    const islandHeight = 40 * responsive.scaleFactor;
    
    ctx.beginPath();
    // Island shape - organic and mountainous with responsive scaling
    ctx.moveTo(0, horizonY);
    ctx.quadraticCurveTo(canvas.width * 0.1, horizonY - islandHeight, canvas.width * 0.2, horizonY - islandHeight * 0.75);
    ctx.quadraticCurveTo(canvas.width * 0.25, horizonY - islandHeight * 1.25, canvas.width * 0.3, horizonY - islandHeight * 1.125);
    ctx.quadraticCurveTo(canvas.width * 0.35, horizonY - islandHeight * 1.5, canvas.width * 0.4, horizonY - islandHeight * 0.875);
    ctx.quadraticCurveTo(canvas.width * 0.45, horizonY - islandHeight * 0.5, canvas.width * 0.5, horizonY);
    ctx.lineTo(0, horizonY);
    ctx.closePath();
    ctx.fill();
    
    // Draw the local island where the windsock mast and lighthouse stand together
    ctx.globalAlpha = 0.6; // More prominent since it's closer
    ctx.fillStyle = silhouetteColor;
    
    const poleX = canvas.width * 0.85; // Same as windsock pole position
    const localIslandWidth = 150 * responsive.scaleFactor;
    const localIslandHeight = 50 * responsive.scaleFactor;
    
    ctx.beginPath();
    // Local island - larger hill to accommodate both mast and lighthouse with responsive scaling
    ctx.moveTo(poleX - localIslandWidth, horizonY);
    ctx.quadraticCurveTo(poleX - localIslandWidth * 0.8, horizonY - localIslandHeight * 0.6, poleX - localIslandWidth * 0.53, horizonY - localIslandHeight * 0.7);
    ctx.quadraticCurveTo(poleX - localIslandWidth * 0.27, horizonY - localIslandHeight * 0.9, poleX, horizonY - localIslandHeight); // Peak under mast
    ctx.quadraticCurveTo(poleX + localIslandWidth * 0.27, horizonY - localIslandHeight * 0.9, poleX + localIslandWidth * 0.53, horizonY - localIslandHeight * 0.7);    ctx.quadraticCurveTo(poleX + localIslandWidth * 0.27, horizonY - localIslandHeight * 0.9, poleX + localIslandWidth * 0.53, horizonY - localIslandHeight * 0.7);
    ctx.quadraticCurveTo(poleX + localIslandWidth * 0.8, horizonY - localIslandHeight * 0.5, poleX + localIslandWidth, horizonY);
    ctx.lineTo(canvas.width, horizonY);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(poleX - localIslandWidth, canvas.height);
    ctx.closePath();
    ctx.fill();
    
    // Draw traditional lighthouse with animated light
    drawTraditionalLighthouse(ctx, poleX - 60 * responsive.scaleFactor, horizonY - localIslandHeight * 0.7, time);
    
    // Add some distant mountains/hills for depth with responsive scaling
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = silhouetteColor;
    const mountainHeight = 25 * responsive.scaleFactor;
    
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.6, horizonY);
    ctx.quadraticCurveTo(canvas.width * 0.7, horizonY - mountainHeight * 0.8, canvas.width * 0.8, horizonY - mountainHeight * 0.6);
    ctx.quadraticCurveTo(canvas.width * 0.9, horizonY - mountainHeight, canvas.width, horizonY - mountainHeight * 0.4);
    ctx.lineTo(canvas.width, horizonY);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

function drawTraditionalLighthouse(ctx, x, y, time) {
    ctx.save();
    
    const silhouetteColor = '#2C3E50';
    
    // Lighthouse dimensions with responsive scaling
    const baseWidth = 12 * responsive.scaleFactor;
    const topWidth = 8 * responsive.scaleFactor;
    const height = 50 * responsive.scaleFactor;
    const lampRoomHeight = 12 * responsive.scaleFactor;
    
    // Draw lighthouse base (slightly wider bottom tapering to top)
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = silhouetteColor;
    
    // Main tower - tapered cylinder
    ctx.beginPath();
    ctx.moveTo(x - baseWidth/2, y);                    // Bottom left
    ctx.lineTo(x - topWidth/2, y - height);            // Top left
    ctx.lineTo(x + topWidth/2, y - height);            // Top right
    ctx.lineTo(x + baseWidth/2, y);                    // Bottom right
    ctx.closePath();
    ctx.fill();
    
    // Add horizontal stripes for traditional lighthouse look with responsive sizing
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.1;
    const stripeHeight = 3 * responsive.scaleFactor;
    // White stripes
    ctx.fillRect(x - baseWidth/2 + responsive.scaleFactor, y - height * 0.2, baseWidth - 2 * responsive.scaleFactor, stripeHeight);
    ctx.fillRect(x - baseWidth/2 + responsive.scaleFactor, y - height * 0.5, baseWidth - 2 * responsive.scaleFactor, stripeHeight);
    ctx.fillRect(x - baseWidth/2 + responsive.scaleFactor, y - height * 0.8, baseWidth - 2 * responsive.scaleFactor, stripeHeight);
    
    // Lamp room (lantern at top)
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = silhouetteColor;
    const lampRoomWidth = topWidth + 4 * responsive.scaleFactor;
    ctx.fillRect(x - lampRoomWidth/2, y - height - lampRoomHeight, lampRoomWidth, lampRoomHeight);
    
    // Lamp room windows (glass panels)
    ctx.fillStyle = '#FFE4CC';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(x - topWidth/2 + responsive.scaleFactor, y - height - lampRoomHeight + 2 * responsive.scaleFactor, 
                topWidth - 2 * responsive.scaleFactor, lampRoomHeight - 4 * responsive.scaleFactor);
    
    // Roof/cap
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = silhouetteColor;
    const roofWidth = topWidth + 6 * responsive.scaleFactor;
    const roofHeight = 8 * responsive.scaleFactor;
    ctx.beginPath();
    ctx.moveTo(x - roofWidth/2, y - height - lampRoomHeight);
    ctx.lineTo(x, y - height - lampRoomHeight - roofHeight);
    ctx.lineTo(x + roofWidth/2, y - height - lampRoomHeight);
    ctx.closePath();
    ctx.fill();
    
    // Animated rotating light beam with responsive sizing
    const lightCenterX = x;
    const lightCenterY = y - height - lampRoomHeight/2;
    const beamLength = 80 * responsive.scaleFactor;
    const rotationSpeed = 0.003; // Slow rotation
    const currentAngle = time * rotationSpeed;
    
    // Main light beam (sweeping)
    ctx.globalAlpha = 0.15;
    const beamGradient = ctx.createRadialGradient(
        lightCenterX, lightCenterY, 0,
        lightCenterX, lightCenterY, beamLength
    );
    beamGradient.addColorStop(0, '#FFFF88');
    beamGradient.addColorStop(0.3, '#FFE566');
    beamGradient.addColorStop(0.6, '#FFCC33');
    beamGradient.addColorStop(1, 'rgba(255, 204, 51, 0)');
    
    ctx.fillStyle = beamGradient;
    
    // Draw sweeping light beam
    ctx.beginPath();
    ctx.moveTo(lightCenterX, lightCenterY);
    ctx.arc(lightCenterX, lightCenterY, beamLength, currentAngle - 0.3, currentAngle + 0.3);
    ctx.closePath();
    ctx.fill();
    
    // Bright center light (always visible but pulsing)
    const pulseIntensity = 0.3 + 0.2 * Math.sin(time * 0.01);
    ctx.globalAlpha = pulseIntensity;
    ctx.fillStyle = '#FFFF44';
    ctx.beginPath();
    ctx.arc(lightCenterX, lightCenterY, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Add light glow around the lamp room
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#FFE566';
    ctx.beginPath();
    ctx.arc(lightCenterX, lightCenterY, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Secondary beam for more realistic lighthouse effect (offset)
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = beamGradient;
    ctx.beginPath();
    ctx.moveTo(lightCenterX, lightCenterY);
    ctx.arc(lightCenterX, lightCenterY, beamLength * 0.7, currentAngle + Math.PI - 0.2, currentAngle + Math.PI + 0.2);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}


