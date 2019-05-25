// All util classes in one file

// +++---###---<<<       globals.js       >>>---###---+++
/******
 * Global variables / functions
 */

let fr = 30;  // frame rate

// canvas width. Set to 1200 normally, 1250 if want to monitor frame rate during recording
let cvw = 1200;

// canvas height. Ensure 16:9 ratio
let cvh = 675;

let scn = 2;  // scene number

// used for chapter 2, 3
let matrix = [1, 1, 1, -1, 1, 2];
let target = [-2, 0, 3];

let White = [255, 255, 255];
let Red = [255, 77, 97];
let Green = [77, 217, 77];
let Blue = [77, 177, 255];
let Yellow = [247, 227, 47];
let Orange = [247, 137, 27];

/*** Refactored 3D scenes on 2019-01-17
 *
 * Transforms from standard coordinates into p5'o coordinates,

 * Used for 3D scenes.
 * Transforms from standard coordinates into p5's coordinates (in the form of array),

 * so that the display of vectors, etc. is correct upon the x-y-z axes model.
 * Take care in using it, since sometimes (especially in classes),
 * the coordinates to convert is already converted to p5's system.
 * fixme: I wish JavaScript could have pass by reference so I could directly modify those values,
 * fixme: otherwise I have to return an array...
 *
 */
function stdToP5(a, b, c) {
    //if (a.length === undefined)

    if (a.length === 3) {
        return [a[1], -a[2], a[0]];   // x = y, y = -z, z = x
    } else if (a.length === 6) {      // 012 are column 1, 345 are column 2
        return [a[1], -a[2], a[0], a[4], -a[5], a[3]];
    } else if (a.length === 9) {      // 012 are ROW 1, 345 are row 2, 678 are row 3
        return [a[4], -a[5], a[3], -a[7], a[8], -a[6], a[1], -a[2], a[0]]; // fixme: weird...
    }
}

function p5ToStd(a) {
    if (a.length === 3) {
        return [a[2], a[0], -a[1]];   // x = z, y = x, z = -y
    } else if (a.length === 6) {
        return [a[2], a[0], -a[1], a[5], a[3], -a[4]];
    } else if (a.length === 9) {
        //return [a[6], a[7], a[8], a[0], a[1], a[2], -a[3], -a[4], -a[5]];
    }
}


/**
 * All animations are controlled by the number of frames passed.
 * since we might want to change the frame rate (the variable fr), it'o good to encapsulate this
 * into a new method, to be used each time we need to control the time.
 *
 * In case we want to slow down the animation play speed, we can modify this method to, say,
 * return Math.round(fr * sec * 2).
 *
 * @param sec
 * @returns {number}
 */
function frames(sec) {
    return Math.round(fr * sec);
}


/**
 * All 3D/2D scenes should call in s.setup()
 */
function setup3D(s) {
    s.frameRate(fr);
    s.pixelDensity(1);
    s.createCanvas(cvw, cvh);
}

function setup2D(s) {
    s.frameRate(fr);
    s.createCanvas(cvw, cvh);
}


/**
 * https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance
 *
 * If width is normal 1200, display FPS at upper-left position.
 * If width is monitor mode (1250), display FPS at upper-right where it'o not captured by camera.
 *
 */
function showFR(s) {
    const fps = s.frameRate();
    let pos = (cvw === 1200) ? 0 : 1200;
    s.fill(255);
    s.textSize(10);
    s.textAlign(s.LEFT, s.TOP);
    s.noStroke();
    s.text("FPS: " + fps.toFixed(1), pos, 10);
}

function deep_copy(x) {
    let y = [];
    for (let i = 0; i < x.length; i++) {
        y[i] = x[i];
    }
    return y;
}

function vector_multiply(x, mult) {
    let v = deep_copy(x);
    for (let i = 0; i < v.length; i++) {
        v[i] *= mult;
    }
    return v;
}

function vector_add(x, y) {
    let v = [];
    for (let i = 0; i < x.length; i++) {
        v[i] = x[i] + y[i];
    }
    return v;
}

function vector_subtract(x, y) {
    let v = [];
    for (let i = 0; i < x.length; i++) {
        v[i] = x[i] - y[i];
    }
    return v;
}

/**
 * 2D Starter Template
 */
const Scene00 = function(s) {
    let t = {

    };
    let tnr;
    s.preload = function() {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.d = new Dragger(s, []);
    };
    s.draw = function () {
        s.background(0);
        s.d.show();
    };
};

// +++---###---<<<       graphics.js       >>>---###---+++
/**
 * 2018/11/14, 12/22
 *
 * Experiment of the class hierarchy of my animation library. [NOW DEPRECATED--SEE PointBase]
 *
 * The hierarchy is broken down into 4 layers.
 * 1. the Graphics class:    the base class for all objects; defines a transparent canvas with
 *                           a width, a height and a (essentially pure virtual) show().
 * 2. generic Object class:  (optional) defines a general object such as an axis, a brain,
 *                           a collection of points, etc., that behaves on a single canvas.
 * 3. specific Object class: defines a specific object, with a show() that shows the animation
 *                           for object initialization. After the init animation is complete,
 *                           shows the full object on the screen.
 * 4. the Layer class:       responsible for setting up the object for a scene;
 *                           has a render() function that operates on the canvas
 *                           and calls image(this.g, ...).
 *
 * In setup(), we create the layers in the order from bottom layer to the top layer.
 * Finally, in draw(), we iterate through all layers and
 * call render() for canvas operations, then show() for object animations
 *
 * ----args list parameters----
 * @optional (number) w, h
 *
 * Due to a bug in p5.js, I will have to first create a canvas twice the original size,
 * and then use image() to render the scaled down version.
 * Otherwise, I will have to set pixelDensity(1), which dramatically decreases image resolution.
 *
 * @reference https://www.youtube.com/watch?v=pNDc8KXWp9E&t=529s
 */
class Graphics {         // the master of all classes
    constructor(ctx, args) {
        this.s = ctx;
        this.w = args.w || 1200;
        this.h = args.h || 675;
        this.g = this.s.createGraphics(this.w * 2, this.h * 2);
    }

    // this is to be overridden by 2nd/3rd level to show the animation
    show() {

    }

    // this may be overridden by 4th level to do operations on the canvas and display the image
    render() {
        this.s.image(this.g, 0, 0, this.w, this.h);
    }
}

/*** 2019-02-01 --- Major Refactoring
 * Base class for all objects defined by (x, y) position, as opposed to x1, y1, x2, y2 in a line
 *
 * This class is created to centralize the operation of moving and shifting of an object,
 * if the object's position is shown in draw(), instead of setup().
 *
 * shift() takes in relative target coordinates, while move() takes in absolute target position.
 *
 * ---- args list parameters ----
 * @optional (number) x, y, start [in frames], duration [in secs], end [in frames];
 */
class PointBase {
    constructor(ctx, args) {
        this.s = ctx;
        this.x = args.x || 0;
        this.y = args.y || 0;
        this.start = args.start || 30;
        this.start = Math.floor(this.start);
        this.duration = args.duration || 1;  // fixme
        this.end = args.end || 100000;
        this.end = Math.floor(this.end);
    }

    shift(x, y, duration, timerNum) {
        this.move(this.x + x, this.y + y, duration, timerNum);
    }

    /*** move(), 2019-02-01
     * Moves to a location with respect to the p5 coordinate
     * In s.draw(), use if (s.frameCount === [t]) [var].move(...);
     *
     * --- arg list ---
     * duration is in seconds, not frames
     */
    move(x, y, duration, timerNum) {
        this.xo = this.x;
        this.xd = x;
        this.yo = this.y;
        this.yd = y;
        this.moved = true;
        this.move_duartion = frames(1);
        if (duration)
            this.move_duartion = frames(duration);

        this.f = 0;
        this.move_timer = TimerFactory(this.move_duartion, timerNum);
    }

    moving() {
        if (this.f < this.move_duartion) {
            let t = this.move_timer.advance();
            this.x = this.xo + t * (this.xd - this.xo);
            this.y = this.yo + t * (this.yd - this.yo);
            this.f++;
        } else {
            this.moved = false;
        }
    }

    /*** shake(), 2019-02-17
     * Shake vertically as emphasis
     * In s.draw(), use if (s.frameCount === [t]) [var].shake(...);
     *
     * --- arg list ---
     * @param amp - amplitude in pixels
     * @param duration - in seconds
     */
    shake(amp, duration) {
        this.yo = this.y;
        this.amp = amp;
        this.shaked = true;
        this.move_duartion = frames(1);
        if (duration)
            this.move_duartion = frames(duration);
        this.f = 0;
        this.move_timer = new Timer2(this.move_duartion);
    }

    jump(amp, duration) {
        this.yo = this.y;
        this.amp = amp;
        this.jumped = true;
        this.move_duartion = frames(1);
        if (duration)
            this.move_duartion = frames(duration);
        this.f = 0;
        this.move_timer = new Timer2(this.move_duartion);
    }

    shaking() {
        if (this.f <= this.move_duartion) {
            let t = this.move_timer.advance() * this.s.TWO_PI;
            this.y = this.yo - this.amp * Math.sin(t);
            this.f++;
        } else {
            this.shaked = false;
        }
    }

    jumping() {
        if (this.f <= this.move_duartion) {
            let t = this.move_timer.advance() * this.s.PI;
            this.y = this.yo - this.amp * Math.sin(t);
            this.f++;
        } else {
            this.jumped = false;
        }
    }

    // to be called at the beginning of the show() function of derived classes
    // move() and shake() cannot happen at the same time
    showMove() {
        if (this.moved)
            this.moving();
        else if (this.shaked)
            this.shaking();
        else if (this.jumped)
            this.jumping();
    }

    show() {

    }
}

/*** 2019-04-17
 * Dragger
 * Used to help adjust the coordinates of objects.
 * todo: extend this to line-based objects, will make animating matrix transformations simpler
 *
 * You can pass in an array consisting of PointBase objects and/or PointBase arrays,
 * and call show() in s.draw(). Then, the coordinates of each registered object
 * will be shown on the screen. You can drag the objects to the desired locations and
 * see the value of their new coordinates, so you can adjust them in the code.
 *
 * This can be seen as an implementation of the Observer-Reactor Design Pattern?
 */
class Dragger {
    constructor(ctx, arr) {  // takes in an array of PointBase objects/arrays
        this.s = ctx;
        this.a = arr;
    }

    changePos(i) {
        let px = this.s.pmouseX, py = this.s.pmouseY;  // previous frame mouse locations
        let nx = this.s.mouseX, ny = this.s.mouseY;  // current frame mouse locations
        if (i.x - px > -7 && i.x - px < 7 && i.y - py > -7 && i.y - py < 7) {
            i.x = nx; // mouse is in the gray box, drag object to new position
            i.y = ny;
        }
    }

    showPos(i) {
        this.s.noStroke();
        this.s.fill(177);
        this.s.rect(i.x - 7, i.y - 7, 14, 14);
        this.s.textSize(17);
        this.s.textAlign(this.s.LEFT, this.s.TOP);
        this.s.text(i.x + ", " + i.y, i.x + 9, i.y - 7);
    }

