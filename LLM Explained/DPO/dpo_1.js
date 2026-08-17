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

class DPOTextBoundsHighlight {
    constructor(ctx, args) {
        this.s = ctx;
        this.bounds = args.bounds;
        this.start = args.start;
        this.end = args.end;
        this.durationFrames = frames(args.duration || 1);
        this.fadeFrames = frames(args.fadeDuration || 0.7);
        this.padding = args.padding === undefined ? 7 : args.padding;
        this.color = args.color || [249, 201, 17];
        this.strokeweight = args.strokeweight || 2;
        this.thinOnFade = args.thinOnFade === true;
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
        const fadeProgress = frame < this.end ? 0 : this.s.constrain(
            (frame - this.end) / this.fadeFrames, 0, 1
        );
        const alpha = 255 * (1 - fadeProgress);
        let remaining = (w + h) * 2 * progress;
        const sides = [[x, y, x + w, y, w], [x + w, y, x + w, y + h, h],
            [x + w, y + h, x, y + h, w], [x, y + h, x, y, h]];
        this.s.push();
        this.s.noFill();
        this.s.stroke(this.color[0], this.color[1], this.color[2], alpha);
        this.s.strokeWeight(this.strokeweight *
            (this.thinOnFade ? 1 - fadeProgress : 1));
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

const DPOScene19 = function (s) {
    const colors = {
        chosen: [77, 217, 153],
        rejected: [255, 112, 128],
        prompt: [77, 177, 255],
        foreground: [235, 241, 250],
        outline: [255, 255, 255]
    };
    const promptText = 'Prompt: "When is the next total solar eclipse in Beijing?"';
    const winnerTokens = ["It", "will", "happen", "on", "Sept", "2nd", "2035", "."];
    const loserTokens = ["Sept", "2035", "."];
    const promptSize = 40;
    const tokenSize = 45;
    const tokenGap = 14;
    const wordStagger = frames(0.08);
    const promptStartTime = frames(0.05);
    const winnerResponseStartTime = frames(0.3);
    const loserResponseStartTime = winnerResponseStartTime + frames(0.67);
    const winnerJumpStartTime = frames(3.5);
    const winnerJumpHeight = 35;
    const winnerJumpDuration = 0.6;
    const textMoveStartTime = frames(5);
    const winnerMoveDuration = frames(1.5);
    const loserMoveDuration = frames(2);
    const winnerTableStartTime = frames(6);
    const loserTableStartTime = frames(6.5);
    const tableAnimationDuration = frames(2);
    const endTokenFadeDuration = 0.5;
    const pipelineStartTime = frames(8);
    const rectangleStagger = frames(0.3);
    const rectangleAnimationDuration = 2;
    const rightmostRectangleStartTime = pipelineStartTime + rectangleStagger * 2;
    const connectionStartTime = pipelineStartTime + rectangleStagger * 2 +
        frames(rectangleAnimationDuration);
    const tableX = 180, winnerTableY = 570, loserTableY = 775;
    const tableTextSize = 45, tableCellWidth = 109;
    const refX = 1070, refY = 249;
    let font, prompt, winnerSubtitle, loserSubtitle;
    let winnerWords = [], loserWords = [];
    let winnerTable, loserTable, promptRect, refRect, outRect, referenceModel;
    let referenceLabel, outputLabel;
    let connect1, connect2;
    let winnerEndToken, loserEndToken;
    let textTransitions = [];

    function addTextTransition(text, target, duration) {
        textTransitions.push({
            text: text, fromX: text.x, fromY: text.y, fromSize: text.size,
            targetX: target.x, targetY: target.y, targetSize: target.size,
            duration: duration
        });
    }

    function updateTextTransitions() {
        const elapsed = s.frameCount - textMoveStartTime;
        if (elapsed < 0)
            return;
        textTransitions.forEach(function (transition) {
            const t = s.constrain(elapsed / transition.duration, 0, 1);
            const eased = t * t * (3 - 2 * t);
            transition.text.x = transition.fromX +
                (transition.targetX - transition.fromX) * eased;
            transition.text.y = transition.fromY +
                (transition.targetY - transition.fromY) * eased;
            transition.text.size = transition.fromSize +
                (transition.targetSize - transition.fromSize) * t;
        });
    }

    function tokenTarget(index, tableY) {
        return {
            x: tableX + tableCellWidth * (0.6 + (index + 1) * 1.4),
            y: tableY + tableTextSize * 0.6,
            size: tableTextSize
        };
    }

    // Draw only the grid and its row labels. Scene 19's independently moving
    // word objects occupy the token cells themselves.
    function showTableShell(table) {
        if (s.frameCount < table.start)
            return;
        table.horizLine.show();
        table.textX[0].show();
        table.textY[0].show();
        const visibleColumns = Math.round(
            table.timer.advance() * (table.numPts + 1)
        );
        for (let i = 0; i < table.numPts && i < visibleColumns; i++)
            table.vertLines[i].show();
    }

    function createTokenRow(tokens, y, start) {
        s.textSize(tokenSize);
        const widths = tokens.map(function (token) {
            return s.textWidth(token);
        });
        const gaps = tokens.slice(1).map(function (token) {
            return token === "." ? 0 : tokenGap;
        });
        const rowWidth = widths.reduce(function (sum, width) {
            return sum + width;
        }, 0) + gaps.reduce(function (sum, gap) {
            return sum + gap;
        }, 0);
        let x = (s.width - rowWidth) / 2;

        return tokens.map(function (token, index) {
            const word = new TextFade(s, {
                str: token,
                x: x + widths[index] / 2,
                y: y + tokenSize / 2,
                mode: 1,
                size: tokenSize,
                color: colors.foreground,
                start: start + wordStagger * index,
                duration: 0.25,
                font: font
            });
            x += widths[index] + (gaps[index] || 0);
            return word;
        });
    }

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);
        s.textFont(font);
        s.textSize(tokenSize);

        prompt = new TextFade(s, {
            str: promptText,
            x: s.width / 2,
            y: s.height / 4,
            mode: 1,
            size: promptSize,
            color: colors.prompt,
            start: promptStartTime,
            duration: 0.1,
            font: font
        });
        s.textSize(31);
        const winnerSubtitleText = "Response A - winner";
        winnerSubtitle = new TextFade(s, {
            str: winnerSubtitleText,
            x: s.width / 2 - s.textWidth(winnerSubtitleText) / 2,
            y: 414.5,
            mode: 0,
            size: 31,
            color: colors.chosen,
            start: winnerResponseStartTime,
            font: font
        });
        winnerWords = createTokenRow(winnerTokens, 475, winnerResponseStartTime);
        s.textSize(31);
        const loserSubtitleText = "Response B - loser";
        loserSubtitle = new TextFade(s, {
            str: loserSubtitleText,
            x: s.width / 2 - s.textWidth(loserSubtitleText) / 2,
            y: 609.5,
            mode: 0,
            size: 31,
            color: colors.rejected,
            start: loserResponseStartTime,
            font: font
        });
        loserWords = createTokenRow(loserTokens, 670, loserResponseStartTime);

        addTextTransition(prompt,
            {x: refX - 545, y: refY + 49, size: 29}, winnerMoveDuration);
        addTextTransition(winnerSubtitle,
            {x: 180, y: 530, size: 31}, winnerMoveDuration);
        winnerWords.forEach(function (word, index) {
            addTextTransition(word, tokenTarget(index, winnerTableY),
                winnerMoveDuration);
        });
        addTextTransition(loserSubtitle,
            {x: 180, y: 735, size: 31}, loserMoveDuration);
        loserWords.forEach(function (word, index) {
            addTextTransition(word, tokenTarget(index, loserTableY),
                loserMoveDuration);
        });

        winnerTable = new Table(s, {
            x: tableX, y: winnerTableY, xs: winnerTokens.concat([""]),
            ys: winnerTokens.concat([""]).map(function () { return ""; }),
            label1: "text", label2: "prob.", start: winnerTableStartTime,
            duration: tableAnimationDuration, font: font,
            colorX: colors.foreground, colorY: colors.chosen,
            size: tableTextSize, sizeX: tableCellWidth
        });
        loserTable = new Table(s, {
            x: tableX, y: loserTableY, xs: loserTokens.concat([""]),
            ys: loserTokens.concat([""]).map(function () { return ""; }),
            label1: "text", label2: "prob.", start: loserTableStartTime,
            duration: tableAnimationDuration, font: font,
            colorX: colors.foreground, colorY: colors.rejected,
            size: tableTextSize, sizeX: tableCellWidth
        });
        winnerEndToken = new TextFade(s, {
            str: "<end>",
            x: tokenTarget(winnerTokens.length, winnerTableY).x,
            y: tokenTarget(winnerTokens.length, winnerTableY).y,
            mode: 1, size: tableTextSize, color: colors.foreground,
            start: winnerTableStartTime + tableAnimationDuration -
                frames(endTokenFadeDuration),
            duration: endTokenFadeDuration, font: font
        });
        loserEndToken = new TextFade(s, {
            str: "<end>",
            x: tokenTarget(loserTokens.length, loserTableY).x,
            y: tokenTarget(loserTokens.length, loserTableY).y,
            mode: 1, size: tableTextSize, color: colors.foreground,
            start: loserTableStartTime + tableAnimationDuration -
                frames(endTokenFadeDuration),
            duration: endTokenFadeDuration, font: font
        });

        promptRect = new LinedRect(s, {
            x: refX - 940, y: refY - 20, w: 790, h: 220,
            start: pipelineStartTime, duration: rectangleAnimationDuration, mode: 2,
            strokeweight: 2, color: colors.outline
        });
        refRect = new LinedRect(s, {
            x: refX - 40, y: refY - 20, w: 330, h: 220,
            start: pipelineStartTime + rectangleStagger,
            duration: rectangleAnimationDuration, mode: 2,
            strokeweight: 2, color: colors.outline
        });
        outRect = new LinedRect(s, {
            x: refX + 400, y: refY - 20, w: 290, h: 220,
            start: rightmostRectangleStartTime,
            duration: rectangleAnimationDuration, mode: 2,
            strokeweight: 2, color: colors.outline
        });
        outputLabel = new TextFade(s, {
            str: "Response\nprobabilities",
            x: outRect.x + outRect.w / 2,
            y: outRect.y + outRect.h / 2,
            size: 37,
            mode: 1,
            color: colors.foreground,
            start: rightmostRectangleStartTime,
            duration: 0.7,
            font: font
        });
        connect1 = new Line(s, {
            x1: promptRect.x + promptRect.w,
            y1: promptRect.y + promptRect.h / 2,
            x2: refRect.x,
            y2: refRect.y + refRect.h / 2,
            start: connectionStartTime, duration: 0.5, mode: 1,
            strokeweight: 7, square: true, color: colors.outline
        });
        connect2 = new Line(s, {
            x1: refRect.x + refRect.w,
            y1: refRect.y + refRect.h / 2,
            x2: outRect.x,
            y2: outRect.y + outRect.h / 2,
            start: connectionStartTime, duration: 0.5, mode: 1,
            strokeweight: 7, square: true, color: colors.outline
        });
        referenceModel = new BrainBase(s, {
            start: pipelineStartTime, duration: frames(1.5)
        });
        referenceLabel = new TextFade(s, {
            str: "trainable\nmodel",
            x: refX + 210, y: refY + 150,
            size: 27, mode: 1, color: colors.foreground,
            start: pipelineStartTime, duration: 0.7, font: font
        });
    };

