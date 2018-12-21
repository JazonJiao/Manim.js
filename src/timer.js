/**** 2018-11-20
 * the Timer class
 * Used to animate object initialization with acceleration and/or deceleration
 * in a given number of frames.
 * this.t is used to indicate progress; it's 0 at the start and gradually steps to 1 at the end.
 * advance() advances a time step and returns the "progress", this.t.
 *
 * Calculus is used to determine the "velocity".
 */

class Timer {
    constructor(frames) {
        this.frames = frames;
        this.t = 0;
    }
    advance() {}  // to be overridden
}

/*** Timer0
 * constant speed
 */
class Timer0 extends Timer {
    constructor(frames) {
        super(frames);
        this.v = 1 / frames;
    }

    advance() {
        if (this.t < 0.999) {
            this.t += this.v;
        }
        return this.t;
    }
}

/*** Timer1
 * keep decelerating
 */
class Timer1 extends Timer {
    constructor(frames) {
        super(frames);
        this.a = -2 / (frames * frames);

        // Since time is updated before velocity is updated, the integral is a left Riemann Sum,
        // so in the end this.t will be larger than expected (smaller if use the right Riemann Sum).
        // To get around this, reduce initial velocity by exactly 1/frames^2.
        // This way this.t will end up at 1.
        this.v = 2 / frames - 1 / (frames * frames);
    }

    advance() {
        if (this.v > 0) {
            this.t += this.v;
            this.v += this.a;
        }
        return this.t;
    }
}

/** Timer2
 * accelerate then decelerate
 */
class Timer2 extends Timer {
    constructor(frames) {
        super(frames);
        this.v = 0;
        this.a = 4 / (frames * frames);
    }
    advance() {
        if (this.t < 0.5) {
            this.t += this.v;
            if (this.t < 0.5) {
                this.v += this.a;
            }
        } else if (this.v > 0) {
            this.v -= this.a;
            this.t += this.v;
        }
        return this.t;
    }
}


