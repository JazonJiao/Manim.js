
let xs = [1, 2, 3];
let ys = [1, 2, 2];

let time = {
    grid: frames(0),
    lines: frames(3)
};

/*** 2019-01-12
 * We are displaying three lines with general equations ax + by = c (1 * beta_0 + x * beta = y).
 * Also displays the least squares solution (β_0, β) as a point on β_0-β space.
 * Uses the global variables, xs and ys, directly.
 */
class Grid_Three_Lines extends Grid {
    constructor(args) {
        super(args);
        this.numPts = xs.length;
        this.lines = [];
        for (let i = 0; i < this.numPts; i++) {
            let arr = this.calcLineParams(1, xs[i], ys[i]);
            this.lines[i] = new Line({
                x1: arr[0], y1: arr[1], x2: arr[2], y2: arr[3],
                start: getT(time.lines),
                color: i === 0 ? color(237, 47, 47) :
                    (i === 1 ? color(37, 147, 37) : color(247, 217, 47))
            });
        }

        this.caldClosestPoint();
    }

    // Takes in the ax + by = c representation of the line.
    // calculate its representation in y = mx + d
    // Returns an array for the starting point and end point of the line, [x1, y1, x2, y2]
    // p5's coordinate system is a nightmare for math animations......
    calcLineParams(a, b, c) {
        let m = -a / b * (this.stepY / this.stepX);   // slope wrt the canvas, y flipped
        let d = c / b * this.stepY;    // y-intercept wrt this.centerY

        let x1 = this.left - this.centerX;
        let y1 = this.centerY - (m * x1 + d);
        let x2 = this.right - this.centerX;
        let y2 = this.centerY - (m * x2 + d);

        return [this.left, y1, this.right, y2];
    }

    // I tried to do this by refactoring the Plot class and make its calcParams() method
    // a free method, but then I broke a lot of previous code, so I have to write a lot of
    // redundant code here... I know its bad style but whatever
    caldClosestPoint() {
        let avgX = 0, avgY = 0;
        for (let i = 0; i < this.numPts; i++) {
            avgX += xs[i];
            avgY += ys[i];
        }
        avgX /= this.numPts;
        avgY /= this.numPts;

        let sumXY = 0, sumXsq = 0;
        for (let i = 0; i < this.numPts; i++) {
            sumXY += xs[i] * ys[i];
            sumXsq += xs[i] * xs[i];
        }

        let beta_hat = (sumXY - this.numPts * avgX * avgY) / (sumXsq - this.numPts * avgX * avgX);
        let beta_0_hat = avgY - beta_hat * avgX;

        this.closestPoint = new PlotPoint({
            x: beta_0_hat * this.stepX + this.centerX,
            y: this.centerY - beta_hat * this.stepY ,
            start: getT(time.lines)  // fixme
        })

    }

    show() {
        this.showGrid();
        for (let l of this.lines) l.show();
        this.closestPoint.show();
    }
}

let grid;

function setup() {
    frameRate(fr);
    createCanvas(cvw, cvh);
    grid = new Grid_Three_Lines({
        labelX: "\\beta_0",
        offsetX: -37,
        labelY: "\\beta",
        offsetY: -30,
        stepX: 100,
        stepY: 100,
        start: getT(time.grid)
    });

}

function draw() {
    background(0);
    grid.show();
}