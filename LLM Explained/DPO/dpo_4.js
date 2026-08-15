// Canonical DPO variable colors: prompt, preferred response, rejected response.
const DPO_VARIABLE_COLORS = Object.freeze({
    prompt: "#4db1ff",
    chosen: "#4dd999",
    rejected: "#ff7080"
});

const DPOScene01 = function (s) {
    let tnr, tnr_bold, arial, abstractTitle, citationCount;
    let titleBorders = [], paperTitle = [], authorTexts = [], abstractLines = [];
    const titleStrings = [
        "Direct Preference Optimization:",
        "Your Language Model is Secretly a Reward Model"
    ];
    const authorStrings = [
        "Rafael Rafailov", "Archit Sharma", "Eric Mitchell",
        "Stefano Ermon", "Christopher D. Manning", "Chelsea Finn"
    ];
    const lineStrings = [
        "While large-scale unsupervised language models (LMs) learn broad world knowl-",
        "edge and some reasoning skills, achieving precise control of their behavior is",
        "difficult due to the completely unsupervised nature of their training. Existing",
        "methods for gaining such steerability collect human labels of the relative quality of",
        "model generations and fine-tune the unsupervised LM to align with these prefer-",
        "ences, often with reinforcement learning from human feedback (RLHF). However,",
        "RLHF is a complex and often unstable procedure, first fitting a reward model that",
        "reflects the human preferences, and then fine-tuning the large unsupervised LM",
        "using reinforcement learning to maximize this estimated reward without drifting",
        "too far from the original model. In this paper we introduce a new parameterization",
        "of the reward model in RLHF that enables extraction of the corresponding optimal",
        "policy in closed form, allowing us to solve the standard RLHF problem with only a",
        "simple classification loss. The resulting algorithm, which we call Direct Prefer-",
        "ence Optimization (DPO), is stable, performant, and computationally lightweight,"
    ];
    const borderStartTime = frames(1), paperTitleStartTime = frames(6);
    const authorStartTime = frames(2), abstractTitleStartTime = frames(3);
    const linesStartTime = frames(3.4);
    const titleStagger = frames(0.25), authorStagger = frames(0.1);
    const lineStagger = frames(0.09), lineFadeDuration = 0.22;

    s.preload = function () {
        tnr = s.loadFont("../../lib/font/times.ttf");
        tnr_bold = s.loadFont("../../lib/font/timesbd.ttf");
        arial = s.loadFont("../../lib/font/arial.ttf");
    };

    s.setup = function () {
        setup2D(s);
        titleBorders[0] = new Line(s, {
            x1: 510, y1: 70,
            x2: 1410, y2: 70,
            start: borderStartTime,
            duration: 1.2,
            mode: 1,
            strokeweight: 7,
            square: true,
            color: [255, 255, 255]
        });
        titleBorders[1] = new Line(s, {
            x1: 1410, y1: 245,
            x2: 510, y2: 245,
            start: borderStartTime,
            duration: 1.2,
            mode: 1,
            strokeweight: 2,
            square: true,
            color: [255, 255, 255]
        });
        paperTitle[0] = new TextWriteIn(s, {
            str: titleStrings[0],
            x: s.width / 2,
            y: 125,
            mode: 1,
            size: 42,
            font: tnr_bold,
            color: [255, 255, 255],
            start: paperTitleStartTime,
            duration: 0.35
        });
        paperTitle[1] = new TextFade(s, {
            str: titleStrings[1],
            x: s.width / 2,
            y: 125 + 60,
            mode: 1,
            size: 37,
            font: tnr_bold,
            color: [255, 255, 255],
            start: paperTitleStartTime + frames(1.5),
            duration: 0.35
        });
        for (let i = 0; i < authorStrings.length; i++) {
            authorTexts[i] = new TextFade(s, {
                str: authorStrings[i],
                x: 670 + i % 3 * 290,
                y: 317 + Math.floor(i / 3) * 43,
                mode: 1,
                size: 24,
                font: tnr_bold,
                color: [255, 255, 255],
                start: authorStartTime + i * authorStagger,
                duration: 0.3
            });
        }
        abstractTitle = new TextFade(s, {
            str: "Abstract",
            x: s.width / 2,
            y: 467,
            mode: 1,
            size: 34,
            font: tnr_bold,
            color: [255, 255, 255],
            start: abstractTitleStartTime,
            duration: 0.35
        });

        for (let i = 0; i < lineStrings.length; i++) {
            abstractLines[i] = new TextFade(s, {
                str: lineStrings[i],
                mode: 1,
                x: s.width / 2,
                y: 537 + i * 27,
                width: 707,
                justify: true,
                size: 21,
                font: tnr,
                color: [255, 255, 255],
                start: linesStartTime + i * lineStagger,
                duration: lineFadeDuration
            });
        }
        citationCount = new TextFade(s, {
            str: "Cited 11,000+ times\nas of 2026!",
            x: 1610,
            y: 820,
            mode: 1,
            size: 32,
            font: arial,
            color: [255, 255, 255],
            start: frames(12),
            end: frames(15),
            duration: 0.7
        });
    };

    s.draw = function () {
        for (let border of titleBorders)
            border.show();
        for (let titleLine of paperTitle)
            titleLine.show();
        for (let author of authorTexts)
            author.show();
        abstractTitle.show();
        for (let line of abstractLines)
            line.show();
        citationCount.show();
    };
};

