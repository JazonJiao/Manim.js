// these will later be merged into 2.2; notice that variable names are different

let lb = -2;
let ub = 2;
let y_new = [-1, 1, 2];   // 3 points fit on the straight line

/**
 * Capable of displaying the squared error of each point; if want to show it, pass in showSq: true
 */
class LS_Plot extends Plot {
    constructor(ctx, args) {
        super(ctx, args);

        this.sqs = [];
        this.b_new = 0;
        this.b0_new = 0;

        this.showSq = args.showSq || false;

        for (let i = 0; i < this.numPts; i++) {
            let y_hat = this.getY(this.Xs[i]);
            let dy = y_hat - this.Ys[i];
            this.sqs[i] = new Emphasis(this.s, {
                color: this.s.color(207, 207, 27, 87),
                x: this.ptXs[i],
                y: y_hat,
                w: dy, h: dy    // we're constructing a square
            })
        }
    }

    // // used for paragraph 17
    // movePts() {
    //     this.yo = [-2, 0, 3];
    //     this.yd = y_new;
    //     this.moved = true;
    //     this.timer = new Timer2(frames(1.4));
    // }
    //
    // moving() {
    //
    // }

    reset(args) {
        this.b_new = args.b_new;
        this.b0_new = args.b0_new;

        for (let i = 0; i < this.numPts; i++) {
            let y_hat = this.getY(this.Xs[i]);
            let dy = y_hat - this.ptYs[i];
            this.sqs[i].reset({
                x: this.ptXs[i],
                y: this.ptYs[i],
                w: dy, h: dy    // we're constructing a square
            })
        }

        let y_intercept = this.centerY - this.b0_new * this.stepY;
        this.LSLine.reset({
            x1: this.left,
            x2: this.right,
            y1: y_intercept + this.b_new * (this.centerX - this.left),
            y2: y_intercept - this.b_new * (this.right - this.centerX),
        })
    }

    getY(x) {  // this x is actual x, not canvas x.
        return (this.centerY - this.b0_new * this.stepY) - this.b_new * x * this.stepX;
    }

    show() {
        let b0_coeff = this.s.map(
            this.s.mouseX, 0, 1200, lb, ub);  // fixme: width is now 600
        let b_coeff = this.s.map(
            this.s.mouseY, 0, 675, ub, lb);
        this.reset({
            b0_new: b0_coeff,
            b_new: b_coeff
        });
        this.showAxes();
        this.showPoints();
        this.LSLine.show();
        if (this.showSq) {
            for (let e of this.sqs) e.show();
        }
    }
}



class Grid_b0b extends Grid {
    constructor(ctx, args) {
        super(ctx, args);
        this.start = args.start;
        this.time = args.time;

        this.kat = new Katex(this.s, {
            text: "\\begin{bmatrix}" +
                "   \\beta_0 \\\\" +
                "   \\beta" +
                "\\end{bmatrix}",
            fadeIn: true, start: getT(this.time.kat)
        });

        this.pt = new PlotPoint(this.s, {
            x: 0, y: 0,
            start: getT(this.time.pt),
            radius: 12,
            color: [247, 177, 47]
        });

        this.arrow = new Arrow(this.s, {
            x1: this.centerX, x2: 0,
            y1: this.centerY, y2: 0,
            start: getT(this.time.vec),
            strokeweight: 4,
            fadeIn: true, colorArr: [248, 147, 227]
        });
    }

    show() {
        this.showGrid();

        let b0_coeff = this.s.map(this.s.mouseX, 0, 1200, lb, ub);
        let b_coeff = this.s.map(this.s.mouseY, 0, 675, ub, lb);
        let x = this.centerX + b0_coeff * this.stepX;
        let y = this.centerY - b_coeff * this.stepY;

        this.pt.reset(x, y);
        this.kat.reset({ x: x + 7, y: y - 157 });
        this.arrow.reset({ x2: x, y2: y });

        this.kat.show();
        this.pt.show();
        this.arrow.show();
    }
}






/***
 * ---- args list parameters ----
 * (number) x, y, start, show1s, mv1, mv2; (p5.Font) font
 */
