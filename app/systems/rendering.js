// Rendering system for the archery game
import { lineCircleIntersection } from '../utils/gameUtils.js';

export function drawBow(ctx, bow) {
    ctx.save();
    ctx.translate(bow.x, bow.y);
    ctx.rotate(bow.angle);
    const bowGradient = ctx.createLinearGradient(-5, -100, 15, 100);
    bowGradient.addColorStop(0, '#8B4513');
    bowGradient.addColorStop(0.5, '#A0522D');
    bowGradient.addColorStop(1, '#654321');
    ctx.fillStyle = bowGradient;
    ctx.fillRect(8, -95, 14, 190);
    ctx.strokeStyle = '#F5F5DC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, -90);
    ctx.quadraticCurveTo(-20, 0, 10, 90);
    ctx.stroke();
    ctx.fillStyle = '#654321';
    ctx.fillRect(6, -15, 18, 30);
    ctx.restore();
}

export function drawArrow(ctx, arrow, bow) {
    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.rotate(arrow.fired ? arrow.angle : bow.angle);
    const shaftGradient = ctx.createLinearGradient(-90, 0, 90, 0);
    shaftGradient.addColorStop(0, '#CD853F');
    shaftGradient.addColorStop(0.2, '#D2691E');
    shaftGradient.addColorStop(1, '#8B4513');
    ctx.fillStyle = shaftGradient;
    ctx.fillRect(-90, -2, 180, 4);
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.moveTo(-90, 0);
    ctx.lineTo(-75, -4);
    ctx.lineTo(-75, 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.moveTo(90, 0);
    ctx.lineTo(75, -8);
    ctx.lineTo(80, 0);
    ctx.lineTo(75, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

export function drawTarget(ctx, target, color) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    const colors = ["#FF0000", "#FFFFFF", "#FF0000", "#FFFFFF", "#FFD700"];
    const ringSize = target.radius / colors.length;
    for (let i = 0; i < colors.length; i++) {
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius - (i * ringSize), 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }
    ctx.restore();
    if (color === 'green') {
        ctx.save();
        ctx.shadowColor = 'lime';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(target.x, target.y, ringSize, 0, Math.PI * 2);
        ctx.fillStyle = 'lime';
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}
