/******
 * Global variables
 */

var fr = 30;  // frame rate




/**
 * All animations are controlled by the number of frames passed.
 * since we might want to change the frame rate (the variable fr), it's good to encapsulate this
 * into a new method, to be used each time we need to control the time.
 *
 * In case we want to slow down the animation play speed, we can modify this method to, say,
 * return Math.round(fr * sec * 0.5).
 *
 * @param sec
 * @returns {number}
 */
function frames(sec) {
    return Math.round(fr * sec);
}




