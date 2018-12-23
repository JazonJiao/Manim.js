class SLR_Plot extends Plot {    // the plot used to illustrate simple linear regression
    constructor(table) {
        super({
            right: 700,
            centerX: 100,
            centerY: 550,
            stepX: 10,
            stepY: 10,
            start: 25
        }, table);

        // the two dotted lines displaying x-bar and y-bar
        this.xbar = this.centerX + this.avgX * this.stepX;
        this.ybar = this.centerY - this.avgY * this.stepY;
        this.xbarLine = new DottedLine({
            x1: this.xbar, x2: this.xbar,
            y1: this.top, y2: this.bottom,
            color: color(77, 177, 247),
            strokeweight: 2,
            start: this.start + frames(3)  // todo
        });
        this.ybarLine = new DottedLine({
            x1: this.left, x2: this.right,
            y1: this.ybar, y2: this.ybar,
            color: color(77, 177, 247),
            strokeweight: 2,
            start: this.start + frames(3)  // todo
        });


        // We can use the emphasis class as rectangles, with the end time "infinite"

    }

    show() {
        this.xbarLine.show();
        this.ybarLine.show();
        this.showAxes(); // this.showGrid()
        this.showPoints();
        this.showLine();
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
let kat1, kat2, kat3, kat4;
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

    kat1 = new Katex1({
        text: "\\textstyle\\hat{\\beta}=\\frac{\\sum_{i=1}^n (x_i-\\bar{x})(y_i-\\bar{y})} " +
            "{\\sum_{i=1}^n(x_i-\\bar{x})^2}",
        x: 750,
        y: 240,
        start: frames(3),
        fadeIn: true,
        font_size: 47
    });


    kat2 = new Katex2({
        text: "\\bar{x}",
        x: plot.getXbar() - 7,
        y: height - 80,
        start: frames(1),
        fadeIn: true,
        font_size: 37
    });

    kat3 = new Katex3({
        text: "\\bar{y}",
        x: 17,
        y: plot.getYbar() - 57,
        start: frames(1),
        fadeIn: true,
        font_size: 37
    });
}

function draw() {
    background(0);
    helpergrid.show();

    plot.show();

    kat1.show();
    ///// Error log: I forgot to call kat2.show(), and spent an hour debugging...
    kat2.show();
    kat3.show();
}