    s.draw = function () {
        s.background(8, 12, 22);
        updateTextTransitions();

        if (s.frameCount === winnerJumpStartTime) {
            winnerSubtitle.jump(winnerJumpHeight, winnerJumpDuration);
            winnerWords.forEach(function (word) {
                word.jump(winnerJumpHeight, winnerJumpDuration);
            });
        }

        promptRect.show();
        refRect.show();
        outRect.show();
        connect1.show();
        connect2.show();
        referenceModel.showAt(refX, refY, 420);
        referenceLabel.show();
        outputLabel.show();
        prompt.show();
        winnerSubtitle.show();
        winnerWords.forEach(function (word) { word.show(); });
        loserSubtitle.show();
        loserWords.forEach(function (word) { word.show(); });
        showTableShell(winnerTable);
        showTableShell(loserTable);
        winnerEndToken.show();
        loserEndToken.show();
        // showFR(s);
    };
};

const DPOScene20 = function (s, args) {
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
    const logProbabilitySequence = args.logProbabilitySequence === true;
    const lossTransitionSequence = args.lossTransitionSequence === true;
    const winnerDirectLogSequence = args.winnerDirectLogSequence === true;
    const winnerSequenceDelay = args.winnerSequenceDelay || 0;
    const subsequentAnimationDelay = args.subsequentAnimationDelay || 0;
    const logSequenceDelay = args.logSequenceDelay || 0;
    const modelLabelText = args.modelLabel || "trainable\nmodel";
    const modelSubscript = args.modelSubscript || "\\theta";
    const scene19ElementsStartTime = frames(0.5);
    const timing = Object.assign({
        pipelineStart: scene19ElementsStartTime,
        subtitleStart: frames(0.8),
        promptStart: scene19ElementsStartTime,
        modelStart: scene19ElementsStartTime,
        connectionStart: scene19ElementsStartTime,
        tableAStart: scene19ElementsStartTime,
        tableBStart: scene19ElementsStartTime,
        titleAStart: scene19ElementsStartTime,
        titleBStart: scene19ElementsStartTime,
        winnerProbabilitiesStart: frames(10),
        loserProbabilitiesStart: frames(11.5),
        loserEquationStart: frames(7),
        loserNllStart: frames(10),
        rigorousEquationStart: frames(13)
    }, args.timing || {});
    let font, italicFont, title, subtitle, prompt, promptRect;
    let connect1, connect2;
    let inference1, inference2;
    let inference1Times = args.inference1Times || [
        {start: frames(10.5), end: frames(11.1)},
    ];
    let inference2Times = args.inference2Times || [
        {start: frames(11.1), end: frames(11.7)},
    ];
    let attentionWords = [], attentionEdges = [];
    let causalMaskingTitle, causalMaskingFadeStarted = false;
    let referenceModel, referenceLabel, outputLabel, outRect, refRect;
    let referenceHighlight;
    let referenceModelSize = 420, refX = 1070, refY = 249;
    let tableTitles = [], tables = [];
    let probabilityTexts = [[], []];
    let winnerProbabilityEquation, loserProbabilityEquation;
    let loserTextReplacement, winnerLabelReplacement;
    let preferenceLikelihoodExpressions, winnerFinalLogExpression;
    let loserValueExpression, loserTextSumHighlight;
    let winnerResponse, loserResponse, winnerLogEquation, loserLogEquation;
    let rejectedArrow, rejectedLabel, leftRectHighlight, loserProbabilityHighlight;
    let conditionalProbabilityExpression;
    let promptProbabilityNote;
    let conditionalFinalExpression;
    let rightBoxWords = [], rightBoxCross = [];
    let scene25WinnerLabel, scene25WinnerCopies = [], scene25WinnerMoves = [];
    let scene25LoserLabel, scene25LoserResponse;
    let scene25LeftHighlight, scene25WinnerMoveStarted = false;
    let scene25WinnerStartTime;
    let rightBoxFadeStarted = false, outputLabelFadeStarted = false;
    let outputLabelReturnStarted = false, conditionalFadeStarted = false;
    let rejectedTokenCopies = [], rejectedTokenMoves = [];
    let loserRigorousTransitionStarted = false;
    let loserValueTransitionStarted = false;
    let loserEquationStartTime = timing.loserEquationStart,
        loserNllStartTime = timing.loserNllStart,
        loserRigorousEquationStartTime = timing.rigorousEquationStart;
    let winnerProbabilitiesStartTime = timing.winnerProbabilitiesStart,
        loserProbabilitiesStartTime = timing.loserProbabilitiesStart;
    const probabilityEntryStagger = frames(0.1);
    const attentionMaskEndTime = frames(49);
    const attentionFadeDuration = 0.7;
    const loserArrowStartTime = attentionMaskEndTime +
        frames(attentionFadeDuration + 1);
    const loserArrowEndTime = loserArrowStartTime + frames(2);
    const rejectedArrowStartTime = frames(4);
    const rejectedArrowEndTime = frames(5);
    const rejectedLineStartTime = frames(6.5);
    const rejectedTokenMoveDuration = frames(1.2);
    const loserValueStartTime = frames(13);
    const loserValueTransitionTime = loserValueStartTime +
        subsequentAnimationDelay;
    let tableAStart = timing.tableAStart, tableBStart = timing.tableBStart;
    let loserProbabilityArrows = [];

    function createProbabilityTexts(values, table, color, start) {
        let texts = [];
        for (let i = 0; i < values.length; i++) {
            const targetY = table.y + table.sizeY * 1.8;
            texts[i] = new TextFade(s, {
                str: values[i],
                x: table.x + table.sizeX * (0.6 + (i + 1) * 1.4),
                y: targetY + (logProbabilitySequence ? 35 : 0),
                mode: 1,
                size: table.sizeY,
                color: color,
                start: start + probabilityEntryStagger * i,
                duration: 0.5,
                font: font
            });
            if (logProbabilitySequence) {
                texts[i].entryTargetY = targetY;
                texts[i].entryStarted = false;
            }
        }
        return texts;
    }

    function createAttentionMask() {
        let attentionMaskStartTime = frames(42),
            attentionArcStartTime = frames(45),
            attentionArcStartRange = frames(2),
            attentionMaskSeed = 2035;
        s.randomSeed(attentionMaskSeed);
        causalMaskingTitle = new TextWriteIn(s, {
            str: "Causal Masking",
            x: s.width / 2,
            y: 90,
            mode: 1,
            size: 47,
            color: colors.foreground,
            start: frames(39),
            charactersPerSecond: 24,
            font: font
        });
        const words = [
            "When", "is", "the", "next", "total", "solar",
            "eclipse", "in", "Beijing", "Sept", "2035"
        ];
        const left = 570;
        const right = 1350;
        const y = 140;
        const spacing = (right - left) / (words.length - 1);
        const wordStagger = frames(0.07);
        const wordFadeDuration = 0.5;

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
                start: attentionArcStartTime + Math.round(
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
        outputLabel = new TextFade(s, {
            str: "Response\nprobabilities",
            x: outRect.x + outRect.w / 2,
            y: outRect.y + outRect.h / 2,
            size: 37,
            mode: 1,
            color: colors.foreground,
            start: frames(1),
            duration: 0.7,
            font: font
        });

        referenceModel = new BrainBase(s, {
            start: timing.modelStart, duration: frames(1.5),
            respawnTimes: args.modelRespawnTimes || [frames(10.5)]
        });
        referenceLabel = new TextFade(s, {
            str: modelLabelText, x: refX + 210, y: refY + 150,
            size: 27, mode: 1, color: colors.foreground,
            start: timing.modelStart, duration: 1, font: font
        });
        if (args.highlightReferenceModel) {
            referenceHighlight = new DPOTextBoundsHighlight(s, {
                bounds: function () {
                    s.textFont(font);
                    s.textSize(referenceLabel.size);
                    const width = Math.max(
                        s.textWidth("reference"), s.textWidth("model")
                    );
                    const height = referenceLabel.size * 2.4;
                    return {
                        x: referenceLabel.x - width / 2 - 5,
                        y: referenceLabel.y - height / 2,
                        width: width + 10,
                        height: height
                    };
                },
                start: frames(5.7),
                end: frames(7),
                duration: 1,
                fadeDuration: 0.7,
                padding: 7
            });
        }

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
            label1: "text", label2: logProbabilitySequence ? "log(p)" : "prob.",
            start: tableAStart,
            duration: frames(3), font: font,
            colorX: colors.foreground, colorY: chosen_color,
            size: 45, sizeX: 109
        });
        tables[1] = new Table(s, {
            x: 180, y: 775, xs: ["Sept", "2035", ".", "<end>"],
            ys: ["", "", "", ""], label1: "text",
            label2: logProbabilitySequence ? "log(p)" : "prob.",
            start: tableBStart, duration: frames(3), font: font,
            colorX: colors.foreground, colorY: rejected_color,
            size: 45, sizeX: 109
        });

        probabilityTexts[0] = createProbabilityTexts(
            chosenProbabilities.map(function (p) {
                return (logProbabilitySequence || winnerDirectLogSequence) ?
                    Math.log(p).toFixed(2) :
                    p.toFixed(2);
            }),
            tables[0], chosen_color, winnerProbabilitiesStartTime
        );
        probabilityTexts[1] = createProbabilityTexts(
            loserProbabilities.map(function (p) {
                return logProbabilitySequence ? Math.log(p).toFixed(2) :
                    p.toFixed(2);
            }),
            tables[1], rejected_color, loserProbabilitiesStartTime
        );
        if (!logProbabilitySequence && !lossTransitionSequence) {
            probabilityTexts[1].forEach(function (text) {
                text.entryTargetY = text.y;
                text.y += 35;
                text.entryStarted = false;
            });
        }
        if (winnerDirectLogSequence) {
            probabilityTexts[0].forEach(function (text) {
                text.entryTargetY = text.y;
                text.y += 35;
                text.entryStarted = false;
            });
        }
    }

    function createLoserProbabilityArrows() {
        for (let i = 0; i < probabilityTexts[1].length; i++) {
            const probability = probabilityTexts[1][i];
            const targetY = probability.entryTargetY === undefined ?
                probability.y : probability.entryTargetY;
            const arrowTipY = targetY + probability.size / 2 + 10;
            loserProbabilityArrows[i] = new Arrow(s, {
                x1: probability.x,
                y1: arrowTipY + 50,
                x2: probability.x,
                y2: arrowTipY,
                start: loserArrowStartTime,
                end: loserArrowEndTime,
                duration: 0.5,
                strokeweight: 4,
                tipLen: 13,
                color: colors.transmit
            });
        }
    }

    function createLogProbabilitySequence() {
        const winnerLogProbability = chosenProbabilities.reduce(
            function (sum, p) { return sum + Math.log(p); }, 0
        ).toFixed(2);
        const loserLogProbability = loserProbabilities.reduce(
            function (sum, p) { return sum + Math.log(p); }, 0
        ).toFixed(2);

        winnerResponse = new TextFade(s, {
            str: "Winner: It will happen on Sept 2nd 2035.",
            x: promptRect.x + promptRect.w / 2,
            y: promptRect.y + promptRect.h / 2 + 42,
            mode: 1,
            size: 31,
            color: chosen_color,
            start: frames(6.5) + logSequenceDelay,
            end: frames(9.5) + logSequenceDelay,
            duration: 1,
            font: font
        });
        loserResponse = new TextFade(s, {
            str: "Loser: Sept 2035.",
            x: promptRect.x + promptRect.w / 2,
            y: promptRect.y + promptRect.h / 2 + 42,
            mode: 1,
            size: 31,
            color: rejected_color,
            start: frames(9.5) + logSequenceDelay,
            duration: 1,
            font: font
        });
        winnerLogEquation = new Katex(s, {
            text: "\\log \\pi_{\\mathrm{ref}}(y_w\\mid x)=" +
                winnerLogProbability,
            x: 1000,
            y: 745,
            mode: 0,
            font_size: 40,
            color: "#4dd999",
            start: frames(8) + logSequenceDelay,
            entryMode: "moveUp",
            entryOffset: 45,
            entryDuration: 0.7
        });
        loserLogEquation = new Katex(s, {
            text: "\\log \\pi_{\\mathrm{ref}}(y_l\\mid x)=" +
                loserLogProbability,
            x: 1000,
            y: 840,
            mode: 0,
            font_size: 40,
            color: "#ff7080",
            start: frames(10.5) + logSequenceDelay,
            entryMode: "moveUp",
            entryOffset: 45,
            entryDuration: 0.7
        });
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

        winnerProbabilityEquation = new TextFade(s, {
            str: "P(winner) = " + chosenProbabilities.map(function (p) {
                return p.toFixed(2);
            }).join(" × ") + " = " + chosenProbability.toFixed(2),
            x: 1000, y: 745, mode: 0, size: 40,
            color: chosen_color, start: loserEquationStartTime,
            duration: 0.7, font: font
        });
        loserProbabilityEquation = new TextWriteIn(s, {
            str: "P(loser) = " + loserProbabilities.map(function (p) {
                return p.toFixed(2);
            }).join(" × ") + " = " +
                loserProbability.toFixed(2),
            x: 1000, y: 840, mode: 0, size: 40,
            color: rejected_color, start: loserEquationStartTime,
            charactersPerSecond: 45, font: font
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
        winnerLabelReplacement = new TextReplace(s, {
            oldTexts: [tables[0].textY[0]],
            newStrings: ["log(p)"],
            start: loserNllStartTime,
            duration: 0.8,
            offsetY: 45
        });

        const winnerLastProbabilityStart = winnerProbabilitiesStartTime +
            probabilityEntryStagger * (chosenProbabilities.length - 1);
        winnerFinalLogExpression = new Katex(s, {
            text: "\\log \\pi_{" + modelSubscript + "}(y_w\\mid x)=" +
                chosenLogProbability,
            x: 1000, y: 745, mode: 0, font_size: 40,
            color: "#4dd999", start: winnerLastProbabilityStart,
            entryMode: "moveDown", entryOffset: 45, entryDuration: 0.7
        });
        if (winnerDirectLogSequence) {
            const loserNllEquation = loserTextReplacement.newTexts[
                loserTextReplacement.newTexts.length - 1
            ];
            loserTextSumHighlight = new DPOTextBoundsHighlight(s, {
                bounds: function () {
                    s.textFont(font);
                    s.textSize(loserNllEquation.size);
                    return {
                        x: loserNllEquation.x,
                        y: loserNllEquation.y,
                        width: s.textWidth(loserNllEquation.str),
                        height: loserNllEquation.size
                    };
                },
                start: loserRigorousEquationStartTime,
                end: loserValueStartTime,
                duration: 1,
                fadeDuration: 0.7,
                padding: 7,
                strokeweight: 2,
                color: [247, 227, 47]
            });
            loserValueExpression = new Katex(s, {
                text: "\\log \\pi_{\\theta}(y_l\\mid x)=-1.63",
                x: 1000, y: 840, mode: 0, font_size: 40,
                color: "#ff7080", start: loserValueTransitionTime,
                entryMode: "moveDown", entryOffset: 45,
                entryDuration: 0.8
            });
        }

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

    function createScene20Cues() {
        const promptProbabilityNoteStartTime = frames(14);
        promptProbabilityNote = new TextFade(s, {
            str: "Note: prompt token probabilities are also calculated but ignored.",
            x: 60,
            y: 50,
            mode: 0,
            size: 29,
            font: italicFont,
            color: [190, 197, 207],
            start: promptProbabilityNoteStartTime,
            end: promptProbabilityNoteStartTime + frames(2.5),
            duration: 0.7
        });
        function conditionalParts(sample, promptPart, history, initial) {
            const specs = [
                {key: "probability_open", text: "P\\!\\bigl(",
                    color: "#ffffff", start: frames(18.5)},
                {key: "sample_loser", text: sample,
                    color: "#ff7080", start: frames(14)},
                {key: "condition_bar", text: "\\mid",
                    color: "#ffffff", start: frames(15.5)},
                {key: "prompt_x", text: promptPart,
                    color: "#4db1ff", start: frames(16)},
                {key: "condition_comma", text: ",",
                    color: "#ffffff", start: frames(16)},
                {key: "rejection_condition", text: history,
                    color: "#ff7080", start: frames(17)},
                {key: "probability_close", text: "\\bigr)",
                    color: "#ffffff", start: frames(18.5)}
            ];
            if (!initial)
                return specs.map(function (part) {
                    const copy = Object.assign({}, part);
                    delete copy.start;
                    return copy;
                });
            return specs.map(function (part) {
                return Object.assign({}, part, {
                    enterDuration: 0.5,
                    enterFrom: {x: 0, y: -30}
                });
            });
        }

        conditionalProbabilityExpression = new AnimatedKatex(s, {
            x: 1100, y: 820, mode: 0, font_size: 40,
            parts: conditionalParts("y_t", "x", "y_{<t}", true)
        });
        let quotedYearExpression = conditionalProbabilityExpression.transitionTo(
            conditionalParts("\\text{“2035”}", "x", "y_{<t}", false),
            {start: frames(21.5), duration: 0.8, offsetY: 28,
                anchorKey: "condition_bar"}
        );
        let promptNamedExpression = quotedYearExpression.transitionTo(
            conditionalParts("\\text{“2035”}", "\\text{Prompt}",
                "y_{<t}", false),
            {start: frames(23.2), duration: 0.8, offsetY: 28,
                anchorKey: "condition_bar"}
        );
        conditionalFinalExpression = promptNamedExpression.transitionTo(
            conditionalParts("\\text{“2035”}", "\\text{Prompt}",
                "\\text{“Sept”}", false),
            {start: frames(25), duration: 0.8, offsetY: 28,
                anchorKey: "condition_bar"}
        );

        loserProbabilityHighlight = new DPOTextBoundsHighlight(s, {
            bounds: function () {
                const probability = probabilityTexts[1][1];
                s.textFont(font);
                s.textSize(probability.size);
                const width = s.textWidth(probability.str);
                return {
                    x: probability.x - width / 2,
                    y: probability.y - probability.size / 2 + 5,
                    width: width,
                    height: probability.size - 5
                };
            },
            start: frames(20),
            end: frames(27),
            duration: 0.7,
            fadeDuration: 0.7,
            padding: 7,
            strokeweight: 3,
            thinOnFade: true,
            color: [247, 227, 47]
        });

        const rightBoxRows = [
            ["The", "next", "total"],
            ["solar", "eclipse"],
            ["in", "Beijing"]
        ];
        let wordIndex = 0;
        s.textFont(font);
        s.textSize(31);
        rightBoxRows.forEach(function (row, rowIndex) {
            let wordX = outRect.x + 42;
            row.forEach(function (word) {
                const width = s.textWidth(word);
                rightBoxWords.push(new TextFade(s, {
                    str: word,
                    x: wordX,
                    y: outRect.y + 35 + rowIndex * 58,
                    mode: 0,
                    size: 31,
                    color: colors.foreground,
                    start: frames(30 + wordIndex * 0.5),
                    duration: 0.5,
                    font: font
                }));
                wordX += width + s.textWidth(" ");
                wordIndex++;
            });
        });
        rightBoxCross = [
            new Line(s, {
                x1: outRect.x + 24, y1: outRect.y + 24,
                x2: outRect.x + outRect.w - 24,
                y2: outRect.y + outRect.h - 24,
                start: frames(32.5), end: frames(34),
                duration: 1, mode: 1, strokeweight: 5,
                color: colors.rejected
            }),
            new Line(s, {
                x1: outRect.x + outRect.w - 24, y1: outRect.y + 24,
                x2: outRect.x + 24,
                y2: outRect.y + outRect.h - 24,
                start: frames(32.5), end: frames(34),
                duration: 1, mode: 1, strokeweight: 5,
                color: colors.rejected
            })
        ];
        rightBoxCross.forEach(function (line) {
            line.timer_sw = new StrokeWeightTimer(s, frames(34), 5, 1);
        });
        leftRectHighlight = new DPOTextBoundsHighlight(s, {
            bounds: function () {
                return {
                    x: promptRect.x,
                    y: promptRect.y,
                    width: promptRect.w,
                    height: promptRect.h
                };
            },
            start: frames(8.5),
            end: frames(10),
            duration: 1,
            fadeDuration: 0.7,
            padding: 0,
            strokeweight: 5,
            color: [247, 227, 47]
        });
        rejectedArrow = new Arrow(s, {
            x1: 105, y1: 750,
            x2: 165, y2: 750,
            start: rejectedArrowStartTime,
            end: rejectedArrowEndTime,
            duration: 0.25,
            strokeweight: 4,
            color: colors.outline,
            tipLen: 14
        });

        const rejectedText = "Rejected:";
        const rejectedSize = 29;
        s.textFont(font);
        s.textSize(prompt.size);
        const rejectedX = prompt.x - s.textWidth(prompt.str) / 2;
        const rejectedY = promptRect.y + promptRect.h / 2 + 40;
        rejectedLabel = new TextWriteIn(s, {
            str: rejectedText,
            x: rejectedX,
            y: rejectedY,
            mode: 3,
            size: rejectedSize,
            color: rejected_color,
            start: rejectedLineStartTime,
            charactersPerSecond: 22,
            font: font
        });

        s.textSize(rejectedSize);
        let targetX = rejectedX + s.textWidth(rejectedText) + s.textWidth(" ");
        const copyStrings = ["Sept", "2035", "."];
        copyStrings.forEach(function (str, index) {
            const targetWidth = s.textWidth(str);
            const source = tables[1].textX[index + 1];
            const copy = new Text(s, {
                str: str,
                x: source.x,
                y: source.y,
                mode: 1,
                size: source.size,
                color: colors.foreground,
                start: rejectedLineStartTime,
                font: font
            });
            const targetCenterX = targetX + targetWidth / 2;
            rejectedTokenCopies.push(copy);
            rejectedTokenMoves.push({
                text: copy,
                fromX: copy.x,
                fromY: copy.y,
                fromSize: copy.size,
                targetX: targetCenterX,
                targetY: rejectedY,
                targetSize: rejectedSize,
                positionTimer: new Timer2(rejectedTokenMoveDuration),
                sizeTimer: new Timer0(rejectedTokenMoveDuration)
            });
            targetX += targetWidth + (str === "2035" ? 0 : s.textWidth(" "));
        });
    }

    function showScene20Cues() {
        promptProbabilityNote.show();
        if (!conditionalFadeStarted && s.frameCount >= frames(27)) {
            Object.values(conditionalFinalExpression.partStates).forEach(
                function (state) {
                    state.end = s.frameCount;
                    state.exitFrames = frames(1);
                    state.exitTo = {x: 0, y: 0};
                    state.fadeOut = true;
                }
            );
            conditionalFadeStarted = true;
        }
        if (!outputLabelFadeStarted && s.frameCount >= frames(29)) {
            outputLabel.ft.fadeOut(1);
            outputLabelFadeStarted = true;
        }
        if (!rightBoxFadeStarted && s.frameCount >= frames(34)) {
            rightBoxWords.forEach(function (word) { word.ft.fadeOut(1); });
            rightBoxFadeStarted = true;
        }
        if (!outputLabelReturnStarted && s.frameCount >= frames(35)) {
            outputLabel.ft.reColor(outputLabel.color, 1);
            outputLabelReturnStarted = true;
        }

        conditionalProbabilityExpression.show();
        loserProbabilityHighlight.show();
        leftRectHighlight.show();
        rejectedArrow.show();
        rejectedLabel.show();
        if (s.frameCount >= rejectedLineStartTime) {
            rejectedTokenMoves.forEach(function (move) {
                const positionT = move.positionTimer.advance();
                const sizeT = move.sizeTimer.advance();
                move.text.x = move.fromX +
                    (move.targetX - move.fromX) * positionT;
                move.text.y = move.fromY +
                    (move.targetY - move.fromY) * positionT;
                move.text.size = move.fromSize +
                    (move.targetSize - move.fromSize) * sizeT;
                move.text.show();
            });
        }
        rightBoxWords.forEach(function (word) { word.show(); });
        rightBoxCross.forEach(function (line) { line.show(); });
    }

    function createScene25WinnerSequence() {
        const start = frames(15) + winnerSequenceDelay;
        const duration = frames(1.5);
        const labelText = "Winner:";
        const labelSize = 29;
        s.textFont(font);
        s.textSize(prompt.size);
        const lineX = prompt.x - s.textWidth(prompt.str) / 2;
        const lineY = promptRect.y + promptRect.h / 2 + 40;
        scene25WinnerStartTime = start;

        scene25LoserLabel = new TextFade(s, {
            str: "Rejected:", x: lineX, y: lineY, mode: 3,
            size: labelSize, color: rejected_color, start: -1,
            end: loserValueStartTime + frames(2.5) + subsequentAnimationDelay,
            duration: 0.7,
            font: font
        });
        scene25LoserLabel.ft = new FillChanger(s, rejected_color.slice());
        s.textSize(labelSize);
        scene25LoserResponse = new TextFade(s, {
            str: "Sept 2035.",
            x: lineX + s.textWidth("Rejected:") + s.textWidth(" "),
            y: lineY, mode: 3, size: labelSize,
            color: colors.foreground, start: -1,
            end: loserValueStartTime + frames(2.5) + subsequentAnimationDelay,
            duration: 0.7,
            font: font
        });
        scene25LoserResponse.ft = new FillChanger(
            s, colors.foreground.slice()
        );

        scene25WinnerLabel = new TextWriteIn(s, {
            str: labelText, x: lineX, y: lineY, mode: 3,
            size: labelSize, color: chosen_color, start: start,
            charactersPerSecond: 22, font: font
        });
        s.textSize(labelSize);
        let targetX = lineX + s.textWidth(labelText) + s.textWidth(" ");
        const strings = ["It", "will", "happen", "on", "Sept", "2nd", "2035", "."];
        strings.forEach(function (str, index) {
            const width = s.textWidth(str);
            const source = tables[0].textX[index + 1];
            const copy = new Text(s, {
                str: str, x: source.x, y: source.y, mode: 1,
                size: source.size, color: colors.foreground,
                start: start, font: font
            });
            scene25WinnerCopies.push(copy);
            scene25WinnerMoves.push({
                text: copy, fromX: copy.x, fromY: copy.y, fromSize: copy.size,
                targetX: targetX + width / 2, targetY: lineY,
                targetSize: labelSize,
                positionTimer: new Timer2(duration),
                sizeTimer: new Timer0(duration)
            });
            targetX += width + (str === "2035" ? 0 : s.textWidth(" "));
        });
        scene25LeftHighlight = new DPOTextBoundsHighlight(s, {
            bounds: function () {
                return {x: promptRect.x, y: promptRect.y,
                    width: promptRect.w, height: promptRect.h};
            },
            start: start, end: start + frames(1.5), duration: 1,
            fadeDuration: 0.7, padding: 0, strokeweight: 5,
            color: [247, 227, 47]
        });
    }

    function showScene25WinnerSequence() {
        scene25LoserLabel.show();
        scene25LoserResponse.show();
        scene25LeftHighlight.show();
        scene25WinnerLabel.show();
        if (s.frameCount >= scene25WinnerStartTime) {
            scene25WinnerMoves.forEach(function (move) {
                const positionT = move.positionTimer.advance();
                const sizeT = move.sizeTimer.advance();
                move.text.x = move.fromX + (move.targetX - move.fromX) * positionT;
                move.text.y = move.fromY + (move.targetY - move.fromY) * positionT;
                move.text.size = move.fromSize +
                    (move.targetSize - move.fromSize) * sizeT;
                move.text.show();
            });
        }
    }

    function showLoserRigorousTransition() {
        const loserNllEquation = loserTextReplacement.newTexts[
            loserTextReplacement.newTexts.length - 1
        ];

        if (!loserRigorousTransitionStarted &&
            s.frameCount >= loserRigorousEquationStartTime) {
            if (!winnerDirectLogSequence) {
                winnerProbabilityEquation.ft.fadeOut(0.8);
                loserNllEquation.ft.fadeOut(0.8);
                loserNllEquation.move(
                    loserNllEquation.x, loserNllEquation.y + 45, 0.8, 1
                );
                preferenceLikelihoodExpressions.beginLoserMove();
            }
            loserRigorousTransitionStarted = true;
        }

        if (winnerDirectLogSequence) {
            if (!loserValueTransitionStarted &&
                s.frameCount >= loserValueTransitionTime) {
                loserNllEquation.ft.fadeOut(0.8);
                loserNllEquation.move(
                    loserNllEquation.x, loserNllEquation.y + 45, 0.8, 1
                );
                loserValueTransitionStarted = true;
            }
            loserTextSumHighlight.show();
            loserValueExpression.show();
        } else {
            preferenceLikelihoodExpressions.show();
        }
    }

    function showModelPipeline() {
        promptRect.show();
        outRect.show();
        refRect.show();
        if (referenceHighlight)
            referenceHighlight.show();
        inference1.show();
        inference2.show();
        connect1.show();
        connect2.show();
        prompt.show();
        referenceModel.showAt(refX, refY, referenceModelSize);
        referenceLabel.show();
        outputLabel.show();
    }

    function showResponses() {
        for (let text of tableTitles)
            text.show();
        for (let table of tables)
            table.show();
        if (logProbabilitySequence || lossTransitionSequence) {
            for (let texts of probabilityTexts) {
                for (let text of texts) {
                    if ((logProbabilitySequence || text.entryTargetY !== undefined) &&
                        !text.entryStarted &&
                        s.frameCount >= text.start) {
                        text.move(text.x, text.entryTargetY, 0.5, 2);
                        text.entryStarted = true;
                    }
                    text.show();
                }
            }
        } else {
            for (let text of probabilityTexts[1]) {
                if (!text.entryStarted && s.frameCount >= text.start) {
                    text.move(text.x, text.entryTargetY, 0.5, 2);
                    text.entryStarted = true;
                }
                text.show();
            }
        }
        if (logProbabilitySequence) {
            winnerResponse.show();
            loserResponse.show();
            winnerLogEquation.show();
            loserLogEquation.show();
        } else {
            if (lossTransitionSequence) {
                if (!winnerDirectLogSequence)
                    winnerProbabilityEquation.show();
                loserProbabilityEquation.show();
                loserTextReplacement.show();
                winnerLabelReplacement.show();
                if (winnerDirectLogSequence)
                    winnerFinalLogExpression.show();
                showLoserRigorousTransition();
            }
        }
    }

    function showAttentionMask() {
        if (!causalMaskingFadeStarted && s.frameCount >= frames(41)) {
            causalMaskingTitle.ft.fadeOut(0.7);
            causalMaskingFadeStarted = true;
        }
        causalMaskingTitle.show();
        for (let edge of attentionEdges)
            edge.show();
        for (let word of attentionWords)
            word.show();
        for (let arrow of loserProbabilityArrows)
            arrow.show();
    }

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
        italicFont = s.loadFont("../../lib/font/timesi.ttf");
    };

    s.setup = function () {
        setup2D(s);
        createModelPipeline();
        if (showAttention)
            createAttentionMask();
        createSceneText();
        createResponseTables();
        if (showAttention)
            createLoserProbabilityArrows();
        if (logProbabilitySequence)
            createLogProbabilitySequence();
        else {
            createLoserLossTransition();
            if (!lossTransitionSequence)
                createScene20Cues();
            if (winnerDirectLogSequence)
                createScene25WinnerSequence();
        }
    };

    s.draw = function () {
        // title.show();
        // subtitle.show();
        showModelPipeline();
        showResponses();
        if (!logProbabilitySequence && !lossTransitionSequence)
            showScene20Cues();
        if (winnerDirectLogSequence)
            showScene25WinnerSequence();
        if (showAttention)
            showAttentionMask();
        // showFR(s);
    };
};

const DPOScene25 = function (s) {
    const sharedSceneStartTime = frames(0.5);
    const subsequentDelay = frames(2);
    const winnerDelay = frames(4) + subsequentDelay;

    DPOScene20(s, {
        showAttention: false,
        lossTransitionSequence: true,
        winnerDirectLogSequence: true,
        winnerSequenceDelay: winnerDelay,
        subsequentAnimationDelay: subsequentDelay,
        inference1Times: [
            {start: frames(16.7) + winnerDelay,
                end: frames(17.3) + winnerDelay}
        ],
        inference2Times: [
            {start: frames(17) + winnerDelay,
                end: frames(17.6) + winnerDelay}
        ],
        modelRespawnTimes: [frames(16.7) + winnerDelay],
        timing: {
            pipelineStart: sharedSceneStartTime,
            subtitleStart: sharedSceneStartTime,
            promptStart: sharedSceneStartTime,
            modelStart: sharedSceneStartTime,
            connectionStart: sharedSceneStartTime,
            tableAStart: sharedSceneStartTime,
            tableBStart: sharedSceneStartTime,
            titleAStart: sharedSceneStartTime,
            titleBStart: sharedSceneStartTime,
            winnerProbabilitiesStart: frames(17.7) + winnerDelay,
            loserProbabilitiesStart: sharedSceneStartTime,
            loserEquationStart: frames(6),
            loserNllStart: frames(9),
            rigorousEquationStart: frames(11)
        }
    });
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
    let scene3TableAStartTime = frames(1.8), scene3TableBStartTime = frames(1.8),
        scene3TitleAStartTime = frames(1.4), scene3TitleBStartTime = frames(2.4);

    DPOScene20(s, {
        modelLabel: "reference\nmodel",
        modelSubscript: "\\mathrm{ref}",
        showAttention: false,
        logProbabilitySequence: true,
        logSequenceDelay: frames(3),
        highlightReferenceModel: true,
        chosenProbabilities: [0.71, 0.79, 0.66, 0.86, 0.60, 0.69, 0.83, 0.93, 0.96],
        loserProbabilities: [0.47, 0.55, 0.93, 0.98],
        inference1Times: [
            {start: frames(10), end: frames(10.6)},
            {start: frames(13), end: frames(13.6)}
        ],
        inference2Times: [
            {start: frames(10.3), end: frames(10.9)},
            {start: frames(13.3), end: frames(13.9)}
        ],
        modelRespawnTimes: [frames(10), frames(13)],
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
            winnerProbabilitiesStart: frames(10),
            loserProbabilitiesStart: frames(13)
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
    let contextText, tokenText, firstThought, helpfulThought, secondThought, insightBulb;

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
            start: frames(3),
            font: font,
            end: frames(7),
            duration: 0.7
        });

        // Reuse the three-stage pipeline geometry from DPOScene20.
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
            start: frames(7), end: frames(11),
            fill: colors.background, opacity: 230
        });
        helpfulThought = new Bubble(s, {
            x: refX + 127, y: refY - 25, w: 500, h: 250,
            font: font, size: 37,
            str: "I want to be a\nhelpful assistant.",
            start: frames(12), end: frames(16),
            fill: colors.background, opacity: 230
        });
        secondThought = new Bubble(s, {
            x: refX + 127, y: refY - 25, w: 500, h: 250,
            font: font, size: 37,
            str: "I need post-training.",
            start: frames(17), fill: colors.background, opacity: 230
        });
        insightBulb = new Bulb(s, {
            emoji: emojiFont,
            str: "💡",
            color: [247, 248, 7],
            x: refX + 25,
            y: refY - 35,
            size: 60,
            start: frames(17),
            end: frames(20)
        });
        // Bubble normally delays its text; these thoughts begin at the named times.
        firstThought.text.start = frames(7);
        helpfulThought.text.start = frames(13);
        secondThought.text.start = frames(17);
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
        transmit1.show();
        transmit2.show();
        connect1.show();
        connect2.show();
        contextText.show();
        tokenText.show();
        model.showAt(refX + 10, refY, modelSize);
        firstThought.show();
        helpfulThought.show();
        secondThought.show();
        insightBulb.show();
        // showFR(s);
    };
};

