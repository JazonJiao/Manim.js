const DPOScene08 = function(s, args) {
    let font, preferenceLabel, preferencePair, optimizeLabel;
    let optimizationArrow, modelOverlay, modelLabel;

    const preferenceStart = frames(0.5);
    const pairStart = frames(1);
    const arrowStart = frames(1.5);
    const optimizeStart = frames(3);
    const overlayStart = frames(5);

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);

        preferenceLabel = new TextFade(s, {
            str: "preference pairs",
            x: s.width / 2,
            y: 155,
            mode: 1,
            size: 45,
            color: [235, 241, 250],
            start: preferenceStart,
            font: font
        });
        preferencePair = new Katex(s, {
            text: "(\\textcolor{#4db1ff}{x}, " +
                "\\textcolor{#4dd999}{y_w}, " +
                "\\textcolor{#ff7080}{y_l})",
            x: s.width / 2,
            y: 245,
            mode: 1,
            font_size: 43,
            color: "#ffffff",
            start: pairStart
        });
        optimizationArrow = new Arrow(s, {
            x1: s.width / 2,
            y1: 315,
            x2: s.width / 2,
            y2: 685,
            start: arrowStart,
            duration: 1,
            strokeweight: 6,
            tipLen: 24,
            color: [235, 241, 250]
        });
        optimizeLabel = new TextFade(s, {
            str: "optimize LLM",
            x: s.width / 2,
            y: 755,
            mode: 1,
            size: 45,
            color: [235, 241, 250],
            start: optimizeStart,
            font: font
        });

        modelOverlay = new RoundedRect(s, {
            x: s.width / 2 - 220,
            y: 445,
            w: 440,
            h: 100,
            radius: 24,
            color: [77, 57, 17, 247],
            start: overlayStart,
            duration: 0.8
        });
        modelLabel = new TextFade(s, {
            str: "Bradley–Terry model",
            x: s.width / 2,
            y: 490,
            mode: 1,
            size: 42,
            color: [247, 227, 47],
            start: overlayStart,
            duration: 0.8,
            font: font
        });
    };

    s.draw = function () {
        preferenceLabel.show();
        preferencePair.show();
        optimizationArrow.show();
        optimizeLabel.show();
        modelOverlay.show();
        modelLabel.show();
    };

};

const DPOScene09 = function (s, args) {
    let monoFont, rewardCube, rewardEq;
    let xEq, responseText, yEq, promptText;
    let rewardStartTime = frames(2.5), variableStartTime = frames(1);

    s.preload = function () {
        monoFont = s.loadFont("../../lib/font/CascadiaMono.ttf");
    };

    s.setup = function () {
        setup2D(s);
        rewardEq = new Katex(s, {
            text: "Reward = r(" +
                "\\textcolor{#4db1ff}{x}, " +
                "\\textcolor{#c54fb1}{y})",
            x: s.width / 2,
            y: s.height / 2 - 170,
            font_size: 40,
            mode: 1,
            start: rewardStartTime,
            entryMode: "moveUp",
            entryOffset: 45,
            entryDuration: 0.7
        });
        rewardCube = new RotatingRewardCube(s, {
            x: s.width / 2,
            y: s.height / 2 - 90,
            size: 27,
            start: rewardStartTime
        });
        xEq = new Katex(s, {
            text: "\\textcolor{#4db1ff}{x =}",
            x: s.width / 2 - 49,
            y: s.height / 2 + 60,
            mode: 4,
            font_size: 37,
            start: variableStartTime
        });
        responseText = new TextFade(s, {
            str: "response",
            x: s.width / 2 - 29,
            y: s.height / 2 + 145,
            mode: 3,
            size: 37,
            font: monoFont,
            color: [197, 79, 177],
            start: variableStartTime
        });
        yEq = new Katex(s, {
            text: "\\textcolor{#c54fb1}{y =}",
            x: s.width / 2 - 49,
            y: s.height / 2 + 150,
            mode: 4,
            font_size: 37,
            start: variableStartTime
        });
        promptText = new TextFade(s, {
            str: "prompt",
            x: s.width / 2 - 29,
            y: s.height / 2 + 55,
            mode: 3,
            size: 37,
            font: monoFont,
            color: [77, 177, 255],
            start: variableStartTime
        });
    };

    s.draw = function () {
        if (s.frameCount === frames(6))
            responseText.jump(35, 0.6);
        if (s.frameCount === frames(8))
            rewardEq.jump(35, 0.6);

        rewardEq.show();
        rewardCube.show();
        xEq.show();
        responseText.show();
        yEq.show();
        promptText.show();
    };
};

/**
 * The sigmoid plot used by DPOSceneB2. Its horizontal domain is [-7, 7],
 * while its compact vertical axis is sized for the function's [0, 1] range.
 */
class Sigmoid extends Axes {
    constructor(ctx, args = {}) {
        const plotWidth = ctx.width * 0.6;
        const left = (ctx.width - plotWidth) / 2;
        const right = left + plotWidth;
        const axesDuration = args.axesDuration === undefined ? 1 : args.axesDuration;

        super(ctx, Object.assign({}, args, {
            left: left,
            right: right,
            centerX: ctx.width / 2,
            centerY: 350,
            top: 130,
            bottom: 390,
            stepX: plotWidth / 14,
            stepY: 180,
            labelX: "x",
            labelY: "y"
        }));

        // Axes' default x-label offset places it well above the horizontal axis.
        this.label1.x = right + 12;
        this.label1.y = this.centerY - 18;

        this.curve = new FcnPlot(this.s, {
            axes: this,
            f: (x) => 1 / (1 + Math.exp(-x)),
            start: args.curveStart === undefined ?
                this.start + frames(axesDuration) : args.curveStart,
            duration: args.duration || 2,
            mode: 1,
            segLen: args.segLen || 3,
            strokeweight: args.strokeweight || 5,
            color: args.color || [201, 139, 60]
        });
    }