class Sys_3Eqs {
    constructor(ctx, args) {
        this.s = ctx;

        this.x = args.x || 0;
        this.y = args.y || 0;
        this.kats = [];
        this.txts = [];
        this.start = args.start || 100;
        this.show1s = args.show1s || this.start;

        this.mv1 = args.move1 || 10000;   // time for move1 animation
        this.mv2 = args.move2 || 10000;   // time for move2 animation

        // x1, b_0
        for (let i = 0; i < 3; i++) {
            this.txts[i] = new TextFade(this.s, {
                str: "1", start: this.show1s, size: 47,
                x: this.x + 7, y: this.y + i * 57,
                font: args.font, color: [255, 77, 97],  // RED
            });
            this.kats[i] = new Katex(this.s, {
                text: "\\beta_0",
                fadeIn: true, start: this.start, fadeOut: i !== 1, end: this.mv1,
                x: this.x + 30, y: this.y + i * 57 - 34,
            });
        }

        // x2, b
        for (let i = 3; i < 6; i++) {
            this.txts[i] = new TextFade(this.s, {
                str: "" + matrix[i], start: this.start, size: 47,
                mode: 2,
                x: this.x + 180, y: this.y + (i - 3) * 57,
                font: args.font, color: [77, 217, 77],  // GREEN
            });
            this.kats[i] = new Katex(this.s, {
                text: "\\beta",
                fadeIn: true, start: this.start, fadeOut: i !== 4, end: this.mv1,
                x: this.x + 182, y: this.y + (i - 3) * 57 - 34
            });
        }

        // y
        for (let i = 0; i < 3; i++) {
            this.txts[i + 6] = new TextFade(this.s, {
                str: "" + target[i], start: this.start, size: 47,
                x: this.x + 287, y: this.y + i * 57,
                font: args.font, color: [77, 177, 255],  // BLUE
            });
        }

        // +
        for (let i = 0; i < 3; i++) {
            this.txts[i + 9] = new TextFade(this.s, {
                str: "+", start: this.start, end: this.mv2, size: 47,
                x: this.x + 97, y: this.y + i * 57
            });
        }

        // =
        for (let i = 0; i < 3; i++) {
            this.txts[i + 12] = new TextFade(this.s, {
                str: "=", start: this.start, size: 47,
                x: this.x + 234, y: this.y + i * 57
            });
        }

        this.brackets = [];

        // x1
        this.brackets[0] = new Bracket(this.s, {
            x1: this.x - 7, x2: this.x - 7, y1: this.y, y2: this.y + 167,
            tipLen: 9, duration: frames(2), start: this.mv1, strokeweight: 3
        });
        this.brackets[1] = new Bracket(this.s, {
            x1: this.x + 44, x2: this.x + 44, y1: this.y + 167, y2: this.y,
            tipLen: 9, duration: frames(2), start: this.mv1, strokeweight: 3
        });

        // x2
        this.brackets[2] = new Bracket(this.s, {
            x1: this.x + 127, x2: this.x + 127, y1: this.y, y2: this.y + 167,
            tipLen: 9, duration: frames(2), start: this.mv1, strokeweight: 3,
        });
        this.brackets[3] = new Bracket(this.s, {
            x1: this.x + 194, x2: this.x + 194, y1: this.y + 167, y2: this.y,
            tipLen: 9, duration: frames(2), start: this.mv1, strokeweight: 3,
        });

        // y
        this.brackets[4] = new Bracket(this.s, {
            x1: this.x + 271, x2: this.x + 271, y1: this.y, y2: this.y + 167,
            tipLen: 9, duration: frames(2), start: this.mv1, strokeweight: 3,
        });
        this.brackets[5] = new Bracket(this.s, {
            x1: this.x + 340, x2: this.x + 340, y1: this.y + 167, y2: this.y,
            tipLen: 9, duration: frames(2), start: this.mv1, strokeweight: 3,
        });
    }

    // move position of equations; unlike move1() and move2(),
    // this is controlled by s.draw(), not this.show().
    // now it only apply to scenes with no brackets showing
    move(x, y) {
        this.xo = this.x;
        this.xd = x;
        this.yo = this.y;
        this.yd = y;
        this.moved = true;
        this.timer = new Timer2(frames(2));
    }

    // I know, this is awkward...... but I do have to reset everything one by one
    moving() {
        let t = this.timer.advance();
        this.x = this.xo + t * (this.xd - this.xo);
        this.y = this.yo + t * (this.yd - this.yo);
        for (let i = 0; i < 3; i++) {
            this.txts[i].reset({
                x: this.x + 7, y: this.y + i * 57,
            });
            this.kats[i].reset({
                x: this.x + 30, y: this.y + i * 57 - 34,
            });
        }
        for (let i = 3; i < 6; i++) {
            this.txts[i].reset({
                x: this.x + 180, y: this.y + (i - 3) * 57,
            });
            this.kats[i].reset({
                x: this.x + 182, y: this.y + (i - 3) * 57 - 34
            });
        }
        for (let i = 0; i < 3; i++) {
            this.txts[i + 6].reset({
                x: this.x + 287, y: this.y + i * 57,
            });
        }
        for (let i = 0; i < 3; i++) {
            this.txts[i + 9].reset({
                x: this.x + 97, y: this.y + i * 57
            });
        }
        for (let i = 0; i < 3; i++) {
            this.txts[i + 12].reset({
                x: this.x + 234, y: this.y + i * 57
            });
        }
    }

