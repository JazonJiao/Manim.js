/** 2018-12-20,22
 * Plot
 * Contains a bunch of points, in addition to the axes
 * Can also derive from the Grid class
 * Capable of calculating the least square line of the points, and displaying the line
 *
 * startLSLine
 */
class Plot extends Axes {
    // 2019-01-07: after refactoring, don't need to load a csv file, data is passed in as two arrays
    constructor(args) {
        super(args);
        //this.showLabel = args.showLabel || false;  // show numerical labels

        // the x- and y- coordinates of all the points are stored in two separate arrays
        // Xs and Ys are the original coordinates
        // ptXs and ptYs store the transformed version: the coordinates on the canvas
        this.numPts = args.xs.length;

        // time to start displaying least squares line
        this.startLSLine = args.startLSLine || this.start + frames(1);
        this.startPt = args.startPt || this.start;

        this.Xs = args.xs;
        this.Ys = args.ys;
        this.ptXs = [];
        this.ptYs = [];
        this.calcCoords();
        this.points = [];
        for (let i = 0; i < this.numPts; i++) {
            this.points[i] = new PlotPoint({
                x: this.ptXs[i],
                y: this.ptYs[i],
                radius: 10,
                // display all points in 1 second
                start: this.startPt + i * frames(1) / this.numPts
            })
        }

        // calculate the parameters for displaying the least squares line on the canvas
        this.calcParams();

        this.LSLine = new Line({
            x1: this.left,
            x2: this.right,
            y1: this.y_intercept + this.beta * (this.centerX - this.left),
            y2: this.y_intercept - this.beta * (this.right - this.centerX),
            color: color(77, 177, 77),
            strokeweight: 3,
            start: this.startLSLine
        });
    }

    calcCoords() {
        for (let i = 0; i < this.numPts; i++) {
            this.ptXs[i] = this.centerX + this.Xs[i] * this.stepX;
            this.ptYs[i] = this.centerY - this.Ys[i] * this.stepY;
        }
    }

    avgxs() {
        let sum = 0;
        for (let i = 0; i < this.numPts; ++i) {
            sum += this.Xs[i];
        }
        return sum / this.numPts;
    }

    avgys() {
        let sum = 0;
        for (let i = 0; i < this.numPts; ++i) {
            sum += this.Ys[i];
        }
        return sum / this.numPts;
    }


    // calculate the parameters, and the coordinates of least squares line
    // formula: beta = (sum of xi * yi - n * xbar * ybar) / (sum of xi^2 - n * xbar^2)
    calcParams() {
        this.avgX = this.avgxs();
        this.avgY = this.avgys();

        let sumXY = 0, sumXsq = 0;
        for (let i = 0; i < this.numPts; i++) {
            sumXY += this.Xs[i] * this.Ys[i];
            sumXsq += this.Xs[i] * this.Xs[i];
        }
        this.beta = (sumXY - this.numPts * this.avgX * this.avgY)
            / (sumXsq - this.numPts * this.avgX * this.avgX);

        this.beta_0 = this.avgY - this.beta * this.avgX;

        this.y_intercept = this.centerY - this.beta_0 * this.stepY;
        this.xbar = this.centerX + this.avgX * this.stepX;
        this.ybar = this.centerY - this.avgY * this.stepY;
    }


    showPoints() {
        for (let i = 0; i < this.numPts; ++i) {
            this.points[i].show();
        }
    }
}

/** 2018-12-23
 * PlotPoint
 * Helper class of Plot. Capable of displaying init animations of the points
 *
 * ----args list parameters----
 * @mandatory (number) x, y, radius, start
 */
class PlotPoint {
    constructor(args) {
        this.x = args.x;
        this.y = args.y;
        this.radius = args.radius;
        this.start = args.start;
        this.color = args.color || [255, 255, 0];

        this.timer = new Timer1(frames(0.7));
        this.t = 0;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
    }

