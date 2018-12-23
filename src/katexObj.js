/*** 2018-12-23
 * KatexBase
 * Base class for all math text objects. These are displayed directly as texts on the browser,
 * so I cannot do any animations on them except moving the position, changing the opacity, etc.
 *
 * Requires the p5.dom.js and katex.js libraries.
 * This structure is pretty awkward and dumb, as each new Katex text object needs a new class,
 * but as of now this is the only way I can get around the weirdness of using katex.js
 *
 * The color of the text defaults to white. To change color, use \\textcolor{}{...} inside args.str
 *
 * ----args list parameters----
 * @mandatory (string) str--the string to display;
 * @optional (bool) fadeIn, start--if display fade in animation, the frame to start animation;
 *           (number) fontsize, x, y;
 */
class KatexBase {
    constructor(args) {
        this.str = args.str;
        this.size = args.fontsize || 27;
        this.x = args.x;
        this.y = args.y;

        this.k = createP('');
        this.k.position(this.x, this.y);
        this.k.style('color', '#fff');
        this.k.style('font-size', this.size + 'px');

        this.k.attribute('align', 'center');

        this.fadeIn = args.fadeIn || false;
        if (this.fadeIn) {
            this.start = args.start || frames(1);
            this.k.style('opacity', 0);
            this.timer = new Timer0(frames(0.7));
        }
    }

    showInit() {
        if (this.fadeIn && frameCount > this.start) {
            this.k.style('opacity', this.timer.advance());
        }
    }

    show() {
    }
}

// example instantiation:
// kat1 = new Katex1({
//     str: "\\frac {\\sum_{i=1}^n (x_i-\\bar{x})(y_i-\\bar{y})} {\\sum_{i=1}^n(x_i-\\bar{x})^2}",
//     x: 720,
//     y: 200,
//     fadeIn: true,
//     fontsize: 80
// });


class Katex1 extends KatexBase {
    constructor(args) {
        super(args);
        this.k.id('kt1');
    }

    show() {
        this.showInit();
        katex.render(this.str, kt1);
    }
}

class Katex2 extends KatexBase {
    constructor(args) {
        super(args);
        this.k.id('kt2');
    }

    show() {
        this.showInit();
        katex.render(this.str, kt2);
    }
}
