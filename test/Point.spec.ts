import Point from "../src/point";
import Edge from "../src/edge";
import Triangle from "../src/triangle";

beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
})

test('points should be equal', () => {
    const a: Point = new Point(10, 20);
    const b: Point = new Point(20, 30);

    expect(a).toBe(a);
    expect(b).toBe(b);
    expect(a).not.toEqual(b);
    expect(b).not.toEqual(a);
    expect(a).toEqual(new Point(10, 20));
    expect(a == a).toBeTruthy();
    expect(b == b).toBeTruthy();
    expect(a == b).toBeFalsy();
    expect(new Point(11, 12).isEqualTo(new Point(11, 12))).toBeTruthy();
    expect(new Point(11, 12).isEqualTo(new Point(12, 11))).toBeFalsy();
});

test('edges should be equal', () => {
    const pointA = new Point(10, 20);
    const pointB = new Point(20, 40);
    const a: Edge = new Edge(pointA, pointB);
    const b: Edge = new Edge(new Point(10, 20), new Point(40, 20));
    const c: Edge = new Edge(pointB, pointA);

    expect(a).toBe(a);
    expect(b).toBe(b);
    expect(a).not.toEqual(b);
    expect(b).not.toEqual(a);
    expect(a).toEqual(new Edge(pointA, pointB));
    expect(a == a).toBeTruthy();
    expect(b == b).toBeTruthy();
    expect(a == b).toBeFalsy();
    expect(a.isEqualTo(a)).toBeTruthy();
    expect(a.isEqualTo(c)).toBeTruthy();
    expect(c.isEqualTo(a)).toBeTruthy();
    expect(a.isEqualTo(b)).toBeFalsy();
});

test('triangles should be equal', () => {
    let point1 = new Point(0, 0);
    let point2 = new Point(0, 10);
    let point3 = new Point(10, 0);
    const triangleA = new Triangle(point1, point2, point3);
    const triangleB = new Triangle(new Point(1, 0), new Point(11, 10), new Point(1, 20));
    const triangleC = new Triangle(point1, point3, point2);
    const triangleD = new Triangle(point2, point1, point3);
    const triangleE = new Triangle(point2, point3, point1);
    const triangleF = new Triangle(point3, point2, point1);
    const triangleG = new Triangle(point3, point1, point2);

    expect(triangleA).toBe(triangleA);
    expect(triangleB).toBe(triangleB);
    expect(triangleA).not.toEqual(triangleB);
    expect(triangleB).not.toEqual(triangleA);
    expect(triangleA).toEqual(new Triangle(new Point(0, 0), new Point(0, 10), new Point(10, 0)));
    expect(triangleA == triangleA).toBeTruthy();
    expect(triangleB == triangleB).toBeTruthy();
    expect(triangleA == triangleB).toBeFalsy();
    expect(triangleA.isEqualTo(triangleA)).toBeTruthy();
    expect(triangleA.isEqualTo(triangleC)).toBeTruthy();
    expect(triangleA.isEqualTo(triangleD)).toBeTruthy();
    expect(triangleA.isEqualTo(triangleE)).toBeTruthy();
    expect(triangleA.isEqualTo(triangleF)).toBeTruthy();
    expect(triangleA.isEqualTo(triangleG)).toBeTruthy();
    expect(triangleA.isEqualTo(triangleA)).toBeTruthy();
    expect(triangleA.isEqualTo(triangleB)).toBeFalsy();
});