    show() {
        for (let i of this.a) {
            if (i instanceof Array) {
                for (let j of i)
                    this.showPos(j);
            } else
                this.showPos(i);
        }
        if (this.s.mouseIsPressed) {
            for (let i of this.a) {
                if (i instanceof Array) {
                    for (let j of i)
                        this.changePos(j);
                } else
                    this.changePos(i);
            }
        }
    }
}

// +++---###---<<<       3d.js       >>>---###---+++
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


// +++---###---<<<       text.js       >>>---###---+++
// refactored on 2019-01-20, 02-01
class TextBase extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        // I originally used the usual syntax of args.x || width / 2,
        // but this would not work if 0 is passed in as x
        this.rotation = args.rotation || 0;
    }

    reset(args) {
        this.x = args.x || this.x;
        this.y = args.y || this.y;
    }
    // move() merged into parent class
}


/*** 2019-01-04
 * Text
 * Needs to declare a font variable and set font = loadFont('../lib/font/times.ttf') in preload()
 * There should not be a global variable named text.
 * For mode 0 (default), the x and y define the coordinates for the upper-left corner of the text.
 * For mode 1, the x and y define the center for the text.
 * For mode 2, the x and y define the upper-right corner for the text.
 * For the base class, no init animation is displayed.
 *
 * If want init animation, use a derived class, TextFade, or TextWriteIn.
 * If want sudden appearance/disappearance, use this class and pass in start and/or end.
 *
 * ---- args list parameters ----
 * @mandatory (string) str; (number) x, y; (p5.Font) font
 * @optional (number) mode, size, start, end, strokeweight; (array) color, stroke
 */
class Text extends TextBase {
    constructor(ctx, args) {
        super(ctx, args);

        this.font = args.font;
        this.str = args.str;
        this.mode = args.mode || 0;
        this.color = args.color || [255, 255, 255];
        this.ft = new FillChanger(ctx, this.color);
        this.stroke = args.stroke || undefined;
        this.sw = args.strokeweight || 1.7;

        this.size = args.size || 37;
    }

    // works the same way as move()
    reColor(color, duration) {
        this.ft.reColor(color, duration);
    }

    move(x, y, duration, timerNum, size) {
        super.move(x, y, duration, timerNum);
        this.so = this.size;
        this.sn = size || this.size;
    }

    moving() {
        super.moving();
        this.size = this.so + this.move_timer.t * (this.sn - this.so);
    }

    shaking() {
        super.shaking();
        if (this.mode === 1)   // changing size only works if text is in the center
            this.size += Math.sin(this.move_timer.t * this.s.TWO_PI) * this.amp * 0.27;
    }

    jumping() {
        super.jumping();
        if (this.mode === 1)
        // the integral of sin(2*PI*x) over 0 to 2*PI is 0, so position doesn't change
            this.size += Math.sin(this.move_timer.t * this.s.TWO_PI) * this.amp * 0.27;
    }

    // works the same way as move
    change(str, duration) {
        // todo
        this.reset({ str: str });
    }

    reset(args) {
        this.x = args.x || this.x;
        this.y = args.y || this.y;
        this.size = args.size || this.size;
        this.str = args.str || this.str;
    }

    showSetup() {
        if (this.font)
            this.s.textFont(this.font);

        if (this.mode === 0) {
            this.s.textAlign(this.s.LEFT, this.s.TOP);
        } else if (this.mode === 1) {
            this.s.textAlign(this.s.CENTER, this.s.CENTER);
        } else if (this.mode === 2) {
            this.s.textAlign(this.s.RIGHT, this.s.TOP);
        } else if (this.mode === 3) {  // center-right
            this.s.textAlign(this.s.LEFT, this.s.CENTER);
        } else if (this.mode === 4) {  // center-right
            this.s.textAlign(this.s.RIGHT, this.s.CENTER);
        }
        this.s.textSize(this.size);
        this.ft.advance();  // show color

        if (this.stroke) {
            this.s.strokeWeight(this.sw);
            this.s.stroke(this.stroke);
        } else
            this.s.noStroke();
        this.showMove();
    }

    show() {
        if (this.s.frameCount >= this.start && this.s.frameCount < this.end) {
            this.showSetup();
            this.s.fill(this.color);

            this.s.text(this.str, this.x, this.y);
        }
    }
}

/** Refactored on 2019-04-25
 * TextFade
 *
 * Capable of displaying Fade-In and/or Fade-Out animations
 *
 * ---- args list parameters ----
 * @mandatory (string) str; (number) x, y; (p5.Font) font
 * @optional (number) mode, size, start [in frames, not seconds], duration [in seconds];
 *           (array) color [should be an array]
 */
class TextFade extends Text {
    constructor(ctx, args) {
        super(ctx, args);
        this.initC = deep_copy(this.color);
        this.initC[3] = 0;
        if (this.color[3] === undefined)
            this.color[3] = 255;
        this.ft = new FillChanger(ctx, this.initC);

        this.duration = args.duration || 0.7;
        this.timer = new Timer0(frames(this.duration));
    }

    show() {
        if (this.s.frameCount >= this.start - 1) {
            if (this.s.frameCount === this.start)
                this.ft.reColor(this.color, this.duration);
            else if (this.s.frameCount === this.end)
                this.ft.fadeOut(this.duration);

            this.showSetup();
            this.s.text(this.str, this.x, this.y);
        }

    }

}

// does not yet support fade out
class TextWriteIn extends Text {
    constructor(ctx, args) {
        super(ctx, args);
        this.frCount = 0;
        this.len = this.str.length;
        this.txt = "";
    }
    show() {
        if (this.s.frameCount >= this.start) {
            this.showSetup();
            if (this.frCount < this.len) {
                this.txt += this.str[this.frCount];
                this.frCount++;
            }
            this.s.text(this.txt, this.x, this.y);
        }
    }
}

/***
 * todo
 */
class TextRoll extends TextFade {
    constructor(ctx, args) {
        super(ctx, args);
    }

    /**
     * @param str - could be a number
     */
    roll(str) {
        this.reset({ str: "" + str });
    }

    rolling() {

    }
}


/*** 2018-12-23
 * Katex
 * Base class for all math text objects. These are displayed directly as texts on the browser,
 * so I cannot do any animations on them except moving the position, changing the opacity, etc.
 * Requires the p5.dom.js and katex.js libraries.
 *
 * The color of the text defaults to white. To reColor color, use \\textcolor{}{...} inside args.text
 *
 * Refactor on 2019-04-10: if need fade in/out animations, no longer need to pass in
 * the bool values fadeIn and fadeOut
 *
 * ----args list parameters----
 * @mandatory (string) text/str--the string to display;
 * @optional (number) start--if display fade in animation, the frame to start animation (nonzero);
 *           (number) font_size, x, y, id; (string) color--note it's a string starting with '#';
 *           (number) end--if display fade out animation, the frame to start animation;
 *           (number) rotation--in degrees
 */
class Katex extends TextBase {
    constructor(ctx, args) {
        super(ctx, args);

        this.text = args.text || args.str;
        this.size = args.font_size || 37;
        this.color = args.color || '#fff';
        this.domId = args.id || 'KATEX-' + parseInt(Math.random().toString().substr(2)); // Rand ID
        this.canvasPos = ctx.canvas.getBoundingClientRect();

        this.k = this.s.createP('');
        this.k.style('color', this.color);
        this.k.style('font-size', this.size + 'px');
        this.k.id(this.domId);

        if (args.fadeIn === true || args.start !== undefined) {
            this.start = args.start || frames(1);
            this.timer = new Timer0(frames(0.7));
            this.k.style('opacity', 0);
        }
        if (args.fadeOut === true || args.end !== undefined) {
            this.end = args.end || frames(100);
            this.timer2 = new Timer0(frames(0.7));
        }
    }

    /*** Refactored on 2019-02-04
     * The show() now takes in the optional parameters x, y.
     * Otherwise if I have a group of Katex objects stored in a class
     * that need to move in the same manner, I will have to reset them one by one.
     * Now I can just inherit that class of a group of Katex's from PointBase, and call
     * show(this.x, this.y) on each Katex object. No need to move the Katex's one by one now.
     */
    show(x, y) {
        this.showMove();
        if (x !== undefined) {
            this.k.position(x + this.canvasPos.x, y + this.canvasPos.y);  // todo: refactor for chap 5
        } else {
            // Based on the canvas position in the DOM
            this.k.position(this.x + this.canvasPos.x, this.y + this.canvasPos.y);
        }
        this.k.style('rotate', this.rotation);

        if ((this.timer !== undefined) && this.s.frameCount > this.start) {
            this.k.style('opacity', this.timer.advance());
        }
        if ((this.timer2 !== undefined) && this.s.frameCount > this.end) {
            this.k.style('opacity', 1 - this.timer2.advance());
        }
        katex.render(this.text, window[this.domId]);
    }
}



// +++---###---<<<       timer.js       >>>---###---+++
/**** 2018-11-20, 12-22
 * the Timer class
 * Used to animate object initialization with acceleration and/or deceleration
 * in a given number of frames.
 * this.t is used to indicate progress; it'o 0 at the start and gradually steps to 1 at the end.
 * advance() advances a time step and returns the "progress", this.t.
 *
 * Calculus is used to determine the "velocity".
 */

class Timer {
    constructor(frames) {
        this.frames = frames;
        this.f = 1;
        this.t = 0;
    }

    advance() {
    }  // to be overridden
}

/*** Timer0
 * constant speed
 */
class Timer0 extends Timer {
    constructor(frames) {
        super(frames);
        this.v = 1 / frames;
    }

    advance() {
        this.f++;
        if (this.t < 0.99) {
            this.t += this.v;
        }
        return this.t;
    }
}

/*** Timer1
 * keep decelerating
 */
class Timer1 extends Timer {
    constructor(frames) {
        super(frames);
        this.a = -2 / (frames * frames);

        // Since time is updated before velocity is updated, the integral is a left Riemann Sum,
        // so in the end this.t will be larger than expected (smaller if use the right Riemann Sum).
        // To get around this, reduce initial velocity by exactly 1/frames^2.
        // This way this.t will end up at 1.
        this.v = 2 / frames - 1 / (frames * frames);
    }

    advance() {
        // seems that controlling the end result purely through calculus may render this.t
        // not exactly 1 at the end of animation. So we need to force it to 1.
        if (this.f >= this.frames)
            return 1;

        if (this.v > 0) {
            this.t += this.v;
            this.v += this.a;
        }
        (this.f)++;
        return this.t;
    }
}

/** Timer2
 * accelerate then decelerate
 */
class Timer2 extends Timer {
    constructor(frames) {
        super(frames);
        this.v = 0;
        this.a = 4 / (frames * frames);
    }

