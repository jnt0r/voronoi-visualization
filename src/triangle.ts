import Edge from "./edge";
import Point from "./point";

export default class Triangle {
    public constructor(public readonly a: Point, public readonly b: Point, public readonly c: Point) {
    }

    isEqualTo(triangle: Triangle): boolean {
        return ((this.a.isEqualTo(triangle.a) || this.a.isEqualTo(triangle.b) || this.a.isEqualTo(triangle.c))
            && (this.b.isEqualTo(triangle.a) || this.b.isEqualTo(triangle.b) || this.b.isEqualTo(triangle.c))
            && (this.c.isEqualTo(triangle.a) || this.c.isEqualTo(triangle.b) || this.c.isEqualTo(triangle.c)));
    }

    isPointInsideCircumcircle(point: Point) {
        const circumcenter = this.getCircumCenter();

        const dist_to_x_y = Math.sqrt(Math.pow(Math.abs(point.x - circumcenter.x), 2) + Math.pow(Math.abs(point.y - circumcenter.y), 2));
        const dist_to_x1_y1 = Math.sqrt(Math.pow(Math.abs(this.a.x - circumcenter.x), 2) + Math.pow(Math.abs(this.a.y - circumcenter.y), 2));

        // (x, y) is inside the rectangle, when the distance from circumcenter to (x, y) is less or equal than distance from circumcenter to (x1, y1)
        return dist_to_x_y <= dist_to_x1_y1;
    }

    getCircumCenter(): Point {
        const x1 = this.a.x;
        const x2 = this.b.x;
        const x3 = this.c.x;
        const y1 = this.a.y;
        const y2 = this.b.y;
        const y3 = this.c.y;
        const d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
        const ux = (1 / d) * ((Math.pow(x1, 2) + Math.pow(y1, 2)) * (y2 - y3) + (Math.pow(x2, 2) + Math.pow(y2, 2)) * (y3 - y1) + (Math.pow(x3, 2) + Math.pow(y3, 2)) * (y1 - y2));
        const uy = (1 / d) * ((Math.pow(x1, 2) + Math.pow(y1, 2)) * (x3 - x2) + (Math.pow(x2, 2) + Math.pow(y2, 2)) * (x1 - x3) + (Math.pow(x3, 2) + Math.pow(y3, 2)) * (x2 - x1));
        return new Point(ux, uy);
    }

    getEdges(): Edge[] {
        const edges: Edge[] = [];
        edges[0] = new Edge(this.a, this.b);
        edges[1] = new Edge(this.b, this.c);
        edges[2] = new Edge(this.c, this.a);
        return edges;
    }

    sharesSamePointWith(triangle: Triangle): boolean {
        return this.a.isEqualTo(triangle.a) || this.a.isEqualTo(triangle.b) || this.a.isEqualTo(triangle.c)
                || this.b.isEqualTo(triangle.a) || this.b.isEqualTo(triangle.b) || this.b.isEqualTo(triangle.c)
                || this.c.isEqualTo(triangle.a) || this.c.isEqualTo(triangle.b) || this.c.isEqualTo(triangle.c);
    }
}
