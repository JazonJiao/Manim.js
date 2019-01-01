/**
 * 2018-12-29
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

class Grid3D {
    constructor(args) {
        this.lineLen = args.lineLen || 32;
        this.numLines = args.numLines || 4;

        this.from = -(this.lineLen * this.numLines) / 2;
        this.to = -this.from;
        this.xs = this.create3Darray(this.numLines + 1);
        this.ys = this.create3Darray(this.numLines + 1);
        this.zs = this.create3Darray(this.numLines + 1);
        for (let i = 0; i < this.numLines + 1; i++) {
            for (let j = 0; j < this.numLines + 1; j++) {
                for (let k = 0; k < this.numLines + 1; k++) {
                    this.xs[i][j][k] = this.from + this.lineLen * k;
                    this.ys[i][j][k] = this.from + this.lineLen * j;
                    this.zs[i][j][k] = this.from + this.lineLen * i;
                }
            }
        }

    }

    create3Darray(n) {
        let arr = new Array(n);
        for (let i = 0; i < n; i++) {
            arr[i] = new Array(n);
            for (let j = 0; j < n; j++) {
                arr[i][j] = new Array(n);
            }
        }
        return arr;
    }

    show() {
        stroke(250);
        for (let i = 0; i < this.numLines + 1; i++) {
            for (let j = 0; j < this.numLines + 1; j++) {
                for (let k = 0; k < this.numLines + 1; k++) {
                    let x = this.xs[i][j][k], y = this.ys[i][j][k], z = this.zs[i][j][k];
                    stroke(i*50+50, j*50+50, k*50+50);
                    if (k !== this.numLines) {
                        line(x, y, z,
                            this.xs[i][j][k + 1], this.ys[i][j][k + 1], this.zs[i][j][k + 1]);
                    }
                    if (j !== this.numLines) {
                        line(x, y, z,
                            this.xs[i][j+1][k], this.ys[i][j+1][k], this.zs[i][j+1][k]);
                    }
                    if (i !== this.numLines) {
                        line(x, y, z,
                            this.xs[i+1][j][k], this.ys[i+1][j][k], this.zs[i+1][j][k]);
                    }
                }
            }
        }
    }
}

class Grid_Project extends Grid3D {
    constructor(args) {
        super(args);
        this.xd = [[[]]];
        this.yd = [[[]]];
        this.zd = [[[]]];
    }
}

/*** 2018-12-30
 * Arrow3D (WEBGL)
 *
 * ---- args list parameters ----
 * @mandatory (number) x2, y2, z2--those should be using p5's coordinate system
 * @optional (number) x1, y1, z1, radius, tipLen, tipRadius
 */
class Arrow3D {
    constructor(args) {
        this.x1 = args.x1 || 0;
        this.y1 = args.y1 || 0;
        this.z1 = args.z1 || 0;
        this.dx = args.x2 - this.x1;
        this.dy = args.y2 - this.y1;
        this.dz = args.z2 - this.z1;

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

        this.v = createVector(
            Math.sin(phi) * Math.sin(theta), // y = sin(phi) * sin(theta)
            Math.cos(phi),                   // z = cos(phi)
            Math.sin(phi) * Math.cos(theta)  // x = sin(phi) * cos(theta)
        );
    }


    show() {
        push();
        translate(this.dx / 2, this.dy / 2, this.dz / 2);
        rotate(PI, this.v);
        cylinder(this.radius, this.len);

        translate(0, this.len / 2, 0);
        cone(this.tipRadius, this.tipLen);  // fixme: the arrow's length will be off by tipLen/2
        pop();
    }

}




var gra3d;
var img;
var gra2d;

let axes;
let arrow1;
let grid;

// function preload() {
//     img = loadImage('../Intro/181227.png');
// }

function setup() {
    frameRate(30);
    gra3d = createCanvas(1200, 675, WEBGL);
    gra2d = createGraphics(100, 100);

    axes = new Axes3D({});

    arrow1 = new Arrow3D({
        x2: 100, y2: -200, z2: 300
    });
    grid = new Grid3D({
        lineLen: 177,
        numLines: 3
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
    arrow1.show();
    grid.show();

    // stroke(255, 255, 0);
    // line(256, 256, 256, 256, 256, -256);
    // line(-256, 256, 256, 256, 256, 256);
    // line(-256, -256, 256, 256, -256, 256);

    push();
    rotateX(PI / 4);
    fill(177, 177, 77, 77);
    plane(500, 500);
    pop();

    //showFR();
}

function mousePressed() {
    console.log(frameCount);
    noLoop();
}

function mouseReleased() {
    loop();
}