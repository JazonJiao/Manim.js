
class Sys_3Eqs {
    constructor(ctx, args) {
        this.s = ctx;

        this.x = args.x || 0;
        this.y = args.y || 0;
        this.kats = [];
        this.txts = [];
        this.start = args.start || 100;

        // x1, b_0
        for (let i = 0; i < 3; i++) {
            this.txts[i] = new TextFadeIn(this.s, {
                str: "1", start: this.start, size: 47,
                x: this.x + 7, y: this.y + i * 57,
                font: args.font
            });
            this.kats[i] = new Katex(this.s, {
                text: "\\beta_0", fadeIn: true, start: this.start,
                x: this.x + 37, y: this.y + i * 57 - 27,
            });
        }

        // x2, b
        for (let i = 3; i < 6; i++) {
            this.txts[i] = new TextFadeIn(this.s, {
                str: "" + matrix[i], start: this.start, size: 47,
                mode: 2,
                x: this.x + 180, y: this.y + (i - 3) * 57,
                font: args.font
            });
            this.kats[i] = new Katex(this.s, {
                text: "\\beta", fadeIn: true, start: this.start,
                x: this.x + 189, y: this.y + (i - 3) * 57 - 27
            });
        }

        // y
        for (let i = 0; i < 3; i++) {
            this.txts[i + 6] = new TextFadeIn(this.s, {
                str: "" + target[i], start: this.start, size: 47,
                x: this.x + 287, y: this.y + i * 57,
                font: args.font
            });
        }

        // +
        for (let i = 0; i < 3; i++) {
            this.txts[i + 9] = new TextFadeIn(this.s, {
                str: "+", start: this.start, size: 47,
                x: this.x + 97, y: this.y + i * 57
            });
        }

        // =
        for (let i = 0; i < 3; i++) {
            this.txts[i + 12] = new TextFadeIn(this.s, {
                str: "=", start: this.start, size: 47,
                x: this.x + 234, y: this.y + i * 57
            });
        }

        this.brackets = [];
        this.brackets[0] = new Bracket(this.s, {
            x1: this.x - 7, x2: this.x - 7, y1: this.y, y2: this.y + 167,
            tipLen: 9
        });
        this.brackets[1] = new Bracket(this.s, {
            x1: this.x + 41, x2: this.x + 41, y1: this.y + 167, y2: this.y,
            tipLen: 9
        });

    }

    move() {
        for (let i = 0; i < 3; i++) {
            this.kats[i].move(this.x - 54, this.y + 30);
        }
        for (let i = 3; i < 6; i++) {
            this.kats[i].move(this.x + 97, this.y + 30);
        }
    }

    show() {
        for (let t of this.txts) t.show();
        for (let k of this.kats) k.show();
        for (let b of this.brackets) b.show();
    }
}

function Chap2Part4(s) {

    let eqs;
    let tnr;
    let hg;

    s.setup = function() {
        s.background(0);
        s.createCanvas(cvw, cvh);
        tnr = s.loadFont('../lib/font/times.ttf');
        hg = new HelperGrid(s, {});

        eqs = new Sys_3Eqs(s, {
            x: 400, y: 200,
            font: tnr,
            start: frames(1),
        });

    };

    s.draw = function() {
        s.background(0);
        //hg.show();

        if (s.frameCount === 100) eqs.move();

        eqs.show();

        if (s.frameCount === 100) console.log(eqs);  // fixme: is this the only way to debug?
    }


}

let p = new p5(Chap2Part4);