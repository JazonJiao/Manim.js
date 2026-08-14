// refactored on 2019-01-20, 02-01
class TextBase extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        // I originally used the usual syntax of args.x || width / 2,
        // but this would not work if 0 is passed in as x
        this.rotation = args.rotation || 0;
    }

    reset(args) {
        this.x = args.x || this.x;
        this.y = args.y || this.y;
    }
    // move() merged into parent class
}


/*** 2019-01-04
 * Text
 * Needs to declare a font variable and set font = loadFont('../lib/font/times.ttf') in preload()
 * There should not be a global variable named text.
 * For mode 0 (default), the x and y define the coordinates for the upper-left corner of the text.
 * For mode 1, the x and y define the center for the text.
 * For mode 2, the x and y define the upper-right corner for the text.
 * For the base class, no init animation is displayed.
 *
 * If want init animation, use a derived class, TextFade, or TextWriteIn.
 * If want sudden appearance/disappearance, use this class and pass in start and/or end.
 *
 * ---- args list parameters ----
 * @mandatory (string) str; (number) x, y; (p5.Font) font
 * @optional (number) mode, size, start, end, strokeweight, width, lineHeight;
 *           (boolean) justify; (array) color, stroke
 */
class Text extends TextBase {
    constructor(ctx, args) {
        super(ctx, args);

        this.font = args.font;
        this.str = args.str;
        this.mode = args.mode || 0;
        this.color = args.color || [255, 255, 255];
        this.ft = new FillChanger(ctx, this.color);
        this.stroke = args.stroke || undefined;
        this.sw = args.strokeweight || 1.7;

        this.size = args.size || 37;
        this.width = args.width;
        this.lineHeight = args.lineHeight;
        this.justify = args.justify !== false;
    }

    // works the same way as move()
    reColor(color, duration) {
        this.ft.reColor(color, duration);
    }

    move(x, y, duration, timerNum, size) {
        super.move(x, y, duration, timerNum);
        this.so = this.size;
        this.sn = size || this.size;
    }

    moving() {
        super.moving();
        this.size = this.so + this.move_timer.t * (this.sn - this.so);
    }

    shaking() {
        super.shaking();
        if (this.mode === 1)   // changing size only works if text is in the center
            this.size += Math.sin(this.move_timer.t * this.s.TWO_PI) * this.amp * 0.27;
    }

    jumping() {
        super.jumping();
    }

    // works the same way as move
    change(str, duration) {
        // todo
        this.reset({ str: str });
    }

    reset(args) {
        this.x = args.x || this.x;
        this.y = args.y || this.y;
        this.size = args.size || this.size;
        this.str = args.str || this.str;
        if (args.width !== undefined)
            this.width = args.width;
    }

    wrapLines(str) {
        const lines = [];
        for (const paragraph of str.split("\n")) {
            if (paragraph.trim() === "") {
                lines.push([]);
                continue;
            }

            let line = [];
            for (const word of paragraph.trim().split(/\s+/)) {
                const candidate = line.concat(word).join(" ");
                if (line.length === 0 || this.s.textWidth(candidate) <= this.width) {
                    line.push(word);
                } else {
                    lines.push(line);
                    line = [word];
                }
            }
            lines.push(line);
        }
        return lines;
    }

