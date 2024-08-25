const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let bow = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: 0,
    pulling: false
};

let arrow = {
    x: bow.x,
    y: bow.y,
    speed: 0,
    fired: false
};

const target = {
    x: canvas.width - 100,
    y: canvas.height / 2,
    radius: 50
};

let score = 0;

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBow();
    drawArrow();
    drawTarget();

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
    ctx.fillRect(-5, -50, 10, 50);
    ctx.restore();
}

function drawArrow() {
    if (!arrow.fired) {
        arrow.x = bow.x;
        arrow.y = bow.y;
    }

    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.rotate(bow.angle);
    ctx.fillStyle = 'gray';
    ctx.fillRect(-2, -50, 4, 30);
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
});

window.addEventListener('mousedown', () => {
    bow.pulling = true;
});

window.addEventListener('mouseup', () => {
    if (bow.pulling) {
        arrow.fired = true;
        arrow.speed = 15;  // Adjust this for difficulty
        bow.pulling = false;
    }
});

function updateArrow() {
    arrow.x += arrow.speed * Math.cos(bow.angle);
    arrow.y += arrow.speed * Math.sin(bow.angle);

    // Check if the arrow hits the target
    if (Math.hypot(arrow.x - target.x, arrow.y - target.y) < target.radius) {
        score += 10;  // Simple scoring, adjust as needed
        arrow.fired = false;
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

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBow();
    drawArrow();
    drawTarget();
    drawScore();

    if (arrow.fired) {
        updateArrow();
    }

    requestAnimationFrame(gameLoop);
}
