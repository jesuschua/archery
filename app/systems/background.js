// Background rendering system for the archery game - Orange & White Minimalist Theme
export function drawBackground(ctx, canvas) {
    // Simple gradient background - Orange & White minimalist theme
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FFF8F0');    // Very light cream at top
    gradient.addColorStop(0.5, '#FFEDE0');  // Light orange-cream middle
    gradient.addColorStop(1, '#FFE4CC');    // Slightly deeper cream at bottom
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw silhouette elements
    drawIslandLighthouseSilhouette(ctx, canvas);
}

function drawIslandLighthouseSilhouette(ctx, canvas) {
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
    
    // Draw lighthouse on the same island, positioned near the mast and spotter
    ctx.globalAlpha = 0.7; // Prominent since it's on the main island
    
    // Lighthouse position - to the left of the mast where spotter is
    const lighthouseX = poleX - 60; // Position between spotter and mast
    const lighthouseBaseY = horizonY - 35; // On the island surface
    const lighthouseHeight = 40;
    const lighthouseWidth = 5;
    
    // Lighthouse tower - tall and narrow
    ctx.fillRect(lighthouseX - lighthouseWidth/2, lighthouseBaseY - lighthouseHeight, 
                 lighthouseWidth, lighthouseHeight);
    
    // Lighthouse lamp room - wider top section
    ctx.fillRect(lighthouseX - lighthouseWidth * 1.2, lighthouseBaseY - lighthouseHeight - 10, 
                 lighthouseWidth * 2.4, 10);
    
    // Lighthouse light beacon (subtle glow)
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#FFB366'; // Warm orange glow
    ctx.beginPath();
    ctx.arc(lighthouseX, lighthouseBaseY - lighthouseHeight - 5, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset for next elements
    ctx.fillStyle = silhouetteColor;
    
    // Add some distant mountains/hills for depth
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.6, horizonY);
    ctx.quadraticCurveTo(canvas.width * 0.7, horizonY - 20, canvas.width * 0.8, horizonY - 15);
    ctx.quadraticCurveTo(canvas.width * 0.9, horizonY - 25, canvas.width, horizonY - 10);
    ctx.lineTo(canvas.width, horizonY);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}


