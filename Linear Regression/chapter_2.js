// Chapter 2, Overdetermined System of Equations

function Scene12(s) {  // 3d multiple regression; also used for scene 34
    let time = {
        eq: frames(8),
        plane: frames(9.4)
    };
    let obj;
    let kat, tnr;
    let g3;

    s.preload = function () {
        obj = s.loadModel('../lib/obj/axes.obj');
        tnr = s.loadFont('../lib/font/times.ttf');
    };

    s.setup = function () {
        setup3D(s);
        g3 = s.createGraphics(cvw * 2, cvh * 2, s.WEBGL);  // a square to be displayed to the left

        s.axes = new MR_Plane(s, {
            model: obj,
            angle: 0, startPlane: time.plane
        });
        kat = new Katex(s, {
            text: "\\hat{y} = \\hat{\\beta_0} + \\hat{\\beta_1}x_1 + \\hat{\\beta_2}x_2",
            x: 50, y: 20, start: time.eq
        });
        s.txt = new Text(s, {  // for Ch. 4 thumbnail
            str: "Multiple Regression", font: tnr,
            x: 77, y: 237, size: 127
        });
        //s.d = new Dragger(s, [s.txt]);
    };

    s.draw = function () {
        s.background(0);
        s.axes.showPlane(g3);
        s.image(g3, 0, 0, cvw, cvh);
        s.txt.show();
        //s.d.show();
        //showFR(g2);
        kat.show();
    }
}

const Scene13 = function(s) {
    let time = {
        title: frames(1),
        chaps: frames(2),
        chap4: frames(4),
        chap2: frames(6),
    };

    s.txts = [];
    let times;
    let yt;

    // stores the YouTube logos
    s.imgs = [];
    s.emps = [];

    s.preload = function() {
        times = s.loadFont('../lib/font/times.ttf');
        yt = s.loadImage('../lib/img/youtube_logo.webp');
        //yt = s.loadImage('../lib/img/Simple_light_bulb.webp');
    };

    let xOffset = 277;
    let timeOffset = time.chaps;
    let timeStep = 3;
    let yOffset = 77;
    let yStep = 57;

    s.setup = function() {
        s.frameRate(fr);
        s.createCanvas(cvw, cvh);

        s.hg = new HelperGrid(s, {});

        let i = 0;
        for (let j = 0; j < 8; j++) {
            let args = {
                img: yt, start: timeOffset + j * timeStep - 7, duration: 0.77, mode: 1,
                x: 177, y: j * yStep + yOffset + 44,
                w: 117, h: 67
            };
            s.imgs[j] = new ImageFly(s, args);
        }

        // emphasize chapter 4
        s.emps[0] = new Emphasis(s, {
            x: 270, y: 302, w: 480, h: 49,
            start: time.chap4, end: time.chap2 - 15
        });

        // emphasize chapter 2
        s.emps[1] = new Emphasis(s, {
            x: 270, y: 190, w: 730, h: 49,
            start: time.chap2
        });

        s.txts[i++] = new TextFade(s, {
            str: "Chapter 1: Simple Linear Regression, Visualized",
            font: times, start: timeOffset + i * timeStep, x: xOffset, y: i * yStep + yOffset,
        });
        s.txts[i++] = new TextFade(s, {
            str: "Chapter 2: Overdetermined System of Equations",
            font: times, start: timeOffset + i * timeStep, x: xOffset, y: i * yStep + yOffset,
            color: [47, 247, 77]
        });
        s.txts[i++] = new TextFade(s, {
            str: "Chapter 3: The Normal Equation, Visualized",
            font: times, start: timeOffset + i * timeStep, x: xOffset, y: i * yStep + yOffset,
        });
        s.txts[i++] = new TextFade(s, {
            str: "Chapter 4: Multiple Regression",
            font: times, start: timeOffset + i * timeStep, x: xOffset, y: i * yStep + yOffset,
        });
        s.txts[i++] = new TextFade(s, {
            str: "Chapter 5: Least Squares",
            font: times, start: timeOffset + i * timeStep, x: xOffset, y: i * yStep + yOffset,
        });
        s.txts[i++] = new TextFade(s, {
            str: "Chapter 6: The Projection Matrix",
            font: times, start: timeOffset + i * timeStep, x: xOffset, y: i * yStep + yOffset,
        });
        s.txts[i++] = new TextFade(s, {
            str: "Chapter 7: Gram-Schmidt and QR Factorization",
            font: times, start: timeOffset + i * timeStep, x: xOffset, y: i * yStep + yOffset,
        });
        s.txts[i++] = new TextFade(s, {
            str: "......",
            font: times, start: timeOffset + i * timeStep, x: xOffset, y: i * yStep + yOffset,
        });

        // title
        s.txts[i++] = new TextWriteIn(s, {
            str: "Linear Regression",
            font: times, start: time.title,
            x: 427, y: 47, size: 47,
        });
        s.l = new Line(s, {
            x1: 427, y1: 97,
            x2: 771, y2: 97,
            mode: 0, start: time.title, duration: 17,
            color: s.color(77, 177, 247), strokeweight: 2,
        })
    };

    s.draw = function() {
        s.background(0);
        s.l.show();
        //s.hg.show();
        for (let e of s.emps) e.show();
        for (let t of s.txts) t.show();
        for (let i of s.imgs) i.show();
        //showFR(s);
    }
};

