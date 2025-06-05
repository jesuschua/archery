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
        const arrowTailY = arrow.y - Math.sin(arrow.angle) * (arrowLength / 2);        if (lineCircleIntersection(
            arrowTailX, arrowTailY,
            arrowTipX, arrowTipY,
            target.x, target.y, target.radius
        )) {
            const distance = calculateDistanceFromTarget(arrow, target);
            onHit && onHit(distance);
        }
        if (
            arrow.x > window.innerWidth ||
            arrow.y > window.innerHeight ||
            arrow.x < 0 ||
            arrow.y < 0
        ) {
            const distance = calculateDistanceFromTarget(arrow, target);
            onMiss && onMiss(distance);
        }
    }
}

export function calculateDistanceFromTarget(arrow, target) {
    return Math.sqrt(Math.pow(arrow.x - target.x, 2) + Math.pow(arrow.y - target.y, 2));
}

export function getReactionMessage(distance, targetRadius) {
    const distanceRatio = distance / targetRadius;
    
    if (distanceRatio <= 1) {
        // Hit the target - enthusiastic coaching reactions
        const hitMessages = ["Perfect!", "Bullseye!", "Excellent!", "Outstanding!", "Great shot!"];
        return hitMessages[Math.floor(Math.random() * hitMessages.length)];
    } else if (distanceRatio <= 1.5) {
        // Very close miss - encouraging coach reactions
        const closeMessages = ["So close!", "Almost there!", "Nearly perfect!", "Keep it up!", "Good form!"];
        return closeMessages[Math.floor(Math.random() * closeMessages.length)];
    } else if (distanceRatio <= 10) {
        // Close miss - constructive coaching
        const missMessages = ["Adjust your aim!", "Try again!", "Focus!", "Breathe and aim!", "You've got this!"];
        return missMessages[Math.floor(Math.random() * missMessages.length)];
    } else if (distanceRatio <= 20) {
        // Mid miss - motivational coaching
        const midMessages = ["Keep trying!", "Check the wind!", "Steady now!", "Focus on form!", "Don't give up!"];
        return midMessages[Math.floor(Math.random() * midMessages.length)];
    } else {
        // Far miss - encouraging coaching
        const farMessages = ["Try again!", "Check your stance!", "Watch the wind!", "Stay focused!", "Practice makes perfect!"];
        return farMessages[Math.floor(Math.random() * farMessages.length)];
    }
}