    drawText(str) {
        if (this.width === undefined) {
            this.s.text(str, this.x, this.y);
            return;
        }

        const lines = this.wrapLines(str);
        const lineHeight = this.lineHeight || this.size * 1.25;
        const blockHeight = lines.length * lineHeight;
        const left = this.mode === 1 ? this.x - this.width / 2 :
            (this.mode === 2 || this.mode === 4 ? this.x - this.width : this.x);
        const top = this.mode === 0 || this.mode === 2 ? this.y :
            this.y - blockHeight / 2;

        this.s.textAlign(this.s.LEFT, this.s.TOP);
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const words = lines[lineIndex];
            if (words.length === 0)
                continue;

            const wordWidths = words.map((word) => this.s.textWidth(word));
            const naturalWidth = wordWidths.reduce((sum, width) => sum + width, 0);
            const gap = this.justify && words.length > 1 ?
                Math.max(0, (this.width - naturalWidth) / (words.length - 1)) :
                this.s.textWidth(" ");
            let cursorX = left;
            const lineY = top + lineIndex * lineHeight;

            for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
                this.s.text(words[wordIndex], cursorX, lineY);
                cursorX += wordWidths[wordIndex] + gap;
            }
        }
    }

    showSetup() {
        if (this.font)
            this.s.textFont(this.font);

        if (this.mode === 0) {
            this.s.textAlign(this.s.LEFT, this.s.TOP);
        } else if (this.mode === 1) {
            this.s.textAlign(this.s.CENTER, this.s.CENTER);
        } else if (this.mode === 2) {
            this.s.textAlign(this.s.RIGHT, this.s.TOP);
        } else if (this.mode === 3) {  // center-right
            this.s.textAlign(this.s.LEFT, this.s.CENTER);
        } else if (this.mode === 4) {  // center-right
            this.s.textAlign(this.s.RIGHT, this.s.CENTER);
        }
        this.s.textSize(this.size);
        this.ft.advance();  // show color

        if (this.stroke) {
            this.s.strokeWeight(this.sw);
            this.s.stroke(this.stroke);
        } else
            this.s.noStroke();
        this.showMove();
    }

    show() {
        if (this.s.frameCount >= this.start && this.s.frameCount < this.end) {
            this.showSetup();
            this.s.fill(this.color);

            this.drawText(this.str);
        }
    }
}

/** Refactored on 2019-04-25
 * TextFade
 *
 * Capable of displaying Fade-In and/or Fade-Out animations
 *
 * ---- args list parameters ----
 * @mandatory (string) str; (number) x, y; (p5.Font) font
 * @optional (number) mode, size, start [in frames, not seconds], duration [in seconds];
 *           (array) color [should be an array]
 */
class TextFade extends Text {
    constructor(ctx, args) {
        super(ctx, args);
        this.initC = deep_copy(this.color);
        this.initC[3] = 0;
        if (this.color[3] === undefined)
            this.color[3] = 255;
        this.ft = new FillChanger(ctx, this.initC);

        this.duration = args.duration || 0.7;
        this.timer = new Timer0(frames(this.duration));
    }

    show() {
        if (this.s.frameCount >= this.start - 1) {
            if (this.s.frameCount === this.start)
                this.ft.reColor(this.color, this.duration);
            else if (this.s.frameCount === this.end)
                this.ft.fadeOut(this.duration);

            this.showSetup();
            this.drawText(this.str);
        }

    }

}

// does not yet support fade out
class TextWriteIn extends Text {
    constructor(ctx, args) {
        super(ctx, args);
        this.frCount = 0;
        this.len = this.str.length;
        this.txt = "";
        this.writeFrame = 0;
        this.charactersPerSecond = args.charactersPerSecond || 30;
    }
    show() {
        if (this.s.frameCount >= this.start) {
            this.showSetup();
            const targetLength = Math.min(
                this.len,
                Math.floor(this.writeFrame * this.charactersPerSecond / fr) + 1
            );
            while (this.frCount < targetLength) {
                this.txt += this.str[this.frCount];
                this.frCount++;
            }
            this.writeFrame++;
            this.drawText(this.txt);
        }
    }
}

/***
 * todo
 */
class TextRoll extends TextFade {
    constructor(ctx, args) {
        super(ctx, args);
    }

    /**
     * @param str - could be a number
     */
    roll(str) {
        this.reset({ str: "" + str });
    }

    rolling() {

    }
}

/**
 * A fixed, top-left paper citation introduced by a right-pointing triangle.
 * The citation text fades in while the triangle decelerates into place from
 * outside the left edge. At end, the triangle moves right and both elements
 * fade out together.
 *
 * ----args list parameters----
 * @mandatory (string) text/str; (p5.Font) font; (number) start, end
 * @optional (number) grayScale, size, duration, exitDistance
 */