// scene 13.2
const Scene13b = function(s) {
    let time = {
        brain: frames(2),
        bubble: frames(2.5),
    };

    let hg;
    let font;
    let brain;

    s.preload = function() {
        font = s.loadFont('../lib/font/comic.ttf');
    };

    s.setup = function() {
        s.createCanvas(1200, 675);

        hg = new HelperGrid(s);

        brain = new ThoughtBrain(s, {
            start: time.brain,
            font: font,
            size: 400, font_size: 54,
            str: "Time for\n" +
                "linear algebra!",
            bubbleStart: time.bubble
        });

    };

    s.draw = function() {
        s.background(0);
        //hg.show();
        //text1.show();
        //bubble.show();
        brain.show();
    }
};

const Scene14 = function(s) {

    let time = {
        plot: frames(2),
        table: frames(2),
        formula: frames(6),
        eqs: frames(11)
    };

    let times;
    let table;
    let kats = [];
    let eqs;

    s.preload = function () {
        times = s.loadFont('../lib/font/times.ttf');
    };

    s.setup = function() {
        s.frameRate(fr);
        s.createCanvas(cvw, cvh);

        table = new Table(s, {
            x: 797, y: 57,
            xs: target, ys: [matrix[3], matrix[4], matrix[5]],
            start: getT(time.table),
            font: times,
            colorX: [77, 217, 77], colorY: [77, 177, 255],
            size: 47, sizeX: 47
        });

        eqs = new Sys_3Eqs(s, {
            x: 757, y: 357,
            start: time.eqs,
            show1s: 10000
        });

        kats[0] = new Katex(s, {
            text: "\\beta_0+{\\beta}x=y",
            x: 777, y: 177,
            start: time.formula,
            fadeIn: true,
            font_size: 47,
            fadeOut: true,
            //end: getT(time.formulaFadeOut)
        });

        s.plot = new LS_Plot(s, {
            xs: [matrix[3], matrix[4], matrix[5]],
            ys: target,
            left: 0,
            centerX: 270,
            right: 597,
            labelX: "x",
            labelY: "y",
            stepX: 100,
            stepY: 100,
            start: time.plot,
            startLSLine: time.formula,
            lineColor: s.color(255, 137, 77),
            showSq: false
        });


    };

    s.draw = function() {
        s.background(0);
        s.plot.show();
        table.show();
        eqs.show();
        for (let k of kats) k.show();
    };
}


