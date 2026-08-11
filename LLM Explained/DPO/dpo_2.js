const DPOScene08 = function(s, args) {
    let font, preferenceLabel, preferencePair, optimizeLabel;
    let optimizationArrow, modelOverlay, modelLabel;

    const preferenceStart = frames(0.5);
    const pairStart = frames(1);
    const arrowStart = frames(1.5);
    const optimizeStart = frames(2.2);
    const overlayStart = frames(3);

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
        s.background(8, 12, 22);
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
    let rewardStartTime = frames(1), variableStartTime = frames(2);

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
        s.background(8, 12, 22);
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
            start: this.start + frames(axesDuration),
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
    }

    update() {
        if (this.s.frameCount >= this.moveStart) {
            this.modelX = this.maxX * this.moveTimer.advance();
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

const DPOScene10 = function (s, args) {
    let font, monoFont, emojiFont, paperReference, sigmoid, bradleyTerryFormula, sigmoidPoint;
    let preferenceText, differenceEquation;
    let prompt, winner, loser, winnerReward, loserReward;
    let questionBrain, questionText, questionFormula;
    let initialReward = 1.1, textSize = 37, textX = 390, textY = 690;
    let referenceStartTime = frames(1), referenceEndTime = frames(4);
    let brainStartTime = frames(2);

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
        monoFont = s.loadFont("../../lib/font/CascadiaMono.ttf");
        emojiFont = s.loadFont("../../lib/font/emoji.ttf");
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
            start: frames(1)
        });
        bradleyTerryFormula = new Katex(s, {
            text: "P(y_w \\succ y_l \\mid x) = " +
                "\\sigma\\!\\left(" +
                "\\textcolor{#4dd999}{r(x, y_w)} - " +
                "\\textcolor{#ff7080}{r(x, y_l)}" +
                "\\right)",
            x: s.width / 2 + 60,
            y: s.height / 2 - 50,
            mode: 1,
            font_size: 36,
            start: frames(1)
        });
        preferenceText = new TextFade(s, {
            str: "P(human prefers winner)",
            x: s.width / 2 - 26,
            y: s.height / 2 + 33,
            mode: 4,
            size: 32,
            font: monoFont,
            start: frames(1)
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

        prompt = new TextFade(s, {
            str: 'Prompt: "How can I improve my sleep?"',
            x: textX,
            y: textY,
            mode: 3,
            size: textSize,
            font: font,
            color: [77, 177, 255],
            start: frames(1)
        });
        winner = new TextFade(s, {
            str: 'Winner: "Wake at the same time daily."',
            x: textX,
            y: textY + 75,
            mode: 3,
            size: textSize,
            font: font,
            color:  [77, 217, 153],
            start: frames(1)
        });
        loser = new TextFade(s, {
            str: 'Loser: "Sleep whenever you feel tired."',
            x: textX,
            y: textY + 150,
            mode: 3,
            size: textSize,
            font: font,
            color: [255, 112, 128],
            start: frames(1)
        });
        winnerReward = new RewardEquation(s, {
            expression: "r(x, y_w) = ",
            value: initialReward,
            x: textX + 765,
            y: textY + 75,
            mode: 3,
            font_size: 32,
            valueScale: 0.7,
            valueOffset: 210,
            color: "#4dd999",
            start: frames(1)
        });
        loserReward = new RewardEquation(s, {
            expression: "r(x, y_l) = ",
            value: initialReward,
            x: textX + 765,
            y: textY + 150,
            mode: 3,
            font_size: 32,
            valueScale: 0.7,
            valueOffset: 205,
            color: "#ff7080",
            start: frames(1)
        });
        sigmoidPoint = new SigmoidPointTracker(s, {
            axes: sigmoid,
            start: frames(4),
            moveStart: frames(5.5),
            moveDuration: 3,
            maxX: 4.5
        });
        questionBrain = new ThoughtBrain(s, {
            x: 120,
            y: s.height - 340,
            size: 280,
            start: brainStartTime,
            bubbleStart: brainStartTime + frames(0.5),
            bubbleOpacity: 255,
            bubbleFill: [14, 19, 27],
            font: font,
            str: "",
            emoji: emojiFont,
            question: true,
            qStart: brainStartTime,
            qEnd: brainStartTime + frames(6)
        });
        questionText = new TextFade(s, {
            str: "Why could",
            x: 470,
            y: 570,
            mode: 1,
            size: 34,
            font: font,
            start: brainStartTime
        });
        questionFormula = new Katex(s, {
            text: "\\textcolor{#4dd999}{r(x, y_w)} < " +
                "\\textcolor{#ff7080}{r(x, y_l)}?",
            x: 470,
            y: 625,
            mode: 1,
            font_size: 32,
            start: brainStartTime
        });
    };

    s.draw = function () {
        s.background(8, 12, 22);
        sigmoid.show();
        const rewardDifference = sigmoidPoint.show();
        winnerReward.setValue(initialReward + rewardDifference);
        winnerReward.setScale(0.7 + 0.5 * rewardDifference / 4.5);
        differenceEquation.setDifference(winnerReward.value - loserReward.value);
        paperReference.show();
        bradleyTerryFormula.show();
        preferenceText.show();
        differenceEquation.show();
        prompt.show();
        winner.show();
        loser.show();
        winnerReward.show();
        loserReward.show();
        questionBrain.show();
        questionText.show();
        questionFormula.show();
    };
};

let dpo2 = new p5(DPOScene09);
