// Chapter 6, Projection onto a Line

class LT_Grid extends Grid {  // a grid capable of doing eloa-style linear transformations
    constructor(ctx) {
        let time = {
            grid: frames(1),
            i_hat: frames(3),
            j_hat: frames(5),
            u_hat: frames(7),
            transform: frames(9.5)
        };

        super(ctx, {
            spacing: 70,
            centerX: 200,
            centerY: 500,
            start: time.grid
        });
        this.startTransform = time.transform;

        // how many pixels correspond to 1 in the actual coordinate
        this.step = this.spacing * 5;

        this.arrows = [];

        // i-hat
        this.arrows[1] = new Arrow(this.s, {
            x1: this.centerX, x2: this.centerX + this.step,
            y1: this.centerY, y2: this.centerY,
            color: this.s.color('#47c747'), strokeweight: 7, tipLen: 27,
            start: time.i_hat, //fadeIn: true
        });

        // j-hat
        this.arrows[2] = new Arrow(this.s, {
            x1: this.centerX, x2: this.centerX,
            y1: this.centerY, y2: this.centerY - this.step,
            color: this.s.color('#f75757'), strokeweight: 7, tipLen: 27,
            start: time.j_hat
        });

        this.u_x = 0.8;
        this.u_y = 0.6;

        // u-hat
        this.arrows[0] = new Arrow(this.s, {
            x1: this.centerX, x2: this.centerX + this.u_x * this.step,
            y1: this.centerY, y2: this.centerY - this.u_y * this.step,
            color: this.s.color('#f7f717'), strokeweight: 7, tipLen: 27,
            start: time.u_hat
        });

        this.calcCoords();
        this.timer2 = new Timer2(frames(2));
    }

    calcCoords() {
        let u_x2 = this.u_x * this.u_x;
        let u_xu_y = this.u_x * this.u_y;
        let u_y2 = this.u_y * this.u_y;

        // 2018-12-26
        // Store the original and transformed coordinates of grid lines,
        // in order up, down, left, right.
        // x1, y1/x2, y2 define the original starting/ending coordinates of grid lines
        // for horizontal lines, y1 and y2 are given by gridlineup/gridlinedown;
        // for vertical lines, x1 and x2 are given by gridlineleft/gridlineright.
        // x3, y3 are obtained by applying the projection matrix to x1, y1.
        // Same for x4, y4.
        this.x1s = [];
        this.y1s = [];
        this.x2s = [];
        this.y2s = [];
        this.totalNumLines = 0;
        for (let o of this.gridlineup) {
            this.x1s.push(this.left);
            this.y1s.push(o);
            this.x2s.push(this.right);
            this.y2s.push(o);
            this.totalNumLines++;
        }
        for (let o of this.gridlinedown) {
            this.x1s.push(this.left);
            this.y1s.push(o);
            this.x2s.push(this.right);
            this.y2s.push(o);
            this.totalNumLines++;
        }
        for (let o of this.gridlineleft) {
            this.x1s.push(o);
            this.y1s.push(this.top);
            this.x2s.push(o);
            this.y2s.push(this.bottom);
            this.totalNumLines++;
        }
        for (let o of this.gridlineright) {
            this.x1s.push(o);
            this.y1s.push(this.top);
            this.x2s.push(o);
            this.y2s.push(this.bottom);
            this.totalNumLines++;
        }
        this.x3s = [];
        this.y3s = [];
        this.x4s = [];
        this.y4s = [];
        for (let i = 0; i < this.totalNumLines; i++) {
            // since the coordinate on the canvas is both flipped and translated, we need
            // to first get the absolute coordinates, and then translate back again.
            // It might be better to use the p5 translate() function to do this instead...
            let x1 = this.x1s[i] - this.centerX;
            let y1 = this.centerY - this.y1s[i];
            let x2 = this.x2s[i] - this.centerX;
            let y2 = this.centerY - this.y2s[i];

            this.x3s[i] = x1 * u_x2 + y1 * u_xu_y + this.centerX;
            this.y3s[i] = this.centerY - (x1 * u_xu_y + y1 * u_y2);
            this.x4s[i] = x2 * u_x2 + y2 * u_xu_y + this.centerX;
            this.y4s[i] = this.centerY - (x2 * u_xu_y + y2 * u_y2);
        }

        // the original and target coordinates of the arrows, calculation same as above
        this.x1a = [];
        this.x2a = [];
        this.x3a = [];
        this.x4a = [];
        this.y1a = [];
        this.y2a = [];
        this.y3a = [];
        this.y4a = [];
        for (let i = 0; i < this.arrows.length; i++) {
            this.x1a[i] = this.arrows[i].x1;
            this.x2a[i] = this.arrows[i].x2;
            this.y1a[i] = this.arrows[i].y1;
            this.y2a[i] = this.arrows[i].y2;
            let x1 = this.arrows[i].x1 - this.centerX;
            let y1 = this.centerY - this.arrows[i].y1;
            let x2 = this.arrows[i].x2 - this.centerX;
            let y2 = this.centerY - this.arrows[i].y2;

            this.x3a[i] = x1 * u_x2 + y1 * u_xu_y + this.centerX;
            this.y3a[i] = this.centerY - (x1 * u_xu_y + y1 * u_y2);
            this.x4a[i] = x2 * u_x2 + y2 * u_xu_y + this.centerX;
            this.y4a[i] = this.centerY - (x2 * u_xu_y + y2 * u_y2);
        }

    }

    showTransform() {
        let t = this.timer2.advance();
        this.s.strokeWeight(2);
        this.s.stroke(27, 177, 247);
        for (let i = 0; i < this.totalNumLines; i++) {
            this.s.line(this.x1s[i] + (this.x3s[i] - this.x1s[i]) * t,
                this.y1s[i] + (this.y3s[i] - this.y1s[i]) * t,
                this.x2s[i] + (this.x4s[i] - this.x2s[i]) * t,
                this.y2s[i] + (this.y4s[i] - this.y2s[i]) * t);
        }
        for (let i = 0; i < this.arrows.length; i++) {
            this.arrows[i].reset({
                x1: this.x1a[i] + (this.x3a[i] - this.x1a[i]) * t,
                y1: this.y1a[i] + (this.y3a[i] - this.y1a[i]) * t,
                x2: this.x2a[i] + (this.x4a[i] - this.x2a[i]) * t,
                y2: this.y2a[i] + (this.y4a[i] - this.y2a[i]) * t
            });
        }
    }

    show() {
        if (this.s.frameCount < this.startTransform) {
            this.showGrid();
        } else {
            this.showAxes();
            this.showTransform();
        }

        for (let a of this.arrows) {
            a.show();
        }
    }


}

const Chap3 = function(s) {
    let grid;

    let kats = [];
    s.setup = function (){
        s.frameRate(fr);
        s.createCanvas(1200, 675);
        grid = new LT_Grid(s);

        kats[0] = new Katex(s, {
            text: "\\begin{bmatrix}" +
                "   \\textcolor{#57c757}{u_x} \\\\" +
                "   \\textcolor{#f76767}{u_y}" +
                "\\end{bmatrix}" +
                "\\begin{bmatrix}" +
                "   \\textcolor{#57c757}{u_x} & \\textcolor{#f76767}{u_y} \\\\" +
                "\\end{bmatrix}",
            font_size: 47,
            x: 800,
            y: 100
        });
    };

    s.draw = function (){
        s.background(0);
        grid.show();
        for (let k of kats) {
            k.show();
        }
    };
}

let p31 = new p5(Chap3);
