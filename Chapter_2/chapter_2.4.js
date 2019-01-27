function Chap2Part4(s) {

    let time = {
        move1: frames(3),
        move2: frames(7),
    };

    let tnr;
    let hg;

    s.setup = function() {
        s.background(0);
        s.createCanvas(cvw, cvh);
        tnr = s.loadFont('../lib/font/times.ttf');
        hg = new HelperGrid(s, {});

        s.eqs = new Sys_3Eqs(s, {
            x: 400, y: 200,
            move1: getT(time.move1), move2: getT(time.move2),
            font: tnr,
            start: frames(1),
        });

    };

    s.draw = function() {
        s.background(0);
        //hg.show();

        s.eqs.show();
    }
}

let p24 = new p5(Chap2Part4);