    show() {
        if (frameCount > this.start) {
            this.t = this.timer.advance();

            // draw the contour
            noFill();
            stroke(255, 0, 0);
            strokeWeight((1 - this.t) * this.radius / 3);
            arc(this.x, this.y, this.radius, this.radius, 0, this.t * TWO_PI);

            // draw the ellipse
            noStroke();
            fill(this.color[0], this.color[1], this.color[2], 255 * this.t);
            ellipse(this.x, this.y, this.radius, this.radius);
        }
    }
}

//let orange = color(247, 137, 27);  // fixme: why doesn't it work?

// define the time for init animations
let time;
let sceneNum = 3;
let t = 0;

// todo: next time, be more careful at naming things and maybe use += to control time

// scene 1 -- paragraph 1
switch (sceneNum) {
    case 1:  // paragraph 1
        t = frames(19);
        time = {
            axes: frames(2),
            leastSqLine: frames(5),
            formula: frames(8),
            emphasizeBhat: frames(11),
            emphasizeBend: frames(12.5),
            formulabeta: frames(13),
            dottedlineX: t0,
            dottedlineY: t0,
            rect1: t0 + 50,
            rects: t0,
        };
        break;
    case 2:  // paragraph 2
        t = 0;
        time = {
            axes: t += 30,
            table: t += 30,
            points: t += 50,
            indVar: frames(10),
            depVar: frames(13),
            emphasizeX: frames(15),
            emphasizeXend: frames(17),
            simpleLR: frames(18),
        };
        break;
    case 3:  // paragraph 3, 4
        let t = 0;
        time = {
            axes: frames(0),
            linRel: frames(4),
            leastSqLine: frames(8),
            formula: frames(12),
            showSlope: frames(16),
            showIntercept: frames(18),
            emphasizeBhat: frames(21),
            emphasizeB0: frames(22),
            estimates: frames(26),
            emphasizeBend: frames(36),
            emphasizeB0end: frames(36),
            emphasizeYhat: frames(36.7),
            givenx: frames(40) - t,
            estimateLine: frames(42) - t,
            giveny: frames(43) - t,
        };
        break;
    case 4:  // paragraph 5, 6
        t = frames(55);
        time = {
            axes: frames(0),
            formula: frames(0),
            emphasizeBhat: frames(3),
            formulabeta: frames(6),
            emphasizeBend: frames(20),
            dottedlineX: frames(21),
            dottedlineY: frames(27),
            showCoord: frames(35),
            showCoordFade: frames(37),
            xMinusXbarLine: frames(38.7),
            xMinusXbar: frames(40.7),
            yMinusYbarLine: frames(44),
            yMinusYbar: frames(46),
            rect1: frames(50),
            formulaFadeOut: frames(52.7),
            areaEq: frames(53),
            rects: t + frames(5),
            areaEqFadeOut: t + frames(9.7),
            sumRectA: t + frames(10),
            emphasizeNumerator: t + frames(13),
            emphasizeNumEnd: t + frames(15),
            emphasizeDenom: t + frames(20)
        };
        break;
    case 5:  // paragraph 7 (1)
        time = {
            axes: frames(0),
            rect1: frames(0),
            rects: frames(0),
            dottedlineX: frames(0),
            dottedlineY: frames(0),
            formulabeta: frames(0),
            sumRectA: frames(0),

            yEqualsx: frames(1),
            toxx: frames(2),
            showCoord1: frames(3),
            showCoordFade1: frames(5)
        };
        break;
    case 6:  // paragraph 7 (2): show the line y = x-bar
        time = {
            axes: frames(0),
            rect1: frames(0),
            rects: frames(0),
            dottedlineX: frames(0),
            formulabeta: frames(0),
            sumRectA: frames(0),
            yEqualsx: frames(0),
            toxx: frames(1),

            dottedlineY: frames(4),
        };
        break;
    case 7:  // paragraph 7 (3): show the squares
        time = {
            axes: frames(0),
            dottedlineX: frames(0),
            formulabeta: frames(0),
            sumRectA: frames(0),
            yEqualsx: frames(0),
            toxx: frames(1),
            dottedlineY: frames(0),

            rects: frames(4),
            rect1: frames(5.7),
            xMinusXbarLine: frames(7),
            xMinusXbar: frames(8),
            sumSqA: frames(9),
            emphasizeDenom: frames(10)
        };
        break;
    case 9:
        time = {
            axes: frames(0),

            // reset1: frames(1),
            // reset2: frames(2),
            quadrants: frames(3),
            plusMinus: frames(3.7)
        };
        break;
}

