// Wind rendering system for the archery game - Orange & White Minimalist Theme with Mobile Support

import { responsive } from '../utils/responsiveUtils.js';

export function drawWind(ctx, canvas, wind) {
    const config = responsive.getWindPanelConfig();
    
    ctx.save();
    
    // Clean minimalist wind panel with responsive shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 8 * responsive.scaleFactor;
    ctx.shadowOffsetX = 2 * responsive.scaleFactor;
    ctx.shadowOffsetY = 2 * responsive.scaleFactor;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 3 * responsive.scaleFactor;
    ctx.beginPath();
    ctx.roundRect(config.x, config.y, config.width, config.height, 16 * responsive.scaleFactor);
    ctx.fill();
    ctx.stroke();
    
    // Clean typography with responsive sizing
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#FF6B00';
    ctx.font = responsive.getScaledFont(config.fontSize.title);
    
    if (responsive.isMobile) {
        // Compact mobile layout
        const centerY = config.y + config.height / 2;
        ctx.fillText(`${wind.strength.toFixed(1)} m/s`, config.x + 8, centerY - 5);
        
        ctx.fillStyle = '#333333';
        ctx.font = responsive.getScaledFont(config.fontSize.value);
        ctx.fillText(`${Math.round(wind.direction * 180 / Math.PI)}°`, config.x + 8, centerY + 12);
    } else {
        // Desktop layout
        ctx.fillText(`Wind: ${wind.strength.toFixed(2)} m/s`, config.x + 10, config.y + 25);
        
        ctx.fillStyle = '#333333';
        ctx.font = responsive.getScaledFont(config.fontSize.value);
        ctx.fillText(`Direction: ${Math.round(wind.direction * 180 / Math.PI)}°`, config.x + 10, config.y + 50);
    }
    
    ctx.restore();
}

export function drawWindIndicator(ctx, canvas, wind) {
    const config = responsive.getWindIndicatorConfig();
    
    ctx.save();
    
    // Clean circular background with responsive sizing
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 6 * responsive.scaleFactor;
    ctx.shadowOffsetX = 2 * responsive.scaleFactor;
    ctx.shadowOffsetY = 2 * responsive.scaleFactor;
    
    ctx.beginPath();
    ctx.arc(config.x, config.y, config.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fill();
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 3 * responsive.scaleFactor;
    ctx.stroke();
    
    // Wind direction arrow with responsive sizing
    ctx.shadowColor = 'transparent';
    ctx.translate(config.x, config.y);
    ctx.rotate(wind.direction);
    
    const intensity = Math.abs(wind.strength);
    const arrowLength = Math.abs(wind.strength) * config.arrowLength;
    
    // Orange gradient based on intensity
    const orangeIntensity = Math.floor(255 * intensity);
    const orangeBase = 255 - Math.floor(100 * intensity);
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(arrowLength, 0);
    ctx.strokeStyle = `rgb(255, ${orangeBase}, ${Math.floor(orangeBase * 0.3)})`;
    ctx.lineWidth = 4 * responsive.scaleFactor;
    ctx.stroke();
    
    // Arrow head with responsive sizing
    if (arrowLength > 5 * responsive.scaleFactor) {
        const arrowHeadSize = 10 * responsive.scaleFactor;
        const arrowHeadWidth = 5 * responsive.scaleFactor;
        
        ctx.beginPath();
        ctx.moveTo(arrowLength, 0);
        ctx.lineTo(arrowLength - arrowHeadSize, -arrowHeadWidth);
        ctx.lineTo(arrowLength - arrowHeadSize, arrowHeadWidth);
        ctx.closePath();
        ctx.fillStyle = `rgb(255, ${orangeBase}, ${Math.floor(orangeBase * 0.3)})`;
        ctx.fill();
    }
    
    ctx.restore();
}
