/**
 * Capable of displaying the squared error of each point
 */
class LS_Plot extends Plot {
    constructor(args) {
        super(args);
        this.sqs = [];
        this.b_new = 0;
        this.b0_new = 0;

        for (let i = 0; i < this.numPts; i++) {
            let y_hat = this.getY(this.Xs[i]);
            let dy = y_hat - this.Ys[i];
            this.sqs[i] = new Emphasis({
                color: color(207, 207, 27, 87),
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
                y: this.ptYs,
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
        let b0_coeff = map(mouseX, 0, width, this.lb * this.stepX, this.ub * this.stepX);
        let b_coeff = map(mouseY, 0, height, this.ub * this.stepY, this.lb * this.stepY);
        this.reset({
            b0_new: b0_coeff,
            b_new: b_coeff
        });
        this.showAxes();
        this.showPoints();
        for (let e of this.sqs) e.show();
    }
}


let plot;
function setup() {
    frameRate(fr);
    createCanvas(cvw, cvh);
    plot = new LS_Plot({
        xs: [matrix[3], matrix[4], matrix[5]],
        ys: target,
        stepX: 100,
        stepY: 100
    });
}

function draw() {
    background(0);
    plot.show();
}