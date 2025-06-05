// Tracer rendering system for the archery game
export function drawTracer(ctx, arrowPath) {
    if (arrowPath.length > 1) {
        ctx.save();
        ctx.shadowColor = 'orange';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.moveTo(arrowPath[0].x, arrowPath[0].y);
        for (let i = 1; i < arrowPath.length; i++) {
            ctx.lineTo(arrowPath[i].x, arrowPath[i].y);
        }
        ctx.strokeStyle = 'rgba(255, 165, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}
