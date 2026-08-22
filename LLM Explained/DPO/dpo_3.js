const TRAINABLE_NETWORK_ARGS = {
    layers: [9, 14, 14, 9],
    neuronDistanceY: 40,
    layerDistanceX: 159,
    radius: 30,
    seed: 20260809,
    duration: 2
};

function createTrainableModel(s, font, timing) {
    const x = s.width * 3 / 4 - 79;
    const network = new NeuralNetwork(s, Object.assign({}, TRAINABLE_NETWORK_ARGS, {
        x: x,
        y: timing.networkY,
        start: timing.networkStart
    }));
    const backpropagation = animateBackpropagation(s, {
        network: network,
        start: timing.backpropagationStart,
        seed: TRAINABLE_NETWORK_ARGS.seed
    });
    const title = timing.showTitle === false ? null : new TextWriteIn(s, {
        str: "Trainable model",
        x: x,
        y: 130,
        mode: 1,
        size: 42,
        color: [217, 222, 229],
        start: timing.titleStart,
        font: font
    });
    return {network: network, backpropagation: backpropagation, title: title};
}

function showTrainableModel(model) {
    model.network.showEdges();
    model.backpropagation.show();
    model.network.showNeurons();
    if (model.title)
        model.title.show();
}

const DPOScene27 = function (s) {
    const scene25Position = {x: 1000, y: 745};
    const expressionColor = "#4dd999";
    const moveStart = frames(1.5);
    const moveDuration = 0.8;
    const highlightStart = frames(2.5);
    const highlightEnd = frames(4);
    const policyFadeStart = frames(7);
    const jumpStart = frames(9);
    const jumpInterval = frames(1);
    const jumpHeight = 24;
    const jumpDuration = 0.45;
    const jumpKeys = ["pi", "theta", "winner", "prompt"];
    const returnStart = frames(18);
    let font, italicFont, expression, scene25Guide, policy, bottomNote, weightsNote;
    let alignedToScene25 = false, moveStarted = false;
    let returnStarted = false, alignedStartX;
    let policyFadeStarted = false;
    let jumpStarted = [false, false, false, false];

    class ResizableAnimatedKatex extends AnimatedKatex {
        move(x, y, duration, timerNum, size) {
            super.move(x, y, duration, timerNum);
            this.startSize = this.size;
            this.targetSize = size === undefined ? this.size : size;
        }

        moving() {
            super.moving();
            this.size = this.startSize +
                this.move_timer.t * (this.targetSize - this.startSize);
        }
    }

    class PiHighlight {
        constructor() {
            this.durationFrames = frames(0.8);
            this.fadeFrames = frames(0.7);
            this.padding = 7;
        }

        show() {
            const frame = s.frameCount;
            if (frame < highlightStart ||
                frame >= highlightEnd + this.fadeFrames)
                return;
            const bounds = expression.getPartBounds("pi");
            const x = bounds.x - this.padding;
            const y = bounds.y - this.padding;
            const w = bounds.width + this.padding * 2 - 5;
            const h = bounds.height + this.padding * 2;
            const linearProgress = s.constrain(
                (frame - highlightStart) / this.durationFrames, 0, 1
            );
            const progress = 1 - Math.pow(1 - linearProgress, 3);
            const alpha = frame < highlightEnd ? 255 : 255 * (1 -
                s.constrain((frame - highlightEnd) / this.fadeFrames, 0, 1));
            let remaining = (w + h) * 2 * progress;
            const sides = [
                [x, y, x + w, y, w],
                [x + w, y, x + w, y + h, h],
                [x + w, y + h, x, y + h, w],
                [x, y + h, x, y, h]
            ];
            s.push();
            s.noFill();
            s.stroke(249, 201, 17, alpha);
            s.strokeWeight(2);
            for (const side of sides) {
                if (remaining <= 0)
                    break;
                const t = s.constrain(remaining / side[4], 0, 1);
                s.line(side[0], side[1],
                    side[0] + (side[2] - side[0]) * t,
                    side[1] + (side[3] - side[1]) * t);
                remaining -= side[4];
            }
            s.pop();
        }
    }

    let piHighlight;

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
        italicFont = s.loadFont("../../lib/font/timesi.ttf");
    };

    s.setup = function () {
        setup2D(s);

        expression = new ResizableAnimatedKatex(s, {
            x: scene25Position.x,
            y: scene25Position.y,
            mode: 0,
            font_size: 40,
            color: expressionColor,
            parts: [
                {key: "pi", text: "\\pi"},
                {key: "theta", text: "_{\\theta}"},
                {key: "open_parenthesis", text: "("},
                {key: "winner", text: "y_w"},
                {key: "condition_bar", text: "\\mid"},
                {key: "prompt", text: "x"},
                {key: "close_parenthesis", text: ")"}
            ].map(function (part) {
                return Object.assign(part, {
                    start: 0,
                    enterDuration: 0,
                    fadeIn: false
                });
            })
        });

        // Scene 25's x-coordinate belongs to "log", not pi. Keep an invisible
        // copy of that expression solely to recover pi's exact rendered offset.
        scene25Guide = new Katex(s, {
            text: "\\log \\pi_{\\theta}(y_w\\mid x)=-2.04",
            x: scene25Position.x,
            y: scene25Position.y,
            mode: 0,
            font_size: 40,
            color: expressionColor
        });
        scene25Guide.k.style("visibility", "hidden");

        piHighlight = new PiHighlight();
        policy = new TextWriteIn(s, {
            str: "policy",
            x: s.width / 2 - 159,
            y: s.height / 2 - 132,
            mode: 0,
            size: 47,
            color: [217, 222, 229],
            start: frames(5),
            font: font
        });
        weightsNote = new TextFade(s, {
            str: "θ denotes model weights.",
            x: s.width / 2,
            y: s.height - 390,
            mode: 1,
            size: 30,
            color: [197, 192, 190],
            start: frames(10),
            end: frames(10.6),
            duration: 0.4,
            font: italicFont
        });
        bottomNote = new TextFade(s, {
            str: "For the curious: To be more precise, the policy is the model’s entire probability distribution " +
                "over all the infinite possible sequences of responses it could produce. If you think of " +
                "pi_θ(y | x) as a function of the prompt and model weights, then plugging in y = y_w " +
                "gives us a scalar resulting from evaluating that function on y_w.",
            x: s.width / 2,
            y: s.height - 290,
            mode: 1,
            size: 30,
            width: 819,
            color: [197, 192, 190],
            start: frames(14),
            end: frames(16.5),
            duration: 0.7,
            font: italicFont
        });
    };

    s.draw = function () {
        scene25Guide.show();

        for (let i = 0; i < jumpKeys.length; i++) {
            if (!jumpStarted[i] &&
                s.frameCount >= jumpStart + i * jumpInterval) {
                expression.jumpPart(jumpKeys[i], jumpHeight, jumpDuration);
                jumpStarted[i] = true;
            }
        }
        expression.show();

        if (!alignedToScene25) {
            const guidePi = scene25Guide.k.elt.querySelector(
                ".mord.mathnormal"
            ).getBoundingClientRect();
            const expressionPi = expression.partStates.pi.element
                .getBoundingClientRect();
            const canvasBounds = s.canvas.getBoundingClientRect();
            expression.x += (guidePi.left - expressionPi.left) *
                s.width / canvasBounds.width;
            alignedStartX = expression.x;
            alignedToScene25 = true;
            expression.show();
        }

        if (alignedToScene25 && !moveStarted && s.frameCount >= moveStart) {
            const bounds = expression.k.elt.getBoundingClientRect();
            const canvasBounds = s.canvas.getBoundingClientRect();
            const targetScale = 54 / expression.size;
            expression.move(
                s.width / 2 - bounds.width * targetScale * s.width /
                    canvasBounds.width / 2,
                s.height / 2 - bounds.height * targetScale * s.height /
                    canvasBounds.height / 2,
                moveDuration,
                2,
                54
            );
            moveStarted = true;
        }

        if (moveStarted && !returnStarted && s.frameCount >= returnStart) {
            expression.move(
                alignedStartX,
                scene25Position.y,
                moveDuration,
                2,
                40
            );
            returnStarted = true;
        }

        piHighlight.show();
        if (!policyFadeStarted && s.frameCount >= policyFadeStart) {
            policy.ft.fadeOut(0.7);
            policyFadeStarted = true;
        }
        policy.show();
        bottomNote.show();
        weightsNote.show();
    };
};

