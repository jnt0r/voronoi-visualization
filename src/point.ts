export default class Point {
    private velocity_x: number;
    private velocity_y: number;
    public readonly color: string;

    public constructor(public x: number, public y: number) {
        Math.floor(Math.random() * (1 - -1 + 1)) + -1;
        this.velocity_x = Math.floor(Math.random() * (1 - -1 + 1)) + -1;
        this.velocity_y = Math.floor(Math.random() * (1 - -1 + 1)) + -1;
        const rint = Math.round(0xffffff * Math.random());
        this.color = ('#0' + rint.toString(16)).replace(/^#0([0-9a-f]{6})$/i, '#$1')
    }

    isEqualTo(point: Point): boolean {
        return this.x === point.x && this.y === point.y;
    }

    distanceTo(point: Point): number {
        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2))
    }

    angleTo(point: Point) {
        const x = this.x - point.x;
        const y = this.y - point.y;
        const angle = Math.atan2(y, x);

        if (angle < 0) {
            return angle + 2 * Math.PI;
        }
        return angle;
    }

    private tick(): void {
        if (this.x <= 0 || this.x >= 1920) {
            this.velocity_x *= -1;
        }
        if (this.y <= 0 || this.y >= 919) {
            this.velocity_y *= -1;
        }
        this.x += 0.5 * this.velocity_x;
        this.y += 0.5 * this.velocity_y;
    }

    draw(ctx: CanvasRenderingContext2D): void {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI, false);
            ctx.fillStyle = "#000";
            ctx.fill();
            ctx.closePath();
            this.tick();
    }
}

