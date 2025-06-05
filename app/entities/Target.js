// Target entity class
export default class Target {
    constructor(x, y, radius, amplitude, frequency) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.amplitude = amplitude;
        this.frequency = frequency;
    }

    update(time, canvasHeight) {
        this.y = canvasHeight / 2 + Math.sin(time * this.frequency) * this.amplitude;
    }
}
