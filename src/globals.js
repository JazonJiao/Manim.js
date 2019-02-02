/******
 * Global variables / functions
 */

let fr = 30;  // frame rate

// canvas width. Set to 1200 normally, 1250 if want to monitor frame rate during recording
let cvw = 1200;

// canvas height. Ensure 16:9 ratio
let cvh = 675;

let scn = 2;  // scene number

// used for chapter 2, 3
let matrix = [1, 1, 1, -1, 1, 2];
let target = [-2, 0, 3];


/*** Refactored 3D scenes on 2019-01-17
 *

 * Transforms from standard coordinates into p5'o coordinates,

 * Used for 3D scenes.
 * Transforms from standard coordinates into p5's coordinates (in the form of array),

 * so that the display of vectors, etc. is correct upon the x-y-z axes model.
 * Take care in using it, since sometimes (especially in classes),
 * the coordinates to convert is already converted to p5's system.
 * fixme: I wish JavaScript could have pass by reference so I could directly modify those values,
 * fixme: otherwise I have to return an array...
 *
 */
function stdToP5(a, b, c) {
    //if (a.length === undefined)

    if (a.length === 3) {
        return [a[1], -a[2], a[0]];   // x = y, y = -z, z = x
    } else if (a.length === 6) {
        return [a[1], -a[2], a[0], a[4], -a[5], a[3]];
    }
}

function p5ToStd(a) {
    if (a.length === 3) {
        return [a[2], a[0], -a[1]];   // x = z, y = x, z = -y
    }
}


/**
 * All animations are controlled by the number of frames passed.
 * since we might want to change the frame rate (the variable fr), it'o good to encapsulate this
 * into a new method, to be used each time we need to control the time.
 *
 * In case we want to slow down the animation play speed, we can modify this method to, say,
 * return Math.round(fr * sec * 2).
 *
 * @param sec
 * @returns {number}
 */
function frames(sec) {
    return Math.round(fr * sec);
}


/**
 * All 3D scenes should call this in s.setup()
 */
function setup3D(s) {
    s.frameRate(fr);
    s.pixelDensity(1);
    s.createCanvas(cvw, cvh);
}


/**
 * https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance
 *
 * If width is normal 1200, display FPS at upper-left position.
 * If width is monitor mode (1250), display FPS at upper-right where it'o not captured by camera.
 *
 * For usual 2D scenes, don't pass in parameters.
 * For 3D scenes, declare an off-screen canvas g2 = createGraphics(100, 10);
 * and pass in that as the parameter.
 */
function showFR(s, g) {
    const fps = s.frameRate();
    let pos = (cvw === 1200) ? 0 : 1200;

    if (g === undefined) {
        s.fill(255);
        s.textSize(10);
        s.noStroke();
        s.text("FPS: " + fps.toFixed(1), pos, 10);
    } else {
        g.background(0);
        g.fill(255);
        g.textSize(10);
        g.noStroke();
        g.text("FPS: " + fps.toFixed(1), 0, 10);
        s.image(g, pos, 0);
    }
}

/** [DEPRECATED]
 * For scenes that requires repetition of many similar scenes that will be rendered separately,
 * such as chapter_1, this function returns 10000, representing
 * "forever (actually 5 minutes) later", for animations that I don't want to show for a given scene.]
 */
function getT(t) {
    if (t === undefined) {
        return 10000;
    } else {
        return t;
    }
}