class Citation {
    constructor(ctx, args) {
        this.s = ctx;
        this.start = args.start;
        this.end = args.end;
        this.duration = args.duration || 0.8;
        this.durationFrames = frames(this.duration);
        this.triangleSide = 19;
        this.triangleHeight = Math.sqrt(3) * this.triangleSide / 2;
        this.triangleTargetX = 50;
        this.triangleY = 55;
        this.triangleX = -this.triangleHeight;
        this.exitDistance = args.exitDistance || 79;
        this.enterTimer = new Timer1(this.durationFrames);
        this.exitTimer = new Timer1(this.durationFrames);
        this.fadeTimer = new Timer1(this.durationFrames);
        this.grayScale = args.grayScale || 97;
        this.triangleAlpha = 255;
        this.exiting = false;

        this.referenceText = new TextFade(this.s, {
            str: args.text || args.str,
            x: 78,
            y: this.triangleY - 4,
            mode: 3,
            size: 27,
            color: [this.grayScale, this.grayScale, this.grayScale],
            start: this.start,
            end: this.end,
            duration: this.duration,
            font: args.font
        });
    }

    drawTriangle() {
        const tipX = this.triangleX + this.triangleHeight * 2 / 3;
        const baseX = this.triangleX - this.triangleHeight / 3;
        const halfSide = this.triangleSide / 2;

        this.s.push();
        this.s.noStroke();
        this.s.fill(this.grayScale, this.triangleAlpha);
        this.s.triangle(
            tipX, this.triangleY,
            baseX, this.triangleY - halfSide,
            baseX, this.triangleY + halfSide
        );
        this.s.pop();
    }

    show() {
        if (this.s.frameCount < this.start)
            return;

        if (!this.exiting && this.s.frameCount >= this.end)
            this.exiting = true;

        if (this.exiting) {
            const exitProgress = this.s.constrain(this.exitTimer.advance(), 0, 1);
            this.triangleX = this.triangleTargetX +
                this.exitDistance * exitProgress;
            this.triangleAlpha = 255 *
                (1 - this.s.constrain(this.fadeTimer.advance(), 0, 1));
        } else {
            const enterProgress = this.s.constrain(this.enterTimer.advance(), 0, 1);
            this.triangleX = -this.triangleHeight +
                (this.triangleTargetX + this.triangleHeight) * enterProgress;
        }

        if (this.s.frameCount < this.end + this.durationFrames) {
            this.referenceText.show();
            this.drawTriangle();
        }
    }
}


/*** 2018-12-23
 * Katex
 * Base class for all math text objects. These are displayed directly as texts on the browser,
 * so I cannot do any animations on them except moving the position, changing the opacity, etc.
 * Requires p5.js (which includes the DOM APIs) and katex.js.
 *
 * The color of the text defaults to white. To reColor color, use \\textcolor{}{...} inside args.text
 *
 * Refactor on 2019-04-10: if need fade in/out animations, no longer need to pass in
 * the bool values fadeIn and fadeOut
 *
 * ----args list parameters----
 * @mandatory (string) text/str--the string to display;
 * @optional (number) start--if display fade in animation, the frame to start animation (nonzero);
 *           (number) font_size, x, y, id, mode; (string) color--note it's a string starting with '#';
 *           (number) end--if display fade out animation, the frame to start animation;
 *           (number) rotation--in degrees; (string) entryMode--currently "moveUp";
 *           (number) entryOffset, entryDuration;
 * mode: 0 upper-left, 1 center, 2 upper-right, 3 center-left, 4 center-right
 */
