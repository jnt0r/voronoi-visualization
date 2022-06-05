export default class Point {
    public constructor(public readonly x: number, public readonly y: number) {
    }

    isEqualTo(point: Point): boolean {
        return this.x === point.x && this.y === point.y;
    }
}

