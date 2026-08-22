const DPOScene18 = function (s) {
    const colors = {
        foreground: "#ebf1fa",
        chosen: "#4dd999",
        rejected: "#ff7080",
        beta: "#f4c30a"
    };
    const baseSize = 32;
    const entryStart = frames(0.5);
    const entryDelay = frames(0.05);
    const jumpStart = frames(5);
    const jumpDiffTime = frames(0.08);
    const jumpHeight = 24;
    const jumpDuration = 0.45;
    let equation;

    const tokenSpecs = [
        {key: "loss", text: "\\mathcal{L}_{\\mathrm{DPO}}", color: colors.foreground},
        {text: "=", color: colors.foreground},
        {text: "-\\log\\,\\sigma(", color: colors.foreground},
        {text: "\\beta", color: colors.beta},
        {text: "[", color: colors.foreground},
        {text: "(", color: colors.foreground},
        {text: "\\log", color: colors.chosen},
        {
            text: "\\pi_{\\theta}(y_w\\mid x)",
            color: colors.chosen
        },
        {text: "-", color: colors.foreground},
        {text: "\\log", color: colors.chosen},
        {
            text: "\\pi_{\\mathrm{ref}}(y_w\\mid x)",
            color: colors.chosen
        },
        {text: ")", color: colors.foreground},
        {text: "-", color: colors.foreground},
        {text: "(", color: colors.foreground},
        {text: "\\log", color: colors.rejected},
        {
            text: "\\pi_{\\theta}(y_l\\mid x)",
            color: colors.rejected
        },
        {text: "-", color: colors.foreground},
        {text: "\\log", color: colors.rejected},
        {
            text: "\\pi_{\\mathrm{ref}}(y_l\\mid x)",
            color: colors.rejected
        },
        {text: ")", color: colors.foreground},
        {text: "]", color: colors.foreground},
        {text: ")", color: colors.foreground}
    ];

    s.setup = function () {
        setup2D(s);
        equation = new AnimatedKatex(s, {
            parts: tokenSpecs.map((spec, index) => Object.assign({}, spec, {
                key: spec.key || "token" + index,
                start: entryStart + index * entryDelay
            })),
            x: s.width / 2,
            y: s.height / 2 - 125,
            mode: 1,
            font_size: baseSize,
            color: colors.foreground
        });
    };

    s.draw = function () {
        for (let i = 0; i < tokenSpecs.length; i++) {
            if (s.frameCount === jumpStart + i * jumpDiffTime)
                equation.jumpPart(tokenSpecs[i].key || "token" + i,
                    jumpHeight, jumpDuration);
        }
        equation.show();
    };
};

const DPOScene52 = function (s) {
    const colors = {
        foreground: "#ebf1fa",
        chosen: "#4dd999",
        rejected: "#ff7080",
        beta: "#f4c30a"
    };
    const baseSize = 32;
    const entryStart = frames(1);
    const entryDelay = frames(0.05);
    const referenceJumpStart = frames(4);
    const thetaJumpStart = frames(6);
    const jumpHeight = 24;
    const jumpDuration = 0.45;
    const referenceKeys = ["reference_winner", "reference_loser"];
    const thetaKeys = ["theta_winner", "theta_loser"];
    let equation, winnerUnderline, loserUnderline;
    let referenceJumped = false, thetaJumped = false;

    class PartUnderline {
        constructor(partKey, targetText, start) {
            this.partKey = partKey;
            this.targetText = targetText;
            this.start = start;
            this.durationFrames = frames(1);
        }

        bounds() {
            const part = equation.partStates[this.partKey].element;
            const candidates = Array.from(part.querySelectorAll(".mord"))
                .filter((element) => element.textContent.replace(
                    /[\s\u200b]/g, ""
                ) === this.targetText);
            if (!candidates.length)
                return null;
            const element = candidates.reduce((smallest, candidate) => {
                const rect = candidate.getBoundingClientRect();
                const smallestRect = smallest.getBoundingClientRect();
                return rect.width * rect.height <
                    smallestRect.width * smallestRect.height ?
                    candidate : smallest;
            });
            const rect = element.getBoundingClientRect();
            const canvas = s.canvas.getBoundingClientRect();
            return {
                x1: (rect.left - canvas.left) * s.width / canvas.width,
                x2: (rect.right - canvas.left) * s.width / canvas.width,
                y: (rect.bottom - canvas.top) * s.height / canvas.height + 4
            };
        }

        easeOut(progress) {
            const t = s.constrain(progress, 0, 1);
            return 1 - (1 - t) * (1 - t);
        }

        show() {
            const elapsed = s.frameCount - this.start;
            if (elapsed < 0 || elapsed >= this.durationFrames * 2)
                return;
            const bounds = this.bounds();
            if (!bounds)
                return;
            let left = bounds.x1, right = bounds.x2;
            if (elapsed < this.durationFrames) {
                right = bounds.x1 + (bounds.x2 - bounds.x1) *
                    this.easeOut(elapsed / this.durationFrames);
            } else {
                left = bounds.x1 + (bounds.x2 - bounds.x1) * this.easeOut(
                    (elapsed - this.durationFrames) / this.durationFrames
                );
            }
            s.push();
            s.stroke(249, 201, 17);
            s.strokeWeight(3);
            s.strokeCap(s.ROUND);
            s.line(left, bounds.y, right, bounds.y);
            s.pop();
        }
    }

    const tokenSpecs = [
        {key: "loss", text: "\\mathcal{L}_{\\mathrm{DPO}}",
            color: colors.foreground},
        {text: "=", color: colors.foreground},
        {text: "-\\log\\,\\sigma(", color: colors.foreground},
        {text: "\\beta", color: colors.beta},
        {text: "[", color: colors.foreground},
        {text: "(", color: colors.foreground},
        {text: "\\log", color: colors.chosen},
        {key: "theta_winner", text: "\\pi_{\\theta}(y_w\\mid x)",
            color: colors.chosen},
        {text: "-", color: colors.foreground},
        {text: "\\log", color: colors.chosen},
        {key: "reference_winner",
            text: "\\pi_{\\mathrm{ref}}(y_w\\mid x)",
            color: colors.chosen},
        {text: ")", color: colors.foreground},
        {text: "-", color: colors.foreground},
        {text: "(", color: colors.foreground},
        {text: "\\log", color: colors.rejected},
        {key: "theta_loser", text: "\\pi_{\\theta}(y_l\\mid x)",
            color: colors.rejected},
        {text: "-", color: colors.foreground},
        {text: "\\log", color: colors.rejected},
        {key: "reference_loser",
            text: "\\pi_{\\mathrm{ref}}(y_l\\mid x)",
            color: colors.rejected},
        {text: ")", color: colors.foreground},
        {text: "]", color: colors.foreground},
        {text: ")", color: colors.foreground}
    ];

    s.setup = function () {
        setup2D(s);
        equation = new AnimatedKatex(s, {
            parts: tokenSpecs.map(function (spec, index) {
                return Object.assign({}, spec, {
                    key: spec.key || "token" + index,
                    start: entryStart + index * entryDelay
                });
            }),
            x: s.width / 2,
            y: s.height / 2 - 125,
            mode: 1,
            font_size: baseSize,
            color: colors.foreground
        });
        winnerUnderline = new PartUnderline(
            "theta_winner", "yw", frames(8)
        );
        loserUnderline = new PartUnderline(
            "theta_loser", "yl", frames(10)
        );
    };

    s.draw = function () {
        if (!referenceJumped && s.frameCount >= referenceJumpStart) {
            for (const key of referenceKeys)
                equation.jumpPart(key, jumpHeight, jumpDuration);
            referenceJumped = true;
        }
        if (!thetaJumped && s.frameCount >= thetaJumpStart) {
            for (const key of thetaKeys)
                equation.jumpPart(key, jumpHeight, jumpDuration);
            thetaJumped = true;
        }
        equation.show();
        winnerUnderline.show();
        loserUnderline.show();
    };
};

