// scene 16
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

let p21 = new p5(Scene17);
