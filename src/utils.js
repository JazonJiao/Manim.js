/** SUMMARY OF CLASSES
 * '-' is-a relationship; '<' has-a relationship
 *
 * HelperGrid
 * Axes
 * - Grid
 *
 * Rect
 * - Emphasis
 *
 * Line
 * - LineCenter
 * - DottedLine
 * - Arrow
 *
 * Table < LineCenter
 */


/** 2018-12-20
 * HelperGrid
 * This acts like a scaffold, and helps me find out the coordinates of the objects in a scene.
 * It is removed when the movie is actually rendered.
 */
class HelperGrid {
    constructor(ctx, args) {
        this.s = ctx;
        this.w = ctx.width || width;
        this.h = ctx.height || height;
    }

    show() {
        this.s.strokeWeight(1);

        // draw horizontal helper lines
        this.s.stroke(137);
        for (let i = 100; i < this.w; i += 200) {
            this.s.line(i, 0, i, this.h);
        }
        this.s.stroke(255);
        for (let i = 200; i < this.w; i += 200) {
            this.s.line(i, 0, i, this.h);
        }
        this.s.stroke(57);
        for (let i = 50; i < this.w; i += 100) {
            this.s.line(i, 0, i, this.h);
        }

        // draw vertical lines
        this.s.stroke(137);
        for (let i = 100; i < this.w; i += 200) {
            this.s.line(0, i, this.w, i);
        }
        this.s.stroke(255);
        for (let i = 200; i < this.w; i += 200) {
            this.s.line(0, i, this.w, i);
        }
        this.s.stroke(57);
        for (let i = 50; i < this.w; i += 100) {
            this.s.line(0, i, this.w, i);
        }
    }
}


/** 2018-12-23
 * Axes
 * Contains two arrows. If labelX and labelY are passed in, this class would be a singleton.
 * To be displayed correctly, labelX and labelY should contain only 1 character.
 *
 * ---- args list parameters ----
 * @optional (number) top, bottom, left, right, centerX, centerY, stepX, stepY;
 *           (string) labelX, labelY, (number) offsetX, offsetY
 */
class Axes {
    constructor(ctx, args) {
        this.s = ctx;
        //this.showLabel = args.showLabel || false;  // show numerical labels

        // the following parameters define the scope of the plot'o grid lines on the canvas
        // NOTE: top and left must be a multiple of 50
        this.top = args.top || 0;
        this.left = args.left || 0;
        this.bottom = args.bottom || ctx.height || height;
        this.right = args.right || ctx.width || width;

        // define the origin'o x and y coordinates on the canvas
        this.centerX = args.centerX || ctx.width / 2 || width / 2;
        this.centerY = args.centerY || ctx.height / 2 || height / 2;

        // define how many pixels correspond to 1 on each axis
        this.stepX = args.stepX || 100;
        this.stepY = args.stepY || 100;

        this.start = args.start || 0;

        if (args.labelX) {
            this.offsetX = args.offsetX || -27;  // default offset value based on displaying x
            this.label1 = new Katex(this.s, {
                text: args.labelX,
                x: this.right + this.offsetX, y: this.centerY - 95,
                fadeIn: true, start: this.start,
            });
        }
        if (args.labelY) {
            this.offsetY = args.offsetY || -47;  // default offset value based on displaying y
            this.label2 = new Katex(this.s, {
                text: args.labelY,
                x: this.centerX + 14, y: this.top + this.offsetY,
                fadeIn: true, start: this.start,
            })
        }

        this.xAxis = new Arrow(this.s, {
            x1: this.left, x2: this.right, y1: this.centerY, y2: this.centerY,
            frames: frames(6), start: this.start
        });

        this.yAxis = new Arrow(this.s, {
            x1: this.centerX, x2: this.centerX, y1: this.bottom, y2: this.top,
            frames: frames(6), start: this.start
        });
    }

    showAxes() {
        this.xAxis.show();
        this.yAxis.show();
        if (this.label1) this.label1.show();
        if (this.label2) this.label2.show();
    }
}

/** 2018-12-21
 * Grid
 * A grid similar to what 3b1b used throughout the EOLA series
 * in the derived class'o show(), need to call showGrid()
 *
 *  * ---- args list parameters ----
 * @optional (number) top, bottom, left, right, centerX, centerY, stepX, stepY
 */