const DPOScene04 = function (s) {
    const colors = {
        foreground: [235, 241, 250],
        outline: [255, 255, 255],
        user: [77, 177, 255],
        assistant: [177, 125, 255],
        transmit: [247, 227, 47]
    };
    const examples = [
        ["What is the capital of Japan?", "Tokyo."],
        ["Why is the sky blue?", "Air scatters blue light most strongly."],
        ["Write a synonym for happy.", "Joyful."],
        ["What does DNA store?", "Genetic information."],
        ["How many sides does a hexagon have?", "Six."],
        ["Translate 'thank you' into Spanish.", "Gracias."],
        ["What gas do plants absorb?", "Carbon dioxide."],
        ["Who wrote Pride and Prejudice?", "Jane Austen."],
        ["What is the largest ocean?", "The Pacific Ocean."],
        ["How do bees communicate?", "Through dances and pheromones."]
    ];
    const pipelineStart = frames(1);
    const connectionStart = frames(1.7);
    const exampleStart = frames(3.2);
    const exampleCycleFrames = frames(0.1);
    const leftRectArgs = {x: 315, y: 439, w: 850, h: 220};
    const modelRectArgs = {x: 1275, y: 439, w: 330, h: 220};
    let font, title, dataRect, modelRect, connection, transmission, model, learningThought;
    let userLabel, questionText, assistantLabel, answerText;

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);
        const titleString = "Supervised fine-tuning (SFT)";
        s.textFont(font);
        s.textSize(50);
        title = new TextWriteIn(s, {
            str: titleString,
            x: s.width / 2 - s.textWidth(titleString) / 2,
            y: 105,
            mode: 0,
            size: 50,
            color: colors.foreground,
            start: frames(3.4),
            duration: 0.8,
            font: font
        });
        dataRect = new LinedRect(s, Object.assign({}, leftRectArgs, {
            start: pipelineStart,
            duration: 1.4,
            mode: 2,
            strokeweight: 2,
            color: colors.outline
        }));
        modelRect = new LinedRect(s, Object.assign({}, modelRectArgs, {
            start: pipelineStart,
            duration: 1.4,
            mode: 2,
            strokeweight: 2,
            color: colors.outline
        }));

        const connectionArgs = {
            x1: leftRectArgs.x + leftRectArgs.w,
            y1: leftRectArgs.y + leftRectArgs.h / 2,
            x2: modelRectArgs.x,
            y2: modelRectArgs.y + modelRectArgs.h / 2
        };
        connection = new Line(s, Object.assign({}, connectionArgs, {
            start: connectionStart,
            duration: 0.5,
            mode: 1,
            strokeweight: 7,
            square: true,
            color: colors.outline
        }));

        const intervals = [];
        for (let i = 0; i < 18; i++) {
            const startSeconds = 3 + i * 0.8;
            intervals.push({
                start: frames(startSeconds),
                end: frames(startSeconds + 0.55)
            });
        }
        transmission = new TransmitLine(s, Object.assign({}, connectionArgs, {
            intervals: intervals,
            strokeweight: 17,
            square: true,
            color: colors.transmit
        }));

        model = new BrainBase(s, {
            start: frames(1.3),
            duration: frames(1.5)
        });
        learningThought = new Bubble(s, {
            x: modelRectArgs.x + 127,
            y: modelRectArgs.y - 5,
            w: 390,
            h: 245,
            font: font,
            size: 32,
            str: "Learning how to\nanswer questions.",
            start: frames(11),
            fill: [8, 12, 22],
            opacity: 230
        });
        learningThought.text.start = frames(11.2);

        userLabel = new TextFade(s, {
            str: "User:", x: 360, y: 485, size: 34,
            color: colors.user, start: exampleStart, duration: 0.4, font: font
        });
        questionText = new TextFade(s, {
            str: examples[0][0], x: 480, y: 485, size: 34,
            color: colors.foreground, start: exampleStart, duration: 0.4, font: font
        });
        assistantLabel = new TextFade(s, {
            str: "Assistant:", x: 360, y: 565, size: 34,
            color: colors.assistant, start: exampleStart, duration: 0.4, font: font
        });
        answerText = new TextFade(s, {
            str: examples[0][1], x: 530, y: 565, size: 34,
            color: colors.foreground, start: exampleStart, duration: 0.4, font: font
        });
    };

    s.draw = function () {
        const exampleIndex = Math.floor(
            Math.max(0, s.frameCount - exampleStart) / exampleCycleFrames
        ) % examples.length;
        questionText.reset({str: examples[exampleIndex][0]});
        answerText.reset({str: examples[exampleIndex][1]});

        title.show();
        dataRect.show();
        modelRect.show();
        transmission.show();
        connection.show();
        userLabel.show();
        questionText.show();
        assistantLabel.show();
        answerText.show();
        model.showAt(modelRectArgs.x + 50, modelRectArgs.y + 20, 420);
        learningThought.show();
    };
};

let dpo1 = new p5(DPOScene25);