class Katex extends TextBase {
    constructor(ctx, args) {
        super(ctx, args);

        this.text = args.text || args.str;
        this.size = args.font_size || 37;
        this.color = args.color || '#fff';
        this.mode = args.mode || 0;
        this.entryMode = args.entryMode;
        this.entryOffset = args.entryOffset === undefined ? 45 : args.entryOffset;
        this.entryDuration = args.entryDuration || 0.7;
        this.entryStarted = false;
        this.katexOptions = args.katexOptions || {};
        this.domId = args.id || 'KATEX-' + parseInt(Math.random().toString().substr(2)); // Rand ID
        this.k = this.s.createP('');
        // Remove the browser's default paragraph margin so (x, y) addresses
        // the equation element itself instead of its surrounding margin box.
        this.k.style('margin', '0');
        this.k.style('display', 'inline-block');
        this.k.style('white-space', 'nowrap');
        const transforms = [
            'translate(0, 0)',
            'translate(-50%, -50%)',
            'translate(-100%, 0)',
            'translate(0, -50%)',
            'translate(-100%, -50%)'
        ];
        this.k.style('transform', transforms[this.mode] || transforms[0]);
        this.k.style('color', this.color);
        this.k.style('font-size', this.size + 'px');
        this.k.id(this.domId);

        if (args.fadeIn === true || args.start !== undefined || this.entryMode) {
            this.start = args.start === undefined ? frames(1) : args.start;
            this.timer = new Timer0(frames(this.entryDuration));
            this.k.style('opacity', 0);
        }
        if (args.fadeOut === true || args.end !== undefined) {
            this.end = args.end || frames(100);
            this.timer2 = new Timer0(frames(0.7));
        }

        // The equation is immutable after construction, so typeset it once.
        // show() only updates animation-related DOM styles on each frame.
        katex.render(this.text, this.k.elt, this.katexOptions);

        if (this.entryMode === "moveUp") {
            this.entryTargetX = this.x;
            this.entryTargetY = this.y;
            this.y += this.entryOffset;
        }
    }

    /*** Refactored on 2019-02-04
     * The show() now takes in the optional parameters x, y.
     * Otherwise if I have a group of Katex objects stored in a class
     * that need to move in the same manner, I will have to reset them one by one.
     * Now I can just inherit that class of a group of Katex's from PointBase, and call
     * show(this.x, this.y) on each Katex object. No need to move the Katex's one by one now.
     */
    show(x, y) {
        if (this.entryMode === "moveUp" && !this.entryStarted &&
            this.s.frameCount >= this.start) {
            this.move(
                this.entryTargetX,
                this.entryTargetY,
                this.entryDuration,
                1
            );
            this.entryStarted = true;
        }
        this.showMove();
        const canvasPos = this.s.canvas.getBoundingClientRect();
        const scaleX = canvasPos.width / this.s.width;
        const scaleY = canvasPos.height / this.s.height;
        const drawX = x !== undefined ? x : this.x;
        const drawY = y !== undefined ? y : this.y;

        this.k.position(
            canvasPos.left + drawX * scaleX,
            canvasPos.top + drawY * scaleY
        );
        this.k.style('font-size', this.size * Math.min(scaleX, scaleY) + 'px');
        this.k.style('rotate', this.rotation);

        if ((this.timer !== undefined) && this.s.frameCount > this.start) {
            this.k.style('opacity', this.timer.advance());
        }
        if ((this.timer2 !== undefined) && this.s.frameCount > this.end) {
            this.k.style('opacity', 1 - this.timer2.advance());
        }
    }
}

/**
 * A single KaTeX expression with independently animated named parts.
 *
 * KaTeX still lays out the complete expression, so relation spacing, kerning,
 * delimiters, and baselines remain intact. Each part supports independent
 * start/end times, fades, and entry/exit translations.
 *
 * args.parts: [{
 *   key, text, color,
 *   start, end,
 *   enterDuration, exitDuration,
 *   enterFrom: {x, y}, exitTo: {x, y},
 *   fadeIn, fadeOut
 * }]
 */
