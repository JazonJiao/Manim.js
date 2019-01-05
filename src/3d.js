/*** 2018-12-29
 * Axis3D (WEBGL)
 * This class is also responsible for the basic setups of a 3D scene,
 * including lighting and camera. fixme: Its show() is called first in draw().
 *
 * ---- args list parameters---
 * @optional (number) angle, speed
 */
class Axes3D {
    constructor(args) {
        this.angle = args.angle || 0;  // starting angle
        this.speed = args.speed || -0.0025;  // how many radians to rotate per frame
        this.camY = -567;
        this.camRadius = 674;
    }

    show() {
        // these must be called before directionalLight and ambientLight()
        fill(177);
        noStroke();

        directionalLight(255, 255, 255, 0, 1, 0);
        ambientLight(177, 177, 177);

        let camX = this.camRadius * Math.cos(this.angle);
        let camZ = this.camRadius * Math.sin(this.angle);
        this.angle += this.speed;

        camera(camX, this.camY, camZ, 0, 0, 0, 0, 1, 0);

        push();
        rotateZ(PI / 2);
        cylinder(3, 800);
        pop();
        push();
        translate(400, 0, 0);
        rotateZ(-PI / 2);
        cone(10, 30);
        pop();

        push();
        rotateX(PI / 2);
        cylinder(3, 800);
        pop();
        push();
        translate(0, 0, 400);
        rotateX(PI / 2);
        cone(10, 30);
        pop();

        push();
        cylinder(3, 800);
        pop();
        push();
        translate(0, -400, 0);
        rotateX(PI);
        cone(10, 30);
        pop();
    }
}

/** 2019-01-01
 * Grid3D (WEBGL)
 * Draws an n x n x n cube centered at the origin, with the rgb values of line segment color
 * proportional to the xyz coordinates of the point
 *
 * ---- args list parameters---
 * @optional (number) lineLen, numLines, strokeweight
 */
class Grid3D {
    constructor(args) {
        this.lineLen = args.lineLen || 32;
        this.n = args.numLines + 1 || 4;
        this.strokeweight = args.strokeweight || 2;

        this.nSq = this.n * this.n;
        this.nCb = this.n * this.n * this.n;
        this.from = -(this.lineLen * (this.n - 1)) / 2;
        this.to = -this.from;

        // to draw (n - 1) lines, we need n vertices. this.n represents number of vertices.
        this.xs = [];  // will contain n^3 entries
        this.ys = [];
        this.zs = [];
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                for (let k = 0; k < this.n; k++) {
                    let d = i * this.nSq + j * this.n + k;
                    this.xs[d] = this.from + this.lineLen * k;
                    this.ys[d] = this.from + this.lineLen * j;
                    this.zs[d] = this.from + this.lineLen * i;
                }
            }
        }
    }

    setColor(i, j, k) {
        stroke(map(i, 0, this.n, 72, 216),
            map(j, 0, this.n, 72, 216),
            map(k, 0, this.n, 72, 216));
    }

    showGrid() {
        strokeWeight(this.strokeweight);
        let a, b, c, d, x, y, z;
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                for (let k = 0; k < this.n; k++) {
                    d = i * this.nSq + j * this.n + k;

                    x = this.xs[d];
                    y = this.ys[d];
                    z = this.zs[d];
                    a = d + 1;
                    b = d + this.n;
                    c = d + this.nSq;

                    this.setColor(i, j, k);

                    if (k !== this.n - 1) {
                        line(x, y, z, this.xs[a], this.ys[a], this.zs[a]);
                    }
                    if (j !== this.n - 1) {
                        line(x, y, z, this.xs[b], this.ys[b], this.zs[b]);
                    }
                    if (i !== this.n - 1) {
                        line(x, y, z, this.xs[c], this.ys[c], this.zs[c]);
                    }
                }
            }
        }
    }
}


/*** 2018-12-30
 * Arrow3D (WEBGL)
 *
 * ---- args list parameters ----
 * @mandatory (number) x2, y2, z2--those should be using p5's coordinate system
 * @optional (number) x1, y1, z1, radius, tipLen, tipRadius; (color) color
 */
