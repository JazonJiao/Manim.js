
let time = {};

let matrix = [1, -1, 1, -3, -4, 2];
let target = [-2, -3, 2];

// 2019-01-06
// this class is quite similar to the Plane_Projection class in chapter 3.2;
// I could have used inheritance to reduce duplicate code.
class Plane_LinComb extends Plane3D {
    constructor(args) {
        super(args);
        this.Y = args.y;   // the y in Ax = y. A is passed in as args.mat, y is args.y
        this.step = args.step || 100;

        // x1
        this.arrow1 = new Arrow3D({
            x2: this.M[0] * this.step, y2: this.M[1] * this.step, z2: this.M[2] * this.step,
            color: color([237, 47, 47])
        });
        // x2
        this.arrow2 = new Arrow3D({
            x2: this.M[3] * this.step, y2: this.M[4] * this.step, z2: this.M[5] * this.step,
            color: color([37, 147, 37])
        });

        // y
        this.arrow3 = new Arrow3D({
            x2: this.Y[0] * this.step, y2: this.Y[1] * this.step, z2: this.Y[2] * this.step,
            color: color([27, 147, 227])
        });

        // v = ax1 + bx2
        this.arrow4 = new Arrow3D({
            x2: 0, y2: 0, z2: 0,
            color: color([247, 217, 47])
        });

        this.kat = new Katex0({
            text: "\\textcolor{#f7e717}{\\vec{v}} = " +
                "~~~~~~~~\\textcolor{f76767}{x_1} + ~~~~~~~~\\textcolor{47f747}{x_2}",
            x: 700,
            y: 200,
            font_size: 40
        });
    }

    show(g) {
        this.showPlane(g);
        this.arrow1.show(g);
        this.arrow2.show(g);
        this.arrow3.show(g);
        let a = map(mouseX, 0, width, -1 * this.step, 1 * this.step);
        let b = map(mouseY, 0, height, 1 * this.step, -1 * this.step);
        this.arrow4.reset({
            x2: a * this.M[0] + b * this.M[3],
            y2: a * this.M[1] + b * this.M[4],
            z2: a * this.M[2] + b * this.M[5]
        });
        this.arrow4.show(g);
        this.kat.show();


    }
}

let g3;
let g2;

let axes;
let hg;
let arrows;
let kats = [];
let ax;

function preload() {
    ax = loadModel('../lib/obj/axes.obj');
}

function setup() {
    frameRate(fr);

    pixelDensity(1);
    createCanvas(1200, 675);
    g3 = createGraphics(1350, 1350, WEBGL);
    g2 = createGraphics(100, 10);

    axes = new Axes3D({
        angle: 1
    });

    hg = new HelperGrid({});

    arrows = new Plane_LinComb({
        mat: matrix,
        y: target
    });
}

function draw() {
    background(0);

    axes.show(g3, ax);
    arrows.show(g3);
    hg.show();

    image(g3, 0, 0, 675, 675);


    for (let k of kats) k.show();

    showFR(g2);
}