    show() {
        this.showAxes();
        this.curve.show();
    }
}

/**
 * A KaTeX reward expression whose numeric value can be updated during an
 * animation. It re-renders only when its one-decimal display changes.
 */
class RewardEquation {
    constructor(ctx, args) {
        this.s = ctx;
        this.expression = args.expression;
        this.value = Number(args.value);
        this.displayValue = this.value.toFixed(1);
        this.baseFontSize = args.font_size || 37;
        this.valueScale = args.valueScale === undefined ? 0.7 : args.valueScale;

        this.label = new Katex(this.s, Object.assign({}, args, {
            text: this.expression
        }));
        this.number = new Katex(this.s, Object.assign({}, args, {
            text: this.displayValue,
            x: args.x + args.valueOffset,
            mode: 1,
            font_size: this.baseFontSize * this.valueScale
        }));
    }

    setValue(value) {
        this.value = Number(value);
        const displayValue = this.value.toFixed(1);
        if (displayValue !== this.displayValue) {
            this.displayValue = displayValue;
            this.number.text = displayValue;
            katex.render(displayValue, this.number.k.elt);
        }
    }

    setScale(scale) {
        this.valueScale = scale;
        this.number.size = this.baseFontSize * this.valueScale;
    }

    show() {
        this.label.show();
        this.number.show();
    }
}

/** A live KaTeX rendering of sigma applied to a one-decimal reward difference. */
class SigmoidDifferenceEquation extends Katex {
    constructor(ctx, args) {
        const displayValue = Number(args.value).toFixed(1);
        super(ctx, Object.assign({}, args, {
            text: SigmoidDifferenceEquation.expression(displayValue)
        }));
        this.displayValue = displayValue;
    }

    static expression(displayValue) {
        return "= \\sigma\\!\\left(" +
            "\\textcolor{#f9c911}{" + displayValue + "}" +
            "\\right)";
    }

    setDifference(value) {
        const displayValue = Number(value).toFixed(1);
        if (displayValue !== this.displayValue) {
            this.displayValue = displayValue;
            this.text = SigmoidDifferenceEquation.expression(displayValue);
            katex.render(this.text, this.k.elt);
        }
    }
}

/**
 * Tracks a point along a sigmoid while exposing the corresponding change in
 * reward. Point's built-in entrance matches the treatment in chapter_1.js.
 */
class SigmoidPointTracker {
    constructor(ctx, args) {
        this.s = ctx;
        this.axes = args.axes;
        this.modelX = 0;
        this.probability = 0.5;
        this.maxX = args.maxX === undefined ? 3 : args.maxX;
        this.moveStart = args.moveStart;
        this.moveTimer = new Timer2(frames(args.moveDuration || 2));

        this.point = new Point(this.s, {
            x: this.axes.centerX,
            y: this.axes.centerY - 0.5 * this.axes.stepY,
            radius: 17,
            start: args.start,
            color: [255, 185, 0]
        });
        this.valueLabel = new Katex(this.s, {
            text: "0.500",
            x: this.point.x - 12,
            y: this.point.y - 24,
            mode: 4,
            font_size: 27,
            color: "#ffb900",
            start: args.start
        });
        this.displayValue = "0.500";
        this.targetMotion = undefined;
        this.baseMotionDisabled = false;
    }

    moveToX(targetX, duration) {
        this.baseMotionDisabled = true;
        this.targetMotion = {
            fromX: this.modelX,
            targetX: targetX,
            timer: new Timer2(frames(duration || 1))
        };
    }

    update() {
        if (this.targetMotion) {
            const progress = this.targetMotion.timer.advance();
            this.modelX = this.targetMotion.fromX + progress *
                (this.targetMotion.targetX - this.targetMotion.fromX);
            if (progress >= 1)
                this.targetMotion = undefined;
        } else if (!this.baseMotionDisabled &&
            this.s.frameCount >= this.moveStart) {
            this.modelX = this.maxX * this.moveTimer.advance();
        }

        if (this.s.frameCount >= this.moveStart || this.targetMotion ||
            this.baseMotionDisabled) {
            this.probability = 1 / (1 + Math.exp(-this.modelX));
            const pointX = this.axes.centerX + this.modelX * this.axes.stepX;
            const pointY = this.axes.centerY - this.probability * this.axes.stepY;
            this.point.reset(pointX, pointY);
            this.valueLabel.x = pointX - 12;
            this.valueLabel.y = pointY - 24;

            const displayValue = this.probability.toFixed(3);
            if (displayValue !== this.displayValue) {
                this.displayValue = displayValue;
                this.valueLabel.text = displayValue;
                katex.render(displayValue, this.valueLabel.k.elt);
            }
        }
    }

    show() {
        this.update();
        this.point.show();
        this.valueLabel.show();
        return this.modelX;
    }
}

/** A left-to-right underline draw followed by a left-to-right wipe. */
class UnderlineSweep {
    constructor(ctx, args) {
        this.s = ctx;
        this.x1 = args.x1;
        this.x2 = args.x2;
        this.y = args.y;
        this.start = args.start;
        this.durationFrames = frames(args.duration || 1);
        this.color = args.color || [249, 201, 17];
        this.strokeweight = args.strokeweight || 5;
    }

