/*** 2019-01-12
 * We are displaying three lines with general equations ax + by = c (1 * beta_0 + x * beta = y).
 * Also displays the least squares solution (β_0, β) as a point on β_0-β space.
 * Uses the global variables, xs and ys, directly.
 */
class Grid_Three_Lines extends Grid {
    constructor(ctx, args) {
        super(ctx, args);

        this.xs = [1, 2, 3];
        this.ys = [1, 2, 2];
        this.numPts = this.xs.length;
        this.lines = [];
        this.time = args.time;
        for (let i = 0; i < this.numPts; i++) {
            let arr = this.calcLineParams(1, this.xs[i], this.ys[i]);
            this.lines[i] = new Line(this.s, {
                x1: arr[0], y1: arr[1],
                x2: arr[2], y2: arr[3],
                start: getT(this.time.lines),
                color: i === 0 ? this.s.color(237, 47, 47) :
                    (i === 1 ? this.s.color(37, 147, 37) : this.s.color(247, 217, 47))
            });
        }

        this.calcClosestPoint();
    }

    // Takes in the ax + by = c representation of the line.
    // calculate its representation in y = mx + d, and
    // Returns an array for the starting point and end point of the line, [x1, y1, x2, y2]
    // p5's coordinate sthis.ystem is a nightmare for math animations......
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
    calcClosestPoint() {
        let avgX = 0, avgY = 0;
        for (let i = 0; i < this.numPts; i++) {
            avgX += this.xs[i];
            avgY += this.ys[i];
        }
        avgX /= this.numPts;
        avgY /= this.numPts;

        let sumXY = 0, sumXsq = 0;
        for (let i = 0; i < this.numPts; i++) {
            sumXY += this.xs[i] * this.ys[i];
            sumXsq += this.xs[i] * this.xs[i];
        }

        let beta_hat = (sumXY - this.numPts * avgX * avgY) / (sumXsq - this.numPts * avgX * avgX);
        let beta_0_hat = avgY - beta_hat * avgX;

        let x = beta_0_hat * this.stepX + this.centerX;
        let y = this.centerY - beta_hat * this.stepY;

        this.closestPoint = new PlotPoint(this.s, {
            x: x, y: y,
            start: getT(this.time.lines),  // fixme
            radius: 24,
            color: [247, 177, 47]
        });
        this.kat = new Katex(this.s, {
            text: "(\\hat{\\beta_0}, \\hat{\\beta})",
            x: x + 9,
            y: y - 105,
            start: getT(this.time.lines)
        })

    }

    show() {
        this.showGrid();
        for (let l of this.lines) l.show();
        this.closestPoint.show();
        this.kat.show();
    }
}

const Chap2Part2 = function (s) {
    let time = {
        grid: frames(0),
        lines: frames(3)
    };

    let grid;
    let comic;
    let brain;

    s.preload = function () {
        comic = s.loadFont('../lib/font/comic.ttf');
    };

    s.setup = function () {
        s.frameRate(fr);
        s.createCanvas(cvw, cvh);
        grid = new Grid_Three_Lines(s, {
            labelX: "\\beta_0",
            offsetX: -45,
            labelY: "\\beta",
            offsetY: -38,
            stepX: 100,
            stepY: 100,
            start: getT(time.grid),
            time: time
        });
        brain = new ThoughtBrain(s, {
            x: 75, y: 517,
            size: 277,
            font: comic,
            str: "\"closest solution\""
        })
    };

    s.draw = function () {
        s.background(0);
        grid.show();
        brain.show();
    }
};

new p5(Chap2Part2);
