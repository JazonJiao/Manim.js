/**
 * 2018/11/14, 12/22
 *
 * Experiment of the class hierarchy of my animation library. [NOW DEPRECATED--SEE PointBase]
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
    constructor(ctx, args) {
        this.s = ctx;
        this.w = args.w || 1200;
        this.h = args.h || 675;
        this.g = this.s.createGraphics(this.w * 2, this.h * 2);
    }

    // this is to be overridden by 2nd/3rd level to show the animation
    show() {

    }

    // this may be overridden by 4th level to do operations on the canvas and display the image
    render() {
        this.s.image(this.g, 0, 0, this.w, this.h);
    }
}

/*** 2019-02-01 --- Major Refactoring
 * Base class for all objects defined by (x, y) position, as opposed to x1, y1, x2, y2 in a line
 *
 * This class is created to centralize the operation of moving and shifting of an object,
 * if the object's position is shown in draw(), instead of setup().
 *
 * shift() takes in relative target coordinates, while move() takes in absolute target position.
 *
 * ---- args list parameters ----
 * @optional (number) x, y, start [in frames], duration [in secs], end [in frames];
 */
class PointBase {
    constructor(ctx, args) {
        this.s = ctx;
        this.x = args.x || 0;
        this.y = args.y || 0;
        this.start = args.start || 30;
        this.start = Math.floor(this.start);
        this.duration = args.duration || 1;  // fixme
        this.end = args.end || 100000;
        this.end = Math.floor(this.end);
    }

    shift(x, y, duration, timerNum) {
        this.move(this.x + x, this.y + y, duration, timerNum);
    }

    /*** move(), 2019-02-01
     * Moves to a location with respect to the p5 coordinate
     * In s.draw(), use if (s.frameCount === [t]) [var].move(...);
     *
     * --- arg list ---
     * duration is in seconds, not frames
     */
    move(x, y, duration, timerNum) {
        this.xo = this.x;
        this.xd = x;
        this.yo = this.y;
        this.yd = y;
        this.moved = true;
        this.move_duartion = frames(1);
        if (duration)
            this.move_duartion = frames(duration);

        this.f = 0;
        this.move_timer = TimerFactory(this.move_duartion, timerNum);
    }

    moving() {
        if (this.f < this.move_duartion) {
            let t = this.move_timer.advance();
            this.x = this.xo + t * (this.xd - this.xo);
            this.y = this.yo + t * (this.yd - this.yo);
            this.f++;
        } else {
            this.moved = false;
        }
    }

    /*** shake(), 2019-02-17
     * Shake vertically as emphasis
     * In s.draw(), use if (s.frameCount === [t]) [var].shake(...);
     *
     * --- arg list ---
     * @param amp - amplitude in pixels
     * @param duration - in seconds
     */
    shake(amp, duration) {
        this.yo = this.y;
        this.amp = amp;
        this.shaked = true;
        this.move_duartion = frames(1);
        if (duration)
            this.move_duartion = frames(duration);
        this.f = 0;
        this.move_timer = new Timer2(this.move_duartion);
    }

    jump(amp, duration) {
        this.yo = this.y;
        this.amp = amp;
        this.jumped = true;
        this.move_duartion = frames(1);
        if (duration)
            this.move_duartion = frames(duration);
        this.f = 0;
        this.move_timer = new Timer2(this.move_duartion);
    }

    shaking() {
        if (this.f <= this.move_duartion) {
            let t = this.move_timer.advance() * this.s.TWO_PI;
            this.y = this.yo - this.amp * Math.sin(t);
            this.f++;
        } else {
            this.shaked = false;
        }
    }

    jumping() {
        if (this.f <= this.move_duartion) {
            let t = this.move_timer.advance() * this.s.PI;
            this.y = this.yo - this.amp * Math.sin(t);
            this.f++;
        } else {
            this.jumped = false;
        }
    }

    // to be called at the beginning of the show() function of derived classes
    // move() and shake() cannot happen at the same time
    showMove() {
        if (this.moved)
            this.moving();
        else if (this.shaked)
            this.shaking();
        else if (this.jumped)
            this.jumping();
    }

    show() {

    }
}

/*** 2019-04-17
 * Dragger
 * Used to help adjust the coordinates of objects.
 * todo: extend this to line-based objects, will make animating matrix transformations simpler
 *
 * You can pass in an array consisting of PointBase objects and/or PointBase arrays,
 * and call show() in s.draw(). Then, the coordinates of each registered object
 * will be shown on the screen. You can drag the objects to the desired locations and
 * see the value of their new coordinates, so you can adjust them in the code.
 *
 * This can be seen as an implementation of the Observer-Reactor Design Pattern?
 */
class Dragger {
    constructor(ctx, arr) {  // takes in an array of PointBase objects/arrays
        this.s = ctx;
        this.a = arr;
    }

    changePos(i) {
        let px = this.s.pmouseX, py = this.s.pmouseY;  // previous frame mouse locations
        let nx = this.s.mouseX, ny = this.s.mouseY;  // current frame mouse locations
        if (i.x - px > -7 && i.x - px < 7 && i.y - py > -7 && i.y - py < 7) {
            i.x = nx; // mouse is in the gray box, drag object to new position
            i.y = ny;
        }
    }

    showPos(i) {
        this.s.noStroke();
        this.s.fill(177);
        this.s.rect(i.x - 7, i.y - 7, 14, 14);
        this.s.textSize(17);
        this.s.textAlign(this.s.LEFT, this.s.TOP);
        this.s.text(i.x + ", " + i.y, i.x + 9, i.y - 7);
    }

    show() {
        for (let i of this.a) {
            if (i instanceof Array) {
                for (let j of i)
                    this.showPos(j);
            } else
                this.showPos(i);
        }
        if (this.s.mouseIsPressed) {
            for (let i of this.a) {
                if (i instanceof Array) {
                    for (let j of i)
                        this.changePos(j);
                } else
                    this.changePos(i);
            }
        }
    }
}