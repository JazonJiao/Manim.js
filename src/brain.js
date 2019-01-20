/*** 2018-11-14
 * Brain creature
 * As of now this is the only class that uses the Graphics class inheritance hierarchy
 *
 * ---- args list parameters ----
 * @optional (number) start, duration
 */
class BrainBase extends Graphics {
    constructor(args) {
        super({w : 1100, h : 1100});  // make it big since we can scale the canvas

        this.start = args.start || frames(1);
        this.duration = args.duration || frames(1);   // duration of init animation

        // the coordinates of each vertex, from bottom to top
        this.xCoords = [
            [400, 400, 400, 500, 600, 600, 600],
            [600, 750, 900, 999, 999, 900, 700],
            [700, 800, 860, 900, 860, 800, 700],
            [300, 150, 150, 300, 470, 640, 810],
            [500, 500, 500, 500, 500, 410, 330],
            [100, 160, 220, 280, 340, 400, 400],
            [360, 280, 210, 130, 200, 300, 400]];

        this.yCoords = [
            [900, 800, 700, 600, 500, 350, 200],
            [650, 500, 500, 400, 300, 200, 200],
            [400, 400, 400, 350, 300, 300, 300],
            [300, 300, 250, 100, 100, 100, 100],
            [470, 410, 340, 270, 200, 200, 200],
            [400, 400, 400, 400, 400, 400, 300],
            [600, 600, 600, 500, 500, 500, 500]];

        // number of frames needed to display everything
        // this.frames = frames;
        this.speed = Math.floor(this.duration / 7);

        // frameCount for this class
        this.frCount = 0;
    }

    showCircle(x, y, size) { // size should be between 0 and 1
        this.g.push();

        // thick line
        this.g.strokeWeight(47 * size);
        this.g.stroke(27, 177, 37);
        this.g.ellipse(x, y, size * 9, size * 9);

        // thin line
        this.g.strokeWeight(17 * size);
        this.g.stroke(107, 227, 97);
        this.g.ellipse(x, y, size * 9, size * 9);

        this.g.pop();
    }

    showWire() {
        for (let i = 0; i < 7; i++) {
            this.g.beginShape();
            let maxJ = Math.floor(this.frCount / this.speed);
            let j = 0;
            let x = this.xCoords[i][0];
            let y = this.yCoords[i][0];
            this.showCircle(x, y, (this.frCount / this.speed) < 1 ? (this.frCount / this.speed) : 1);

            for (; j < 7 && j < maxJ; j++) {
                x = this.xCoords[i][j];
                y = this.yCoords[i][j];

                this.g.vertex(x, y);

            }
            if (j < 7) {   // not reached the end of init animation, add an intermediary vertex
                let factor = (this.frCount % this.speed) / this.speed;    // 0 <= factor < 1
                this.g.vertex(x + (this.xCoords[i][j] - x) * factor,
                    y + (this.yCoords[i][j] - y) * factor);
            } else {
                this.showCircle(x, y, 1); // fixme: abrupt end
            }
            this.g.endShape();
        }
    }

    showBrain() {
        if (frameCount > this.start) {
            // the thick lines
            this.g.noFill();
            this.g.strokeWeight(47);
            this.g.stroke(27, 177, 37);
            this.g.strokeJoin(ROUND);
            this.showWire();

            // the thin lines
            this.g.strokeWeight(17);
            this.g.stroke(107, 227, 97);
            this.showWire();

            // update local frame count
            this.frCount++;
        }
    }


}

/*** 2019-01-05
 * Bubble
 * Thought bubble (semi-transparent), used in conjunction with the Brain-creature
 *
 * x and y coordinates define the LOWER-LEFT corner of the shape;
 * (to change to LOWER-RIGHT, simply change this.x + ... to this.x - ...)
 * w and h define width and height.
 *
 * ---- args list parameters ----
 * @mandatory (number) x, y, w, h; (font) font; (string) str
 * @optional (number) start, end, stokeweight
 */
class Bubble {
    constructor(args) {
        this.x = args.x;
        this.y = args.y;
        this.w = args.w;
        this.h = args.h;

        this.start = args.start || frames(1);
        this.end = args.end || 10000;  // starting time for fade out animation, default "infinity"

        this.strokeweight = args.strokeweight || 2;

        this.text = new TextFadeIn({   // a center-mode text object
            mode: 1,
            size: args.size,
            x: this.x + this.w / 2,
            y: this.y - this.h * 0.64,
            font: args.font,
            str: args.str,
            start: this.start + frames(1)
        });

        this.timers = [new Timer1(frames(0.4)), new Timer1(frames(0.4)),
            new Timer1(frames(0.4)), new Timer1(frames(0.7))];
        this.c = [];
        // the array entries define the x, y, w (DIAMETER), h (DIAMETER) of the arc to be drawn
        // main ellipse
        this.c[3] = [this.x + this.w / 2, this.y - this.h * 0.6, this.w, this.h * 0.77];

        // three auxiliary ellipses
        this.c[2] = [this.x + this.w * 0.21, this.y - this.h * 0.2, this.w / 9, this.h / 9];
        this.c[1] = [this.x + this.w * 0.12, this.y - this.h * 0.12, this.w / 14, this.h / 14];
        this.c[0] = [this.x + this.w * 0.05, this.y - this.h * 0.067, this.w / 21, this.h / 21];
    }

    show() {
        stroke(255);
        strokeWeight(this.strokeweight);
        fill(0, 177);           // the bubble is semi-transparent

        for (let i = 0; i < 4; i++) {
            if (frameCount - this.start > i * frames(0.2)) {
                // somehow the constant TWO_PI would not work here
                arc(this.c[i][0], this.c[i][1], this.c[i][2], this.c[i][3],
                    0, 6.283 * this.timers[i].advance());
            }
        }
        this.text.show();
    }
}

/*** 2019-01-05
 * A brain with a thought bubble
 *
 * ---- args list parameters ----
 * @mandatory (number) x, y; (font) font; (string) str
 * @optional (number) start, duration, bubbleStart, size, font_size
 */
class ThoughtBrain extends BrainBase {
    constructor(args) {
        super(args);
        this.x = args.x || 170;
        this.y = args.y || 440;
        this.s = args.size || 400;   // when displaying, the size of the brain (w is already defined)

        this.bubble = new Bubble({
            x: this.x + this.s / 2,
            y: this.y + this.s / 8,
            w: this.s * 1.5,
            h: this.s,
            font: args.font,
            size: args.font_size,  // font size
            str: args.str,
            start: args.bubbleStart || this.start
        })
    }
    show() {
        this.showBrain();
        this.bubble.show();
        image(this.g, this.x, this.y, this.s, this.s);
    }
}
