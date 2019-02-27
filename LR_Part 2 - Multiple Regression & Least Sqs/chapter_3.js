// Chapter 3, Normal Equations and 3d-to-2d Transformations
// In 3D scenes, notice the difference between s and g3

// let angle = 2.4;
let speed = -0.002;

const Scene21 = function(s) {
    let SN = 0;
    let time = SN === 0 ? {
        eqs: 1,

        show1s: frames(3.5),
        neq: frames(5),
        move1: frames(5),
        move2: frames(5) + 1,

        emp: frames(9),
        empEnd: frames(150),
        move3: frames(10000),
    } : {
        eqs: 1,
        text: frames(2),
        show1s: frames(9),
        neq: frames(11),
        move1: frames(11),
        move2: frames(11) + 1,
        move3: frames(15),
        move4: frames(23),
    };
    let times;
    let hg;
    let txt = [];
    let emps = [];
    s.preload = function() {
        times = s.loadFont('../lib/font/times.ttf');
    };

    s.setup = function() {
        s.background(0);
        s.frameRate(fr);
        s.createCanvas(cvw, cvh);
        hg = new HelperGrid(s, {});

        s.eqs = new Sys_3Eqs(s, {
            x: 427, y: 227,
            //time: time,
            start: time.eqs, show1s: time.show1s,
            move1: time.move1, move2: time.move2, move3: time.move3, move4: time.move4,
            font: times,
        });
        s.neq = new Normal_Eqs(s, {
            x: 527, y: 407,
            start: time.neq, move3: time.move3 + 2,
        });
        txt[0] = SN === 1 ? new TextFade(s, {
            str: "Normal Equations", mode: 1, font: times, size: 57,
            x: 600, y: 100, start: time.text
        }) : undefined;
        emps[0] = new Emphasis(s, {
            x: 562, y: 252, w: 67, h: 117,
            start: time.emp, end: time.empEnd,
        });
        emps[1] = new Emphasis(s, {
            x: 567, y: 443, w: 24, h: 47,
            start: time.emp, end: time.empEnd,
        });
    };

    s.draw = function() {
        s.background(0);
        for (let e of emps) e.show();
        //hg.show();
        for (let t of txt) if (t) t.show();
        s.eqs.show();
        s.neq.show();
        //showFR(s);
    }
};

const Scene22 = function(s) {
    let time = {
        pics: frames(1),
        logo_3b1b: frames(2),
    };
    s.imgs = [];
    let src = [], times;
    s.preload = function() {
        src[0] = s.loadImage('./img/2.webp');
        src[1] = s.loadImage('./img/3.webp');
        src[2] = s.loadImage('./img/4.webp');
        src[3] = s.loadImage('../lib/img/3b1b_logo.jpg');
        times = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function() {
        s.frameRate(fr);
        s.createCanvas(cvw, cvh);
        for (let i = 0; i < 3; i++) {
            s.imgs[i] = new ImageFade(s, {
                img: src[i], start: time.pics + i * 15, duration: 0.77, mode: 3,
                x: 127 + i * 327, y: 217, w: 297, h: 167,
            });
        }
        s.imgs[3] = new ImageGrow(s, {
            img: src[3], start: time.logo_3b1b, duration: 0.77,
            x: 347, y: 447, w: 57, h: 57
        });
        s.txt = new TextWriteIn(s, {
            str: "Essence of Linear Algebra",
            font: times, start: time.logo_3b1b, x: 437, y: 457, size: 37
        })
    };
    s.draw = function() {
        s.background(0);
        for (let i of s.imgs) i.show();
        s.txt.show();
    }
};

// scenes 23 and 24
const Scene23 = function(s) {
    let time = {
        three_to_two: frames(8),
        fn: frames(20),
    };

    let g3;
    let tnr;
    let txt;
    let obj = [];
    s.arrows = [];

    s.preload = function () {
        obj[0] = s.loadModel('../lib/obj/axes.obj');
        tnr = s.loadFont('../lib/font/times.ttf');
    };

    s.setup = function () {
        setup3D(s);
        g3 = s.createGraphics(cvw * 2, cvh * 2, s.WEBGL);

        s.eqs = new Sys_3Eqs(s, {
            x: 1147, y: 40,
            move1: 1, move2: 2,
            move3: 3, move4: 10000,
            mode: 1,
            font: tnr,
            start: frames(1),
        });
        s.grid = new Grid3D_Transform(s, {
            mat: //[1, -2, -1, 0, 0, 0, 1, -1, 1],
                stdToP5(
                    [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5], 0, 0, 0]),
            start: time.three_to_two,
            numLines: 2, lineLen: 197
        });
        s.pl = new Plane3D(s, {
            a: 0, b: 0, c: 0
        });
        s.axes = new Axes3D(s, {
            angle: 1, speed: speed,
            model: obj[0]
        });
        s.arrs = new Arrows_Transform(s, {
            time: time,
            start: time.three_to_two,
            showBasis: true,
            //showX: true,
        });

        txt = new TextFade(s, {
            str: "* This is one reason Grant (3b1b) didn’t \n" +
                "show the actual animation in his EoLA Chap 8 video",
            size: 27, mode: 1, x: 600, y: 627, start: time.fn
        })
    };

    s.draw = function () {
        s.background(0);
        s.axes.show(g3);
        s.eqs.show();
        s.grid.show(g3);
        s.arrs.show(g3);
        s.pl.showPlane(g3);
        s.image(g3, 0, 0, cvw, cvh);
        txt.show();
        //showFR(s);
    };

};