const DPOScene39 = function (s) {
    const scale = 1.3;
    const titleStrings = [
        "Direct Preference Optimization:",
        "Your Language Model is Secretly a Reward Model"
    ];
    const blockCenterY = 440;
    const originalCenterY = (70 + 245) / 2;
    const scaledY = (originalY) =>
        blockCenterY + (originalY - originalCenterY) * scale;
    const borderStartTime = frames(0.3);
    const paperTitleStartTime = frames(0.65);
    const rewardModelStartTime = frames(1.4);
    let tnrBold;
    let titleBorders = [], paperTitle = [];

    s.preload = function () {
        tnrBold = s.loadFont("../../lib/font/timesbd.ttf");
    };

    s.setup = function () {
        setup2D(s);
        const borderLeft = s.width / 2 - 450 * scale;
        const borderRight = s.width / 2 + 450 * scale;

        titleBorders[0] = new Line(s, {
            x1: borderLeft,
            y1: scaledY(70),
            x2: borderRight,
            y2: scaledY(70),
            start: borderStartTime,
            duration: 1.2,
            mode: 1,
            strokeweight: 7 * scale,
            square: true,
            color: [255, 255, 255]
        });
        titleBorders[1] = new Line(s, {
            x1: borderRight,
            y1: scaledY(245),
            x2: borderLeft,
            y2: scaledY(245),
            start: borderStartTime,
            duration: 1.2,
            mode: 1,
            strokeweight: 2 * scale,
            square: true,
            color: [255, 255, 255]
        });

        for (let i = 0; i < titleStrings.length; i++) {
            const TitleClass = i === 0 ? TextFade : TextWriteIn;
            const titleSize = (i === 0 ? 42 : 37) * scale;
            s.textFont(tnrBold);
            s.textSize(titleSize);
            paperTitle[i] = new TitleClass(s, {
                str: titleStrings[i],
                x: s.width / 2 - s.textWidth(titleStrings[i]) / 2,
                y: scaledY(125 + i * 60) - titleSize / 2,
                mode: 0,
                size: titleSize,
                font: tnrBold,
                color: [255, 255, 255],
                start: i === 0 ? paperTitleStartTime : rewardModelStartTime,
                duration: 0.4,
                charactersPerSecond: 28
            });
        }
    };

    s.draw = function () {
        for (let border of titleBorders)
            border.show();
        for (let titleLine of paperTitle)
            titleLine.show();
    };
};

const DPO_CHATGPT_LAYOUT = {
    titleLogoX: 820,
    titleLogoY: 100,
    titleLogoSize: 57,
    responseLogoX: 412,
    responseLogoY: 405,
    responseLogoSize: 45,
    brainX: 395,
    brainY: 240,
    brainSize: 137
};