// scenes 15
const Scene15 = function (s) {
    let SN = 1;
    let time = SN === 0 ? {
        eqs: 1,
        moveEqs: frames(2),
        grid: frames(8),
        lines: frames(10),
        empb0: frames(18),
        empb: frames(19),
        brain: frames(21),

        empEnd: frames(100),
    } : {
        eqs: 1, moveEqs: 1, grid: frames(1),

        lines: frames(4),
        txt: frames(6),
        txtEnd: frames(10),
        brain: frames(11),

        empb0: frames(100), empb: frames(100), empEnd: frames(100),
    };

    let grid;
    let comic;
    let times;
    let brain;
    let txts = [];
    let emps = [];

    s.preload = function () {
        times = s.loadFont('../lib/font/times.ttf');
        comic = s.loadFont('../lib/font/comic.ttf');
    };

    s.setup = function () {
        s.frameRate(fr);
        s.createCanvas(cvw, cvh);
        grid = new Grid_3Lines_With_Point(s, {
            left: 570, right: 1200, centerX: 900,
            labelX: "\\beta_0", offsetX: -45,
            labelY: "\\beta", offsetY: -38,
            stepX: 100, stepY: 100,
            start: getT(time.grid), time: time
        });

        brain = new ThoughtBrain(s, {
            start: getT(time.brain),
            x: 57, y: 537,
            size: 248,
            font: comic,
            str: SN === 0 ? "Not the usual\nx-y coordinates..." : "No solution..."
        });

        s.eqs = new Sys_3Eqs(s, {
            font: times,
            x: 757, y: 357,
            start: getT(time.eqs),
            show1s: 10000
        });

        txts[0] = new TextFade(s, {
            font: times,
            start: getT(time.txt), end: time.txtEnd,
            mode: 1, size: 42,
            x: 737, y: 137,
            str: "No common\nintersection"
        });
        emps[0] = new Emphasis(s, {
            x: 1150, y: 283, w: 47, h: 50,
            start: time.empb0, end: time.empEnd
        });
        emps[1] = new Emphasis(s, {
            x: 912, y: 2, w: 32, h: 57,
            start: time.empb, end: time.empEnd
        });
    };

    s.draw = function () {
        s.background(0);
        grid.show();
        brain.show();

        s.eqs.show();

        for (let t of txts) t.show();
        for (let e of emps) e.show();
        if (s.frameCount === getT(time.moveEqs))
            s.eqs.move(124, 127);

        //showFR(s);
    }
};


const Scene16 = function (s) {   // need to change fr to 60 for this scene
    let SN = 0;
    let time = SN === 0 ? {
        grid: frames(.1),
        pt: frames(4),
        line: frames(6),
        plot: frames(7),

        vec: frames(15),
        kat: frames(17),
    } : {
        grid: 1,
        plot: frames(3),

        pt: frames(4),
        vec: frames(4),
        kat: frames(4),
    };
    let comic;
    let times;
    let txts = [];

    s.preload = function () {
        times = s.loadFont('../lib/font/times.ttf');
        comic = s.loadFont('../lib/font/comic.ttf');
    };

    s.setup = function () {
        s.frameRate(fr);
        s.createCanvas(cvw, cvh);
        s.grid = new Grid_b0b(s, {
            left: 570,
            right: 1200,
            centerX: 900,
            labelX: "\\beta_0",
            offsetX: -45,
            labelY: "\\beta",
            offsetY: -38,
            stepX: 100,
            stepY: 100,
            start: getT(time.grid),
            time: time
        });

        s.plot = new LS_Plot(s, {
            xs: [matrix[3], matrix[4], matrix[5]],
            ys: target,
            left: 0,
            centerX: 270,
            right: 564,
            labelX: "x",
            labelY: "y",
            stepX: 100,
            stepY: 100,
            showSq: false, startLSLine: time.line, start: time.plot
        });
    };

    s.draw = function () {
        s.background(0);
        s.grid.show();
        s.plot.show();
        for (let t of txts) t.show();
        //showFR(s);
    }
};