test('isPointInsideCircumcircle', () => {
    let point1 = new Point(0, 0);
    let point2 = new Point(0, 10);
    let point3 = new Point(10, 0);
    const triangle = new Triangle(point1, point2, point3);

    expect(triangle.isPointInsideCircumcircle(new Point(10, 10))).toBeTruthy();
    expect(triangle.isPointInsideCircumcircle(new Point(20, 0))).toBeFalsy();
    expect(triangle.isPointInsideCircumcircle(new Point(0, 20))).toBeFalsy();
    expect(triangle.isPointInsideCircumcircle(new Point(1,1))).toBeTruthy();
    expect(triangle.isPointInsideCircumcircle(new Point(2,2))).toBeTruthy();
    expect(triangle.isPointInsideCircumcircle(new Point(3,11))).toBeTruthy();
    expect(triangle.isPointInsideCircumcircle(new Point(11,2))).toBeTruthy();
    expect(triangle.isPointInsideCircumcircle(new Point(11,8))).toBeTruthy();
    expect(triangle.isPointInsideCircumcircle(new Point(6,11))).toBeTruthy();
    expect(triangle.isPointInsideCircumcircle(new Point(5,-1))).toBeTruthy();
    expect(triangle.isPointInsideCircumcircle(new Point(-1,5))).toBeTruthy();
    expect(triangle.isPointInsideCircumcircle(new Point(-1,-1))).toBeFalsy();
    expect(triangle.isPointInsideCircumcircle(new Point(0,12))).toBeFalsy();
    expect(triangle.isPointInsideCircumcircle(new Point(12,0))).toBeFalsy();
    expect(triangle.isPointInsideCircumcircle(new Point(9,11))).toBeFalsy();
    expect(triangle.isPointInsideCircumcircle(new Point(12,3))).toBeFalsy();
    expect(triangle.isPointInsideCircumcircle(point2)).toBeTruthy();
    expect(triangle.isPointInsideCircumcircle(point2)).toBeTruthy();
    expect(triangle.isPointInsideCircumcircle(point3)).toBeTruthy();
});

test('getCircumCenter', () => {
    const point1 = new Point(0, 0);
    const point2 = new Point(0, 10);
    const point3 = new Point(10, 0);
    const triangle = new Triangle(point1, point2, point3);

    expect(triangle.getCircumCenter()).toEqual(new Point(5,5));
    expect(new Triangle(new Point(1,3), new Point(4,7), new Point(6,9)).getCircumCenter()).toEqual(new Point(24.5,-11.5));
});

test('getEdges', () => {
    let point1 = new Point(0, 0);
    let point2 = new Point(0, 10);
    let point3 = new Point(10, 0);
    const triangle = new Triangle(point1, point2, point3);

    const expectedEdges = [
      new Edge(new Point(0,0), new Point(0,10)),
      new Edge(new Point(0,10), new Point(10,0)),
      new Edge(new Point(10,0), new Point(0,0))
    ];

    expect(triangle.getEdges()).toEqual(expectedEdges);
});

test('shares same point', () => {
    const point1 = new Point(0, 0);
    const triangleA = new Triangle(point1, new Point(0, 10), new Point(10, 0));
    const triangleB = new Triangle(point1, new Point(100, 200), new Point(40, 0));
    const triangleC = new Triangle(new Point(-1, -2), new Point(2, 8), new Point(100, 200));
    const triangleD = new Triangle(new Point(-1, -1), new Point(5, 21), point1);

    expect(triangleA.sharesSamePointWith(triangleB)).toBeTruthy();
    expect(triangleA.sharesSamePointWith(triangleC)).toBeFalsy();
    expect(triangleB.sharesSamePointWith(triangleC)).toBeTruthy();
    expect(triangleC.sharesSamePointWith(triangleD)).toBeFalsy();
    expect(triangleA.sharesSamePointWith(triangleD)).toBeTruthy();
});

test('getAngle', () => {
    const pointA = new Point(0,0);
    const pointB = new Point(1, 0);
    const pointC = new Point(0,1);
    const pointD = new Point(-1, 0);
    const pointE = new Point(0, -1);
    const pointF = new Point(1,1);

    expect(pointB.angleTo(pointA)).toBe(0);
    expect(pointC.angleTo(pointA)).toBe(Math.PI/2);
    expect(pointD.angleTo(pointA)).toBe(Math.PI);
    expect(pointE.angleTo(pointA)).toBe(3*Math.PI/2);

    expect(pointF.angleTo(pointA)).toBe(Math.PI/4);
})

test('PointArray equal', () => {
    const pointsA = [
        new Point(1,2),
        new Point(5,9),
        new Point(11,2),
        new Point(5,4),
    ];
    const pointsB = [
        new Point(1,2),
        new Point(5,9),
        new Point(11,2),
        new Point(5,4),
    ];
    console.log(pointsA);
    console.log(pointsB);
    console.log(pointsA == pointsB);

    const map = new Map();
    map.set(hash(pointsA), "A");
    map.set(hash(pointsB), "B");

    console.log(map)

    console.log(map.get(hash([
        new Point(1,2),
        new Point(5,9),
        new Point(11,2),
        new Point(5,4),
    ])));
})

function hash(points: Point[]): String {
    let hash = "";
    for (let point of points) {
        hash += point.x + "" + point.y
    }
    return hash;
}