class Grid extends Axes {
    constructor(ctx, args) {
        super(ctx, args);

        this.spacing = args.spacing || 50;

        this.maxNumLines = 0;
        this.gridlineup = [];    // y-coords of grid lines above the x-axis
        this.gridlinedown = [];  // y-coords of grid lines below the x-axis
        this.gridlineleft = [];  // x-coords of grid lines left of y-axis
        this.gridlineright = []; // x-coords of grid lines right of y-axis
        for (let i = 0, y = this.centerY - this.spacing; y > this.top; i++, y -= this.spacing) {
            this.gridlineup[i] = y;
            if (i > this.maxNumLines)
                this.maxNumLines = i;
        }
        for (let i = 0, y = this.centerY + this.spacing; y < this.bottom; i++, y += this.spacing) {
            this.gridlinedown[i] = y;
            if (i > this.maxNumLines)
                this.maxNumLines = i;
        }
        for (let i = 0, x = this.centerX - this.spacing; x > this.left; i++, x -= this.spacing) {
            this.gridlineleft[i] = x;
            if (i > this.maxNumLines)
                this.maxNumLines = i;
        }
        for (let i = 0, x = this.centerX + this.spacing; x < this.right; i++, x += this.spacing) {
            this.gridlineright[i] = x;
            if (i > this.maxNumLines)
                this.maxNumLines = i;
        }
        this.maxNumLines++;

        this.timer = [];
        for (let i = 0; i < this.maxNumLines; i++) {
            this.timer[i] = new Timer2(frames(0.5));
        }

    }

    showGrid() {
        this.showAxes();
        for (let i = 0; i < this.maxNumLines; ++i) {
            this.s.strokeWeight(2);
            if (this.s.frameCount - this.start - frames(1) > i * 2) {
                if (i % 2 === 1) {  // major grid line
                    this.s.stroke(27, 177, 247);
                } else {    // minor grid line
                    this.s.stroke(17, 67, 77);
                }
                //stroke(27, 177, 247);

                let t = this.timer[i].advance();
                let right = this.left + (this.right - this.left) * t;
                let top = this.bottom + (this.top - this.bottom) * t;

                if (i < this.gridlineup.length) {
                    let y = this.gridlineup[i];
                    this.s.line(this.left, y, right, y);
                }
                if (i < this.gridlinedown.length) {
                    let y = this.gridlinedown[i];
                    this.s.line(this.left, y, right, y);
                }
                if (i < this.gridlineleft.length) {
                    let x = this.gridlineleft[i];
                    this.s.line(x, this.bottom, x, top);
                }
                if (i < this.gridlineright.length) {
                    let x = this.gridlineright[i];
                    this.s.line(x, this.bottom, x, top);
                }
            }
        }
    }
}

/** 2018-12-20,22
 * Plot
 * Contains a bunch of points, in addition to the axes
 * Can also derive from the Grid class
 * Capable of calculating the least square line of the points, and displaying the line
 *
 * ---- args list parameters (in addition to axes) ----
 * xs, ys, startLSLine, startPt, lineColor,
 * [If want to show labels:] ptLabel: true, font: tnr
 */
class Plot extends Axes {
    // 2019-01-07: after refactoring, don't need to load a csv file, data is passed in as two arrays
    constructor(ctx, args) {
        super(ctx, args);
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
            this.points[i] = args.ptLabel ? new PlotPoint(this.s, {
                x: this.ptXs[i], y: this.ptYs[i], radius: 12, val: this.Ys[i], font: args.font,
                start: this.startPt + i * frames(1) / this.numPts
            }) : new Point(this.s, {
                x: this.ptXs[i], y: this.ptYs[i], radius: 12,
                start: this.startPt + i * frames(1) / this.numPts  // display all points in 1 second
            });
        }
        // calculate the parameters for displaying the least squares line on the canvas
        this.calcParams();

        this.LSLine = new Line(this.s, {
            x1: this.left,
            x2: this.right,
            y1: this.y_intercept + this.beta * (this.centerX - this.left),
            y2: this.y_intercept - this.beta * (this.right - this.centerX),
            color: args.lineColor || this.s.color(77, 177, 77),
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
    // formula: beta = (sum of xi * yi - n * coordX * coordY) / (sum of xi^2 - n * coordX^2)
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
        this.coordX = this.centerX + this.avgX * this.stepX;
        this.coordY = this.centerY - this.avgY * this.stepY;
    }

    showPoints() {
        for (let i = 0; i < this.numPts; ++i) {
            this.points[i].show();
        }
    }
}

/** 2018-12-23
 * Point
 * Capable of displaying init animations of the point
 *
 * ----args list parameters----
 * @mandatory (number) x, y
 * @optional (number) radius, start; (array) color
 */
class Point {
    constructor(ctx, args) {
        this.s = ctx;
        this.x = args.x;
        this.y = args.y;
        this.radius = args.radius || 10;
        this.start = args.start || 0;
        this.color = args.color || [255, 255, 0];

        this.timer = new Timer1(frames(0.7));
        this.t = 0;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
    }

