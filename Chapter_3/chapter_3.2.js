// 3d scene

let time = {
    transform: frames(2)
};

// 2019-01-02
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
        this.calcCoords();
    }

    calcCoords() {
        // turn the given 3x2 matrix into an orthonormal basis
        let len1 = Math.sqrt(this.U[0] * this.U[0] + this.U[1] * this.U[1] + this.U[2] * this.U[2]);
        this.U[0] /= len1;
        this.U[1] /= len1;
        this.U[2] /= len1;
        let len2 = Math.sqrt(this.U[3] * this.U[3] + this.U[4] * this.U[4] + this.U[5] * this.U[5]);
        this.U[3] /= len2;
        this.U[4] /= len2;
        this.U[5] /= len2;

        // calculate the 3x3 projection matrix
        this.P = new Array(9);
        this.P[0]             = this.U[0] * this.U[0] + this.U[3] * this.U[3];
        this.P[1] = this.P[3] = this.U[0] * this.U[1] + this.U[3] * this.U[4];
        this.P[2] = this.P[6] = this.U[0] * this.U[2] + this.U[3] * this.U[5];
        this.P[4]             = this.U[1] * this.U[1] + this.U[4] * this.U[4];
        this.P[5] = this.P[7] = this.U[1] * this.U[2] + this.U[4] * this.U[5];
        this.P[8]             = this.U[2] * this.U[2] + this.U[5] * this.U[5];

        // calculate the destination coordinates
        for (let i = 0; i < this.nCb; i++) { // iterate through n^3 entries
            let x = this.xs[i], y = this.ys[i], z = this.zs[i];
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
            let a, b, c, d, cr, cg, cb, x1, y1, z1, x2, y2, z2;
            for (let i = 0; i < this.n; i++) {
                for (let j = 0; j < this.n; j++) {
                    for (let k = 0; k < this.n; k++) {
                        // the index of the starting point of lines
                        d = i * this.nSq + j * this.n + k;
                        x1 = this.xs[d]; x2 = this.xd[d];
                        y1 = this.ys[d]; y2 = this.yd[d];
                        z1 = this.zs[d]; z2 = this.zd[d];

                        // the indices of the endpoints of lines
                        a = d + 1;
                        b = d + this.n;
                        c = d + this.nSq;

                        // the rgb values of the lines to be drawn
                        stroke(i*50+57, j*50+50, k*50+37);

                        if (k !== this.n - 1) {
                            line(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t,
                                this.xs[a] + (this.xd[a] - this.xs[a]) * t,
                                this.ys[a] + (this.yd[a] - this.ys[a]) * t,
                                this.zs[a] + (this.zd[a] - this.zs[a]) * t);
                        }
                        if (j !== this.n - 1) {
                            line(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t,
                                this.xs[b] + (this.xd[b] - this.xs[b]) * t,
                                this.ys[b] + (this.yd[b] - this.ys[b]) * t,
                                this.zs[b] + (this.zd[b] - this.zs[b]) * t);
                        }
                        if (i !== this.n - 1) {
                            line(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, z1 + (z2 - z1) * t,
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



let gra3d;
let gra2d;

let axes;
let arrow1;
let grid;

function setup() {
    frameRate(fr);
    gra3d = createCanvas(1200, 675, WEBGL);
    gra2d = createGraphics(100, 100);

    axes = new Axes3D({});

    arrow1 = new Arrow3D({
        x2: 100, y2: -200, z2: 300
    });

    grid = new Grid_Projection({
        lineLen: 177,
        numLines: 3,
        mat: [1, -2, 3, 4, 5, 6],
        start: time.transform
    });
}
//
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
    //arrow1.show();
    grid.show();

    //showFR();
}

function mousePressed() {
    console.log(frameCount);
    noLoop();
}

function mouseReleased() {
    loop();
}