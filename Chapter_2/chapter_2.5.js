// In 3D scenes, notice the difference between s and g3
let mode = 1;

const Chap2Part5 = function(s) {

    let time = {
        move1: frames(3),
        move2: frames(7),

        // if only want to display X^T, this should be set to infinity
        matrixAnim: frames(15)
    };


    s.scale = function(a) {  // scaling a 3-array
        let step = 100;   // used for determining the coordinates
        return [a[0] * step, a[1] * step, a[2] * step];
    };

    let g2;
    let sf;
    let g3;
    let tnr;
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
        // g2 = s.createGraphics(cvw, cvh);
        sf = s.createGraphics(100, 10);  // 2d canvas for framerate display

        s.eqs = new Sys_3Eqs(s, {
            x: 400, y: 200,
            move1: 1, move2: 2,
            move3: 3, move4: getT(time.matrixAnim),
            mode: mode,
            font: tnr,
            start: frames(1),
        });


        s.pl = new Plane3D(s, {
            a: 0, b: 0, c: 0
        });

        s.axes = new Axes3D(s, {
            angle: 0,
            model: obj[0]
        });

        // i-hat
        s.arrows[0] = new Arrow_3to2(s, {
            to: s.scale([1, 0, 0]),
            color: s.color([255, 147, 147]), time: time,
        });

        // j-hat
        s.arrows[1] = new Arrow_3to2(s, {
            to: s.scale([0, 1, 0]),
            color: s.color([147, 255, 147]), time: time,
        });

        // k-hat
        s.arrows[2] = new Arrow_3to2(s, {
            to: s.scale([0, 0, 1]),
            color: s.color([147, 147, 255]), time: time,
        });

        // x0
        s.arrows[3] = new Arrow_3to2(s, {
            to: s.scale([matrix[0], matrix[1], matrix[2]]),
            color: s.color([237, 47, 47]), time: time,
        });

        // x1
        s.arrows[4] = new Arrow_3to2(s, {
            to: s.scale([matrix[3], matrix[4], matrix[5]]), time: time,
            color: s.color([37, 147, 37]),
        });

        // y
        s.arrows[5] = new Arrow_3to2(s, {
            to: s.scale(target), time: time,
            color: s.color([27, 147, 227])
        });

        let x0l = s.arrows[3].calcLanding();
        let x1l = s.arrows[4].calcLanding();
        let yl = s.arrows[5].calcLanding();

        let inv = s.calcInv(x0l, x1l);

        s.yto = [inv[0] * yl[0] + inv[1] * yl[1], inv[2] * yl[0] + inv[3] * yl[1], 0];

        // this is guaranteed to be [1, 0 (, 0)]
        s.x0to = [inv[0] * x0l[0] + inv[1] * x0l[1], inv[2] * x0l[0] + inv[3] * x0l[1], 0];
        // this is guaranteed to be [0, 1 (, 0)]
        s.x1to = [inv[0] * x1l[0] + inv[1] * x1l[1], inv[2] * x1l[0] + inv[3] * x1l[1], 0];
    };

    s.calcInv = function(u, v) {
        let a = u[0], b = u[1], c = v[0], d = v[1];
        let det = a * d - b * c;
        a /= det;
        b /= det;
        c /= det;
        d /= det;
        return [d, -b, -c, a];
    };

    s.draw = function () {
        s.background(0);
        s.axes.show(g3);
        s.eqs.show();

        for (let a of s.arrows)
            a.show(g3);

        if (s.frameCount === getT(time.move2)) {
            s.arrows[3].move({ to: s.scale(s.x0to) });
            s.arrows[4].move({ to: s.scale(s.x1to) });
            s.arrows[5].move({ to: s.scale(s.yto) });
        }

        s.pl.showPlane(g3);

        s.image(g3, 0, 0, cvw, cvh);
        showFR(s);
    };

};

let p25 = new p5(Chap2Part5);