    show() {
        if (this.s.frameCount > this.start) {
            this.t = this.timer.advance();

            // draw the contour
            this.s.noFill();
            this.s.stroke(255, 0, 0);
            this.s.strokeWeight((1 - this.t) * this.radius / 3);
            this.s.arc(this.x, this.y, this.radius, this.radius, 0, this.t * this.s.TWO_PI);

            // draw the ellipse
            this.s.noStroke();
            this.s.fill(this.color[0], this.color[1], this.color[2], 255 * this.t);
            this.s.ellipse(this.x, this.y, this.radius, this.radius);
        }
    }
}

// extra args: val, font
class PlotPoint extends Point {
    constructor(ctx, args) {
        super(ctx, args);
        this.txt = new TextFade(ctx, {
            str: args.val, font: args.font, mode: 1, size: 27,
            x: this.x, y: this.y - 27, start: this.start
        })
    }
    show() {
        super.show();
        this.txt.show();
    }
}

/** 2018-12-23
 * A rectangle, with fade-in and fade-out animations
 *
 * ----args list parameters----
 * @mandatory (number) x, y, w, h
 * @optional (number) start, end; (array) color
 */
class Rect extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.w = args.w;
        this.h = args.h;

        this.color = args.color || [255, 255, 255, 255];

        // timer for displaying start and end animations, respectively
        this.timer = new Timer0(frames(this.duration));  // fixme: use Timer1?
        this.timer2 = new Timer1(frames(this.duration));
        this.t = 0;
    }

    reset(args) {
        this.x = args.x || this.x;
        this.y = args.y || this.y;
        this.w = args.w || this.w;
        this.h = args.h || this.h;
    }

    // sets stroke and the t value
    showSetup() {
        this.s.noStroke();
        if (this.s.frameCount > this.start) {
            this.t = this.timer.advance();
        }
        if (this.s.frameCount > this.end) {
            this.t = 1 - this.timer2.advance();
        }
    }

    show() {
        this.showSetup();
        this.s.fill(this.color[0], this.color[1], this.color[2], this.color[3] * this.t);
        this.s.rect(this.x, this.y, this.w, this.h);
    }
}

/** 2018-12-22
 * Emphasis
 * Essentially a shiny rectangle under the text or formula we want to emphasize
 *
 * ----args list parameters----
 * @mandatory (number) x, y, w, h
 * @optional (number) start, end; (color) color // fixme: I should change all to array at some time
 */
class Emphasis extends Rect {
    constructor(ctx, args) {
        super(ctx, args);
        this.s = ctx;
        this.duration = 0.5;
        this.timer = new Timer1(frames(this.duration));  // the duration went wrong
        this.timer2 = new Timer1(frames(this.duration));

        this.end = args.end || 10000;
        this.color = args.color || this.s.color(107, 107, 17, 177);
    }

    show() {
        this.showSetup();
        this.s.fill(this.color);
        this.s.rect(this.x, this.y, this.w * this.t, this.h);
    }
}

/** 2018-12-23, 2019-01-27
 * A line that can show initialization animation
 * The init animation shows the line going from (x1, y1) to (x2, y2);
 * The end animation shows the line's stroke weight decreasing to 0.
 *
 * to show the line growing from the center point, use LineCenter
 *
 * ----args list parameters----
 * @mandatory (number) x1, y1, x2, y2;
 * @optional (array) color;
 *           (number) start, duration, end, strokeweight, mode [defines which timer to use]
 */
class Line {
    constructor(ctx, args) {
        this.s = ctx;
        this.x1 = args.x1 || 0;
        this.y1 = args.y1 || 0;
        this.x2 = args.x2 || 0;
        this.y2 = args.y2 || 0;
        this.duration = args.duration || 1;
        //this.mode = args.mode || 2;

        // starting frame for initialization animation
        this.start = args.start || 1;
        this.strokeweight = args.strokeweight || 3;
        this.st = new StrokeChanger(this.s, args.color);

        this.timer = new TimerFactory(frames(this.duration), args.mode);

        this.end = args.end || 100000;
        this.timer_sw = new StrokeWeightTimer(this.s, this.end, this.strokeweight, 0.7);
    }

    // 2019-03-19: copied from the Bracket class
    shift(x1, y1, x2, y2, duration) {
        let na = {
            x1: this.x1 + x1, x2: this.x2 + x2, y1: this.y1 + y1, y2: this.y2 + y2,
            duration: duration
        };
        this.move(na);
    }

    // ----args list----
    // x1, x2, y1, y2, duration (in seconds), mode (for timer), color (array)
    // in draw(), use: if (s.frameCount === getT(time.xxx)) s.variable.move();
    move(args) {
        this.x1o = this.x1;
        this.x2o = this.x2;
        this.y1o = this.y1;
        this.y2o = this.y2;
        this.x1d = args.x1 || this.x1;
        this.x2d = args.x2 || this.x2;
        this.y1d = args.y1 || this.y1;
        this.y2d = args.y2 || this.y2;
        this.moved = true;
        let t = args.duration || 1;
        let m = args.mode === undefined ? 2 : args.mode;

        this.move_timer = new TimerFactory(frames(t), m);
    }

    moving() {
        let t = this.move_timer.advance();
        this.reset({
            x1: this.x1o + t * (this.x1d - this.x1o), x2: this.x2o + t * (this.x2d - this.x2o),
            y1: this.y1o + t * (this.y1d - this.y1o), y2: this.y2o + t * (this.y2d - this.y2o),
        })
    }

