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
    angle: bow.angle + Math.PI / 2,
    releaseAngle: 0 // Added to store the release angle
};

const target = {
    x: canvas.width - 100,
    y: canvas.height / 2,
    radius: 50,
    amplitude: 1000,
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
    ctx.fillRect(-5, -50, 10, 100);
    ctx.restore();
}

function drawArrow() {
    if (!arrow.fired && !bow.pulling) {
        arrow.x = bow.x;
        arrow.y = bow.y;
    }

    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.rotate(arrow.fired ? arrow.releaseAngle : arrow.angle); // Use releaseAngle if fired
    ctx.fillStyle = 'gray';
    ctx.fillRect(-2, -50, 4, 50);
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
    arrow.angle = bow.angle + Math.PI / 2;  // Adjust the arrow angle to match bow
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

window.addEventListener('mouseup', () => {
    if (bow.pulling) {
        arrow.fired = true;
        arrow.speed = 15;  // Adjust this for difficulty
        arrow.releaseAngle = arrow.angle;  // Store the angle at the moment of release
        bow.pulling = false;
    }
});

window.addEventListener('touchend', () => {
    if (bow.pulling) {
        arrow.fired = true;
        arrow.speed = 15;  // Adjust this for difficulty
        arrow.releaseAngle = arrow.angle;  // Store the angle at the moment of release
        bow.pulling = false;
    }
});

function updateArrow() {
    // Update arrow position using the stored release angle
    arrow.x += arrow.speed * Math.cos(arrow.releaseAngle);
    arrow.y += arrow.speed * Math.sin(arrow.releaseAngle);

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

function resetArrow() {
    arrow.fired = false;
    arrow.x = bow.x;
    arrow.y = bow.y;
    arrow.speed = 0;
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}
