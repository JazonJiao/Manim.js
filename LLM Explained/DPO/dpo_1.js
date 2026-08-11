/**
 * The sequence-level log probabilities for a preferred/rejected pair.
 * The winner fades in at its final position. The loser can additionally descend
 * into place by calling beginLoserMove(), which lets a scene coordinate that
 * movement with the expression it replaces.
 */
class PreferenceLikelihoodExpressions {
    constructor(ctx, args) {
        this.s = ctx;
        this.x = args.x;
        this.loserY = args.loserY;
        this.gap = args.gap !== undefined ? args.gap : 70;
        this.duration = args.duration || 0.8;
        this.loserOffsetY = args.loserOffsetY !== undefined ?
            args.loserOffsetY : 45;
        const modelSubscript = args.modelSubscript || "\\theta";

        this.winner = new Katex(this.s, {
            text: "\\log \\pi_{" + modelSubscript + "}(y_w \\mid x) = " +
                args.winnerValue,
            x: this.x,
            y: this.loserY - this.gap,
            font_size: args.font_size || 40,
            color: args.winnerColor || "#4dd999",
            mode: args.mode || 0,
            start: args.start
        });
        this.loser = new Katex(this.s, {
            text: "\\log \\pi_{" + modelSubscript + "}(y_l \\mid x) = " +
                args.loserValue,
            x: this.x,
            y: this.loserY - this.loserOffsetY,
            font_size: args.font_size || 40,
            color: args.loserColor || "#ff7080",
            mode: args.mode || 0,
            start: args.start
        });
    }

    beginLoserMove() {
        this.loser.move(this.x, this.loserY, this.duration, 1);
    }

    moveToCenter(duration) {
        const canvasBounds = this.s.canvas.getBoundingClientRect();
        const scaleX = canvasBounds.width / this.s.width;
        const scaleY = canvasBounds.height / this.s.height;
        const winnerBounds = this.winner.k.elt.getBoundingClientRect();
        const loserBounds = this.loser.k.elt.getBoundingClientRect();
        const centerX = this.s.width / 2;
        const centerY = this.s.height / 2;

        this.winner.move(
            centerX - winnerBounds.width / scaleX / 2,
            centerY - this.gap / 2 - winnerBounds.height / scaleY / 2,
            duration,
            1
        );
        this.loser.move(
            centerX - loserBounds.width / scaleX / 2,
            centerY + this.gap / 2 - loserBounds.height / scaleY / 2,
            duration,
            1
        );
    }

    show() {
        this.winner.show();
        this.loser.show();
    }
}