    // equations into column form
    move1() {
        for (let i = 0; i < 3; i++) {  // move beta_0
            this.kats[i].move(this.x - 60, this.y + 24);
        }
        for (let i = 3; i < 6; i++) {  // move beta
            this.kats[i].move(this.x + 89, this.y + 24);
        }
        for (let i = 9; i < 12; i++) { // move plus sign
            this.txts[i].move(this.x + 57, this.y + 57);
        }
        for (let i = 12; i < 15; i++) { // move equals sign
            this.txts[i].move(this.x + 222, this.y + 57);
        }
    }

    // equations into matrix form
    move2() {
        for (let i = 3; i < 6; i++) {  // move x2
            this.txts[i].move(this.x + 104, this.y + (i - 3) * 57)
        }
        this.kats[1].move(this.x + 150, this.y - 17);  // move beta_0
        this.kats[4].move(this.x + 150, this.y + 50);  // move beta
        this.brackets[3].move({
            x1: this.x + 120, y1: this.y + 167,
            x2: this.x + 120, y2: this.y
        });
        this.brackets[2].move({
            x1: this.x + 134, y1: this.y + 24,
            x2: this.x + 134, y2: this.y + 142
        });
        this.brackets[1].move({
            x1: this.x + 202, y1: this.y + 142,
            x2: this.x + 202, y2: this.y + 24
        })
    }

    show() {
        if (this.moved) this.moving();
        if (this.s.frameCount === this.mv1) this.move1();
        if (this.s.frameCount === this.mv2) this.move2();
        for (let t of this.txts) t.show();
        for (let k of this.kats) k.show();
        for (let b of this.brackets) b.show();
    }
}



/*** 2019-01-12, 01-27
 * We are displaying three lines with general equations ax + by = c (1 * beta_0 + x * beta = y).
 * Also displays the least squares solution (β_0, β) as a point on β_0-β space.
 * Uses the global variables, xs and ys, directly.
 */
class Grid_3Lines extends Grid {
    constructor(ctx, args) {
        super(ctx, args);

        this.xs = [matrix[3], matrix[4], matrix[5]];
        this.ys = target;
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
}

class Grid_3Lines_Transform extends Grid_3Lines {
    constructor(ctx, args) {
        super(ctx, args);
    }

    move() {
        this.yo = this.ys;
        this.yd = y_new;
        this.timer2 = new Timer2(frames(1.4));
        this.moved = true;
    }

    moving() {
        let t = this.timer2.advance();
        for (let i = 0; i < this.numPts; i++) {
            this.ys[i] = this.yo[i] + t * (this.yd[i] - this.yo[i]);
            let arr = this.calcLineParams(1, this.xs[i], this.ys[i]);
            this.lines[i].reset({
                x1: arr[0], y1: arr[1],
                x2: arr[2], y2: arr[3],
            });
        }
    }

    show() {
        if (this.moved)
            this.moving();

        this.showGrid();
        for (let l of this.lines) l.show();
    }
}


class Grid_3Lines_With_Point extends Grid_3Lines {
    constructor(ctx, args) {
        super(ctx, args);
        this.calcClosestPoint();
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
            x: x - 129,
            y: y - 107,
            fadeIn: true, start: getT(this.time.lines)
        });

    }

    show() {
        this.showGrid();
        for (let l of this.lines) l.show();
        this.closestPoint.show();
        this.kat.show();
    }
}

// used for scene 17, basically copied from chapter 1
class SLR_Plot_2 extends Plot { // the plot used to illustrate simple linear regression
    constructor(ctx, args) {
        super(ctx, args);
    }

    // this method should be only called once, i.e. at one specific frame
    reset() {
        this.yo = this.Ys;
        this.yd = y_new;
        this.timer = new Timer2(frames(1.4));
        this.moved = true;
    }

    // helper method
    resetting() {
        let t = this.timer.advance();
        for (let i = 0; i < this.numPts; i++) {
            // this.Xs[i] = this.xo[i] + (this.xd[i] - this.xo[i]) * t;
            this.Ys[i] = this.yo[i] + (this.yd[i] - this.yo[i]) * t;
        }
        this.calcCoords();
        for (let i = 0; i < this.numPts; i++) {
            this.points[i].reset(this.ptXs[i], this.ptYs[i]);
        }
        this.calcParams();
        this.LSLine.reset({
            y1: this.y_intercept + this.beta * (this.centerX - this.left),
            y2: this.y_intercept - this.beta * (this.right - this.centerX)
        });
    }


    show() {
        if (this.moved) {
            this.resetting();
        }

        this.showAxes(); // this.showGrid()
        this.showPoints();
        this.LSLine.show();
    }
}