/**** 2018-11-20, 12-22
 * the Timer class
 * Used to animate object initialization with acceleration and/or deceleration
 * in a given number of frames.
 * this.t is used to indicate progress; it'o 0 at the start and gradually steps to 1 at the end.
 * advance() advances a time step and returns the "progress", this.t.
 *
 * Calculus is used to determine the "velocity".
 */

class Timer {
    constructor(frames) {
        this.frames = frames;
        this.f = 1;
        this.t = 0;
    }

    advance() {
    }  // to be overridden
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
        this.f++;
        if (this.t < 0.99) {
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
        // seems that controlling the end result purely through calculus may render this.t
        // not exactly 1 at the end of animation. So we need to force it to 1.
        if (this.f >= this.frames)
            return 1;

        if (this.v > 0) {
            this.t += this.v;
            this.v += this.a;
        }
        (this.f)++;
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
        // seems that controlling the end result purely through calculus may render this.t
        // not exactly 1 at the end of animation. So we need to force it to 1.
        if (this.f > this.frames)
            return 1;

        if (this.t < 0.5) {
            this.t += this.v;
            if (this.t < 0.5) {  // fixme
                this.v += this.a;
            }
        } else if (this.v > 0) {
            this.v -= this.a;
            this.t += this.v;
        }

        (this.f)++;
        return this.t;
    }
}

/*** 2019-02-01
 * This Factory function is responsible for constructing the appropriate timer class
 * Default is return Timer2
 */
function TimerFactory(frames, mode) {
    if (mode === 0) {
        return new Timer0(frames);
    } else if (mode === 1) {
        return new Timer1(frames);
    } else if (mode === 2) {
        return new Timer2(frames);
    } else {
        return new Timer2(frames);
    }
}

/*** 2019-02-18
 * This timer is responsible for setting the stroke weight value and
 * displaying fade out animations for line-like objects.
 *
 * --- arg list ---
 * ctx - the p5 object
 * end - time to start fade out animations (in frames)
 * strokeWeight
 * duration - the duration of fade out anim (in seconds)
 */
class StrokeWeightTimer {
    constructor(ctx, end, strokeWeight, duration) {
        this.s = ctx;
        this.end = end;
        this.sw = strokeWeight || 4;
        this.duration = duration || 1;
        this.timer = new Timer0(frames(this.duration));
    }

    advance() {
        if (this.s.frameCount <= this.end) {
            this.s.strokeWeight(this.sw);
        } else {
            // fixme: 1.00001 is used since strokeWeight(0) will produce incorrect behavior
            this.s.strokeWeight(this.sw * (1.00001 - this.timer.advance()));
        }
    }
}

/*** 2019-04-23
 * THIS CLASS SHOULD NOT BE USED. ONLY USE ITS DERIVED CLASS, StrokeChanger OR FillChanger
 *
 * This timer is responsible for setting the stroke/fill value and
 * displaying color change for objects, via change(), which behaves like move().
 */
class ColorChanger {
    constructor(ctx, initColor) {
        this.s = ctx;
        this.color = initColor || [255, 255, 255, 255];
    }

    fadeOut(duration) {
        let c = deep_copy(this.color);
        this.color[3] = this.color[3] !== undefined ? this.color[3] : 255;
        c[3] = 0;
        this.reColor(c, duration);
    }

    reColor(newColor, duration) {
        this.co = this.color;
        this.cd = newColor;
        this.changed = true;
        this.f = 0;
        this.duartion = frames(1);
        if (duration)
            this.duartion = frames(duration);
        this.timer = new Timer0(this.duartion);
    }

    changing() {
        if (this.f < this.duartion) {
            let t = this.timer.advance();
            let o = this.co;
            let d = this.cd;
            if (this.color[3] === undefined) {
                this.color =
                    [o[0] + t * (d[0] - o[0]), o[1] + t * (d[1] - o[1]), o[2] + t * (d[2] - o[2])];
            } else {
                this.color = [o[0] + t * (d[0] - o[0]), o[1] + t * (d[1] - o[1]),
                    o[2] + t * (d[2] - o[2]), o[3] + t * (d[3] - o[3])];
            }
            this.f++;
        } else
            this.changed = false;
    }
}


class StrokeChanger extends ColorChanger {
    constructor(ctx, initColor) {
        super(ctx, initColor);
    }

    advance() {
        if (this.changed)
            this.changing();
        this.s.stroke(this.color);
    }
}

class FillChanger extends ColorChanger {
    constructor(ctx, initColor) {
        super(ctx, initColor);
    }

    advance() {
        if (this.changed)
            this.changing();
        this.s.fill(this.color);
    }
}