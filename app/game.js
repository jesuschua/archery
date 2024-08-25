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
    angle: bow.angle + Math.PI / 2
};

const target = {
    x: canvas.width - 100,
    y: canvas.height / 2,
    radius: 10,
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
    ctx.rotate(arrow.angle);
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

window.addEventListener('mousemove', (e) => {
    let dx = e.clientX - bow.x;
    let dy = e.clientY - bow.y;
    bow.angle = Math.atan2(dy, dx);
    arrow.angle = bow.angle + Math.PI / 2;  // Adjust the
    arrow
});

window.addEventListener('mousedown', () => {
    bow.pulling = true;
});

window.addEventListener('mouseup', () => {
    if (bow.pulling) {
        arrow.fired = true;
        arrow.speed = 15;  // Adjust this for difficulty
        bow.pulling = false;
        arrow.angle = bow.angle + Math.PI / 2;
    }
});

function updateArrow() {
    arrow.x += arrow.speed * Math.cos(bow.angle);
    arrow.y += arrow.speed * Math.sin(bow.angle);

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
