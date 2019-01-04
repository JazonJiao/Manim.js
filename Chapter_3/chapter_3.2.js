// 3d scene

let time = {
    transform: frames(2)
};

let matrix = [1, -2, 3,
              -3, -4, 0];

// 2019-01-02, 03
class Grid_Projection extends Grid3D {
    constructor(args) {
        super(args);
        // an array in the form [a,b,c, d,e,f], representing 2 column vectors
        // coordinates should be in p5's coordinate system
        this.U = args.mat;

        this.start = args.start || frames(2);
        this.timer = new Timer2(frames(2));

        this.xd = [];
        this.yd = [];
        this.zd = [];
        this.P = calcProjectionMatrix(this.U);
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

    show() {
        if (frameCount < this.start) {
            this.showGrid();
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
                        this.setColor(i, j, k);

                        if (k !== this.n - 1) {
                            line(x, y, z,
                                this.xs[a] + (this.xd[a] - this.xs[a]) * t,
                                this.ys[a] + (this.yd[a] - this.ys[a]) * t,
                                this.zs[a] + (this.zd[a] - this.zs[a]) * t);
                        }
                        if (j !== this.n - 1) {
                            line(x, y, z,
                                this.xs[b] + (this.xd[b] - this.xs[b]) * t,
                                this.ys[b] + (this.yd[b] - this.ys[b]) * t,
                                this.zs[b] + (this.zd[b] - this.zs[b]) * t);
                        }
                        if (i !== this.n - 1) {
                            line(x, y, z,
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
 * Adds two vectors to display, in addition to the plane
 */
class Plane_Projection extends Plane3D {
    constructor(args) {
        super(args);
        this.step = args.step || 100;
        this.arrow1 = new Arrow3D({
            x2: this.M[0] * this.step, y2: this.M[1] * this.step, z2: this.M[2] * this.step,
            color: color([37, 147, 37])
        });
        this.arrow2 = new Arrow3D({
            x2: this.M[3] * this.step, y2: this.M[4] * this.step, z2: this.M[5] * this.step,
            color: color([237, 47, 47])
        });
    }

    show() {
        this.showPlane();
        this.arrow1.show();
        this.arrow2.show();
    }
}

let gra3d;
let gra2d;

let axes;
let grid;
let plane1;  // this must not be named plane, otherwise plane() function would not work

function setup() {
    frameRate(fr);
    gra3d = createCanvas(1200, 675, WEBGL);
    gra2d = createGraphics(200, 200);

    axes = new Axes3D({
        angle: 2.5,
        speed: -0.01
    });

    plane1 = new Plane_Projection({
        mat: matrix,
        color: color(255, 255, 0, 77)
    });

    grid = new Grid_Projection({
        lineLen: 147,
        numLines: 3,
        mat: matrix,
        start: time.transform
    });
}

// function showFR() {
//     let fps = frameRate();
//     gra2d.fill(255);
//     gra2d.noStroke();
//     gra2d.text("FPS: " + fps.toFixed(1), 10, 10);
//     image(gra2d, 0, 0);
// }

function draw() {
    background(0);

    axes.show();

    grid.show();
    plane1.show();

    //image(gra3d, 0, 0);
    //showFR();
}
