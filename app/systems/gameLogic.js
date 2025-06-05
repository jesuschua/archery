// Game logic system for the archery game
import { lineCircleIntersection } from '../utils/gameUtils.js';

export function updateArrow(arrow, wind, gravity, arrowPath, target, onHit, onMiss) {
    if (arrow.fired) {
        // Wind effect: wind.strength is the magnitude, wind.direction is the angle
        // The wind vector should be: wind.strength * cos(direction) for x, wind.strength * sin(direction) for y
        // Remove any Math.abs or Math.sign usage
        arrow.vx += wind.strength * Math.cos(wind.direction) * 0.05;
        arrow.vy += wind.strength * Math.sin(wind.direction) * 0.05;
        arrow.x += arrow.vx;
        arrow.y += arrow.vy;
        arrow.vy += gravity;
        // Calculate the angle of the velocity vector (should use vx, vy, not vy, vx)
        arrow.angle = Math.atan2(arrow.vy, arrow.vx);
        arrowPath.push({ x: arrow.x, y: arrow.y });
        const arrowLength = 150;
        const arrowTipX = arrow.x + Math.cos(arrow.angle) * (arrowLength / 2);
        const arrowTipY = arrow.y + Math.sin(arrow.angle) * (arrowLength / 2);
        const arrowTailX = arrow.x - Math.cos(arrow.angle) * (arrowLength / 2);
        const arrowTailY = arrow.y - Math.sin(arrow.angle) * (arrowLength / 2);
        if (lineCircleIntersection(
            arrowTailX, arrowTailY,
            arrowTipX, arrowTipY,
            target.x, target.y, target.radius
        )) {
            onHit && onHit();
        }
        if (
            arrow.x > window.innerWidth ||
            arrow.y > window.innerHeight ||
            arrow.x < 0 ||
            arrow.y < 0
        ) {
            onMiss && onMiss();
        }
    }
}
