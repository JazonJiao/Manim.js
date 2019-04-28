// refactored on 2019-01-20, 02-01
class TextBase extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        // I originally used the usual syntax of args.x || width / 2,
        // but this would not work if 0 is passed in as x
        this.rotation = args.rotation || 0;
    }

    reset(args) {
        this.x = args.x || this.x;
        this.y = args.y || this.y;
    }
    // move() merged into parent class
}


/*** 2019-01-04
 * Text
 * Needs to declare a font variable and set font = loadFont('../lib/font/times.ttf') in preload()
 * There should not be a global variable named text.
 * For mode 0 (default), the x and y define the coordinates for the upper-left corner of the text.
 * For mode 1, the x and y define the center for the text.
 * For mode 2, the x and y define the upper-right corner for the text.
 * For the base class, no init animation is displayed.
 *
 * If want init animation, use a derived class, TextFade, or TextWriteIn.
 * If want sudden appearance/disappearance, use this class and pass in start and/or end.
 *
 * ---- args list parameters ----
 * @mandatory (string) str; (number) x, y; (p5.Font) font
 * @optional (number) mode, size, start, end, strokeweight; (array) color, stroke
 */
class Text extends TextBase {
    constructor(ctx, args) {
        super(ctx, args);

        this.font = args.font;
        this.str = args.str;
        this.mode = args.mode || 0;
        this.color = args.color || [255, 255, 255];
        this.ft = new FillChanger(ctx, this.color);
        this.stroke = args.stroke || undefined;
        this.sw = args.strokeweight || 1.7;

        this.size = args.size || 37;
    }

    // works the same way as move()
    reColor(color, duration) {
        this.ft.reColor(color, duration);
    }

    move(x, y, duration, timerNum, size) {
        super.move(x, y, duration, timerNum);
        this.so = this.size;
        this.sn = size || this.size;
    }

    moving() {
        super.moving();
        this.size = this.so + this.move_timer.t * (this.sn - this.so);
    }

    shaking() {
        super.shaking();
        if (this.mode === 1)   // changing size only works if text is in the center
            this.size += Math.sin(this.move_timer.t * this.s.TWO_PI) * this.amp * 0.27;
    }

    jumping() {
        super.jumping();
        if (this.mode === 1)
            // the integral of sin(2*PI*x) over 0 to 2*PI is 0, so position doesn't change
            this.size += Math.sin(this.move_timer.t * this.s.TWO_PI) * this.amp * 0.27;
    }

    // works the same way as move
    change(str, duration) {
        // todo
        this.reset({ str: str });
    }

    reset(args) {
        this.x = args.x || this.x;
        this.y = args.y || this.y;
        this.size = args.size || this.size;
        this.str = args.str || this.str;
    }

    showSetup() {
        if (this.font)
            this.s.textFont(this.font);

        if (this.mode === 0) {
            this.s.textAlign(this.s.LEFT, this.s.TOP);
        } else if (this.mode === 1) {
            this.s.textAlign(this.s.CENTER, this.s.CENTER);
        } else if (this.mode === 2) {
            this.s.textAlign(this.s.RIGHT, this.s.TOP);
        } else if (this.mode === 3) {  // center-right
            this.s.textAlign(this.s.LEFT, this.s.CENTER);
        } else if (this.mode === 4) {  // center-right
            this.s.textAlign(this.s.RIGHT, this.s.CENTER);
        }
        this.s.textSize(this.size);
        this.ft.advance();  // show color

        if (this.stroke) {
            this.s.strokeWeight(this.sw);
            this.s.stroke(this.stroke);
        } else
            this.s.noStroke();
        this.showMove();
    }

    show() {
        if (this.s.frameCount >= this.start && this.s.frameCount < this.end) {
            this.showSetup();
            this.s.fill(this.color);

            this.s.text(this.str, this.x, this.y);
        }
    }
}

/** Refactored on 2019-04-25
 * TextFade
 *
 * Capable of displaying Fade-In and/or Fade-Out animations
 *
 * ---- args list parameters ----
 * @mandatory (string) str; (number) x, y; (p5.Font) font
 * @optional (number) mode, size, start [in frames, not seconds], duration [in seconds];
 *           (array) color [should be an array]
 */
