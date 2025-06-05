// Input system for the archery game
let inputEnabled = true;

export function setupInputHandlers(bow, arrow, updateWind, onArrowRelease) {    function updateBowAngle(e) {
        if (!inputEnabled || arrow.fired) return;
        let pos;
        if (e.touches) {
            pos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else {
            pos = { x: e.clientX, y: e.clientY };
        }
        let dx = pos.x - bow.x;
        let dy = pos.y - bow.y;
        bow.angle = Math.atan2(dy, dx);
        arrow.angle = bow.angle;
    }
    function startPulling() { 
        if (!inputEnabled) return;
        bow.pulling = true; 
    }
    function releaseArrow() {
        if (!inputEnabled) return;
        if (bow.pulling) {
            updateWind();
            arrow.fired = true;
            arrow.speed = 30;
            arrow.vx = arrow.speed * Math.cos(bow.angle);
            arrow.vy = arrow.speed * Math.sin(bow.angle);
            bow.pulling = false;
            arrow.releaseAngle = bow.angle;
            onArrowRelease && onArrowRelease();
        }
    }
    window.addEventListener('mousemove', updateBowAngle);
    window.addEventListener('touchmove', updateBowAngle);
    window.addEventListener('mousedown', startPulling);
    window.addEventListener('touchstart', startPulling);
    window.addEventListener('mouseup', releaseArrow);
    window.addEventListener('touchend', releaseArrow);
}

export function setInputEnabled(enabled) {
    inputEnabled = enabled;
}

export function isInputEnabled() {
    return inputEnabled;
}
