
class SLR_Plot extends Plot {    // the plot used to illustrate simple linear regression
    constructor(table) {
        super({
            right: 700,
            centerX: 100,
            centerY: 550,
            stepX: 100,
            stepY: 100,
            startTime: 25
        }, table);
    }

    show() {
        this.showGrid();
        this.showPoints();
        this.showLine();
    }
}

let plot;
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

}

function draw() {
    background(0);
    plot.show();
}