    advance() {
        // seems that controlling the end result purely through calculus may render this.t
        // not exactly 1 at the end of animation. So we need to force it to 1.
        if (this.f > this.frames)
            return 1;

        if (this.t < 0.5) {
            this.t += this.v;
            if (this.t < 0.5) {  // fixme
                this.v += this.a;
            }
        } else if (this.v > 0) {
            this.v -= this.a;
            this.t += this.v;
        }

        (this.f)++;
        return this.t;
    }
}

/*** 2019-02-01
 * This Factory function is responsible for constructing the appropriate timer class
 * Default is return Timer2
 */
function TimerFactory(frames, mode) {
    if (mode === 0) {
        return new Timer0(frames);
    } else if (mode === 1) {
        return new Timer1(frames);
    } else if (mode === 2) {
        return new Timer2(frames);
    } else {
        return new Timer2(frames);
    }
}

/*** 2019-02-18
 * This timer is responsible for setting the stroke weight value and
 * displaying fade out animations for line-like objects.
 *
 * --- arg list ---
 * ctx - the p5 object
 * end - time to start fade out animations (in frames)
 * strokeWeight
 * duration - the duration of fade out anim (in seconds)
 */
class StrokeWeightTimer {
    constructor(ctx, end, strokeWeight, duration) {
        this.s = ctx;
        this.end = end;
        this.sw = strokeWeight || 4;
        this.duration = duration || 1;
        this.timer = new Timer0(frames(this.duration));
    }

    advance() {
        if (this.s.frameCount <= this.end) {
            this.s.strokeWeight(this.sw);
        } else {
            // fixme: 1.00001 is used since strokeWeight(0) will produce incorrect behavior
            this.s.strokeWeight(this.sw * (1.00001 - this.timer.advance()));
        }
    }
}

/*** 2019-04-23
 * THIS CLASS SHOULD NOT BE USED. ONLY USE ITS DERIVED CLASS, StrokeChanger OR FillChanger
 *
 * This timer is responsible for setting the stroke/fill value and
 * displaying color change for objects, via change(), which behaves like move().
 */
class ColorChanger {
    constructor(ctx, initColor) {
        this.s = ctx;
        this.color = initColor || [255, 255, 255, 255];
    }

    fadeOut(duration) {
        let c = deep_copy(this.color);
        this.color[3] = this.color[3] !== undefined ? this.color[3] : 255;
        c[3] = 0;
        this.reColor(c, duration);
    }

    reColor(newColor, duration) {
        this.co = this.color;
        this.cd = newColor;
        this.changed = true;
        this.f = 0;
        this.duartion = frames(1);
        if (duration)
            this.duartion = frames(duration);
        this.timer = new Timer0(this.duartion);
    }

    changing() {
        if (this.f < this.duartion) {
            let t = this.timer.advance();
            let o = this.co;
            let d = this.cd;
            if (this.color[3] === undefined) {
                this.color =
                    [o[0] + t * (d[0] - o[0]), o[1] + t * (d[1] - o[1]), o[2] + t * (d[2] - o[2])];
            } else {
                this.color = [o[0] + t * (d[0] - o[0]), o[1] + t * (d[1] - o[1]),
                    o[2] + t * (d[2] - o[2]), o[3] + t * (d[3] - o[3])];
            }
            this.f++;
        } else
            this.changed = false;
    }
}


class StrokeChanger extends ColorChanger {
    constructor(ctx, initColor) {
        super(ctx, initColor);
    }

    advance() {
        if (this.changed)
            this.changing();
        this.s.stroke(this.color);
    }
}

class FillChanger extends ColorChanger {
    constructor(ctx, initColor) {
        super(ctx, initColor);
    }

    advance() {
        if (this.changed)
            this.changing();
        this.s.fill(this.color);
    }
}

// +++---###---<<<       utils.js       >>>---###---+++
/** SUMMARY OF CLASSES
 * '-' is-a relationship; '<' has-a relationship
 *
 * HelperGrid
 * Axes
 * - Grid
 *
 * Rect
 * - Emphasis
 *
 * Line
 * - LineCenter
 * - DottedLine
 * - Arrow
 *
 * Table < LineCenter
 */


/** 2018-12-20
 * HelperGrid
 * This acts like a scaffold, and helps me find out the coordinates of the objects in a scene.
 * It is removed when the movie is actually rendered.
 */
class HelperGrid {
    constructor(ctx, args) {
        this.s = ctx;
        this.w = ctx.width || width;
        this.h = ctx.height || height;
    }

    show() {
        this.s.strokeWeight(1);

        // draw horizontal helper lines
        this.s.stroke(137);
        for (let i = 100; i < this.w; i += 200) {
            this.s.line(i, 0, i, this.h);
        }
        this.s.stroke(255);
        for (let i = 200; i < this.w; i += 200) {
            this.s.line(i, 0, i, this.h);
        }
        this.s.stroke(57);
        for (let i = 50; i < this.w; i += 100) {
            this.s.line(i, 0, i, this.h);
        }

        // draw vertical lines
        this.s.stroke(137);
        for (let i = 100; i < this.w; i += 200) {
            this.s.line(0, i, this.w, i);
        }
        this.s.stroke(255);
        for (let i = 200; i < this.w; i += 200) {
            this.s.line(0, i, this.w, i);
        }
        this.s.stroke(57);
        for (let i = 50; i < this.w; i += 100) {
            this.s.line(0, i, this.w, i);
        }
    }
}


/** 2018-12-23
 * Axes
 * Contains two arrows. If labelX and labelY are passed in, this class would be a singleton.
 * To be displayed correctly, labelX and labelY should contain only 1 character.
 *
 * ---- args list parameters ----
 * @optional (number) top, bottom, left, right, centerX, centerY, stepX, stepY;
 *           (string) labelX, labelY, (number) offsetX, offsetY
 */
class Axes {
    constructor(ctx, args) {
        this.s = ctx;
        //this.showLabel = args.showLabel || false;  // show numerical labels

        // the following parameters define the scope of the plot'o grid lines on the canvas
        // NOTE: top and left must be a multiple of 50
        this.top = args.top || 0;
        this.left = args.left || 0;
        this.bottom = args.bottom || ctx.height || height;
        this.right = args.right || ctx.width || width;

        // define the origin'o x and y coordinates on the canvas
        this.centerX = args.centerX || ctx.width / 2 || width / 2;
        this.centerY = args.centerY || ctx.height / 2 || height / 2;

        // define how many pixels correspond to 1 on each axis
        this.stepX = args.stepX || 100;
        this.stepY = args.stepY || 100;

        this.start = args.start || 0;

        if (args.labelX) {
            this.offsetX = args.offsetX || -27;  // default offset value based on displaying x
            this.label1 = new Katex(this.s, {
                text: args.labelX,
                x: this.right + this.offsetX, y: this.centerY - 95,
                fadeIn: true, start: this.start,
            });
        }
        if (args.labelY) {
            this.offsetY = args.offsetY || -47;  // default offset value based on displaying y
            this.label2 = new Katex(this.s, {
                text: args.labelY,
                x: this.centerX + 14, y: this.top + this.offsetY,
                fadeIn: true, start: this.start,
            })
        }

        this.xAxis = new Arrow(this.s, {
            x1: this.left, x2: this.right, y1: this.centerY, y2: this.centerY,
            frames: frames(6), start: this.start
        });

        this.yAxis = new Arrow(this.s, {
            x1: this.centerX, x2: this.centerX, y1: this.bottom, y2: this.top,
            frames: frames(6), start: this.start
        });
    }

    showAxes() {
        this.xAxis.show();
        this.yAxis.show();
        if (this.label1) this.label1.show();
        if (this.label2) this.label2.show();
    }
}

/** 2018-12-21
 * Grid
 * A grid similar to what 3b1b used throughout the EOLA series
 * in the derived class'o show(), need to call showGrid()
 *
 *  * ---- args list parameters ----
 * @optional (number) top, bottom, left, right, centerX, centerY, stepX, stepY
 */
class Grid extends Axes {
    constructor(ctx, args) {
        super(ctx, args);

        this.spacing = args.spacing || 50;

        this.maxNumLines = 0;
        this.gridlineup = [];    // y-coords of grid lines above the x-axis
        this.gridlinedown = [];  // y-coords of grid lines below the x-axis
        this.gridlineleft = [];  // x-coords of grid lines left of y-axis
        this.gridlineright = []; // x-coords of grid lines right of y-axis
        for (let i = 0, y = this.centerY - this.spacing; y > this.top; i++, y -= this.spacing) {
            this.gridlineup[i] = y;
            if (i > this.maxNumLines)
                this.maxNumLines = i;
        }
        for (let i = 0, y = this.centerY + this.spacing; y < this.bottom; i++, y += this.spacing) {
            this.gridlinedown[i] = y;
            if (i > this.maxNumLines)
                this.maxNumLines = i;
        }
        for (let i = 0, x = this.centerX - this.spacing; x > this.left; i++, x -= this.spacing) {
            this.gridlineleft[i] = x;
            if (i > this.maxNumLines)
                this.maxNumLines = i;
        }
        for (let i = 0, x = this.centerX + this.spacing; x < this.right; i++, x += this.spacing) {
            this.gridlineright[i] = x;
            if (i > this.maxNumLines)
                this.maxNumLines = i;
        }
        this.maxNumLines++;

        this.timer = [];
        for (let i = 0; i < this.maxNumLines; i++) {
            this.timer[i] = new Timer2(frames(0.5));
        }

    }

    showGrid() {
        this.showAxes();
        for (let i = 0; i < this.maxNumLines; ++i) {
            this.s.strokeWeight(2);
            if (this.s.frameCount - this.start - frames(1) > i * 2) {
                if (i % 2 === 1) {  // major grid line
                    this.s.stroke(27, 177, 247);
                } else {    // minor grid line
                    this.s.stroke(17, 67, 77);
                }
                //stroke(27, 177, 247);

                let t = this.timer[i].advance();
                let right = this.left + (this.right - this.left) * t;
                let top = this.bottom + (this.top - this.bottom) * t;

                if (i < this.gridlineup.length) {
                    let y = this.gridlineup[i];
                    this.s.line(this.left, y, right, y);
                }
                if (i < this.gridlinedown.length) {
                    let y = this.gridlinedown[i];
                    this.s.line(this.left, y, right, y);
                }
                if (i < this.gridlineleft.length) {
                    let x = this.gridlineleft[i];
                    this.s.line(x, this.bottom, x, top);
                }
                if (i < this.gridlineright.length) {
                    let x = this.gridlineright[i];
                    this.s.line(x, this.bottom, x, top);
                }
            }
        }
    }
}

/** 2018-12-20,22
 * Plot
 * Contains a bunch of points, in addition to the axes
 * Can also derive from the Grid class
 * Capable of calculating the least square line of the points, and displaying the line
 *
 * ---- args list parameters (in addition to axes) ----
 * xs, ys, startLSLine, startPt, lineColor,
 * [If want to show labels:] ptLabel: true, font: tnr
 */
