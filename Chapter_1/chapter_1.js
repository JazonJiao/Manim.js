class SLR_Plot extends Plot {    // the plot used to illustrate simple linear regression
    constructor(table) {
        super({
            w : 700,
            h : 675,
            centerX : 100,
            centerY : 550,
            stepX : 100,
            stepY : 100
        }, table);
    }

    show() {
        this.showGrid(0);
        this.axes.show(0);
        this.showPoints();
    }

    render() {
        this.axes.render();
        image(this.g, 0, 0);
    }
}


function preload() {
    table = loadTable('SLR_data.csv', 'csv');
}


function setup() {
    pixelDensity(1);
    frameRate(fr);

}