// scene 25
const Scene25 = function(s) {
    let time = {
        three_to_two: frames(7),
        kat: frames(2),
    };

    let g3;
    let tnr;
    let kat;
    let obj = [];
    s.arrows = [];

    s.preload = function () {
        obj[0] = s.loadModel('../lib/obj/axes.obj');
        tnr = s.loadFont('../lib/font/times.ttf');
    };

    s.setup = function () {
        setup3D(s);
        g3 = s.createGraphics(cvw * 2, cvh * 2, s.WEBGL);

        s.eqs = new Sys_3Eqs(s, {
            x: 540, y: 67,
            move1: 1, move2: 2,
            move3: 3, move4: time.three_to_two,
            mode: 3,
            font: tnr,
            start: frames(1),
        });
        s.grid;
        s.pl = new Plane3D(s, {
            a: 0, b: 0, c: 0
        });
        s.axes = new Axes3D(s, {
            angle: 2.4, speed: speed,
            model: obj[0]
        });

        s.arrs = new Arrows_Transform(s, {
            start: time.three_to_two,
            showBasis: true,
            showY: true
        });

        kat = new Katex(s, {
            text: "T(\\textcolor{17a7e7}{\\vec{y}})=" +
                target[0] + "~T(\\textcolor{ffaaaa}{\\hat{\\imath}})+" +
                target[1] + "~T(\\textcolor{aaffaa}{\\hat{\\jmath}})+" +
                target[2] + "~T(\\textcolor{aaaaff}{\\hat{k}})",
            x: 37, y: 0, font_size: 30,
            fadeIn: true, start: time.kat,
        })
    };

    s.draw = function () {
        s.background(0);
        s.axes.show(g3);
        s.arrs.show(g3);
        //s.grid.show(g3);
        s.pl.showPlane(g3);
        s.image(g3, 0, 0, cvw, cvh);
        kat.show();
        showFR(s);
    };
};

// scene 26
const Scene26 = function(s) {
    let time = {
        three_to_two: frames(7),
        kat: frames(2),
    };

    let g3;
    let tnr;
    let kat;
    let obj = [];
    s.arrows = [];

    s.preload = function () {
        obj[0] = s.loadModel('../lib/obj/axes.obj');
        tnr = s.loadFont('../lib/font/times.ttf');
    };

    s.setup = function () {
        s.frameRate(fr);
        s.pixelDensity(1);
        s.createCanvas(cvw, cvh);
        g3 = s.createGraphics(cvw * 2, cvh * 2, s.WEBGL);

        s.eqs = new Sys_3Eqs(s, {
            x: 977, y: 67,
            move1: 1, move2: 2,
            move3: 3, move4: time.three_to_two,
            mode: 2,
            font: tnr,
            start: frames(1),
        });

        s.pl = new Plane3D(s, {
            a: 0, b: 0, c: 0
        });
        s.axes = new Axes3D(s, {
            angle: 2.5, speed: speed,
            model: obj[0]
        });

        s.arrs = new Arrows_Transform(s, {
            start: time.three_to_two,
            showBasis: true,
            showX: true
        });

        kat = new Katex(s, {
            text: "",
            x: 37, y: 0, font_size: 30,
            fadeIn: true, start: time.kat,
        })
    };

    s.draw = function () {
        s.background(0);
        s.axes.show(g3);
        s.eqs.show();
        s.arrs.show(g3);
        s.pl.showPlane(g3);
        s.image(g3, 0, 0, cvw, cvh);
        kat.show();
        showFR(s);
    };
};

