// refactored on 01-20-2019
class TextBase {
    constructor(ctx, args) {
        this.s = ctx;
        // I originally used the usual syntax of args.x || width / 2,
        // but this would not work if 0 is passed in as x
        this.x = args.x;
        this.y = args.y;
    }

    reset(args) {
        this.str = args.str || this.str;
        this.x = args.x || this.x;
        this.y = args.y || this.y;
    }

    // enable move animations
    // in draw(), use: if (frameCount == getT(time.xxxx)) text[i].move(x, y)
    // note that duration is in seconds
    move(x, y, duration) {
        this.xo = this.x;
        this.yo = this.y;
        this.xd = x || this.x;    // destination x
        this.yd = y || this.y;
        this.moved = true;
        let t = frames(duration) || frames(2);

        this.move_timer = new Timer2(t);
    }

    moving() {
        let t = this.move_timer.advance();
        this.reset({
            x: this.xo + t * (this.xd - this.xo),
            y: this.yo + t * (this.yd - this.yo)
        })
    }
}


/*** 2019-01-04
 * Text
 * Needs to declare a font variable and set font = loadFont('../lib/font/times.ttf') in preload()
 * There should not be a global variable named text.
 * For mode 0 (default), the x and y define the coordinates for the upper-left corner of the text.
 * For mode 1, the x and y define the center for the text.
 * For mode 2, the x and y define the upper-right corner for the text.
 * For the base class, no init animation is displayed.
 * If want init animation, use a derived class, TextFadeIn, or TextWriteIn
 *
 * ---- args list parameters ----
 * @mandatory (string) str; (number) x, y; (p5.Font) font
 * @optional (number) mode, size, start [if want to show init animation];
 *           (color) color [should be an array]
 */


class Text extends TextBase {
    constructor(ctx, args) {
        super(ctx, args);

        this.font = args.font;
        this.str = args.str;
        this.mode = args.mode || 0;
        this.color = args.color || [255, 255, 255];

        this.size = args.size || 37;
    }

    showSetup() {
        if (this.font) {
            this.s.textFont(this.font);
        }
        if (this.mode === 0) {
            this.s.textAlign(this.s.LEFT, this.s.TOP);
        } else if (this.mode === 1) {

            this.s.textAlign(this.s.CENTER, this.s.CENTER);

            this.s.textAlign(this.s.CENTER, this.s.CENTER);
        } else if (this.mode === 2) {
            this.s.textAlign(this.s.RIGHT, this.s.TOP);

        }
        this.s.textSize(this.size);


        this.s.noStroke();
        if (this.moved) {
            this.moving();
        }
    }

    show() {
        this.showSetup();
        this.s.fill(this.color);
        //fill(this.color[0], this.color[1], this.color[2]);
        this.s.text(this.str, this.x, this.y);
    }
}

// needs to pass in extra parameters in frames, start and/or duration
class TextFadeIn extends Text {
    constructor(ctx, args) {
        super(ctx, args);
        this.start = args.start || frames(1);
        this.duration = args.duration || frames(0.7);
        this.timer = new Timer0(this.duration);
    }

    show() {
        this.showSetup();
        if (this.s.frameCount > this.start) {
            this.s.fill(this.color[0], this.color[1], this.color[2], 255 * this.timer.advance());
            this.s.text(this.str, this.x, this.y);
        }
    }

}

// needs to pass in an extra parameter in frames, start
class TextWriteIn extends Text {
    constructor(ctx, args) {
        super(ctx, args);
        this.start = args.start || frames(1);
        this.frCount = 0;
        this.len = this.str.length;
        this.txt = "";
    }
    show() {
        this.showSetup();
        this.s.fill(this.color);
        if (this.s.frameCount > this.start && this.frCount < this.len) {
            this.txt += this.str[this.frCount];
            this.frCount++;
        }
        this.s.text(this.txt, this.x, this.y);
    }
}


/*** 2018-12-23
 * Katex
 * Base class for all math text objects. These are displayed directly as texts on the browser,
 * so I cannot do any animations on them except moving the position, changing the opacity, etc.
 * Requires the p5.dom.js and katex.js libraries.
 *
 * The color of the text defaults to white. To change color, use \\textcolor{}{...} inside args.text
 *
 * ----args list parameters----
 * @mandatory (string) str--the string to display;
 * @optional (bool) fadeIn, start--if display fade in animation, the frame to start animation;
 *           (number) font_size, x, y, (string) color--note it'o passed as a string;
 *           (bool) fadeOut, end--if display fade out animation, the frame to start animation;
 */

// sample instantiation:
// kat1 = new Katex({
//     str: "\\frac {\\sum_{i=1}^n (x_i-\\bar{x})(y_i-\\bar{y})} {\\sum_{i=1}^n(x_i-\\bar{x})^2}",
//     x: 720,
//     y: 200,
//     fadeIn: true,
//     fontsize: 80
// });
class Katex extends TextBase {
    constructor(ctx, args) {

        super(ctx, args);

        this.text = args.text;
        this.size = args.font_size || 37;
        this.color = args.color || '#fff';
        this.domId = args.id || 'KATEX-' + parseInt(Math.random().toString().substr(2)); // Rand ID
        this.canvasPos = ctx.canvas.getBoundingClientRect();

        this.k = this.s.createP('');
        this.k.style('color', this.color);
        this.k.style('font-size', this.size + 'px');
        this.k.id(this.domId);

        this.fadeIn = args.fadeIn || false;
        if (this.fadeIn) {
            this.start = args.start || frames(1);
            this.timer = new Timer0(frames(0.7));
            this.k.style('opacity', 0);
        }
        this.fadeOut = args.fadeOut || false;
        if (this.fadeOut) {
            this.end = args.end || frames(100);
            this.timer2 = new Timer0(frames(0.7));
        }
    }

    showInit() {
        if (this.moved) {
            this.moving();
        }
      
        this.k.position(this.x + this.canvasPos.x, this.y + this.canvasPos.y); // Based on the canvas position in the DOM


        if (this.fadeIn && this.k.frameCount > this.start) {

            this.k.style('opacity', this.timer.advance());
        }
        if (this.fadeOut && this.s.frameCount > this.end) {
            this.k.style('opacity', 1 - this.timer2.advance());
        }
    }

    show() {
        this.showInit();
        katex.render(this.text, window[this.domId]);
    }
}