let xs = [10, 14, 20, 27, 33, 41];
let ys = [11, 17, 18, 29, 31, 37];
// let xs = [7, 14, 20, 27, 33, 41];
// let ys = [-2, 4, 18, 29, 36, 37];
let ys2 = [42, 37, 22, 19, 7, -2];


class SLR_Plot extends Plot {    // the plot used to illustrate simple linear regression
    constructor(args) {
        // somehow in the super class, the actual coordinate of x_bar is called avgX (xs)
        // and its canvas coordinate is called xbar (ptXs). I should really be more considerate
        // in how I name things...
        super(args);

        // the two dotted lines displaying x-bar and y-bar

        this.xbarLine = new DottedLine({
            x1: this.xbar, x2: this.xbar,
            y1: this.top, y2: this.bottom,
            color: color(77, 177, 247),
            strokeweight: 2,
            start: getT(time.dottedlineX)
        });
        this.ybarLine = new DottedLine({
            x1: this.left, x2: this.right,
            y1: this.ybar, y2: this.ybar,
            color: color(77, 177, 247),
            strokeweight: 2,
            start: getT(time.dottedlineY)
        });

        // the lines showing x1 - x_bar and y1 - y_bar
        let index = this.numPts - 1;
        this.xMinusxbarLine = new Line({
            x1: this.xbar,
            x2: this.ptXs[index],
            y1: this.ptYs[index],
            y2: this.ptYs[index],
            start: getT(time.xMinusXbarLine),
            color: color(247, 137, 27)
        });
        this.yMinusybarLine = new Line({
            x1: this.ptXs[index],
            x2: this.ptXs[index],
            y1: this.ybar,
            y2: this.ptYs[index],
            start: getT(time.yMinusYbarLine),
            color: color(247, 137, 27)
        });

        // We can use the emphasis class as rectangles, with the end time "infinite"
        this.rects = [];
        for (let i = 0; i < this.numPts - 1; ++i) {
            this.rects[i] = new Emphasis({
                x: this.xbar,
                y: this.ybar,
                w: this.ptXs[i] - this.xbar,
                h: this.ptYs[i] - this.ybar,
                start: getT(time.rects) + i * frames(2) / this.numPts,
                end: frames(1000),  // todo
                color: color(207, 207, 27, 87)
            });
        }
        this.rects[index] = new Emphasis({
            x: this.xbar,
            y: this.ybar,
            w: this.ptXs[index] - this.xbar,
            h: this.ptYs[index] - this.ybar,
            start: getT(time.rect1),
            end: frames(1000),  // todo
            color: color(207, 207, 27, 87)
        });

        this.beta0Line = new Line({
            x1: this.centerX, y1: this.centerY,
            x2: this.centerX, y2: this.y_intercept,
            start: getT(time.showIntercept),
            color: color(247, 117, 117)
        });
        this.slopeLine1 = new Line({   // I just hardcoded these values
            x1: 400, y1: 300,
            x2: 400, y2: 264,
            start: getT(time.showSlope),
            color: color(247, 117, 117)
        });
        this.slopeLine2 = new Line({
            x1: 400, y1: 300,
            x2: 357, y2: 300,
            start: getT(time.showSlope),
            color: color(247, 117, 117)
        });
        this.yEqualsxLine = new Line({
            x1: 0, y1: 650,
            x2: 650, y2: 0,
            start: getT(time.yEqualsx),
            color: color(77, 177, 77),
        });
        this.quadrant2 = new Emphasis({
            x: 0, y: 0,
            w: this.xbar, h: this.ybar,
            start: getT(time.quadrants),
            color: color(77, 77, 177, 77)
        });
        this.quadrant4 = new Emphasis({
            x: this.xbar, y: this.ybar,
            w: this.right - this.xbar, h: this.bottom - this.ybar,
            start: getT(time.quadrants),
            color: color(77, 77, 177, 77)
        });
        this.plusMinus = [];
        this.plusMinus[0] = new TextFadeIn({
            str: "+",
            mode: 1, font: comic,
            x: this.xbar + (this.right - this.xbar) / 2,
            y: this.ybar / 2,
            size: 77,
            start: getT(time.plusMinus)
        });
        this.plusMinus[1] = new TextFadeIn({
            str: "-",
            mode: 1, font: comic,
            x: this.xbar / 2,
            y: this.ybar / 2,
            size: 77,
            start: getT(time.plusMinus)
        });
        this.plusMinus[2] = new TextFadeIn({
            str: "+",
            mode: 1, font: comic,
            x: this.xbar / 2,
            y: this.ybar + (this.bottom - this.ybar) / 2,
            size: 77,
            start: getT(time.plusMinus)
        });
        this.plusMinus[3] = new TextFadeIn({
            str: "-",
            mode: 1, font: comic,
            x: this.xbar + (this.right - this.xbar) / 2,
            y: this.ybar + (this.bottom - this.ybar) / 2,
            size: 77,
            start: getT(time.plusMinus)
        });
        // added for scene 3
        let givenx = 450;
        this.givenXPt = new PlotPoint({
            x: givenx + this.centerX,
            y: this.centerY,
            radius: 24,
            start: getT(time.givenx),
            color: [255, 185, 0]
        });
        this.givenYPt = new PlotPoint({
            x: givenx + this.centerX,
            y: this.y_intercept - this.beta * givenx,
            radius: 17,
            start: getT(time.giveny),
            color: [255, 185, 0]
        });
        this.estimateLine = new DottedLine({
            x1: givenx + this.centerX, x2: givenx + this.centerX,
            y2: this.y_intercept - this.beta * givenx, y1: this.centerY,
            color: color(77, 177, 247),
            strokeweight: 2,
            start: getT(time.estimateLine)
        });
    }