    reset(args) {
        this.x1 = args.x1 || this.x1;
        this.y1 = args.y1 || this.y1;
        this.x2 = args.x2 || this.x2;
        this.y2 = args.y2 || this.y2;
    }

    showSetup() {
        this.st.advance();
        this.timer_sw.advance();
        if (this.moved)
            this.moving();
    }

    show() {
        if (this.s.frameCount > this.start) {
            this.showSetup();
            let t = this.timer.advance();
            this.s.line(this.x1, this.y1,
                this.x1 + (this.x2 - this.x1) * t, this.y1 + (this.y2 - this.y1) * t);
        }
    }
}

/** 2019-01-07
 * LineCenter
 * A line that grows from midpoint instead of (x1, y1)
 * Note that this class uses Timer1
 */
class LineCenter extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.xm = this.x1 + (this.x2 - this.x1) / 2;
        this.ym = this.y1 + (this.y2 - this.y1) / 2;
    }

    reset(args) {
        super.reset(args);
        this.xm = this.x1 + (this.x2 - this.x1) / 2;
        this.ym = this.y1 + (this.y2 - this.y1) / 2;
    }

    show() {
        if (this.s.frameCount > this.start) {
            this.showSetup();
            let t = this.timer.advance();
            this.s.line(this.xm + (this.x1 - this.xm) * t, this.ym + (this.y1 - this.ym) * t,
                this.xm + (this.x2 - this.xm) * t, this.ym + (this.y2 - this.ym) * t);
        }
    }
}

/*** 2019-01-12
 * LineStd
 * A line with parameters a, b, c that define its equation ax + by = c.
 * It is drawn on top of Axis / Grid, so also need to pass in the
 */
class LineStd extends Line {

}

/** 2018-12-23
 * DottedLine, a line like - - - -
 *
 * fixme: can only display from left to right/top to bottom; cannot display diagonally
 *
 * ----args list parameters----
 * @mandatory (number) x1, y1, x2, y2;
 * @optional (color) color; (number) start, spacing, strokeweight
 */
class DottedLine extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.spacing = args.spacing || 17;

        this.w = this.x2 - this.x1;
        this.h = this.y2 - this.y1;
        this.len = Math.sqrt(this.w * this.w + this.h * this.h);
        this.dx = this.w / this.len * this.spacing;
        this.dy = this.h / this.len * this.spacing;
    }

    show() {
        let x = this.x1;
        let y = this.y1;
        if (this.s.frameCount > this.start) {
            let t = this.timer.advance();
            let xEnd = this.x1 + this.w * t;
            let yEnd = this.y1 + this.h * t;

            // I put an "or" here, otherwise if line is vertical the loop never enters
            while (x < xEnd || y < yEnd) {  // fixme: originally y < yEnd
                let x0 = x + this.dx;
                let y0 = y + this.dy;
                // Same: I put an "or" here, otherwise if line is vertical there won't be smoothness
                if (x0 > xEnd || y0 > yEnd) {
                    x0 = xEnd;
                    y0 = yEnd;
                }
                this.showSetup();
                this.s.line(x, y, x0, y0);
                x += 2 * this.dx;  // this 2 is arbitrary
                y += 2 * this.dy;
            }
        }
    }
}


/** 2018-12-20,21; 2019-01-26
 * Arrow
 * There are two different init animations: default, or fade in
 * If needs fade in animation, need to pass in fadeIn: true, colorArr: [...]
 *
 * Since changing the opacity of the object can only be done when color is an array.
 * At this point it's almost impossible to refactor the parent class so that Line takes in
 * an array as argument for this.color
 *
 * Can also display fade out animation if end is passed in
 *
 * ----args list parameters----
 * @mandatory (number) x1, x2, y1, y2, start
 * @optional (color) colors; (number) strokeweight, tipLen, tipAngle, duration;
 *           (bool) fadeIn, start, end, (array) colorArr
 */
