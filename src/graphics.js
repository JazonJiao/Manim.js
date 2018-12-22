/**
 * 2018/11/14, 12/22
 *
 * Experiment of the class hierarchy of my animation library.
 *
 * The hierarchy is broken down into 4 layers.
 * 1. the Graphics class:    the base class for all objects; defines a transparent canvas with
 *                           a width, a height and a (essentially pure virtual) show().
 * 2. generic Object class:  (optional) defines a general object such as an axis, a brain,
 *                           a collection of points, etc., that behaves on a single canvas.
 * 3. specific Object class: defines a specific object, with a show() that shows the animation
 *                           for object initialization. After the init animation is complete,
 *                           shows the full object on the screen.
 * 4. the Layer class:       responsible for setting up the object for a scene;
 *                           has a render() function that operates on the canvas
 *                           and calls image(this.g, ...).
 *
 * In setup(), we create the layers in the order from bottom layer to the top layer.
 * Finally, in draw(), we iterate through all layers and
 * call render() for canvas operations, then show() for object animations
 *
 * ----args list parameters----
 * @optional (number) w, h
 *
 * Due to a bug in p5.js, I will have to first create a canvas twice the original size,
 * and then use image() to render the scaled down version.
 * Otherwise, I will have to set pixelDensity(1), which dramatically decreases image resolution.
 *
 * @reference https://www.youtube.com/watch?v=pNDc8KXWp9E&t=529s
 */
class Graphics {         // the master of all classes
    constructor(args) {
        this.w = args.w || 1200;
        this.h = args.h || 675;
        this.g = createGraphics(this.w * 2, this.h * 2);
    }

    // this is to be overridden by 2nd/3rd level to show the animation
    show() {

    }

    // this may be overridden by 4th level to do operations on the canvas and display the image
    render() {
        image(this.g, 0, 0, this.w, this.h);
    }
}

/***
 * Note 2018-11-19:
 * The above class hierarchy does not apply to 3D scenes. All 3D scenes should be rendered
 * directly on the canvas created by createCanvas(), instead of the buffer graphics object.
 * It would be awkward to use different renderers for different 3D objects on the same screen.
 * 3D object classes should be created without extensively using this.g.
 * However, in a 3D scene, I can create 2D Graphics classes on top of the 3D renderer
 * to display texts, formulas, etc.
 */
// class Graphics3D {
//     constructor(w, h) {
//         // default angleMode is radians
//         this.g = createGraphics(w, h, WEBGL);
//     }
// }