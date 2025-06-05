// Rendering system for the archery game - Orange & White Minimalist Theme
import { lineCircleIntersection } from '../utils/gameUtils.js';

export function drawBow(ctx, bow) {
    ctx.save();
    ctx.translate(bow.x, bow.y);
    ctx.rotate(bow.angle);
    
    // Clean, minimalist bow design with orange gradients
    const bowGradient = ctx.createLinearGradient(-5, -100, 15, 100);
    bowGradient.addColorStop(0, '#FF8C42');  // Vibrant orange
    bowGradient.addColorStop(0.5, '#FF7A28'); // Mid orange
    bowGradient.addColorStop(1, '#E85A00');   // Deeper orange
    
    // Main bow body - sleek and minimal
    ctx.fillStyle = bowGradient;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillRect(8, -95, 14, 190);
    
    // Clean bow string - minimal white line
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(10, -90);
    ctx.quadraticCurveTo(-20, 0, 10, 90);
    ctx.stroke();
    
    // Grip area - subtle orange accent
    ctx.fillStyle = '#D14500';
    ctx.fillRect(6, -15, 18, 30);
    
    ctx.restore();
}

export function drawArrow(ctx, arrow, bow) {
    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.rotate(arrow.fired ? arrow.angle : bow.angle);
    
    // Minimalist arrow design
    const shaftGradient = ctx.createLinearGradient(-90, 0, 90, 0);
    shaftGradient.addColorStop(0, '#FFFFFF');    // White tail
    shaftGradient.addColorStop(0.3, '#FFE4CC');  // Light orange
    shaftGradient.addColorStop(1, '#FF8C42');    // Orange tip
      // Arrow shaft - clean and sleek
    ctx.fillStyle = shaftGradient;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 4;
    ctx.fillRect(-90, -2, 180, 4);    // Arrow fletching - realistic feathers extending backward from nock end
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FF8C42';
    ctx.lineWidth = 1;
    
    // Draw three fletching feathers that extend backward from nock end
    // Feather 1 (top) - larger feather extending backward and upward
    ctx.beginPath();
    ctx.moveTo(-90, 0);          // Start exactly at shaft end
    ctx.lineTo(-110, -12);       // Extend further backward and up
    ctx.lineTo(-105, -10);       // Feather outer edge
    ctx.lineTo(-95, -8);         // Mid point
    ctx.lineTo(-90, -1);         // Back to shaft end (thin attachment point)
    ctx.closePath();
    ctx.fill();
    ctx.stroke();    
    // Feather 2 (bottom) - larger feather extending backward and downward  
    ctx.beginPath();
    ctx.moveTo(-90, 0);          // Start exactly at shaft end
    ctx.lineTo(-110, 12);        // Extend further backward and down
    ctx.lineTo(-105, 10);        // Feather outer edge
    ctx.lineTo(-95, 8);          // Mid point
    ctx.lineTo(-90, 1);          // Back to shaft end (thin attachment point)
    ctx.closePath();
    ctx.fill();
    ctx.stroke();    
    // Feather 3 (side) - straight back feather for stability
    ctx.beginPath();
    ctx.moveTo(-90, 0);          // Start exactly at shaft end
    ctx.lineTo(-108, 0);         // Extend straight backward
    ctx.lineTo(-106, -5);        // Upper feather edge
    ctx.lineTo(-106, 5);         // Lower feather edge
    ctx.lineTo(-90, 1);          // Back to shaft end
    ctx.lineTo(-90, -1);         // Complete the thin attachment at shaft end
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Arrow point - sharp pointed tip at the front
    ctx.fillStyle = '#FF6B00';
    ctx.beginPath();
    ctx.moveTo(90, 0);     // Sharp tip point
    ctx.lineTo(75, -4);    // Upper edge
    ctx.lineTo(75, 4);     // Lower edge
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