class Arrow3D {
    constructor(args) {
        this.x1 = args.x1 || 0;
        this.y1 = args.y1 || 0;
        this.z1 = args.z1 || 0;
        this.dx = args.x2 - this.x1;
        this.dy = args.y2 - this.y1;
        this.dz = args.z2 - this.z1;

        this.color = args.color || color(177);
        this.radius = args.radius || 3;
        this.tipLen = args.tipLen || 30;
        this.tipRadius = args.tipRadius || 10;
        this.calcParam();
    }

    calcParam() {
        // To perform the proper rotation of the cylinder (which is drawn along p5's y-axis),
        // I originally transformed the coordinates from Cartesian into spherical,
        // and then called rotateX(theta) and rotateZ(phi).
        // However, this would not work, since after rotateX(), the z-axis is no longer
        // where it used to be.
        // So I calculate the angle bisector between the y-axis and the vector (x, y, z)
        // and then perform a 180-degree rotation around that axis.
        this.len = Math.sqrt(this.dx * this.dx + this.dy * this.dy + this.dz * this.dz);

        // Note that the x, y, and z's are completely out of place in the calculations,
        // because of p5's weird left-hand 3D coordinate system.
        let theta = Math.atan2(this.dx, this.dz);      // theta = atan2(y / x)
        let phi = Math.acos(this.dy / this.len) / 2;   // phi = acos(z / r)

        // Calculate the axis of rotation. Note that the length of this vector doesn't matter.
        this.v = createVector(
            Math.sin(phi) * Math.sin(theta), // y = sin(phi) * sin(theta)
            Math.cos(phi),                   // z = cos(phi)
            Math.sin(phi) * Math.cos(theta)  // x = sin(phi) * cos(theta)
        );
    }

    show() {
        push();
        fill(this.color);
        noStroke();

        // fixme: why do I have to call directionalLight() again?
        // fixme: And why doesn't the color values matter?
        directionalLight(1, 1, 1, 0, 1, 0);

        translate(this.dx / 2, this.dy / 2, this.dz / 2);
        rotate(PI, this.v);
        cylinder(this.radius, this.len);

        translate(0, this.len / 2, 0);
        cone(this.tipRadius, this.tipLen);  // fixme: the arrow's length will be off by tipLen/2
        pop();
    }

}

/** 2019-01-02
 * Plane3D (WEBGL)
 * A plane defined by two basis vectors which span it.
 *
 * ---- args list parameters ----
 * @mandatory (array[6]) M
 * @optional (number) size; (color) color
 */
class Plane3D {
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

    showPlane() {
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

// 2019-01-05
// make this a standalone function since it's needed by both Grid and Arrow in animating projection
// M is an array with 6 entries, representing two column vectors
function calcProjectionMatrix(M) {
    // make a copy of this array since it will be changed (normalized)
    let U = M.copyWithin();

    // It would be much easier to calculate UU^T since it doesn't involve inverting,
    // So we first turn the given 3x2 matrix into an orthonormal basis.
    let len1 = Math.sqrt(U[0] * U[0] + U[1] * U[1] + U[2] * U[2]);
    U[0] /= len1;
    U[1] /= len1;
    U[2] /= len1;

    // apply Gram-Schmidt algorithm to make two vectors orthogonal
    // I originally forgot this step, resulting in
    // the projection being on the right plane but distorted
    let u1_dot_x = U[3] * U[0] + U[4] * U[1] + U[5] * U[2];
    U[3] -= U[0] * u1_dot_x;
    U[4] -= U[1] * u1_dot_x;
    U[5] -= U[2] * u1_dot_x;
    let len2 = Math.sqrt(U[3] * U[3] + U[4] * U[4] + U[5] * U[5]);
    U[3] /= len2;
    U[4] /= len2;
    U[5] /= len2;

    // calculate the 3x3 projection matrix
    let P = new Array(9);
    P[0] =        U[0] * U[0] + U[3] * U[3];
    P[1] = P[3] = U[0] * U[1] + U[3] * U[4];
    P[2] = P[6] = U[0] * U[2] + U[3] * U[5];
    P[4] =        U[1] * U[1] + U[4] * U[4];
    P[5] = P[7] = U[1] * U[2] + U[4] * U[5];
    P[8] =        U[2] * U[2] + U[5] * U[5];
    return P;
}
