export default class Point {
    public constructor(public readonly x: number, public readonly y: number) {
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
}

