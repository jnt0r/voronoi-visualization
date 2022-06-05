import Point from "./point";

export default class Edge {
    public constructor(public readonly from: Point, public readonly to: Point) {
    }

    isEqualTo(edge: Edge): boolean {
        return (this.from.isEqualTo(edge.from) && this.to.isEqualTo(edge.to)) || (this.from.isEqualTo(edge.to) && this.to.isEqualTo(edge.from));
    }
}