    reset(xs, ys) {
        this.xo = this.Xs.copyWithin();
        this.yo = this.Ys.copyWithin();
        this.xd = xs;
        this.yd = ys;
        this.timer = new Timer2(frames(1.4));
        this.resetted = true;
    }

    resetting() {
        let t = this.timer.advance();
        for (let i = 0; i < this.numPts; i++) {
            // this.Xs[i] = this.xo[i] + (this.xd[i] - this.xo[i]) * t;
            this.Ys[i] = this.yo[i] + (this.yd[i] - this.yo[i]) * t;
        }
        this.calcCoords();
        for (let i = 0; i < this.numPts; i++) {
            this.points[i].reset(this.ptXs[i], this.ptYs[i]);
        }
        this.calcParams();
        this.LSLine.reset({
            y1: this.y_intercept + this.beta * (this.centerX - this.left),
            y2: this.y_intercept - this.beta * (this.right - this.centerX)
        });
        this.ybarLine.reset({
            y1: this.ybar, y2: this.ybar,
        });
        this.xMinusxbarLine.reset({
            x1: this.xbar,
            x2: this.ptXs[this.numPts - 1],
            y1: this.ptYs[this.numPts - 1],
            y2: this.ptYs[this.numPts - 1],
        });
        for (let i = 0; i < this.numPts; i++) {
            this.rects[i].reset({
                x: this.xbar,
                y: this.ybar,
                w: this.ptXs[i] - this.xbar,
                h: this.ptYs[i] - this.ybar
            })
        }
    };

    show() {
        if (this.resetted) {
            this.resetting();
        }
        this.xbarLine.show();
        this.ybarLine.show();
        this.xMinusxbarLine.show();
        this.yMinusybarLine.show();
        for (let r of this.rects) {
            r.show();
        }
        this.showAxes(); // this.showGrid()
        this.showPoints();
        this.LSLine.show();
        this.beta0Line.show();
        this.slopeLine1.show();
        this.slopeLine2.show();
        this.yEqualsxLine.show();
        this.quadrant2.show();
        this.quadrant4.show();
        for (let p of this.plusMinus) {
            p.show();
        }
        this.givenXPt.show();
        this.givenYPt.show();
        this.estimateLine.show();
    }