class Plot extends Axes {
    // 2019-01-07: after refactoring, don't need to load a csv file, data is passed in as two arrays
    constructor(ctx, args) {
        super(ctx, args);
        //this.showLabel = args.showLabel || false;  // show numerical labels

        // the x- and y- coordinates of all the points are stored in two separate arrays
        // Xs and Ys are the original coordinates
        // ptXs and ptYs store the transformed version: the coordinates on the canvas
        this.numPts = args.xs.length;

        // time to start displaying least squares line
        this.startLSLine = args.startLSLine || this.start + frames(1);
        this.startPt = args.startPt || this.start;

        this.Xs = args.xs;
        this.Ys = args.ys;
        this.ptXs = [];
        this.ptYs = [];
        this.calcCoords();
        this.points = [];
        for (let i = 0; i < this.numPts; i++) {
            this.points[i] = args.ptLabel ? new PlotPoint(this.s, {
                x: this.ptXs[i], y: this.ptYs[i], radius: 12, val: this.Ys[i], font: args.font,
                start: this.startPt + i * frames(1) / this.numPts
            }) : new Point(this.s, {
                x: this.ptXs[i], y: this.ptYs[i], radius: 12,
                start: this.startPt + i * frames(1) / this.numPts  // display all points in 1 second
            });
        }
        // calculate the parameters for displaying the least squares line on the canvas
        this.calcParams();

        this.LSLine = new Line(this.s, {
            x1: this.left,
            x2: this.right,
            y1: this.y_intercept + this.beta * (this.centerX - this.left),
            y2: this.y_intercept - this.beta * (this.right - this.centerX),
            color: args.lineColor || this.s.color(77, 177, 77),
            strokeweight: 3,
            start: this.startLSLine
        });
    }

    calcCoords() {
        for (let i = 0; i < this.numPts; i++) {
            this.ptXs[i] = this.centerX + this.Xs[i] * this.stepX;
            this.ptYs[i] = this.centerY - this.Ys[i] * this.stepY;
        }
    }

    avgxs() {
        let sum = 0;
        for (let i = 0; i < this.numPts; ++i) {
            sum += this.Xs[i];
        }
        return sum / this.numPts;
    }

    avgys() {
        let sum = 0;
        for (let i = 0; i < this.numPts; ++i) {
            sum += this.Ys[i];
        }
        return sum / this.numPts;
    }

    // calculate the parameters, and the coordinates of least squares line
    // formula: beta = (sum of xi * yi - n * coordX * coordY) / (sum of xi^2 - n * coordX^2)
    calcParams() {
        this.avgX = this.avgxs();
        this.avgY = this.avgys();

        let sumXY = 0, sumXsq = 0;
        for (let i = 0; i < this.numPts; i++) {
            sumXY += this.Xs[i] * this.Ys[i];
            sumXsq += this.Xs[i] * this.Xs[i];
        }
        this.beta = (sumXY - this.numPts * this.avgX * this.avgY)
            / (sumXsq - this.numPts * this.avgX * this.avgX);

        this.beta_0 = this.avgY - this.beta * this.avgX;

        this.y_intercept = this.centerY - this.beta_0 * this.stepY;
        this.coordX = this.centerX + this.avgX * this.stepX;
        this.coordY = this.centerY - this.avgY * this.stepY;
    }

    showPoints() {
        for (let i = 0; i < this.numPts; ++i) {
            this.points[i].show();
        }
    }
}

/** 2018-12-23
 * Point
 * Capable of displaying init animations of the point
 *
 * ----args list parameters----
 * @mandatory (number) x, y
 * @optional (number) radius, start; (array) color
 */
class Point {
    constructor(ctx, args) {
        this.s = ctx;
        this.x = args.x;
        this.y = args.y;
        this.radius = args.radius || 10;
        this.start = args.start || 0;
        this.color = args.color || [255, 255, 0];

        this.timer = new Timer1(frames(0.7));
        this.t = 0;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
    }

    show() {
        if (this.s.frameCount > this.start) {
            this.t = this.timer.advance();

            // draw the contour
            this.s.noFill();
            this.s.stroke(255, 0, 0);
            this.s.strokeWeight((1 - this.t) * this.radius / 3);
            this.s.arc(this.x, this.y, this.radius, this.radius, 0, this.t * this.s.TWO_PI);

            // draw the ellipse
            this.s.noStroke();
            this.s.fill(this.color[0], this.color[1], this.color[2], 255 * this.t);
            this.s.ellipse(this.x, this.y, this.radius, this.radius);
        }
    }
}

// extra args: val, font
class PlotPoint extends Point {
    constructor(ctx, args) {
        super(ctx, args);
        this.txt = new TextFade(ctx, {
            str: args.val, font: args.font, mode: 1, size: 27,
            x: this.x, y: this.y - 27, start: this.start
        })
    }
    show() {
        super.show();
        this.txt.show();
    }
}

/** 2018-12-23
 * A rectangle, with fade-in and fade-out animations
 *
 * ----args list parameters----
 * @mandatory (number) x, y, w, h
 * @optional (number) start, end; (array) color
 */
class Rect extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.w = args.w;
        this.h = args.h;

        this.color = args.color || [255, 255, 255, 255];

        // timer for displaying start and end animations, respectively
        this.timer = new Timer0(frames(this.duration));  // fixme: use Timer1?
        this.timer2 = new Timer1(frames(this.duration));
        this.t = 0;
    }

    reset(args) {
        this.x = args.x || this.x;
        this.y = args.y || this.y;
        this.w = args.w || this.w;
        this.h = args.h || this.h;
    }

    // sets stroke and the t value
    showSetup() {
        this.s.noStroke();
        if (this.s.frameCount > this.start) {
            this.t = this.timer.advance();
        }
        if (this.s.frameCount > this.end) {
            this.t = 1 - this.timer2.advance();
        }
    }

    show() {
        this.showSetup();
        this.s.fill(this.color[0], this.color[1], this.color[2], this.color[3] * this.t);
        this.s.rect(this.x, this.y, this.w, this.h);
    }
}

/** 2018-12-22
 * Emphasis
 * Essentially a shiny rectangle under the text or formula we want to emphasize
 *
 * ----args list parameters----
 * @mandatory (number) x, y, w, h
 * @optional (number) start, end; (color) color // fixme: I should change all to array at some time
 */
class Emphasis extends Rect {
    constructor(ctx, args) {
        super(ctx, args);
        this.s = ctx;
        this.duration = 0.5;
        this.timer = new Timer1(frames(this.duration));  // the duration went wrong
        this.timer2 = new Timer1(frames(this.duration));

        this.end = args.end || 10000;
        this.color = args.color || this.s.color(107, 107, 17, 177);
    }

    show() {
        this.showSetup();
        this.s.fill(this.color);
        this.s.rect(this.x, this.y, this.w * this.t, this.h);
    }
}

/** 2018-12-23, 2019-01-27
 * A line that can show initialization animation
 * The init animation shows the line going from (x1, y1) to (x2, y2);
 * The end animation shows the line's stroke weight decreasing to 0.
 *
 * to show the line growing from the center point, use LineCenter
 *
 * ----args list parameters----
 * @mandatory (number) x1, y1, x2, y2;
 * @optional (array) color;
 *           (number) start, duration, end, strokeweight, mode [defines which timer to use]
 */
class Line {
    constructor(ctx, args) {
        this.s = ctx;
        this.x1 = args.x1 || 0;
        this.y1 = args.y1 || 0;
        this.x2 = args.x2 || 0;
        this.y2 = args.y2 || 0;
        this.duration = args.duration || 1;
        //this.mode = args.mode || 2;

        // starting frame for initialization animation
        this.start = args.start || 1;
        this.strokeweight = args.strokeweight || 3;
        this.st = new StrokeChanger(this.s, args.color);

        this.timer = new TimerFactory(frames(this.duration), args.mode);

        this.end = args.end || 100000;
        this.timer_sw = new StrokeWeightTimer(this.s, this.end, this.strokeweight, 0.7);
    }

    // 2019-03-19: copied from the Bracket class
    shift(x1, y1, x2, y2, duration) {
        let na = {
            x1: this.x1 + x1, x2: this.x2 + x2, y1: this.y1 + y1, y2: this.y2 + y2,
            duration: duration
        };
        this.move(na);
    }

    // ----args list----
    // x1, x2, y1, y2, duration (in seconds), mode (for timer), color (array)
    // in draw(), use: if (s.frameCount === getT(time.xxx)) s.variable.move();
    move(args) {
        this.x1o = this.x1;
        this.x2o = this.x2;
        this.y1o = this.y1;
        this.y2o = this.y2;
        this.x1d = args.x1 || this.x1;
        this.x2d = args.x2 || this.x2;
        this.y1d = args.y1 || this.y1;
        this.y2d = args.y2 || this.y2;
        this.moved = true;
        let t = args.duration || 1;
        let m = args.mode === undefined ? 2 : args.mode;

        this.move_timer = new TimerFactory(frames(t), m);
    }

    moving() {
        let t = this.move_timer.advance();
        this.reset({
            x1: this.x1o + t * (this.x1d - this.x1o), x2: this.x2o + t * (this.x2d - this.x2o),
            y1: this.y1o + t * (this.y1d - this.y1o), y2: this.y2o + t * (this.y2d - this.y2o),
        })
    }

    reset(args) {
        this.x1 = args.x1 || this.x1;
        this.y1 = args.y1 || this.y1;
        this.x2 = args.x2 || this.x2;
        this.y2 = args.y2 || this.y2;
    }

    showSetup() {
        this.st.advance();
        this.timer_sw.advance();
        if (this.moved)
            this.moving();
    }

    show() {
        if (this.s.frameCount > this.start) {
            this.showSetup();
            let t = this.timer.advance();
            this.s.line(this.x1, this.y1,
                this.x1 + (this.x2 - this.x1) * t, this.y1 + (this.y2 - this.y1) * t);
        }
    }
}

/** 2019-01-07
 * LineCenter
 * A line that grows from midpoint instead of (x1, y1)
 * Note that this class uses Timer1
 */
class LineCenter extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.xm = this.x1 + (this.x2 - this.x1) / 2;
        this.ym = this.y1 + (this.y2 - this.y1) / 2;
    }

    reset(args) {
        super.reset(args);
        this.xm = this.x1 + (this.x2 - this.x1) / 2;
        this.ym = this.y1 + (this.y2 - this.y1) / 2;
    }

    show() {
        if (this.s.frameCount > this.start) {
            this.showSetup();
            let t = this.timer.advance();
            this.s.line(this.xm + (this.x1 - this.xm) * t, this.ym + (this.y1 - this.ym) * t,
                this.xm + (this.x2 - this.xm) * t, this.ym + (this.y2 - this.ym) * t);
        }
    }
}

/*** 2019-01-12
 * LineStd
 * A line with parameters a, b, c that define its equation ax + by = c.
 * It is drawn on top of Axis / Grid, so also need to pass in the
 */
class LineStd extends Line {

}

