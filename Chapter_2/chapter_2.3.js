
function Chap2Part3(s) {

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
            centerX: 300,
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

let p23 = new p5(Chap2Part3);