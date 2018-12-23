
/** 2018-12-20
 * HelperGrid
 * This acts like a scaffold, and helps me find out the coordinates of the objects in a scene.
 * It is removed when the movie is actually rendered.
 * show() and render() are both defined within this class.
 */
class HelperGrid extends Graphics {
    constructor() {
        super({}); // must pass in {}, not nothing
    }

    show() {
        this.g.strokeWeight(1);

        // draw horizontal helper lines
        this.g.stroke(137);
        for (let i = 100; i < this.w; i += 200) {
            this.g.line(i, 0, i, this.h);
        }
        this.g.stroke(255);
        for (let i = 200; i < this.w; i += 200) {
            this.g.line(i, 0, i, this.h);
        }
        this.g.stroke(57);
        for (let i = 50; i < this.w; i += 100) {
            this.g.line(i, 0, i, this.h);
        }

        // draw vertical lines
        this.g.stroke(137);
        for (let i = 100; i < this.w; i += 200) {
            this.g.line(0, i, this.w, i);
        }
        this.g.stroke(255);
        for (let i = 200; i < this.w; i += 200) {
            this.g.line(0, i, this.w, i);
        }
        this.g.stroke(57);
        for (let i = 50; i < this.w; i += 100) {
            this.g.line(0, i, this.w, i);
        }
    }
}



/** 2018-12-23
 * Axes
 * Contains two arrows.
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
 *
 * in the derived class's show(), need to call showGrid()
 */
class Grid extends Axes {
    constructor(args) {
        super(args);

        this.maxNumLines = 0;
        this.gridlineup = [];    // y-coords of grid lines above the x-axis
        this.gridlinedown = [];  // y-coords of grid lines below the x-axis
        this.gridlineleft = [];  // y-coords of grid lines left of y-axis
        this.gridlineright = []; // y-coords of grid lines right of y-axis
        for (let i = 0, y = this.centerY - 50; y > this.top; i++, y -= 50) {
            this.gridlineup[i] = y;
            if (i > this.maxNumLines)
                this.maxNumLines = i;
        }
        for (let i = 0, y = this.centerY + 50; y < this.bottom; i++, y += 50) {
            this.gridlinedown[i] = y;
            if (i > this.maxNumLines)
                this.maxNumLines = i;
        }
        for (let i = 0, x = this.centerX - 50; x > this.left; i++, x -= 50) {
            this.gridlineleft[i] = x;
            if (i > this.maxNumLines)
                this.maxNumLines = i;
        }
        for (let i = 0, x = this.centerX + 50; x < this.right; i++, x += 50) {
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
            if (frameCount - this.start > i * 2) {
                if (i % 2 === 1) {  // major grid line
                    stroke(27, 177, 247);
                } else {    // minor grid line
                    stroke(17, 67, 77);
                }

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
 */
class Plot extends Axes {
    // table is a p5.Table object, and is supposed to
    // contain two columns, storing the data's x- and y- coordinates
    // in preload(), use: table = loadTable('SLR_data.csv', 'csv'); and pass it in
    constructor(args, table) {
        super(args);
        //this.showLabel = args.showLabel || false;  // show numerical labels

        // the x- and y- coordinates of all the points are stored in two separate arrays
        // Xs and Ys are the original coordinates
        // ptXs and ptYs store the transformed version: the coordinates on the canvas
        this.numPts = table.getRowCount();

        this.Xs = [];
        this.Ys = [];
        this.ptXs = [];
        this.ptYs = [];
        for (let i = 0; i < this.numPts; i++) {
            this.Xs[i] = table.getNum(i, 0);
            this.Ys[i] = table.getNum(i, 1);
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

        // the parameters for displaying the least squares line on the canvas
        this.linex1 = 0;
        this.linex2 = 0;
        this.liney1 = 0;
        this.liney2 = 0;
        this.calcParams();

        this.timer2 = new Timer1(frames(1));
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
        this.linex1 = this.left;
        this.linex2 = this.right;
        this.liney1 = y_intercept + this.beta * (this.centerX - this.left);
        this.liney2 = y_intercept - this.beta * (this.right - this.centerX);
    }


    showPoints() {
        for (let i = 0; i < this.numPts; ++i) {
            this.points[i].show();
        }
    }

    // show the least squares line; green color
    showLine() {
        stroke(77, 177, 77);
        strokeWeight(3);
        if (frameCount > this.start + frames(1)) {
            let t = this.timer2.advance();
            line(this.linex1, this.liney1,
                this.linex1 + (this.linex2 - this.linex1) * t,
                this.liney1 + (this.liney2 - this.liney1) * t);
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


/** 2018-12-20,21
 * Arrow
 *
 * ----args list parameters----
 * @mandatory (number) x1s, x2s, y1s, y2s, start
 * @optional (color) colors; (number) strokeweight, tipLen, tipAngle
 */
class Arrow {
    constructor(args) {
        // used when user wants to define the color of the arrows
        this.color = args.color || color(255);

        this.x1 = args.x1;
        this.y1 = args.y1;
        this.x2 = args.x2;
        this.y2 = args.y2;
        this.timer = new Timer2(args.frames);

        // starting frame for initialization animation
        this.start = args.start;

        // define stroke weight and tip length/angle for all vectors on this canvas
        this.strokeweight = args.strokeweight || 2;
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

            if (this.color) {
                stroke(this.color);
            } else {
                stroke(255);
            }
            strokeWeight(this.strokeweight);
            line(this.x1, this.y1,
                this.x1 + this.timer.advance() * dx2, this.y1 + this.timer.advance() * dy2);

            // show the two line segments at the tip

            strokeWeight(this.strokeweight);
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

/** 2018-12-22
 * Emphasis
 *
 *
 *
 * Since it's guaranteed to be at the bottom layer, we do not use the usual class hierarchy,
 * and instead draw the rect on the base canvas directly.
 *
 * ----args list parameters----
 * @mandatory (number) x, y, w, h
 * @optional (number) start, end; (color) color
 */
class Emphasis {
    constructor(args) {
        this.x = args.x;
        this.y = args.y;
        this.w = args.w;
        this.h = args.h;
        this.start = args.start || frames(1);
        this.end = args.end || frames(2);
        this.color = args.color || color(107, 107, 17);

        // timer for displaying start and end animations, respectively
        this.timerS = new Timer1(frames(0.5));
        this.timerE = new Timer1(frames(0.5));
        this.t = 0;
    }

    show() {
        noStroke();
        fill(this.color);
        if (frameCount > this.start) {
            this.t = this.timerS.advance();
        }
        if (frameCount > this.end) {
            this.t = 1 - this.timerE.advance();
        }
        rect(this.x, this.y, this.w * this.t, this.h);
    }
}