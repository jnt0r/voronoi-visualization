import Point from "./point";
import Triangle from "./triangle";
import Edge from "./edge";
import NoMovingPoint from "./noMovingPoint";

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

const dots: Point[] = [];

for (let i = 50; i > 0; i--) {
    dots.push(new Point(Math.floor(Math.random() * canvasWidth), Math.floor(Math.random() * canvasHeight)));
}

const rootTriangleA = new Triangle(new NoMovingPoint(0, 0), new NoMovingPoint(canvasWidth, 0), new NoMovingPoint(0, canvasHeight));
const rootTriangleB = new Triangle(new NoMovingPoint(canvasWidth, canvasHeight), new NoMovingPoint(canvasWidth, 0), new NoMovingPoint(0, canvasHeight));

dots.push(...rootTriangleA.getPoints(), new NoMovingPoint(canvasWidth, canvasHeight));

window.requestAnimationFrame(animate);

function animate(): void {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    delaunayTriangulation(dots);
    
    window.requestAnimationFrame(animate);
}

canvas.onclick = ev => {
    let point = new Point(ev.x, ev.y);
    dots.push(point);
}

function delaunayTriangulation(points: Point[]) {
    const triangulation = [rootTriangleA, rootTriangleB];

    // bowyer watson algorithm
    for (const dot of points) {
        const badTriangles = [];

        for (const triangle of triangulation) {
            if (triangle.isPointInsideCircumcircle(dot)) {
                badTriangles.push(triangle);
            }
        }

        const polygon = [];

        for (const triangle of badTriangles) {
            const edges = triangle.getEdges();

            for (const edge of edges) {
                if (edgeIsNotSharedByAnyOtherTriangleIn(badTriangles, edge, triangle)) {
                    polygon.push(edge);
                }
            }
        }

        for (const triangle of badTriangles) {
            triangulation.splice(triangulation.findIndex((e) => e.isEqualTo(triangle)), 1);
        }

        for (const edge of polygon) {
            if (dot.isEqualTo(edge.from) || dot.isEqualTo(edge.to)) {
                continue;
            }
            // points lie on a straight on the x axis and are no triangle
            if (dot.x === edge.from.x && edge.from.x == edge.to.x) {
                continue;
            }
            // points lie on a straight on the y axis and are no triangle
            if (dot.y === edge.from.y && edge.from.y == edge.to.y) {
                continue;
            }
            triangulation.push(new Triangle(dot, edge.from, edge.to));
        }
    }

    const circumCenters: Set<Point> = new Set();

    for (const triangle of triangulation) {
        if (triangle.sharesSamePointWith(rootTriangleA) || triangle.sharesSamePointWith(rootTriangleB)) {
            // continue;
        }

        if (triangle.a.isEqualTo(triangle.b) || triangle.b.isEqualTo(triangle.c) || triangle.a.isEqualTo(triangle.c)) {
            continue;
        }

        const circumCenter = addCircumCenterIfNotPresent(triangle);
        // drawDot(circumCenter, "#0F0");

        const edges = triangle.getEdges();
        for (const tri of triangulation) {
            const edges2 = tri.getEdges();

            if (edges.filter(e => edges2.find(edge => edge.isEqualTo(e))).length > 0) {
                ctx.beginPath();
                ctx.moveTo(circumCenter.x, circumCenter.y);
                const circumCenter1 = addCircumCenterIfNotPresent(tri);
                ctx.lineTo(circumCenter1.x, circumCenter1.y);
                ctx.strokeStyle = "#000";
                ctx.stroke();
                ctx.closePath();
                ctx.strokeStyle = "#000";
            }
        }
    }

    const centerToPointsMap: { center: Point, points: Point[] }[] = [];

    circumCenters.forEach(center => {
        const map = dots.flatMap(point => ({point: point, distance: point.distanceTo(center)}));
        const minimum = map.sort((a, b) => a.distance <= b.distance ? -1 : 1)[0].distance;
        const surroundingPoints = map.filter(a => Number(a.distance).toFixed(5) === Number(minimum).toFixed(5)).map(a => a.point);
        centerToPointsMap.push({center: center, points: surroundingPoints});
    });

    for (const point of dots) {
        // const point = dots[0];
        let pointsToConnect = centerToPointsMap.filter(entry => entry.points.filter(p => p.isEqualTo(point)).length === 1).map(entry => entry.center);

        if (!!pointsToConnect.length) {
            let centerPointX = 0;
            let centerPointY = 0;
            pointsToConnect.forEach(pt => {
                centerPointX += pt.x;
                centerPointY += pt.y;
            });
            centerPointX /= pointsToConnect.length;
            centerPointY /= pointsToConnect.length;
            const centerPoint = new Point(centerPointX, centerPointY);
            pointsToConnect = pointsToConnect.map(pt => new Point(pt.x - centerPoint.x, pt.y - centerPoint.y))
                .sort((a, b) => {
                    const angleA = a.angleTo(new Point(0,0));
                    const angleB = b.angleTo(new Point(0,0));
                    if (angleA < angleB) {
                        return 1;
                    }

                    return angleA == angleB && a.distanceTo(new Point(0, 0)) < b.distanceTo(new Point(0, 0)) ? 1 : -1;
                })
                .map(pt => new Point(pt.x + centerPoint.x, pt.y + centerPoint.y));

            connectPoints(pointsToConnect, point);
        }
    }

    for (const dot of dots) {
        dot.draw(ctx);
    }

    function addCircumCenterIfNotPresent(triangle: Triangle) {
        const circumCenter = triangle.getCircumCenter();
        if (!circumCenters.has(circumCenter)) {
            circumCenters.add(circumCenter);
        }
        return circumCenter;
    }
}

function connectPoints(pointsToConnect: Point[], point: Point) {
    ctx.beginPath();
    ctx.moveTo(pointsToConnect[0].x, pointsToConnect[0].y);

    for (let i = 1; i < pointsToConnect.length; i++) {
        ctx.lineTo(pointsToConnect[i].x, pointsToConnect[i].y);
    }

    ctx.lineTo(pointsToConnect[0].x, pointsToConnect[0].y);

    ctx.fillStyle = point.color;
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function edgeIsNotSharedByAnyOtherTriangleIn(badTriangles: Triangle[], edge: Edge, triangle: Triangle) {
    for (const badTriangle of badTriangles) {
        if (!(badTriangle === triangle)) { // ignore the same triangle
            for (const e of badTriangle.getEdges()) {
                if (e.isEqualTo(edge)) {
                    return false;
                }
            }
        }
    }

    return true;
}
