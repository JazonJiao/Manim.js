/*** 2019-01-04
 * Text
 * Needs to declare a font variable and set font = loadFont('../lib/font/times.ttf') in preload()
 * There should not be a global variable named text.
 * For mode 0 (default), the x and y define the coordinates for the upper-left corner of the text.
 * For mode 1, the x and y define the center for the text.
 * For the base class, no init animation is displayed.
 * If want init animation, use a derived class, TextFadeIn, or TextWriteIn
 *
 * ---- args list parameters ----
 * @mandatory (string) str; (number) x, y; (p5.Font) font
 * @optional (number) mode, size, start [if want to show init animation];
 *           (color) color [should be an array]
 */
class Text {
    constructor(ctx, args) {
        this.s = ctx;
        this.font = args.font;
        this.str = args.str;
        this.mode = args.mode || 0;
        this.color = args.color || [255, 255, 255];

        // I originally used the usual syntax of args.x || width / 2,
        // but this would not work if 0 is passed in as x
        this.x = args.x;
        this.y = args.y;
        this.size = args.size || 37;
    }

    reset(args) {
        this.str = args.str || this.str;
        this.x = args.x || this.x;
        this.y = args.y || this.y;
    }

    showSetup() {
        if (this.font) {
            this.s.textFont(this.font);
        }
        if (this.mode === 0) {
            this.s.textAlign(this.s.LEFT, this.s.TOP);
        } else if (this.mode === 1) {
            this.s.textAlign(this.s.CENTER, this.s.CENTER);
        }
        this.s.textSize(this.size);

        this.s.noStroke();
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
 * KatexBase
 * Base class for all math text objects. These are displayed directly as texts on the browser,
 * so I cannot do any animations on them except moving the position, changing the opacity, etc.
 *
 * Requires the p5.dom.js and katex.js libraries.
 * This structure is pretty ugly and dumb, as each new Katex text object needs a new class,
 * but as of now this is the only way I can get around the weirdness of using katex.js
 *
 * To avoid naming conflicts, classes that require Katex displays will have a new class of
 * Katex object exclusively for them (KatexAxis1, 2),
 * but if used, then these classes will have to be singletons.
 *
 * The color of the text defaults to white. To change color, use \\textcolor{}{...} inside args.text
 *
 * ----args list parameters----
 * @mandatory (string) str--the string to display;
 * @optional (bool) fadeIn, start--if display fade in animation, the frame to start animation;
 *           (number) font_size, x, y, (string) color--note it's passed as a string;
 *           (bool) fadeOut, end--if display fade out animation, the frame to start animation;
 */
class KatexBase {
    constructor(ctx, args) {
        this.s = ctx;
        this.text = args.text;
        this.size = args.font_size || 37;
        this.x = args.x || 0;
        this.y = args.y || 0;
        this.color = args.color || '#fff';

        this.k = this.s.createP('');
        this.k.position(this.x, this.y);
        this.k.style('color', this.color);
        this.k.style('font-size', this.size + 'px');

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

    reset(args) {
        this.x = args.x || this.x;
        this.y = args.y || this.y;
        this.size = args.size || this.size;
    }

    showInit() {
        if (this.fadeIn && this.s.frameCount > this.start) {
            this.k.style('opacity', this.timer.advance());
        }
        if (this.fadeOut && this.s.frameCount > this.end) {
            this.k.style('opacity', 1 - this.timer2.advance());
        }
    }

    show() {
    }
}

// sample instantiation:
// kat1 = new Katex1({
//     str: "\\frac {\\sum_{i=1}^n (x_i-\\bar{x})(y_i-\\bar{y})} {\\sum_{i=1}^n(x_i-\\bar{x})^2}",
//     x: 720,
//     y: 200,
//     fadeIn: true,
//     fontsize: 80
// });

class Katex0 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('kt0');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt0);
    }
}

class Katex1 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('kt1');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt1);
    }
}

class Katex2 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('kt2');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt2);
    }
}

class Katex3 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('kt3');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt3);
    }
}

class Katex4 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
    }

    show() {
        this.showInit();
        katex.render(this.text, kt4);
    }
}

class Katex5 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('kt5');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt5);
    }
}
class Katex6 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('kt6');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt6);
    }
}

class Katex7 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('kt7');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt7);
    }
}

class Katex8 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('kt8');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt8);
    }
}

class Katex9 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('kt9');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt9);
    }
}

class Katex10 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('kt10');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt10);
    }
}

class Katex11 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('kt11');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt11);
    }
}

class Katex12 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('kt12');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt12);
    }
}

class Katex13 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('kt13');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt13);
    }
}

class Katex14 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('kt14');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt14);
    }
}

class KatexAxis1 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('ktaxis1');
    }

    show() {
        this.showInit();
        katex.render(this.text, ktaxis1);
    }
}

class KatexAxis2 extends KatexBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.k.id('ktaxis2');
    }

    show() {
        this.showInit();
        katex.render(this.text, ktaxis2);
    }
}
