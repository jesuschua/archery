// Game logic system for the archery game
import { lineCircleIntersection } from '../utils/gameUtils.js';

export function updateArrow(arrow, wind, gravity, arrowPath, target, onHit, onMiss, canvas, onSpotterHit) {
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

        // Check for spotter collision if canvas is provided
        if (canvas && onSpotterHit) {
            const spotterHitbox = getSpotterHitbox(canvas);
            if (checkArrowSpotterCollision(arrowTailX, arrowTailY, arrowTipX, arrowTipY, spotterHitbox)) {
                onSpotterHit();
                return; // Stop arrow update after hitting spotter
            }
        }

        if (lineCircleIntersection(
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

function getSpotterHitbox(canvas) {
    // Calculate spotter position (same as in ui.js)
    const poleX = canvas.width * 0.85;
    const spotterX = poleX - 20;
    const spotterY = canvas.height * 0.75 - 15;
    
    // Spotter dimensions for hitbox (increased for easier near-miss detection)
    const headRadius = 4;
    const bodyHeight = 12;
    const bodyWidth = 6;
    const legLength = 10;
    
    // Total character dimensions for hitbox with padding for near misses
    const totalWidth = Math.max(bodyWidth, headRadius * 2);
    const totalHeight = headRadius * 2 + bodyHeight + legLength;
    
    // Add padding around the spotter for near-miss detection
    const hitboxPadding = 15; // Increased padding for easier triggering
    
    return {
        x: spotterX - totalWidth/2 - hitboxPadding,
        y: spotterY - headRadius - hitboxPadding,
        width: totalWidth + hitboxPadding * 2,
        height: totalHeight + hitboxPadding * 2,
        centerX: spotterX,
        centerY: spotterY + (totalHeight / 2) - headRadius
    };
}

function checkArrowSpotterCollision(arrowTailX, arrowTailY, arrowTipX, arrowTipY, spotterHitbox) {
    // Check if the arrow line intersects with the spotter's rectangular hitbox
    return lineRectangleIntersection(
        arrowTailX, arrowTailY,
        arrowTipX, arrowTipY,
        spotterHitbox.x, spotterHitbox.y,
        spotterHitbox.width, spotterHitbox.height
    );
}

function lineRectangleIntersection(x1, y1, x2, y2, rectX, rectY, rectWidth, rectHeight) {
    // Check if line segment intersects with rectangle
    // First check if either endpoint is inside the rectangle
    if (pointInRectangle(x1, y1, rectX, rectY, rectWidth, rectHeight) ||
        pointInRectangle(x2, y2, rectX, rectY, rectWidth, rectHeight)) {
        return true;
    }
    
    // Check if line intersects any of the four rectangle edges
    return lineLineIntersection(x1, y1, x2, y2, rectX, rectY, rectX + rectWidth, rectY) || // Top edge
           lineLineIntersection(x1, y1, x2, y2, rectX + rectWidth, rectY, rectX + rectWidth, rectY + rectHeight) || // Right edge
           lineLineIntersection(x1, y1, x2, y2, rectX + rectWidth, rectY + rectHeight, rectX, rectY + rectHeight) || // Bottom edge
           lineLineIntersection(x1, y1, x2, y2, rectX, rectY + rectHeight, rectX, rectY); // Left edge
}

function pointInRectangle(x, y, rectX, rectY, rectWidth, rectHeight) {
    return x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight;
}

function lineLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Calculate the direction vectors
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 1e-10) return false; // Lines are parallel
    
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
    
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

export function calculateDistanceFromTarget(arrow, target) {
    return Math.sqrt(Math.pow(arrow.x - target.x, 2) + Math.pow(arrow.y - target.y, 2));
}

export function getSpotterHitMessage() {
    const spotterHitMessages = [
        "Hey! Watch it!",
        "Ouch! I'm on your side!",
        "Wrong target!",
        "That hurt!",
        "I'm the coach!",
        "Focus on the target!",
        "Not me!",
        "Careful there!",
        "I'm trying to help!"
    ];
    return spotterHitMessages[Math.floor(Math.random() * spotterHitMessages.length)];
}

export function getSpotterEndRoundMessage(score, totalShots) {
    if (score === 0) {
        // Zero score - disappointed but encouraging coach messages
        const zeroScoreMessages = [
            "Don't give up! Practice makes perfect!",
            "Everyone starts somewhere. Keep trying!",
            "Focus on your form and try again!",
            "Remember to breathe and aim carefully!",
            "The target won't move... much!",
            "Maybe try standing a bit closer next time?",
            "I've seen worse... well, maybe not!",
            "At least you didn't hit me this time!"
        ];
        return zeroScoreMessages[Math.floor(Math.random() * zeroScoreMessages.length)];
    } else if (score === totalShots) {
        // Perfect score - enthusiastic coach celebration
        const perfectScoreMessages = [
            "INCREDIBLE! Perfect round!",
            "OUTSTANDING! You're a natural!",
            "AMAZING! Five perfect shots!",
            "BRILLIANT! That's archery mastery!",
            "PHENOMENAL! I couldn't do better myself!",
            "SPECTACULAR! You've mastered the bow!",
            "FLAWLESS! Absolutely flawless shooting!",
            "MAGNIFICENT! Robin Hood would be proud!"
        ];
        return perfectScoreMessages[Math.floor(Math.random() * perfectScoreMessages.length)];
    }
    
    // Return null for other scores (use regular reaction messages)
    return null;
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
