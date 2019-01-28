

function Chap2Part4(s) {


    let time = {
        move1: frames(2),
        move2: frames(2) + 1,
        move3: frames(3),
        move4: frames(4)
    };

    let tnr;
    let hg;

    s.preload = function() {
        tnr = s.loadFont('../lib/font/times.ttf');
    }

    s.setup = function() {
        s.background(0);
        s.frameRate(fr);
        s.createCanvas(cvw, cvh);
        hg = new HelperGrid(s, {});

        s.eqs = new Sys_3Eqs(s, {
            x: 400, y: 200,
            //time: time,
            move1: getT(time.move1), move2: getT(time.move2),
            move3: getT(time.move3), move4: getT(time.move4),
            font: tnr,
            start: frames(1),
        });

    };

    s.draw = function() {
        s.background(0);
        //hg.show();

        s.eqs.show();
        showFR(s);
    }
}

let p24 = new p5(Chap2Part4);