class DPOScene34BoundsHighlight {
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

const DPOScene34 = function (s) {
    const colors = {
        chosen: "#4dd999",
        rejected: "#ff7080",
        foreground: "#ffffff",
        beta: "#f4c30a"
    };
    const moveStart = frames(1.5);
    const moveDuration = 1.2;
    const thetaEntryStart = frames(5);
    const rowColors = [colors.chosen, colors.rejected];
    const rowSubscripts = ["w", "l"];
    const referenceValues = ["-2.33", "-1.45"];
    const thetaValues = ["-2.04", "-1.63"];
    const initialY = [775, 870];
    const expressionX = [762.5, 1157.5];
    const targetY = [345, 555];
    const valueY = [425, 635];
    let referenceLogs = [];
    let referenceEquals = [];
    let referenceNumbers = [];
    let referenceStartGuides = [];
    let thetaLogs = [];
    let thetaNumbers = [];
    let expressionMinuses = [];
    let numberMinuses = [];
    let referenceHighlights = [], thetaHighlights = [];
    let repeatedReferenceHighlights = [], repeatedThetaHighlights = [];
    let font, winnerLabel, loserLabel;
    let equalsFadeTimer;
    let moveStarted = false;

    function piBounds(object, subscript) {
        const target = "π" + subscript;
        const candidates = Array.from(
            object.k.elt.querySelectorAll(".katex-html .mord")
        ).filter(function (element) {
            return element.textContent.replace(/[\s\u200b]/g, "") === target;
        });
        if (!candidates.length)
            return null;
        const element = candidates.reduce(function (smallest, candidate) {
            const area = candidate.getBoundingClientRect().width *
                candidate.getBoundingClientRect().height;
            const smallestArea = smallest.getBoundingClientRect().width *
                smallest.getBoundingClientRect().height;
            return area < smallestArea ? candidate : smallest;
        });
        const rect = element.getBoundingClientRect();
        const canvas = s.canvas.getBoundingClientRect();
        return {
            x: (rect.left - canvas.left) * s.width / canvas.width,
            y: (rect.top - canvas.top) * s.height / canvas.height,
            width: rect.width * s.width / canvas.width,
            height: rect.height * s.height / canvas.height
        };
    }

    function equation(text, x, y, color, mode, start) {
        const args = {
            text: text,
            x: x,
            y: y,
            mode: mode,
            font_size: 40,
            color: color
        };
        if (start !== undefined) {
            args.start = start;
            args.entryDuration = 0.7;
        }
        return new Katex(s, args);
    }

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);

        for (let i = 0; i < 2; i++) {
            // These three pieces reproduce the two complete expressions at the
            // end of scene 33, but deliberately have no entry animation.
            referenceLogs[i] = equation(
                "\\log \\pi_{\\mathrm{ref}}(y_" + rowSubscripts[i] +
                "\\mid x)", 1190, initialY[i], rowColors[i], 1
            );
            referenceEquals[i] = equation(
                "=", 1368, initialY[i], rowColors[i], 1
            );
            referenceNumbers[i] = equation(
                referenceValues[i], 1457, initialY[i], rowColors[i], 1
            );
            referenceStartGuides[i] = new AnimatedKatex(s, {
                parts: [
                    {key: "expression", text: "\\log \\pi_{\\mathrm{ref}}(y_" +
                        rowSubscripts[i] + "\\mid x)", start: 0,
                        enterDuration: 0, fadeIn: false},
                    {key: "equal", text: "=", start: 0,
                        enterDuration: 0, fadeIn: false},
                    {key: "value", text: referenceValues[i], start: 0,
                        enterDuration: 0, fadeIn: false}
                ],
                x: 1000, y: i === 0 ? 745 : 840, mode: 0,
                font_size: 40, color: rowColors[i]
            });

            thetaLogs[i] = equation(
                "\\log \\pi_{\\theta}(y_" + rowSubscripts[i] +
                "\\mid x)", expressionX[0], targetY[i], rowColors[i], 1,
                thetaEntryStart
            );
            expressionMinuses[i] = equation(
                "-", s.width / 2, targetY[i], colors.foreground, 1,
                thetaEntryStart
            );
            thetaNumbers[i] = equation(
                thetaValues[i], expressionX[0], valueY[i], rowColors[i], 1,
                thetaEntryStart
            );
            numberMinuses[i] = equation(
                "-", s.width / 2, valueY[i], colors.foreground, 1,
                thetaEntryStart
            );

        }

        referenceLogs.concat(referenceEquals, referenceNumbers).forEach(
            function (object) { object.k.style("opacity", 0); }
        );

        for (let i = 0; i < 2; i++) {
            referenceHighlights[i] = new DPOScene34BoundsHighlight(s, {
                bounds: function () { return piBounds(referenceLogs[i], "ref"); },
                start: frames(3), end: frames(4.2), duration: 1, padding: 7
            });
            thetaHighlights[i] = new DPOScene34BoundsHighlight(s, {
                bounds: function () { return piBounds(thetaLogs[i], "θ"); },
                start: frames(7), end: frames(8.2), duration: 1, padding: 7
            });
            repeatedReferenceHighlights[i] = new DPOScene34BoundsHighlight(s, {
                bounds: function () { return piBounds(referenceLogs[i], "ref"); },
                start: frames(12.5), end: frames(13.7),
                duration: 1, padding: 7
            });
            repeatedThetaHighlights[i] = new DPOScene34BoundsHighlight(s, {
                bounds: function () { return piBounds(thetaLogs[i], "θ"); },
                start: frames(15), end: frames(16.2),
                duration: 1, padding: 7
            });
        }

        winnerLabel = new TextFade(s, {
            str: "Winner: It will happen on Sept 2nd 2035.",
            x: s.width / 2, y: 255, mode: 1, size: 29,
            color: [77, 217, 153], font: font,
            start: frames(9.5), end: frames(11), duration: 0.8
        });
        loserLabel = new TextFade(s, {
            str: "Loser: Sept 2035.",
            x: s.width / 2, y: 725, mode: 1, size: 29,
            color: [255, 112, 128], font: font,
            start: frames(9.5), end: frames(11), duration: 0.8
        });
    };

    s.draw = function () {
        s.background(8, 12, 22);

        for (let guide of referenceStartGuides)
            guide.show();

        if (!moveStarted && s.frameCount >= moveStart) {
            for (let i = 0; i < 2; i++) {
                const expressionBounds =
                    referenceStartGuides[i].getPartBounds("expression");
                const equalBounds =
                    referenceStartGuides[i].getPartBounds("equal");
                const valueBounds =
                    referenceStartGuides[i].getPartBounds("value");
                referenceLogs[i].x = expressionBounds.centerX;
                referenceLogs[i].y = expressionBounds.centerY;
                referenceEquals[i].x = equalBounds.centerX;
                referenceEquals[i].y = equalBounds.centerY;
                referenceNumbers[i].x = valueBounds.centerX;
                referenceNumbers[i].y = valueBounds.centerY;
                referenceLogs[i].k.style("opacity", 1);
                referenceEquals[i].k.style("opacity", 1);
                referenceNumbers[i].k.style("opacity", 1);
                referenceStartGuides[i].k.style("opacity", 0);
                // Timer mode 2 selects Timer2's accelerate/decelerate motion.
                referenceLogs[i].move(
                    expressionX[1], targetY[i], moveDuration, 2
                );
                referenceNumbers[i].move(
                    expressionX[1], valueY[i], moveDuration, 2
                );
            }
            equalsFadeTimer = new Timer2(frames(moveDuration));
            moveStarted = true;
        }

        if (equalsFadeTimer) {
            const opacity = 1 - equalsFadeTimer.advance();
            for (let equal of referenceEquals)
                equal.k.style("opacity", opacity);
        }

        for (let i = 0; i < 2; i++) {
            referenceLogs[i].show();
            referenceEquals[i].show();
            referenceNumbers[i].show();
            thetaLogs[i].show();
            expressionMinuses[i].show();
            thetaNumbers[i].show();
            numberMinuses[i].show();
        }
        for (let highlight of referenceHighlights)
            highlight.show();
        for (let highlight of thetaHighlights)
            highlight.show();
        for (let highlight of repeatedReferenceHighlights)
            highlight.show();
        for (let highlight of repeatedThetaHighlights)
            highlight.show();
        winnerLabel.show();
        loserLabel.show();
    };
};