    easeOut(progress) {
        const t = this.s.constrain(progress, 0, 1);
        return 1 - (1 - t) * (1 - t);
    }

    show() {
        const elapsed = this.s.frameCount - this.start;
        if (elapsed < 0 || elapsed >= this.durationFrames * 2)
            return;

        let left = this.x1, right = this.x2;
        if (elapsed < this.durationFrames) {
            right = this.x1 + (this.x2 - this.x1) *
                this.easeOut(elapsed / this.durationFrames);
        } else {
            left = this.x1 + (this.x2 - this.x1) *
                this.easeOut((elapsed - this.durationFrames) /
                    this.durationFrames);
        }

        this.s.push();
        this.s.stroke(this.color);
        this.s.strokeWeight(this.strokeweight);
        this.s.strokeCap(this.s.ROUND);
        this.s.line(left, this.y, right, this.y);
        this.s.pop();
    }
}

// Scene 10 formula entrance controls. Change any value independently.
const scene10FormulaStarts = {
    probabilityOpen: frames(1.5),
    preferred: frames(2.5),
    preference: frames(3),
    rejected: frames(3.5),
    condition: frames(4),
    equals: frames(5.7),
    sigmoidOpen: frames(5.7),
    preferredReward: frames(7),
    minus: frames(7),
    rejectedReward: frames(7),
    close: frames(5.7)
};

