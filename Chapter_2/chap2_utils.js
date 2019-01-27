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
            this.s.mouseX, 0, 1200, this.lb, this.ub);  // fixme: width is now 600
        let b_coeff = this.s.map(
            this.s.mouseY, 0, 675, this.ub, this.lb);
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

/***
 * ---- args list parameters ----
 * (number) x, y, start, show1s, mv1, mv2
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
            x1: this.x - 7, x2: this.x - 7, y1: this.y, y2: this.y + 167, strokeweight: 3,
            tipLen: 9, duration: frames(2), start: this.mv1
        });
        this.brackets[1] = new Bracket(this.s, {
            x1: this.x + 44, x2: this.x + 44, y1: this.y + 167, y2: this.y, strokeweight: 3,
            tipLen: 9, duration: frames(2), start: this.mv1
        });

        // x2
        this.brackets[2] = new Bracket(this.s, {
            x1: this.x + 127, x2: this.x + 127, y1: this.y, y2: this.y + 167, strokeweight: 3,
            tipLen: 9, duration: frames(2), start: this.mv1
        });
        this.brackets[3] = new Bracket(this.s, {
            x1: this.x + 194, x2: this.x + 194, y1: this.y + 167, y2: this.y, strokeweight: 3,
            tipLen: 9, duration: frames(2), start: this.mv1
        });

        // y
        this.brackets[4] = new Bracket(this.s, {
            x1: this.x + 271, x2: this.x + 271, y1: this.y, y2: this.y + 167, strokeweight: 3,
            tipLen: 9, duration: frames(2), start: this.mv1
        });
        this.brackets[5] = new Bracket(this.s, {
            x1: this.x + 340, x2: this.x + 340, y1: this.y + 167, y2: this.y, strokeweight: 3,
            tipLen: 9, duration: frames(2), start: this.mv1
        });
    }

    // move position of equations; unlike move1() and move2(),
    // this is controlled by s.draw(), not this.show().
    move(x, y) {
        this.xo = this.xd || this.x;
        this.xd = x;
        this.yo = this.yd || this.y;
        this.yd = y;
        this.moved = true;
        this.timer = new Timer2(frames(2));
    }

    moving() {
        let t = this.timer.advance();
        this.x = this.xo + t * (this.xd - this.xo);
        this.y = this.yo + t * (this.yd - this.yo);
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