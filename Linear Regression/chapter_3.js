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
        pics: frames(3),
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

const Scene23a = function (s) {
    let tnr;
    s.preload = function () {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        s.frameRate(fr);
        s.createCanvas(cvw, cvh);
        let xo = -357, yo = 177;
        s.eqs = new Sys_3Eqs(s, {
            x: 1147 + xo, y: 40 + yo,
            move1: 1, move2: 2, move3: 3, move4: 10000, mode: 1, font: tnr, start: frames(1),
        });
        s.kat = new Katex(s, {
            x: 787 + xo, y: 64 + yo, text: "X^T =",
        });
    };
    s.draw = function () {
        s.background(0);
        s.kat.show();
        s.eqs.show();
    };
}

// scene 23
const Scene23 = function(s) {
    let time = {
        ar: frames(2),
        grid: frames(3)
    };
    let g3, tnr;
    let obj = [];
    s.preload = function () {
        obj[0] = s.loadModel('../lib/obj/axes.obj');
    };
    s.setup = function () {
        setup3D(s);
        g3 = s.createGraphics(600 * 2, 600 * 2, s.WEBGL);
        s.axes = new Axes3D(s, {
            angle: 1, camRadius: 700, model: obj[0]
        });
        s.arrow = new Arrow(s, {
            y1: 317, y2: 317, x1: 607, x2: 647, start: time.ar, strokeweight: 4,
            color: s.color(255, 255, 0)
        })
        s.grid = new Grid(s, {
            left: 675, centerX: 937, start: time.grid
        });
        s.arrs = new Arrows_Transform(s, {
            time: time, start: time.three_to_two, showBasis: true, //showX: true,
        });
    };
    s.draw = function () {
        s.background(0);
        s.axes.show(g3);
        s.grid.showGrid();
        s.arrow.show();
        s.image(g3, 0, 37, 600, 600);
    };
};

