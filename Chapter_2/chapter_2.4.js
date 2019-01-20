/*** 2019-01-20
 * Bracket, '['
 * To create a ']', draw a line from bottom to top
 *
 // * (DISCARDED) x and y define the CENTER of the Bracket.
 // * Default is a left bracket, '['. To use a right bracket, pass in angle = PI.
 *
 * ---- args list parameters ----
 * @mandatory (number) x1, x2, y1, y2
 * @optional (number) tipLen, start, duration, strokeweight
 */
class Bracket {
    constructor(args) {
        // this.x = args.x;
        // this.y = args.y;
        // this.l = args.length;
        // this.angle = args.angle || 0;

        // let dx = args.x2 - args.x1;
        // let dy = args.y2 - args.y1;
        // let len = Math.sqrt(dx * dx + dy * dy);

        this.tipLen = args.tipLen || 17;

        this.start = args.start || 100;
        this.duration = args.duration || frames(1);
        this.strokeweight = args.strokeweight || 4;

        let angle = Math.atan2(args.y2 - args.y1, args.x2 - args.x1);

        this.lines = [];
        this.lines[0] = new LineCenter({
            x1: args.x1, y1: args.y1, x2: args.x2, y2: args.y2,
            start: this.start, duration: this.duration, strokeweight: this.strokeweight
        });
        this.lines[1] = new Line({
            x1: args.x1 + this.tipLen * Math.sin(angle), x2: args.x1,
            y1: args.y1 + this.tipLen * Math.cos(angle), y2: args.y1,
            start: this.start, duration: this.duration, strokeweight: this.strokeweight
        });
        this.lines[2] = new Line({
            x1: args.x2 + this.tipLen * Math.sin(angle), x2: args.x2,
            y1: args.y2 + this.tipLen * Math.cos(angle), y2: args.y2,
            start: this.start, duration: this.duration, strokeweight: this.strokeweight
        });
    }

    show() {
        for (let l of this.lines) l.show();
    }
}

class Sys_3Eqs {
    constructor(args) {
        this.x = args.x || 0;
        this.y = args.y || 0;
        this.kats = [];
        this.txts = [];
        this.start = args.start || 100;

        for (let i = 0; i < 3; i++) {
            this.txts[i] = new TextFadeIn({
                str: "1", start: this.start, size: 47,
                x: this.x + 7, y: this.y + i * 57,
                font: args.font
            });
        }
        this.kats[0] = new Katex10({
            text: "\\beta_0", fadeIn: true, start: this.start,
            x: this.x + 37, y: this.y - 27,
        });
        this.kats[1] = new Katex11({
            text: "\\beta_0", fadeIn: true, start: this.start,
            x: this.x + 37, y: this.y + 57 - 27
        });
        this.kats[2] = new Katex12({
            text: "\\beta_0", fadeIn: true, start: this.start,
            x: this.x + 37, y: this.y + 57*2 - 27
        });
        for (let i = 3; i < 6; i++) {
            this.txts[i] = new TextFadeIn({
                str: "" + matrix[i], start: this.start, size: 47,
                mode: 2,
                x: this.x + 180, y: this.y + (i - 3) * 57,
                font: args.font
            });
        }
        this.kats[3] = new Katex13({
            text: "\\beta", fadeIn: true, start: this.start,
            x: this.x + 187, y: this.y - 27
        });
        this.kats[4] = new Katex14({
            text: "\\beta", fadeIn: true, start: this.start,
            x: this.x + 187, y: this.y + 57 - 27
        });
        this.kats[5] = new Katex15({
            text: "\\beta", fadeIn: true, start: this.start,
            x: this.x + 187, y: this.y + 57*2 - 27
        });
        for (let i = 0; i < 3; i++) {
            this.txts[i + 6] = new TextFadeIn({
                str: "" + target[i], start: this.start, size: 47,
                x: this.x + 287, y: this.y + i * 57,
                font: args.font
            });
        }
        for (let i = 0; i < 3; i++) {
            this.txts[i + 9] = new TextFadeIn({
                str: "+", start: this.start, size: 47,
                x: this.x + 97, y: this.y + i * 57
            });
        }
        for (let i = 0; i < 3; i++) {
            this.txts[i + 12] = new TextFadeIn({
                str: "=", start: this.start, size: 47,
                x: this.x + 234, y: this.y + i * 57
            });
        }
        
        this.brackets = [];
        this.brackets[0] = new Bracket({
            x1: this.x - 7, x2: this.x - 7, y1: this.y, y2: this.y + 167,
            tipLen: 12
        });
        this.brackets[1] = new Bracket({
            x1: this.x + 41, x2: this.x + 41, y1: this.y + 167, y2: this.y,
            tipLen: 12
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

let eqs;
let tnr;
let hg;


function setup() {
    background(0);
    createCanvas(cvw, cvh);
    tnr = loadFont('../lib/font/times.ttf');
    hg = new HelperGrid({});

    eqs = new Sys_3Eqs({
        x: 400, y: 200,
        font: tnr,
        start: frames(1),
    });
}

function draw() {
    background(0);
    hg.show();

    if (frameCount === 100) eqs.move();

    eqs.show();
}