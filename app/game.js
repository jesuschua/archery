const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gravity = 0.025;  // Adjust this value to simulate gravity

// Resize canvas to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', resizeCanvas);

let time = 0;

let targetColor = 'red';  // Variable to track the target's color

let target_ratio = 0.012;  // 1.2% of canvas width

let wind = {
    strength: 0,
    direction: 0 // Angle in radians, where 0 is to the right and π is to the left
};

let bow = {
    x: 0.3,  // 30% of canvas width
    y: 0.5,  // 50% of canvas height
    angle: 0,
    pulling: false,
    width: 0.05,  // 5% of canvas width
    height: 0.2  // 20% of canvas height
};

let arrow = {
    x: bow.x,
    y: bow.y,
    speed: 0,
    fired: false,
    angle: bow.angle,
    releaseAngle: 0, // Added to store the release angle
    width: 0.02,  // 2% of canvas width
    height: 0.01  // 1% of canvas height
};

const target = {
    x: 0.9,  // 90% of canvas width
    y: 0.5,  // 50% of canvas height
    radius: target_ratio,  // 2% of canvas width
    amplitude: 100,
    frequency: 0.01
};

let score = 0;
let triesLeft = 3;  // Variable to track the number of tries left
let arrowPath = [];  // Array to store the positions of the arrow

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Update bow and arrow positions
    bow.x = canvas.width * 0.3;
    bow.y = canvas.height * 0.5;
    bow.width = canvas.width * 0.05;
    bow.height = canvas.height * 0.2;
    arrow.x = bow.x;
    arrow.y = bow.y;
    arrow.width = canvas.width * 0.02;
    arrow.height = canvas.height * 0.01;

    // Update target position and size
    target.x = canvas.width * 0.9;
    target.y = canvas.height * 0.5;
    target.radius = canvas.width * target_ratio;  // Corrected to 2% of canvas width
}

function drawWindIndicator() {
    const centerX = canvas.width * 0.85;
    const centerY = canvas.height * 0.15;
    const maxArrowLength = 50;
    const arrowLength = Math.abs(wind.strength) * maxArrowLength;
    const arrowAngle = wind.direction;

    ctx.save();
    
    // Draw compass circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.translate(centerX, centerY);
    ctx.rotate(arrowAngle);

    // Draw arrow with varying color based on strength
    const intensity = Math.abs(wind.strength);
    const red = Math.floor(255 * intensity);
    const blue = Math.floor(255 * (1 - intensity));
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(arrowLength, 0);
    ctx.strokeStyle = `rgb(${red}, 100, ${blue})`;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Arrow head
    if (arrowLength > 5) {
        ctx.beginPath();
        ctx.moveTo(arrowLength, 0);
        ctx.lineTo(arrowLength - 10, -5);
        ctx.lineTo(arrowLength - 10, 5);
        ctx.closePath();
        ctx.fillStyle = `rgb(${red}, 100, ${blue})`;
        ctx.fill();
    }
    
    ctx.restore();
}

// Add a background gradient function
function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.7, '#98FB98'); // Pale green
    gradient.addColorStop(1, '#228B22'); // Forest green
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some clouds
    drawClouds();
}

function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // Cloud 1
    drawCloud(canvas.width * 0.2, canvas.height * 0.2, 40);
    
    // Cloud 2
    drawCloud(canvas.width * 0.6, canvas.height * 0.15, 35);
    
    // Cloud 3
    drawCloud(canvas.width * 0.8, canvas.height * 0.25, 30);
}

function drawCloud(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.arc(x + size * 0.6, y, size * 0.8, 0, Math.PI * 2);
    ctx.arc(x + size * 1.2, y, size, 0, Math.PI * 2);
    ctx.arc(x + size * 0.6, y - size * 0.5, size * 0.7, 0, Math.PI * 2);
    ctx.fill();
}

function gameLoop() {
    // Draw background first
    drawBackground();

    time += 1;

    target.y = canvas.height / 2 + Math.sin(time * target.frequency) * target.amplitude;

    drawBow();
    drawArrow();
    drawTarget();
    drawScore();
    drawTriesLeft();
    drawTracer();
    drawWind();
    drawWindIndicator();

    if (arrow.fired) {
        updateArrow();
    }

    requestAnimationFrame(gameLoop);
}

resizeCanvas();
gameLoop();

