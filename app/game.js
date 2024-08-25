const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let time = 0;

let bow = {
    x: 300,
    y: canvas.height / 2,
    angle: 0,
    pulling: false
};

let arrow = {
    x: bow.x,
    y: bow.y,
    speed: 0,
    fired: false,
    angle: bow.angle,
    releaseAngle: 0 // Added to store the release angle
};

const target = {
    x: canvas.width - 100,
    y: canvas.height / 2,
    radius: 30,
    amplitude: 100,
    frequency: 0.01
};

let score = 0;

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    time += 1;

    target.y = canvas.height / 2 + Math.sin(time * target.frequency) * target.amplitude;

    drawBow();
    drawArrow();
    drawTarget();
    drawScore();

    if (arrow.fired) {
        updateArrow();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();

function drawBow() {
    ctx.save();
    ctx.translate(bow.x, bow.y);
    ctx.rotate(bow.angle);
    ctx.fillStyle = 'brown';
    ctx.fillRect(10, -95, 10, 200);
    ctx.restore();
}

function drawArrow() {
    if (!arrow.fired && !bow.pulling) {
        arrow.x = bow.x;
        arrow.y = bow.y;
    }

    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    // ctx.rotate(arrow.angle);
    ctx.rotate(arrow.fired ? arrow.releaseAngle : bow.angle); // Use releaseAngle if fired
    ctx.fillStyle = 'gray';
    ctx.fillRect(-90, 0, 150, 5);
    ctx.restore();
}

function drawTarget() {
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function getEventPosition(e) {
    if (e.touches) {  // If this is a touch event
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else {  // If this is a mouse event
        return { x: e.clientX, y: e.clientY };
    }
}

window.addEventListener('mousemove', (e) => {
    let dx = e.clientX - bow.x;
    let dy = e.clientY - bow.y;
    bow.angle = Math.atan2(dy, dx);
    arrow.angle = bow.angle + Math.PI / 2;  // Adjust the
    arrow
});

window.addEventListener('touchmove', (e) => {
    if (bow.pulling) {
        let pos = getEventPosition(e);
        let dx = pos.x - bow.x;
        let dy = pos.y - bow.y;
        bow.angle = Math.atan2(dy, dx);
    }
});

window.addEventListener('mousedown', () => {
    bow.pulling = true;
});

window.addEventListener('touchstart', () => {
    bow.pulling = true;
});


const gravity = 0.05;  // Adjust this value to simulate gravity

window.addEventListener('mouseup', () => {
    if (bow.pulling) {
        arrow.fired = true;
        arrow.speed = 15;  // Adjust this for difficulty
        arrow.vx = arrow.speed * Math.cos(bow.angle);  // Horizontal component of velocity
        arrow.vy = arrow.speed * Math.sin(bow.angle);  // Vertical component of velocity
        bow.pulling = false;
        arrow.releaseAngle = bow.angle;  // Store the angle at the moment of release
    }
});

window.addEventListener('touchend', () => {
    if (bow.pulling) {
        arrow.fired = true;
        arrow.speed = 15;  // Adjust this for difficulty
        arrow.vx = arrow.speed * Math.cos(bow.angle);  // Horizontal component of velocity
        arrow.vy = arrow.speed * Math.sin(bow.angle);  // Vertical component of velocity
        bow.pulling = false;
        arrow.releaseAngle = bow.angle;  // Store the angle at the moment of release
    }
});

function updateArrow() {
    if (arrow.fired) {
        arrow.x += arrow.vx;
        arrow.y += arrow.vy;
        arrow.vy += gravity;  // Apply gravity to the vertical velocity

        // Check if the arrow hits the target
        if (Math.hypot(arrow.x - target.x, arrow.y - target.y) < target.radius) {
            score += 1;  // Simple scoring, adjust as needed
            resetArrow();
        }

        // If arrow goes off-screen, reset
        if (arrow.x > canvas.width || arrow.y > canvas.height || arrow.x < 0 || arrow.y < 0) {
            resetArrow();
        }
    }
}

function resetArrow() {
    arrow.fired = false;
    arrow.x = bow.x;  // Reset to bow's position
    arrow.y = bow.y;  // Reset to bow's position
    arrow.vx = 0;
    arrow.vy = 0;
    arrow.speed = 0;
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}