class Arrow extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.duration = args.duration || 1;

        this.fadeIn = args.fadeIn || false;
        if (this.fadeIn) {
            this.colorArr = args.colorArr || [255, 255, 255];
            this.timer = new Timer0(frames(this.duration));
        } else {
            this.timer = new Timer2(frames(this.duration));
        }
        //this.fadeOut = args.fadeOut || false;

        // define tip length/angle for all vectors on this canvas
        this.tipLen = args.tipLen || 15;
        this.tipAngle = args.tipAngle || 0.4;  // this is in radians

        let t = Arrow.setArrow(this.x1, this.y1, this.x2, this.y2, this.tipLen, this.tipAngle);
        this.x3 = t[0];
        this.y3 = t[1];
        this.x4 = t[2];
        this.y4 = t[3];
    }

    // reset the start and end points of the arrow
    reset(args) {
        super.reset(args);
        let t = Arrow.setArrow(this.x1, this.y1, this.x2, this.y2, this.tipLen, this.tipAngle);
        this.x3 = t[0];
        this.y3 = t[1];
        this.x4 = t[2];
        this.y4 = t[3];
    }


    // I could have used arctan() to first obtain the angle of the arrow, then calculate the
    // angle of the two line segments, and finally get their coordinates.
    // However, arctan() will discard information about how the arrow is oriented (domain -90 ~ 90)
    // so I use another strategy: first scale the original line, then apply the rotation matrix.
    static setArrow(x1, y1, x2, y2, tipLen, tipAngle) {
        let dx = x1 - x2;    // note it's x1 - x2
        let dy = y1 - y2;

        let len = Math.sqrt(dx * dx + dy * dy);

        // calculate the position
        let x = dx / len * tipLen;
        let y = dy / len * tipLen;

        let sin_theta = Math.sin(tipAngle);
        let cos_theta = Math.cos(tipAngle);

        // x1, x2 are the coordinates of start point and end point; arrow points from x1 to x2.
        // x3, x4 are the endpoints of the two lines originating from x2 that draw the arrow.
        // Ditto for y3 and y4.
        let x3 = x2 + cos_theta * x - sin_theta * y;
        let y3 = y2 + sin_theta * x + cos_theta * y;
        let x4 = x2 + cos_theta * x + sin_theta * y;
        let y4 = y2 + cos_theta * y - sin_theta * x;
        return [x3, y3, x4, y4];
    }

    showFadeIn() {
        let t = this.timer.advance() * 255;
        this.s.stroke(this.colorArr[0], this.colorArr[1], this.colorArr[2], t);
        this.s.strokeWeight(this.strokeweight);

        this.s.line(this.x1, this.y1, this.x2, this.y2);
        this.s.line(this.x2, this.y2, this.x3, this.y3);
        this.s.line(this.x2, this.y2, this.x4, this.y4);
    }

    static showArrow(obj, t) {  // // show the two line segments at the tip; also used by ArcArrow
        let dx3 = obj.x3 - obj.x2;
        let dy3 = obj.y3 - obj.y2;
        obj.s.line(obj.x2, obj.y2, obj.x2 + t * dx3, obj.y2 + t * dy3);

        let dx4 = obj.x4 - obj.x2;
        let dy4 = obj.y4 - obj.y2;
        obj.s.line(obj.x2, obj.y2, obj.x2 + t * dx4, obj.y2 + t * dy4);
    }
    
    showGrow() {
        // show the main line
        let dx2 = this.x2 - this.x1;
        let dy2 = this.y2 - this.y1;
        this.showSetup();

        // 2019-01-26 BUG FIX: no wonder why the display of arrows appears 6 times slower...
        let t = this.timer.advance();

        this.s.line(this.x1, this.y1, this.x1 + t * dx2, this.y1 + t * dy2);

        Arrow.showArrow(this, t);
    }

    show() {
        if (this.s.frameCount > this.start) {
            if (this.fadeIn) {
                this.showFadeIn();
            } else {
                this.showGrow();
            }
        }
        if (this.fadeOut && this.s.frameCount > this.end) {

        }
    }
}

/*** 2019-03-19
 * FcnPlot
 * Plots a function on a 2D axes
 *
 * ---- args list parameters ----
 * @mandatory (function) f; (Axes or one of its child classes) axes
 * @optional (number) start, duration, strokeweight, mode [for timer], segLen
 *           (array) color
 */
class FcnPlot {
    constructor(ctx, args) {
        this.s = ctx;
        this.f = args.f || ((x) => { return (x * x / 7 - 1); });
        this.a = args.axes;
        this.segLen = args.segLen || 7;  // how many pixels wide is a line segment in the plot

        this.start = args.start || 1;
        this.duration = args.duration || 1;
        this.mode = args.mode || 0;

        this.sw = args.strokeweight || 3;
        this.color = args.color || [77, 177, 77];

        this.timer = TimerFactory(frames(this.duration), this.mode);

        this.xs = [];
        this.ys = [];
        this.calcPoints();
    }

    calcPoints() {
        this.len = (this.a.right - this.a.left) / this.segLen + 1;
        let i = 0;
        let x, y, b;
        for (let a = this.a.left; ; a += this.segLen, i++) {
            this.xs[i] = a;  // plotted x
            x = (a - this.a.centerX) / this.a.stepX;  // actual x
            y = this.f(x);  // actual y
            b = this.a.centerY - y * this.a.stepY;  // plotted y
            this.ys[i] = b;

            if (a > this.a.right) // this is because we want to draw a little over the right
                break;
        }
    }

    show() {
        if (this.s.frameCount >= this.start) {
            this.s.beginShape();
            this.s.stroke(this.color);
            this.s.strokeWeight(this.sw);
            //this.s.strokeJoin(this.s.ROUND);
            this.s.noFill();

            let t = this.timer.advance();
            for (let i = 0; i < this.len * t; i++) {
                this.s.vertex(this.xs[i], this.ys[i]);
            }
            this.s.endShape();
        }
    }
}