const DPOScene36 = function (s) {
    const colors = {
        chosen: "#4dd999",
        rejected: "#ff7080",
        foreground: "#ffffff",
        beta: "#f4c30a"
    };
    const rowColors = [colors.chosen, colors.rejected];
    const rowSubscripts = ["w", "l"];
    const referenceValues = ["-2.33", "-1.45"];
    const thetaValues = ["-2.04", "-1.63"];
    const expressionX = [762.5, 1157.5];
    const expressionY = [345, 555];
    const valueY = [425, 635];
    let staticExpressions = [];
    let originalMinuses = [], greaterSigns = [];
    let lessSigns = [], finalMinuses = [];
    let winnerDifference, loserDifference;
    let font, italicFont, winnerSymbol, winnerAnnotation;
    let loserSymbol, loserAnnotation, realityNote;
    let winnerLikelihood, loserLikelihood;
    let lossLayoutGuide, lossStructure, lossMoveTimer, lossMoveSpecs = [];
    let lossMoveStarted = false, otherElementsFadeStarted = false;
    const lossMoveStart = frames(17);
    const lossMoveDuration = 1.4;
    let greaterEntryStarted = false, lessEntryStarted = false;
    let finalMinusEntryStarted = false;
    let winnerEntryStarted = false, loserEntryStarted = false;

    function equation(text, x, y, color, mode, start) {
        const args = {
            text: text, x: x, y: y, mode: mode,
            font_size: 40, color: color
        };
        if (start !== undefined) {
            args.start = start;
            args.entryDuration = 1;
        }
        return new Katex(s, args);
    }

    function transitionProgress(start) {
        return s.constrain(
            (s.frameCount - frames(start)) / frames(1), 0, 1
        );
    }

    function setOpacity(objects, opacity) {
        for (let object of objects)
            object.k.style("opacity", opacity);
    }

    function beginDownwardEntry(objects) {
        for (let object of objects)
            object.move(object.x, object.entryTargetY, 1, 1);
    }

    function objectBounds(object) {
        const rect = object.k.elt.getBoundingClientRect();
        const canvas = s.canvas.getBoundingClientRect();
        return {
            width: rect.width * s.width / canvas.width,
            height: rect.height * s.height / canvas.height
        };
    }

    function unionPartBounds(keys) {
        const bounds = keys.map(function (key) {
            return lossLayoutGuide.getPartBounds(key);
        });
        const left = Math.min(...bounds.map(function (bound) { return bound.x; }));
        const right = Math.max(...bounds.map(function (bound) {
            return bound.x + bound.width;
        }));
        const top = Math.min(...bounds.map(function (bound) { return bound.y; }));
        const bottom = Math.max(...bounds.map(function (bound) {
            return bound.y + bound.height;
        }));
        return {
            centerX: (left + right) / 2,
            centerY: (top + bottom) / 2
        };
    }

    function addLossMove(object, targetX, targetY) {
        lossMoveSpecs.push({
            object: object, startX: object.x, startY: object.y,
            targetX: targetX, targetY: targetY, startSize: object.size
        });
    }

    function beginLossMove() {
        const winnerTheta = lossLayoutGuide.getPartBounds("winnerTheta");
        const winnerMinus = lossLayoutGuide.getPartBounds("winnerMinus");
        const winnerRef = lossLayoutGuide.getPartBounds("winnerRef");
        const loserTheta = lossLayoutGuide.getPartBounds("loserTheta");
        const loserMinus = lossLayoutGuide.getPartBounds("loserMinus");
        const loserRef = lossLayoutGuide.getPartBounds("loserRef");
        const winnerGroup = unionPartBounds([
            "winnerTheta", "winnerMinus", "winnerRef"
        ]);
        const loserGroup = unionPartBounds([
            "loserTheta", "loserMinus", "loserRef"
        ]);

        addLossMove(staticExpressions[0], winnerTheta.centerX,
            winnerTheta.centerY);
        addLossMove(finalMinuses[0], winnerMinus.centerX,
            winnerMinus.centerY);
        addLossMove(staticExpressions[1], winnerRef.centerX,
            winnerRef.centerY);
        addLossMove(staticExpressions[4], loserTheta.centerX,
            loserTheta.centerY);
        addLossMove(finalMinuses[2], loserMinus.centerX,
            loserMinus.centerY);
        addLossMove(staticExpressions[5], loserRef.centerX,
            loserRef.centerY);

        const winnerResultBounds = objectBounds(winnerDifference);
        const loserResultBounds = objectBounds(loserDifference);
        addLossMove(winnerDifference,
            winnerGroup.centerX - winnerResultBounds.width / 2,
            winnerGroup.centerY + 70);
        addLossMove(loserDifference,
            loserGroup.centerX - loserResultBounds.width / 2,
            loserGroup.centerY + 70);

        lossMoveTimer = new Timer2(frames(lossMoveDuration));
        lossMoveStarted = true;
    }

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
        italicFont = s.loadFont("../../lib/font/timesi.ttf");
    };

    s.setup = function () {
        setup2D(s);

        for (let i = 0; i < 2; i++) {
            staticExpressions.push(
                equation("\\log \\pi_{\\theta}(y_" + rowSubscripts[i] +
                    "\\mid x)", expressionX[0], expressionY[i],
                rowColors[i], 1),
                equation("\\log \\pi_{\\mathrm{ref}}(y_" + rowSubscripts[i] +
                    "\\mid x)", expressionX[1], expressionY[i],
                rowColors[i], 1),
                equation(thetaValues[i], expressionX[0], valueY[i],
                    rowColors[i], 1),
                equation(referenceValues[i], expressionX[1], valueY[i],
                    rowColors[i], 1)
            );

            for (let y of [expressionY[i], valueY[i]]) {
                originalMinuses.push(equation(
                    "-", s.width / 2, y, colors.foreground, 1
                ));
                const greater = equation(
                    ">", s.width / 2, y - 45, colors.foreground, 1
                );
                const less = equation(
                    "<", s.width / 2, y - 45, colors.foreground, 1
                );
                const finalMinus = equation(
                    "-", s.width / 2, y - 45, colors.foreground, 1
                );
                greater.entryTargetY = y;
                less.entryTargetY = y;
                finalMinus.entryTargetY = y;
                greaterSigns.push(greater);
                lessSigns.push(less);
                finalMinuses.push(finalMinus);
            }
        }

        setOpacity(greaterSigns, 0);
        setOpacity(lessSigns, 0);
        setOpacity(finalMinuses, 0);

        winnerDifference = equation(
            "=+0.29", expressionX[1] + 162, valueY[0] - 45,
            colors.chosen, 3,
            frames(5)
        );
        winnerDifference.entryTargetY = valueY[0];
        loserDifference = equation(
            "=-0.18", expressionX[1] + 162, valueY[1] - 45,
            colors.rejected, 3,
            frames(10)
        );
        loserDifference.entryTargetY = valueY[1];
        winnerSymbol = equation(
            "y_w", 1427, expressionY[0] - 34, colors.chosen, 1, frames(7)
        );
        winnerAnnotation = new TextWriteIn(s, {
            str: "favored more",
            x: 1470, y: expressionY[0] - 50, mode: 0, size: 32,
            color: [255, 255, 255], font: font, start: frames(7)
        });
        loserSymbol = equation(
            "y_l", 1427, expressionY[1] - 34, colors.rejected, 1,
            frames(12)
        );
        loserAnnotation = new TextWriteIn(s, {
            str: "favored less",
            x: 1470, y: expressionY[1] - 50, mode: 0, size: 32,
            color: [255, 255, 255], font: font, start: frames(12)
        });
        winnerLikelihood = new TextWriteIn(s, {
            str: "(more likely)",
            x: 1470, y: expressionY[0] - 12, mode: 0, size: 32,
            color: [255, 255, 255], font: font, start: frames(14)
        });
        loserLikelihood = new TextWriteIn(s, {
            str: "(less likely)",
            x: 1470, y: expressionY[1] - 12, mode: 0, size: 32,
            color: [255, 255, 255], font: font, start: frames(16)
        });
        const lossLayoutParts = [
                {key: "loss", text: "\\mathcal{L}_{\\mathrm{DPO}}="},
                {key: "negLogOpen", text: "-\\log\\,\\sigma("},
                {key: "beta", text: "\\beta"},
                {key: "bracketOpen", text: "["},
                {key: "winnerParenOpen", text: "("},
                {key: "winnerTheta", text: "\\log\\pi_{\\theta}(y_w\\mid x)"},
                {key: "winnerMinus", text: "-"},
                {key: "winnerRef", text: "\\log\\pi_{\\mathrm{ref}}(y_w\\mid x)"},
                {key: "winnerParenClose", text: ")"},
                {key: "betweenMinus", text: "-"},
                {key: "loserParenOpen", text: "("},
                {key: "loserTheta", text: "\\log\\pi_{\\theta}(y_l\\mid x)"},
                {key: "loserMinus", text: "-"},
                {key: "loserRef", text: "\\log\\pi_{\\mathrm{ref}}(y_l\\mid x)"},
                {key: "loserParenClose", text: ")"},
                {key: "bracketClose", text: "]"},
                {key: "sigmaClose", text: ")"}
            ];
        lossLayoutGuide = new AnimatedKatex(s, {
            parts: lossLayoutParts.map(function (part) {
                return Object.assign({}, part, {
                    start: 0, enterDuration: 0, fadeIn: false
                });
            }),
            x: s.width / 2, y: s.height / 2 - 125, mode: 1,
            font_size: 32, color: colors.foreground
        });
        lossLayoutGuide.k.style("opacity", 0);
        const structuralStarts = {
            winnerParenOpen: 20, winnerParenClose: 20, betweenMinus: 20,
            loserParenOpen: 20, loserParenClose: 20,
            beta: 22, bracketOpen: 22, bracketClose: 22,
            negLogOpen: 24, sigmaClose: 24, loss: 27
        };
        lossStructure = new AnimatedKatex(s, {
            parts: lossLayoutParts.map(function (part) {
                const start = structuralStarts[part.key];
                return Object.assign({}, part, {
                    color: part.key === "beta" ? colors.beta : undefined,
                    start: start === undefined ? Infinity : frames(start),
                    enterDuration: 1,
                    enterFrom: {x: 0, y: -45},
                    fadeIn: true
                });
            }),
            x: s.width / 2, y: s.height / 2 - 125, mode: 1,
            font_size: 32, color: colors.foreground
        });
        realityNote = new TextFade(s, {
            str: "The -log σ(...) comes almost directly from the Bradley-Terry model.",
            x: 60, y: 50, mode: 0, size: 29,
            font: italicFont, color: [190, 197, 207],
            start: frames(24), end: frames(26.5), duration: 0.7
        });
    };

    s.draw = function () {
        s.background(8, 12, 22);
        lossLayoutGuide.show();
        lossStructure.show();

        if (!lossMoveStarted && s.frameCount >= lossMoveStart)
            beginLossMove();
        if (lossMoveStarted) {
            const moveProgress = lossMoveTimer.advance();
            const sizeProgress = s.constrain(
                (s.frameCount - lossMoveStart) / frames(lossMoveDuration), 0, 1
            );
            for (let spec of lossMoveSpecs) {
                spec.object.x = spec.startX + moveProgress *
                    (spec.targetX - spec.startX);
                spec.object.y = spec.startY + moveProgress *
                    (spec.targetY - spec.startY);
                spec.object.size = spec.startSize + sizeProgress *
                    (32 - spec.startSize);
            }
        }

        if (!otherElementsFadeStarted && s.frameCount >= lossMoveStart) {
            winnerAnnotation.ft.fadeOut(1);
            loserAnnotation.ft.fadeOut(1);
            winnerLikelihood.ft.fadeOut(1);
            loserLikelihood.ft.fadeOut(1);
            otherElementsFadeStarted = true;
        }

        for (let expression of staticExpressions)
            expression.show();
        for (let sign of originalMinuses)
            sign.show();
        for (let sign of greaterSigns)
            sign.show();
        for (let sign of lessSigns)
            sign.show();
        for (let sign of finalMinuses)
            sign.show();

        if (!greaterEntryStarted && s.frameCount >= frames(1)) {
            beginDownwardEntry(greaterSigns.slice(0, 2));
            greaterEntryStarted = true;
        }
        if (!lessEntryStarted && s.frameCount >= frames(3)) {
            beginDownwardEntry(lessSigns.slice(2, 4));
            lessEntryStarted = true;
        }
        if (!finalMinusEntryStarted && s.frameCount >= frames(5)) {
            beginDownwardEntry(finalMinuses);
            finalMinusEntryStarted = true;
        }
        if (!winnerEntryStarted && s.frameCount >= frames(5)) {
            beginDownwardEntry([winnerDifference]);
            winnerEntryStarted = true;
        }
        if (!loserEntryStarted && s.frameCount >= frames(10)) {
            beginDownwardEntry([loserDifference]);
            loserEntryStarted = true;
        }

        let winnerOriginalOpacity = 1, loserOriginalOpacity = 1;
        let greaterOpacity = 0, lessOpacity = 0, finalMinusOpacity = 0;
        if (s.frameCount >= frames(1)) {
            winnerOriginalOpacity = 1 - s.constrain(
                (s.frameCount - frames(1)) / frames(0.5), 0, 1
            );
            greaterOpacity = transitionProgress(1);
        }
        if (s.frameCount >= frames(3)) {
            loserOriginalOpacity = 1 - s.constrain(
                (s.frameCount - frames(3)) / frames(0.5), 0, 1
            );
            lessOpacity = transitionProgress(3);
        }
        if (s.frameCount >= frames(5)) {
            greaterOpacity = 1 - s.constrain(
                (s.frameCount - frames(5)) / frames(0.5), 0, 1
            );
            lessOpacity = 1 - s.constrain(
                (s.frameCount - frames(5)) / frames(0.5), 0, 1
            );
            finalMinusOpacity = transitionProgress(5);
        }
        setOpacity(originalMinuses.slice(0, 2), winnerOriginalOpacity);
        setOpacity(originalMinuses.slice(2, 4), loserOriginalOpacity);
        setOpacity(greaterSigns.slice(0, 2), greaterOpacity);
        setOpacity(greaterSigns.slice(2, 4), 0);
        setOpacity(lessSigns.slice(0, 2), 0);
        setOpacity(lessSigns.slice(2, 4), lessOpacity);
        setOpacity(finalMinuses, finalMinusOpacity);

        winnerDifference.show();
        loserDifference.show();
        winnerSymbol.show();
        winnerAnnotation.show();
        loserSymbol.show();
        loserAnnotation.show();
        winnerLikelihood.show();
        loserLikelihood.show();
        realityNote.show();

        if (s.frameCount >= lossMoveStart) {
            const fadeOpacity = 1 - s.constrain(
                (s.frameCount - lossMoveStart) / frames(1), 0, 1
            );
            [staticExpressions[2], staticExpressions[3],
                staticExpressions[6], staticExpressions[7],
                finalMinuses[1], finalMinuses[3],
                winnerSymbol, loserSymbol].forEach(function (object) {
                object.k.style("opacity", fadeOpacity);
            });
        }
        if (s.frameCount >= frames(24)) {
            const resultOpacity = 1 - s.constrain(
                (s.frameCount - frames(24)) / frames(1), 0, 1
            );
            winnerDifference.k.style("opacity", resultOpacity);
            loserDifference.k.style("opacity", resultOpacity);
        }
    };
};

