// Utility functions for the archery game

export function lineCircleIntersection(x1, y1, x2, y2, cx, cy, r) {
    const dx = cx - x1;
    const dy = cy - y1;
    const lineVectorX = x2 - x1;
    const lineVectorY = y2 - y1;
    const lineLength = Math.sqrt(lineVectorX * lineVectorX + lineVectorY * lineVectorY);
    const unitLineVectorX = lineVectorX / lineLength;
    const unitLineVectorY = lineVectorY / lineLength;
    const projection = dx * unitLineVectorX + dy * unitLineVectorY;
    let closestX, closestY;
    if (projection < 0) {
        closestX = x1;
        closestY = y1;
    } else if (projection > lineLength) {
        closestX = x2;
        closestY = y2;
    } else {
        closestX = x1 + unitLineVectorX * projection;
        closestY = y1 + unitLineVectorY * projection;
    }
    const distance = Math.sqrt((closestX - cx) * (closestX - cx) + (closestY - cy) * (closestY - cy));
    return distance <= r;
}

export function randomWind() {
    return {
        strength: Math.random() * 2 - 1,
        direction: Math.random() * Math.PI * 2
    };
}