const DPOScene19 = function (s, args) {
    args = args || {};
    // Scene palette. Edit these defaults or pass matching keys in args.colors.
    const colors = Object.assign({
        chosen: [77, 217, 153],
        rejected: [255, 112, 128],
        prompt: [77, 177, 255],
        attentionArc: [145, 153, 167],
        rejectedAttentionArc: [255, 157, 167],
        foreground: [235, 241, 250],
        outline: [255, 255, 255],
        transmit: [247, 227, 47]
    }, args.colors || {});
    const chosen_color = colors.chosen;
    const rejected_color = colors.rejected;
    const prompt_color = colors.prompt;
    const attention_arc_color = colors.attentionArc;
    const attention_arc_rejected = colors.rejectedAttentionArc;
    const chosenProbabilities = args.chosenProbabilities ||
        [0.74, 0.81, 0.69, 0.88, 0.63, 0.71, 0.86, 0.95, 0.98];
    const loserProbabilities = args.loserProbabilities || [0.43, 0.52, 0.91, 0.96];
    const showAttention = args.showAttention !== false;
    const modelLabelText = args.modelLabel || "current\nmodel";
    const modelSubscript = args.modelSubscript || "\\theta";
    const timing = Object.assign({
        pipelineStart: frames(1),
        subtitleStart: frames(0.8),
        promptStart: frames(1.2),
        modelStart: frames(1.5),
        connectionStart: frames(1.7),
        tableAStart: frames(2),
        tableBStart: frames(4),
        titleAStart: frames(1.5),
        titleBStart: frames(2.5),
        loserEquationStart: frames(7),
        loserNllStart: frames(10),
        rigorousEquationStart: frames(13)
    }, args.timing || {});
    let font, title, subtitle, prompt, promptRect;
    let connect1, connect2;
    let inference1, inference2;
    let inference1Times = args.inference1Times || [
        {start: frames(2.4), end: frames(3.0)},
        {start: frames(3.6), end: frames(4.2)},
        {start: frames(4.8), end: frames(5.4)}
    ];
    let inference2Times = args.inference2Times || [
        {start: frames(2.7), end: frames(3.3)},
        {start: frames(3.9), end: frames(4.5)},
        {start: frames(5.1), end: frames(5.7)}
    ];
    let attentionWords = [], attentionEdges = [];
    let referenceModel, referenceLabel, outRect, refRect;
    let referenceModelSize = 420, refX = 1070, refY = 249;
    let tableTitles = [], tables = [];
    let probabilityTexts = [[], []];
    let loserProbabilityEquation, loserTextReplacement, preferenceLikelihoodExpressions;
    let loserRigorousTransitionStarted = false;
    let loserEquationStartTime = timing.loserEquationStart,
        loserNllStartTime = timing.loserNllStart,
        loserRigorousEquationStartTime = timing.rigorousEquationStart;
    let tableAStart = timing.tableAStart, tableBStart = timing.tableBStart;

    function createProbabilityTexts(values, table, color) {
        let texts = [];
        for (let i = 0; i < values.length; i++) {
            texts[i] = new TextFade(s, {
                str: values[i],
                x: table.x + table.sizeX * (0.6 + (i + 1) * 1.4),
                y: table.y + table.sizeY * 1.8,
                mode: 1,
                size: table.sizeY,
                color: color,
                start: table.start + table.duration * (i + 1) / (table.numPts + 1),
                duration: 0.5,
                font: font
            });
        }
        return texts;
    }

    function createAttentionMask() {
        let attentionMaskStartTime = frames(1), attentionArcDelay = frames(1),
            attentionArcStartRange = frames(2), attentionFadeDelay = frames(4),
            attentionMaskSeed = 2035;
        s.randomSeed(attentionMaskSeed);
        const words = [
            "When", "is", "the", "next", "total", "solar",
            "eclipse", "in", "Beijing", "Sept", "2035"
        ];
        const left = 570;
        const right = 1350;
        const y = 170;
        const spacing = (right - left) / (words.length - 1);
        const wordStagger = frames(0.07);
        const wordFadeDuration = 0.5;
        const wordsMaterializedTime = attentionMaskStartTime +
            wordStagger * (words.length - 1) + frames(wordFadeDuration);
        const arcWindowStart = wordsMaterializedTime + attentionArcDelay;
        const attentionMaskEndTime = wordsMaterializedTime + attentionFadeDelay;

        for (let i = 0; i < words.length; i++) {
            attentionWords[i] = new TextFade(s, {
                str: words[i],
                x: left + spacing * i,
                y: y,
                mode: 1,
                size: 30,
                color: i >= words.length - 2 ? rejected_color : prompt_color,
                start: attentionMaskStartTime + wordStagger * i,
                end: attentionMaskEndTime,
                duration: wordFadeDuration,
                font: font
            });
        }

        // Build every valid right-to-left pair, shuffle them, and keep 15.
        let pairs = [];
        for (let source = 1; source < words.length; source++) {
            for (let target = 0; target < source; target++) {
                pairs.push([source, target]);
            }
        }
        for (let i = pairs.length - 1; i > 0; i--) {
            const j = Math.floor(s.random(i + 1));
            const temp = pairs[i];
            pairs[i] = pairs[j];
            pairs[j] = temp;
        }

        // Preserve the random selection, then order its animation spatially
        // so arcs begin on the left and progress toward the right.
        pairs = pairs.slice(0, 15);
        pairs.sort(function (a, b) {
            return (a[0] + a[1]) - (b[0] + b[1]);
        });

        for (let i = 0; i < 15; i++) {
            const source = pairs[i][0];
            const target = pairs[i][1];
            const sourceX = left + spacing * source;
            const targetX = left + spacing * target;
            const distance = sourceX - targetX;
            attentionEdges[i] = new Edge(s, {
                x1: sourceX,
                y1: y - 10,
                x2: targetX,
                y2: y - 10,
                d: Math.min(20 + s.random(25), distance / 2 - 8),
                node_r: 1,
                directed: false,
                start: arcWindowStart + Math.round(
                    attentionArcStartRange * i / 14
                ),
                end: attentionMaskEndTime,
                duration: 0.6,
                strokeweight: 3,
                color: source >= words.length - 2 ?
                    attention_arc_rejected : attention_arc_color
            });
        }
    }

    function createModelPipeline() {
        promptRect = new LinedRect(s, {
            x: refX - 940, y: refY - 20, w: 790, h: 220,
            start: timing.pipelineStart, duration: 0.7, mode: 2,
            strokeweight: 2, color: colors.outline
        });
        refRect = new LinedRect(s, {
            x: refX - 40, y: refY - 20, w: 330, h: 220,
            start: timing.pipelineStart, duration: 0.7, mode: 2,
            strokeweight: 2, color: colors.outline
        });
        outRect = new LinedRect(s, {
            x: refX + 400, y: refY - 20, w: 290, h: 220,
            start: timing.pipelineStart, duration: 0.7, mode: 2,
            strokeweight: 2, color: colors.outline
        });

        referenceModel = new BrainBase(s, {
            start: timing.modelStart, duration: frames(1.5),
            respawnTimes: args.modelRespawnTimes || [frames(5), frames(10)]
        });
        referenceLabel = new TextFade(s, {
            str: modelLabelText, x: refX + 210, y: refY + 150,
            size: 27, mode: 1, color: colors.foreground,
            start: timing.modelStart, duration: 1, font: font
        });

        const firstConnection = {
            x1: promptRect.x + promptRect.w,
            y1: promptRect.y + promptRect.h / 2,
            x2: refRect.x,
            y2: refRect.y + refRect.h / 2
        };
        const secondConnection = {
            x1: refRect.x + refRect.w,
            y1: refRect.y + refRect.h / 2,
            x2: outRect.x,
            y2: outRect.y + outRect.h / 2
        };

        connect1 = new Line(s, Object.assign({}, firstConnection, {
            start: timing.connectionStart, duration: 0.5, mode: 1,
            strokeweight: 7, square: true, color: colors.outline
        }));
        connect2 = new Line(s, Object.assign({}, secondConnection, {
            start: timing.connectionStart, duration: 0.5, mode: 1,
            strokeweight: 7, square: true, color: colors.outline
        }));
        inference1 = new TransmitLine(s, Object.assign({}, firstConnection, {
            intervals: inference1Times, strokeweight: 17,
            square: true, color: colors.transmit
        }));
        inference2 = new TransmitLine(s, Object.assign({}, secondConnection, {
            intervals: inference2Times, strokeweight: 17,
            square: true, color: colors.transmit
        }));
    }

    function createSceneText() {
        subtitle = new TextWriteIn(s, {
            str: "Each word is treated as a token for this illustration",
            x: s.width / 2, y: 110, mode: 1, size: 25,
            color: colors.muted, start: timing.subtitleStart, font: font,
            charactersPerSecond: 45
        });
        prompt = new TextWriteIn(s, {
            str: 'Prompt: "When is the next total solar eclipse in Beijing?"',
            x: refX - 545, y: refY + 49, mode: 1, size: 29,
            color: prompt_color, start: timing.promptStart, font: font,
            charactersPerSecond: 60
        });
        title = new TextWriteIn(s, {
            str: 'Prompt: "When is the next total solar eclipse in Beijing?"',
            x: s.width / 2, y: 50, mode: 1, size: 42,
            color: prompt_color, start: timing.promptStart, font: font,
            charactersPerSecond: 60
        });
    }

    function createResponseTables() {
        tableTitles[0] = new TextWriteIn(s, {
            str: "Response A - winner", x: 180, y: 530, size: 31,
            color: chosen_color, start: timing.titleAStart, font: font
        });
        tableTitles[1] = new TextWriteIn(s, {
            str: "Response B - loser", x: 180, y: 735, size: 31,
            color: rejected_color, start: timing.titleBStart, font: font
        });

        tables[0] = new Table(s, {
            x: 180, y: 570,
            xs: ["It", "will", "happen", "on", "Sept", "2nd", "2035", ".", "<end>"],
            ys: ["", "", "", "", "", "", "", "", ""],
            label1: "text", label2: "prob.", start: tableAStart,
            duration: frames(3), font: font,
            colorX: colors.foreground, colorY: chosen_color,
            size: 45, sizeX: 109
        });
        tables[1] = new Table(s, {
            x: 180, y: 775, xs: ["Sept", "2035", ".", "<end>"],
            ys: ["", "", "", ""], label1: "text", label2: "prob.",
            start: tableBStart, duration: frames(3), font: font,
            colorX: colors.foreground, colorY: rejected_color,
            size: 45, sizeX: 109
        });

        probabilityTexts[0] = createProbabilityTexts(
            chosenProbabilities.map(function (p) { return p.toFixed(2); }),
            tables[0], chosen_color
        );
        probabilityTexts[1] = createProbabilityTexts(
            loserProbabilities.map(function (p) { return p.toFixed(2); }),
            tables[1], rejected_color
        );
    }

    function createLoserLossTransition() {
        const chosenProbability = chosenProbabilities.reduce(function (product, p) {
            return product * p;
        }, 1);
        const loserProbability = loserProbabilities.reduce(function (product, p) {
            return product * p;
        }, 1);
        const loserLogs = loserProbabilities.map(function (p) {
            return Math.log(p).toFixed(2);
        });
        const loserLogProbability = Math.log(loserProbability).toFixed(2);
        const chosenLogProbability = Math.log(chosenProbability).toFixed(2);

        loserProbabilityEquation = new TextFade(s, {
            str: "P(loser) = " + loserProbabilities.map(function (p) {
                return p.toFixed(2);
            }).join(" × ") + " = " +
                loserProbability.toFixed(2),
            x: 1000, y: 840, mode: 0, size: 40,
            color: rejected_color, start: loserEquationStartTime,
            duration: 0.7, font: font
        });

        let oldTexts = probabilityTexts[1].slice();
        oldTexts.push(tables[1].textY[0], loserProbabilityEquation);
        let newStrings = loserLogs.slice();
        newStrings.push("log(p)");
        newStrings.push(
            "log P(loser) = " + loserLogs.join(" + ") + " = " +
                loserLogProbability
        );
        loserTextReplacement = new TextReplace(s, {
            oldTexts: oldTexts, newStrings: newStrings,
            start: loserNllStartTime, duration: 0.8, offsetY: 45
        });

        preferenceLikelihoodExpressions = new PreferenceLikelihoodExpressions(s, {
            x: loserProbabilityEquation.x,
            loserY: loserProbabilityEquation.y,
            font_size: loserProbabilityEquation.size,
            winnerValue: chosenLogProbability,
            loserValue: loserLogProbability,
            modelSubscript: modelSubscript,
            winnerColor: "#4dd999",
            loserColor: "#ff7080",
            start: loserRigorousEquationStartTime,
            duration: 0.8,
            gap: 95,
            loserOffsetY: 45
        });
    }

    function showLoserRigorousTransition() {
        const loserNllEquation = loserTextReplacement.newTexts[
            loserTextReplacement.newTexts.length - 1
        ];

        if (!loserRigorousTransitionStarted &&
            s.frameCount >= loserRigorousEquationStartTime) {
            loserNllEquation.ft.fadeOut(0.8);
            loserNllEquation.move(
                loserNllEquation.x, loserNllEquation.y + 45, 0.8, 1
            );
            preferenceLikelihoodExpressions.beginLoserMove();
            loserRigorousTransitionStarted = true;
        }

        preferenceLikelihoodExpressions.show();
    }

    function showModelPipeline() {
        promptRect.show();
        outRect.show();
        refRect.show();
        inference1.show();
        inference2.show();
        connect1.show();
        connect2.show();
        prompt.show();
        referenceModel.showAt(refX, refY, referenceModelSize);
        referenceLabel.show();
    }

    function showResponses() {
        for (let text of tableTitles)
            text.show();
        for (let table of tables)
            table.show();
        loserProbabilityEquation.show();
        for (let texts of probabilityTexts)
            for (let text of texts)
                text.show();
        loserTextReplacement.show();
        showLoserRigorousTransition();
    }

    function showAttentionMask() {
        for (let edge of attentionEdges)
            edge.show();
        for (let word of attentionWords)
            word.show();
    }

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);
        createModelPipeline();
        if (showAttention)
            createAttentionMask();
        createSceneText();
        createResponseTables();
        createLoserLossTransition();
    };

    s.draw = function () {
        s.background(8, 12, 22);
        // title.show();
        // subtitle.show();
        showModelPipeline();
        showResponses();
        if (showAttention)
            showAttentionMask();
        showFR(s);
    };
};