const DPOScene10 = function (s, args) {
    const preferredSymbol = "A";
    const rejectedSymbol = "B";
    const preferredName = "A";
    const preferenceName = "A";
    const formulaStarts = scene10FormulaStarts;
    let font, monoFont, italicFont, emojiFont, paperReference, sigmoid;
    let bradleyTerryFormula, sigmoidPoint;
    let preferenceText, differenceEquation;
    let promptLabel, preferredLabel, rejectedLabel;
    let prompt, winner, loser, winnerReward, loserReward;
    let winnerAnnotation, loserAnnotation, winnerSymbol, loserSymbol;
    let replacementLoser, firstUnderline, secondUnderline, realityNote;
    let rewardConvergenceTimer, rewardConvergenceStart, rewardConvergenceTarget;
    let questionBrain, questionText, questionFormula;
    let initialReward = 1.1, textSize = 37, textX = 390, textY = 690;
    const responseTextX = textX + 80;
    const labelX = responseTextX - 18;
    let referenceStartTime = frames(1.5), referenceEndTime = frames(3);
    let brainStartTime = frames(2);

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
        italicFont = s.loadFont("../../lib/font/timesi.ttf");
        monoFont = s.loadFont("../../lib/font/CascadiaMono.ttf");
    };

    s.setup = function () {
        setup2D(s);
        paperReference = new Citation(s, {
            text: "R. Bradley and M. Terry (1952). Rank analysis of " +
                "incomplete block designs: I. the method of paired comparisons.",
            font: font,
            start: referenceStartTime,
            end: referenceEndTime,
            duration: 0.8
        });
        sigmoid = new Sigmoid(s, {
            start: scene10FormulaStarts.condition,
            curveStart: scene10FormulaStarts.sigmoidOpen
        });
        bradleyTerryFormula = new AnimatedKatex(s, {
            parts: [
                {key: "probabilityOpen", text: "P("},
                {key: "preferred", text: preferredSymbol, color: "#4dd999"},
                {key: "preference", text: "\\succ"},
                {key: "rejected", text: rejectedSymbol, color: "#ff7080"},
                {key: "condition", text: "\\mid x)"},
                {key: "equals", text: "="},
                {key: "sigmoidOpen", text: "\\sigma("},
                {key: "preferredRewardOpen", text: "r(x,", color: "#4dd999"},
                {key: "preferredRewardSymbol", text: preferredSymbol,
                    color: "#4dd999"},
                {key: "preferredRewardClose", text: ")", color: "#4dd999"},
                {key: "minus", text: "-"},
                {key: "rejectedRewardOpen", text: "r(x,", color: "#ff7080"},
                {key: "rejectedRewardSymbol", text: rejectedSymbol,
                    color: "#ff7080"},
                {key: "rejectedRewardClose", text: ")", color: "#ff7080"},
                {key: "close", text: ")"}
            ].map((part) => Object.assign(part, {
                start: formulaStarts[part.key] ||
                    (part.key.indexOf("preferredReward") === 0 ?
                        formulaStarts.preferredReward :
                        formulaStarts.rejectedReward),
                enterDuration: 0.7,
                enterFrom: {x: 0, y: 18}
            })),
            x: s.width / 2 + 60,
            y: s.height / 2 - 50,
            mode: 1,
            font_size: 36,
            color: "#ffffff"
        });
        preferenceText = new TextFade(s, {
            str: "P(human prefers " + preferenceName + ")",
            x: s.width / 2 - 26,
            y: s.height / 2 + 33,
            mode: 4,
            size: 32,
            font: monoFont,
            start: frames(8)
        });
        differenceEquation = new SigmoidDifferenceEquation(s, {
            value: 0,
            x: s.width / 2 - 15,
            y: s.height / 2 + 35,
            mode: 3,
            font_size: 34,
            color: "#ffffff",
            start: frames(8)
        });

        promptLabel = new TextFade(s, {
            str: "Prompt:", x: labelX, y: textY, mode: 4,
            size: textSize, font: font, color: [77, 177, 255],
            start: frames(10)
        });
        preferredLabel = new TextFade(s, {
            str: "A:", x: labelX, y: textY + 75, mode: 4,
            size: textSize, font: font, color: [77, 217, 153],
            start: frames(11)
        });
        rejectedLabel = new TextFade(s, {
            str: "B:", x: labelX, y: textY + 150, mode: 4,
            size: textSize, font: font, color: [255, 112, 128],
            start: frames(12)
        });
        prompt = new TextFade(s, {
            str: '"How can I improve my sleep?"',
            x: responseTextX,
            y: textY,
            mode: 3,
            size: textSize,
            font: font,
            color: [77, 177, 255],
            start: frames(10)
        });
        winner = new TextFade(s, {
            str: '"Keep the same wake time daily."',
            x: responseTextX,
            y: textY + 75,
            mode: 3,
            size: textSize,
            font: font,
            color:  [77, 217, 153],
            start: frames(11)
        });
        loser = new TextFade(s, {
            str: '"Sleep whenever you feel tired."',
            x: responseTextX,
            y: textY + 150,
            mode: 3,
            size: textSize,
            font: font,
            color: [255, 112, 128],
            start: frames(12),
            end: frames(24),
            duration: 0.7
        });
        replacementLoser = new TextWriteIn(s, {
            str: '"Wake up at a consistent time."',
            x: responseTextX,
            y: textY + 150,
            mode: 3,
            size: textSize,
            font: font,
            color: [255, 112, 128],
            start: frames(25)
        });
        winnerReward = new RewardEquation(s, {
            expression: "r(x, " + preferredSymbol + ") = ",
            value: initialReward,
            x: textX + 765,
            y: textY + 75,
            mode: 3,
            font_size: 32,
            valueScale: 0.7,
            valueOffset: 210,
            color: "#4dd999",
            start: frames(11)
        });
        loserReward = new RewardEquation(s, {
            expression: "r(x, " + rejectedSymbol + ") = ",
            value: initialReward,
            x: textX + 765,
            y: textY + 150,
            mode: 3,
            font_size: 32,
            valueScale: 0.7,
            valueOffset: 205,
            color: "#ff7080",
            start: frames(12)
        });
        sigmoidPoint = new SigmoidPointTracker(s, {
            axes: sigmoid,
            start: frames(13),
            moveStart: frames(14.3),
            moveDuration: 3,
            maxX: 4.5
        });

        winnerAnnotation = new TextFade(s, {
            str: "Winner", x: labelX - 124, y: textY + 75, mode: 4,
            size: 31, font: font, color: [77, 217, 153],
            start: frames(20), end: frames(22)
        });
        winnerSymbol = new Katex(s, {
            text: "y_w", x: labelX - 64, y: textY + 75, mode: 4,
            font_size: 32, color: "#4dd999",
            start: frames(20), end: frames(22)
        });
        loserAnnotation = new TextFade(s, {
            str: "Loser", x: labelX - 124, y: textY + 150, mode: 4,
            size: 31, font: font, color: [255, 112, 128],
            start: frames(20), end: frames(22)
        });
        loserSymbol = new Katex(s, {
            text: "y_l", x: labelX - 64, y: textY + 150, mode: 4,
            font_size: 32, color: "#ff7080",
            start: frames(20), end: frames(22)
        });

        s.textFont(font);
        s.textSize(textSize);
        const quoteWidth = s.textWidth('"');
        const firstUnderlineX = responseTextX + quoteWidth;
        const secondUnderlineX = responseTextX + quoteWidth;
        firstUnderline = new UnderlineSweep(s, {
            x1: firstUnderlineX,
            x2: firstUnderlineX +
                s.textWidth("Keep the same wake time daily."),
            y: textY + 75 + 27,
            start: frames(30),
            duration: 1
        });
        secondUnderline = new UnderlineSweep(s, {
            x1: secondUnderlineX,
            x2: secondUnderlineX +
                s.textWidth("Wake up at a consistent time."),
            y: textY + 150 + 27,
            start: frames(33),
            duration: 1
        });
        realityNote = new TextFade(s, {
            str: "Note: In reality we don’t give all the labelers the same " +
                "prompt, since it’d be wasteful.",
            x: 60,
            y: 50,
            mode: 0,
            size: 29,
            font: italicFont,
            color: [190, 197, 207],
            start: frames(37),
            end: frames(39),
            duration: 0.7
        });
    };

    s.draw = function () {
        if (s.frameCount === frames(18))
            sigmoidPoint.valueLabel.jump(24, 0.6);
        if (s.frameCount === frames(25)) {
            rewardConvergenceStart = loserReward.value;
            rewardConvergenceTarget = winnerReward.value;
            rewardConvergenceTimer = new Timer2(frames(3));
            sigmoidPoint.moveToX(0, 3);
        }
        if (s.frameCount === frames(36))
            preferredLabel.jump(28, 0.6);
        if (s.frameCount === frames(38))
            rejectedLabel.jump(28, 0.6);

        sigmoid.show();
        const rewardDifference = sigmoidPoint.show();
        if (!rewardConvergenceTimer) {
            winnerReward.setValue(initialReward + rewardDifference);
            winnerReward.setScale(0.7 + 0.5 * rewardDifference / 4.5);
        } else {
            const convergence = rewardConvergenceTimer.advance();
            loserReward.setValue(rewardConvergenceStart + convergence *
                (rewardConvergenceTarget - rewardConvergenceStart));
            loserReward.setScale(0.7 + convergence *
                (winnerReward.valueScale - 0.7));
        }
        differenceEquation.setDifference(winnerReward.value - loserReward.value);
        paperReference.show();
        bradleyTerryFormula.show();
        preferenceText.show();
        differenceEquation.show();
        promptLabel.show();
        preferredLabel.show();
        rejectedLabel.show();
        prompt.show();
        winner.show();
        loser.show();
        replacementLoser.show();
        winnerReward.show();
        loserReward.show();
        winnerAnnotation.show();
        winnerSymbol.show();
        loserAnnotation.show();
        loserSymbol.show();
        firstUnderline.show();
        secondUnderline.show();
        realityNote.show();
    };
};