// scene 27
const Scene27 = function(s) {
    let time = {
        eqs: frames(1),
        three_to_two: frames(15),

        moveCam: frames(15),
        inverse_2d: frames(17),
        kat: frames(17),

        grid: frames(15),
        gridLines: frames(15),
        gridPt: frames(15)
    };

    let g3;
    let tnr;
    let kat;
    let obj = [];

    s.preload = function () {
        obj[0] = s.loadModel('../lib/obj/axes.obj');
        tnr = s.loadFont('../lib/font/times.ttf');
    };

    s.setup = function () {
        setup3D(s);
        g3 = s.createGraphics(cvw * 2, cvh * 2, s.WEBGL);

        s.eqs = new Sys_3Eqs(s, {
            x: 387, y: 467,
            move1: 1, move2: 4,
            move3: 9, move4: time.three_to_two, move5: time.inverse_2d,
            font: tnr,
            start: time.eqs, //end: time.kat
        });

        s.pl = new Plane3D(s, {
            a: 0, b: 0, c: 0
        });
        s.axes = new Axes3D(s, {
            angle: 2.5, speed: speed,
            model: obj[0]
        });

        s.arrs = new Arrows_Transform(s, {
            start: time.three_to_two,
            solve: time.inverse_2d,
            showY: true,
            showX: true
        });
        s.grid = new Grid_3Lines_With_Point(s, {
            centerX: 600,
            labelX: "\\beta_0",
            offsetX: -45,
            labelY: "\\beta",
            offsetY: -38,
            stepX: 80,
            stepY: 80,
            start: time.grid,
            time: {
                lines: time.gridLines,
                point: time.gridPt
            }
        });

        // kat = new Katex(s, {
        //     text: "b=\\begin{bmatrix}" +
        //         "-0.71 \\\\" +
        //         "1.57 \\\\" +
        //         "  \\end{bmatrix}",
        //     x: 37, y: 0, font_size: 30,
        //     fadeIn: true, start: time.kat,
        // })
    };

    s.draw = function () {
        s.background(0);
        s.grid.show();
        if (s.frameCount === time.moveCam) {
            s.axes.moveCam({
                camRadius: 0.01,
                angle: s.PI,
                speed: 0,
                camY: -737
            });
        }
        s.axes.show(g3);
        s.eqs.show();
        s.arrs.show(g3);
        s.pl.showPlane(g3);
        s.image(g3, 0, 0, cvw, cvh);
        //kat.show();
        // showFR(s);
    };
};

// scene 28
const Scene28 = function(s) {
    let time = {
        three_to_two: frames(3),

        moveCam: frames(4),
        inverse_2d: frames(7),
    };

    let g3;
    let obj = [];

    s.preload = function () {
        obj[0] = s.loadModel('../lib/obj/axes.obj');
    };

    s.setup = function () {
        setup3D(s);
        g3 = s.createGraphics(cvw * 2, cvh * 2, s.WEBGL);

        s.eqs = new Beta_Formula(s, {
            x: 100, y: 100,
            move4: time.three_to_two, move5: time.inverse_2d,
        });

        s.pl = new Plane3D(s, { a: 0, b: 0, c: 0 });
        s.axes = new Axes3D(s, {
            angle: 2.5, speed: speed,
            model: obj[0]
        });

        s.arrs = new Arrows_Transform(s, {
            start: time.three_to_two,
            solve: time.inverse_2d,
            showY: true,
            showX: true
        });
    };

    s.draw = function () {
        s.background(0);
        if (s.frameCount === time.moveCam)
            s.axes.moveCam({ camRadius: 0.01, angle: s.PI, speed: 0, camY: -737 });
        s.axes.show(g3);
        s.eqs.show();
        s.arrs.show(g3);
        s.pl.showPlane(g3);
        s.image(g3, 0, 0, cvw, cvh);
        showFR(s);
    };
};


let p = new p5(Scene22);