/** 2018-12-23
 * DottedLine, a line like - - - -
 *
 * fixme: can only display from left to right/top to bottom; cannot display diagonally
 *
 * ----args list parameters----
 * @mandatory (number) x1, y1, x2, y2;
 * @optional (color) color; (number) start, spacing, strokeweight
 */
class DottedLine extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.spacing = args.spacing || 17;

        this.w = this.x2 - this.x1;
        this.h = this.y2 - this.y1;
        this.len = Math.sqrt(this.w * this.w + this.h * this.h);
        this.dx = this.w / this.len * this.spacing;
        this.dy = this.h / this.len * this.spacing;
    }

    show() {
        let x = this.x1;
        let y = this.y1;
        if (this.s.frameCount > this.start) {
            let t = this.timer.advance();
            let xEnd = this.x1 + this.w * t;
            let yEnd = this.y1 + this.h * t;

            // I put an "or" here, otherwise if line is vertical the loop never enters
            while (x < xEnd || y < yEnd) {  // fixme: originally y < yEnd
                let x0 = x + this.dx;
                let y0 = y + this.dy;
                // Same: I put an "or" here, otherwise if line is vertical there won't be smoothness
                if (x0 > xEnd || y0 > yEnd) {
                    x0 = xEnd;
                    y0 = yEnd;
                }
                this.showSetup();
                this.s.line(x, y, x0, y0);
                x += 2 * this.dx;  // this 2 is arbitrary
                y += 2 * this.dy;
            }
        }
    }
}


/** 2018-12-20,21; 2019-01-26
 * Arrow
 * There are two different init animations: default, or fade in
 * If needs fade in animation, need to pass in fadeIn: true, colorArr: [...]
 *
 * Since changing the opacity of the object can only be done when color is an array.
 * At this point it's almost impossible to refactor the parent class so that Line takes in
 * an array as argument for this.color
 *
 * Can also display fade out animation if end is passed in
 *
 * ----args list parameters----
 * @mandatory (number) x1, x2, y1, y2, start
 * @optional (color) colors; (number) strokeweight, tipLen, tipAngle, duration;
 *           (bool) fadeIn, start, end, (array) colorArr
 */
class Arrow extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.duration = args.duration || 1;

        this.fadeIn = args.fadeIn || false;
        if (this.fadeIn) {
            this.colorArr = args.colorArr || [255, 255, 255];
            this.timer = new Timer0(frames(this.duration));
        } else {
            this.timer = new Timer2(frames(this.duration));
        }
        //this.fadeOut = args.fadeOut || false;

        // define tip length/angle for all vectors on this canvas
        this.tipLen = args.tipLen || 15;
        this.tipAngle = args.tipAngle || 0.4;  // this is in radians

        let t = Arrow.setArrow(this.x1, this.y1, this.x2, this.y2, this.tipLen, this.tipAngle);
        this.x3 = t[0];
        this.y3 = t[1];
        this.x4 = t[2];
        this.y4 = t[3];
    }

    // reset the start and end points of the arrow
    reset(args) {
        super.reset(args);
        let t = Arrow.setArrow(this.x1, this.y1, this.x2, this.y2, this.tipLen, this.tipAngle);
        this.x3 = t[0];
        this.y3 = t[1];
        this.x4 = t[2];
        this.y4 = t[3];
    }


    // I could have used arctan() to first obtain the angle of the arrow, then calculate the
    // angle of the two line segments, and finally get their coordinates.
    // However, arctan() will discard information about how the arrow is oriented (domain -90 ~ 90)
    // so I use another strategy: first scale the original line, then apply the rotation matrix.
    static setArrow(x1, y1, x2, y2, tipLen, tipAngle) {
        let dx = x1 - x2;    // note it's x1 - x2
        let dy = y1 - y2;

        let len = Math.sqrt(dx * dx + dy * dy);

        // calculate the position
        let x = dx / len * tipLen;
        let y = dy / len * tipLen;

        let sin_theta = Math.sin(tipAngle);
        let cos_theta = Math.cos(tipAngle);

        // x1, x2 are the coordinates of start point and end point; arrow points from x1 to x2.
        // x3, x4 are the endpoints of the two lines originating from x2 that draw the arrow.
        // Ditto for y3 and y4.
        let x3 = x2 + cos_theta * x - sin_theta * y;
        let y3 = y2 + sin_theta * x + cos_theta * y;
        let x4 = x2 + cos_theta * x + sin_theta * y;
        let y4 = y2 + cos_theta * y - sin_theta * x;
        return [x3, y3, x4, y4];
    }

    showFadeIn() {
        let t = this.timer.advance() * 255;
        this.s.stroke(this.colorArr[0], this.colorArr[1], this.colorArr[2], t);
        this.s.strokeWeight(this.strokeweight);

        this.s.line(this.x1, this.y1, this.x2, this.y2);
        this.s.line(this.x2, this.y2, this.x3, this.y3);
        this.s.line(this.x2, this.y2, this.x4, this.y4);
    }

    static showArrow(obj, t) {  // // show the two line segments at the tip; also used by ArcArrow
        let dx3 = obj.x3 - obj.x2;
        let dy3 = obj.y3 - obj.y2;
        obj.s.line(obj.x2, obj.y2, obj.x2 + t * dx3, obj.y2 + t * dy3);

        let dx4 = obj.x4 - obj.x2;
        let dy4 = obj.y4 - obj.y2;
        obj.s.line(obj.x2, obj.y2, obj.x2 + t * dx4, obj.y2 + t * dy4);
    }

    showGrow() {
        // show the main line
        let dx2 = this.x2 - this.x1;
        let dy2 = this.y2 - this.y1;
        this.showSetup();

        // 2019-01-26 BUG FIX: no wonder why the display of arrows appears 6 times slower...
        let t = this.timer.advance();

        this.s.line(this.x1, this.y1, this.x1 + t * dx2, this.y1 + t * dy2);

        Arrow.showArrow(this, t);
    }

    show() {
        if (this.s.frameCount > this.start) {
            if (this.fadeIn) {
                this.showFadeIn();
            } else {
                this.showGrow();
            }
        }
        if (this.fadeOut && this.s.frameCount > this.end) {

        }
    }
}

/*** 2019-03-19
 * FcnPlot
 * Plots a function on a 2D axes
 *
 * ---- args list parameters ----
 * @mandatory (function) f; (Axes or one of its child classes) axes
 * @optional (number) start, duration, strokeweight, mode [for timer], segLen
 *           (array) color
 */
class FcnPlot {
    constructor(ctx, args) {
        this.s = ctx;
        this.f = args.f || ((x) => { return (x * x / 7 - 1); });
        this.a = args.axes;
        this.segLen = args.segLen || 7;  // how many pixels wide is a line segment in the plot

        this.start = args.start || 1;
        this.duration = args.duration || 1;
        this.mode = args.mode || 0;

        this.sw = args.strokeweight || 3;
        this.color = args.color || [77, 177, 77];

        this.timer = TimerFactory(frames(this.duration), this.mode);

        this.xs = [];
        this.ys = [];
        this.calcPoints();
    }

    calcPoints() {
        this.len = (this.a.right - this.a.left) / this.segLen + 1;
        let i = 0;
        let x, y, b;
        for (let a = this.a.left; ; a += this.segLen, i++) {
            this.xs[i] = a;  // plotted x
            x = (a - this.a.centerX) / this.a.stepX;  // actual x
            y = this.f(x);  // actual y
            b = this.a.centerY - y * this.a.stepY;  // plotted y
            this.ys[i] = b;

            if (a > this.a.right) // this is because we want to draw a little over the right
                break;
        }
    }

    show() {
        if (this.s.frameCount >= this.start) {
            this.s.beginShape();
            this.s.stroke(this.color);
            this.s.strokeWeight(this.sw);
            //this.s.strokeJoin(this.s.ROUND);
            this.s.noFill();

            let t = this.timer.advance();
            for (let i = 0; i < this.len * t; i++) {
                this.s.vertex(this.xs[i], this.ys[i]);
            }
            this.s.endShape();
        }
    }
}


/*** 2019-01-07
 * Table
 *
 * The width of the grid is determined by how large the last entry of the x or y array is
 * when that number is displayed on the canvas
 *
 * If I make a pair of axes representing x-y coordinate plane, I can adapt this class.
 *
 * ---- args list parameters ----
 * @mandatory (p5.Font) font; (array) xs, ys;
 * @optional (number) x, y, start, size, sizeX [for controlling horizontal block size];
 *           (string) label1, label2, (array) colorX, colorY [apply to data]
 */
class Table {
    constructor(ctx, args) {
        this.s = ctx;
        this.x = args.x;
        this.y = args.y;
        this.xs = args.xs;
        this.ys = args.ys;
        this.font = args.font;
        this.label1 = "x" || args.label1;
        this.label2 = "y" || args.label2;
        this.start = args.start || frames(1);

        this.numPts = this.xs.length;
        this.sizeY = args.size || 37;   // size of the text
        this.s.textFont(this.font);
        this.s.textSize(this.sizeY);
        this.sizeX = args.sizeX || Math.max(this.s.textWidth("" + this.xs[this.numPts - 1]),
            this.s.textWidth("" + this.ys[this.numPts - 1]));

        this.duration = args.duration || frames(1);
        this.timer = new Timer0(this.duration);
        this.textX = [new TextFade(this.s, {
            duration: frames(0.5),
            size: this.sizeY,
            str: this.label1,
            font: this.font,
            x: this.x + this.sizeX * 0.6,
            y: this.y + this.sizeY * 0.6,
            mode: 1,
        })];
        this.textY = [new TextFade(this.s, {
            duration: frames(0.5),
            size: this.sizeY,
            str: this.label2,
            font: this.font,
            x: this.x + this.sizeX * 0.6,
            y: this.y + this.sizeY * 1.8,
            mode: 1,
        })];
        for (let i = 1; i < this.numPts + 1; i++) {
            this.textX[i] = new TextFade(this.s, {
                color: args.colorX,
                duration: frames(0.5),
                size: this.sizeY,
                str: "" + this.xs[i - 1],   // 3/19: why did this go wrong without me noticing???
                font: this.font,
                x: this.x + this.sizeX * (0.6 + i * 1.4),
                y: this.y + this.sizeY * 0.6,
                mode: 1
            });
            this.textY[i] = new TextFade(this.s, {
                color: args.colorY,
                duration: frames(0.5),
                size: this.sizeY,
                str: "" + this.ys[i - 1],  // and here?
                font: this.font,
                x: this.x + this.sizeX * (0.6 + i * 1.4),
                y: this.y + this.sizeY * 1.8,
                mode: 1
            });
        }

        this.horizLine = new Line(this.s, {
            strokeweight: 2,
            x1: this.x,
            y1: this.y + this.sizeY * 1.32,
            x2: this.x + this.sizeX * 1.4 * (this.numPts + 1),
            y2: this.y + this.sizeY * 1.32,
            mode: 0
        });
        this.vertLines = [];
        for (let i = 1; i < this.numPts + 1; i++) {
            this.vertLines[i - 1] = new LineCenter(this.s, {
                strokeweight: 2,
                duration: frames(0.5),
                x1: this.x + this.sizeX * (i * 1.4 - 0.1),
                x2: this.x + this.sizeX * (i * 1.4 - 0.1),
                y1: this.y + this.sizeY * 0.17,
                y2: this.y + this.sizeY * 2.47,
                mode: 1
            });
        }
    }