class DPOColorTransitionBrain extends BrainBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.redProgress = 0;
    }

    transitionColor(from, to) {
        return from.map((value, index) => this.s.lerp(
            value, to[index], this.redProgress
        ));
    }

    showCircle(x, y, size) {
        const thick = this.transitionColor([27, 177, 37], [205, 45, 58]);
        const thin = this.transitionColor([107, 227, 97], [255, 112, 128]);
        this.g.push();
        this.g.strokeWeight(47 * size);
        this.g.stroke(thick);
        this.g.ellipse(x, y, size * 9, size * 9);
        this.g.strokeWeight(17 * size);
        this.g.stroke(thin);
        this.g.ellipse(x, y, size * 9, size * 9);
        this.g.pop();
    }

    showBrain() {
        this.checkForRespawn();
        if (this.s.frameCount <= this.start)
            return;
        if (this.redProgress > 0)
            this.g.clear();
        const thick = this.transitionColor([27, 177, 37], [205, 45, 58]);
        const thin = this.transitionColor([107, 227, 97], [255, 112, 128]);
        this.g.noFill();
        this.g.strokeWeight(47);
        this.g.stroke(thick);
        this.g.strokeJoin(this.s.ROUND);
        this.showWire();
        this.g.strokeWeight(17);
        this.g.stroke(thin);
        this.showWire();
        this.frCount++;
    }
}