/*** 2019-01-07
 * Table
 *
 * The width of the grid is determined by how large the last entry of the x or y array is
 * when that number is displayed on the canvas
 *
 * If I make a pair of axes representing x-y coordinate plane, I can adapt this class.
 *
 * ---- args list parameters ----
 * @mandatory (p5.Font) font; (array) xs, ys;
 * @optional (number) x, y, start, size, sizeX [for controlling horizontal block size];
 *           (string) label1, label2, (array) colorX, colorY [apply to data]
 */
class Table {
    constructor(ctx, args) {
        this.s = ctx;
        this.x = args.x;
        this.y = args.y;
        this.xs = args.xs;
        this.ys = args.ys;
        this.font = args.font;
        this.label1 = "x" || args.label1;
        this.label2 = "y" || args.label2;
        this.start = args.start || frames(1);

        this.numPts = this.xs.length;
        this.sizeY = args.size || 37;   // size of the text
        this.s.textFont(this.font);
        this.s.textSize(this.sizeY);
        this.sizeX = args.sizeX || Math.max(this.s.textWidth("" + this.xs[this.numPts - 1]),
            this.s.textWidth("" + this.ys[this.numPts - 1]));

        this.duration = args.duration || frames(1);
        this.timer = new Timer0(this.duration);
        this.textX = [new TextFade(this.s, {
            duration: frames(0.5),
            size: this.sizeY,
            str: this.label1,
            font: this.font,
            x: this.x + this.sizeX * 0.6,
            y: this.y + this.sizeY * 0.6,
            mode: 1,
        })];
        this.textY = [new TextFade(this.s, {
            duration: frames(0.5),
            size: this.sizeY,
            str: this.label2,
            font: this.font,
            x: this.x + this.sizeX * 0.6,
            y: this.y + this.sizeY * 1.8,
            mode: 1,
        })];
        for (let i = 1; i < this.numPts + 1; i++) {
            this.textX[i] = new TextFade(this.s, {
                color: args.colorX,
                duration: frames(0.5),
                size: this.sizeY,
                str: "" + this.xs[i - 1],   // 3/19: why did this go wrong without me noticing???
                font: this.font,
                x: this.x + this.sizeX * (0.6 + i * 1.4),
                y: this.y + this.sizeY * 0.6,
                mode: 1
            });
            this.textY[i] = new TextFade(this.s, {
                color: args.colorY,
                duration: frames(0.5),
                size: this.sizeY,
                str: "" + this.ys[i - 1],  // and here?
                font: this.font,
                x: this.x + this.sizeX * (0.6 + i * 1.4),
                y: this.y + this.sizeY * 1.8,
                mode: 1
            });
        }

        this.horizLine = new Line(this.s, {
            strokeweight: 2,
            x1: this.x,
            y1: this.y + this.sizeY * 1.32,
            x2: this.x + this.sizeX * 1.4 * (this.numPts + 1),
            y2: this.y + this.sizeY * 1.32,
            mode: 0
        });
        this.vertLines = [];
        for (let i = 1; i < this.numPts + 1; i++) {
            this.vertLines[i - 1] = new LineCenter(this.s, {
                strokeweight: 2,
                duration: frames(0.5),
                x1: this.x + this.sizeX * (i * 1.4 - 0.1),
                x2: this.x + this.sizeX * (i * 1.4 - 0.1),
                y1: this.y + this.sizeY * 0.17,
                y2: this.y + this.sizeY * 2.47,
                mode: 1
            });
        }
    }

    show() {
        if (this.s.frameCount > this.start) {
            this.horizLine.show();
            let t = Math.round(this.timer.advance() * (this.numPts + 1));
            for (let i = 0; i < this.numPts + 1; i++) {
                if (i < t) {
                    this.textX[i].show();
                    this.textY[i].show();
                    if (i < this.numPts) {
                        this.vertLines[i].show();
                    }
                }
            }
        }
    }
}

/*** 2019-04-26
 * Chart
 * A base class for Grid-like structures
 * Child classes should define what's in the grid by saying, for example,
 * this.grid[i][j] = new Text({ x: (i+0.5) * this.w, y: (j+0.5) * this.h, mode: 1 });
 *
 * ---- args list parameters ----
 * @mandatory (number) w, h [specifies the w and h for ONE grid],
 *             i, j [specifies the number of blocks on x/y direction of the grid]
 * @optional (number) x, y, start, size [for text], duration [in seconds]
 */
