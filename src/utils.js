/** SUMMARY OF CLASSES
 * '-' is-a relationship; '<' has-a relationship
 *
 * HelperGrid
 * Axes
 * - Grid
 * - Plot < PlotPoint
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
    constructor(args) {
        this.w = width;
        this.h = height;
    }

    show() {
        strokeWeight(1);

        // draw horizontal helper lines
        stroke(137);
        for (let i = 100; i < this.w; i += 200) {
            line(i, 0, i, this.h);
        }
        stroke(255);
        for (let i = 200; i < this.w; i += 200) {
            line(i, 0, i, this.h);
        }
        stroke(57);
        for (let i = 50; i < this.w; i += 100) {
            line(i, 0, i, this.h);
        }

        // draw vertical lines
        stroke(137);
        for (let i = 100; i < this.w; i += 200) {
            line(0, i, this.w, i);
        }
        stroke(255);
        for (let i = 200; i < this.w; i += 200) {
            line(0, i, this.w, i);
        }
        stroke(57);
        for (let i = 50; i < this.w; i += 100) {
            line(0, i, this.w, i);
        }
    }
}


/** 2018-12-23
 * Axes
 * Contains two arrows.
 *
 * ---- args list parameters ----
 * @optional (number) top, bottom, left, right, centerX, centerY, stepX, stepY
 */
class Axes {
    constructor(args) {
        //this.showLabel = args.showLabel || false;  // show numerical labels

        // the following parameters define the scope of the plot's grid lines on the canvas
        // NOTE: top and left must be a multiple of 50
        this.top = args.top || 0;
        this.left = args.left || 0;
        this.bottom = args.bottom || height;
        this.right = args.right || width;

        // define the origin's x and y coordinates on the canvas
        this.centerX = args.centerX || width / 2;
        this.centerY = args.centerY || height / 2;

        // define how many pixels correspond to 1 on each axis
        this.stepX = args.stepX || 1;
        this.stepY = args.stepY || 1;

        this.start = args.start;

        this.xAxis = new Arrow({
            x1: this.left, x2: this.right, y1: this.centerY, y2: this.centerY,
            frames: frames(6), start: this.start
        });

        this.yAxis = new Arrow({
            x1: this.centerX, x2: this.centerX, y1: this.bottom, y2: this.top,
            frames: frames(6), start: this.start
        });
    }

    showAxes() {
        this.xAxis.show();
        this.yAxis.show();
    }
}

/** 2018-12-21
 * Grid
 * A grid similar to what 3b1b used throughout the EOLA series
 * in the derived class's show(), need to call showGrid()
 *
 *  * ---- args list parameters ----
 * @optional (number) top, bottom, left, right, centerX, centerY, stepX, stepY
 */
