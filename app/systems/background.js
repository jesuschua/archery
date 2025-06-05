// Background rendering system for the archery game - Orange & White Minimalist Theme
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
    
    ctx.beginPath();
    // Island shape - organic and mountainous
    ctx.moveTo(0, horizonY);
    ctx.quadraticCurveTo(canvas.width * 0.1, horizonY - 40, canvas.width * 0.2, horizonY - 30);
    ctx.quadraticCurveTo(canvas.width * 0.25, horizonY - 50, canvas.width * 0.3, horizonY - 45);
    ctx.quadraticCurveTo(canvas.width * 0.35, horizonY - 60, canvas.width * 0.4, horizonY - 35);
    ctx.quadraticCurveTo(canvas.width * 0.45, horizonY - 20, canvas.width * 0.5, horizonY);
    ctx.lineTo(0, horizonY);
    ctx.closePath();
    ctx.fill();
    
    // Draw the local island where the windsock mast and lighthouse stand together
    ctx.globalAlpha = 0.6; // More prominent since it's closer
    ctx.fillStyle = silhouetteColor;
    
    const poleX = canvas.width * 0.85; // Same as windsock pole position
    
    ctx.beginPath();
    // Local island - larger hill to accommodate both mast and lighthouse
    ctx.moveTo(poleX - 150, horizonY);
    ctx.quadraticCurveTo(poleX - 120, horizonY - 30, poleX - 80, horizonY - 35);
    ctx.quadraticCurveTo(poleX - 40, horizonY - 45, poleX, horizonY - 50); // Peak under mast
    ctx.quadraticCurveTo(poleX + 40, horizonY - 45, poleX + 80, horizonY - 35);
    ctx.quadraticCurveTo(poleX + 120, horizonY - 25, poleX + 150, horizonY);
    ctx.lineTo(canvas.width, horizonY);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(poleX - 150, canvas.height);
    ctx.closePath();
    ctx.fill();
    
    // Draw traditional lighthouse with animated light
    drawTraditionalLighthouse(ctx, poleX - 60, horizonY - 35, time);
    
    // Add some distant mountains/hills for depth
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = silhouetteColor;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.6, horizonY);
    ctx.quadraticCurveTo(canvas.width * 0.7, horizonY - 20, canvas.width * 0.8, horizonY - 15);
    ctx.quadraticCurveTo(canvas.width * 0.9, horizonY - 25, canvas.width, horizonY - 10);
    ctx.lineTo(canvas.width, horizonY);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

function drawTraditionalLighthouse(ctx, x, y, time) {
    ctx.save();
    
    const silhouetteColor = '#2C3E50';
    
    // Lighthouse dimensions
    const baseWidth = 12;
    const topWidth = 8;
    const height = 50;
    const lampRoomHeight = 12;
    
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
    
    // Add horizontal stripes for traditional lighthouse look
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.1;
    // White stripes
    ctx.fillRect(x - baseWidth/2 + 1, y - height * 0.2, baseWidth - 2, 3);
    ctx.fillRect(x - baseWidth/2 + 1, y - height * 0.5, baseWidth - 2, 3);
    ctx.fillRect(x - baseWidth/2 + 1, y - height * 0.8, baseWidth - 2, 3);
    
    // Lamp room (lantern at top)
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = silhouetteColor;
    ctx.fillRect(x - (topWidth + 4)/2, y - height - lampRoomHeight, topWidth + 4, lampRoomHeight);
    
    // Lamp room windows (glass panels)
    ctx.fillStyle = '#FFE4CC';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(x - topWidth/2 + 1, y - height - lampRoomHeight + 2, topWidth - 2, lampRoomHeight - 4);
    
    // Roof/cap
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = silhouetteColor;
    ctx.beginPath();
    ctx.moveTo(x - (topWidth + 6)/2, y - height - lampRoomHeight);
    ctx.lineTo(x, y - height - lampRoomHeight - 8);
    ctx.lineTo(x + (topWidth + 6)/2, y - height - lampRoomHeight);
    ctx.closePath();
    ctx.fill();
    
    // Animated rotating light beam
    const lightCenterX = x;
    const lightCenterY = y - height - lampRoomHeight/2;
    const beamLength = 80;
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