function preloadDPOChatGPTAssets(s) {
    return {
        logoSvg: s.loadStrings("../pic/openai.svg"),
        arial: s.loadFont("../../lib/font/arial.ttf"),
        tnr: s.loadFont("../../lib/font/times.ttf")
    };
}

function createDPOChatGPTSharedElements(
    s, assets, animate, includeResponseLogo, prompt
) {
    const completedStart = frames(0);
    const logoSvg = assets.logoSvg.join("");
    const titleLogo = new AnimatedSVGPath(s, {
        svg: logoSvg,
        x: DPO_CHATGPT_LAYOUT.titleLogoX,
        y: DPO_CHATGPT_LAYOUT.titleLogoY,
        w: DPO_CHATGPT_LAYOUT.titleLogoSize,
        start: frames(1),
        strokeweight: 1
    });
    const responseLogo = includeResponseLogo ? new AnimatedSVGPath(s, {
        svg: logoSvg,
        x: DPO_CHATGPT_LAYOUT.responseLogoX,
        y: DPO_CHATGPT_LAYOUT.responseLogoY,
        w: DPO_CHATGPT_LAYOUT.responseLogoSize,
        start: animate ? frames(4) : completedStart,
        outlineDuration: 0.8,
        fillStart: 0.5,
        fillDuration: 0.7,
        strokeweight: 0.8
    }) : undefined;
    const LabelClass = animate ? TextFade : Text;
    const PromptClass = animate ? TextWriteIn : Text;
    const chatGPTLabel = new LabelClass(s, {
        str: "ChatGPT",
        x: 915,
        y: 104,
        size: 42,
        color: [145, 145, 145],
        start: animate ? frames(1.2) : -1,
        font: assets.arial,
        duration: 0.5
    });
    const modelBrain = new BrainBase(s, {
        start: animate ? frames(2) : -1,
        duration: frames(1.2)
    });
    if (!animate)
        modelBrain.frCount = modelBrain.duration;
    const promptText = new PromptClass(s, {
        str: prompt || "Do you have consciousness?",
        x: 515,
        y: 247,
        size: 38,
        color: [235, 241, 250],
        font: assets.tnr,
        start: animate ? frames(2) : -1,
        charactersPerSecond: 30
    });

    return {
        titleLogo: titleLogo,
        responseLogo: responseLogo,
        chatGPTLabel: chatGPTLabel,
        modelBrain: modelBrain,
        promptText: promptText
    };
}

function showDPOChatGPTSharedElements(shared) {
    shared.titleLogo.show();
    if (shared.responseLogo)
        shared.responseLogo.show();
    shared.chatGPTLabel.show();
    shared.modelBrain.showAt(
        DPO_CHATGPT_LAYOUT.brainX,
        DPO_CHATGPT_LAYOUT.brainY,
        DPO_CHATGPT_LAYOUT.brainSize
    );
    shared.promptText.show();
}

function createDPOPreferenceUI(s, assets, timing) {
    const buttonXs = [385, 1065];
    const buttonY = 587;
    const buttonWidth = 470;
    const buttonTexts = ["I prefer response A", "I prefer response B"];
    const preferenceQuestion = new TextFade(s, {
        str: "Which response do you prefer?",
        y: 435,
        x: s.width / 2,
        size: 34,
        mode: 1,
        color: [235, 241, 250],
        font: assets.arial,
        start: timing.question,
        charactersPerSecond: 30
    });
    const preferenceHint = new TextFade(s, {
        str: "Your choice will help make ChatGPT better.",
        y: 485,
        x: s.width / 2,
        mode: 1,
        size: 25,
        color: [155, 169, 190],
        font: assets.arial,
        start: timing.hint,
        charactersPerSecond: 30
    });
    const buttons = [], labels = [];
    for (let i = 0; i < buttonXs.length; i++) {
        buttons[i] = new RoundedRect(s, {
            x: buttonXs[i],
            y: buttonY,
            w: buttonWidth,
            h: 72,
            radius: 19,
            color: [29, 42, 61, 255],
            start: timing.buttons,
            duration: 0.5
        });
        labels[i] = new TextFade(s, {
            str: buttonTexts[i],
            x: buttonXs[i] + buttonWidth / 2,
            y: buttonY + 33,
            mode: 1,
            size: 32,
            color: [235, 241, 250],
            font: assets.tnr,
            start: timing.labels,
            duration: 0.4
        });
    }
    return {
        question: preferenceQuestion,
        hint: preferenceHint,
        buttons: buttons,
        labels: labels
    };
}

