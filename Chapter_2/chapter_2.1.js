// 3D scene



let time = {};

// 2019-01-06
// this class is quite similar to the Plane_Projection class in chapter 3.2;
// I could have used inheritance to reduce duplicate code.
class Plane_LinComb extends Plane3D {
    constructor(args) {
        super(args);
        this.Y = args.y;   // the y in Ax = y. A is passed in as args.mat, y is args.y
        this.step = args.step || 100;

        // x1; NOTE that the y-coordinate needs to be inverted, ditto others
        // Error log: used this.M, but this.M is already converted to p5 coordinates
        this.arrow1 = new Arrow3D({
            to: [matrix[0] * this.step, matrix[1] * this.step, matrix[2] * this.step],
            color: color([237, 47, 47]),
            label: args.x_1,
        });
        // x2
        this.arrow2 = new Arrow3D({
            to: [matrix[3] * this.step, matrix[4] * this.step, matrix[5] * this.step],
            color: color([37, 147, 37]),
            label: args.x_2,
            fcn: ((g) => { g.rotateZ(-PI / 2); g.rotateX(PI); })
        });

        // y
        this.arrow3 = new Arrow3D({
            to: [this.Y[0] * this.step, this.Y[1] * this.step, this.Y[2] * this.step],
            color: color([27, 147, 227]),
            label: args.y_o,
            fcn: ((g) => { g.rotateZ(-PI / 2); })
        });

        // v = ax1 + bx2
        this.arrow4 = new Arrow3D({
            to: [0, 0, 0],
            color: color([247, 217, 47])
        });

        // r = y - v, endpoint same as arrow3
        this.arrow5 = new Arrow3D({
            to: [this.Y[0] * this.step, this.Y[1] * this.step, this.Y[2] * this.step],
            color: color([247, 27, 247]),
            // label: args.r_o,
            // fcn: ((g) => { g.rotateZ(PI / 2); })
        });


        this.lb = -1;  // lower bound for a, b
        this.ub = 1;   // upper bound for a, b
        this.textX = 700;
        this.textY = 200;
        this.textsize = 40;

        this.kat = new Katex14({
            text: "\\textcolor{#f7e717}{\\vec{v}} = " +
                "~~~~~~~~\\textcolor{f76767}{x_1} + ~~~~~~~~\\textcolor{47f747}{x_2}",
            x: this.textX,
            y: this.textY,
            font_size: this.textsize
        });

        this.text1 = new Text({
            str: "",
            font: args.font,
            x: this.textX + 79,
            y: this.textY + 34,
            size: this.textsize + 7
        });

        this.text2 = new Text({
            str: "",
            font: args.font,
            x: this.textX + 282,
            y: this.textY + 34,
            size: this.textsize + 7
        });
    }

    show(g) {
        this.showPlane(g);
        this.arrow1.show(g);
        this.arrow2.show(g);
        this.arrow3.show(g);
        let b0_coeff = map(mouseX, 0, width, this.lb * this.step, this.ub * this.step);
        let b_coeff = map(mouseY, 0, height, this.ub * this.step, this.lb * this.step);
        let x = b0_coeff * matrix[0] + b_coeff * matrix[3];
        let y = b0_coeff * matrix[1] + b_coeff * matrix[4];
        let z = b0_coeff * matrix[2] + b_coeff * matrix[5];
        this.arrow4.reset({ to: [x, y, z] });
        this.arrow4.show(g);

        this.arrow5.reset({ from: [x, y, z] });
        this.arrow5.show(g);
        this.kat.show();

        this.text1.reset({ str: "" + (b0_coeff / this.step).toFixed(2) });
        this.text1.show();
        this.text2.reset({ str: "" + (b_coeff / this.step).toFixed(2) });
        this.text2.show();
    }
}

let g3;
let g2;

let axes;
let font;
let hg;
let arrows;
let kats = [];
let obj = [];

function preload() {
    obj[0] = loadModel('../lib/obj/axes.obj');
    obj[1] = loadModel('../lib/obj/x_1.obj');
    obj[2] = loadModel('../lib/obj/x_2.obj');
    obj[3] = loadModel('../lib/obj/y.obj');
    // obj[4] = loadModel('../lib/obj/r.obj');
    font = loadFont('../lib/font/times.ttf');
}

function setup() {
    frameRate(fr);

    pixelDensity(1);
    createCanvas(cvw, cvh);
    g3 = createGraphics(cvh * 2, cvh * 2, WEBGL);  // a square to be displayed to the left
    g2 = createGraphics(100, 10);

    axes = new Axes3D({
        angle: 0,
        model: obj[0]
    });

    hg = new HelperGrid({});

    arrows = new Plane_LinComb({
        mat: matrix,
        y: target,
        font: font,
        x_1: obj[1],
        x_2: obj[2],
        y_o: obj[3],
        // r_o: obj[4],
        size: 300
    });
    kats[0] = new Katex0({
        text: "\\beta_0\\newline\\downarrow",
        x: 820, y: 87,

    });
    kats[1] = new Katex1({
        text: "\\beta_1\\newline\\downarrow",
        x: 1020, y: 87,
    })
}

function draw() {
    background(0);
    axes.show(g3);

    arrows.show(g3);
    //hg.show();

    image(g3, 0, 0, cvh, cvh);

    for (let k of kats) k.show();

    showFR(g2);
}