const DPOScene37 = function (s) {
    const colors = {
        foreground: "#ebf1fa",
        chosen: "#4dd999",
        rejected: "#ff7080",
        beta: "#f4c30a",
        outline: [255, 255, 255]
    };
    const modelStart = frames(1.5);
    const separationStart = frames(4);
    const separationDuration = 2;
    const redStart = frames(5);
    const redDuration = frames(1);
    const boxY = 590;
    const boxW = 330, boxH = 220;
    const trainStartX = 650, trainTargetX = 250;
    const referenceX = 1200;
    let font, lossEquation;
    let trainableBrain, referenceBrain;
    let trainableRect, referenceRect;
    let trainableLabel, referenceLabel;
    let catastrophicThought;
    let connectorBeta, betaEntryStarted = false;
    let equationMoveStarted = false;
    let separationTimer, separationStarted = false;
    let returnTimer, returnStarted = false, returnStartX;
    let connectionEntryTimer;

    const lossParts = [
        {key: "loss", text: "\\mathcal{L}_{\\mathrm{DPO}}", color: colors.foreground},
        {key: "equals", text: "=", color: colors.foreground},
        {key: "negLog", text: "-\\log\\,\\sigma(", color: colors.foreground},
        {key: "beta", text: "\\beta", color: colors.beta},
        {key: "openBracket", text: "[(", color: colors.foreground},
        {key: "winnerTheta", text: "\\log\\pi_{\\theta}(y_w\\mid x)",
            color: colors.chosen},
        {key: "winnerMinus", text: "-", color: colors.foreground},
        {key: "winnerRef", text: "\\log\\pi_{\\mathrm{ref}}(y_w\\mid x)",
            color: colors.chosen},
        {key: "middle", text: ")-(", color: colors.foreground},
        {key: "loserTheta", text: "\\log\\pi_{\\theta}(y_l\\mid x)",
            color: colors.rejected},
        {key: "loserMinus", text: "-", color: colors.foreground},
        {key: "loserRef", text: "\\log\\pi_{\\mathrm{ref}}(y_l\\mid x)",
            color: colors.rejected},
        {key: "close", text: ")])", color: colors.foreground}
    ];

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);
        lossEquation = new AnimatedKatex(s, {
            parts: lossParts.map(function (part) {
                return Object.assign({}, part, {
                    start: 0, enterDuration: 0, fadeIn: false
                });
            }),
            x: s.width / 2, y: s.height / 2 - 125,
            mode: 1, font_size: 32, color: colors.foreground
        });

        trainableRect = new LinedRect(s, {
            x: trainStartX, y: boxY, w: boxW, h: boxH,
            start: modelStart, duration: 0.7, mode: 2,
            strokeweight: 2, color: colors.outline
        });
        referenceRect = new LinedRect(s, {
            x: referenceX, y: boxY, w: boxW, h: boxH,
            start: modelStart, duration: 0.7, mode: 2,
            strokeweight: 2, color: colors.outline
        });
        trainableBrain = new DPOColorTransitionBrain(s, {
            start: modelStart, duration: frames(1.5)
        });
        referenceBrain = new BrainBase(s, {
            start: modelStart, duration: frames(1.5)
        });
        trainableLabel = new TextFade(s, {
            str: "trainable\nmodel", x: trainStartX + 250,
            y: boxY + 170, size: 27, mode: 1,
            color: [235, 241, 250], start: modelStart,
            duration: 1, font: font
        });
        referenceLabel = new TextFade(s, {
            str: "reference\nmodel", x: referenceX + 250,
            y: boxY + 170, size: 27, mode: 1,
            color: [235, 241, 250], start: modelStart,
            duration: 1, font: font
        });
        catastrophicThought = new Bubble(s, {
            x: trainTargetX + 127, y: boxY - 5,
            w: 500, h: 250, font: font, size: 32,
            str: "Catastrophically forgox#$%\n" +
                "q79@! _mem0ry?? //",
            start: frames(7), end: frames(9.5), fadeOutDuration: 0.7,
            fill: [8, 12, 22], opacity: 230
        });
        catastrophicThought.text.start = frames(7);
        connectorBeta = new Katex(s, {
            text: "\\beta",
            x: (trainTargetX + boxW + referenceX) / 2,
            y: boxY + boxH / 2 + 10,
            mode: 1, font_size: 40, color: colors.beta,
            start: frames(10), entryDuration: 1
        });
        connectorBeta.entryTargetY = boxY + boxH / 2 - 35;
        connectionEntryTimer = new Timer1(frames(0.5));
    };

    function showConnection() {
        if (s.frameCount < modelStart)
            return;
        const startX = trainableRect.x + boxW;
        const endX = referenceRect.x;
        const y = boxY + boxH / 2;
        const entry = s.constrain(connectionEntryTimer.advance(), 0, 1);
        const initialGap = referenceX - (trainStartX + boxW);
        const currentGap = Math.max(initialGap, endX - startX);
        const strokeweight = 9.8 * initialGap / currentGap;
        s.push();
        s.stroke(colors.outline);
        s.strokeWeight(strokeweight);
        s.strokeCap(s.SQUARE);
        s.line(startX, y, startX + (endX - startX) * entry, y);
        s.pop();
    }

    s.draw = function () {
        s.background(8, 12, 22);

        if (!equationMoveStarted && s.frameCount >= frames(1)) {
            lossEquation.move(
                lossEquation.x, lossEquation.y - 199, 1, 2
            );
            equationMoveStarted = true;
        }
        if (!separationStarted && s.frameCount >= separationStart) {
            separationTimer = new Timer2(frames(separationDuration));
            separationStarted = true;
        }
        if (separationStarted) {
            const progress = separationTimer.advance();
            trainableRect.x = trainStartX + progress *
                (trainTargetX - trainStartX);
            trainableLabel.x = trainableRect.x + 250;
        }
        if (!returnStarted && s.frameCount >= frames(12)) {
            returnStartX = trainableRect.x;
            returnTimer = new Timer2(frames(2));
            returnStarted = true;
        }
        if (returnStarted) {
            const progress = returnTimer.advance();
            trainableRect.x = returnStartX + progress *
                ((trainStartX - 75) - returnStartX);
            trainableLabel.x = trainableRect.x + 250;
        }
        if (s.frameCount >= frames(12)) {
            trainableBrain.redProgress = 1 - s.constrain(
                (s.frameCount - frames(12)) / frames(1), 0, 1
            );
        } else if (s.frameCount >= redStart) {
            trainableBrain.redProgress = s.constrain(
                (s.frameCount - redStart) / redDuration, 0, 1
            );
        }
        if (!betaEntryStarted && s.frameCount >= frames(10)) {
            connectorBeta.move(
                connectorBeta.x, connectorBeta.entryTargetY, 1, 1
            );
            betaEntryStarted = true;
        }
        connectorBeta.x = (trainableRect.x + boxW + referenceRect.x) / 2;

        lossEquation.show();
        trainableRect.show();
        referenceRect.show();
        showConnection();
        trainableBrain.showAt(trainableRect.x + 40, boxY + 20, 420);
        referenceBrain.showAt(referenceRect.x + 40, boxY + 20, 420);
        trainableLabel.show();
        referenceLabel.show();
        catastrophicThought.show();
        connectorBeta.show();
    };
};

