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

const colorsMapping: Map<String, string | CanvasGradient | CanvasPattern> = new Map();

for (let i = 15; i > 0; i--) {
    dots.push(new Point(Math.floor(Math.random() * canvasWidth), Math.floor(Math.random() * canvasHeight)));
}

for (const dot of dots) {
    drawDot(dot, '#000');
}

const triangulation: Triangle[] = [];
const rootTriangle = new Triangle(new Point(0, 0), new Point(2 * canvasWidth, 0), new Point(0, 2 * canvasHeight));

triangulation.push(rootTriangle);

delaunayTriangulation(dots);

canvas.onclick = ev => {
    ctx.clearRect(0, 0, 2 * canvasWidth, 2 * canvasHeight);
    let point = new Point(ev.x, ev.y);
    dots.push(point);
    delaunayTriangulation([point]);
}

function drawDot(point: Point, color = "#000") {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function delaunayTriangulation(points: Point[]) {

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

    const circumCenters: Point[] = [];

    for (const triangle of triangulation) {
        if (triangle.sharesSamePointWith(rootTriangle)) {
            continue;
        }

        let circumCenter = triangle.getCircumCenter();
        if (circumCenters.filter(a => a.isEqualTo(circumCenter)).length === 0) {
            circumCenters.push(circumCenter);
        }
        // drawDot(circumCenter, "#0F0");

        const edges1 = triangle.getEdges();
        for (const tri of triangulation) {
            const edges2 = tri.getEdges();

            if (edges1.filter(e => edges2.find(edge => edge.isEqualTo(e))).length > 0) {
                ctx.beginPath();
                ctx.moveTo(circumCenter.x, circumCenter.y);
                const circumCenter1 = tri.getCircumCenter();
                if (circumCenters.filter(a => a.isEqualTo(circumCenter1)).length === 0) {
                    circumCenters.push(circumCenter1);
                }
                ctx.lineTo(circumCenter1.x, circumCenter1.y);
                ctx.strokeStyle = "#000";
                ctx.stroke();
                ctx.closePath();
                ctx.strokeStyle = "#000";
            }
        }
    }

    const centerToPointsMap: { center: Point, points: Point[] }[] = [];
    console.log(circumCenters)
    console.log(dots);

    for (const center of circumCenters) {
        const map = dots.flatMap(point => ({point: point, distance: point.distanceTo(center)}));
        const minimum = map.sort((a, b) => a.distance <= b.distance ? -1 : 1)[0].distance;
        const surroundingPoints = map.filter(a => {
            console.log(a.distance, minimum);
            let message = Number(a.distance).toFixed(5) === Number(minimum).toFixed(5);
            console.log(message);
            return message
        }).map(a => a.point);
        centerToPointsMap.push({center: center, points: surroundingPoints});
    }
    console.log(centerToPointsMap);

    for (const point of dots) {
        // const point = dots[0];
        let pointsToConnect = centerToPointsMap.filter(entry => entry.points.filter(p => p.isEqualTo(point)).length === 1).map(entry => entry.center);

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

        // drawDot(point, "#F00");
        // pointsToConnect.forEach(point => drawDot(point, "#0F0"));

        ctx.beginPath();
        ctx.moveTo(pointsToConnect[0].x, pointsToConnect[0].y);

        for (let i = 1; i < pointsToConnect.length; i++) {
            ctx.lineTo(pointsToConnect[i].x, pointsToConnect[i].y);
        }

        ctx.lineTo(pointsToConnect[0].x, pointsToConnect[0].y);

        let color: string | CanvasGradient | CanvasPattern;
        let h = hash(pointsToConnect);
        if (colorsMapping.has(h)) {
            color = colorsMapping.get(h);
        } else {
            const rint = Math.round(0xffffff * Math.random());
            color = ('#0' + rint.toString(16)).replace(/^#0([0-9a-f]{6})$/i, '#$1')
            colorsMapping.set(h, color);
        }
        ctx.fillStyle = color;
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
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
        drawDot(dot, '#000');
    }

}

function edgeIsNotSharedByAnyOtherTriangleIn(badTriangles: Triangle[], edge1: Edge, triang: Triangle) {
    for (const triangle of badTriangles) {
        if (!(triangle === triang)) { // ignore the same triangle
            const edges = triangle.getEdges();
            for (const edge of edges) {
                if (edge.isEqualTo(edge1)) {
                    return false;
                }
            }
        }
    }

    return true;
}

function hash(points: Point[]): String {
    let hash = "";
    for (let point of points) {
        hash += point.x + "" + point.y
    }
    return hash;
}