const Scene17 = function(s) {   // scene 17
    let time = {
        axes: 1, points: 1, leastSqLine: 2, grid: 1, lines: 1,

        move: frames(5),
        exact: frames(7), // the point
        txt: frames(8),
        arrow: frames(8)
    };

    let times;
    s.preload = function () {
        times = s.loadFont('../lib/font/times.ttf');
    };

    s.setup = function() {
        s.frameRate(fr);
        s.createCanvas(cvw, cvh);

        s.plot = new SLR_Plot_2(s, {
            left: 0,
            centerX: 270,
            right: 564,
            stepX: 100,
            stepY: 100,
            labelX: "x", labelY: "y",
            start: getT(time.axes),
            startPt: getT(time.points),
            startLSLine: getT(time.leastSqLine),
            xs: [-1, 1, 2], ys: [-2, 0, 3]
        });
        s.grid = new Grid_3Lines_Transform(s, {
            left: 570,
            right: 1200,
            centerX: 900,
            labelX: "\\beta_0",
            offsetX: -45,
            labelY: "\\beta",
            offsetY: -38,
            stepX: 100,
            stepY: 100,
            start: getT(time.grid),
            time: time
        });
        s.txt = new TextFade(s, {
            font: times,
            start: getT(time.txt), // end: time.txtEnd,
            mode: 2, size: 42,
            x: 827, y: 237,
            str: "Exact solution exists"
        });
        s.arrow = new Arrow(s, {
            x1: 837, y1: 257, x2: 879, y2: 240,
            start: time.arrow, // duration: frames(0.7)
        })
    }

    s.draw = function() {
        s.background(0);

        s.plot.show();
        s.grid.show();
        s.txt.show();
        s.arrow.show();
        if (s.frameCount === getT(time.move)) {
            s.plot.reset();
            s.grid.move();
        }
        //showFR(s);
    }
};

const Scene18 = function (s) {
    let SN = 1;   // used for Scene 22
    let time = SN === 0 ? {
        eqs: 1,
        grid: 1,
        lines: 1,
        overdet: frames(7),
        brain: frames(14),
        point: frames(19),
        vec: frames(19),
    } : {
        eqs: 1,
        grid: 1,
        lines: frames(3),
        overdet: frames(6),
        txt: frames(6),
        brain: frames(9),
        point: frames(9),
        vec: frames(9),
    };

    let grid;
    let comic;
    let times;
    let brain;

    s.preload = function () {
        times = s.loadFont('../lib/font/times.ttf');
        comic = s.loadFont('../lib/font/comic.ttf');
    };

    s.setup = function () {
        s.frameRate(fr);
        s.createCanvas(cvw, cvh);
        grid = new Grid_3Lines_With_Point(s, {
            left: 570, right: 1200, centerX: 900,
            labelX: "\\beta_0", offsetX: -45,
            labelY: "\\beta", offsetY: -38,
            stepX: 100, stepY: 100,
            start: getT(time.grid), time: time
        });

        brain = new ThoughtBrain(s, {
            start: getT(time.brain),
            x: 427, y: 537,
            size: 257,
            font: comic,
            str: "\"closest solution\""
        });

        s.eqs = new Sys_3Eqs(s, {
            font: times,
            x: 124, y: 127,
            start: getT(time.eqs),
            show1s: 10000
        });

        s.txt = new TextFade(s, {
            font: times,
            start: getT(time.overdet),
            mode: 1, size: 47,
            x: 300, y: 377,
            str: "Overdetermined\nSystem of equations"
        })
        s.txt2 = new TextFade(s, {
            font: times,
            start: time.txt, end: time.txtEnd,
            mode: 1, size: 42,
            x: 737, y: 137,
            str: "No common\nintersection"
        });
    };

    s.draw = function () {
        s.background(0);
        grid.show();
        brain.show();
        s.eqs.show();
        s.txt.show();
        s.txt2.show();
        //showFR(s);
    }
};

