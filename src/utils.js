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
    render() {
        image(this.g, 0, 0, this.w, this.h);
    }
}



/** 2018-12-21
 * Grid
 * A grid similar to what 3b1b used throughout the EOLA series
 * in the derived class's show(), need to call showGrid, passing in the start time for animation
 */
class Grid extends Graphics {
    constructor(args) {
        super(args);
        //this.showLabel = args.showLabel || false;  // show numerical labels

        // the following parameters define the scope of the plot's grid lines on the canvas
        // NOTE: top and left must be a multiple of 50
        this.top = args.top || 0;
        this.left = args.left || 0;
        this.bottom = args.bottom || this.h;
        this.right = args.right || this.w;

        // define the origin's x and y coordinates on the canvas
        this.centerX = args.centerX || this.w / 2;
        this.centerY = args.centerY || this.h / 2;

        // define how many pixels correspond to 1 in the actual data
        this.stepX = args.stepX || 1;
        this.stepY = args.stepY || 1;

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
            this.timer[i] = new Timer2(7);
        }
    }

    showGrid(frame) {
        for (let i = 0; i < this.maxNumLines; ++i) {
            if (frameCount - frame > i) {
                if (i % 2 === 1) {  // major grid line
                    this.g.stroke(27, 177, 247);
                } else {    // minor grid line
                    this.g.stroke(17, 67, 77);
                }

                let t = this.timer[i].advance();
                let right = this.left + (this.right - this.left) * t;
                let top = this.bottom + (this.top - this.bottom) * t;

                if (i < this.gridlineup.length) {
                    let y = this.gridlineup[i];
                    this.g.line(this.left, y, right, y);
                }
                if (i < this.gridlinedown.length) {
                    let y = this.gridlinedown[i];
                    this.g.line(this.left, y, right, y);
                }
                if (i < this.gridlineleft.length) {
                    let x = this.gridlineleft[i];
                    this.g.line(x, this.bottom, x, top);
                }
                if (i < this.gridlineright.length) {
                    let x = this.gridlineright[i];
                    this.g.line(x, this.bottom, x, top);
                }
            }
        }
    }
}



/** 2018-12-20
 * Plot
 * Contains a bunch of points, in addition to the grid
 */
class Plot extends Grid {
    // table is a p5.Table object, and is supposed to
    // contain two columns, storing the data's x- and y- coordinates
    // in preload(), use: table = loadTable('SLR_data.csv', 'csv'); and pass it in
    constructor(args, table) {
        super(args);
        //this.showLabel = args.showLabel || false;  // show numerical labels

        // the x- and y- coordinates of all the points are stored in two separate arrays
        // transformed to the coordinates on the canvas
        this.numPts = table.getRowCount();
        this.ptXs = [];
        this.ptYs = [];
        for (let i = 0; i < this.numPts; i++) {
            this.ptXs[i] = this.centerX + table.getNum(i, 0) * this.stepX;
            this.ptYs[i] = this.centerY - table.getNum(i, 1) * this.stepY;
        }

        // first element corresponds to the x-axis, second to the y-axis
        this.axes = new Arrows({
            numArrows : 2,
            x1s : [this.left, this.centerX],
            x2s : [this.right, this.centerX],
            y1s : [this.centerY, this.bottom],
            y2s : [this.centerY, this.top],
            frames : 150
        });
    }

    showPoints() {
        for (let i = 0; i < this.numPts; ++i) {
            this.g.noStroke();
            this.g.fill(255, 255, 0);
            this.g.ellipse(this.ptXs[i], this.ptYs[i], 10, 10);
        }
    }
}

/** 2018-12-20,21
 * Arrows
 *
 * To reduce overhead, we need to make as few canvases as possible. Therefore,
 * information about all arrows that are needed for a scene will be passed in
 * as args as arrays.
 */
class Arrows extends Graphics {
    constructor(args) {
        super({});
        this.numArrows = args.numArrows || 1;
        // used when user wants to define the color of the arrows, should be an array
        // otherwise, default is each arrow will be white
        // example: colors : [color(155), color(155)]
        this.colors = args.colors;

        this.x1s = args.x1s;
        this.y1s = args.y1s;
        this.x2s = args.x2s;
        this.y2s = args.y2s;
        this.timer = new Timer2(args.frames);

        // define stroke weight and tip length/angle for all vectors on this canvas
        this.strokeweight = args.strokeweight || 2;
        this.tipLen = args.tipLen || 15;
        this.tipAngle = args.tipAngle || 0.4;  // this is in radians

        // x1, x2 are the coordinates of start point and end point; arrow points from x1 to x2.
        // x3, x4 are the endpoints of the two lines originating from x2 that draw the arrow.
        // Ditto for y3 and y4.
        this.x3s = [];
        this.x4s = [];
        this.y3s = [];
        this.y4s = [];

        this.setArrow();
    }

    // I could have used arctan() to first obtain the angle of the arrow, then calculate the
    // angle of the two line segments, and finally get their coordinates.
    // However, arctan() will discard information about how the arrow is oriented (domain -90 ~ 90)
    // so I use another strategy: first scale the original line, then apply the rotation matrix.
    setArrow() {
        for (let i = 0; i < this.numArrows; ++i) {
            let x1 = this.x1s[i];
            let y1 = this.y1s[i];
            let x2 = this.x2s[i];
            let y2 = this.y2s[i];
            let dx = x1 - x2;    // note it's x1 - x2
            let dy = y1 - y2;

            let len = Math.sqrt(dx*dx + dy*dy);

            // calculate the position
            let x = dx / len * this.tipLen;
            let y = dy / len * this.tipLen;

            let sin_theta = Math.sin(this.tipAngle);
            let cos_theta = Math.cos(this.tipAngle);

            let x3 = cos_theta * x - sin_theta * y;
            let y3 = sin_theta * x + cos_theta * y;
            this.x3s[i] = x2 + x3;
            this.y3s[i] = y2 + y3;

            let x4 = cos_theta * x + sin_theta * y;
            let y4 = cos_theta * y - sin_theta * x;
            this.x4s[i] = x2 + x4;
            this.y4s[i] = y2 + y4;
        }
    }

    show(frame) {  // frame define the starting point for animation
        if (frameCount > frame) {
            for (let i = 0; i < this.numArrows; i++) {

                // show the main line
                let x1 = this.x1s[i];
                let y1 = this.y1s[i];
                let x2 = this.x2s[i];
                let y2 = this.y2s[i];
                let dx2 = x2 - x1;
                let dy2 = y2 - y1;

                if (this.colors) {
                    this.g.stroke(this.colors[i]);
                } else {
                    this.g.stroke(255);
                }
                this.g.strokeWeight(this.strokeweight);

                this.g.line(x1, y1,
                    x1 + this.timer.advance() * dx2, y1 + this.timer.advance() * dy2);

                // show the two line segments at the tip
                this.g.strokeWeight(this.strokeweight - 1);
                let dx3 = this.x3s[i] - x2;
                let dy3 = this.y3s[i] - y2;
                this.g.line(x2, y2,
                    x2 + this.timer.advance() * dx3, y2 + this.timer.advance() * dy3);
                let dx4 = this.x4s[i] - x2;
                let dy4 = this.y4s[i] - y2;
                this.g.line(x2, y2,
                    x2 + this.timer.advance() * dx4, y2 + this.timer.advance() * dy4);
            }
        }
    }

    render() {
        image(this.g, 0, 0);
    }
}


