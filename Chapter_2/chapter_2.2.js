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

let p = new p5(Scene15);