const DPOScene13 = function (s, args) {
    let font, monoFont, sigmoid;
    let bradleyTerryFormula, sigmoidPoint, differenceEquation;
    let preferencePrefix, preferenceA, preferenceWinner, preferenceClose;
    let promptLabel, preferredLabel, rejectedLabel, winnerLabel, loserLabel;
    let prompt, winner, replacementWinner, loser, winnerReward, loserReward;
    let selectionArrow;
    let questionBrain, questionText, questionFormula;
    const initialReward = 5.6;
    const textSize = 37, textX = 390, textY = 690;
    const responseTextX = textX + 80;
    const labelX = responseTextX - 18;
    const replacementDuration = 1.7;
    let preferencePrefixFinalX;
    const brainStartTime = frames(17);
    const thoughtContentStartTime = brainStartTime + frames(1.5);
    const thoughtEndTime = frames(20);

    const formulaParts = function (preferredSymbol, rejectedSymbol) {
        return [
            {key: "probabilityOpen", text: "P("},
            {key: "preferred", text: preferredSymbol, color: "#4dd999"},
            {key: "preference", text: "\\succ"},
            {key: "rejected", text: rejectedSymbol, color: "#ff7080"},
            {key: "condition", text: "\\mid x)"},
            {key: "equals", text: "="},
            {key: "sigmoidOpen", text: "\\sigma("},
            {key: "preferredRewardOpen", text: "r(x,", color: "#4dd999"},
            {key: "preferredRewardSymbol", text: preferredSymbol,
                color: "#4dd999"},
            {key: "preferredRewardClose", text: ")", color: "#4dd999"},
            {key: "minus", text: "-"},
            {key: "rejectedRewardOpen", text: "r(x,", color: "#ff7080"},
            {key: "rejectedRewardSymbol", text: rejectedSymbol,
                color: "#ff7080"},
            {key: "rejectedRewardClose", text: ")", color: "#ff7080"},
            {key: "close", text: ")"}
        ];
    };

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
        monoFont = s.loadFont("../../lib/font/CascadiaMono.ttf");
    };

    s.setup = function () {
        setup2D(s);
        sigmoid = new Sigmoid(s, {start: frames(1)});

        bradleyTerryFormula = new AnimatedKatex(s, {
            parts: formulaParts("A", "B").map((part) => Object.assign(part, {
                start: 0,
                enterDuration: 0,
                fadeIn: false
            })),
            x: s.width / 2 + 60,
            y: s.height / 2 - 50,
            mode: 1,
            font_size: 36,
            color: "#ffffff"
        });
        bradleyTerryFormula.transitionTo(
            formulaParts("y_w", "y_l"),
            {start: frames(9), duration: replacementDuration, offsetY: 24}
        );

        s.textFont(monoFont);
        s.textSize(32);
        const preferenceRight = s.width / 2 - 26;
        const preferenceY = s.height / 2 + 33;
        const prefixText = "P(human prefers ";
        const aWidth = s.textWidth("A");
        const winnerWidth = s.textWidth("winner");
        const closeWidth = s.textWidth(")");
        const preferenceCloseX = preferenceRight - closeWidth;
        const preferenceTermInitialX = preferenceCloseX - aWidth;
        const preferenceTermFinalX = preferenceCloseX - winnerWidth;
        preferencePrefixFinalX = preferenceTermFinalX;
        preferencePrefix = new TextFade(s, {
            str: prefixText, x: preferenceTermInitialX,
            y: preferenceY, mode: 4,
            size: 32, font: monoFont, start: frames(1)
        });
        preferenceA = new TextFade(s, {
            str: "A", x: preferenceCloseX, y: preferenceY, mode: 4,
            size: 32, font: monoFont, start: frames(1), end: frames(9),
            duration: replacementDuration
        });
        preferenceWinner = new TextFade(s, {
            str: "winner", x: preferenceCloseX,
            y: preferenceY - 24, mode: 4,
            size: 32, font: monoFont, start: frames(9),
            duration: replacementDuration
        });
        preferenceClose = new TextFade(s, {
            str: ")", x: preferenceCloseX, y: preferenceY, mode: 3,
            size: 32, font: monoFont, start: frames(1)
        });
        differenceEquation = new SigmoidDifferenceEquation(s, {
            value: 0,
            x: s.width / 2 - 15,
            y: s.height / 2 + 35,
            mode: 3,
            font_size: 34,
            color: "#ffffff",
            start: frames(1)
        });
        promptLabel = new TextFade(s, {
            str: "Prompt:", x: labelX, y: textY, mode: 4,
            size: textSize, font: font, color: [77, 177, 255],
            start: frames(1)
        });
        preferredLabel = new TextFade(s, {
            str: "A:", x: labelX, y: textY + 75, mode: 4,
            size: textSize, font: font, color: [77, 217, 153],
            start: frames(1), end: frames(9), duration: replacementDuration
        });
        rejectedLabel = new TextFade(s, {
            str: "B:", x: labelX, y: textY + 150, mode: 4,
            size: textSize, font: font, color: [255, 112, 128],
            start: frames(1), end: frames(9), duration: replacementDuration
        });
        winnerLabel = new TextFade(s, {
            str: "Winner:", x: labelX, y: textY + 75 - 24, mode: 4,
            size: textSize, font: font, color: [77, 217, 153],
            start: frames(9), duration: replacementDuration
        });
        loserLabel = new TextFade(s, {
            str: "Loser:", x: labelX, y: textY + 150 - 24, mode: 4,
            size: textSize, font: font, color: [255, 112, 128],
            start: frames(9), duration: replacementDuration
        });
        prompt = new TextFade(s, {
            str: '"How can I improve my sleep?"',
            x: responseTextX, y: textY, mode: 3, size: textSize, font: font,
            color: [77, 177, 255], start: frames(1)
        });
        winner = new TextFade(s, {
            str: '"Keep the same wake time daily."',
            x: responseTextX, y: textY + 75, mode: 3, size: textSize, font: font,
            color: [77, 217, 153], start: frames(1),
            end: frames(13), duration: 0.8
        });
        replacementWinner = new TextWriteIn(s, {
            str: '"Sleep whenever you feel tired."',
            x: responseTextX, y: textY + 75,
            mode: 3, size: textSize, font: font,
            color: [77, 217, 153], start: frames(13), duration: 0.8
        });
        loser = new TextFade(s, {
            str: '"Wake up at a consistent time."',
            x: responseTextX, y: textY + 150, mode: 3, size: textSize, font: font,
            color: [255, 112, 128], start: frames(1)
        });
        winnerReward = new RewardEquation(s, {
            expression: "r(x, y_w) = ", value: initialReward,
            x: textX + 765, y: textY + 75, mode: 3, font_size: 32,
            valueScale: 1.2, valueOffset: 210, color: "#4dd999",
            start: frames(1)
        });
        loserReward = new RewardEquation(s, {
            expression: "r(x, y_l) = ", value: initialReward,
            x: textX + 765, y: textY + 150, mode: 3, font_size: 32,
            valueScale: 1.2, valueOffset: 205, color: "#ff7080",
            start: frames(1)
        });
        sigmoidPoint = new SigmoidPointTracker(s, {
            axes: sigmoid,
            start: frames(1),
            moveStart: frames(1000),
            moveDuration: 3,
            maxX: 4.5
        });
        selectionArrow = new DPOFadingArrow(s, {
            x1: labelX - 105, y1: textY + 75,
            x2: labelX - 49, y2: textY + 75,
            start: frames(5), end: frames(7.7), fadeDuration: 1,
            duration: 0.7, strokeweight: 2, tipLen: 12
        });
        questionBrain = new ThoughtBrain(s, {
            x: 120, y: s.height - 340, size: 280,
            start: brainStartTime,
            end: thoughtEndTime,
            fadeOutDuration: 0.7,
            bubbleStart: brainStartTime + frames(0.5),
            bubbleOpacity: 255, bubbleFill: [14, 19, 27],
            font: font, str: ""
        });
        questionText = new TextFade(s, {
            str: "It's possible that", x: 470, y: 570, mode: 1, size: 34,
            font: font, start: thoughtContentStartTime, end: thoughtEndTime
        });
        questionFormula = new Katex(s, {
            text: "\\textcolor{#4dd999}{r(x, y_w)} < " +
                "\\textcolor{#ff7080}{r(x, y_l)}",
            x: 470, y: 625, mode: 1, font_size: 32,
            start: thoughtContentStartTime, end: thoughtEndTime
        });
    };

    s.draw = function () {
        if (s.frameCount === frames(13)) {
            winner.move(responseTextX, textY + 75 + 24, 0.8, 1);
            sigmoidPoint.moveToX(Math.log(0.1 / 0.9), 3);
        }
        if (s.frameCount === frames(9)) {
            preferredLabel.move(labelX, textY + 75 + 24,
                replacementDuration, 1);
            rejectedLabel.move(labelX, textY + 150 + 24,
                replacementDuration, 1);
            winnerLabel.move(labelX, textY + 75, replacementDuration, 1);
            loserLabel.move(labelX, textY + 150, replacementDuration, 1);
            preferenceA.move(preferenceA.x, preferenceA.y + 24,
                replacementDuration, 1);
            preferenceWinner.move(preferenceWinner.x, preferenceWinner.y + 24,
                replacementDuration, 1);
            preferencePrefix.move(preferencePrefixFinalX, preferencePrefix.y,
                replacementDuration, 1);
        }
        sigmoid.show();
        const rewardDifference = sigmoidPoint.show();
        winnerReward.setValue(initialReward + rewardDifference);
        winnerReward.setScale(1.2 + 0.5 * rewardDifference / 4.5);
        differenceEquation.setDifference(winnerReward.value - loserReward.value);
        bradleyTerryFormula.show();
        preferencePrefix.show();
        preferenceA.show();
        preferenceWinner.show();
        preferenceClose.show();
        differenceEquation.show();
        promptLabel.show();
        preferredLabel.show();
        rejectedLabel.show();
        winnerLabel.show();
        loserLabel.show();
        prompt.show();
        winner.show();
        replacementWinner.show();
        loser.show();
        winnerReward.show();
        loserReward.show();
        selectionArrow.show();
        questionBrain.show();
        questionText.show();
        questionFormula.show();
    };
};