class AnimatedKatex extends Katex {
    constructor(ctx, args) {
        const instanceId = parseInt(Math.random().toString().substr(2));
        const parts = args.parts || [];
        const partClass = (key) => "animated-katex-" + instanceId + "-" +
            String(key).replace(/[^a-zA-Z0-9_-]/g, "-");
        const expression = parts.map((part) => {
            const body = part.color ?
                "\\textcolor{" + part.color + "}{" + part.text + "}" :
                part.text;
            return "\\htmlClass{" + partClass(part.key) + "}{" + body + "}";
        }).join("");
        const katexOptions = Object.assign({}, args.katexOptions, {
            strict: "ignore",
            trust: (context) => context.command === "\\htmlClass"
        });

        super(ctx, Object.assign({}, args, {
            text: expression,
            start: undefined,
            end: undefined,
            entryMode: undefined,
            fadeIn: false,
            fadeOut: false,
            katexOptions: katexOptions
        }));

        this.animatedKatexArgs = Object.assign({}, args);
        this.transitions = [];
        this.partStates = {};
        parts.forEach((part) => {
            const element = this.k.elt.querySelector("." + partClass(part.key));
            if (!element)
                throw new Error("AnimatedKatex part not found: " + part.key);

            element.style.display = "inline-block";
            element.style.willChange = "opacity, transform";
            this.partStates[part.key] = {
                key: part.key,
                text: part.text,
                color: part.color,
                element: element,
                start: part.start === undefined ? 0 : part.start,
                end: part.end === undefined ? Infinity : part.end,
                enterFrames: frames(part.enterDuration === undefined ? 0.7 :
                    part.enterDuration),
                exitFrames: frames(part.exitDuration === undefined ? 0.7 :
                    part.exitDuration),
                enterFrom: part.enterFrom || {x: 0, y: 0},
                exitTo: part.exitTo || {x: 0, y: 0},
                fadeIn: part.fadeIn !== false,
                fadeOut: part.fadeOut !== false,
                offset: {x: 0, y: 0},
                motion: undefined,
                jump: undefined
            };
        });
    }

    static ease(progress) {
        const t = Math.max(0, Math.min(1, progress));
        return t * t * (3 - 2 * t);
    }

    partMotionOffset(state) {
        if (!state.motion)
            return state.offset;
        const progress = (this.s.frameCount - state.motion.start) /
            state.motion.duration;
        if (progress >= 1) {
            state.offset = {x: state.motion.x, y: state.motion.y};
            state.motion = undefined;
            return state.offset;
        }
        const t = AnimatedKatex.ease(progress);
        return {
            x: state.motion.fromX + (state.motion.x - state.motion.fromX) * t,
            y: state.motion.fromY + (state.motion.y - state.motion.fromY) * t
        };
    }

    /** Move one rendered part to an offset relative to its KaTeX layout. */
    movePart(key, x, y, duration) {
        const state = this.partStates[key];
        if (!state)
            throw new Error("Unknown AnimatedKatex part: " + key);
        const current = this.partMotionOffset(state);
        state.motion = {
            fromX: current.x,
            fromY: current.y,
            x: x,
            y: y,
            start: this.s.frameCount,
            duration: Math.max(1, frames(duration || 0.7))
        };
    }

    /** Jump one rendered part vertically, returning to its layout position. */
    jumpPart(key, height, duration) {
        const state = this.partStates[key];
        if (!state)
            throw new Error("Unknown AnimatedKatex part: " + key);
        state.jump = {
            height: height,
            start: this.s.frameCount,
            duration: Math.max(1, frames(duration || 0.7))
        };
    }

    partJumpOffset(state) {
        if (!state.jump)
            return 0;
        const progress = (this.s.frameCount - state.jump.start) /
            state.jump.duration;
        if (progress >= 1) {
            state.jump = undefined;
            return 0;
        }
        return -state.jump.height * Math.sin(Math.PI * Math.max(0, progress));
    }

    /** Return a named part's bounds in canvas coordinates. */
    getPartBounds(key) {
        const state = this.partStates[key];
        if (!state)
            throw new Error("Unknown AnimatedKatex part: " + key);
        const rect = state.element.getBoundingClientRect();
        const canvasRect = this.s.canvas.getBoundingClientRect();
        const scaleX = canvasRect.width / this.s.width;
        const scaleY = canvasRect.height / this.s.height;
        return {
            x: (rect.left - canvasRect.left) / scaleX,
            y: (rect.top - canvasRect.top) / scaleY,
            width: rect.width / scaleX,
            height: rect.height / scaleY,
            centerX: (rect.left + rect.width / 2 - canvasRect.left) / scaleX,
            centerY: (rect.top + rect.height / 2 - canvasRect.top) / scaleY
        };
    }

    getAllPartBounds() {
        const bounds = {};
        Object.keys(this.partStates).forEach((key) => {
            bounds[key] = this.getPartBounds(key);
        });
        return bounds;
    }

