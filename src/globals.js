/******
 * Global variables
 */

let fr = 30;  // frame rate


/**
 * All animations are controlled by the number of frames passed.
 * since we might want to change the frame rate (the variable fr), it's good to encapsulate this
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
 * https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance
 *
 * For usual 2D scenes, don't pass in parameters.
 * For 3D scenes, declare an off-screen canvas g2 = createGraphics(100, 10);
 * and pass in that as the parameter.
 */
function showFR(g) {
    let fps = frameRate();
    if (g === undefined) {
        fill(255);
        noStroke();
        text("FPS: " + fps.toFixed(1), 10, height - 10);
    } else {
        g.background(0);
        g.fill(255);
        g.noStroke();
        g.text("FPS: " + fps.toFixed(1), 10, 10);
        image(g, 0, 0);
    }
}