class Chart extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.duration = frames(args.duration) || frames(1.2);  // init animation duration
        this.w = args.w || 67;
        this.h = args.h || 47;
        this.i = args.i || 2;
        this.j = args.j || 2;
        this.sw = args.strokeweight || 1;
        this.color = [167, 167, 167];

        this.hl = [];  // horizontal lines, # = j + 1
        this.vl = [];  // vertical lines, # = i + 1
        this.grid = [];
        for (let i = 0; i < this.i; i++)
            this.grid[i] = [];

        for (let j = 0; j < this.j + 1; j++)
            this.hl[j] = new Line(this.s, {
                x1: this.x + j * this.w, y1: this.y, color: this.color,
                x2: this.x + j * this.w, y2: this.y + this.h * this.j,
                strokeweight: this.sw, start: this.start + this.duration * j / this.j
            });

        for (let i = 0; i < this.i + 1; i++)
            this.vl[i] = new Line(this.s, {
                x1: this.x, y1: this.y + i * this.h, color: this.color,
                x2: this.x + this.w * this.i, y2: this.y + i * this.h,
                strokeweight: this.sw, start: this.start + this.duration * i / this.i
            });
    }
    show() {
        for (let j = 0; j < this.j + 1; j++)
            this.hl[j].show();
        for (let i = 0; i < this.i + 1; i++)
            this.vl[i].show();

        for (let i = 0; i < this.i; i++)
            for (let j = 0; j < this.j; j++)
                if (this.grid[i][j])
                    this.grid[i][j].show();
    }
}

/*** 2019-04-24
 * ---- args list parameters ----
 * @mandatory (number) x, y, r, a1, a2 (start/end angle in radians)
 * @optional (number) start, end, duration, strokeweight, (array) color, fill
 */
class Pie extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.a1 = args.a1 || 0;
        this.a2 = args.a2 || 6.283;

        this.r = args.r || 100;
        this.timer = new Timer1(frames(this.duration));
        this.st = new StrokeChanger(this.s, args.color);
        this.fill = args.fill || undefined;
        if (this.fill)
            this.ft = new FillChanger(this.s, args.fill);

        this.strokeweight = args.strokeweight || 3;
        this.timer_sw = new StrokeWeightTimer(this.s, this.end, this.strokeweight, 0.7);
    }

    showSetup() {
        this.showMove();
        if (this.fill) {
            this.ft.advance();
        } else
            this.s.noFill();

        this.st.advance();
        this.timer_sw.advance();
    }

    show() {
        if (this.s.frameCount > this.start) {
            this.showSetup();
            this.s.arc(this.x, this.y, this.r, this.r,
                this.a1, this.a1 + (this.a2 - this.a1) * this.timer.advance());
        }
    }
}

/*** 2019-04-24
 * Since p5.js cannot display an arc in the counterclockwise direction,
 * I have to write my own Arc class that behaves similarly to FcnPlot.
 * Maybe refactor this later to inherit Line.
 *
 * ---- args list parameters ----
 * (see Arc)
 * @optional (number) detail, // todo: x1, y1, x2, y2
 */
class Arc extends Pie {
    constructor(ctx, args) {
        super(ctx, args);
        this.n = args.detail || 27;  // number of segments - 1
        this.p = [];
        let a = this.a1;
        let da = (this.a2 - this.a1) / (this.n - 1);  // number of anchor points = # segment + 1
        for (let i = 0; i < this.n; i++) {
            let x = this.x + this.r * Math.cos(a), y = this.y + this.r * Math.sin(a);
            a += da;
            this.p[i] = [x, y];
        }
    }
    
    showArc(t) {
        this.s.beginShape();
        this.showSetup();
        for (let i = 0; i < this.n * t; i++) {
            this.s.vertex(this.p[i][0], this.p[i][1]);
        }
        this.s.endShape();
    }
    
    show() {
        if (this.s.frameCount > this.start) {
            let t = this.timer.advance();
            this.showArc(t);
        }
    }
}

class ArcArrow extends Arc {
    constructor(ctx, args) {
        super(ctx, args);
        this.tipLen = args.tipLen || 12;
        this.tipAngle = args.tipAngle || 0.3;
        
        this.x2 = this.p[this.n - 1][0];
        this.y2 = this.p[this.n - 1][1] - 1;  // fixme
        let dx = this.x2 - this.x, dy = this.y2 - this.y;
        let t = Arrow.setArrow(this.x2 - dy, this.y2 + dx - this.strokeweight,
            this.x2, this.y2, this.tipLen, this.tipAngle);
        this.x3 = t[0];
        this.y3 = t[1];
        this.x4 = t[2];
        this.y4 = t[3];
    }

    show() {
        if (this.s.frameCount > this.start) {
            let t = this.timer.advance();
            this.showArc(t);
            Arrow.showArrow(this, t);
        }
    }
}

/*** 2019-04-11
 * Circle
 * Draws a circle with init animation (draws clockwise) and end animation (fade out)
 * args list: @see class Pie
 */
class Circle extends Pie {
    constructor(ctx, args) {
        super(ctx, args);
    }
    show() {
        if (this.s.frameCount > this.start) {
            this.showSetup();
            this.s.arc(this.x, this.y, this.r, this.r, 0, 6.283 * this.timer.advance());
        }
    }
}

