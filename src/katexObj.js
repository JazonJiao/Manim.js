/*** 2018-12-23
 * KatexBase
 * Base class for all math text objects. These are displayed directly as texts on the browser,
 * so I cannot do any animations on them except moving the position, changing the opacity, etc.
 *
 * Requires the p5.dom.js and katex.js libraries.
 * This structure is pretty ugly and dumb, as each new Katex text object needs a new class,
 * but as of now this is the only way I can get around the weirdness of using katex.js
 *
 * The color of the text defaults to white. To change color, use \\textcolor{}{...} inside args.text
 *
 * ----args list parameters----
 * @mandatory (string) str--the string to display, color--note it's passed as a string;
 * @optional (bool) fadeIn, start--if display fade in animation, the frame to start animation;
 *           (number) font_size, x, y;
 *           (bool) fadeOut, end--if display fade out animation, the frame to start animation;
 */
class KatexBase {
    constructor(args) {
        this.text = args.text;
        this.size = args.font_size || 27;
        this.x = args.x;
        this.y = args.y;
        this.color = args.color || '#fff';

        this.k = createP('');
        this.k.id('kt1');
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

    showInit() {
        if (this.fadeIn && frameCount > this.start) {
            this.k.style('opacity', this.timer.advance());
        }
        if (this.fadeOut && frameCount > this.end) {
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
    constructor(args) {
        super(args);
        this.k.id('kt0');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt0);
    }
}

class Katex1 extends KatexBase {
    constructor(args) {
        super(args);
        this.k.id('kt1');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt1);
    }
}

class Katex2 extends KatexBase {
    constructor(args) {
        super(args);
        this.k.id('kt2');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt2);
    }
}

class Katex3 extends KatexBase {
    constructor(args) {
        super(args);
        this.k.id('kt3');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt3);
    }
}

class Katex4 extends KatexBase {
    constructor(args) {
        super(args);
        this.k.id('kt4');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt4);
    }
}

class Katex5 extends KatexBase {
    constructor(args) {
        super(args);
        this.k.id('kt5');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt5);
    }
}
class Katex6 extends KatexBase {
    constructor(args) {
        super(args);
        this.k.id('kt6');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt6);
    }
}

class Katex7 extends KatexBase {
    constructor(args) {
        super(args);
        this.k.id('kt7');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt7);
    }
}

class Katex8 extends KatexBase {
    constructor(args) {
        super(args);
        this.k.id('kt8');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt8);
    }
}

class Katex9 extends KatexBase {
    constructor(args) {
        super(args);
        this.k.id('kt9');
    }

    show() {
        this.showInit();
        katex.render(this.text, kt9);
    }
}