const DPOScene31 = function (s) {
    const moveStart = frames(1.5);
    const moveDuration = 1;
    const referenceStart = moveStart + frames(moveDuration);
    const boxWidth = 330;
    const boxHeight = 220;
    const boxGap = 110;
    let font;
    let promptBox, trainableBox;
    let trainableBrain, referenceBrain;
    let trainableLabel, referenceLabel;
    let trainablePolicy, referencePolicy;
    let moveStarted = false;

    class MorphingRect {
        constructor(args) {
            this.x = args.x;
            this.y = args.y;
            this.w = args.w;
            this.h = args.h;
            this.motion = undefined;
        }

        move(x, y, w, h, duration) {
            this.motion = {
                fromX: this.x,
                fromY: this.y,
                fromW: this.w,
                fromH: this.h,
                x: x,
                y: y,
                w: w,
                h: h,
                timer: new Timer2(frames(duration))
            };
        }

        show() {
            if (this.motion) {
                const t = this.motion.timer.advance();
                this.x = this.motion.fromX +
                    (this.motion.x - this.motion.fromX) * t;
                this.y = this.motion.fromY +
                    (this.motion.y - this.motion.fromY) * t;
                this.w = this.motion.fromW +
                    (this.motion.w - this.motion.fromW) * t;
                this.h = this.motion.fromH +
                    (this.motion.h - this.motion.fromH) * t;
                if (t >= 1)
                    this.motion = undefined;
            }
            s.push();
            s.noFill();
            s.stroke(255);
            s.strokeWeight(2);
            s.rect(this.x, this.y, this.w, this.h);
            s.pop();
        }
    }

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);
        // Exact scene-25 prompt/model box geometry, with all other scene-25
        // elements deliberately omitted.
        promptBox = new MorphingRect({x: 130, y: 229, w: 790, h: 220});
        trainableBox = new MorphingRect({x: 1030, y: 229, w: 330, h: 220});

        trainableBrain = new BrainBase(s, {start: -1, duration: frames(1.5)});
        // Render the inherited trainable brain fully formed from frame one.
        trainableBrain.frCount = trainableBrain.duration + 1;
        trainableLabel = new Text(s, {
            str: "trainable\nmodel",
            x: 1280,
            y: 399,
            mode: 1,
            size: 27,
            color: [235, 241, 250],
            start: 0,
            font: font
        });

        referenceBrain = new BrainBase(s, {
            start: referenceStart,
            duration: frames(1)
        });
        referenceLabel = new TextWriteIn(s, {
            str: "reference\nmodel",
            x: 0,
            y: 0,
            mode: 1,
            size: 27,
            color: [235, 241, 250],
            start: referenceStart,
            charactersPerSecond: 22,
            font: font
        });
        trainablePolicy = new Katex(s, {
            text: "\\pi_{\\theta}",
            x: 0,
            y: 0,
            mode: 1,
            font_size: 42,
            color: "#ebf1fa"
        });
        referencePolicy = new Katex(s, {
            text: "\\pi_{\\mathrm{ref}}",
            x: 0,
            y: 0,
            mode: 1,
            font_size: 42,
            color: "#ebf1fa",
            start: referenceStart,
            fadeIn: true,
            entryDuration: 0.7
        });
    };

    s.draw = function () {
        if (!moveStarted && s.frameCount >= moveStart) {
            const pairLeft = (s.width - boxWidth * 2 - boxGap) / 2;
            const targetY = (s.height - boxHeight) / 2;
            promptBox.move(
                pairLeft, targetY, boxWidth, boxHeight, moveDuration
            );
            trainableBox.move(
                pairLeft + boxWidth + boxGap,
                targetY,
                boxWidth,
                boxHeight,
                moveDuration
            );
            moveStarted = true;
        }

        promptBox.show();
        trainableBox.show();

        trainableBrain.showAt(
            trainableBox.x + 40, trainableBox.y + 20, 420
        );
        trainableLabel.x = trainableBox.x + 250;
        trainableLabel.y = trainableBox.y + 170;
        trainableLabel.show();
        trainablePolicy.show(
            trainableBox.x + trainableBox.w / 2,
            trainableBox.y - 55
        );

        referenceBrain.showAt(promptBox.x + 40, promptBox.y + 20, 420);
        referenceLabel.x = promptBox.x + 250;
        referenceLabel.y = promptBox.y + 170;
        referenceLabel.show();
        referencePolicy.show(
            promptBox.x + promptBox.w / 2,
            promptBox.y - 55
        );
    };
};