class DPOScene38TextHighlight {
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

const DPOScene38 = function (s) {
    const colors = {
        foreground: "#ebf1fa",
        chosen: "#4dd999",
        rejected: "#ff7080",
        beta: "#f4c30a"
    };
    let font;
    let lossY;
    let title;
    let lossEquation, substitutedEquation, halfEquation, resultEquation;
    let termHighlights = [];
    let halfEntryStarted = false, resultEntryStarted = false;

    const lossParts = [
        {key: "loss", text: "\\mathcal{L}_{\\mathrm{DPO}}", color: colors.foreground},
        {key: "equals", text: "=", color: colors.foreground},
        {key: "negLog", text: "-\\log\\,\\sigma(", color: colors.foreground},
        {key: "beta", text: "\\beta", color: colors.beta},
        {key: "openBracket", text: "[(", color: colors.foreground},
        {key: "winnerTheta", text: "\\log\\pi_{\\theta}(y_w\\mid x)",
            color: colors.chosen},
        {key: "winnerMinus", text: "-", color: colors.foreground},
        {key: "winnerRef", text: "\\log\\pi_{\\mathrm{ref}}(y_w\\mid x)",
            color: colors.chosen},
        {key: "middle", text: ")-(", color: colors.foreground},
        {key: "loserTheta", text: "\\log\\pi_{\\theta}(y_l\\mid x)",
            color: colors.rejected},
        {key: "loserMinus", text: "-", color: colors.foreground},
        {key: "loserRef", text: "\\log\\pi_{\\mathrm{ref}}(y_l\\mid x)",
            color: colors.rejected},
        {key: "close", text: ")])", color: colors.foreground}
    ];

    function enteringParts(parts, start) {
        return parts.map(function (part) {
            return Object.assign({}, part, {
                start: frames(start), enterDuration: 1,
                enterFrom: {x: 0, y: -45}, fadeIn: true
            });
        });
    }

    function symbolBounds(partKey, symbolText) {
        const part = lossEquation.partStates[partKey].element;
        const normalizedTarget = symbolText.replace(/\s/g, "");
        const candidates = Array.from(part.querySelectorAll("span")).filter(
            function (element) {
                return element.textContent.replace(/[\s\u200b]/g, "") ===
                    normalizedTarget;
            }
        );
        const element = candidates.sort(function (a, b) {
            const aRect = a.getBoundingClientRect();
            const bRect = b.getBoundingClientRect();
            return aRect.width * aRect.height - bRect.width * bRect.height;
        })[0] || part;
        const rect = element.getBoundingClientRect();
        const canvasRect = s.canvas.getBoundingClientRect();
        return {
            x: (rect.left - canvasRect.left) * s.width / canvasRect.width,
            y: (rect.top - canvasRect.top) * s.height / canvasRect.height,
            width: rect.width * s.width / canvasRect.width,
            height: rect.height * s.height / canvasRect.height
        };
    }

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);
        lossY = s.height / 2 - 125 - 100;
        title = new Text(s, {
            str: "At training start",
            x: s.width / 2, y: 140, mode: 1,
            size: 47, color: [235, 241, 250],
            start: 0, font: font
        });
        lossEquation = new AnimatedKatex(s, {
            parts: lossParts.map(function (part) {
                return Object.assign({}, part, {
                    start: 0, enterDuration: 0, fadeIn: false
                });
            }),
            x: s.width / 2, y: lossY, mode: 1,
            font_size: 32, color: colors.foreground
        });
        substitutedEquation = new AnimatedKatex(s, {
            parts: enteringParts([
                {key: "equals", text: "=", color: colors.foreground},
                {key: "negLog", text: "-\\log\\,\\sigma(",
                    color: colors.foreground},
                {key: "beta", text: "\\beta", color: colors.beta},
                {key: "openBracket", text: "[", color: colors.foreground},
                {key: "winnerZero", text: "0", color: colors.chosen},
                {key: "minus", text: "-", color: colors.foreground},
                {key: "loserZero", text: "0", color: colors.rejected},
                {key: "close", text: "])", color: colors.foreground}
            ], 7),
            x: 0, y: lossY + 70, mode: 0,
            font_size: 36, color: colors.foreground
        });
        halfEquation = new Katex(s, {
            text: "=-\\log(0.5)", x: 0, y: lossY + 105, mode: 0,
            font_size: 36, color: colors.foreground,
            start: frames(9), entryDuration: 1
        });
        halfEquation.entryTargetY = lossY + 150;
        resultEquation = new Katex(s, {
            text: "=0.69", x: 0, y: lossY + 185, mode: 0,
            font_size: 36, color: colors.foreground,
            start: frames(11), entryDuration: 1
        });
        resultEquation.entryTargetY = lossY + 230;
        termHighlights = [
            ["winnerTheta", "πθ", 1], ["loserTheta", "πθ", 1],
            ["winnerRef", "πref", 3], ["loserRef", "πref", 3]
        ].map(function (spec) {
            return new DPOScene38TextHighlight(s, {
                bounds: () => symbolBounds(spec[0], spec[1]),
                start: frames(spec[2]), end: frames(5),
                duration: 1, fadeDuration: 0.7, padding: 7
            });
        });
    };

    s.draw = function () {
        s.background(8, 12, 22);
        title.show();
        lossEquation.show();
        for (const highlight of termHighlights)
            highlight.show();

        const equalsBounds = lossEquation.getPartBounds("equals");
        substitutedEquation.x = equalsBounds.x;
        halfEquation.x = equalsBounds.x;
        resultEquation.x = equalsBounds.x;

        if (!halfEntryStarted && s.frameCount >= frames(9)) {
            halfEquation.move(
                halfEquation.x, halfEquation.entryTargetY, 1, 1
            );
            halfEntryStarted = true;
        }
        if (!resultEntryStarted && s.frameCount >= frames(11)) {
            resultEquation.move(
                resultEquation.x, resultEquation.entryTargetY, 1, 1
            );
            resultEntryStarted = true;
        }

        substitutedEquation.show();
        halfEquation.show();
        resultEquation.show();
    };
};