function drawBow() {
    ctx.save();
    ctx.translate(bow.x, bow.y);
    ctx.rotate(bow.angle);
    
    // Draw bow body with gradient
    const bowGradient = ctx.createLinearGradient(-5, -100, 15, 100);
    bowGradient.addColorStop(0, '#8B4513');
    bowGradient.addColorStop(0.5, '#A0522D');
    bowGradient.addColorStop(1, '#654321');
    
    ctx.fillStyle = bowGradient;
    ctx.fillRect(8, -95, 14, 190);
    
    // Add bow string
    ctx.strokeStyle = '#F5F5DC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, -90);
    ctx.quadraticCurveTo(-20, 0, 10, 90);
    ctx.stroke();
    
    // Add grip area
    ctx.fillStyle = '#654321';
    ctx.fillRect(6, -15, 18, 30);
    
    ctx.restore();
}

function drawArrow() {
    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.rotate(arrow.fired ? arrow.angle : bow.angle);
    
    // Arrow shaft with gradient - flipped coordinates
    const shaftGradient = ctx.createLinearGradient(-90, 0, 90, 0);
    shaftGradient.addColorStop(0, '#CD853F');
    shaftGradient.addColorStop(0.2, '#D2691E');
    shaftGradient.addColorStop(1, '#8B4513');
    
    ctx.fillStyle = shaftGradient;
    ctx.fillRect(-90, -2, 180, 4);
    
    // Arrow tip (metal) - now at the back in drawing coords but front in travel direction
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.moveTo(-90, 0);
    ctx.lineTo(-75, -4);
    ctx.lineTo(-75, 4);
    ctx.closePath();
    ctx.fill();
    
    // Arrow fletching - now at the front in drawing coords but back in travel direction
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

function drawTarget() {
    // Add shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    
    const colors = ["#FF0000", "#FFFFFF", "#FF0000", "#FFFFFF", "#FFD700"]; // Gold center
    const ringSize = target.radius / colors.length;

    for (let i = 0; i < colors.length; i++) {
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius - (i * ringSize), 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.fill();
        
        // Add ring borders
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }
    
    ctx.restore();

    // Hit feedback with glow effect
    if (targetColor === 'green') {
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

function drawScore() {
    // Add background for better readability
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(5, 5, 150, 35);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function drawTriesLeft() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(5, 45, 180, 35);
    
    ctx.fillStyle = triesLeft <= 1 ? '#FF4444' : '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Tries Left: ${triesLeft}`, 10, 70);
}

function drawTracer() {
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

function drawWind() {
    // Background for wind info
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(canvas.width - 220, 5, 215, 70);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Wind: ${wind.strength.toFixed(2)} m/s`, canvas.width - 210, 30);
    ctx.fillText(`Direction: ${Math.round(wind.direction * 180 / Math.PI)}°`, canvas.width - 210, 55);
}

function getEventPosition(e) {
    if (e.touches) {  // If this is a touch event
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else {  // If this is a mouse event
        return { x: e.clientX, y: e.clientY };
    }
}

function updateBowAngle(e) {
    if (!arrow.fired) {  // Only update the angle if the arrow is not fired
        let pos;
        if (e.touches) {  // If this is a touch event
            pos = getEventPosition(e.touches[0]);
        } else {  // If this is a mouse event
            pos = getEventPosition(e);
        }
        let dx = pos.x - bow.x;
        let dy = pos.y - bow.y;
        bow.angle = Math.atan2(dy, dx);
        arrow.angle = bow.angle;  // Remove the incorrect PI/2 adjustment
    }
}

window.addEventListener('mousemove', updateBowAngle);
window.addEventListener('touchmove', updateBowAngle);

window.addEventListener('mousedown', startPulling);
window.addEventListener('touchstart', startPulling);

window.addEventListener('mouseup', releaseArrow);
window.addEventListener('touchend', releaseArrow);

function startPulling() {
    bow.pulling = true;
}

function releaseArrow() {
    if (bow.pulling) {
        updateWind();  // Update wind conditions when the arrow is fired
        arrow.fired = true;
        arrow.speed = 30;  // Adjust this for difficulty
        arrow.vx = arrow.speed * Math.cos(bow.angle);  // Horizontal component of velocity
        arrow.vy = arrow.speed * Math.sin(bow.angle);  // Vertical component of velocity
        bow.pulling = false;
        arrow.releaseAngle = bow.angle;  // Store the angle at the moment of release
    }
}



function updateWind() {
    wind.strength = Math.random() * 2 - 1;  // Random value between -1 and 1 (negative for left, positive for right)
    wind.direction = Math.random() * Math.PI * 2;  // Random direction in radians
}


function updateArrow() {
    if (arrow.fired) {
        // Apply wind resistance
        arrow.vx += wind.strength * Math.cos(wind.direction) * 0.05;  // Wind's horizontal effect
        arrow.vy += wind.strength * Math.sin(wind.direction) * 0.05;  // Wind's vertical effect

        arrow.x += arrow.vx;
        arrow.y += arrow.vy;
        arrow.vy += gravity;  // Apply gravity to the vertical velocity

        // Calculate the angle of the velocity vector
        arrow.angle = Math.atan2(arrow.vy, arrow.vx);

        // Store the current position in the arrowPath array
        arrowPath.push({ x: arrow.x, y: arrow.y });

        // Calculate arrow tip and tail positions for better collision detection
        const arrowLength = 150; // Length of arrow in pixels
        const arrowTipX = arrow.x + Math.cos(arrow.angle) * (arrowLength / 2);
        const arrowTipY = arrow.y + Math.sin(arrow.angle) * (arrowLength / 2);
        const arrowTailX = arrow.x - Math.cos(arrow.angle) * (arrowLength / 2);
        const arrowTailY = arrow.y - Math.sin(arrow.angle) * (arrowLength / 2);

        // Check if any point along the arrow shaft intersects with the target
        if (lineCircleIntersection(
            arrowTailX, arrowTailY, 
            arrowTipX, arrowTipY, 
            target.x, target.y, target.radius
        )) {
            score += 1;  // Simple scoring, adjust as needed
            targetColor = 'green';  // Change target color to green
            setTimeout(() => {
                targetColor = 'red';  // Revert target color back to red after 500ms
            }, 500);
            resetArrow();
        }

        // If arrow goes off-screen, reset
        if (arrow.x > canvas.width || arrow.y > canvas.height || arrow.x < 0 || arrow.y < 0) {
            resetArrow();
        }
    }
}

// Function to check if a line segment intersects with a circle
function lineCircleIntersection(x1, y1, x2, y2, cx, cy, r) {
    // Vector from line start to circle center
    const dx = cx - x1;
    const dy = cy - y1;
    
    // Vector representing the line
    const lineVectorX = x2 - x1;
    const lineVectorY = y2 - y1;
    
    // Length of line
    const lineLength = Math.sqrt(lineVectorX * lineVectorX + lineVectorY * lineVectorY);
    
    // Normalize line vector
    const unitLineVectorX = lineVectorX / lineLength;
    const unitLineVectorY = lineVectorY / lineLength;
    
    // Project vector from line start to circle center onto the line vector
    const projection = dx * unitLineVectorX + dy * unitLineVectorY;
    
    // Get the closest point on the line to the circle center
    let closestX, closestY;
    
    // Check if projection is outside the line segment
    if (projection < 0) {
        closestX = x1;
        closestY = y1;
    } else if (projection > lineLength) {
        closestX = x2;
        closestY = y2;
    } else {
        // Point is on the line segment
        closestX = x1 + unitLineVectorX * projection;
        closestY = y1 + unitLineVectorY * projection;
    }
    
    // Calculate distance from closest point to circle center
    const distance = Math.sqrt((closestX - cx) * (closestX - cx) + (closestY - cy) * (closestY - cy));
    
    // If distance is less than or equal to radius, there is an intersection
    return distance <= r;
}

function resetArrow() {
    arrow.fired = false;
    arrow.x = bow.x;  // Reset to bow's position
    arrow.y = bow.y;  // Reset to bow's position
    arrow.vx = 0;
    arrow.vy = 0;
    arrow.speed = 0;
    arrow.angle = bow.angle;  // Reset the angle to the bow's angle
    arrowPath = [];  // Clear the arrow path

    triesLeft -= 1;  // Decrement the number of tries left

    if (triesLeft <= 0) {
        setTimeout(() => {
            alert(`Game Over! Your score: ${score}`);
            resetGame();
        }, 500);  // Delay the game over message by 500ms
    }
}

function resetGame() {
    score = 0;
    triesLeft = 3;
    targetColor = 'red';
    arrow.fired = false;
    arrow.x = bow.x;
    arrow.y = bow.y;
    arrow.vx = 0;
    arrow.vy = 0;
    arrow.speed = 0;
    arrow.angle = bow.angle;
    arrowPath = [];
}