    getXbar() {
        return this.xbar;
    }

    getYbar() {
        return this.ybar;
    }
}

let hg;
let plot;
let kats = [];
let txts = [];
let arrows = [];
let emps = [];
let table;
let comic;


function preload() {
    comic = loadFont('../lib/font/comic.ttf');
}

function setup() {
    //pixelDensity(1);
    frameRate(fr);

    createCanvas(1200, 675);
    background(0);

    hg = new HelperGrid();
    plot = new SLR_Plot({
        right: 675,
        centerX: 100, centerY: 550,
        stepX: 10, stepY: 10,
        start: getT(time.axes),
        startPt: time.points,
        startLSLine: getT(time.leastSqLine),
        xs: xs, ys: ys
    });
    table = new Table({
        x: 700, y: 170,
        size: 37,
        xs: xs, ys: ys,
        start: getT(time.table),
        font: comic
    });

    txts[0] = new TextWriteIn({
        str: "Independent variable",
        x: 777, y: 57,
        font: comic,
        start: getT(time.indVar),
        color: [57, 147, 247]
    });
    arrows[0] = new Arrow({
        x1: 767, y1: 111,
        x2: 727, y2: 167,
        start: getT(time.indVar) + frames(0.7),
        duration: frames(2),
        color: color(57, 147, 247)
    });

    txts[1] = new TextWriteIn({
        str: "Dependent variable",
        x: 777, y: 327,
        font: comic,
        start: getT(time.depVar),
        color: [247, 77, 247]
    });
    arrows[1] = new Arrow({
        x1: 767, y1: 327,
        x2: 727, y2: 277,
        start: getT(time.depVar) + frames(0.7),
        duration: frames(2),
        color: color(247, 77, 247)
    });

    txts[2] = new TextFadeIn({
        str: "\"Simple\"\nLinear Regression",
        mode: 1,
        x: 950, y: 500,
        font: comic,
        start: getT(time.simpleLR),
    });
    txts[3] = new TextWriteIn({
        str: "Linear relationship",
        x: 777, y: 57,
        font: comic,
        start: getT(time.linRel)
    });

    txts[4] = new TextWriteIn({
        str: "Sum of rectangle areas",
        x: 727, y: 117,
        font: comic,
        color: color(255, 255, 17),
        start: getT(time.sumRectA),
    });
    arrows[2] = new Arrow({
        x1: 920, y1: 170,
        x2: 1000, y2: 280,
        start: getT(time.sumRectA),
        color: color(255, 255, 17)
    });

    txts[5] = new TextWriteIn({
        str: "Sum of square areas",
        x: 757, y: 477,
        font: comic,
        color: color(255, 255, 17),
        start: getT(time.sumSqA),
    });
    arrows[3] = new Arrow({
        x1: 940, y1: 490,
        x2: 1000, y2: 400,
        start: getT(time.sumSqA),
        color: color(255, 255, 17)
    });

    txts[6] = new TextWriteIn({
        str: "\"Estimates\"",
        x: 837, y: 248,
        font: comic,
        color: color(255, 255, 17),
        start: getT(time.estimates)
    });


    kats[0] = new Katex0({
        text: "\\textstyle\\hat{\\beta}=\\frac{\\sum_{i=1}^n (x_i-\\bar{x})(y_i-\\bar{y})} " +
            "{\\sum_{i=1}^n(x_i-\\bar{x})^2}",
        x: 670,
        y: 240,
        start: getT(time.formulabeta),
        fadeIn: true,
        font_size: 54
    });

    kats[5] = new Katex5({
        text: "\\hat{y}=\\hat{\\beta}x+\\hat{\\beta_0}",
        x: 797, y: 107,
        start: getT(time.formula),
        fadeIn: true,
        font_size: 47,
        fadeOut: true,
        end: getT(time.formulaFadeOut)
    });

    kats[1] = new Katex1({
        text: "\\bar{x}",
        x: plot.getXbar() - 7,
        y: height - 160,
        start: getT(time.dottedlineX),
        fadeIn: true,
        font_size: 37
    });

    kats[2] = new Katex2({
        text: "\\bar{y}",
        x: 77,
        y: plot.getYbar() - 57,
        start: getT(time.dottedlineY),
        fadeOut: true, end: getT(time.toxx),
        fadeIn: true,
        font_size: 37,
    });

    kats[3] = new Katex3({
        text: "x_1 - \\bar{x}",
        x: 375,
        y: sceneNum === 7 ? 47 : 90,
        color: color(247, 137, 27),
        start: getT(time.xMinusXbar),
        fadeIn: true,
        font_size: 37
    });

    kats[4] = new Katex4({
        text: "y_1 - \\bar{y}",
        x: 531,
        y: 187,
        color: color(247, 137, 27),
        start: getT(time.yMinusYbar),
        fadeIn: true,
        font_size: 37
    });

    kats[6] = new Katex6({
        text: "\\hat{\\beta_0}",
        x: 117, y: 457,
        color: color(247, 117, 117),
        start: getT(time.showIntercept),
        fadeIn: true,
        font_size: 42
    });
    kats[7] = new Katex7({
        text: "\\hat{\\beta}",
        x: 417, y: 237,
        color: color(247, 117, 117),
        start: getT(time.showSlope),
        fadeIn: true,
        font_size: 42
    });

    kats[8] = new Katex8({
        text: "Area = (x_1 - \\bar{x})(y_1 - \\bar{y})",
        x: 650, y: 77,
        color: color(255, 255, 17),
        fadeIn: true, start: getT(time.areaEq),
        font_size: 42,
        fadeOut: true, end: getT(time.areaEqFadeOut)
    });

    kats[9] = new Katex9({
        text: "(x_1, y_1)",
        x: 520, y: 90,
        color: color(247, 137, 27),
        fadeIn: true, start: getT(time.showCoord),
        fadeOut: true, end: getT(time.showCoordFade),
        font_size: 37
    });

    kats[10] = new Katex10({
        text: "\\bar{x}",
        x: 77,
        y: plot.getYbar() - 57,
        start: getT(time.toxx),
        fadeIn: true,
        font_size: 37
    });

    kats[11] = new Katex11({
        text: "(x_i, x_i)",
        x: 520, y: 100,
        color: color(247, 137, 27),
        fadeIn: true, start: getT(time.showCoord1),
        fadeOut: true, end: getT(time.showCoordFade1),
        font_size: 37
    });

    emps[0] = new Emphasis({
        x: 890, y: 140,
        w: 40, h: 77,
        start: getT(time.emphasizeBhat),
        end: getT(time.emphasizeBend)
    });
    emps[1] = new Emphasis({
        x: 1030, y: 140,
        w: 57, h: 77,
        start: getT(time.emphasizeB0),
        end: getT(time.emphasizeB0end)
    });
    emps[2] = new Emphasis({
        x: 784, y: 150,
        w: 40, h: 67,
        start: getT(time.emphasizeYhat)
    });
    emps[3] = new Emphasis({
        x: 794, y: 280,
        w: 380, h: 60,
        start: getT(time.emphasizeNumerator),
        end: getT(time.emphasizeNumEnd)
    });
    emps[4] = new Emphasis({
        x: 850, y: 340,
        w: 267, h: 60,
        start: getT(time.emphasizeDenom)
    });
    emps[5] = new Emphasis({
        x: 700, y: 177,
        w: 57, h: 40,
        start: getT(time.emphasizeX),
        end: getT(time.emphasizeXend)
    });
}

function draw() {
    background(0);
    //showFR();
    //hg.show();
    for (let e of emps) e.show();

    if (frameCount === getT(time.toxx))
        plot.reset(xs, xs);
    if (frameCount === getT(time.reset1))
        plot.reset(xs, ys2);

    plot.show();
    table.show();

    for (let k of kats) k.show();
    for (let t of txts) t.show();
    for (let a of arrows) a.show();

}