const DPOScene28 = function (s) {
    let preferenceLikelihoodExpressions, dpoLossEquation;
    let expressionsMoveStarted = false, expressionsMoveTime = frames(2),
        dpoLossEquationStartTime = frames(3.5);

    s.setup = function () {
        setup2D(s);
        preferenceLikelihoodExpressions = new PreferenceLikelihoodExpressions(s, {
            x: 1000,
            loserY: 840,
            gap: 95,
            font_size: 40,
            mode: 0,
            winnerValue: "-2.04",
            loserValue: "-1.63",
            winnerColor: "#4dd999",
            loserColor: "#ff7080",
            start: frames(0.5),
            loserOffsetY: 0
        });

        dpoLossEquation = new Katex(s, {
            text: "\\mathcal{L}_{\\mathrm{DPO}}(\\pi_\\theta;\\pi_{\\mathrm{ref}})" +
                "=-\\mathbb{E}_{(x,y_w,y_l)\\sim\\mathcal{D}}" +
                "\\left[\\log\\sigma\\left(\\beta\\left(" +
                "\\left[\\log\\pi_\\theta(y_w\\mid x)" +
                "-\\log\\pi_{\\mathrm{ref}}(y_w\\mid x)\\right]" +
                "-\\left[\\log\\pi_\\theta(y_l\\mid x)" +
                "-\\log\\pi_{\\mathrm{ref}}(y_l\\mid x)\\right]" +
                "\\right)\\right)\\right]",
            x: s.width / 2,
            y: 305,
            mode: 1,
            font_size: 30,
            color: "#ffffff",
            start: dpoLossEquationStartTime
        });
    };

    s.draw = function () {
        s.background(8, 12, 22);

        if (!expressionsMoveStarted && s.frameCount >= expressionsMoveTime) {
            preferenceLikelihoodExpressions.moveToCenter(1.2);
            expressionsMoveStarted = true;
        }

        preferenceLikelihoodExpressions.show();
        dpoLossEquation.show();
    };
};