class DPOFadingArrow {
    constructor(ctx, args) {
        this.s = ctx;
        Object.assign(this, args);
        this.durationFrames = frames(args.duration || 0.7);
        this.fadeFrames = frames(args.fadeDuration || 0.7);
    }

    show() {
        const frame = this.s.frameCount;
        if (frame < this.start || frame >= this.end + this.fadeFrames)
            return;
        const linearGrow = this.s.constrain(
            (frame - this.start) / this.durationFrames, 0, 1);
        const grow = 1 - Math.pow(1 - linearGrow, 3);
        const alpha = frame < this.end ? 255 : 255 * (1 -
            this.s.constrain((frame - this.end) / this.fadeFrames, 0, 1));
        const x = this.x1 + (this.x2 - this.x1) * grow;
        const y = this.y1 + (this.y2 - this.y1) * grow;
        const angle = Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
        const tip = this.tipLen || 12;
        this.s.push();
        this.s.stroke(255, alpha);
        this.s.strokeWeight(this.strokeweight || 2);
        this.s.strokeCap(this.s.ROUND);
        this.s.line(this.x1, this.y1, x, y);
        this.s.line(x, y,
            x - tip * grow * Math.cos(angle - 0.45),
            y - tip * grow * Math.sin(angle - 0.45));
        this.s.line(x, y,
            x - tip * grow * Math.cos(angle + 0.45),
            y - tip * grow * Math.sin(angle + 0.45));
        this.s.pop();
    }
}

