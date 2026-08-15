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

const DPOScene31 = function (s) {
    const centerSize = 67;
    const cornerSize = 42;
    const swapToSFT = frames(2);
    const swapToReference = frames(4);
    const moveStart = frames(6);
    const animationDuration = 0.7;
    const moveDuration = 1;
    let initialReference, sftPolicy, finalReference;
    let policySymbolsAligned = false;

    class ResizableKatex extends Katex {
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

    s.setup = function () {
        setup2D(s);
        const sharedArgs = {
            x: s.width / 2,
            y: s.height / 2,
            mode: 1,
            font_size: centerSize,
            color: "#ebf1fa",
            entryDuration: animationDuration
        };
        initialReference = new Katex(s, Object.assign({}, sharedArgs, {
            text: "\\pi_{\\mathrm{ref}}",
            end: swapToSFT
        }));
        sftPolicy = new Katex(s, Object.assign({}, sharedArgs, {
            text: "\\pi_{\\mathrm{SFT}}",
            start: swapToSFT,
            end: swapToReference
        }));
        finalReference = new ResizableKatex(s, Object.assign({}, sharedArgs, {
            text: "\\pi_{\\mathrm{ref}}",
            start: swapToReference
        }));
    };

    s.draw = function () {
        if (s.frameCount === moveStart)
            finalReference.move(320, 129, moveDuration, 2, cornerSize);
        initialReference.show();
        sftPolicy.show();
        finalReference.show();
        if (!policySymbolsAligned && s.frameCount >= 5) {
            const referencePi = initialReference.k.elt.querySelector(
                ".mord.mathnormal"
            ).getBoundingClientRect();
            const sftPi = sftPolicy.k.elt.querySelector(
                ".mord.mathnormal"
            ).getBoundingClientRect();
            sftPolicy.k.style(
                "margin-left", referencePi.left - sftPi.left + "px"
            );
            policySymbolsAligned = true;
        }
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
    let rewardModelBackpropagation, llmTitle, llmNetwork, llmBackpropagation, crossoutLine;
    let preferenceTriplets = [];
    let titleStartTime = frames(0.5);
    let subtitleStartTime = frames(1.1);
    let preferenceDataTitleStartTime = frames(1.4);
    let rewardModelTitleStartTime = frames(1.4);
    let firstTripletStartTime = frames(2);
    let preferenceEllipsisStartTime = frames(2.8);
    let rewardModelStartTime = frames(2);
    let rewardModelBackpropagationStartTime = frames(4);
    let llmStartTime = frames(4.5);
    let llmBackpropagationStartTime = frames(6);
    let rewardTextStartTime = frames(4);
    let rewardModelCrossoutStartTime = frames(8);
    let tripletStagger = frames(0.18);
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
            font: font
        })
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
        for (let index = 1; index <= 4; index++) {
            preferenceTriplets.push(new FallingTriplet(
                index,
                450,
                495 + (index - 1) * 75,
                firstTripletStartTime + (index - 1) * tripletStagger
            ));
        }
        preferenceEllipsis = new Katex(s, {
            text: "\\cdots",
            x: 450,
            y: 805,
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
        llmNetwork.showEdges();
        llmBackpropagation.show();
        llmNetwork.showNeurons();
        llmTitle.show();
    };
};

let dpo3 = new p5(DPOScene44);
