// 2019-01-06
// this class is quite similar to the Plane_Projection class in chapter 3.2;
// I could have used inheritance to reduce duplicate code.
class Plane_LinComb extends Plane3D {
    constructor(ctx, args) {
        super(ctx, args);
        this.Y = args.y;   // the y in Ax = y. A is passed in as args.mat, y is args.y
        this.step = args.step || 100;

        // x1; NOTE that the y-coordinate needs to be inverted, ditto others
        // Error log: used this.M, but this.M is already converted to p5 coordinates
        this.arrow1 = new Arrow3D(this.s, {
            to: [matrix[0] * this.step, matrix[1] * this.step, matrix[2] * this.step],
            color: this.s.color([237, 47, 47]),
            label: args.x_1,
        });
        // x2
        this.arrow2 = new Arrow3D(this.s, {
            to: [matrix[3] * this.step, matrix[4] * this.step, matrix[5] * this.step],
            color: this.s.color([37, 147, 37]),
            label: args.x_2,
            fcn: ((g) => {
                g.rotateZ(-this.s.PI / 2);
                g.rotateX(this.s.PI);
            })
        });

        // y
        this.arrow3 = new Arrow3D(this.s, {
            to: [this.Y[0] * this.step, this.Y[1] * this.step, this.Y[2] * this.step],
            color: this.s.color([27, 147, 227]),
            label: args.y_o,
            fcn: ((g) => {
                g.rotateZ(-this.s.PI / 2);
            })
        });

        // v = ax1 + bx2
        this.arrow4 = new Arrow3D(this.s, {
            to: [0, 0, 0],
            color: this.s.color([247, 217, 47])
        });

        // r = y - v, endpoint same as arrow3
        this.arrow5 = new Arrow3D(this.s, {
            to: [this.Y[0] * this.step, this.Y[1] * this.step, this.Y[2] * this.step],
            color: this.s.color([247, 27, 247]),
            // label: args.r_o,
            // fcn: ((g) => { g.rotateZ(PI / 2); })
        });


        this.lb = -1;  // lower bound for a, b
        this.ub = 1;   // upper bound for a, b
        this.textX = 700;
        this.textY = 200;
        this.textsize = 40;

        this.kat = new KatexTxt(this.s, {
            text: "\\textcolor{#f7e717}{\\vec{v}} = " +
                "~~~~~~~~\\textcolor{f76767}{x_1} + ~~~~~~~~\\textcolor{47f747}{x_2}",
            x: this.textX,
            y: this.textY,
            font_size: this.textsize
        });

        this.text1 = new Text(this.s, {
            str: "",
            font: args.font,
            x: this.textX + 79,
            y: this.textY + 34,
            size: this.textsize + 7
        });

        this.text2 = new Text(this.s, {
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
        let a = this.s.map(this.s.mouseX, 0, this.s.width, this.lb * this.step, this.ub * this.step);
        let b = this.s.map(this.s.mouseY, 0, this.s.height, this.ub * this.step, this.lb * this.step);
        let x = a * matrix[0] + b * matrix[3];
        let y = a * matrix[1] + b * matrix[4];
        let z = a * matrix[2] + b * matrix[5];
        this.arrow4.reset({
            to: [x, y, z]
        });
        this.arrow4.show(g);

        this.arrow5.reset({
            from: [x, y, z]
        });
        this.arrow5.show(g);
        this.kat.show();

        this.text1.reset({str: "" + (a / this.step).toFixed(2)});
        this.text1.show();
        this.text2.reset({str: "" + (b / this.step).toFixed(2)});
        this.text2.show();
    }
}

const Chap2Part1 = function (s) {
    let g3;
    let g2;

    let axes;
    let font;
    let hg;
    let arrows;
    let kats = [];
    let obj = [];

    s.preload = function () {
        obj[0] = s.loadModel('../lib/obj/axes.obj');
        obj[1] = s.loadModel('../lib/obj/x_1.obj');
        obj[2] = s.loadModel('../lib/obj/x_2.obj');
        obj[3] = s.loadModel('../lib/obj/y.obj');
        // obj[4] = loadModel('../lib/obj/r.obj');
        font = s.loadFont('../lib/font/times.ttf');
    };

    s.setup = function () {
        s.frameRate(fr);

        s.pixelDensity(1);
        s.createCanvas(cvw, cvh);
        g3 = s.createGraphics(cvh * 2, cvh * 2, s.WEBGL);  // a square to be displayed to the left
        g2 = s.createGraphics(100, 10);

        axes = new Axes3D(s, {
            angle: 0,
            model: obj[0]
        });

        hg = new HelperGrid(s);

        arrows = new Plane_LinComb(s, {
            mat: matrix,
            y: target,
            font: font,
            x_1: obj[1],
            x_2: obj[2],
            y_o: obj[3],
            // r_o: obj[4],
            size: 300
        });
        kats[0] = new KatexTxt(s, {
            text: "\\beta_0\\newline\\downarrow",
            x: 820, y: 87,

        });
        kats[1] = new KatexTxt(s, {
            text: "\\beta_1\\newline\\downarrow",
            x: 1020, y: 87,
        })
    };

    s.draw = function () {
        s.background(0);
        axes.show(g3);
        // g3.pointLight(147, 147, 147, 0, 1, 0);
        // g3.ambientLight(27, 27, 27);

        arrows.show(g3);
        //hg.show();

        s.image(g3, 0, 0, cvh, cvh);

        for (let k of kats) k.show();

        showFR(s, g2);
    };
};

new p5(Chap2Part1);