class DPOBoundsHighlight {
    constructor(ctx, args) {
        this.s = ctx;
        this.bounds = args.bounds;
        this.start = args.start;
        this.end = args.end;
        this.durationFrames = frames(args.duration || 1);
        this.fadeFrames = frames(args.fadeDuration || 0.7);
        this.padding = args.padding === undefined ? 7 : args.padding;
    }

    show() {
        const frame = this.s.frameCount;
        if (frame < this.start || frame >= this.end + this.fadeFrames)
            return;
        const bounds = this.bounds();
        if (!bounds)
            return;
        const x = bounds.x - this.padding;
        const y = bounds.y - this.padding;
        const w = bounds.width + this.padding * 2;
        const h = bounds.height + this.padding * 2;
        const linearProgress = this.s.constrain(
            (frame - this.start) / this.durationFrames, 0, 1);
        const progress = 1 - Math.pow(1 - linearProgress, 3);
        const alpha = frame < this.end ? 255 : 255 * (1 -
            this.s.constrain((frame - this.end) / this.fadeFrames, 0, 1));
        let remaining = (w + h) * 2 * progress;
        const sides = [[x, y, x + w, y, w], [x + w, y, x + w, y + h, h],
            [x + w, y + h, x, y + h, w], [x, y + h, x, y, h]];
        this.s.push();
        this.s.noFill();
        this.s.stroke(249, 201, 17, alpha);
        this.s.strokeWeight(2);
        for (const side of sides) {
            if (remaining <= 0)
                break;
            const t = this.s.constrain(remaining / side[4], 0, 1);
            this.s.line(side[0], side[1],
                side[0] + (side[2] - side[0]) * t,
                side[1] + (side[3] - side[1]) * t);
            remaining -= side[4];
        }
        this.s.pop();
    }
}