    /**
     * Re-typeset the expression and morph to KaTeX's new layout.
     * Unchanged keyed parts slide to their new positions. Changed parts crossfade;
     * by default the old content moves down while the new content enters from
     * above and also moves down into place.
     */
    transitionTo(parts, args = {}) {
        const start = args.start === undefined ? this.s.frameCount : args.start;
        const duration = args.duration === undefined ? 0.7 : args.duration;
        const offsetY = args.offsetY === undefined ? 22 : args.offsetY;
        const hiddenParts = parts.map((part) => Object.assign({}, part, {
            start: Infinity
        }));
        const next = new AnimatedKatex(this.s, Object.assign(
            {}, this.animatedKatexArgs, {parts: hiddenParts}
        ));
        this.transitions.push({
            next: next,
            parts: parts,
            start: start,
            duration: duration,
            durationFrames: Math.max(1, frames(duration)),
            offsetY: offsetY,
            initialized: false
        });
        return next;
    }

    initializeTransition(transition) {
        const next = transition.next;
        const frame = this.s.frameCount;
        transition.parts.forEach((part) => {
            const oldState = this.partStates[part.key];
            const newState = next.partStates[part.key];
            if (!newState)
                return;
            const unchanged = oldState && oldState.text === part.text &&
                oldState.color === part.color;

            if (unchanged) {
                const oldRect = oldState.element.getBoundingClientRect();
                const newRect = newState.element.getBoundingClientRect();
                oldState.suppressed = true;
                newState.start = frame;
                newState.fadeIn = false;
                newState.enterFrames = 0;
                newState.offset = {
                    x: oldRect.left - newRect.left,
                    y: oldRect.top - newRect.top
                };
                newState.motion = {
                    fromX: newState.offset.x,
                    fromY: newState.offset.y,
                    x: 0,
                    y: 0,
                    start: frame,
                    duration: transition.durationFrames
                };
            } else {
                if (oldState) {
                    oldState.end = frame;
                    oldState.exitFrames = transition.durationFrames;
                    oldState.exitTo = {x: 0, y: transition.offsetY};
                    oldState.fadeOut = true;
                }
                newState.start = frame;
                newState.enterFrames = transition.durationFrames;
                newState.enterFrom = {x: 0, y: -transition.offsetY};
                newState.fadeIn = true;
            }
        });

        Object.values(this.partStates).forEach((oldState) => {
            if (!next.partStates[oldState.key]) {
                oldState.end = frame;
                oldState.exitFrames = transition.durationFrames;
                oldState.exitTo = {x: 0, y: transition.offsetY};
            }
        });
        transition.initialized = true;
    }

    updatePart(state) {
        const frame = this.s.frameCount;
        let opacity = 1;
        let x = 0, y = 0;

        if (frame < state.start) {
            opacity = state.fadeIn ? 0 : 1;
            x = state.enterFrom.x || 0;
            y = state.enterFrom.y || 0;
        } else if (frame < state.start + state.enterFrames) {
            const t = AnimatedKatex.ease(
                (frame - state.start) / Math.max(1, state.enterFrames)
            );
            opacity = state.fadeIn ? t : 1;
            x = (state.enterFrom.x || 0) * (1 - t);
            y = (state.enterFrom.y || 0) * (1 - t);
        }

        if (frame >= state.end) {
            const t = AnimatedKatex.ease(
                (frame - state.end) / Math.max(1, state.exitFrames)
            );
            opacity = state.fadeOut ? 1 - t : opacity;
            x = (state.exitTo.x || 0) * t;
            y = (state.exitTo.y || 0) * t;
        }

        const motion = this.partMotionOffset(state);
        const jumpY = this.partJumpOffset(state);
        state.element.style.opacity = state.suppressed ? 0 : opacity;
        state.element.style.transform = "translate(" +
            (x + motion.x) + "px, " + (y + motion.y + jumpY) + "px)";
    }

    show(x, y) {
        super.show(x, y);
        Object.values(this.partStates).forEach((state) => this.updatePart(state));
        this.transitions.forEach((transition) => {
            transition.next.show(x, y);
            if (!transition.initialized &&
                this.s.frameCount >= transition.start) {
                this.initializeTransition(transition);
                Object.values(transition.next.partStates).forEach((state) =>
                    transition.next.updatePart(state)
                );
            }
        });
    }
}