const DPOScene32 = function (s) {
    let font;
    let referenceNetwork, trainableModel;
    let referencePolicy, trainablePolicy, referenceTitle, referenceSubtitle;
    let referenceNetworkStartTime = frames(2);
    let referenceTitleStartTime = frames(1);
    let trainableNetworkStartTime = frames(6);
    let trainableTitleStartTime = frames(5);
    let referenceSubtitleStartTime = frames(5);
    let trainableBackpropagationStartTime = frames(8);

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);
        referencePolicy = new Katex(s, {
            text: "\\pi_{\\mathrm{ref}}",
            x: 320,
            y: 129,
            mode: 1,
            font_size: 42,
            color: "#ebf1fa"
        });
        trainablePolicy = new Katex(s, {
            text: "\\pi_{\\theta}",
            x: 1122,
            y: 129,
            mode: 1,
            font_size: 42,
            color: "#ebf1fa",
            start: trainableTitleStartTime
        });
        referenceNetwork = new NeuralNetwork(s, Object.assign({}, TRAINABLE_NETWORK_ARGS, {
            x: s.width / 4 + 79,
            start: referenceNetworkStartTime
        }));
        trainableModel = createTrainableModel(s, font, {
            networkStart: trainableNetworkStartTime,
            titleStart: trainableTitleStartTime,
            backpropagationStart: trainableBackpropagationStartTime
        });
        referenceTitle = new TextWriteIn(s, {
            str: "Reference model",
            x: s.width / 4 + 79,
            y: 130,
            mode: 1,
            size: 42,
            color: [217, 222, 229],
            start: referenceTitleStartTime,
            font: font
        });
        referenceSubtitle = new TextFade(s, {
            str: "(weights frozen)",
            x: s.width / 4 + 79,
            y: 185,
            mode: 1,
            size: 30,
            color: [147, 152, 160],
            start: referenceSubtitleStartTime,
            font: font
        });
    };

    s.draw = function () {
        referencePolicy.show();
        trainablePolicy.show();
        referenceNetwork.show();
        showTrainableModel(trainableModel);
        referenceTitle.show();
        referenceSubtitle.show();
    };
};

