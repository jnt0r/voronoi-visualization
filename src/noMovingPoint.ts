import Point from "./point";

export default class NoMovingPoint extends Point {
    public constructor(public x: number, y: number) {
        super(x, y);
        this.velocity_y = 0;
        this.velocity_x = 0;
        this.fillStyle = this.color
    }
}