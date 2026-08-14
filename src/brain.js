/*** 2018-11-14
 * Brain creature
 * As of now this is the only class that uses the Graphics class inheritance hierarchy
 *
 * ---- args list parameters ----
 * @optional (number) start, duration; (array) respawnTimes [in frames]
 */
class BrainBase extends Graphics {
    constructor(ctx, args) {
        super(ctx, {w : 1100, h : 1100});  // make it big since we can scale the canvas

        this.start = args.start || frames(1);
        this.duration = args.duration || frames(1);   // duration of init animation
        this.end = args.end === undefined ? Infinity : args.end;
        this.fadeOutDuration = frames(
            args.fadeOutDuration === undefined ? 0.7 : args.fadeOutDuration
        );
        this.respawnTimes = args.respawnTimes || [];
        this.respawnDuration = frames(1);
        this.fadeDuration = frames(0.5);
        this.respawnIndex = 0;
        this.respawnStart = undefined;
        this.respawnImage = undefined;

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
        this.speed = Math.max(1, Math.floor(this.duration / 7));

        // frameCount for this class
        this.frCount = 0;
    }

    startRespawn() {
        // Preserve the fully rendered brain while a fresh copy begins drawing.
        this.respawnImage = this.g.get();
        this.g.clear();
        this.frCount = 0;
        this.speed = Math.max(1, Math.floor(this.respawnDuration / 7));
        this.respawnStart = this.s.frameCount;
    }

    checkForRespawn() {
        if (this.respawnIndex < this.respawnTimes.length &&
            this.s.frameCount >= this.respawnTimes[this.respawnIndex]) {
            this.startRespawn();
            this.respawnIndex++;
        }
    }

    /** Return a smooth 1-to-0 opacity for an optional timed brain exit. */
    exitOpacity() {
        if (this.end === Infinity || this.s.frameCount <= this.end)
            return 1;
        const progress = Math.max(0, Math.min(1,
            (this.s.frameCount - this.end) / this.fadeOutDuration));
        const eased = progress * progress * (3 - 2 * progress);
        return 1 - eased;
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
        this.checkForRespawn();
        if (this.s.frameCount > this.start) {
            // the thick lines
            this.g.noFill();
            this.g.strokeWeight(47);
            this.g.stroke(27, 177, 37);
            this.g.strokeJoin(this.s.ROUND);
            this.showWire();

            // the thin lines
            this.g.strokeWeight(17);
            this.g.stroke(107, 227, 97);
            this.showWire();

            // update local frame count
            this.frCount++;
        }
    }

