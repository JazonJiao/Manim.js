// In 3D scenes, notice the difference between s and g3


const Chap2Part5 = function(s) {

    let time = {
        move1: frames(3),
        move2: frames(7)
    };

    /*** 2019-01-23
     * Capable of displaying a linear transformation from R^3 to R^2
     * this.from = [0, 0, 0];
     * Responsible for calculating the arrow's landing spot based on the 2x3 matrix in global.js
     *
     */
    class Arrow_3to2 extends Arrow3D {
        constructor(ctx, args) {
            super(ctx, args);
            this.land1 = this.calcLanding();   // landing position after 3-to-2 transformation

        }

        calcLanding() {
            let m = stdToP5(matrix);
            // apply matrix-vector multiplication
            let x1 = m[0] * this.to[0] + m[1] * this.to[1] + m[2] * this.to[2];
            let x2 = m[3] * this.to[0] + m[4] * this.to[1] + m[5] * this.to[2];
            return [x1, x2, 0];
        }

        show(g3) {
            super.show(g3);
            if (this.s.frameCount === getT(time.move1)) this.move({ to: this.land1 });
        }
    }


    s.scale = function(a) {  // scaling a 3-array
        let step = 100;   // used for determining the coordinates
        return [a[0] * step, a[1] * step, a[2] * step];
    };

    let g2;
    let g3;
    let obj = [];
    s.arrows = [];

    s.preload = function () {
        obj[0] = s.loadModel('../lib/obj/axes.obj');
    };

    s.setup = function () {
        s.frameRate(fr);

        s.pixelDensity(1);
        s.createCanvas(cvw, cvh);
        g3 = s.createGraphics(cvw * 2, cvh * 2, s.WEBGL);  // a square to be displayed to the left
        g2 = s.createGraphics(100, 10);

        s.pl = new Plane3D(s, {
            a: 0, b: 0, c: 0
        });

        s.axes = new Axes3D(s, {
            angle: 0,
            model: obj[0]
        });

        // i-het
        s.arrows[0] = new Arrow_3to2(s, {
            to: s.scale([1, 0, 0]),
            color: s.color([255, 147, 147]),
        });

        // j-hat
        s.arrows[1] = new Arrow_3to2(s, {
            to: s.scale([0, 1, 0]),
            color: s.color([147, 255, 147]),
        });

        // k-hat
        s.arrows[2] = new Arrow_3to2(s, {
            to: s.scale([0, 0, 1]),
            color: s.color([147, 147, 255])
        });
    };

    s.draw = function () {
        s.background(0);
        s.axes.show(g3);
        for (let a of s.arrows) a.show(g3);
        s.pl.showPlane(g3);

        s.image(g3, 0, 0, cvw, cvh);
        showFR(s, g2);
    };
    
};

let p25 = new p5(Chap2Part5);