const DPOScene15 = function (s, args) {
    let font, monoFont, sigmoid;
    let formula, point, preferenceText, differenceEquation;
    let promptLabel, winnerLabel, loserLabel, prompt, winner, loser;
    let winnerReward, loserReward, selectedText, selectedArrow;
    let absoluteHighlight, differenceHighlight;
    let modelTitle;
    const textSize = 37, textX = 390, textY = 690;
    const responseTextX = textX + 80;
    const labelX = responseTextX - 18;
    const targetX = Math.log(0.1 / 0.9);
    const winnerValue = 5.6 + targetX;
    const unionBounds = function (bounds) {
        const left = Math.min(...bounds.map((b) => b.x));
        const top = Math.min(...bounds.map((b) => b.y));
        const right = Math.max(...bounds.map((b) => b.x + b.width));
        const bottom = Math.max(...bounds.map((b) => b.y + b.height));
        return {x: left, y: top, width: right - left, height: bottom - top};
    };
    const katexBounds = function (object) {
        const rect = object.k.elt.getBoundingClientRect();
        const canvas = s.canvas.getBoundingClientRect();
        return {
            x: (rect.left - canvas.left) * s.width / canvas.width,
            y: (rect.top - canvas.top) * s.height / canvas.height,
            width: rect.width * s.width / canvas.width,
            height: rect.height * s.height / canvas.height
        };
    };
    const formulaParts = [
        {key: "probabilityOpen", text: "P("},
        {key: "preferred", text: "y_w", color: "#4dd999"},
        {key: "preference", text: "\\succ"},
        {key: "rejected", text: "y_l", color: "#ff7080"},
        {key: "condition", text: "\\mid x)"}, {key: "equals", text: "="},
        {key: "sigmoidOpen", text: "\\sigma("},
        {key: "preferredRewardOpen", text: "r(x,", color: "#4dd999"},
        {key: "preferredRewardSymbol", text: "y_w", color: "#4dd999"},
        {key: "preferredRewardClose", text: ")", color: "#4dd999"},
        {key: "minus", text: "-"},
        {key: "rejectedRewardOpen", text: "r(x,", color: "#ff7080"},
        {key: "rejectedRewardSymbol", text: "y_l", color: "#ff7080"},
        {key: "rejectedRewardClose", text: ")", color: "#ff7080"},
        {key: "close", text: ")"}
    ];

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
        monoFont = s.loadFont("../../lib/font/CascadiaMono.ttf");
    };

    s.setup = function () {
        setup2D(s);
        sigmoid = new Sigmoid(s, {start: 0, axesDuration: 0, curveStart: 0});
        formula = new AnimatedKatex(s, {
            parts: formulaParts.map((part) => Object.assign({}, part, {
                start: 0, enterDuration: 0, fadeIn: false
            })),
            x: s.width / 2 + 60, y: s.height / 2 - 50, mode: 1,
            font_size: 36, color: "#ffffff"
        });
        preferenceText = new TextFade(s, {
            str: "P(human prefers winner)", x: s.width / 2 - 26,
            y: s.height / 2 + 33, mode: 4, size: 32, font: monoFont, start: 0
        });
        differenceEquation = new SigmoidDifferenceEquation(s, {
            value: targetX, x: s.width / 2 - 15, y: s.height / 2 + 35,
            mode: 3, font_size: 34, color: "#ffffff", start: 0
        });
        promptLabel = new TextFade(s, {
            str: "Prompt:", x: labelX, y: textY, mode: 4, size: textSize,
            font: font, color: [77, 177, 255], start: 0
        });
        winnerLabel = new TextFade(s, {
            str: "Winner:", x: labelX, y: textY + 75, mode: 4,
            size: textSize, font: font, color: [77, 217, 153], start: 0
        });
        loserLabel = new TextFade(s, {
            str: "Loser:", x: labelX, y: textY + 150, mode: 4,
            size: textSize, font: font, color: [255, 112, 128], start: 0
        });
        prompt = new TextFade(s, {
            str: '"How can I improve my sleep?"', x: responseTextX, y: textY,
            mode: 3, size: textSize, font: font, color: [77, 177, 255], start: 0
        });
        winner = new TextFade(s, {
            str: '"Sleep whenever you feel tired."', x: responseTextX,
            y: textY + 75, mode: 3, size: textSize, font: font,
            color: [77, 217, 153], start: 0
        });
        loser = new TextFade(s, {
            str: '"Wake up at a consistent time."', x: responseTextX,
            y: textY + 150, mode: 3, size: textSize, font: font,
            color: [255, 112, 128], start: 0
        });
        winnerReward = new RewardEquation(s, {
            expression: "r(x, y_w) = ", value: winnerValue,
            x: textX + 765, y: textY + 75, mode: 3, font_size: 32,
            valueScale: 1.2 + 0.5 * targetX / 4.5,
            valueOffset: 210, color: "#4dd999", start: 0
        });
        loserReward = new RewardEquation(s, {
            expression: "r(x, y_l) = ", value: 5.6,
            x: textX + 765, y: textY + 150, mode: 3, font_size: 32,
            valueScale: 1.2, valueOffset: 205, color: "#ff7080", start: 0
        });
        point = new SigmoidPointTracker(s, {
            axes: sigmoid, start: 0, moveStart: frames(1000),
            moveDuration: 3, maxX: 4.5
        });
        point.modelX = targetX;
        point.baseMotionDisabled = true;
        selectedText = new TextFade(s, {
            str: "Selected\nby the\nlabeler", x: labelX - 230,
            y: textY + 75, mode: 1, size: 27, font: font,
            color: [255, 255, 255], start: frames(3), end: frames(5)
        });
        selectedArrow = new DPOFadingArrow(s, {
            x1: labelX - 170, y1: textY + 75, x2: labelX - 138,
            y2: textY + 75, start: frames(3), end: frames(5),
            duration: 0.7, fadeDuration: 0.7, strokeweight: 2, tipLen: 11
        });
        absoluteHighlight = new DPOBoundsHighlight(s, {
            bounds: () => unionBounds([
                katexBounds(winnerReward.number),
                katexBounds(loserReward.number)
            ]), start: frames(10), end: frames(12), duration: 1, padding: 7
        });
        differenceHighlight = new DPOBoundsHighlight(s, {
            bounds: () => unionBounds(["preferredRewardOpen",
                "preferredRewardSymbol", "preferredRewardClose", "minus",
                "rejectedRewardOpen", "rejectedRewardSymbol",
                "rejectedRewardClose"].map((key) => formula.getPartBounds(key))),
            start: frames(14), end: frames(16), duration: 1, padding: 7
        });
        modelTitle = new TextWriteIn(s, {
            str: "Bradley-Terry model", x: 240, y: 120, mode: 0,
            size: 52, font: font, color: [255, 255, 255],
            start: frames(17.7)
        });
    };

    s.draw = function () {
        if (s.frameCount === frames(8)) {
            promptLabel.jump(28, 0.6);
            prompt.jump(28, 0.6);
        }
        sigmoid.show();
        point.show();
        formula.show();
        preferenceText.show();
        differenceEquation.show();
        promptLabel.show(); winnerLabel.show(); loserLabel.show();
        prompt.show(); winner.show(); loser.show();
        winnerReward.show(); loserReward.show();
        selectedText.show(); selectedArrow.show();
        absoluteHighlight.show(); differenceHighlight.show();
        modelTitle.show();
    };
};

let dpo2 = new p5(DPOScene15);