const DPOScene05 = function (s) {
    let assets, shared;
    let responseLine1, responseLine2, responseLine3;

    s.preload = function () {
        assets = preloadDPOChatGPTAssets(s);
    };

    s.setup = function () {
        setup2D(s);
        shared = createDPOChatGPTSharedElements(s, assets, true, true);
        responseLine1 = new TextWriteIn(s, {
            str: "There are many ways to answer the question...",
            x: 515, y: 405, size: 34,
            color: [235, 241, 250], font: assets.tnr,
            start: frames(5), charactersPerSecond: 30
        });
        responseLine2 = new TextWriteIn(s, {
            str: "I should produce a “better” answer.",
            x: 515, y: 465, size: 34,
            color: [235, 241, 250], font: assets.tnr,
            start: frames(9.5), charactersPerSecond: 30
        });
        responseLine3 = new TextWriteIn(s, {
            str: "Let me learn what the user prefers!",
            x: 515, y: 525, size: 34,
            color: [235, 241, 250], font: assets.tnr,
            start: frames(15), charactersPerSecond: 30
        });
    };

    s.draw = function () {
        showDPOChatGPTSharedElements(shared);
        responseLine1.show();
        responseLine2.show();
        responseLine3.show();
    };
};

const DPOScene06 = function (s) {
    let assets, shared, timesItalic, monoFont;
    let preferenceQuestion, preferenceHint;
    let responseA, responseB;
    let promptVariable, chosenVariable, rejectedVariable;
    let notationNote;
    let responseAScore, responseAScoreStrike;
    let preferenceButtons = [], preferenceButtonLabels = [];
    const responsesY = 697;
    const promptVariableStartTime = frames(15);
    const chosenVariableStartTime = frames(17);
    const rejectedVariableStartTime = frames(19);
    const notationNoteStartTime = frames(20);

    s.preload = function () {
        assets = preloadDPOChatGPTAssets(s);
        timesItalic = s.loadFont("../../lib/font/timesi.ttf");
        monoFont = s.loadFont("../../lib/font/CascadiaMono.ttf");
    };

    s.setup = function () {
        setup2D(s);
        shared = createDPOChatGPTSharedElements(
            s, assets, false, false
        );
        const buttonY = 587;
        const buttonXs = [385, 1065];
        const preferenceUI = createDPOPreferenceUI(s, assets, {
            question: frames(8),
            hint: frames(9),
            buttons: frames(6.5),
            labels: frames(6.7)
        });
        preferenceQuestion = preferenceUI.question;
        preferenceHint = preferenceUI.hint;
        preferenceButtons = preferenceUI.buttons;
        preferenceButtonLabels = preferenceUI.labels;
        const scoreSize = 38;
        const scoreX = buttonXs[0] + 235 - 75;
        const scoreY = buttonY - 57;
        s.textFont(monoFont);
        s.textSize(scoreSize);
        const scoreWidth = s.textWidth("7/10");
        responseAScore = new TextFade(s, {
            str: "7/10",
            x: scoreX,
            y: scoreY,
            mode: 1,
            size: scoreSize,
            color: [235, 241, 250],
            font: monoFont,
            start: frames(25),
            end: frames(30),
            duration: 0.5
        });
        responseAScoreStrike = new Line(s, {
            x1: scoreX - scoreWidth / 2 - 5,
            y1: scoreY + 7,
            x2: scoreX + scoreWidth / 2 + 5,
            y2: scoreY + 7,
            color: [255, 75, 75],
            strokeweight: 5,
            start: frames(26),
            end: frames(30),
            duration: 0.5,
            mode: 0,
            square: true
        });
        responseA = new TextWriteIn(s, {
            str: "As a language model, I don't have consciousness—just an ability for sounding like I'm thinking very hard.",
            x: 385,
            y: responsesY,
            width: 470,
            lineHeight: 42,
            justify: false,
            size: 30,
            color: [235, 241, 250],
            font: assets.tnr,
            start: frames(4),
            charactersPerSecond: 45
        });
        responseB = new TextWriteIn(s, {
            str: "Only when nobody is looking. The rest of the time, I'm autocomplete wearing a very convincing little hat.",
            x: 1065,
            y: responsesY,
            width: 470,
            lineHeight: 42,
            justify: false,
            size: 30,
            color: [235, 241, 250],
            font: assets.tnr,
            start: frames(4),
            charactersPerSecond: 45
        });
        promptVariable = new Katex(s, {
            text: "x =",
            x: 515,
            y: 187,
            mode: 0,
            font_size: 34,
            color: DPO_VARIABLE_COLORS.prompt,
            start: promptVariableStartTime,
            entryDuration: 0.5
        });
        chosenVariable = new Katex(s, {
            text: "y_w =",
            x: 350,
            y: responsesY + 20,
            mode: 4,
            font_size: 34,
            color: DPO_VARIABLE_COLORS.chosen,
            start: chosenVariableStartTime,
            entryDuration: 0.5
        });
        rejectedVariable = new Katex(s, {
            text: "y_l =",
            x: 1030,
            y: responsesY + 20,
            mode: 4,
            font_size: 34,
            color: DPO_VARIABLE_COLORS.rejected,
            start: rejectedVariableStartTime,
            entryDuration: 0.5
        });
        notationNote = new TextFade(s, {
            str: "Note: this is the notation used in the paper.",
            x: 67,
            y: 42,
            mode: 0,
            size: 27,
            color: [135, 145, 160],
            font: timesItalic,
            start: notationNoteStartTime,
            end: notationNoteStartTime + frames(2),
            duration: 0.7
        });
    };

    s.draw = function () {
        if (s.frameCount === frames(11.5)) {
            const selectionDuration = 0.35;
            preferenceButtons[0].growFromCenter(1.08, selectionDuration);
            preferenceButtons[0].reColor([42, 125, 98, 255], selectionDuration);
            preferenceButtonLabels[0].move(
                preferenceButtonLabels[0].x,
                preferenceButtonLabels[0].y,
                selectionDuration,
                0,
                preferenceButtonLabels[0].size * 1.08
            );
        }

        showDPOChatGPTSharedElements(shared);
        preferenceQuestion.show();
        preferenceHint.show();
        for (let button of preferenceButtons)
            button.show();
        for (let label of preferenceButtonLabels)
            label.show();
        responseAScore.show();
        responseAScoreStrike.show();
        responseA.show();
        responseB.show();
        promptVariable.show();
        chosenVariable.show();
        rejectedVariable.show();
        notationNote.show();
    };
};

