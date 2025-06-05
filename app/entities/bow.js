// Bow entity class
export default class Bow {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.pulling = false;
        this.width = width;
        this.height = height;
        // Animation properties for bow drawing
        this.pullDistance = 0; // How far the string is pulled back (0-1)
        this.maxPullDistance = 30; // Maximum pixels the string can be pulled back
        this.pullAnimationSpeed = 0.15; // Speed of pull animation
    }
}