class TextFade extends Text {
    constructor(ctx, args) {
        super(ctx, args);
        this.initC = deep_copy(this.color);
        this.initC[3] = 0;
        if (this.color[3] === undefined)
            this.color[3] = 255;
        this.ft = new FillChanger(ctx, this.initC);

        this.duration = args.duration || 0.7;
        this.timer = new Timer0(frames(this.duration));
    }

    show() {
        if (this.s.frameCount >= this.start - 1) {
            if (this.s.frameCount === this.start)
                this.ft.reColor(this.color, this.duration);
            else if (this.s.frameCount === this.end)
                this.ft.fadeOut(this.duration);

            this.showSetup();
            this.s.text(this.str, this.x, this.y);
        }

    }

}

// does not yet support fade out
class TextWriteIn extends Text {
    constructor(ctx, args) {
        super(ctx, args);
        this.frCount = 0;
        this.len = this.str.length;
        this.txt = "";
    }
    show() {
        if (this.s.frameCount >= this.start) {
            this.showSetup();
            if (this.frCount < this.len) {
                this.txt += this.str[this.frCount];
                this.frCount++;
            }
            this.s.text(this.txt, this.x, this.y);
        }
    }
}

/***
 * todo
 */
class TextRoll extends TextFade {
    constructor(ctx, args) {
        super(ctx, args);
    }

    /**
     * @param str - could be a number
     */
    roll(str) {
        this.reset({ str: "" + str });
    }

    rolling() {

    }
}


/*** 2018-12-23
 * Katex
 * Base class for all math text objects. These are displayed directly as texts on the browser,
 * so I cannot do any animations on them except moving the position, changing the opacity, etc.
 * Requires the p5.dom.js and katex.js libraries.
 *
 * The color of the text defaults to white. To reColor color, use \\textcolor{}{...} inside args.text
 *
 * Refactor on 2019-04-10: if need fade in/out animations, no longer need to pass in
 * the bool values fadeIn and fadeOut
 *
 * ----args list parameters----
 * @mandatory (string) text/str--the string to display;
 * @optional (number) start--if display fade in animation, the frame to start animation (nonzero);
 *           (number) font_size, x, y, id; (string) color--note it's a string starting with '#';
 *           (number) end--if display fade out animation, the frame to start animation;
 *           (number) rotation--in degrees
 */
class Katex extends TextBase {
    constructor(ctx, args) {
        super(ctx, args);

        this.text = args.text || args.str;
        this.size = args.font_size || 37;
        this.color = args.color || '#fff';
        this.domId = args.id || 'KATEX-' + parseInt(Math.random().toString().substr(2)); // Rand ID
        this.canvasPos = ctx.canvas.getBoundingClientRect();

        this.k = this.s.createP('');
        this.k.style('color', this.color);
        this.k.style('font-size', this.size + 'px');
        this.k.id(this.domId);

        if (args.fadeIn === true || args.start !== undefined) {
            this.start = args.start || frames(1);
            this.timer = new Timer0(frames(0.7));
            this.k.style('opacity', 0);
        }
        if (args.fadeOut === true || args.end !== undefined) {
            this.end = args.end || frames(100);
            this.timer2 = new Timer0(frames(0.7));
        }
    }

    /*** Refactored on 2019-02-04
     * The show() now takes in the optional parameters x, y.
     * Otherwise if I have a group of Katex objects stored in a class
     * that need to move in the same manner, I will have to reset them one by one.
     * Now I can just inherit that class of a group of Katex's from PointBase, and call
     * show(this.x, this.y) on each Katex object. No need to move the Katex's one by one now.
     */
    show(x, y) {
        this.showMove();
        if (x !== undefined) {
            this.k.position(x + this.canvasPos.x, y + this.canvasPos.y);  // todo: refactor for chap 5
        } else {
            // Based on the canvas position in the DOM
            this.k.position(this.x + this.canvasPos.x, this.y + this.canvasPos.y);
        }
        this.k.style('rotate', this.rotation);

        if ((this.timer !== undefined) && this.s.frameCount > this.start) {
            this.k.style('opacity', this.timer.advance());
        }
        if ((this.timer2 !== undefined) && this.s.frameCount > this.end) {
            this.k.style('opacity', 1 - this.timer2.advance());
        }
        katex.render(this.text, window[this.domId]);
    }
}

