/**
 * 2018/11/14
 *
 * Experiment of the class hierarchy of my animation library.
 *
 * The hierarchy is broken down into 4 layers.
 * 1. the Graphics class:    the base class for all objects; defines a transparent canvas with a width and a height
 *                           and a (essentially pure virtual) show().
 * 2. generic Object class:  (optional) defines a general object such as an axis, a brain, a collection of points
 *                           etc., that behaves on a single canvas.
 * 3. specific Object class: defines a specific object, with a show() that shows the animation for object initialization
 *                           After the init animation is complete, shows the full object on the screen.
 * 4. the Layer class:       responsible for setting up the object for a scene;
 *                           has a disp() function that operates on the canvas and calls image(this.g, ...).
 *
 * In setup(), we create the layers in the order from bottom layer to the top layer.
 * Finally, in draw(), we iterate through all layers and
 * call disp() for canvas operations, then show() for object animations
 *
 * @reference https://www.youtube.com/watch?v=pNDc8KXWp9E&t=529s
 */
const framerate = 25;

class Graphics {         // the master of all classes
    constructor(w, h) {
        this.g = createGraphics(w, h);
    }
    show() {}  // this is to be overridden by 2nd/3rd level to show the animation
    disp() {}  // this is to be overridden by 4th level to do operations on the canvas display the image
}

class Axis extends Graphics {     // generic class
    constructor(x1, y1, startTime) {
        super(1000, 300);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x1;
        this.start = startTime;
    }
    show() {
        if (frameCount > 10) { // hardcoded starting time
            this.g.stroke(240);
            this.g.strokeWeight(3);
            this.g.line(this.x1, this.y1, this.x2, 20);
            if (this.x2 < 100)
                this.x2 += 1;
            //image(this.g, 0, 0, 600, 600);  // this will cause low resolution
        }
    }
}

class AxisLayer1 extends Axis {  // this class is specific to one scene
    constructor() {
        super(20, 20, 10);
        this.x = 1;
    }
    disp() {
        this.g.translate(this.x, 0); /// Error log: translate is called for every frame. Don't increment this.x,
        // otherwise will be quadratic increase instead of linear.
        //this.x += 1;
        image(this.g, 100, 100, 1000, 300);  // fixme: call this in disp() or show()?
    }
}

/***------------------------------
 *
 */


class Brain extends Graphics {
    constructor() {
        super(1100, 1100);  // make it big since we can scale the canvas

        // the coordinates of each vertex, from bottom to top
        this.xCoords = [
            [400, 400, 400, 500, 600, 600, 600],
            [600, 750, 900, 1000, 1000, 900, 700],
            [700, 800, 860, 900, 860, 800, 700],
            [300, 150, 150, 300, 470, 640, 810],
            [500, 500, 500, 500, 500, 410, 330],
            [100, 160, 220, 280, 340, 400, 400],
            [360, 280, 210, 120, 200, 300, 400]];

        this.yCoords = [
            [900, 800, 700, 600, 500, 350, 200],
            [650, 500, 500, 400, 300, 200, 200],
            [400, 400, 400, 350, 300, 300, 300],
            [300, 300, 250, 100, 100, 100, 100],
            [470, 410, 340, 270, 200, 200, 200],
            [400, 400, 400, 400, 400, 400, 300],
            [600, 600, 600, 500, 500, 500, 500]];
    }


    show() {
        this.g.noFill();
        this.g.strokeWeight(47);
        this.g.stroke(27, 177, 37);
        this.g.strokeJoin(ROUND);
        for (let i = 0; i < 7; i++) {
            this.g.beginShape();
            for (let j = 0; j < 7; j++) {
                if (j < 7) {
                    this.g.vertex(this.xCoords[i][j], this.yCoords[i][j]);
                }
            }
            this.g.endShape();
        }
        image(this.g, 100, 100, 330, 330);
    }
}


//-----------------------------------------------
let layers = [];

function setup() {
    createCanvas(1200, 675);

    pixelDensity(1);

    //background(0);
    frameRate(framerate);
    layers[0] = new AxisLayer1();
    layers[1] = new Brain();

}

function draw() {
    background(0);
    // for (let i = 0; i < layers.length; i++) {
    //     layers[i].disp();
    //     layers[i].show();
    // }
    layers[0].disp();
    layers[0].show();
    layers[1].show();

}