    show() {
        if (this.s.frameCount > this.start) {
            this.horizLine.show();
            let t = Math.round(this.timer.advance() * (this.numPts + 1));
            for (let i = 0; i < this.numPts + 1; i++) {
                if (i < t) {
                    this.textX[i].show();
                    this.textY[i].show();
                    if (i < this.numPts) {
                        this.vertLines[i].show();
                    }
                }
            }
        }
    }
}

/*** 2019-04-26
 * Chart
 * A base class for Grid-like structures
 * Child classes should define what's in the grid by saying, for example,
 * this.grid[i][j] = new Text({ x: (i+0.5) * this.w, y: (j+0.5) * this.h, mode: 1 });
 *
 * ---- args list parameters ----
 * @mandatory (number) w, h [specifies the w and h for ONE grid],
 *             i, j [specifies the number of blocks on x/y direction of the grid]
 * @optional (number) x, y, start, size [for text], duration [in seconds]
 */
class Chart extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.duration = frames(args.duration) || frames(1.2);  // init animation duration
        this.w = args.w || 67;
        this.h = args.h || 47;
        this.i = args.i || 2;
        this.j = args.j || 2;
        this.sw = args.strokeweight || 1;
        this.color = [167, 167, 167];

        this.hl = [];  // horizontal lines, # = j + 1
        this.vl = [];  // vertical lines, # = i + 1
        this.grid = [];
        for (let i = 0; i < this.i; i++)
            this.grid[i] = [];

        for (let j = 0; j < this.j + 1; j++)
            this.hl[j] = new Line(this.s, {
                x1: this.x + j * this.w, y1: this.y, color: this.color,
                x2: this.x + j * this.w, y2: this.y + this.h * this.j,
                strokeweight: this.sw, start: this.start + this.duration * j / this.j
            });

        for (let i = 0; i < this.i + 1; i++)
            this.vl[i] = new Line(this.s, {
                x1: this.x, y1: this.y + i * this.h, color: this.color,
                x2: this.x + this.w * this.i, y2: this.y + i * this.h,
                strokeweight: this.sw, start: this.start + this.duration * i / this.i
            });
    }
    show() {
        for (let j = 0; j < this.j + 1; j++)
            this.hl[j].show();
        for (let i = 0; i < this.i + 1; i++)
            this.vl[i].show();

        for (let i = 0; i < this.i; i++)
            for (let j = 0; j < this.j; j++)
                if (this.grid[i][j])
                    this.grid[i][j].show();
    }
}

/*** 2019-04-24
 * ---- args list parameters ----
 * @mandatory (number) x, y, r, a1, a2 (start/end angle in radians)
 * @optional (number) start, end, duration, strokeweight, (array) color, fill
 */
class Pie extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.a1 = args.a1 || 0;
        this.a2 = args.a2 || 6.283;

        this.r = args.r || 100;
        this.timer = new Timer1(frames(this.duration));
        this.st = new StrokeChanger(this.s, args.color);
        this.fill = args.fill || undefined;
        if (this.fill)
            this.ft = new FillChanger(this.s, args.fill);

        this.strokeweight = args.strokeweight || 3;
        this.timer_sw = new StrokeWeightTimer(this.s, this.end, this.strokeweight, 0.7);
    }

    showSetup() {
        this.showMove();
        if (this.fill) {
            this.ft.advance();
        } else
            this.s.noFill();

        this.st.advance();
        this.timer_sw.advance();
    }

    show() {
        if (this.s.frameCount > this.start) {
            this.showSetup();
            this.s.arc(this.x, this.y, this.r, this.r,
                this.a1, this.a1 + (this.a2 - this.a1) * this.timer.advance());
        }
    }
}

/*** 2019-04-24
 * Since p5.js cannot display an arc in the counterclockwise direction,
 * I have to write my own Arc class that behaves similarly to FcnPlot.
 * Maybe refactor this later to inherit Line.
 *
 * ---- args list parameters ----
 * (see Arc)
 * @optional (number) detail, // todo: x1, y1, x2, y2
 */
class Arc extends Pie {
    constructor(ctx, args) {
        super(ctx, args);
        this.n = args.detail || 27;  // number of segments - 1
        this.p = [];
        let a = this.a1;
        let da = (this.a2 - this.a1) / (this.n - 1);  // number of anchor points = # segment + 1
        for (let i = 0; i < this.n; i++) {
            let x = this.x + this.r * Math.cos(a), y = this.y + this.r * Math.sin(a);
            a += da;
            this.p[i] = [x, y];
        }
    }

    showArc(t) {
        this.s.beginShape();
        this.showSetup();
        for (let i = 0; i < this.n * t; i++) {
            this.s.vertex(this.p[i][0], this.p[i][1]);
        }
        this.s.endShape();
    }

    show() {
        if (this.s.frameCount > this.start) {
            let t = this.timer.advance();
            this.showArc(t);
        }
    }
}

class ArcArrow extends Arc {
    constructor(ctx, args) {
        super(ctx, args);
        this.tipLen = args.tipLen || 12;
        this.tipAngle = args.tipAngle || 0.3;

        this.x2 = this.p[this.n - 1][0];
        this.y2 = this.p[this.n - 1][1] - 1;  // fixme
        let dx = this.x2 - this.x, dy = this.y2 - this.y;
        let t = Arrow.setArrow(this.x2 - dy, this.y2 + dx - this.strokeweight,
            this.x2, this.y2, this.tipLen, this.tipAngle);
        this.x3 = t[0];
        this.y3 = t[1];
        this.x4 = t[2];
        this.y4 = t[3];
    }

    show() {
        if (this.s.frameCount > this.start) {
            let t = this.timer.advance();
            this.showArc(t);
            Arrow.showArrow(this, t);
        }
    }
}

/*** 2019-04-11
 * Circle
 * Draws a circle with init animation (draws clockwise) and end animation (fade out)
 * args list: @see class Pie
 */
class Circle extends Pie {
    constructor(ctx, args) {
        super(ctx, args);
    }
    show() {
        if (this.s.frameCount > this.start) {
            this.showSetup();
            this.s.arc(this.x, this.y, this.r, this.r, 0, 6.283 * this.timer.advance());
        }
    }
}

/*** 2019-01-20
 * Bracket, '['
 * To create a ']', draw a line from bottom to top
 *
 // * (DISCARDED) x and y define the CENTER of the Bracket.
 // * Default is a left bracket, '['. To use a right bracket, pass in angle = PI.
 *
 * ---- args list parameters ----
 * @mandatory (number) x1, x2, y1, y2
 * @optional (number) tipLen, start, end, duration, strokeweight
 */
class Bracket extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.s = ctx;
        // this.x = args.x;
        // this.y = args.y;
        // this.l = args.length;
        // this.angle = args.angle || 0;

        // let dx = args.x2 - args.x1;
        // let dy = args.y2 - args.y1;
        // let len = Math.sqrt(dx * dx + dy * dy);

        this.tipLen = args.tipLen || 9;

        this.start = args.start || 100;
        this.end = args.end || 100000;
        this.duration = args.duration || frames(1);
        this.strokeweight = args.strokeweight || 3;

        this.lines = [];
        this.lines[0] = new LineCenter(this.s, {
            start: this.start, end: this.end,
            duration: this.duration, strokeweight: this.strokeweight
        });
        this.lines[1] = new Line(this.s, {
            start: this.start, end: this.end,
            duration: this.duration, strokeweight: this.strokeweight
        });
        this.lines[2] = new Line(this.s, {
            start: this.start, end: this.end,
            duration: this.duration, strokeweight: this.strokeweight
        });
        this.reset(args);
    }

    // ----args list----
    // x1, x2, y1, y2
    reset(args) {
        this.x1 = args.x1;
        this.x2 = args.x2;
        this.y1 = args.y1;
        this.y2 = args.y2;
        let angle = Math.atan2(args.y2 - args.y1, args.x2 - args.x1);
        let sin = Math.sin(angle), cos = Math.cos(angle);

        this.lines[0].reset({
            x1: args.x1, x2: args.x2, y1: args.y1, y2: args.y2
        });
        this.lines[1].reset({
            x1: args.x1 + this.tipLen * sin, x2: args.x1,
            y1: args.y1 - this.tipLen * cos, y2: args.y1,
        });
        this.lines[2].reset({
            x1: args.x2 + this.tipLen * sin, x2: args.x2,
            y1: args.y2 - this.tipLen * cos, y2: args.y2,
        });
    }

    show() {
        if (this.moved)
            this.moving();
        for (let l of this.lines) l.show();
    }
}


/*** 2019-02-01
 * ImageBase (could not name it to Image since it would conflict p5.Image)
 *
 * This class does not support init animations. See ImageFly, ImageGrow, ImageFade.
 * Since this.s.tint() is a very costly method and slows down the frame rate drastically,
 * user can use the ImageFly class to display init animation of flying in from the left, etc.
 *
 * ---- args list parameters ----
 * @mandatory (p5.Image) img, (number) x, y
 * @optional (number) w, h, start
 */
class ImageBase extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.img = args.img;
        this.w = args.w || this.img.width; // fixme: will this result in overhead?
        this.h = args.h || this.img.height;
    }

    showImage() {
        this.showMove();
        this.s.image(this.img, this.x, this.y, this.w, this.h);
    }
}

/***
 * ImageFly
 *
 * mode 1: fly from left;  mode 2: fly from right;
 * mode 3: fly from up;    mode 4: fly from bottom
 *
 * ---- args list parameters ----
 * @mandatory (p5.Image) img, mode
 * @optional (number) x, y, w, h, start, duration
 */
class ImageFly extends ImageBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.xf = this.x;  // final positions
        this.yf = this.y;
        this.mode = args.mode || 1;

        switch (this.mode) {
            case 1:
                this.x = -this.img.width; break;
            case 2:
                this.x = cvw; break;
            case 3:
                this.y = -this.img.height; break;
            case 4:
                this.y = cvh; break;
        }
    }

    show() {
        if (this.s.frameCount === this.start) {
            this.move(this.xf, this.yf, this.duration, 1);
        }
        this.showImage();
    }
}

class ImageGrow extends ImageBase {  // grow from center; no additional args needed
    constructor(ctx, args) {
        super(ctx, args);
        this.xc = this.x + this.w / 2;
        this.yc = this.y + this.h / 2;
        this.timer = new Timer1(frames(this.duration));
    }
    show() {
        this.showMove();
        if (this.s.frameCount > this.start) {
            let t = this.timer.advance();
            this.s.image(this.img,
                this.xc - this.w * t / 2, this.yc - this.h * t / 2, this.w * t, this.h * t);
        }
    }
}