const DPOScene02 = function (s) {
    let font, emojiFont;
    let trainableModel, questioningBrain, responseA, preferenceSign, responseB, preferenceArrow;
    let brainStartTime = frames(1);
    let questionMarkStartTime = frames(2);
    let trainableNetworkStartTime = frames(5);
    let trainableBackpropagationStartTime = frames(7.8);

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
        emojiFont = s.loadFont("../../lib/font/emoji.ttf");
    };

    s.setup = function () {
        setup2D(s);
        trainableModel = createTrainableModel(s, font, {
            networkStart: trainableNetworkStartTime,
            backpropagationStart: trainableBackpropagationStartTime,
            networkY: s.height / 2 + 50,
            showTitle: false
        });
        responseA = new TextFade(s, {
            str: "Response A",
            x: 1230,
            y: 150,
            mode: 1,
            size: 42,
            color: [77, 217, 153],
            start: frames(5),
            duration: 0.25,
            font: font
        });
        preferenceSign = new TextFade(s, {
            str: ">",
            x: 1361,
            y: 150,
            mode: 1,
            size: 42,
            color: [217, 222, 229],
            start: frames(5.3),
            duration: 0.25,
            font: font
        });
        responseB = new TextFade(s, {
            str: "Response B",
            x: 1492,
            y: 150,
            mode: 1,
            size: 42,
            color: [255, 112, 128],
            start: frames(5.6),
            duration: 0.25,
            font: font
        });
        preferenceArrow = new Arrow(s, {
            x1: 1361,
            y1: 209,
            x2: 1361,
            y2: 265,
            start: frames(7),
            duration: 0.35,
            strokeweight: 4,
            color: [217, 222, 229],
            tipLen: 14
        });
        questioningBrain = new ThoughtBrain(s, {
            x: 240,
            y: 640,
            size: 330,
            start: brainStartTime,
            bubbleStart: brainStartTime + frames(0.5),
            bubbleOpacity: 255,
            bubbleFill: [14, 19, 27],
            font: font,
            font_size: 37,
            str: "How to learn that humans\nprefer Response A?",
            emoji: emojiFont,
            question: true,
            qStart: questionMarkStartTime,
            qEnd: trainableBackpropagationStartTime
        });
    };

    s.draw = function () {
        s.push();
        questioningBrain.show();
        s.pop();
        responseA.show();
        preferenceSign.show();
        responseB.show();
        preferenceArrow.show();
        showTrainableModel(trainableModel);
    };
};