const DPOScene33 = function (s) {
    let scene3PipelineStartTime = frames(0.8), scene3SubtitleStartTime = frames(0.6),
        scene3PromptStartTime = frames(1), scene3ModelStartTime = frames(1.3),
        scene3ConnectionStartTime = frames(1.5);
    let scene3TableAStartTime = frames(1.8), scene3TableBStartTime = frames(3.8),
        scene3TitleAStartTime = frames(1.4), scene3TitleBStartTime = frames(2.4);
    let scene3LoserEquationStartTime = frames(6.8),
        scene3LoserNllStartTime = frames(9.8),
        scene3RigorousEquationStartTime = frames(12.8);
    let scene3Inference1Times = [
        {start: frames(2.2), end: frames(2.8)},
        {start: frames(3.4), end: frames(4.0)},
        {start: frames(4.6), end: frames(5.2)}
    ];
    let scene3Inference2Times = [
        {start: frames(2.5), end: frames(3.1)},
        {start: frames(3.7), end: frames(4.3)},
        {start: frames(4.9), end: frames(5.5)}
    ];

    DPOScene19(s, {
        modelLabel: "reference\nmodel",
        modelSubscript: "\\mathrm{ref}",
        showAttention: false,
        chosenProbabilities: [0.71, 0.79, 0.66, 0.86, 0.60, 0.69, 0.83, 0.93, 0.96],
        loserProbabilities: [0.47, 0.55, 0.93, 0.98],
        inference1Times: scene3Inference1Times,
        inference2Times: scene3Inference2Times,
        modelRespawnTimes: [frames(4.8), frames(9.8)],
        timing: {
            pipelineStart: scene3PipelineStartTime,
            subtitleStart: scene3SubtitleStartTime,
            promptStart: scene3PromptStartTime,
            modelStart: scene3ModelStartTime,
            connectionStart: scene3ConnectionStartTime,
            tableAStart: scene3TableAStartTime,
            tableBStart: scene3TableBStartTime,
            titleAStart: scene3TitleAStartTime,
            titleBStart: scene3TitleBStartTime,
            loserEquationStart: scene3LoserEquationStartTime,
            loserNllStart: scene3LoserNllStartTime,
            rigorousEquationStart: scene3RigorousEquationStartTime
        }
    });
};