/*** 2019-02-27
 * ImageFade
 * Can display fade in and fade out animations
 * Since there is an extra layer of black rectangle embedded in canvas,
 * need to be careful not to cause bugs
 */
class ImageFade extends ImageBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.rect = new Rect(this.s, {
            x: this.x, y: this.y, w: this.w, h: this.h, duration: 0.7,
            color: [0, 0, 0, 255], start: 1, end: this.start,
        });
    }
    show() {
        this.showImage();
        this.rect.show(); // this function call needs to be after the previous
    }
}

// +++---###---<<<       graph.js       >>>---###---+++
/*** 2019-04-22
 * A graph that serves as the base class for classes that trace the graph algorithms
 * The input must have no self-edges, duplicate edges, etc.
 *
 * V is an array of arrays, each entry consisting of 2 integer fields about the vertex:
 * [0] x-coord, [1] y-coord
 * The vertices are numbered based on the array index; array length will be the number of vertices.
 *
 * E is an array of arrays, each entry consisting of 2 to 4 integer fields about the edge:
 * [0] vertex-from, [1] vertex-to, [2] arc-radius, [3] weight
 * Among them, [2] is set to 0 if the edge is to be displayed as a straight line,
 * or a positive/negative number specifying the radius and orientation of the arc.
 * The ordering of these edges will be the sequence they're shown in the init animation.
 *
 * @mandatory (2D array) V, E, (p5.Font) font
 * @optional (number) radius [for nodes], duration [in seconds], begin,
 *           yOffset [for adjusting location of the node number],
 *           (array) color_v, color_e
 *           (str) label [if passed in, then node has bigger radius and a label on bottom-right]
 */
class Graph extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.f = 47;   // how many frames for advancing one step of the algorithm
        this.begin = args.begin || 100;

        // variables used to keep track of the algorithm's progress
        this.finished = false;

        this.V = args.V;
        this.n = this.V.length;  // n - number of nodes
        this.E = args.E;
        this.m = this.E.length;  // m - number of edges

        // value is undefined if no edge, true for unweighted graphs, a number for weighted graph
        this.A = [];   // 2D adjacency list;

        this.edges = [];  // stores the Edge objects
        // init adjacency list to all null, actual initialization deferred to subclasses
        for (let i = 0; i < this.n; i++) {
            this.A[i] = [];
            this.edges[i] = [];
        }
        this.dur = args.duration || 1.7;
        this.yOffset = args.yOffset === undefined ? -5 : args.yOffset;   // offset for node text
        this.radius = args.radius || (args.label ? 67 : 57);  // node radius

        this.nodes = [];  // stores Node objects
        for (let i = 0; i < this.n; i++) {
            this.nodes[i] = args.label ? new NodeLabel(this.s, {
                x: this.V[i][0], y: this.V[i][1], yOffset: this.yOffset, duration: 0.37,
                start: this.start + frames(this.dur) * i / this.n, size: args.size || 37,
                str: "" + i, font: args.font, color: args.color_v, r: this.radius,
                label: args.label
            }) : new Node(this.s, {
                x: this.V[i][0], y: this.V[i][1], yOffset: this.yOffset, duration: 0.37,
                // display all nodes in this.dur seconds
                start: this.start + frames(this.dur) * i / this.n, size: args.size || 42,
                str: "" + i, font: args.font, color: args.color_v, r: this.radius,
            });
        }
    }
    show() {
        // decrement to avoid the label being overwritten in undirected weighted graphs
        for (let i = this.n - 1; i >= 0; i--)
            for (let j = this.n - 1; j >= 0; j--)
                if (this.edges[i][j])
                    this.edges[i][j].show();

        for (let n of this.nodes) n.show();
    }
}

/*** 2019-04-23
 * --- args list ---
 * @mandatory (number) x, y, str, (p5.Font) font [tnr]
 * @optional (number) r, start, end, duration, strokeweight, size, yOffset,
 *           (array) color [for the ring], fill [for inside the circle]
 *
 */
class Node extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.r = args.r || 57;
        this.sw = args.strokeweight || 2;
        this.color = args.color || Blue;
        this.yOffset = args.yOffset || -4;
        this.fill = args.fill || vector_multiply(this.color, 0.14);

        this.c = new Circle(this.s, {
            x: this.x, y: this.y, r: this.r, start: this.start, end: this.end,
            duration: this.duration, strokeweight: this.sw, color: this.color, fill: this.fill
        });

        this.txt = new TextFade(this.s, {
            x: this.x, y: this.y + this.yOffset, size: args.size || 42,
            start: this.start, font: args.font, mode: 1, str: args.str,
        })
    }

    move(x, y, dur, timerNum) {
        this.c.move(x, y, dur, timerNum);
        this.txt.move(x, y, dur, timerNum);
    }

    relabel(txt) {
        this.txt.reset({ str: txt });
    }

    /**
     * If time for highlight is unknown, could pass in 1e5 as @param duration and
     * call dehighlight() later on
     *
     * There seems to be a bug that duration = 1 causes error. Try setting duration to be >= 1.7
     * disableGrow - disable the arc grow animation, only grow the highlight radius
     */
    highlight(color, duration, thickness, disableGrow) {
        this.dis = !!disableGrow;  // fancy JavaScript syntax, == disableGrow ? true : false
        this.hi = true;
        this.h_color = color || [255, 67, 7];
        this.h_dur = duration || 1;
        this.h_fr = frames(this.h_dur);
        this.thickness = thickness || 17;
        this.f = 0;
        this.h_timer = new Timer1(frames(0.67));
        this.s_timer = new FillChanger(this.s, this.h_color);
    }

    dehighlight() {
        this.h_fr = this.f + frames(1);
    }

    highlighting() {
        if (this.f < this.h_fr) {
            this.f++;
            this.s.noStroke();
            this.s_timer.advance();
            if (this.f === this.h_fr - frames(0.27)) {
                this.s_timer.fadeOut(0.27);  // fade out .27 seconds before duration ends
            }
            let t = this.h_timer.advance();
            let r = this.r + this.thickness * t;
            if (this.dis) {
                this.s.ellipse(this.x, this.y,
                    this.r + this.thickness * t, this.r + this.thickness * t);
            } else     // refined animation on 05/14
                this.s.arc(this.x, this.y, r, r,
                    -this.s.PI + t * this.s.HALF_PI, -this.s.PI + t * this.s.TWO_PI * 1.2499);
        } else
            this.hi = false;
    }

    /**
     * NOTICE: If this does not work correctly, it's usually because color array should have
     * 4 entries!!
     */
    reColor(ringColor, fillColor, txtColor, duration) {
        // this.c.shake(7, 0.8);
        // this.txt.shake(7, 0.8);
        this.c.st.reColor(ringColor, duration);
        this.c.ft.reColor(fillColor ? fillColor : vector_multiply(ringColor, 0.2), duration);
        if (txtColor) {
            this.txt.ft.reColor(txtColor, duration);
        }
    }

    show() {
        if (this.hi)
            this.highlighting();
        this.c.show();
        this.txt.show();
    }
}

// extra param: label, labelColor
class NodeLabel extends Node {
    constructor(ctx, args) {
        super(ctx, args);
        this.txt.reset({   // if it's a two digit number, txt needs to be smaller
            x: this.x - 12, y: this.y - 14, size: args.str.length === 2 ? 37 : 42  // fixme
        });
        let m = 0.24;
        this.labelColor = args.labelColor || [255, 247, 77];
        this.lin = new Line(this.s, {
            x1: this.x - this.r * m, y1: this.y + this.r * m,
            x2: this.x + this.r * m, y2: this.y - this.r * m,
            strokeweight: 1, start: args.start, color: [177, 177, 177]
        });
        this.label = new TextFade(this.s, {
            str: args.label, mode: 1, x: this.x + 10, y: this.y + 10, start: args.start,
            color: this.labelColor, size: 24
        });
    }

    reColor(ringColor, fillColor, txtColor, labelColor, lineColor, duration) {
        super.reColor(ringColor, fillColor, txtColor, duration);
        if (labelColor)
            this.label.ft.reColor(labelColor, duration);
        if (lineColor)
            this.lin.st.reColor(lineColor, duration);
    }

    reset(cost, down) {  // display reset animations, 2nd param specify direction (default shift up)
        this.resetted = true;
        this.f = 0;
        this.duration = 1;
        this.labelN = new TextFade(this.s, {
            str: "" + cost, mode: 1, x: this.x + 10,
            y: down ? this.y - 20 : this.y + 40, start: this.s.frameCount + 1,
            color: this.labelColor, size: 24
        });
        this.label.ft.fadeOut(0.7);
        let d = down ? 1 : -1;
        this.label.shift(0, 30 * d, 1, 1);
        this.labelN.shift(0, 30 * d, 1, 1);
    }

    resetting() {
        if (this.f <= this.duration * fr) {
            this.f++;
            this.labelN.show();
        } else {
            this.resetted = false;
            this.label = this.labelN;
            this.labelN = null;
        }
    }

    show() {
        super.show();
        this.lin.show();
        if (this.resetted)
            this.resetting();
        this.label.show();
    }
}

/*** 2019-04-23, 04-24, 05-09
 * Draws a line/arc from one node to another given the positions and radii of two nodes.
 * Could pass in a string str to add a label the edge in the middle, if so, pass in label: true.
 * If need an arc, pass in the distance from the midpoint to the arc as d.
 * d should not be greater than half the distance between the two nodes.
 * It's show() needs to be called after nodes'.  // todo: negative d
 *
 * --- args list ---
 * @mandatory x1, x2, y1, y2, start, node_r, (bool) directed,
 * @optional d [arc curvature], weight, x3, y3 [text coordinates]; (array) color, txtColor
 */