const DPOScene44 = function (s) {
    let font;
    let title, subtitle, preferenceDataTitle, preferenceEllipsis, rewardModelTitle, rewardModel, rewardText;
    let rewardScoreArrow;
    let rewardModelBackpropagation, llmTitle, llmNetwork, llmBackpropagation, crossoutLine;
    let actsLikeArrow, actsLikeText;
    let preferenceTriplets = [];
    let titleStartTime = frames(3);
    let subtitleStartTime = frames(6);
    let preferenceDataTitleStartTime = frames(1);
    let rewardModelTitleStartTime = frames(7.5);
    let firstTripletStartTime = frames(1.5);
    let preferenceEllipsisStartTime = frames(2.4);
    let rewardModelStartTime = frames(7.5);
    let rewardModelBackpropagationStartTime = frames(9);
    let llmStartTime = frames(11);
    let llmBackpropagationStartTime = frames(12.5);
    let rewardTextStartTime = frames(16.5);
    let rewardModelCrossoutStartTime = frames(21.7);
    let tripletStagger = frames(0.2);
    let tripletEntryDuration = 0.4;

    class FallingTriplet {
        constructor(index, x, y, start) {
            this.start = start;
            this.targetY = y;
            this.started = false;
            this.triplet = new Katex(s, {
                text: "(\\textcolor{#4db1ff}{x_" + index + "},\\;" +
                    "\\textcolor{#4dd999}{y_{w_" + index + "}},\\;" +
                    "\\textcolor{#ff7080}{y_{l_" + index + "}})",
                x: x,
                y: y - 45,
                mode: 1,
                font_size: 39,
                color: "#edf2f7",
                start: start,
                fadeIn: true,
                entryDuration: tripletEntryDuration
            });
        }

        show() {
            if (!this.started && s.frameCount >= this.start) {
                this.triplet.move(this.triplet.x, this.targetY, tripletEntryDuration, 1);
                this.started = true;
            }
            this.triplet.show();
        }
    }

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);
        s.textFont(font);
        const centeredWriteInX = function (str, size, centerX) {
            s.textSize(size);
            return centerX - s.textWidth(str) / 2;
        };
        const titleX = centeredWriteInX(
            "Reinforcement Learning from Human Feedback (RLHF)", 48, s.width / 2
        );
        const preferenceDataTitleX = centeredWriteInX("Preference Data", 42, 450);
        const rewardModelTitleX = centeredWriteInX("Reward Model", 42, s.width / 2);
        title = new TextWriteIn(s, {
            str: "Reinforcement Learning from Human Feedback (RLHF)",
            x: titleX,
            y: 85,
            mode: 0,
            size: 48,
            color: [235, 241, 250],
            start: titleStartTime,
            font: font,
            charactersPerSecond: 45
        });
        subtitle = new TextFade(s, {
            str: "(massively simplified)",
            x: s.width / 2,
            y: 170,
            mode: 1,
            size: 30,
            color: [147, 152, 160],
            start: subtitleStartTime,
            duration: 0.6,
            font: font
        });
        preferenceDataTitle = new TextWriteIn(s, {
            str: "Preference Data",
            x: preferenceDataTitleX,
            y: 275,
            mode: 0,
            size: 42,
            color: [235, 241, 250],
            start: preferenceDataTitleStartTime,
            font: font
        });
        rewardModelTitle = new TextWriteIn(s, {
            str: "Reward Model",
            x: rewardModelTitleX,
            y: 275,
            mode: 0,
            size: 42,
            color: [235, 241, 250],
            start: rewardModelTitleStartTime,
            font: font
        });
        crossoutLine = new Line(s, {
            x1: rewardModelTitleX - 8,
            y1: 275 + 44,
            x2: rewardModelTitleX + s.textWidth("Reward Model") + 8,
            y2: 275,
            start: rewardModelCrossoutStartTime,
            end: frames(24),
            duration: 0.5,
            mode: 1,
            strokeweight: 4,
            color: Red
        });
        rewardModel = new NeuralNetwork(s, {
            layers: [9, 1],
            x: s.width / 2,
            y: 620,
            neuronDistanceY: 50,
            layerDistanceX: 220,
            radius: 30,
            seed: 20260807,
            start: rewardModelStartTime,
            duration: 1.2,
            edgeStrokeweightScale: 2,
            edgeAlpha: 255
        });
        rewardModelBackpropagation = animateBackpropagation(s, {
            network: rewardModel,
            start: rewardModelBackpropagationStartTime,
            seed: 20260809,
            strokeweight: 6,
            edgeAlpha: 255
        });
        rewardText = new TextFade(s, {
            str: "reward\nscore",
            x: s.width / 2 + 110,
            y: 559,
            mode: 1,
            size: 21,
            color: [244, 195, 10],
            start: rewardTextStartTime,
            end: frames(20),
            font: font
        });
        rewardScoreArrow = new Arrow(s, {
            x1: s.width / 2 + 160,
            y1: 575,
            x2: s.width / 2 + 160,
            y2: 545,
            start: frames(18.5),
            end: frames(20),
            duration: 0.3,
            strokeweight: 3,
            color: [244, 195, 10],
            tipLen: 10
        });
        llmNetwork = new NeuralNetwork(s, {
            layers: [7, 11, 11, 7],
            x: s.width * 3 / 4 + 60,
            y: 620,
            neuronDistanceY: 45,
            layerDistanceX: 130,
            radius: 30,
            seed: 20260810,
            start: llmStartTime,
            duration: 1.5
        });
        llmBackpropagation = animateBackpropagation(s, {
            network: llmNetwork,
            start: llmBackpropagationStartTime,
            seed: 20260810
        });
        llmTitle = new TextWriteIn(s, {
            str: "LLM",
            x: centeredWriteInX("LLM", 42, s.width * 3 / 4 + 60),
            y: 275,
            mode: 0,
            size: 42,
            color: [235, 241, 250],
            start: llmStartTime,
            font: font
        });
        actsLikeArrow = new Arrow(s, {
            x1: s.width * 3 / 4 - 67,
            y1: 300,
            x2: s.width / 2 + 135 + 67,
            y2: 300,
            start: frames(26),
            end: frames(30),
            duration: 0.6,
            strokeweight: 4,
            color: [255, 255, 255],
            tipLen: 14
        });
        actsLikeText = new TextFade(s, {
            str: "“acts like”",
            x: (s.width * 3 / 4 + s.width / 2 + 135) / 2,
            y: 267,
            mode: 1,
            size: 27,
            color: [255, 255, 255],
            start: frames(26),
            duration: 0.6,
            font: font
        });
        for (let index = 1; index <= 4; index++) {
            preferenceTriplets.push(new FallingTriplet(
                index,
                450,
                445 + (index - 1) * 84,
                firstTripletStartTime + (index - 1) * tripletStagger
            ));
        }
        preferenceEllipsis = new Katex(s, {
            text: "\\cdots",
            x: 450,
            y: 795,
            mode: 1,
            font_size: 45,
            color: "#edf2f7",
            start: preferenceEllipsisStartTime,
            fadeIn: true,
            entryDuration: 0.4
        });
    };

    s.draw = function () {
        title.show();
        subtitle.show();
        preferenceDataTitle.show();
        rewardModelTitle.show();
        crossoutLine.show();
        for (let triplet of preferenceTriplets)
            triplet.show();
        preferenceEllipsis.show();
        rewardModel.showEdges();
        rewardModelBackpropagation.show();
        rewardModel.showNeurons();
        rewardText.show();
        rewardScoreArrow.show();
        actsLikeArrow.show();
        actsLikeText.show();
        llmNetwork.showEdges();
        llmBackpropagation.show();
        llmNetwork.showNeurons();
        llmTitle.show();
    };
};