// scenes 23 and 24
const Scene24 = function(s) {
    let time = {
        xt: frames(2),
        three_to_two: frames(11),
        fn: frames(21),
        fnEnd: frames(26)
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
        s.kat = new Katex(s, {
            x: 787, y: 64, text: "X^T =", fadeIn: true, start: time.xt
        });
        s.grid = new Grid3D_Transform(s, {
            mat: stdToP5(
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
            size: 27, mode: 1, x: 600, y: 627, start: time.fn, end: time.fnEnd
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
        s.kat.show();
        //showFR(s);
    };
};

// scene 25
const Scene25 = function(s) {
    let time = {
        kat: frames(7), // 7
        x_T: frames(12),
        three_to_two: frames(19),
        katT: frames(22),
    };
    let g3;
    let tnr;
    let kat = [];
    let obj = [];
    s.arrows = [];

    s.preload = function () {
        obj[0] = s.loadModel('../lib/obj/axes.obj');
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup3D(s);
        g3 = s.createGraphics(cvw * 2, cvh * 2, s.WEBGL);
        s.mask = new Rect(s, {
            x: 600, y: 0, w: 427, h: 400, start: 1, end: time.x_T, color: [0, 0, 0, 255]
        });
        s.grid = new Grid3D_Transform(s, {
            mat: stdToP5(
                [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5], 0, 0, 0]),
            start: time.three_to_two, numLines: 2, lineLen: 197
        });
        s.eqs = new Sys_3Eqs(s, {
            x: 540, y: 67,
            move1: 1, move2: 2,
            move3: 3, move4: time.three_to_two,
            mode: 3,
            font: tnr,
            start: frames(1),
        });
        s.pl = new Plane3D(s, {
            a: 0, b: 0, c: 0
        });
        s.axes = new Axes3D(s, {
            angle: 0, speed: speed,
            model: obj[0]
        });
        s.arrs = new Arrows_Transform(s, {
            start: time.three_to_two,
            showBasis: true,
            showY: true
        });
        kat[0] = new Katex(s, {
            text: "\\textcolor{17a7e7}{\\vec{y}}=" +
                target[0] + "\\textcolor{ffaaaa}{\\hat{\\imath}}+" +
                target[1] + "\\textcolor{aaffaa}{\\hat{\\jmath}}+" +
                target[2] + "\\textcolor{aaaaff}{\\hat{k}}",
            x: 77, y: 0, font_size: 30, fadeIn: true, start: time.kat, fadeOut: true, end: time.katT
        });
        kat[1] = new Katex(s, {
            text: "T(\\textcolor{17a7e7}{\\vec{y}})=" +
                target[0] + "~T(\\textcolor{ffaaaa}{\\hat{\\imath}})+" +
                target[1] + "~T(\\textcolor{aaffaa}{\\hat{\\jmath}})+" +
                target[2] + "~T(\\textcolor{aaaaff}{\\hat{k}})",
            x: 37, y: 0, font_size: 30, fadeIn: true, start: time.katT,
        })
    };

    s.draw = function () {
        s.background(0);
        s.eqs.show();
        s.mask.show();
        s.axes.show(g3);
        s.arrs.show(g3);
        s.grid.show(g3);
        s.pl.showPlane(g3);
        s.image(g3, 0, 0, cvw, cvh);
        for (let k of kat) k.show();
        //showFR(s);
    };
};

// scene 26
const Scene26 = function(s) {
    let time = {
        three_to_two: frames(16),
        x_T: frames(13),
    };
    let g3;
    let tnr;
    let obj = [];
    s.preload = function () {
        obj[0] = s.loadModel('../lib/obj/axes.obj');
        tnr = s.loadFont('../lib/font/times.ttf');
    };

    s.setup = function () {
        s.frameRate(fr);
        s.pixelDensity(1);
        s.createCanvas(cvw, cvh);
        g3 = s.createGraphics(cvw * 2, cvh * 2, s.WEBGL);
        s.mask = new Rect(s, {
            x: 600, y: 0, w: 367, h: 400, start: 1, end: time.x_T, color: [0, 0, 0, 255]
        });
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
            angle: 0.6, speed: speed,
            model: obj[0]
        });
        s.arrs = new Arrows_Transform(s, {
            start: time.three_to_two,
            showBasis: true,
            showX: true
        });
    };

    s.draw = function () {
        s.background(0);
        s.eqs.show();
        s.mask.show();
        s.axes.show(g3);
        s.arrs.show(g3);
        s.pl.showPlane(g3);
        s.image(g3, 0, 0, cvw, cvh);
        //showFR(s);
    };
};