const Scene18b = function(s) {
    let times;
    s.preload = function() {
        times = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function() {
        s.frameRate(fr);
        s.createCanvas(cvw, cvh);
        s.eqs = new Sys_3Eqs(s, {
            x: 124, y: 127,
            start: 1, font: times, show1s: 100000,
        });
    };
    s.draw = function() {
        s.background(0);
        if (s.frameCount === frames(2))
            s.eqs.move(427, 227);
        s.eqs.show();
    }
};

const Scene19 = function(s) {
    let SN = 1;
    let time = SN === 0 ? {
        eqs: 1,
        text: frames(2),
        show1s: frames(9),
        neq: frames(11),
        move1: frames(11),
        move2: frames(11) + 1,
        move3: frames(15),
        move4: frames(23),
        fn: frames(26),
        fnEnd: frames(28.5)
    } : {
        eqs: 1,
        text: 1,
        show1s: 1,
        neq: 1,
        move1: 2,
        move2: 3,
        move3: 10,
        move4: frames(5),
        fn: frames(26),
        fnEnd: frames(28.5)
    };

    let times;
    let hg;
    let txt = [];

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
        txt[0] = new TextFade(s, {
            str: "Normal Equations", mode: 1, font: times, size: 57,
            x: 600, y: 100, start: time.text
        });
        txt[1] = new TextFade(s, {
            str: "* The plural \"equations\" in \"normal equations\" " +
                "\nindicates it's usually a system of many linear equations",
            font: times, size: 27, mode: 1,
            x: 600, y: 627, start: time.fn, end: time.fnEnd
        })
    };

    s.draw = function() {
        s.background(0);
        //hg.show();
        txt[0].show();
        txt[1].show();
        s.eqs.show();
        s.neq.show();
        //showFR(s);
    }
};

const Scene20 = function(s) {
    let time = {
        brain: frames(1),
        bulb: frames(2),
        bubble: frames(4),
    };
    let hg;
    let comic;
    let emoji;
    s.preload = function() {
        comic = s.loadFont('../lib/font/comic.ttf');
        emoji = s.loadFont('../lib/font/emoji.ttf');
    };
    s.setup = function() {
        s.frameRate(fr);
        s.createCanvas(1200, 675);
        hg = new HelperGrid(s);
        s.brain = new ThoughtBrain(s, {
            start: time.brain,
            font: comic, size: 400, font_size: 45,
            str: "Non-square matrix as\nlinear transformation!",
            bubbleStart: time.bubble,

            emoji: emoji,
            bulbStart: time.bulb
        });
    };
    s.draw = function() {
        s.background(0);
        s.brain.show();
    }
};

const Credit2 = function (s) {
    let txts = [];
    let times;
    s.preload = function () {
        times = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function() {
        s.frameRate(fr);
        s.createCanvas(1200, cvh);
        s.background(0);
        txts[0] = new TextWriteIn(s, {
            str: "Inspired By: 3Blue1Brown, The Coding Train, and so many other wonderful YouTubers\n" +
                "Source Code (written in p5.js): https://github.com/JazonJiao/Essence-Linear-Regression\n",
            x: 34, y: 57,
            size: 32,
            font: times,
            start: frames(2)
        });
        txts[1] = new TextFade(s, {
            str: "Nonsquare matrices as transformations between dimensions | " +
                "Essence of linear algebra, chapter 8 (by 3Blue1Brown)",
            mode: 1, x: 600, y: 37,
            size: 24,
            font: times,
            start: frames(2)
        })
    };
    s.draw = function() {
        s.background(0);
        txts[0].show();
    }
};

function getT(t) {
    if (t === undefined) {
        return 10000;
    } else
        return t;
}

let p = new p5(Scene12);