/*** 2019-01-20
 * Bracket, '['
 * To create a ']', draw a line from bottom to top
 *
 // * (DISCARDED) x and y define the CENTER of the Bracket.
 // * Default is a left bracket, '['. To use a right bracket, pass in angle = PI.
 *
 * ---- args list parameters ----
 * @mandatory (number) x1, x2, y1, y2
 * @optional (number) tipLen, start, end, duration, strokeweight
 */
class Bracket extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.s = ctx;
        // this.x = args.x;
        // this.y = args.y;
        // this.l = args.length;
        // this.angle = args.angle || 0;

        // let dx = args.x2 - args.x1;
        // let dy = args.y2 - args.y1;
        // let len = Math.sqrt(dx * dx + dy * dy);

        this.tipLen = args.tipLen || 9;

        this.start = args.start || 100;
        this.end = args.end || 100000;
        this.duration = args.duration || frames(1);
        this.strokeweight = args.strokeweight || 3;

        this.lines = [];
        this.lines[0] = new LineCenter(this.s, {
            start: this.start, end: this.end,
            duration: this.duration, strokeweight: this.strokeweight
        });
        this.lines[1] = new Line(this.s, {
            start: this.start, end: this.end,
            duration: this.duration, strokeweight: this.strokeweight
        });
        this.lines[2] = new Line(this.s, {
            start: this.start, end: this.end,
            duration: this.duration, strokeweight: this.strokeweight
        });
        this.reset(args);
    }

    // ----args list----
    // x1, x2, y1, y2
    reset(args) {
        this.x1 = args.x1;
        this.x2 = args.x2;
        this.y1 = args.y1;
        this.y2 = args.y2;
        let angle = Math.atan2(args.y2 - args.y1, args.x2 - args.x1);
        let sin = Math.sin(angle), cos = Math.cos(angle);

        this.lines[0].reset({
            x1: args.x1, x2: args.x2, y1: args.y1, y2: args.y2
        });
        this.lines[1].reset({
            x1: args.x1 + this.tipLen * sin, x2: args.x1,
            y1: args.y1 - this.tipLen * cos, y2: args.y1,
        });
        this.lines[2].reset({
            x1: args.x2 + this.tipLen * sin, x2: args.x2,
            y1: args.y2 - this.tipLen * cos, y2: args.y2,
        });
    }

    show() {
        if (this.moved)
            this.moving();
        for (let l of this.lines) l.show();
    }
}


/*** 2019-02-01
 * ImageBase (could not name it to Image since it would conflict p5.Image)
 *
 * This class does not support init animations. See ImageFly, ImageGrow, ImageFade.
 * Since this.s.tint() is a very costly method and slows down the frame rate drastically,
 * user can use the ImageFly class to display init animation of flying in from the left, etc.
 *
 * ---- args list parameters ----
 * @mandatory (p5.Image) img, (number) x, y
 * @optional (number) w, h, start
 */
class ImageBase extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.img = args.img;
        this.w = args.w || this.img.width; // fixme: will this result in overhead?
        this.h = args.h || this.img.height;
    }

    showImage() {
        this.showMove();
        this.s.image(this.img, this.x, this.y, this.w, this.h);
    }
}

/***
 * ImageFly
 *
 * mode 1: fly from left;  mode 2: fly from right;
 * mode 3: fly from up;    mode 4: fly from bottom
 *
 * ---- args list parameters ----
 * @mandatory (p5.Image) img, mode
 * @optional (number) x, y, w, h, start, duration
 */
class ImageFly extends ImageBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.xf = this.x;  // final positions
        this.yf = this.y;
        this.mode = args.mode || 1;

        switch (this.mode) {
            case 1:
                this.x = -this.img.width; break;
            case 2:
                this.x = cvw; break;
            case 3:
                this.y = -this.img.height; break;
            case 4:
                this.y = cvh; break;
        }
    }

    show() {
        if (this.s.frameCount === this.start) {
            this.move(this.xf, this.yf, this.duration, 1);
        }
        this.showImage();
    }
}

class ImageGrow extends ImageBase {  // grow from center; no additional args needed
    constructor(ctx, args) {
        super(ctx, args);
        this.xc = this.x + this.w / 2;
        this.yc = this.y + this.h / 2;
        this.timer = new Timer1(frames(this.duration));
    }
    show() {
        this.showMove();
        if (this.s.frameCount > this.start) {
            let t = this.timer.advance();
            this.s.image(this.img,
                this.xc - this.w * t / 2, this.yc - this.h * t / 2, this.w * t, this.h * t);
        }
    }
}

/*** 2019-02-27
 * ImageFade
 * Can display fade in and fade out animations
 * Since there is an extra layer of black rectangle embedded in canvas,
 * need to be careful not to cause bugs
 */
class ImageFade extends ImageBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.rect = new Rect(this.s, {
            x: this.x, y: this.y, w: this.w, h: this.h, duration: 0.7,
            color: [0, 0, 0, 255], start: 1, end: this.start,
        });
    }
    show() {
        this.showImage();
        this.rect.show(); // this function call needs to be after the previous
    }
}