const DPOScene53 = function (s) {
    let monoFont;
    let network, networkBackpropagation, secondNetworkBackpropagation;
    let networkFeedforward, secondNetworkFeedforward;
    let networkFeedforwardEnd, secondNetworkFeedforwardEnd;
    let lossCode, optimizerCode, secondLossCode, secondOptimizerCode;
    let lossPanel, averageLoss, secondAverageLoss;
    let lossPanelBorders = [];
    let lossTerms = [];
    let secondLossTerms = [];
    let coalescingStarted = false;
    let secondCoalescingStarted = false;
    const networkStartTime = frames(0.5);
    const entryStartTime = frames(1);
    const feedforwardStartTime = frames(2);
    const coalesceStartTime = frames(4);
    const averageLossFadeTime = frames(6.5);
    const secondEntryStartTime = frames(7);
    const secondFeedforwardStartTime = frames(8);
    const secondCoalesceStartTime = frames(10);
    const feedforwardSpeedScale = 1.6;
    const coalesceDuration = 0.7;
    const panelX = 1050;
    const panelY = 280;
    const panelWidth = 680;
    const panelHeight = 580;

    s.preload = function () {
        monoFont = s.loadFont("../../lib/font/CascadiaMono.ttf");
    };

    s.setup = function () {
        setup2D(s);
        network = new NeuralNetwork(s, {
            layers: [7, 11, 11, 7],
            x: 520,
            y: 570,
            neuronDistanceY: 45,
            layerDistanceX: 130,
            radius: 30,
            seed: 20260810,
            start: networkStartTime,
            duration: 1.5
        });
        networkBackpropagation = animateBackpropagation(s, {
            network: network,
            start: coalesceStartTime,
            seed: 20260810
        });
        networkFeedforward = animateFeedforward(s, {
            network: network,
            start: feedforwardStartTime,
            activationDuration: 0.16 * feedforwardSpeedScale,
            edgeDuration: 1 / 3 * feedforwardSpeedScale,
            pauseDuration: 0.16 * feedforwardSpeedScale,
            positiveColor: [45, 225, 205],
            negativeColor: [255, 157, 47],
            strokeweight: 6
        });
        networkFeedforwardEnd = feedforwardStartTime +
            networkFeedforward.cycleFrames;
        secondNetworkBackpropagation = animateBackpropagation(s, {
            network: network,
            start: secondCoalesceStartTime,
            seed: 20260810
        });
        secondNetworkFeedforward = animateFeedforward(s, {
            network: network,
            start: secondFeedforwardStartTime,
            activationDuration: 0.16 * feedforwardSpeedScale,
            edgeDuration: 1 / 3 * feedforwardSpeedScale,
            pauseDuration: 0.16 * feedforwardSpeedScale,
            positiveColor: [45, 225, 205],
            negativeColor: [255, 157, 47],
            strokeweight: 6
        });
        secondNetworkFeedforwardEnd = secondFeedforwardStartTime +
            secondNetworkFeedforward.cycleFrames;

        lossPanel = new Rect(s, {
            x: panelX,
            y: panelY,
            w: panelWidth,
            h: panelHeight,
            start: entryStartTime,
            duration: 0.7,
            color: [20, 27, 38, 255]
        });
        lossPanelBorders = [
            new Line(s, {
                x1: panelX, y1: panelY,
                x2: panelX + panelWidth, y2: panelY,
                start: entryStartTime, duration: 0.7,
                strokeweight: 3, color: [235, 241, 250]
            }),
            new Line(s, {
                x1: panelX + panelWidth, y1: panelY,
                x2: panelX + panelWidth, y2: panelY + panelHeight,
                start: entryStartTime, duration: 0.7,
                strokeweight: 3, color: [235, 241, 250]
            }),
            new Line(s, {
                x1: panelX + panelWidth, y1: panelY + panelHeight,
                x2: panelX, y2: panelY + panelHeight,
                start: entryStartTime, duration: 0.7,
                strokeweight: 3, color: [235, 241, 250]
            }),
            new Line(s, {
                x1: panelX, y1: panelY + panelHeight,
                x2: panelX, y2: panelY,
                start: entryStartTime, duration: 0.7,
                strokeweight: 3, color: [235, 241, 250]
            })
        ];

        const lossCodeString = "optimizer.zero_grad()\nloss = dpo_loss(inputs, model, ref_model)";
        const lossCodeSize = 27;
        s.textFont(monoFont);
        s.textSize(lossCodeSize);
        lossCode = new TextWriteIn(s, {
            str: lossCodeString,
            x: panelX + panelWidth / 2 - s.textWidth(lossCodeString) / 2,
            y: 180 - lossCodeSize / 2,
            mode: 0,
            size: lossCodeSize,
            color: [235, 241, 250],
            start: entryStartTime,
            font: monoFont,
            charactersPerSecond: 36
        });
        optimizerCode = new TextWriteIn(s, {
            str: "loss.backward()\noptimizer.step()",
            x: lossCode.x,
            y: lossCode.y,
            mode: 0,
            size: lossCodeSize,
            lineHeight: lossCodeSize * 1.35,
            color: [235, 241, 250],
            start: coalesceStartTime,
            font: monoFont,
            charactersPerSecond: 30
        });
        secondLossCode = new TextWriteIn(s, {
            str: lossCodeString,
            x: lossCode.x,
            y: lossCode.y,
            mode: 0,
            size: lossCodeSize,
            color: [235, 241, 250],
            start: secondEntryStartTime,
            font: monoFont,
            charactersPerSecond: 36
        });
        secondOptimizerCode = new TextWriteIn(s, {
            str: "loss.backward()\noptimizer.step()",
            x: lossCode.x,
            y: lossCode.y,
            mode: 0,
            size: lossCodeSize,
            lineHeight: lossCodeSize * 1.35,
            color: [235, 241, 250],
            start: secondCoalesceStartTime,
            font: monoFont,
            charactersPerSecond: 30
        });

        for (let index = 1; index <= 4; index++) {
            lossTerms.push(new Katex(s, {
                text: "\\ell_{\\mathrm{DPO}}(" +
                    "\\textcolor{#4db1ff}{x_" + index + "},\\;" +
                    "\\textcolor{#4dd999}{y_{w_" + index + "}},\\;" +
                    "\\textcolor{#ff7080}{y_{l_" + index + "}})",
                x: panelX + panelWidth / 2,
                y: 385 + (index - 1) * 120,
                mode: 1,
                font_size: 43,
                color: "#edf2f7",
                start: entryStartTime + (index - 1) * frames(0.18),
                end: coalesceStartTime,
                fadeIn: true,
                entryDuration: 0.45
            }));
        }
        averageLoss = new Katex(s, {
            text: "\\begin{gathered}\\mathcal{L}_{\\mathrm{DPO}}=\\\\" +
                "\\sum_{i=1}^{4}" +
                "\\ell_{\\mathrm{DPO}}(" +
                "\\textcolor{#4db1ff}{x_i},\\;" +
                "\\textcolor{#4dd999}{y_{w_i}},\\;" +
                "\\textcolor{#ff7080}{y_{l_i}})\\end{gathered}",
            x: panelX + panelWidth / 2,
            y: panelY + panelHeight / 2,
            mode: 1,
            font_size: 47,
            color: "#edf2f7",
            start: coalesceStartTime,
            end: averageLossFadeTime,
            fadeIn: true,
            entryDuration: coalesceDuration
        });
        for (let index = 5; index <= 8; index++) {
            secondLossTerms.push(new Katex(s, {
                text: "\\ell_{\\mathrm{DPO}}(" +
                    "\\textcolor{#4db1ff}{x_" + index + "},\\;" +
                    "\\textcolor{#4dd999}{y_{w_" + index + "}},\\;" +
                    "\\textcolor{#ff7080}{y_{l_" + index + "}})",
                x: panelX + panelWidth / 2,
                y: 385 + (index - 5) * 120,
                mode: 1,
                font_size: 43,
                color: "#edf2f7",
                start: secondEntryStartTime +
                    (index - 5) * frames(0.18),
                end: secondCoalesceStartTime,
                fadeIn: true,
                entryDuration: 0.45
            }));
        }
        secondAverageLoss = new Katex(s, {
            text: "\\begin{gathered}\\mathcal{L}_{\\mathrm{DPO}}=\\\\" +
                "\\sum_{i=5}^{8}" +
                "\\ell_{\\mathrm{DPO}}(" +
                "\\textcolor{#4db1ff}{x_i},\\;" +
                "\\textcolor{#4dd999}{y_{w_i}},\\;" +
                "\\textcolor{#ff7080}{y_{l_i}})\\end{gathered}",
            x: panelX + panelWidth / 2,
            y: panelY + panelHeight / 2,
            mode: 1,
            font_size: 47,
            color: "#edf2f7",
            start: secondCoalesceStartTime,
            fadeIn: true,
            entryDuration: coalesceDuration
        });
    };

    s.draw = function () {
        if (!coalescingStarted && s.frameCount >= coalesceStartTime) {
            for (let lossTerm of lossTerms) {
                lossTerm.move(
                    panelX + panelWidth / 2,
                    panelY + panelHeight / 2,
                    coalesceDuration,
                    1
                );
            }
            coalescingStarted = true;
        }
        if (!secondCoalescingStarted &&
            s.frameCount >= secondCoalesceStartTime) {
            for (let lossTerm of secondLossTerms) {
                lossTerm.move(
                    panelX + panelWidth / 2,
                    panelY + panelHeight / 2,
                    coalesceDuration,
                    1
                );
            }
            secondCoalescingStarted = true;
        }
        network.showEdges();
        if (s.frameCount < secondEntryStartTime)
            networkBackpropagation.show();
        secondNetworkBackpropagation.show();
        network.showNeurons();
        if (s.frameCount >= feedforwardStartTime &&
            s.frameCount < networkFeedforwardEnd)
            networkFeedforward.show();
        if (s.frameCount >= secondFeedforwardStartTime &&
            s.frameCount < secondNetworkFeedforwardEnd)
            secondNetworkFeedforward.show();
        lossPanel.show();
        for (let border of lossPanelBorders)
            border.show();
        if (s.frameCount < coalesceStartTime)
            lossCode.show();
        if (s.frameCount < secondEntryStartTime)
            optimizerCode.show();
        if (s.frameCount < secondCoalesceStartTime)
            secondLossCode.show();
        secondOptimizerCode.show();
        for (let lossTerm of lossTerms)
            lossTerm.show();
        for (let lossTerm of secondLossTerms)
            lossTerm.show();
        averageLoss.show();
        secondAverageLoss.show();
    };
};

const DPOScene54 = function (s) {
    let font;
    let letters = [];
    const letterSize = 600;

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);
        s.textFont(font);
        s.textSize(letterSize);
        const characters = ["D", "P", "O"];
        const widths = characters.map(function (character) {
            return s.textWidth(character);
        });
        const totalWidth = widths.reduce(function (sum, width) {
            return sum + width;
        }, 0);
        let cursorX = (s.width - totalWidth) / 2;

        for (let index = 0; index < characters.length; index++) {
            letters.push(new Text(s, {
                str: characters[index],
                x: cursorX + widths[index] / 2,
                y: s.height / 2 - 70,
                mode: 1,
                size: letterSize,
                color: [255, 255, 255],
                start: frames(index + 1),
                font: font
            }));
            cursorX += widths[index];
        }
    };

    s.draw = function () {
        for (let letter of letters)
            letter.show();
    };
};

let dpo3 = new p5(DPOScene54);
