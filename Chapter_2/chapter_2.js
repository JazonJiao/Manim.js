


let X_ = [
    [1, 1, 1, 1],
    [1, -1, -1, 1],
    [1, 1, -1, -2]];
let y_ = [-1, 2, 4, -2];

// the plane used to show multiple regression on 2 independent variables
class MR_Plane extends Axes3D {
    constructor(args) {
        super(args);

    }
}

let axes;
let obj;
let pl;

function preload() {
    obj = loadModel('../lib/obj/axes.obj');
}

function setup() {
    frameRate(fr);

    pixelDensity(1);
    createCanvas(cvw, cvh);
    g3 = createGraphics(cvh * 2, cvh * 2, WEBGL);  // a square to be displayed to the left
    g2 = createGraphics(100, 10);

    axes = new Axes3D({
        model: obj
    });

    pl = new Plane3D({
        a: 1,
        b: 1,
        c: 1
    })

}

function draw() {
    background(0);
    axes.show(g3);
    pl.showPlane(g3);

    image(g3, 0, 0, cvh, cvh);
    showFR(g2);
}