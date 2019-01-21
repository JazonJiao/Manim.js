/**
 * Capable of displaying the squared error of each point
 */
class LS_Plot extends Plot {
    constructor(ctx, args) {
        super(ctx, args);
        this.sqs = [];
        this.b_new = 0;
        this.b0_new = 0;

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

    reset(args) {
        this.b_new = args.b_new;
        this.b0_new = args.b0_new;

        for (let i = 0; i < this.numPts; i++) {
            let y_hat = this.getY(this.Xs[i]);
            let dy = y_hat - this.ptYs[i];
            this.sqs[i].reset({
                x: this.ptXs[i],
                y: this.ptYs[i],
                w: dy, h: -dy    // we're constructing a square
            })
        }
    }

    // convert from actual x coords to canvas coords
    // (should have used this as helper method in parent class)
    // getX(x) {
    //     return x * this.stepX + this.centerX;
    // }

    getY(x) {  // this x is actual x, not canvas x.
        return (this.centerY - this.b0_new * this.stepY) - this.b_new * x * this.stepX;
    }

    show() {
        // these will later be merged into 2.2; notice that variable names are different
        this.lb = -1;
        this.ub = 1;
        let b0_coeff = this.s.map(
            this.s.mouseX, 0, this.s.width, this.lb * this.stepX, this.ub * this.stepX);
        let b_coeff = this.s.map(
            this.s.mouseY, 0, this.s.height, this.ub * this.stepY, this.lb * this.stepY);
        this.reset({
            b0_new: b0_coeff,
            b_new: b_coeff
        });
        this.showAxes();
        this.showPoints();
        for (let e of this.sqs) e.show();
    }
}

function Chap2Part3(s) {
    let plot;

    s.setup = function() {
        s.frameRate(fr);
        s.createCanvas(cvw, cvh);
        plot = new LS_Plot(s, {
            xs: [matrix[3], matrix[4], matrix[5]],
            ys: target,
            stepX: 100,
            stepY: 100
        });
    };

    s.draw = function() {
        s.background(0);
        plot.show();
    };
}

new p5(Chap2Part3);