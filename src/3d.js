/*** Refactored on 2019-01-06
 * To enable rendering 2D graphics on the screen, now every show() function of a 3D scene
 * should accept an off-screen 3D canvas as parameter.
 * There are still some bugs and the resolution seems not as high as before,
 * but I'll get along with it.
 */

/*** 2018-12-29
 * Axis3D (WEBGL)
 * This class is also responsible for the basic setups of a 3D scene,
 * including lighting and camera. fixme: Its show() is called first in draw().
 * in preload(), use axesObject = loadModel('../lib/obj/axes.obj'); and pass that in as model.
 * Assumes angle mode is in radians.
 *
 * ---- args list parameters---
 * @mandatory (p5.Gemoetry) model
 * @optional (number) angle, speed, camRadius
 */
class Axes3D {
    constructor(ctx, args) {
        this.s = ctx;
        this.angle = args.angle || 0;  // starting angle
        this.speed = args.speed || -0.0025;  // how many radians to rotate per frame
        this.camY = -567;
        this.camRadius = 674 || args.camRadius; // set to about 700 for displaying axes half-screen
        this.model = args.model;
    }

    /** 2019-02-04
     * reset camera properties with smooth animation in a given number of seconds
     * essentially redefining the camera properties in a spherical coordinates
     *
     * @param args
     * camRadius [cannot be 0; can be, say, 0.01],
     * angle [to transform to 2d view, use the angle s.PI],
     * camY [the height of camera; remember that upwards is negative],
     * speed [set to 0 if don't want to spin],
     * duration [in seconds]
     */
    moveCam(args) {
        this.camR_o = this.camRadius;
        this.camR_d = args.camRadius || this.camRadius;
        this.angle_o = this.angle;
        this.angle_d = args.angle || this.angle;
        this.camY_o = this.camY;
        this.camY_d = args.camY || this.camY;
        this.speed = args.speed;

        this.moved = true;
        this.f = 0;
        let d = args.duration || 2;
        this.duration = frames(d);
        this.move_timer = new Timer2(this.duration);
    }

    moving() {
        let t = this.move_timer.advance();
        this.camRadius = this.camR_o + t * (this.camR_d - this.camR_o);
        this.angle = this.angle_o + t * (this.angle_d - this.angle_o);
        this.camY = this.camY_o + t * (this.camY_d - this.camY_o);
        this.f++;
    }

    show(g) {
        // this will make the background transparent; background(0) will make it opaque
        // however, it will also cause the plane to not show up, as it calls g.fill(this.color);
        g.background(0, 0, 0, 0);

        g.noStroke();

        g.directionalLight(27, 27, 27, 0, 1, 0);
        g.ambientLight(27, 27, 27);

        g.specularMaterial(177);

        if (this.moved && this.f <= this.duration) {
            this.moving();
        } else {
            this.angle += this.speed;

            // reset angles so that they remain between -PI and PI
            if (this.angle < -this.s.PI)
                this.angle += this.s.TWO_PI;
            else if (this.angle > this.s.PI)
                this.angle -= this.s.TWO_PI;
        }
        let camX = this.camRadius * Math.cos(this.angle);
        let camZ = this.camRadius * Math.sin(this.angle);

        g.camera(camX, this.camY, camZ, 0, 0, 0, 0, 1, 0);

        g.push();
        g.rotateX(this.s.PI);
        g.rotateY(this.s.PI/2);
        g.model(this.model);
        g.pop();
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
    constructor(ctx, args) {
        this.s = ctx;
        this.lineLen = args.lineLen || 147;
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

    setColor(g, i, j, k) {
        g.stroke(this.s.map(i, 0, this.n, 72, 216),
            this.s.map(j, 0, this.n, 72, 216),
            this.s.map(k, 0, this.n, 72, 216));
    }

    showGrid(g) {
        g.strokeWeight(this.strokeweight);
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

                    this.setColor(g, i, j, k);

                    if (k !== this.n - 1) {
                        g.line(x, y, z, this.xs[a], this.ys[a], this.zs[a]);
                    }
                    if (j !== this.n - 1) {
                        g.line(x, y, z, this.xs[b], this.ys[b], this.zs[b]);
                    }
                    if (i !== this.n - 1) {
                        g.line(x, y, z, this.xs[c], this.ys[c], this.zs[c]);
                    }
                }
            }
        }
    }
}

/** 2019-02-02
 * Grid3D_Transform
 *
 * I decide that mat should be in p5 instead of std and that
 * it should be user's responsibility to convert to p5 coords,
 * since we usually need to first apply a transformation matrix before passing that matrix in
 *
 * ---- args list parameters---
 * @mandatory (array[9]) mat [in p5 coordinates, left-to-right and top-to-down],
 * @optional (number) strat, lineLen, numLines, strokeweight
 */
