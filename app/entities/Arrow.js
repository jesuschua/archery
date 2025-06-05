// Arrow entity class
export default class Arrow {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 0;
        this.fired = false;
        this.angle = 0;
        this.releaseAngle = 0;
        this.vx = 0;
        this.vy = 0;
    }

    reset(bow) {
        this.fired = false;
        this.x = bow.x;
        this.y = bow.y;
        this.vx = 0;
        this.vy = 0;
        this.speed = 0;
        this.angle = bow.angle;
    }
}