class Grid extends Axes {
    constructor(args) {
        super(args);

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
            strokeWeight(2);
            if (frameCount - this.start > i * 2) {
                // if (i % 2 === 1) {  // major grid line
                //     stroke(27, 177, 247);
                // } else {    // minor grid line
                //     stroke(17, 67, 77);
                // }
                stroke(27, 177, 247);

                let t = this.timer[i].advance();
                let right = this.left + (this.right - this.left) * t;
                let top = this.bottom + (this.top - this.bottom) * t;

                if (i < this.gridlineup.length) {
                    let y = this.gridlineup[i];
                    line(this.left, y, right, y);
                }
                if (i < this.gridlinedown.length) {
                    let y = this.gridlinedown[i];
                    line(this.left, y, right, y);
                }
                if (i < this.gridlineleft.length) {
                    let x = this.gridlineleft[i];
                    line(x, this.bottom, x, top);
                }
                if (i < this.gridlineright.length) {
                    let x = this.gridlineright[i];
                    line(x, this.bottom, x, top);
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

        this.Xs = args.xs;
        this.Ys = args.ys;
        this.ptXs = [];
        this.ptYs = [];
        for (let i = 0; i < this.numPts; i++) {
            this.ptXs[i] = this.centerX + this.Xs[i] * this.stepX;
            this.ptYs[i] = this.centerY - this.Ys[i] * this.stepY;
        }
        this.points = [];
        for (let i = 0; i < this.numPts; i++) {
            this.points[i] = new PlotPoint({
                x: this.ptXs[i],
                y: this.ptYs[i],
                radius: 10,
                // display all points in 1 second
                start: this.start + i * frames(1) / this.numPts
            })
        }

        this.avgX = this.avgxs();
        this.avgY = this.avgys();

        // the least square coefficients
        this.beta = 0;
        this.beta_0 = 0;

        // calculate the parameters for displaying the least squares line on the canvas
        this.calcParams();
    }

    avgxs() {
        let sum = 0;
        for (let i = 0; i < this.numPts; ++i) {
            sum += this.Xs[i];
        }
        console.log(sum);
        return sum / this.numPts;
    }

    avgys() {
        let sum = 0;
        for (let i = 0; i < this.numPts; ++i) {
            sum += this.Ys[i];
        }
        console.log(sum);
        return sum / this.numPts;
    }

    // calculate the parameters, and the coordinates of least squares line
    // formula: beta = (sum of xi * yi - n * xbar * ybar) / (sum of xi^2 - n * xbar^2)
    calcParams() {
        let sumXY = 0, sumXsq = 0;
        for (let i = 0; i < this.numPts; i++) {
            sumXY += this.Xs[i] * this.Ys[i];
            sumXsq += this.Xs[i] * this.Xs[i];
        }
        this.beta = (sumXY - this.numPts * this.avgX * this.avgY)
            / (sumXsq - this.numPts * this.avgX * this.avgX);

        this.beta_0 = this.avgY - this.beta * this.avgX;

        let y_intercept = this.centerY - this.beta_0 * this.stepY;

        this.LSLine = new Line({
            x1: this.left,
            x2: this.right,
            y1: y_intercept + this.beta * (this.centerX - this.left),
            y2: y_intercept - this.beta * (this.right - this.centerX),
            color: color(77, 177, 77),
            strokeweight: 3,
            start: this.startLSLine
        });
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
 * @mandatory (number) x1s, x2s, y1s, y2s, start
 */
class PlotPoint {
    constructor(args) {
        this.x = args.x;
        this.y = args.y;
        this.radius = args.radius;
        this.start = args.start;

        this.timer = new Timer1(frames(0.7));
        this.t = 0;
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
            fill(255, 255, 0, 255 * this.t);
            ellipse(this.x, this.y, this.radius, this.radius);
        }
    }
}

/** 2018-12-23
 * A rectangle, with fade-in init animation
 *
 * ----args list parameters----
 * @mandatory (number) x, y, w, h
 * @optional (number) start; (color) color
 */
class Rect {
    constructor(args) {
        this.x = args.x;
        this.y = args.y;
        this.w = args.w;
        this.h = args.h;
        this.start = args.start || frames(1);

        this.timer = new Timer0(frames(1));
    }

    show() {

    }

}

/** 2018-12-22
 * Emphasis
 * Essentially a shiny rectangle under the text or formula we want to emphasize
 *
 * ----args list parameters----
 * @mandatory (number) x, y, w, h
 * @optional (number) start, end; (color) color
 */
class Emphasis extends Rect {
    constructor(args) {
        super(args);

        this.end = args.end || frames(2);
        this.color = args.color || color(107, 107, 17);

        // timer for displaying start and end animations, respectively
        this.timer = new Timer1(frames(0.5));
        this.timer2 = new Timer1(frames(0.5));
        this.t = 0;
    }

    show() {
        noStroke();
        fill(this.color);
        if (frameCount > this.start) {
            this.t = this.timer.advance();
        }
        if (frameCount > this.end) {
            this.t = 1 - this.timer2.advance();
        }
        rect(this.x, this.y, this.w * this.t, this.h);
    }
}

/** 2018-12-23
 * A line that can show initialization animation
 * The animation shows the line going from (x1, y1) to (x2, y2);
 * to show the line growing from the center point, use LineCenter
 *
 * ----args list parameters----
 * @mandatory (number) x1, y1, x2, y2;
 * @optional (color) color; (number) start, strokeweight, mode [defines which timer to use]
 */
class Line {
    constructor(args) {
        this.x1 = args.x1;
        this.y1 = args.y1;
        this.x2 = args.x2;
        this.y2 = args.y2;
        this.duration = args.duration || frames(1);
        //this.mode = args.mode || 2;

        // starting frame for initialization animation
        this.start = args.start || frames(1);
        this.strokeweight = args.strokeweight || 3;
        this.color = args.color || color(255);

        if (args.mode === 0) {
            this.timer = new Timer0(this.duration);
        } else if (args.mode === 1) {
            this.timer = new Timer1(this.duration);
        } else if (args.mode === 2) {
            this.timer = new Timer2(this.duration);
        } else {
            this.timer = new Timer2(this.duration);
        }
    }

    reset(args) {
        this.x1 = args.x1 || this.x1;
        this.y1 = args.y1 || this.y1;
        this.x2 = args.x2 || this.x2;
        this.y2 = args.y2 || this.y2;
    }

    showSetup() {
        stroke(this.color);
        strokeWeight(this.strokeweight);
    }

    show() {
        if (frameCount > this.start) {
            this.showSetup();
            let t = this.timer.advance();
            line(this.x1, this.y1,
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
    constructor(args) {
        super(args);
        this.xm = this.x1 + (this.x2 - this.x1) / 2;
        this.ym = this.y1 + (this.y2 - this.y1) / 2;
    }

    show() {
        if (frameCount > this.start) {
            this.showSetup();
            let t = this.timer.advance() / 2;
            line(this.xm + (this.x1 - this.xm) * t, this.ym + (this.y1 - this.ym) * t,
                this.xm + (this.x2 - this.xm) * t, this.ym + (this.y2 - this.ym) * t);
        }
    }
}


/** 2018-12-23
 * DottedLine, a line like - - - -
 *
 * fixme: can only display from left to right/top to bottom
 *
 * ----args list parameters----
 * @mandatory (number) x1, y1, x2, y2;
 * @optional (color) color; (number) start, spacing, strokeweight
 */
class DottedLine extends Line {
    constructor(args) {
        super(args);
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
        if (frameCount > this.start) {
            let t = this.timer.advance();
            let xEnd = this.x1 + this.w * t;
            let yEnd = this.y1 + this.h * t;

            // I put an "or" here, otherwise if line is vertical the loop never enters
            while (x < xEnd || y < yEnd) {
                let x0 = x + this.dx;
                let y0 = y + this.dy;
                // Same: I put an "or" here, otherwise if line is vertical there won't be smoothness
                if (x0 > xEnd || y0 > yEnd) {
                    x0 = xEnd;
                    y0 = yEnd;
                }
                this.showSetup();
                line(x, y, x0, y0);
                x += 2 * this.dx;  // this 2 is arbitrary
                y += 2 * this.dy;
            }
        }
    }
}


/** 2018-12-20,21
 * Arrow
 *
 * ----args list parameters----
 * @mandatory (number) x1, x2, y1, y2, start, frames
 * @optional (color) colors; (number) strokeweight, tipLen, tipAngle
 */
class Arrow extends Line {
    constructor(args) {
        super(args);
        this.frames = args.frames || frames(6);
        this.timer = new Timer2(this.frames);

        // define tip length/angle for all vectors on this canvas
        this.tipLen = args.tipLen || 15;
        this.tipAngle = args.tipAngle || 0.4;  // this is in radians

        // x1, x2 are the coordinates of start point and end point; arrow points from x1 to x2.
        // x3, x4 are the endpoints of the two lines originating from x2 that draw the arrow.
        // Ditto for y3 and y4.
        this.x3 = 0;
        this.x4 = 0;
        this.y3 = 0;
        this.y4 = 0;

        this.setArrow();
    }

    // reset the start and end points of the arrow
    reset(args) {
        super.reset(args);
        this.setArrow();
    }

    // I could have used arctan() to first obtain the angle of the arrow, then calculate the
    // angle of the two line segments, and finally get their coordinates.
    // However, arctan() will discard information about how the arrow is oriented (domain -90 ~ 90)
    // so I use another strategy: first scale the original line, then apply the rotation matrix.
    setArrow() {

        let dx = this.x1 - this.x2;    // note it's x1 - x2
        let dy = this.y1 - this.y2;

        let len = Math.sqrt(dx * dx + dy * dy);

        // calculate the position
        let x = dx / len * this.tipLen;
        let y = dy / len * this.tipLen;

        let sin_theta = Math.sin(this.tipAngle);
        let cos_theta = Math.cos(this.tipAngle);

        this.x3 = this.x2 + cos_theta * x - sin_theta * y;
        this.y3 = this.y2 + sin_theta * x + cos_theta * y;

        this.x4 = this.x2 + cos_theta * x + sin_theta * y;
        this.y4 = this.y2 + cos_theta * y - sin_theta * x;
    }

    show() {
        if (frameCount > this.start) {

            // show the main line
            let dx2 = this.x2 - this.x1;
            let dy2 = this.y2 - this.y1;

            this.showSetup();
            line(this.x1, this.y1,
                this.x1 + this.timer.advance() * dx2, this.y1 + this.timer.advance() * dy2);

            // show the two line segments at the tip
            // strokeWeight(this.strokeweight);
            let dx3 = this.x3 - this.x2;
            let dy3 = this.y3 - this.y2;
            line(this.x2, this.y2,
                this.x2 + this.timer.advance() * dx3, this.y2 + this.timer.advance() * dy3);

            let dx4 = this.x4 - this.x2;
            let dy4 = this.y4 - this.y2;
            line(this.x2, this.y2,
                this.x2 + this.timer.advance() * dx4, this.y2 + this.timer.advance() * dy4);
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
 * @optional (number) x, y, start, size,  (string) label1, label2
 */
class Table {
    constructor(args) {
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
        textFont(this.font);
        textSize(this.sizeY);
        this.sizeX = Math.max(textWidth("" + this.xs[this.numPts - 1]),
            textWidth("" + this.ys[this.numPts - 1]));

        this.timer0 = new Timer0(frames(1));
        this.timers = [];
        for (let i = 0; i < this.numPts; i++) {
            this.timers[i] = new Timer1(frames(0.5));
        }
        this.textX = [new TextFadeIn({
            size: this.sizeY,
            str: this.label1,
            font: font,
            x: this.x + this.sizeX * 0.6,
            y: this.y + this.sizeY * 0.6,
            mode: 1,
        })];
        this.textY = [new TextFadeIn({
            size: this.sizeY,
            str: this.label2,
            font: font,
            x: this.x + this.sizeX * 0.6,
            y: this.y + this.sizeY * 1.8,
            mode: 1,
        })];
        for (let i = 1; i < this.numPts + 1; i++) {
            this.textX[i] = new TextFadeIn({
                size: this.sizeY,
                str: "" + this.ys[i - 1],
                font: font,
                x: this.x + this.sizeX * (0.6 + i * 1.4),
                y: this.y + this.sizeY * 0.6,
                mode: 1
            });
            this.textY[i] = new TextFadeIn({
                size: this.sizeY,
                str: "" + this.xs[i - 1],
                font: font,
                x: this.x + this.sizeX * (0.6 + i * 1.4),
                y: this.y + this.sizeY * 1.8,
                mode: 1
            });
        }

        this.horizLine = new Line({
            x1: this.x,
            y1: this.y + this.sizeY * 1.32,
            x2: this.x + this.sizeX * 1.4 * (this.numPts + 1),
            y2: this.y + this.sizeY * 1.32,
            mode: 0
        });
        this.vertLines = [];
        for (let i = 0; i < this.numPts; i++) {
            this.vertLines[i] = new LineCenter({

            });
        }
    }

    show() {
        for (let t of this.textX) t.show();
        for (let t of this.textY) t.show();
        this.horizLine.show();
    }

}