// scene 27
const Scene27 = function(s) {
    let SN = 1;  // used for thumbnail
    let time = {
        eqs: 1,
        empxtl: frames(10.7),
        empx: frames(12.7),
        empxtr: frames(16.7),
        empy: frames(18.4),
        three_to_two: frames(22.8),
        moveCam: frames(32),

        inverse_2d: frames(38.7),
        grid: frames(48),
        gridLines: frames(50),
        gridPt: frames(56.7)
    };

    let g3;
    let tnr;
    let obj = [];

    s.preload = function () {
        obj[0] = s.loadModel('../lib/obj/axes.obj');
        tnr = s.loadFont('../lib/font/times.ttf');
    };

    s.setup = function () {
        setup3D(s);
        g3 = s.createGraphics(cvw * 2, cvh * 2, s.WEBGL);
        if (SN === 1)
            s.gd = new Grid3D(s, { numLines: 2, lineLen: 197, strokeweight: 4.7 });
        //if (SN === 1)
            //s.txt = new Text(s, { str: "Normal Equations", mode: 1, x: 627, y: 77, size: 97 });
        s.eqs = new Sys_3Eqs(s, {
            x: 387, y: 467,
            move1: 1, move2: 4,
            move3: 9, move4: time.three_to_two, move5: time.inverse_2d,
            empx: time.empx, empy: time.empy, empxtl: time.empxtl, empxtr: time.empxtr,
            font: tnr,
            start: time.eqs, //end: time.kat
        });
        s.pl = new Plane3D(s, {
            a: 0, b: 0, c: 0
        });
        s.axes = new Axes3D(s, {
            angle: 4, speed: speed,
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
    };

    s.draw = function () {
        s.background(0);
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
        if (SN === 1) {
            s.gd.showGrid(g3);
            s.txt.show();
        }
        //s.grid.show();
        s.image(g3, 0, 0, cvw, cvh);
        //showFR(s);
    };
};

// scene 28
const Scene28 = function(s) {
    let time = {
        showY: frames(5),
        three_to_two: frames(10),
        moveCam: frames(10),
        inverse_2d: frames(15),
        txt: frames(17),
    };

    let g3, times;
    let obj = [];

    s.preload = function () {
        obj[0] = s.loadModel('../lib/obj/axes.obj');
        times = s.loadFont('../lib/font/times.ttf');
    };

    s.setup = function () {
        setup3D(s);
        g3 = s.createGraphics(cvw * 2, cvh * 2, s.WEBGL);

        s.eqs = new Beta_Formula(s, {
            x: 100, y: 100,
            move0: time.showY, move4: time.three_to_two, move5: time.inverse_2d,
        });

        s.pl = new Plane3D(s, { a: 0, b: 0, c: 0 });
        s.axes = new Axes3D(s, {
            angle: 2.5, speed: speed,
            model: obj[0]
        });
        s.txt = new TextFade(s, {
            str: "Reminder: applying a transformation\n" +
                "means left multiplying by a matrix",
            font: times, start: time.txt, x: 877, y: 77, size: 27, mode: 1
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
        s.txt.show();
        s.arrs.show(g3);
        s.pl.showPlane(g3);
        s.image(g3, 0, 0, cvw, cvh);
        //showFR(s);
    };
};

// SEE HERE FOR MATRIX SPECS
const Scene29 = function(s) {
    let time = {
        xy: frames(2),
        txt1: frames(6),
        txt1e: frames(10),
        to4: frames(13),
        txt2: frames(15),
        txt3: frames(19),
        txt3e: frames(21.7),
        txt2e: frames(22.7),
        brain: frames(22.7),
        shift: frames(22.7),
        eq: frames(26.7),
        // emp: frames(10), // emphasize formula
    }
    let tnr, comic;
    s.txt = []; s.kat = []; s.bl = []; s.br = []; s.box = [];
    let x = 327, y = 217;  // the coordinates specifying the matrix location (upper-left)
    let x1 = 637;
    let dx = 297;

    s.preload = function() {
        comic = s.loadFont('../lib/font/comic.ttf');
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.hg = new HelperGrid(s, {});
        s.kat[0] = new Katex(s, {
            x: x - 107, y: 240, text: "X="
        });
        s.kat[1] = new Katex(s, {
            x: x1 - 97, y: 240, text: "\\vec{y}="
        });
        s.kat[2] = new Katex(s, {
            x: 417, y: -100, text: "\\vec{b}=(X^T X)^{-1} X^T \\vec{y}"
        });
        s.txt[0] = new TextFade(s, {
            str: "   3 data points\n= 3 dimensions",
            x: 757, y: 247, start: time.txt1, end: time.txt1e, font: tnr, color: [255, 255, 255]
        });
        s.txt[1] = new TextFade(s, {
            str: "the 4th dimension", x: 797, y: 400, start: time.txt2, end: time.txt2e, font: tnr,
        });
        s.txt[2] = new TextFade(s, {
            str: "...unless if you're a string theorist :)",
            x: 847, y: 640, start: time.txt3, end: time.txt3e, size: 24, font: tnr,
        });
        s.arr = new Arrow(s, {
            x1: 787, x2: 727, y1: 422, y2: 422, start: time.txt2, end: time.txt2e,
        })
        s.bl[0] = new Bracket(s, { x1: x, y1: y, x2: x, y2: y + 167, start: time.xy, });
        s.br[0] = new Bracket(s, { x1: x + 137, y1: y + 167, x2: x + 137, y2: y, start: time.xy });
        s.bl[1] = new Bracket(s, { x1: x1, y1: y, x2: x1, y2: y + 167, start: time.xy, });
        s.br[1] = new Bracket(s, { x1: x1 + 77, y1: y + 167, x2: x1 + 77, y2: y, start: time.xy });
        s.x0 = new TextFade(s, {
            x: x + 17, y: y, str: "1\n1\n1\n1\n", font: tnr, color: [255, 77, 97], size: 47,
            start: time.xy
        });
        s.x1 = new TextFade(s, {
            x: x + 84, y: y, str: "-1\n 1\n 2\n 4\n", font: tnr, color: [77, 217, 77], size: 47,
            start: time.xy
        });
        s.y = new TextFade(s, {
            x: x1 + 17, y: y, str: "-2\n 0\n 3\n 7\n", font: tnr, color: [77, 177, 255], size: 47,
            start: time.xy
        });
        s.box[0] = new Rect(s, {
            x: x + 20, w: 100, y: 400, h: 47, color: [0, 0, 0, 255], end: time.to4,
        });
        s.box[1] = new Rect(s, {
            x: x1 + 20, w: 50, y: 400, h: 47, color: [0, 0, 0, 255], end: time.to4,
        });
        s.brain = new ThoughtBrain(s, {
            start: time.brain,
            font: comic, x: 57, y: 537,
            size: 248, font_size: 34,
            str: "The matrix algebra\nstill works out",
            bubbleStart: time.bubble,
        })
    }
    s.draw = function () {
        if (s.frameCount === time.to4) {
            for (let b of s.bl) b.shift(0, 0, 0, 63, 1);
            for (let b of s.br) b.shift(0, 63, 0, 0, 1);
            s.kat[0].shift(0, 27);
            s.kat[1].shift(0, 27);
        }
        if (s.frameCount === time.shift) {
            for (let b of s.bl) b.shift(dx, 0, dx, 0, 1);
            for (let b of s.br) b.shift(dx, 0, dx, 0, 1);
            s.x0.shift(dx, 0, 1);
            s.x1.shift(dx, 0, 1);
            s.y.shift(dx, 0, 1);
            s.kat[0].shift(dx, 0);
            s.kat[1].shift(dx, 0);
        }
        if (s.frameCount === time.eq) {
            s.kat[2].shift(0, 127);
        }
        s.background(0);
        for (let t of s.txt) t.show();
        for (let k of s.kat) k.show();
        //s.hg.show();
        for (let b of s.bl) b.show();
        for (let b of s.br) b.show();
        s.x0.show();
        s.x1.show();
        s.y.show();
        for (let b of s.box) b.show();
        s.arr.show();
        s.brain.show();
    }
};

const Scene30 = function(s) {
    let time = {
        start: frames(0.1),
        xT: frames(3),
        inv: frames(5),
        emp: [frames(10), frames(12), frames(13)],
    };
    s.setup = function () {
        setup2D(s);
        //s.h = new HelperGrid(s, {});
        s.n = new Normal_Eqs(s, {
            x: 507, y: 147,
            start: time.start, move3: time.xT, move6: time.inv, //emp: time.emp
        })
    };
    s.draw = function () {
        s.background(0);
        //s.h.show();
        s.n.show();
    };
};

const SceneEnd = function(s) {
    let time = {
        brain: frames(1),
        bubble: frames(2),
    };
    let emoji, comic;
    s.preload = function() {
        comic = s.loadFont('../lib/font/comic.ttf');
        emoji = s.loadFont('../lib/font/emoji.ttf');
    };
    s.setup = function() {
        setup2D(s);
        s.brain = new ThoughtBrain(s, {
            start: time.brain,
            x: 67, y: 532, size: 267,
            font: comic, str: "Thanks for watching!\nPlease like and subscribe!", font_size: 28,
            bubbleStart: time.bubble,

            emoji: emoji,
           // bulbStart: time.bulb
        });
    };
    s.draw = function() {
        s.background(0);
        s.brain.show();
    }
};

function getT(t) {
    if (t === undefined) {
        return 10000;
    } else
        return t;
}

let p = new p5(Scene27);

// fixme: the audio volume doesn't change for 1+?