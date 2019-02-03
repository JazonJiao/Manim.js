// Chapter 2, Overdetermined System of Equations

const Scene13 = function(s) {
    let time = {
        title: frames(1),
        chaps: frames(2)
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
    let timeStep = 5;
    let yOffset = 77;
    let yStep = 57;

    s.setup = function() {
        s.frameRate(fr);
        s.createCanvas(cvw, cvh);

        let i = 0;

        for (let j = 0; j < 8; j++) {
            let args = {
                img: yt, start: timeOffset + j * timeStep - 7, duration: 0.77, mode: 1,
                x: 177, y: j * yStep + yOffset + 44,
                w: 117, h: 67
            };
            s.imgs[j] = new ImageFly(s, args);
        }

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
        for (let t of s.txts) t.show();

        for (let i of s.imgs) i.show();
        showFR(s);
    }
};

const Scene13_2 = function(s) {
    let time = {
        brain: frames(0),
        bubble: frames(5),
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
        table: frames(3),
        formula: frames(4),
        eqs: frames(5)
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
            start: getT(time.eqs),
            show1s: 10000
        });

        kats[0] = new Katex(s, {
            text: "\\beta_0+{\\beta}x=y",
            x: 777, y: 177,
            start: getT(time.formula),
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


// scenes 15, 18
const Scene15 = function (s) {
    let time = {
        eqs: 1,
        moveEqs: frames(1),
        grid: frames(2),
        lines: frames(3),
        point: frames(4),
        vec: frames(5),

        overdet: frames(2),
        brain: frames(4),
    };

    let grid;
    let comic;
    let times;
    let brain;
    let txts = [];

    s.preload = function () {
        times = s.loadFont('../lib/font/times.ttf');
        comic = s.loadFont('../lib/font/comic.ttf');
    };

    s.setup = function () {
        s.frameRate(fr);
        s.createCanvas(cvw, cvh);
        grid = new Grid_3Lines_With_Point(s, {
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

        brain = new ThoughtBrain(s, {
            start: getT(time.brain),
            x: 427, y: 537,
            size: 257,
            font: comic,
            str: "\"closest solution\""
        });

        s.eqs = new Sys_3Eqs(s, {
            font: times,
            x: 757, y: 357,
            start: getT(time.eqs),
            show1s: 10000
        });

        txts[0] = new TextFade(s, {
            font: times,
            start: getT(time.overdet),
            mode: 1, size: 47,
            x: 300, y: 377,
            str: "Overdetermined\nSystem of equations"
        })
    };

    s.draw = function () {
        s.background(0);
        grid.show();
        brain.show();

        s.eqs.show();

        for (let t of txts) t.show();

        if (s.frameCount === getT(time.moveEqs))
            s.eqs.move(124, 127);

        showFR(s);
    }
};


const Scene16 = function (s) {
    let time = {
        grid: frames(2),

        pt: frames(3),
        vec: frames(4),
        kat: frames(5),
    };

    let comic;
    let times;
    let brain;
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
            showSq: false
        });

        // txts[0] = new TextFade(s, {
        //     font: times,
        //     start: getT(time.overdet),
        //     mode: 1, size: 47,
        //     x: 300, y: 377,
        //     str: "Overdetermined\nSystem of equations"
        // })
    };

    s.draw = function () {
        s.background(0);
        s.grid.show();
        s.plot.show();

        for (let t of txts) t.show();

        showFR(s);
    }
};


const Scene17 = function(s) {   // scene 17
    let time = {
        axes: 1,
        points: 1,
        leastSqLine: 2,

        grid: frames(1),
        lines: frames(2),
        move: frames(3),
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
        })
    }

    s.draw = function() {
        s.background(0);

        s.plot.show();
        s.grid.show();
        if (s.frameCount === getT(time.move)) {
            s.plot.reset();
            s.grid.move();
        }

        showFR(s);

    }

};


const Scene19 = function(s) {
    let time = {
        text: frames(1),
        eqs: frames(1),
        show1s: frames(2),
        move1: frames(3),
        move2: frames(3) + 1,
        move3: frames(6),
        move4: frames(9),
        fn: frames(10)
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
            x: 427, y: 257,
            //time: time,
            start: time.eqs, show1s: time.show1s,
            move1: getT(time.move1), move2: getT(time.move2),
            move3: getT(time.move3), move4: getT(time.move4),
            font: times,
        });

        txt[0] = new TextFade(s, {
            str: "Normal Equations", mode: 1, font: times, size: 57,
            x: 600, y: 100, start: time.text
        });
        txt[1] = new TextFade(s, {
            str: "* The plural \"equations\" in \"normal equations\" " +
                "\nindicates it's usually a system of many linear equations",
            font: times, size: 27, mode: 1,
            x: 600, y: 627, start: time.fn
        })

    };

    s.draw = function() {
        s.background(0);
        //hg.show();

        txt[0].show();
        txt[1].show();
        s.eqs.show();
        showFR(s);
    }
}


let p = new p5(Scene14);