const DPOScene45 = function (s) {
    const colors = {
        foreground: "#ebf1fa",
        chosen: "#4dd999",
        rejected: "#ff7080",
        beta: "#f4c30a",
        prompt: "#4db1ff",
        response: "#f5ab5f",
        muted: "#9299a5",
        mutedPrompt: "#547b99"
    };
    const objectiveStart = frames(1);
    const jumpStart = frames(7);
    const jumpStagger = frames(0.03);
    const reentryStart = frames(25);
    const reentryStagger = frames(0.03);
    const implicitRewardLabelStart = frames(25);
    const focusStart = frames(31.5);
    const focusDuration = 1.2;
    const rewardCubeTransitionDuration = 0.8;
    const policyJumpTime = frames(33);
    const referenceJumpTime = frames(35.5);
    const partitionJumpTime = frames(38.2);
    const betaJumpTime = frames(40.1);
    const rewardSymbolJumpTime = frames(30);
    const objectiveHighlightStart = frames(14);
    const objectiveHighlightEnd = frames(18);
    const labelTransitionStart = frames(45);
    const labelTransitionDuration = 0.8;
    const comparisonStart = frames(49);
    const comparisonScaleStart = frames(51);
    const comparisonBaseSize = 40;
    let font;
    let lossEquation, implicitRewardEquation;
    let objectiveLabel, objectiveEquation, klNote, connector;
    let objectiveHighlight;
    let implicitRewardOverlay, implicitRewardLabel, secretRewardLabel;
    let rewardCube;
    let winnerReward, loserReward, comparisonScaleTimer;
    let rewardFocusStarted = false;
    let labelTransitionStarted = false;
    let comparisonScaleStarted = false;
    let cubeFocusStartX, cubeFocusStartY;

    const lossParts = [
        {key: "loss", text: "\\mathcal{L}_{\\mathrm{DPO}}", color: colors.foreground},
        {text: "=", color: colors.foreground},
        {text: "-\\log\\,\\sigma(", color: colors.foreground},
        {text: "\\beta", color: colors.beta},
        {text: "[", color: colors.foreground},
        {text: "(", color: colors.foreground},
        {text: "\\log", color: colors.chosen},
        {text: "\\pi_{\\theta}(y_w\\mid x)", color: colors.chosen},
        {text: "-", color: colors.foreground},
        {text: "\\log", color: colors.chosen},
        {text: "\\pi_{\\mathrm{ref}}(y_w\\mid x)", color: colors.chosen},
        {text: ")", color: colors.foreground},
        {text: "-", color: colors.foreground},
        {text: "(", color: colors.foreground},
        {text: "\\log", color: colors.rejected},
        {text: "\\pi_{\\theta}(y_l\\mid x)", color: colors.rejected},
        {text: "-", color: colors.foreground},
        {text: "\\log", color: colors.rejected},
        {text: "\\pi_{\\mathrm{ref}}(y_l\\mid x)", color: colors.rejected},
        {text: ")", color: colors.foreground},
        {text: "]", color: colors.foreground},
        {text: ")", color: colors.foreground}
    ];

    const rewardParts = [
        {key: "reward", text: "r(\\textcolor{" + colors.prompt + "}{x}," +
            "\\textcolor{" + colors.response + "}{y})",
            color: colors.foreground},
        {key: "rewardEquals", text: "=", color: colors.foreground},
        {key: "rewardBeta", text: "\\beta", color: colors.beta},
        {key: "rewardOpen", text: "(", color: colors.foreground},
        {key: "policyLog", text: "\\log", color: colors.foreground},
        {key: "policyProbability", text: "\\pi_r(" +
            "\\textcolor{" + colors.response + "}{y}\\mid" +
            "\\textcolor{" + colors.prompt + "}{x})",
            color: colors.foreground},
        {key: "rewardMinus", text: "-", color: colors.foreground},
        {key: "referenceLog", text: "\\log", color: colors.foreground},
        {key: "referenceProbability",
            text: "\\pi_{\\mathrm{ref}}(" +
                "\\textcolor{" + colors.response + "}{y}\\mid" +
                "\\textcolor{" + colors.prompt + "}{x})",
            color: colors.foreground},
        {key: "rewardPlus", text: "+", color: colors.muted},
        {key: "partitionLog", text: "\\log Z(\\textcolor{" +
            colors.mutedPrompt + "}{x})", color: colors.muted},
        {key: "rewardClose", text: ")", color: colors.foreground}
    ];

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);
        lossEquation = new AnimatedKatex(s, {
            parts: lossParts.map(function (part, index) {
                return Object.assign({}, part, {
                    key: part.key || "token" + index,
                    start: 0, end: reentryStart + index * reentryStagger,
                    enterDuration: 0, exitDuration: 0.7,
                    fadeIn: false, fadeOut: true
                });
            }),
            x: s.width / 2, y: s.height / 2 - 325, mode: 1,
            font_size: 32, color: colors.foreground
        });
        implicitRewardEquation = new AnimatedKatex(s, {
            parts: rewardParts.map(function (part, index) {
                return Object.assign({}, part, {
                    start: reentryStart + index * reentryStagger,
                    enterDuration: 0.7,
                    enterFrom: {x: 0, y: -45}, fadeIn: true
                });
            }),
            x: s.width / 2, y: s.height / 2 - 325, mode: 1,
            font_size: 32, color: colors.foreground
        });
        connector = new Arrow(s, {
            x1: s.width / 2, y1: 525,
            x2: s.width / 2, y2: 300,
            start: objectiveStart, duration: 0.8, mode: 1,
            strokeweight: 3, tipLen: 16, color: [235, 241, 250],
            end: focusStart
        });
        implicitRewardOverlay = new RoundedRect(s, {
            x: s.width / 2 - 176, y: 375,
            w: 352, h: 80, radius: 19.2,
            color: [77, 57, 17, 247],
            start: implicitRewardLabelStart,
            end: focusStart, duration: 0.8
        });
        implicitRewardLabel = new TextFade(s, {
            str: "implicit reward",
            x: s.width / 2, y: 410, mode: 1,
            size: 42, color: [247, 227, 47],
            start: implicitRewardLabelStart,
            end: labelTransitionStart,
            duration: labelTransitionDuration, font: font
        });
        secretRewardLabel = new TextFade(s, {
            str: "secretly a reward model",
            x: s.width / 2, y: s.height / 4 - 45, mode: 1,
            size: 42, color: [247, 227, 47],
            start: labelTransitionStart,
            duration: labelTransitionDuration, font: font
        });
        objectiveLabel = new TextFade(s, {
            str: "Reward-maximization*\nobjective in RLHF:",
            x: s.width / 2, y: 595, mode: 1,
            size: 43, color: [235, 241, 250], font: font,
            start: objectiveStart, duration: 0.8, end: focusStart
        });
        objectiveEquation = new Katex(s, {
            text: "\\underset{\\theta}{\\max}\\;\\mathbb{E}[r(" +
                "\\textcolor{" + colors.prompt + "}{x}," +
                "\\textcolor{" + colors.response + "}{y})]",
            x: s.width / 2, y: 745, mode: 1,
            font_size: 45, color: colors.foreground,
            start: objectiveStart, entryDuration: 0.8, end: focusStart
        });
        objectiveHighlight = new DPOScene38TextHighlight(s, {
            bounds: function () {
                const rect = objectiveEquation.k.elt.getBoundingClientRect();
                const canvasRect = s.canvas.getBoundingClientRect();
                return {
                    x: (rect.left - canvasRect.left) *
                        s.width / canvasRect.width,
                    y: (rect.top - canvasRect.top) *
                        s.height / canvasRect.height,
                    width: rect.width * s.width / canvasRect.width,
                    height: rect.height * s.height / canvasRect.height
                };
            },
            start: objectiveHighlightStart,
            end: objectiveHighlightEnd,
            duration: 1, fadeDuration: 0.7, padding: 10
        });
        rewardCube = new RotatingRewardCube(s, {
            x: s.width / 2 - 340, y: 610, size: 35,
            start: objectiveStart,
            entryDuration: rewardCubeTransitionDuration
        });
        winnerReward = new Katex(s, {
            text: "r(\\textcolor{" + colors.prompt + "}{x}," +
                "\\textcolor{" + colors.chosen + "}{y_w})",
            x: s.width * 0.36, y: s.height * 0.7, mode: 1,
            font_size: comparisonBaseSize, color: colors.foreground,
            start: comparisonStart, entryDuration: 0.7
        });
        loserReward = new Katex(s, {
            text: "r(\\textcolor{" + colors.prompt + "}{x}," +
                "\\textcolor{" + colors.rejected + "}{y_l})",
            x: s.width * 0.64, y: s.height * 0.7, mode: 1,
            font_size: comparisonBaseSize, color: colors.foreground,
            start: comparisonStart, entryDuration: 0.7
        });
        klNote = new TextFade(s, {
            str: "*Subject to a KL-penalty,\n" +
            "which penalizes changing the model too much from reference model",
            x: s.width / 2, y: 870, mode: 1,
            size: 30, color: [99, 99, 99], font: font,
            start: frames(2), duration: 1, end: frames(18)
        });
    };

    function showRewardCubeGlow() {
        const fadeFrames = frames(rewardCubeTransitionDuration);
        const entryProgress = s.constrain(
            (s.frameCount - objectiveStart) / fadeFrames, 0, 1
        );
        const linearStrength = entryProgress;
        if (linearStrength <= 0)
            return;
        const strength = linearStrength * linearStrength *
            (3 - 2 * linearStrength);
        const radius = 90;
        const context = s.drawingContext;
        const glow = context.createRadialGradient(
            rewardCube.x, rewardCube.y, 0,
            rewardCube.x, rewardCube.y, radius
        );
        glow.addColorStop(
            0, "rgba(247, 227, 47, " + 0.18 * strength + ")"
        );
        glow.addColorStop(
            0.45, "rgba(247, 227, 47, " + 0.07 * strength + ")"
        );
        glow.addColorStop(1, "rgba(247, 227, 47, 0)");
        context.save();
        context.fillStyle = glow;
        context.fillRect(
            rewardCube.x - radius, rewardCube.y - radius,
            radius * 2, radius * 2
        );
        context.restore();
    }

    s.draw = function () {
        s.background(8, 12, 22);
        if (!rewardFocusStarted && s.frameCount >= focusStart) {
            cubeFocusStartX = rewardCube.x;
            cubeFocusStartY = rewardCube.y;
            implicitRewardEquation.move(
                s.width / 2, s.height / 2, focusDuration, 1
            );
            implicitRewardLabel.move(
                s.width / 2, s.height / 4, focusDuration, 1
            );
            rewardFocusStarted = true;
        }
        if (!comparisonScaleStarted &&
            s.frameCount >= comparisonScaleStart) {
            comparisonScaleTimer = new Timer2(frames(1));
            comparisonScaleStarted = true;
        }
        if (!labelTransitionStarted &&
            s.frameCount >= labelTransitionStart) {
            implicitRewardLabel.move(
                s.width / 2, s.height / 4 + 45,
                labelTransitionDuration, 1
            );
            secretRewardLabel.move(
                s.width / 2, s.height / 4,
                labelTransitionDuration, 1
            );
            labelTransitionStarted = true;
        }
        if (comparisonScaleStarted) {
            const scaleProgress = comparisonScaleTimer.advance();
            winnerReward.size = comparisonBaseSize *
                (1 + 0.3 * scaleProgress);
            loserReward.size = comparisonBaseSize *
                (1 - 0.3 * scaleProgress);
        }
        if (s.frameCount >= focusStart) {
            const progress = s.constrain(
                (s.frameCount - focusStart) / frames(focusDuration), 0, 1
            );
            const eased = progress * progress * (3 - 2 * progress);
            implicitRewardEquation.size = 32 + 8 * eased;
        }
        for (let i = 0; i < lossParts.length; i++) {
            if (s.frameCount === jumpStart + i * jumpStagger) {
                lossEquation.jumpPart(
                    lossParts[i].key || "token" + i, 24, 0.45
                );
            }
        }
        if (s.frameCount === policyJumpTime)
            implicitRewardEquation.jumpPart("policyProbability", 24, 0.45);
        if (s.frameCount === referenceJumpTime)
            implicitRewardEquation.jumpPart("referenceProbability", 24, 0.45);
        if (s.frameCount === partitionJumpTime)
            implicitRewardEquation.jumpPart("partitionLog", 24, 0.45);
        if (s.frameCount === betaJumpTime)
            implicitRewardEquation.jumpPart("rewardBeta", 24, 0.45);
        if (s.frameCount === rewardSymbolJumpTime)
            implicitRewardEquation.jumpPart("reward", 24, 0.45);
        lossEquation.show();
        implicitRewardEquation.show();
        if (s.frameCount >= focusStart) {
            const progress = s.constrain(
                (s.frameCount - focusStart) / frames(focusDuration), 0, 1
            );
            const eased = progress * progress * (3 - 2 * progress);
            const rewardBounds = implicitRewardEquation.getPartBounds("reward");
            const targetX = rewardBounds.x - 120;
            const targetY = rewardBounds.centerY;
            rewardCube.x = cubeFocusStartX +
                (targetX - cubeFocusStartX) * eased;
            rewardCube.y = cubeFocusStartY +
                (targetY - cubeFocusStartY) * eased;
        }
        connector.show();
        implicitRewardOverlay.show();
        implicitRewardLabel.show();
        secretRewardLabel.show();
        objectiveLabel.show();
        objectiveEquation.show();
        objectiveHighlight.show();
        showRewardCubeGlow();
        rewardCube.show();
        winnerReward.show();
        loserReward.show();
        klNote.show();
    };
};

let dpo5 = new p5(DPOScene52);
