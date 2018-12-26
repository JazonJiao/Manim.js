//let orange = color(247, 137, 27);  // fixme: why doesn't it work?

// define the time for init animations
let time = {
    axes: frames(1),
    formula: frames(3),
    dottedlineX: frames(4),
    dottedlineY: frames(5),
    xMinusXbarLine: frames(6),
    xMinusXbar: frames(7),
    yMinusYbarLine: frames(8),
    yMinusYbar: frames(9),
    rect1: frames(10),
    rects: frames(11),
    leastSqLine: frames(13)
};

class SLR_Plot extends Plot {    // the plot used to illustrate simple linear regression
    constructor(table) {
        // somehow in the super class, the actual coordinate of x_bar is called avgX (xs)
        // and its canvas coordinate is called xbar (ptXs). I should really be more considerate
        // in how I name things...

        super({
            right: 675,
            centerX: 100,
            centerY: 550,
            stepX: 10,
            stepY: 10,
            start: time.axes,
            startLSLine: time.leastSqLine
        }, table);

        // the two dotted lines displaying x-bar and y-bar
        this.xbar = this.centerX + this.avgX * this.stepX;
        this.ybar = this.centerY - this.avgY * this.stepY;
        this.xbarLine = new DottedLine({
            x1: this.xbar, x2: this.xbar,
            y1: this.top, y2: this.bottom,
            color: color(77, 177, 247),
            strokeweight: 2,
            start: time.dottedlineX
        });
        this.ybarLine = new DottedLine({
            x1: this.left, x2: this.right,
            y1: this.ybar, y2: this.ybar,
            color: color(77, 177, 247),
            strokeweight: 2,
            start: time.dottedlineY
        });

        // the lines showing x1 - x_bar and y1 - y_bar
        let index = this.numPts - 1;
        this.xMinusxbarLine = new Line({
            x1: this.xbar,
            x2: this.ptXs[index],
            y1: this.ptYs[index],
            y2: this.ptYs[index],
            start: time.xMinusXbarLine,
            color: color(247, 137, 27)
        });
        this.yMinusybarLine = new Line({
            x1: this.ptXs[index],
            x2: this.ptXs[index],
            y1: this.ybar,
            y2: this.ptYs[index],
            start: time.yMinusYbarLine,
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
                start: time.rects + i * frames(2) / this.numPts,
                end: frames(1000),  // todo
                color: color(207, 207, 27, 87)
            });
        }
        this.rects[index] = new Emphasis({
            x: this.xbar,
            y: this.ybar,
            w: this.ptXs[index] - this.xbar,
            h: this.ptYs[index] - this.ybar,
            start: time.rect1,
            end: frames(1000),  // todo
            color: color(207, 207, 27, 87)
        });
    }

    show() {
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
    }

    getXbar() {
        return this.xbar;
    }

    getYbar() {
        return this.ybar;
    }
}

let helpergrid;
let plot;
let kats = [];
let table;

function preload() {
    table = loadTable('SLR_data.csv', 'csv');
}


function setup() {
    //pixelDensity(1);
    frameRate(fr);

    createCanvas(1200, 675);
    background(0);

    helpergrid = new HelperGrid();
    plot = new SLR_Plot(table);

    kats[0] = new Katex0({
        text: "\\textstyle\\hat{\\beta}=\\frac{\\sum_{i=1}^n (x_i-\\bar{x})(y_i-\\bar{y})} " +
            "{\\sum_{i=1}^n(x_i-\\bar{x})^2}",
        x: 670,
        y: 240,
        start: time.formula,
        fadeIn: true,
        font_size: 54
    });


    kats[1] = new Katex1({
        text: "\\bar{x}",
        x: plot.getXbar() - 7,
        y: height - 160,
        start: time.dottedlineX,
        fadeIn: true,
        font_size: 37
    });

    kats[2] = new Katex2({
        text: "\\bar{y}",
        x: 77,
        y: plot.getYbar() - 57,
        start: time.dottedlineY,
        fadeIn: true,
        font_size: 37,
    });

    kats[3] = new Katex3({
        text: "x_1 - \\bar{x}",
        x: 375,
        y: 90,
        color: color(247, 137, 27),
        start: time.xMinusXbar,
        fadeIn: true,
        font_size: 37
    });

    kats[4] = new Katex4({
        text: "y_1 - \\bar{y}",
        x: 531,
        y: 190,
        color: color(247, 137, 27),
        start: time.yMinusYbar,
        fadeIn: true,
        font_size: 37
    });
}

function draw() {
    background(0);
    //helpergrid.show();

    plot.show();

    for (let k of kats) {
        k.show();
    }
}

