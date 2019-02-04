// In 3D scenes, notice the difference between s and g3

// let angle = 2.4;
let speed = -0.002;

// scenes 23 and 24
const Scene23 = function(s) {
    let time = {
        three_to_two: frames(2),
        fn: frames(4),
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
        showFR(s);
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
        eqs: frames(2),
        three_to_two: frames(3),

        moveCam: frames(4),
        inverse_2d: frames(7),
        kat: frames(7),

        grid: frames(8),
        gridLines: frames(9),
        gridPt: frames(10)
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
        showFR(s);
    };
};

let p = new p5(Scene27);