
function Chap2Part3(s) {
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
            // these will later be merged into 2.2; notice that variable names are different
            this.lb = -2;
            this.ub = 2;
            let b0_coeff = this.s.map(
                this.s.mouseX, 0, this.s.width, this.lb, this.ub);  // fixme: width is now 600
            let b_coeff = this.s.map(
                this.s.mouseY, 0, this.s.height, this.ub, this.lb);
            this.reset({
                b0_new: b0_coeff,
                b_new: b_coeff
            });
            this.showAxes();
            this.showPoints();
            this.LSLine.show();
            for (let e of this.sqs) e.show();
        }
    }

    s.setup = function() {
        s.frameRate(fr);
        s.createCanvas(600, cvh);
        s.plot = new LS_Plot(s, {
            xs: [matrix[3], matrix[4], matrix[5]],
            ys: target,
            left: 0,
            centerX: 300,
            right: 597,
            labelX: "x",
            labelY: "y",
            stepX: 100,
            stepY: 100
        });
    };

    s.draw = function() {
        s.background(0);
        s.plot.show();
    };
}

let p23 = new p5(Chap2Part3);