    /**
     * Draw the brain at a given canvas location. During a respawn, the old
     * brain fades out while the newly drawn brain spawns in at the same place.
     */
    showAt(x, y, size) {
        this.showBrain();

        if (this.respawnStart !== undefined) {
            const elapsed = this.s.frameCount - this.respawnStart;
            const fadeProgress = this.s.constrain(
                elapsed / this.fadeDuration,
                0,
                1
            );
            const respawnProgress = this.s.constrain(
                elapsed / this.respawnDuration,
                0,
                1
            );

            if (this.respawnImage) {
                this.s.push();
                this.s.tint(255, 255 * (1 - fadeProgress));
                this.s.image(this.respawnImage, x, y, size, size);
                this.s.pop();
            }

            this.s.push();
            this.s.tint(255, 255 * respawnProgress);
            this.s.image(this.g, x, y, size, size);
            this.s.pop();

            if (respawnProgress >= 1) {
                this.respawnStart = undefined;
                this.respawnImage = undefined;
            }
        } else {
            this.s.image(this.g, x, y, size, size);
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
    constructor(ctx, args) {
        this.s = ctx;
        this.x = args.x;
        this.y = args.y;
        this.w = args.w;
        this.h = args.h;

        this.start = args.start || frames(1);
        this.end = args.end || 10000;  // starting time for fade out animation, default "infinity"
        this.fadeOutDuration = frames(args.fadeOutDuration || 0.7);

        this.strokeweight = args.strokeweight || 2;
        this.opacity = args.opacity === undefined ? 177 : args.opacity;
        this.fillColor = args.fill || [0, 0, 0];

        this.text = new TextFade(this.s, {   // a center-mode text object
            mode: 1,
            size: args.size,
            x: this.x + this.w / 2,
            y: this.y - this.h * 0.64,
            font: args.font,
            str: args.str,
            start: this.start + frames(1),
            end: this.end,
            duration: args.fadeOutDuration || 0.7
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
        if (this.s.frameCount < this.start ||
            this.s.frameCount >= this.end + this.fadeOutDuration)
            return;

        const fadeProgress = this.s.constrain(
            (this.s.frameCount - this.end) / this.fadeOutDuration,
            0,
            1
        );
        this.s.push();
        this.s.drawingContext.globalAlpha *= 1 - fadeProgress;
        this.s.stroke(255);
        this.s.strokeWeight(this.strokeweight);
        this.s.fill(
            this.fillColor[0],
            this.fillColor[1],
            this.fillColor[2],
            this.opacity
        );

        for (let i = 0; i < 4; i++) { // NOTE ON 2019-04-11: could actually use the new Circle class
            if (this.s.frameCount - this.start > i * frames(0.2)) {
                // somehow the constant TWO_PI would not work here
                this.s.arc(this.c[i][0], this.c[i][1], this.c[i][2], this.c[i][3],
                    0, 6.283 * this.timers[i].advance());
            }
        }
        this.s.pop();
        this.text.show();
    }
}

/*** Refactored on 2019-04-11
 * Displays a user-defined emoji on the ThoughtBrain
 * todo: for droplets 💧, it should go down instead of up when init
 * Other proposed emojis: ❤ 👍 💢 💭 ❗
 *
 * ---- args list parameters ----
 * @mandatory x, y, (string) str, (array) color, (p5.Font) emoji
 * @optional  start, end, size
 */
class Emoji extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.size = args.size || 47;
        this.txt = new TextFade(this.s, {
            str: args.str, font: args.emoji, mode: 1,
            color: args.color, size: this.size,
            start: this.start, end: this.end,
            x: this.x, y: this.y + this.size * 2,
        });
    }
    show() {
        if (this.s.frameCount === this.start)
            this.txt.move(this.x, this.y + this.size * 0.2, 1, 1); // fixme
        this.txt.show();
    }
}

/*** 2019-02-18
 * After the bulb is in place, the rays glow outwards and stay for a second before fading
 */
class Bulb extends Emoji {
    constructor(ctx, args) {
        super(ctx, args);

        this.rays = [];
        let startScale = 0.57;
        let endScale = 0.77;
        let angle = this.s.PI / 4;
        for (let i = 0; i < 7; i++) {
            this.rays[i] = new Line(this.s, {
                x1: this.x + Math.cos(angle) * this.size * startScale,
                y1: this.y + Math.sin(angle) * this.size * startScale,
                x2: this.x + Math.cos(angle) * this.size * endScale,
                y2: this.y + Math.sin(angle) * this.size * endScale,
                start: this.start + frames(1), end: this.start + frames(3),
                color: this.s.color(247, 248, 7),
                strokeweight: this.size / 20,
            });
            angle -= this.s.PI / 4;
        }
    }
    show() {
        super.show();
        for (let r of this.rays) r.show();
    }
}

/*** 2019-01-05
 * A brain with a thought bubble
 *
 * ---- args list parameters ----
 * @mandatory (number) x, y; (font) font; (string) str
 * @optional (number) start, duration, size, font_size, bubbleStart,
 *       [used for the light bulb:] (font) emoji; (number) bulbStart, bulbEnd
 *       [used for the question mark:] (bool) question; (font) emoji; (number) qStart, qEnd
 */
class ThoughtBrain extends BrainBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.x = args.x || 170;
        this.y = args.y || 440;
        this.size = args.size || 400;  // when displaying, size of the brain (w is already defined)

        this.bubble = new Bubble(this.s, {
            x: this.x + this.size / 2,
            y: this.y + this.size / 8,
            w: this.size * 1.5,
            h: this.size,
            font: args.font,
            size: args.font_size,  // font size
            str: args.str,
            start: args.bubbleStart || this.start,
            end: this.end,
            opacity: args.bubbleOpacity,
            fill: args.bubbleFill
        });
        if (args.question) {
            this.qStart = args.qStart || this.start + frames(2);
            this.qEnd = args.qEnd || this.start + frames(6);

            this.qm = [];  // create two question marks
            this.qm[0] = new Emoji(this.s, {
                emoji: args.emoji, str: '❔', color: Orange.slice(),
                x: this.x - this.size * 0.027, y: this.y, size: this.size / 10,
                start: this.qStart, end: this.qEnd
            });
            let dt = frames(0.3);
            this.qm[1] = new Emoji(this.s, {
                emoji: args.emoji, str: '❔', color: Orange.slice(),
                x: this.x + this.size * 0.057, y: this.y, size: this.size / 10,
                start: this.qStart + dt, end: this.qEnd + dt
            });
        } else if (args.emoji) {  // fixme: if args.bulb
            this.bulbStart = args.bulbStart || this.start + frames(2);
            this.bulbEnd = args.bulbEnd || this.start + frames(6);
            this.bulb = new Bulb(this.s, {
                emoji: args.emoji, str: '💡', color: [247, 248, 7],
                x: this.x, y: this.y, size: this.size / 10,
                start: this.bulbStart, end: this.bulbEnd
            });
        }
    }
    show() {
        this.showBrain();
        this.bubble.show();
        if (this.qm)
            for (let q of this.qm) q.show();
        if (this.bulb)
            this.bulb.show();
        const opacity = this.exitOpacity();
        if (opacity > 0) {
            this.s.push();
            this.s.tint(255, 255 * opacity);
            this.s.image(this.g, this.x, this.y, this.size, this.size);
            this.s.pop();
        }
    }
}
