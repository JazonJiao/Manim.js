// fr = 45;

let time = {
    brain: frames(1.4),
    move: frames(2.7),
    txt: frames(4.2),
};

class IntroBrain extends BrainBase {
    constructor(ctx) {
        super(ctx, {start: time.brain});
        this.timer = new Timer2(frames(1.07));
    }

    render() {
        let size = 654;
        this.showBrain();
        if (this.s.frameCount < time.move) {
            this.s.image(this.g, 424, 177, size, size);
        } else {
            let t = this.timer.advance();
            this.s.image(this.g, 424 + t * 250, 177, size, size);
        }
    }
}

const Intro = function (s) {
    let img, fade;
    let imgTimer = new Timer1(frames(1.07));
    let brain;
    let tnr, txt;

    s.preload = function() {
        fade = s.loadImage('Fade.png');
        img = s.loadImage('181227.png');
        tnr = s.loadFont('../../lib/font/times.ttf');
    };

    s.setup = function() {
        setup2D(s);
        brain = new IntroBrain(s);
        txt = new TextWriteIn(s, {
            str: "Graph Algorithm: Topological sort",  /// modify this
            x: 340,   /// modify this
            y: 557, start: time.txt, font: tnr,
        });
        s.d = new Dragger(s, [txt]);
    };

    s.draw = function() {
        s.background(0);
        if (s.frameCount > time.move) {
            let t = imgTimer.advance();
            s.image(img, 767 - t * 600, 117, 400, 400);
            s.image(fade, 267 + t * 200, 0);
        }
        brain.render();
        txt.show();
        //s.d.show();
    }
};


let p = new p5(Intro);