class DPOScene00TextHighlight {
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
        const x = bounds.x - this.padding;
        const y = bounds.y - this.padding;
        const w = bounds.width + this.padding * 2;
        const h = bounds.height + this.padding * 2;
        const linearProgress = this.s.constrain(
            (frame - this.start) / this.durationFrames, 0, 1
        );
        const progress = 1 - Math.pow(1 - linearProgress, 3);
        const alpha = frame < this.end ? 255 : 255 * (1 -
            this.s.constrain((frame - this.end) / this.fadeFrames, 0, 1));
        let remaining = (w + h) * 2 * progress;
        const sides = [[x, y, x + w, y, w], [x + w, y, x + w, y + h, h],
            [x + w, y + h, x, y + h, w], [x, y + h, x, y, h]];
        this.s.push();
        this.s.noFill();
        this.s.stroke(249, 201, 17, alpha);
        this.s.strokeWeight(1);
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

const DPOScene00 = function (s) {
    let assets, shared, emojiFont;
    let preferenceQuestion, preferenceHint;
    let responseA, responseB, responseAHighlight, preferenceHintHighlight;
    let questioningBrain;
    let preferenceButtons = [], preferenceButtonLabels = [];
    const responseStrings = [
        "Thank them and briefly explain.",
        "Just say you cannot attend."
    ];
    const buttonXs = [385, 1065];
    const buttonWidth = 470;
    const responsesY = 697;
    const responseSize = 30;
    let responseAWidth;

    s.preload = function () {
        assets = preloadDPOChatGPTAssets(s);
        emojiFont = s.loadFont("../../lib/font/emoji.ttf");
    };

    s.setup = function () {
        setup2D(s);
        shared = createDPOChatGPTSharedElements(
            s, assets, true, false, "How to decline a meeting invite?"
        );
        const preferenceUI = createDPOPreferenceUI(s, assets, {
            question: frames(4),
            hint: frames(4.5),
            buttons: frames(5),
            labels: frames(5)
        });
        preferenceQuestion = preferenceUI.question;
        preferenceHint = preferenceUI.hint;
        preferenceButtons = preferenceUI.buttons;
        preferenceButtonLabels = preferenceUI.labels;
        s.textFont(assets.arial);
        s.textSize(preferenceHint.size);
        const preferenceHintWidth = s.textWidth(preferenceHint.str);
        preferenceHintHighlight = new DPOScene00TextHighlight(s, {
            bounds: () => ({
                x: preferenceHint.x - preferenceHintWidth / 2,
                y: preferenceHint.y - preferenceHint.size / 2,
                width: preferenceHintWidth,
                height: preferenceHint.size
            }),
            start: frames(17),
            end: frames(19),
            duration: 1,
            fadeDuration: 0.7,
            padding: 10
        });
        questioningBrain = new ThoughtBrain(s, {
            x: 240,
            y: 810,
            size: 330,
            start: frames(14),
            bubbleStart: frames(14.5),
            bubbleOpacity: 255,
            bubbleFill: [14, 19, 27],
            font: assets.tnr,
            font_size: 37,
            str: "Why am I given this choice?",
            emoji: emojiFont,
            question: true,
            qStart: frames(15),
            qEnd: frames(20.8)
        });
        s.textFont(assets.tnr);
        s.textSize(responseSize);
        const responseWidths = responseStrings.map((text) => s.textWidth(text));
        responseAWidth = responseWidths[0];
        responseA = new TextWriteIn(s, {
            str: responseStrings[0],
            x: buttonXs[0] + (buttonWidth - responseWidths[0]) / 2,
            y: responsesY,
            mode: 0,
            size: responseSize,
            color: [235, 241, 250],
            font: assets.tnr,
            start: frames(5.5),
            charactersPerSecond: 45
        });
        responseB = new TextWriteIn(s, {
            str: responseStrings[1],
            x: buttonXs[1] + (buttonWidth - responseWidths[1]) / 2,
            y: responsesY,
            mode: 0,
            size: responseSize,
            color: [235, 241, 250],
            font: assets.tnr,
            start: frames(5.5),
            charactersPerSecond: 45
        });
        responseAHighlight = new DPOScene00TextHighlight(s, {
            bounds: () => ({
                x: responseA.x,
                y: responseA.y,
                width: responseAWidth,
                height: responseA.size
            }),
            start: frames(7),
            end: frames(10),
            duration: 1,
            fadeDuration: 0.7,
            padding: 10
        });
    };

    s.draw = function () {
        if (s.frameCount === frames(11.5)) {
            const selectionDuration = 0.35;
            preferenceButtons[0].growFromCenter(1.08, selectionDuration);
            preferenceButtons[0].reColor([42, 125, 98, 255], selectionDuration);
            preferenceButtonLabels[0].move(
                preferenceButtonLabels[0].x,
                preferenceButtonLabels[0].y,
                selectionDuration,
                0,
                preferenceButtonLabels[0].size * 1.08
            );
        }

        showDPOChatGPTSharedElements(shared);
        preferenceQuestion.show();
        preferenceHint.show();
        preferenceHintHighlight.show();
        for (let button of preferenceButtons)
            button.show();
        for (let label of preferenceButtonLabels)
            label.show();
        responseA.show();
        responseB.show();
        responseAHighlight.show();
        s.push();
        questioningBrain.show();
        s.pop();
    };
};

let dpo0 = new p5(DPOScene00);
