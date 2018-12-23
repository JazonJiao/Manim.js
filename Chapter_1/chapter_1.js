
class SLR_Plot extends Plot {    // the plot used to illustrate simple linear regression
    constructor(table) {
        super({
            right: 700,
            centerX: 100,
            centerY: 550,
            stepX: 100,
            stepY: 100,
            start: 25
        }, table);
    }

    show() {
        this.showAxes(); // this.showGrid()
        this.showPoints();
        this.showLine();
    }
}

let plot;
let kat1;
let table;

function preload() {
    table = loadTable('SLR_data.csv', 'csv');
}


function setup() {
    //pixelDensity(1);
    frameRate(fr);

    createCanvas(1200, 675);
    background(0);

    plot = new SLR_Plot(table);

    kat1 = new Katex1({
        str: "\\frac{\\sum_{i=1}^n (x_i-\\bar{x})(y_i-\\bar{y})} {\\sum_{i=1}^n(x_i-\\bar{x})^2}",
        x: 750,
        y: 200,
        start: frames(3),
        fadeIn: true,
        fontsize: 60
    });
}

function draw() {
    background(0);
    plot.show();
    kat1.show();
}

