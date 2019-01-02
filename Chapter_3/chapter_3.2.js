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
        this.P[0] = this.U[0] * this.U[0] + this.U[3] * this.U[3];
        this.P[1] = this.P[3] = this.U[0] * this.U[1] + this.U[3] * this.U[4];
        this.P[2] = this.P[6] = this.U[0] * this.U[2] + this.U[3] * this.U[5];
        this.P[4] = this.U[1] * this.U[1] + this.U[4] * this.U[4];
        this.P[5] = this.P[7] = this.U[1] * this.U[2] + this.U[4] * this.U[5];
        this.P[8] = this.U[2] * this.U[2] + this.U[5] * this.U[5];

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
            let a, b, c, d, cr, cg, cb, x1, y1, z1, x, y, z;
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
                        stroke(i * 50 + 50, j * 50 + 50, k * 50 + 37);

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

/** 2019-01-02
 * A plane defined by two basis vectors which span it.
 */
class Plane {
    constructor(args) {
        // an array in the form [a,b,c, d,e,f], representing 2 column vectors
        // coordinates should be in p5's coordinate system
        this.M = args.mat;
        this.color = args.color || color(255, 77);
        this.size = args.size || 674;

        this.calcParams();
    }

    calcParams() {
        // calculate the cross product of the two basis vectors
        let x = this.M[1] * this.M[5] - this.M[2] * this.M[4];
        let y = this.M[2] * this.M[3] - this.M[0] * this.M[5];
        let z = this.M[0] * this.M[4] - this.M[1] * this.M[3];

        // for explanations of this calculation, @see class Arrow3D
        let len = Math.sqrt(x * x + y * y + z * z);
        let theta = Math.atan2(x, z);
        let phi = Math.acos(y / len) / 2;
        this.v = createVector(
            Math.sin(phi) * Math.sin(theta),
            Math.cos(phi),
            Math.sin(phi) * Math.cos(theta)
        )
    }

    show() {
        push();
        noStroke();
        fill(this.color);
        rotate(PI, this.v);
        rotateX(PI / 2);
        // rotateZ(frameCount / 100);
        plane(this.size, this.size);
        pop();
    }
}


let gra3d;
let gra2d;

let axes;
let arrow1, arrow2, arrow3;
let grid;
let plane1;  // this must not be named plane, otherwise plane() function would not work

function setup() {
    frameRate(fr);
    gra3d = createCanvas(1200, 675, WEBGL);
    gra2d = createGraphics(200, 200);

    axes = new Axes3D({
        speed: -0.01
    });

    arrow1 = new Arrow3D({
        x2: 100, y2: -200, z2: 300
    });
    arrow2 = new Arrow3D({
        x2: 200, y2: 250, z2: 300,
        color: color(27, 177, 37)
    });
    // arrow3 = new Arrow3D({
    //     x2: -270, y2: 60, z2: 130
    // });

    grid = new Grid_Projection({
        lineLen: 147,
        numLines: 3,
        mat: [1, -2, 3, 2, 2.5, 3],
        start: time.transform
    });

    plane1 = new Plane({
        mat: [1, -2, 3, 4, 5, 6],
        color: color(255, 255, 0, 77)
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
    arrow1.show();
    arrow2.show();
    //arrow3.show();

    grid.show();
    plane1.show();

    //image(gra3d, 0, 0);
    //showFR();
}

function mousePressed() {
    console.log(frameCount);
    noLoop();
}

function mouseReleased() {
    loop();
}