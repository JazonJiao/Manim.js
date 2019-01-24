// 3d scene


// 2019-01-02, 03
class Grid_Projection extends Grid3D {
    constructor(ctx, args) {
        super(ctx, args);
        // an array in the form [a,b,c, d,e,f], representing 2 column vectors
        // coordinates should be in p5's coordinate system
        this.U = args.mat;

        this.start = args.start || frames(2);
        this.timer = new Timer2(frames(2));

        this.xd = [];
        this.yd = [];
        this.zd = [];
        this.P = calcProjectionMatrix(stdToP5(this.U));
        // calculate the destination coordinates
        for (let i = 0; i < this.nCb; i++) { // iterate through n^3 entries
            let x = this.xs[i],
                y = this.ys[i],
                z = this.zs[i];
            this.xd[i] = this.P[0] * x + this.P[1] * y + this.P[2] * z;
            this.yd[i] = this.P[3] * x + this.P[4] * y + this.P[5] * z;
            this.zd[i] = this.P[6] * x + this.P[7] * y + this.P[8] * z;
        }
    }

    show(g) {
        if (this.s.frameCount < this.start) {
            this.showGrid(g);
        } else {                           // show transformation
            let t = this.timer.advance();
            let a, b, c, d, x1, y1, z1, x, y, z;
            for (let i = 0; i < this.n; i++) {
                for (let j = 0; j < this.n; j++) {
                    for (let k = 0; k < this.n; k++) {
                        // the index of the starting point of lines
                        d = i * this.nSq + j * this.n + k;

                        x1 = this.xs[d];
                        x = x1 + (this.xd[d] - x1) * t;
                        y1 = this.ys[d];
                        y = y1 + (this.yd[d] - y1) * t;
                        z1 = this.zs[d];
                        z = z1 + (this.zd[d] - z1) * t;

                        // the indices of the endpoints of lines
                        a = d + 1;
                        b = d + this.n;
                        c = d + this.nSq;

                        // the rgb values of the lines to be drawn
                        this.setColor(g, i, j, k);

                        if (k !== this.n - 1) {
                            g.line(x, y, z,
                                this.xs[a] + (this.xd[a] - this.xs[a]) * t,
                                this.ys[a] + (this.yd[a] - this.ys[a]) * t,
                                this.zs[a] + (this.zd[a] - this.zs[a]) * t);
                        }
                        if (j !== this.n - 1) {
                            g.line(x, y, z,
                                this.xs[b] + (this.xd[b] - this.xs[b]) * t,
                                this.ys[b] + (this.yd[b] - this.ys[b]) * t,
                                this.zs[b] + (this.zd[b] - this.zs[b]) * t);
                        }
                        if (i !== this.n - 1) {
                            g.line(x, y, z,
                                this.xs[c] + (this.xd[c] - this.xs[c]) * t,
                                this.ys[c] + (this.yd[c] - this.ys[c]) * t,
                                this.zs[c] + (this.zd[c] - this.zs[c]) * t);
                        }
                    }
                }
            }
        }
    }
}


/**
 * Adds three vectors to display, in addition to the plane
 */
class Plane_Projection extends Plane3D {
    constructor(ctx, args) {
        super(ctx, args);
        this.Y = args.y;   // the y in Ax = y. A is passed in as args.mat, y is args.y
        this.step = args.step || 100;

        this.start = args.start;  // time to start animation: projection of y onto span{ x1, x2 }

        // x1
        this.arrow1 = new Arrow3D(this.s, {
            to: [matrix[0] * this.step, matrix[1] * this.step, matrix[2] * this.step],
            color: this.s.color([237, 47, 47])
        });
        // x2
        this.arrow2 = new Arrow3D(this.s, {
            to: [matrix[3] * this.step, matrix[4] * this.step, matrix[5] * this.step],
            color: this.s.color([37, 147, 37])
        });

        // y
        let x = this.Y[0] * this.step,
            y = this.Y[1] * this.step,
            z = this.Y[2] * this.step;
        this.Ys = [x, y, z];
        this.arrow3 = new Arrow3D(this.s, {
            to: this.Ys,
            color: this.s.color([27, 147, 227])
        });
        this.P = calcProjectionMatrix(matrix);
        this.Yd = [
            this.P[0] * x + this.P[1] * y + this.P[2] * z,
            this.P[3] * x + this.P[4] * y + this.P[5] * z,
            this.P[6] * x + this.P[7] * y + this.P[8] * z];
        this.timer = new Timer2(frames(2));
    }

    show(g) {
        this.showPlane(g);
        this.arrow1.show(g);
        this.arrow2.show(g);
        if (this.s.frameCount > this.start) {
            let t = this.timer.advance();
            this.arrow3.reset({
                to: [this.Ys[0] + t * (this.Yd[0] - this.Ys[0]),
                    this.Ys[1] + t * (this.Yd[1] - this.Ys[1]),
                    this.Ys[2] + t * (this.Yd[2] - this.Ys[2])]
            });
        }
        this.arrow3.show(g);
    }
}

function Chap3Part2(s) {
    let g3;
    let g2;

    let axes;
    let grid;
    let plane1;  // this must not be named plane, otherwise plane() function would not work
    let ax;
    let time = {
        transform: frames(2)
    };

    s.preload = function (){
        ax = s.loadModel('../lib/obj/axes.obj');
    };

    s.setup = function (){
        s.frameRate(fr);

        s.pixelDensity(1);
        s.createCanvas(1200, 675);
        g3 = s.createGraphics(2400, 1350, s.WEBGL);
        g2 = s.createGraphics(100, 10);

        axes = new Axes3D(s, {
            angle: 2.5,
            model: ax
        });

        plane1 = new Plane_Projection(s, {
            mat: matrix,
            y: target,
            color: s.color(255, 255, 0, 77),
            start: time.transform
        });

        grid = new Grid_Projection(s, {
            lineLen: 147,
            numLines: 3,
            mat: matrix,
            start: time.transform,
            strokeweight: 3
        });
    };

    s.draw = function (){
        s.background(0);
        axes.show(g3);
        grid.show(g3);
        plane1.show(g3);

        s.image(g3, 0, 0, 1200, 675);

        showFR(s, g2);
    }
}

new p5(Chap3Part2);