class Edge extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.size = args.size || 29;
        this.node_r = args.node_r || 57;
        this.color = args.color || [97, 7, 117];
        this.txtColor = args.txtColor || [167, 236, 227];
        this.stroke = args.stroke || [0, 0, 0]; //[17, 47, 127];
        this.directed = args.directed;
        if (this.directed)
            this.tipLen = 12;

        let dx = args.x2 - args.x1;
        let dy = args.y2 - args.y1;
        let xm = this.x1 + dx / 2, ym = this.y1 + dy / 2;
        let len = Math.sqrt(dx * dx + dy * dy);

        if (args.d) {  // needs an arc
            this.d = args.d;

            // calculate center of arc, also will be where the text lies
            this.x3 = xm - dy * this.d / len;
            this.y3 = ym + dx * this.d / len;

            // calculate the centroid of the arc
            // (intersection of perpendicular bisectors for 1,3 and 2,3)
            let p1 = this.getPB(this.x1, this.y1, this.x3, this.y3);
            let p2 = this.getPB(this.x2, this.y2, this.x3, this.y3);
            let a1 = p1[0], b1 = p1[1], c1 = p1[2], a2 = p2[0], b2 = p2[1], c2 = p2[2];
            let det = a1 * b2 - b1 * a2;
            this.xc = (c1 * b2 - b1 * c2) / det;  // 2d Cramer's Rule
            this.yc = (a1 * c2 - c1 * a2) / det;

            // calculate the radius of the arc
            let x1d = this.x1 - this.xc, y1d = this.y1 - this.yc;
            this.r = Math.sqrt(x1d * x1d + y1d * y1d);

            // calculate start and end angles
            this.a1 = Math.atan2(y1d, x1d);  // NOTICE: acos does NOT work here!!!
            let x2d = this.x2 - this.xc, y2d = this.y2 - this.yc;
            this.a2 = Math.atan2(y2d, x2d);
            if (this.a2 < this.a1 && this.d < 0) {
                this.a2 += this.s.TWO_PI;
            } else if (this.a2 > this.a1 && this.d > 0) {   // don't yet know why I need to do this
                this.a1 += this.s.TWO_PI;
            }

            // start and end angles, after "subtracting" the radius of two nodes from the curve
            let half_a = Math.asin(this.node_r / 2 / this.r) * 1.14;  // guaranteed in [0, PI/4]
            if (this.d > 0) {
                this.la1 = this.a1 - half_a;  // supposed to be +, but p5 has a weird coord system
                this.la2 = this.a2 + half_a;  // it's supposed to be - ...
            } else {  // 05-09: handle negative d
                this.la1 = this.a1 + half_a;
                this.la2 = this.a2 - half_a;
            }

            this.l = this.createLine();

            this.numPts = 27;   // this is used for highlighting, code copied from Arc class
            this.pts = [];
            let a = this.a1;
            let da = (this.a2 - this.a1) / (this.numPts - 1);
            for (let i = 0; i < this.numPts; i++) {
                let x = this.xc + this.r * Math.cos(a), y = this.yc + this.r * Math.sin(a);
                a += da;
                this.pts[i] = [x, y];
            }
        } else {
            // the coordinates for line segment; it's shorter than the distance between node centers
            this.lx1 = args.x1 + dx * this.node_r / len * 0.54;
            // 0.54, to account for the node's ring thickness
            this.lx2 = args.x2 - dx * this.node_r / len * 0.57;
            this.ly1 = args.y1 + dy * this.node_r / len * 0.54;
            this.ly2 = args.y2 - dy * this.node_r / len * 0.57;

            this.l = this.createLine();
            this.x3 = args.x3 || xm;
            this.y3 = args.y3 || ym;
        }
        // add label
        if (args.weight !== undefined) {
            this.str = "" + args.weight;
            this.txt = new TextFade(this.s, {
                str: this.str, x: this.x3, y: this.y3, mode: 1,
                start: args.start, color: this.txtColor,
                stroke: [0, 0, 0],    // black stroke
                strokeweight: 7, size: this.size
            });
        }
    }

    // calculates perpendicular bisector, returns [a, b, c] for line ax + by = c
    getPB(x1, y1, x2, y2) {
        let a = x1 - x2;  // a = -dx
        let b = y1 - y2;  // b = -dy
        let xm = x1 - a / 2, ym = y1 - b / 2;  // midpoint
        return [a, b, a * xm + b * ym];
    }

    createLine(){
        return this.r ? (this.directed ? new ArcArrow(this.s, {   // arc directed
            r: this.r, x: this.xc, y: this.yc, a1: this.la1, a2: this.la2,
            start: this.start, duration: this.duration, color: this.color, tipLen: this.tipLen
        }) : new Arc(this.s, {  // arc undirected
            r: this.r, x: this.xc, y: this.yc, a1: this.la1, a2: this.la2,
            start: this.start, duration: this.duration, color: this.color,
        })) : (this.directed ? new Arrow(this.s, {  // straight directed
            x1: this.lx1, x2: this.lx2, y1: this.ly1, y2: this.ly2, start: this.start,
            duration: this.duration, color: this.color,
            tipAngle: 0.37, tipLen: this.tipLen,
        }) : new Line(this.s, {  // straight undirected
            x1: this.lx1, x2: this.lx2, y1: this.ly1, y2: this.ly2, start: this.start,
            duration: this.duration, color: this.color,
        }));
    }

    addEdge(color) {  // shows a line/arc growing on top of previous edge
        this.color = color;
        this.start = this.s.frameCount + 1;
        this.l2 = this.createLine();
    }

    shake(amp) {  // shake the text
        this.txt.shake(amp, 1);
    }

    reset(str) {
        if (this.txt)
            this.txt.reset({ str: "" + str });
    }

    reColor(lineColor, txtColor, duration) {
        this.l.st.reColor(lineColor, duration);
        if (this.txt !== undefined)
            this.txt.reColor(txtColor, duration);
    }

    highlight(color, duration, thickness) {
        this.hi = true;
        this.h_color = color || [255, 67, 7];
        this.h_dur = duration || 1;
        this.h_fr = frames(this.h_dur);
        this.thickness = thickness || 14;
        this.f = 0;
        this.h_timer = new Timer2(frames(0.67));
        this.s_timer = new StrokeChanger(this.s, this.h_color);
    }

    /**
     * @see class Node's highlight() and dehighlight() method
     */
    dehighlight() {
        this.h_fr = this.f + frames(1);
    }

    highlighting() {
        if (this.f < this.h_fr) {
            this.f++;
            this.s_timer.advance();
            this.s.strokeWeight(this.thickness);
            if (this.f === this.h_fr - frames(0.27)) {
                this.s_timer.fadeOut(0.27);  // fade out .27 seconds before duration ends
            }
            let t = this.h_timer.advance();
            if (!this.d)
                this.s.line(this.x1, this.y1,
                    this.x1 + t * (this.x2 - this.x1), this.y1 + t * (this.y2 - this.y1));
            else {
                this.s.noFill();
                this.s.beginShape();
                for (let i = 0; i < this.numPts * t - 1; i++) {
                    this.s.vertex(this.pts[i][0], this.pts[i][1]);
                }
                this.s.endShape();
            }
        } else
            this.hi = false;
    }

    show() {
        if (this.hi)
            this.highlighting();
        this.l.show();
        if (this.l2)
            this.l2.show();
        if (this.txt)
            this.txt.show();
    }
}

/**
 * Undirected Graph
 * Assumes that args.E go from small-index vertices to big-index vertices, otherwise weight
 * will not be displayed properly
 */
class Graph_U extends Graph {
    constructor(ctx, args) {
        super(ctx, args);
        for (let i = 0; i < this.m; i++) {
            let a = this.E[i][0], b = this.E[i][1];  // two connecting nodes
            let d = this.E[i][2], c = this.E[i][3];  // radius and label
            if (c !== undefined)
                this.A[a][b] = this.A[b][a] = c;
            else
                this.A[a][b] = this.A[b][a] = true;

            this.edges[a][b] = new Edge(this.s, {
                x1: this.V[a][0], y1: this.V[a][1],
                x2: this.V[b][0], y2: this.V[b][1],
                start: this.start + frames(this.dur) * i / this.m, d: d, color: args.color_e,
                duration: 0.8, node_r: this.radius, directed: false, weight: c,
            });

            // for an undirected graph, set the converse of an input edge to another Edge object
            // they will be displayed at the same location as the other edge,
            // and start time is set to after all edges are displayed.
            // We do this so that edge highlight functionality works both ways
            this.edges[b][a] = new Edge(this.s, {
                x1: this.V[b][0], y1: this.V[b][1],
                x2: this.V[a][0], y2: this.V[a][1], color: args.color_e,
                start: this.start + frames(this.dur) + 1, d: -d,  // notice d is inverted
                duration: 0.8, node_r: this.radius, directed: false, label: false
            });
        }
    }
}

/**
 * Directed Graph
 *
 */
class Graph_D extends Graph {
    constructor(ctx, args) {
        super(ctx, args);
        for (let i = 0; i < this.m; i++) {
            let a = this.E[i][0], b = this.E[i][1];  // two connecting nodes
            let d = this.E[i][2], c = this.E[i][3];  // radius and label
            if (c !== undefined)
                this.A[a][b] = c;
            else
                this.A[a][b] = true;

            this.edges[a][b] = new Edge(this.s, {
                x1: this.V[a][0], y1: this.V[a][1],
                x2: this.V[b][0], y2: this.V[b][1],
                start: this.start + frames(this.dur) * i / this.m, d: d, color: args.color_e,
                duration: 0.8, node_r: this.radius, directed: true, weight: c,
            });
        }
    }
}

// modify Tracer class for use in github pages
/*** 2019-04-26
 * A class that contains the steps of the algorithm
 *
 * --- args list ---
 * str, x, y, start, (size): parameters for the title
 * begin: starting time for showing the arrow (should be same as starting time for tracing algo)
 * (array) arrColor
 */
class Tracer extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.t = [];
        this.n = 1;
        this.xs = [];
        this.ys = [];
        this.to = 17;  // time offset

        this.t[0] = new TextWriteIn(this.s, {
            str: args.str, color: Yellow,
            x: args.x, y: args.y, size: args.size || 29, start: this.start,
        });
        this.start += args.str.length + this.to * 2;

        this.arr = new Arrow(this.s, {
            x1: 0, x2: 0, y1: 1, y2: 1, start: args.begin, color: args.arrColor || Orange,
        });
    }

    /***
     * x and y are relative to the location of this graph, which is defined as
     * the top-left position of the title.
     * If want no halt between display time, pass in 1 as frameOff for PREVIOUS string
     *
     * index is set to 0, 1, 2, 3... if this text is a step of the algorithm, or -1 if not
     */
    add(str, index, x, y, size, color, frameOff) {
        this.t[this.n] = new TextWriteIn(this.s, {
            str: str, x: this.x + x, y: this.y + y, size: size || 29, start: this.start,
            color: color || White
        });
        this.start += str.length + (frameOff ? frameOff : this.to);  // disabled for github pages
        this.n++;
        if (index >= 0) {
            this.xs[index] = this.x + x;
            this.ys[index] = this.y + y;
        }
    }

    /**
     * Reset the arrow to point to a certain step of the algorithm (step 0, 1, 2, 3, etc.)
     */
    reset(index) {
        this.arr.reset({
            x1: this.xs[index] - 50, x2: this.xs[index] - 10,
            y1: this.ys[index] + 17, y2: this.ys[index] + 17,
        });
    }
    show() {
        for (let t of this.t) t.show();
        this.arr.show();
    }
}

// 2019-05-06
// change the weights to be a random int value between 0 and max
function randomizeWeights(arr, max) {  // this will change the array
    for (let i = 0; i < arr.length; i++) {
        arr[i][3] = Math.floor(Math.random() * max);  // fixme: random often gives duplicate nums
    }
}

// 2019-05-06
// select edges from a given list of valid edges, each choice with a certain probability
function randomizeEdges(arr, prob) {
    let r = [];
    let l = 0;
    for (let i = 0; i < arr.length; i++)
        if (Math.random() < prob) {
            r[l] = arr[i];
            l++;
        }
    return r;
}

// +++---###---<<<       math.js       >>>---###---+++