class Grid3D_Transform extends Grid3D {
    constructor(ctx, args) {
        super(ctx, args);
        this.M = args.mat;

        this.start = args.start || frames(2);
        this.timer = new Timer2(frames(2));

        this.xd = [];
        this.yd = [];
        this.zd = [];
        // calculate the destination coordinates
        for (let i = 0; i < this.nCb; i++) { // iterate through n^3 entries
            let x = this.xs[i],
                y = this.ys[i],
                z = this.zs[i];
            this.xd[i] = this.M[0] * x + this.M[1] * y + this.M[2] * z;
            this.yd[i] = this.M[3] * x + this.M[4] * y + this.M[5] * z;
            this.zd[i] = this.M[6] * x + this.M[7] * y + this.M[8] * z;
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


/*** 2018-12-30
 * Arrow3D (WEBGL)
 * label is a .obj model that represent the label of this vector.
 * I use 3ds Max to generate this model. If a label is passed in,
 * we can decide how to orient it by passing in an (anonymous) function,
 * with the canvas as its parameter.
 *
 * ---- args list parameters ----
 * @mandatory (array) to--[x2, y2, z2] in standard coordinates,
 * @optional (array) from; (number) radius, tipLen, tipRadius; (array) color;
 *           (p5.Geometry) label; (function) fcn
 */
class Arrow3D {
    constructor(ctx, args) {
        this.s = ctx;
        let tmp = args.from || [0, 0, 0];
        this.from = stdToP5(tmp);

        this.to = stdToP5(args.to);

        this.label = args.label;
        if (this.label) {
            this.fcn = args.fcn || ((g) => g.rotateZ(-this.s.PI / 2));  // default rotation function
        }

        this.color = args.color || [177, 177, 177];
        this.radius = args.radius || 3;
        this.tipLen = args.tipLen || 30;

        this.tipRadius = args.tipRadius || 10;
        this.calcParam();
    }

    calcParam() {
        this.x1 = this.from[0];
        this.y1 = this.from[1];
        this.z1 = this.from[2];
        this.x2 = this.to[0];
        this.y2 = this.to[1];
        this.z2 = this.to[2];
        this.dx = this.x2 - this.x1;
        this.dy = this.y2 - this.y1;
        this.dz = this.z2 - this.z1;

        // To perform the proper rotation of the cylinder (which is drawn along p5'o y-axis),
        // I originally transformed the coordinates from Cartesian into spherical,
        // and then called rotateX(theta) and rotateZ(phi).
        // However, this would not work, since after rotateX(), the z-axis is no longer
        // where it used to be.
        // So I calculate the angle bisector between the y-axis and the vector (x, y, z)
        // and then perform a 180-degree rotation around that axis.
        this.len = Math.sqrt(this.dx * this.dx + this.dy * this.dy + this.dz * this.dz);

        // if we don't do this, the final arrow length will be off by this.tipLen / 2,
        // since the center of the cone sits on the end of the cylinder.
        // We will also subtract this.tipLen / 2 from this.len at the end of other calculations.
        let scale = this.len / (this.len + this.tipLen / 2);
        // These define how we should translate the coordinates.
        this.tx = this.x1 + (this.dx) * scale / 2;
        this.ty = this.y1 + (this.dy) * scale / 2;
        this.tz = this.z1 + (this.dz) * scale / 2;

        // Note that the x, y, and z'o are completely out of place in the calculations,
        // because of p5'o weird left-hand 3D coordinate system.
        let theta = Math.atan2(this.dx, this.dz);      // theta = atan2(y / x)
        let phi = Math.acos(this.dy / this.len) / 2;   // phi = acos(z / r)

        // Calculate the axis of rotation. Note that the length of this vector doesn't matter.
        let x = Math.sin(phi) * Math.sin(theta);  // y = sin(phi) * sin(theta)
        let y = Math.cos(phi);                    // z = cos(phi)
        let z = Math.sin(phi) * Math.cos(theta);  // x = sin(phi) * cos(theta)
        this.v = this.s.createVector(x, y, z);

        this.len -= this.tipLen / 2;
    }

    // ----args list----
    // from, to
    // as in the ctor, the parameters should be in std coordinates.
    // It's this method's responsibility to convert to p5's coordinates.
    reset(args) {
        let r = false;
        if (args.from) {
            r = true;
            this.from = stdToP5(args.from);
        }
        if (args.to) {
            r = true;
            this.to = stdToP5(args.to);
        }
        if (r) {
            this.calcParam();
        }
    }

    resetP5(args) {    // the args are in P5 coordinates
        if (args.from) {
            this.from = args.from;
        }
        if (args.to) {
            this.to = args.to;
        }
        this.calcParam();
    }

    // ----args list----
    // from [in std coords], to [in std coords], duration [in frames], mode
    // in draw(), use: if (s.frameCount === getT(time.xxx)) s.variable.move();
    move(args) {
        // this is to fix the issue of not being able to move multiple times
        this.from_o = this.from_d || this.from;
        this.from_d = args.from ? stdToP5(args.from) : this.from;

        this.to_o = this.to_d || this.to;
        this.to_d = args.to ? stdToP5(args.to) : this.to;
        this.moved = true;
        let t = args.duration || frames(2);
        let m = args.mode === undefined ? 2 : args.mode;

        this.timer = new TimerFactory(t, m);
    }

    moving() {
        let t = this.timer.advance();
        this.resetP5({
            from: [
                this.from_o[0] + t * (this.from_d[0] - this.from_o[0]),
                this.from_o[1] + t * (this.from_d[1] - this.from_o[1]),
                this.from_o[2] + t * (this.from_d[2] - this.from_o[2]),],
            to: [
                this.to_o[0] + t * (this.to_d[0] - this.to_o[0]),
                this.to_o[1] + t * (this.to_d[1] - this.to_o[1]),
                this.to_o[2] + t * (this.to_d[2] - this.to_o[2]),]
        });
    }

    show(g) {
        if (this.moved) {
            this.moving();
        }

        g.push();

        // fixme: why would this line slow down the rendering significantly? (190116)
        //g.directionalLight(1, 1, 1, 0, 1, 0);

        // 2019-01-16
        // If I use fill(), then each fill must be followed by directionalLight(),
        // which is a really expensive method. On a canvas with 5 arrows, the FPS will
        // quickly drop to about 5. If I use specularMaterial, it has the same effect
        // as fill(), but I would only need to call directionalLight() and ambientLight()
        // once, in the Axes3D class, which greatly improves performance.
        g.noStroke();
        g.specularMaterial(this.color);

        g.translate(this.tx, this.ty, this.tz);
        g.rotate(this.s.PI, this.v); // frameCount / 77
        g.cylinder(this.radius, this.len);

        g.translate(0, this.len / 2, 0);
        g.cone(this.tipRadius, this.tipLen);
        if (this.label) {  // fixme: how to determine rotation based on the orientation of arrow?
            // if (this.dx > 0) {
            //     g.rotateZ(-this.s.PI / 2);
            // } else {
            //     g.rotateZ(this.s.PI / 2);
            // }
            this.fcn(g);

            g.model(this.label);
        }
        g.pop();
    }

}

/** 2019-01-02, 01-13
 * Plane3D (WEBGL)
 * A plane defined by (in standard coordinates):
 * (1) two basis vectors which span it, OR
 * (2) the general equation px + qy + rz = o (in case 1, o would be 0), OR
 * (3) the relation z = ax + by + c
 * // fixme: display will be weird when it'o steep
 *
 * ---- args list parameters ----
 * @mandatory (array[6]) M  **OR**  (number) p,q,r,o  **OR** (number) a,b,c
 * @optional (number) size, start [in frames], duration [in seconds]; (color) color;
 */
class Plane3D {
    constructor(ctx, args) {
        this.s = ctx;
        // an array in the form [a,b,c, d,e,f], representing 2 column vectors
        // coordinates should be in p5'o coordinate system
        if (args.mat) {
            this.M = stdToP5(args.mat);
        }

        this.a = args.a;
        this.b = args.b;
        this.c = args.c;

        this.o = args.o;
        this.p = args.p;
        this.q = args.q;
        this.r = args.r;

        this.color = args.color || this.s.color(255, 127);
        this.size = args.size || 400; // defaults to half the length of each axis on each direction

        this.calcParams();
        if (args.start !== undefined) {
            this.start = args.start;
            this.duration = args.duration || 1;
            this.timer = new Timer1(frames(this.duration));
        }
    }

    calcParams() {
        if (this.M) {
            // calculate the cross product of the two basis vectors
            this.p = this.M[1] * this.M[5] - this.M[2] * this.M[4];
            this.r = this.M[2] * this.M[3] - this.M[0] * this.M[5];
            this.q = this.M[0] * this.M[4] - this.M[1] * this.M[3];
            this.o = 0;
        }
        // calculate the line in the form z = ax + by + c
        if (this.M || this.p) {
            this.a = -this.p / this.r;
            this.b = -this.q / this.r;
            this.c = this.o / this.r;
        }

        // calculate the coordinates of vertices of this plane, in standard coordinate system
        this.xs = this.timer ? [this.size, this.size, this.size, this.size] :
            [this.size, -this.size, -this.size, this.size];
        this.ys = [this.size, this.size, -this.size, -this.size];
        this.zs = [];
        for (let i = 0; i < 4; i++) {
            // somehow, we need to flip the height for mode 1
            this.zs[i] = (this.a * this.xs[i] + this.b * this.ys[i] + this.c) * (this.M ? 1 : -1);
        }
    }

    showPlane(g) {
        //g.push();
        g.noStroke();
        g.fill(this.color);
        g.beginShape();
        if (this.timer !== undefined) {
            let t = this.s.frameCount > this.start ? this.timer.advance() : 0;
            this.xs[1] = this.xs[2] = this.size - t * this.size * 2;   // growing from x-direction
            for (let i = 0; i < 4; i++)
                this.zs[i] =
                    (this.a * this.xs[i] + this.b * this.ys[i] + this.c) * (this.M ? 1 : -1);
        }
        for (let i = 0; i < 4; i++) {
            g.vertex(this.xs[i], this.zs[i], this.ys[i]);
        }
        g.endShape(this.s.CLOSE);
        //g.pop();
    }
}
