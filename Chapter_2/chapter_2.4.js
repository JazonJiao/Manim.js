function Chap2Part4(s) {

    let time = {
        move1: frames(3),
        move2: frames(7),
    };

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
                this.txts[i] = new TextFade(this.s, {
                    str: "1", start: this.start, size: 47,
                    x: this.x + 7, y: this.y + i * 57,
                    font: args.font, color: [255, 77, 97],  // RED
                });
                this.kats[i] = new Katex(this.s, {
                    text: "\\beta_0",
                    fadeIn: true, start: this.start, fadeOut: i !== 1, end: getT(time.move1 + 30),
                    x: this.x + 30, y: this.y + i * 57 - 34,
                });
            }

            // x2, b
            for (let i = 3; i < 6; i++) {
                this.txts[i] = new TextFade(this.s, {
                    str: "" + matrix[i], start: this.start, size: 47,
                    mode: 2,
                    x: this.x + 180, y: this.y + (i - 3) * 57,
                    font: args.font, color: [77, 217, 77],  // GREEN
                });
                this.kats[i] = new Katex(this.s, {
                    text: "\\beta",
                    fadeIn: true, start: this.start, fadeOut: i !== 4, end: getT(time.move1 + 30),
                    x: this.x + 182, y: this.y + (i - 3) * 57 - 34
                });
            }

            // y
            for (let i = 0; i < 3; i++) {
                this.txts[i + 6] = new TextFade(this.s, {
                    str: "" + target[i], start: this.start, size: 47,
                    x: this.x + 287, y: this.y + i * 57,
                    font: args.font, color: [77, 177, 255],  // BLUE
                });
            }

            // +
            for (let i = 0; i < 3; i++) {
                this.txts[i + 9] = new TextFade(this.s, {
                    str: "+", start: this.start, end: getT(time.move2), size: 47,
                    x: this.x + 97, y: this.y + i * 57
                });
            }

            // =
            for (let i = 0; i < 3; i++) {
                this.txts[i + 12] = new TextFade(this.s, {
                    str: "=", start: this.start, size: 47,
                    x: this.x + 234, y: this.y + i * 57
                });
            }

            this.brackets = [];

            // x1
            this.brackets[0] = new Bracket(this.s, {
                x1: this.x - 7, x2: this.x - 7, y1: this.y, y2: this.y + 167, strokeweight: 3,
                tipLen: 9, duration: frames(2)
            });
            this.brackets[1] = new Bracket(this.s, {
                x1: this.x + 44, x2: this.x + 44, y1: this.y + 167, y2: this.y, strokeweight: 3,
                tipLen: 9, duration: frames(2)
            });

            // x2
            this.brackets[2] = new Bracket(this.s, {
                x1: this.x + 127, x2: this.x + 127, y1: this.y, y2: this.y + 167, strokeweight: 3,
                tipLen: 9, duration: frames(2)
            });
            this.brackets[3] = new Bracket(this.s, {
                x1: this.x + 194, x2: this.x + 194, y1: this.y + 167, y2: this.y, strokeweight: 3,
                tipLen: 9, duration: frames(2)
            });

            // y
            this.brackets[4] = new Bracket(this.s, {
                x1: this.x + 271, x2: this.x + 271, y1: this.y, y2: this.y + 167, strokeweight: 3,
                tipLen: 9, duration: frames(2)
            });
            this.brackets[5] = new Bracket(this.s, {
                x1: this.x + 340, x2: this.x + 340, y1: this.y + 167, y2: this.y, strokeweight: 3,
                tipLen: 9, duration: frames(2)
            });
        }

        move1() {
            for (let i = 0; i < 3; i++) {  // move beta_0
                this.kats[i].move(this.x - 60, this.y + 24);
            }
            for (let i = 3; i < 6; i++) {  // move beta
                this.kats[i].move(this.x + 89, this.y + 24);
            }
            for (let i = 9; i < 12; i++) { // move plus sign
                this.txts[i].move(this.x + 57, this.y + 57);
            }
            for (let i = 12; i < 15; i++) { // move equals sign
                this.txts[i].move(this.x + 222, this.y + 57);
            }
        }

        move2() {
            for (let i = 3; i < 6; i++) {  // move x2
                this.txts[i].move(this.x + 104, this.y + (i - 3) * 57)
            }
            this.kats[1].move(this.x + 150, this.y - 17);  // move beta_0
            this.kats[4].move(this.x + 150, this.y + 50);  // move beta
            this.brackets[3].move({
                x1: this.x + 120, y1: this.y + 167,
                x2: this.x + 120, y2: this.y
            });
            this.brackets[2].move({
                x1: this.x + 134, y1: this.y + 24,
                x2: this.x + 134, y2: this.y + 142
            });
            this.brackets[1].move({
                x1: this.x + 202, y1: this.y + 142,
                x2: this.x + 202, y2: this.y + 24
            })
        }

        show() {
            for (let t of this.txts) t.show();
            for (let k of this.kats) k.show();
            for (let b of this.brackets) b.show();
        }
    }


    let tnr;
    let hg;

    s.setup = function() {
        s.background(0);
        s.createCanvas(cvw, cvh);
        tnr = s.loadFont('../lib/font/times.ttf');
        hg = new HelperGrid(s, {});

        s.eqs = new Sys_3Eqs(s, {
            x: 400, y: 200,
            font: tnr,
            start: frames(1),
        });

    };

    s.draw = function() {
        s.background(0);
        //hg.show();

        if (s.frameCount === getT(time.move1)) s.eqs.move1();
        if (s.frameCount === getT(time.move2)) s.eqs.move2();

        s.eqs.show();
    }
}

let p24 = new p5(Chap2Part4);