import Point from "./point";
import Triangle from "./triangle";
import Edge from "./edge";

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

const rootTriangleA = new Triangle(new Point(0, 0), new Point(canvasWidth, 0), new Point(0, canvasHeight));
const rootTriangleB = new Triangle(new Point(canvasWidth, canvasHeight), new Point(canvasWidth, 0), new Point(0, canvasHeight));

window.requestAnimationFrame(animate);

function animate(): void {
    ctx.clearRect(0, 0, 2 * canvasWidth, 2 * canvasHeight);
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
            triangulation.push(new Triangle(dot, edge.from, edge.to));
        }
    }

    const circumCenters: Set<Point> = new Set();

    for (const triangle of triangulation) {
        if (triangle.sharesSamePointWith(rootTriangleA) || triangle.sharesSamePointWith(rootTriangleB)) {
            continue;
        }

        let circumCenter = addCircumCenterIfNotPresent(triangle);
        // drawDot(circumCenter, "#0F0");

        const edges1 = triangle.getEdges();
        for (const tri of triangulation) {
            const edges2 = tri.getEdges();

            if (edges1.filter(e => edges2.find(edge => edge.isEqualTo(e))).length > 0) {
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
    // console.log(circumCenters)
    // console.log(dots);

    circumCenters.forEach(center => {
        const map = dots.flatMap(point => ({point: point, distance: point.distanceTo(center)}));
        const minimum = map.sort((a, b) => a.distance <= b.distance ? -1 : 1)[0].distance;
        const surroundingPoints = map.filter(a => {
            // console.log(a.distance, minimum);
            let message = Number(a.distance).toFixed(5) === Number(minimum).toFixed(5);
            // console.log(message);
            return message
        }).map(a => a.point);
        centerToPointsMap.push({center: center, points: surroundingPoints});
    });
    // console.log(centerToPointsMap);

    for (const point of dots) {
        // const point = dots[0];
        let pointsToConnect = centerToPointsMap.filter(entry => entry.points.filter(p => p.isEqualTo(point)).length === 1).map(entry => entry.center);

        if (pointsToConnect.length > 0) {
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
                    let angleA = a.angleTo(new Point(0,0));
                    let angleB = b.angleTo(new Point(0,0));
                    if (angleA < angleB) {
                        return 1;
                    }

                    return angleA == angleB && a.distanceTo(new Point(0, 0)) < b.distanceTo(new Point(0, 0)) ? 1 : -1;
                })
                .map(pt => new Point(pt.x + centerPoint.x, pt.y + centerPoint.y));

            connectPoints(pointsToConnect, point);
        }
    }

    // for (const dot of dots) {
    //     let map = circumCenters.flatMap(center => ({point: center, distance: center.distanceTo(dot)}));
    //     const minimum = map.sort((a,b) => a.distance < b.distance ? -1 : 1)[0].distance;
    //     const newPoints = map.filter(a => a.distance === minimum);
    //
    //     ctx.beginPath();
    //     ctx.moveTo(newPoints[0].point.x, newPoints[0].point.y);
    //
    //     for (let i = 1; i < newPoints.length; i++) {
    //         ctx.lineTo(newPoints[i].point.x, newPoints[i].point.y);
    //     }
    //
    //     ctx.lineTo(newPoints[0].point.x, newPoints[0].point.y)
    //     ctx.fillStyle = "#F00";
    //     ctx.strokeStyle = "#F00";
    //     ctx.stroke();
    //     ctx.fill();
    //     ctx.closePath()
    //
    //     console.log("==================")
    //     console.log(map);
    //     console.log(newPoints);
    // }

    for (const dot of dots) {
        dot.draw(ctx);
    }


    function addCircumCenterIfNotPresent(triangle: Triangle) {
        let circumCenter = triangle.getCircumCenter();
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
