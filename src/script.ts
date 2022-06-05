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

for (let i = 3; i > 0; i--) {
    dots.push(new Point(Math.floor(Math.random() * canvasWidth), Math.floor(Math.random() * canvasHeight)));
}

for (const dot of dots) {
    drawDot(dot, '#F00');
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

function drawDot(point: Point, color = "#F03C69") {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function delaunayTriangulation(points: Point[]) {
    for (const dot of dots) {
        drawDot(dot, '#F00');
    }

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

    for (const triangle of triangulation) {
        if (triangle.sharesSamePointWith(rootTriangle)) {
            continue;
        }

        // ctx.beginPath();
        // ctx.moveTo(triangle.a.x, triangle.a.y);
        // ctx.lineTo(triangle.b.x, triangle.b.y);
        // ctx.lineTo(triangle.c.x, triangle.c.y);
        // ctx.lineTo(triangle.a.x, triangle.a.y);
        // ctx.stroke();
        // ctx.closePath();

        let circumCenter = triangle.getCircumCenter();
        // drawDot(circumCenter, "#0F0");

        const edges1 = triangle.getEdges();
        for (const tri of triangulation) {
            const edges2 = tri.getEdges();

            if (edges1.filter(e => edges2.find(edge => edge.isEqualTo(e))).length > 0) {
                ctx.beginPath();
                ctx.moveTo(circumCenter.x, circumCenter.y);
                const circumCenter1 = tri.getCircumCenter();
                ctx.lineTo(circumCenter1.x, circumCenter1.y);
                ctx.strokeStyle = "#0F0";
                ctx.stroke();
                ctx.closePath();
                ctx.strokeStyle = "#000";
            }
        }

        // ctx.beginPath();
        // ctx.moveTo(triangle.a.x, triangle.a.y);
        // ctx.lineTo(triangle.b.x, triangle.b.y);
        // ctx.lineTo(triangle.c.x, triangle.c.y);
        // ctx.lineTo(triangle.a.x, triangle.a.y);
        // ctx.stroke();
        // ctx.closePath();
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
