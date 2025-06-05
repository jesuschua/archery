// Bow entity class
export default class Bow {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.pulling = false;
        this.width = width;
        this.height = height;
    }
}