const DPOScene03 = function (s) {
    const colors = {
        background: [8, 12, 22],
        foreground: [235, 241, 250],
        muted: [155, 169, 190],
        outline: [255, 255, 255],
        transmit: [247, 227, 47],
        token: [77, 177, 255]
    };
    const pipelineStart = frames(1.0);
    const connectionStart = frames(1.7);
    const modelStart = frames(1.5);
    const textStart = frames(3);
    const pairCycleFrames = frames(0.1);
    const refX = 1070;
    const refY = 459;
    const modelSize = 420;
    const textTokenPairs = [
        ["The Andromeda galaxy is approximately 2.5 million light-years", "away"],
        ["In photosynthesis, plants convert sunlight into chemical", "energy"],
        ["A violin produces sound when its strings begin to", "move"],
        ["The ancient city of Petra was carved directly into", "stone"],
        ["Water freezes at zero degrees on the Celsius", "scale"],
        ["After a long hike, they stopped beside the river for", "water"],
        ["The lighthouse sent a bright beam of", "light"],
        ["She checked the clock to see what", "time"],
        ["The internet connects people around the", "world"],
        ["He turned the handle and opened the", "door"]
    ];

    let font, emojiFont, title, dataRect, modelRect, tokenRect;
    let connect1, connect2, transmit1, transmit2, model;
    let contextText, tokenText, firstThought, secondThought, insightBulb;

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
        emojiFont = s.loadFont("../../lib/font/emoji.ttf");
    };

    s.setup = function () {
        setup2D(s);

        title = new TextFade(s, {
            str: "Pre-training",
            x: s.width / 2,
            y: 175,
            size: 48,
            mode: 1,
            color: colors.foreground,
            start: frames(1),
            font: font,
            end: frames(5),
            duration: 0.7
        });

        // Reuse the three-stage pipeline geometry from DPOScene19.
        dataRect = new LinedRect(s, {
            x: refX - 940, y: refY - 20, w: 790, h: 220,
            start: pipelineStart, duration: 1.4, mode: 2,
            strokeweight: 2, color: colors.outline
        });
        modelRect = new LinedRect(s, {
            x: refX - 40, y: refY - 20, w: 330, h: 220,
            start: pipelineStart, duration: 1.4, mode: 2,
            strokeweight: 2, color: colors.outline
        });
        tokenRect = new LinedRect(s, {
            x: refX + 400, y: refY - 20, w: 290, h: 220,
            start: pipelineStart, duration: 1.4, mode: 2,
            strokeweight: 2, color: colors.outline
        });

        const firstConnection = {
            x1: dataRect.x + dataRect.w,
            y1: dataRect.y + dataRect.h / 2,
            x2: modelRect.x,
            y2: modelRect.y + modelRect.h / 2
        };
        const secondConnection = {
            x1: modelRect.x + modelRect.w,
            y1: modelRect.y + modelRect.h / 2,
            x2: tokenRect.x,
            y2: tokenRect.y + tokenRect.h / 2
        };
        const firstIntervals = [];
        const secondIntervals = [];
        const transmissionCount = 15;
        const transmissionSpacing = 30 / transmissionCount;
        for (let i = 0; i < transmissionCount; i++) {
            const startSeconds = 3 + i * transmissionSpacing;
            firstIntervals.push({
                start: frames(startSeconds),
                end: frames(startSeconds + 0.6)
            });
            secondIntervals.push({
                start: frames(startSeconds + 0.3),
                end: frames(startSeconds + 0.9)
            });
        }

        connect1 = new Line(s, Object.assign({}, firstConnection, {
            start: connectionStart, duration: 0.5, mode: 1,
            strokeweight: 7, square: true, color: colors.outline
        }));
        connect2 = new Line(s, Object.assign({}, secondConnection, {
            start: connectionStart, duration: 0.5, mode: 1,
            strokeweight: 7, square: true, color: colors.outline
        }));
        transmit1 = new TransmitLine(s, Object.assign({}, firstConnection, {
            intervals: firstIntervals, strokeweight: 17,
            square: true, color: colors.transmit
        }));
        transmit2 = new TransmitLine(s, Object.assign({}, secondConnection, {
            intervals: secondIntervals, strokeweight: 17,
            square: true, color: colors.transmit
        }));

        model = new BrainBase(s, {
            start: modelStart,
            duration: frames(1.5)
        });
        firstThought = new Bubble(s, {
            x: refX + 127, y: refY - 25, w: 500, h: 250,
            font: font, size: 37,
            str: "Predict the next token.",
            start: frames(5), fill: colors.background, opacity: 230
        });
        secondThought = new Bubble(s, {
            x: refX + 127, y: refY - 25, w: 500, h: 250,
            font: font, size: 37,
            str: "I need post-training.",
            start: frames(10), fill: colors.background, opacity: 230
        });
        insightBulb = new Bulb(s, {
            emoji: emojiFont,
            str: "💡",
            color: [247, 248, 7],
            x: refX + 80,
            y: refY + 20,
            size: 60,
            start: frames(10),
            end: frames(14)
        });
        // Bubble normally delays its text; these thoughts begin at the named times.
        firstThought.text.start = frames(5);
        secondThought.text.start = frames(10);
        contextText = new Text(s, {
            str: textTokenPairs[0][0],
            x: dataRect.x + dataRect.w / 2,
            y: dataRect.y + dataRect.h / 2,
            mode: 1,
            size: 34,
            width: dataRect.w - 90,
            lineHeight: 48,
            justify: false,
            color: colors.foreground,
            start: textStart,
            font: font
        });
        tokenText = new Text(s, {
            str: textTokenPairs[0][1],
            x: tokenRect.x + tokenRect.w / 2,
            y: tokenRect.y + tokenRect.h / 2,
            mode: 1,
            size: 40,
            color: colors.token,
            start: textStart,
            font: font
        });
    };

    s.draw = function () {
        s.background.apply(s, colors.background);

        const pairIndex = Math.floor(
            Math.max(0, s.frameCount - textStart) / pairCycleFrames
        ) % textTokenPairs.length;
        contextText.reset({str: textTokenPairs[pairIndex][0]});
        tokenText.reset({str: textTokenPairs[pairIndex][1]});

        title.show();
        dataRect.show();
        modelRect.show();
        tokenRect.show();
        connect1.show();
        connect2.show();
        transmit1.show();
        transmit2.show();
        contextText.show();
        tokenText.show();
        model.showAt(refX + 10, refY, modelSize);
        if (s.frameCount >= frames(10))
            secondThought.show();
        else if (s.frameCount >= frames(5))
            firstThought.show();
        insightBulb.show();
        showFR(s);
    };
};

let dpo1 = new p5(DPOScene03);
