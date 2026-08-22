// Essence of Linear Regression (ELR), 2026 repost

const ELRScene01 = function (s) {
    const colors = {
        background: [8, 12, 22],
        foreground: [235, 241, 250],
        outline: [255, 255, 255],
        transmit: [247, 227, 47],
        token: [77, 217, 153]
    };
    const titleStart = frames(1);
    const pipelineStart = frames(3);
    const connectionStart = frames(3.7);
    const predictionStart = frames(5);
    const framesPerWord = 20;
    const initialWords = [
        "The", "curious", "student", "opened", "her", "notebook", "and",
        "began", "writing", "ideas"
    ];
    const predictedWords = [
        "about", "machines", "learning", "patterns", "from", "language,",
        "predicting", "each", "new", "word", "from", "everything", "that",
        "came", "before."
    ];
    const predictionEnd = predictionStart +
        predictedWords.length * framesPerWord;
    const zoomDelay = frames(1);
    const zoomDuration = frames(2);
    const sceneFadeDuration = frames(4 / 3);

    let font, title, contextRect, modelRect, tokenRect;
    let connect1, connect2, transmit1, transmit2, model, feedforward;
    let contextText, tokenText;
    let feedforwardEnd = Infinity;
    let zoomStart = Infinity;
    let zoomTimer, sceneFadeTimer;

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);

        title = new TextWriteIn(s, {
            str: "Autoregressive",
            x: s.width / 2,
            y: 175,
            size: 57,
            mode: 1,
            color: colors.foreground,
            start: titleStart,
            font: font
        });

        // The context panel is wider than DPOScene03's so the growing text fits.
        contextRect = new LinedRect(s, {
            x: 70, y: 439, w: 930, h: 260,
            start: pipelineStart, duration: 1.4, mode: 2,
            strokeweight: 2, color: colors.outline
        });
        modelRect = new LinedRect(s, {
            x: 1090, y: 439, w: 330, h: 260,
            start: pipelineStart, duration: 1.4, mode: 2,
            strokeweight: 2, color: colors.outline
        });
        tokenRect = new LinedRect(s, {
            x: 1510, y: 439, w: 300, h: 260,
            start: pipelineStart, duration: 1.4, mode: 2,
            strokeweight: 2, color: colors.outline
        });

        const firstConnection = {
            x1: contextRect.x + contextRect.w,
            y1: contextRect.y + contextRect.h / 2,
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

        model = new NeuralNetwork(s, {
            layers: [3, 5, 3],
            x: modelRect.x + modelRect.w / 2,
            y: modelRect.y + modelRect.h / 2,
            layerDistanceX: 90,
            neuronDistanceY: 40,
            radius: 21,
            start: pipelineStart,
            duration: 1.4,
            neuronEntryDuration: 0.3,
            edgeDuration: 0.45,
            strokeweight: 2.5,
            seed: 260726
        });
        feedforward = animateFeedforward(s, {
            network: model,
            start: predictionStart,
            activationDuration: 0.16,
            edgeDuration: 1 / 3,
            pauseDuration: 0.16,
            positiveColor: [45, 225, 205],
            negativeColor: [255, 157, 47],
            strokeweight: 6
        });
        feedforwardEnd = predictionStart + Math.ceil(
            (predictionEnd - predictionStart) / feedforward.cycleFrames
        ) * feedforward.cycleFrames;
        zoomStart = feedforwardEnd + zoomDelay;
        zoomTimer = new Timer2(zoomDuration);
        sceneFadeTimer = new Timer0(sceneFadeDuration);
        const predictionDuration = predictionEnd - predictionStart;
        for (let offset = 0; offset < predictionDuration;
             offset += feedforward.cycleFrames) {
            const start = predictionStart + offset;
            firstIntervals.push({start: start, end: start + 24});
            secondIntervals.push({start: start + 16, end: start + 40});
        }
        contextText = new TextFade(s, {
            str: initialWords.join(" "),
            x: contextRect.x + contextRect.w / 2,
            y: contextRect.y + contextRect.h / 2,
            mode: 1,
            size: 33,
            width: contextRect.w - 80,
            lineHeight: 48,
            justify: false,
            color: colors.foreground,
            start: pipelineStart,
            duration: 1,
            font: font
        });
        tokenText = new Text(s, {
            str: predictedWords[0],
            x: tokenRect.x + tokenRect.w / 2,
            y: tokenRect.y + tokenRect.h / 2,
            mode: 1,
            size: 49,
            color: colors.token,
            start: predictionStart,
            font: font
        });
    };

    function drawZoomedNeuron(source, target, progress) {
        const x = source.x + (target.x - source.x) * progress;
        const y = source.y + (target.y - source.y) * progress;
        const diameter = model.radius + (84 - model.radius) * progress;

        s.push();
        s.stroke(217, 222, 229);
        s.strokeWeight(2 + 4 * progress);
        s.fill(49, 54, 61);
        s.ellipse(x, y, diameter, diameter);
        s.pop();
        return {x: x, y: y};
    }

    function drawZoomedModel(progress) {
        const sources = model.neurons[0];
        const target = model.neurons[1][2];
        const sourceTargets = [
            {x: 800, y: 500},
            {x: 800, y: 640},
            {x: 800, y: 780}
        ];
        const targetPosition = {x: 1120, y: 640};
        const movedSources = sources.map(function (source, index) {
            return {
                x: source.x + (sourceTargets[index].x - source.x) * progress,
                y: source.y + (sourceTargets[index].y - source.y) * progress
            };
        });
        const movedTarget = {
            x: target.x + (targetPosition.x - target.x) * progress,
            y: target.y + (targetPosition.y - target.y) * progress
        };

        // Connections remain behind the four enlarged neurons.
        for (let index = 0; index < sources.length; index++) {
            const weight = model.weights[0][index][2];
            const color = weight >= 0 ? Blue : Red;
            const baseAlpha = Math.round(Math.abs(weight) * 255);
            const baseStrokeweight = model.strokeweight * Math.abs(weight) *
                model.edgeStrokeweightScale;
            s.push();
            s.stroke(color[0], color[1], color[2],
                baseAlpha + (255 - baseAlpha) * progress);
            s.strokeWeight(baseStrokeweight +
                (Math.max(7, baseStrokeweight * 4) - baseStrokeweight) * progress);
            s.line(movedSources[index].x, movedSources[index].y,
                movedTarget.x, movedTarget.y);
            s.pop();
        }

        for (let index = 0; index < sources.length; index++)
            drawZoomedNeuron(sources[index], sourceTargets[index], progress);
        drawZoomedNeuron(target, targetPosition, progress);
    }

    s.draw = function () {
        s.background.apply(s, colors.background);

        const elapsedFrames = Math.max(0, s.frameCount - predictionStart);
        const completedPredictions = Math.min(
            predictedWords.length,
            Math.floor(elapsedFrames / framesPerWord)
        );
        contextText.str = initialWords.concat(
            predictedWords.slice(0, completedPredictions)
        ).join(" ");
        tokenText.str = completedPredictions < predictedWords.length ?
            predictedWords[completedPredictions] : "";

        const zooming = s.frameCount >= zoomStart;
        const zoomProgress = zooming ? zoomTimer.advance() : 0;
        const sceneFadeProgress = zooming ? sceneFadeTimer.advance() : 0;

        s.push();
        s.drawingContext.globalAlpha *= 1 - sceneFadeProgress;
        title.show();
        contextRect.show();
        modelRect.show();
        tokenRect.show();
        transmit1.show();
        transmit2.show();
        connect1.show();
        connect2.show();
        contextText.show();
        tokenText.show();
        model.show();
        if (s.frameCount < feedforwardEnd)
            feedforward.show();
        s.pop();

        if (zooming)
            drawZoomedModel(zoomProgress);
    };

};

const ELRScene02 = function (s) {
    const colors = {
        background: [8, 12, 22],
        foreground: "#ebf1fa",
        neuronStroke: [217, 222, 229],
        neuronFill: [49, 54, 61],
        activations: ["#2dcdbc", "#4dd999", "#91e678"],
        weights: ["#a77dff", "#ce76ee", "#eb78cd"],
        bias: "#c9b32f"
    };
    const sourcePositions = [
        {x: 800, y: 500},
        {x: 800, y: 640},
        {x: 800, y: 780}
    ];
    const targetPosition = {x: 1120, y: 640};
    const weights = [-0.72, 0.8, -0.68];
    const neuronDiameter = 84;
    const firstStage = frames(1);
    const secondStage = frames(3);
    const finalStage = frames(4.5);
    const stagger = frames(0.2);
    const enterDuration = 0.7;
    const outputStage = finalStage + frames(enterDuration);
    const titleStage = outputStage + frames(enterDuration + 1);
    const emphasisStart = titleStage + frames(enterDuration + 1);
    const emphasisHalfDuration = frames(0.5);
    const emphasisEnd = emphasisStart + emphasisHalfDuration * 2;
    const networkTransitionStart = emphasisEnd + frames(1);
    const networkTransitionDuration = frames(1);
    const targetNetworkStart = networkTransitionStart + frames(0.5);
    const katexFadeDuration = frames(0.7);
    const enterFrom = {x: 0, y: -28};

    let font, title, equation;
    let activationLabels = [];
    let weightLabels = [];
    let outputLabel;
    let targetNetwork;
    let networkMoveTimer, emphasisEntryTimer, emphasisExitTimer;
    let titleFadeStarted = false;

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    function animatedPart(key, text, start, color) {
        return {
            key: key,
            text: text,
            color: color,
            start: start,
            enterDuration: enterDuration,
            enterFrom: enterFrom
        };
    }

    function singlePartLabel(key, text, x, y, start, color) {
        return new AnimatedKatex(s, {
            parts: [animatedPart(key, text, start, color)],
            x: x,
            y: y,
            mode: 1,
            font_size: 48,
            color: colors.foreground
        });
    }

    s.setup = function () {
        setup2D(s);

        title = new TextFade(s, {
            str: "Linear Regression",
            x: s.width / 2,
            y: 115,
            mode: 1,
            size: 57,
            color: [235, 241, 250],
            start: titleStage,
            duration: 0.7,
            font: font
        });
        equation = new AnimatedKatex(s, {
            parts: [
                animatedPart("a1", "x_1", firstStage, colors.activations[0]),
                animatedPart("w1", "\\beta_1", secondStage, colors.weights[0]),
                animatedPart("plus1", "+", finalStage),
                animatedPart("a2", "x_2", firstStage + stagger,
                    colors.activations[1]),
                animatedPart("w2", "\\beta_2", secondStage + stagger,
                    colors.weights[1]),
                animatedPart("plus2", "+", finalStage),
                animatedPart("a3", "x_3", firstStage + stagger * 2,
                    colors.activations[2]),
                animatedPart("w3", "\\beta_3", secondStage + stagger * 2,
                    colors.weights[2]),
                animatedPart("plus3", "+", finalStage),
                animatedPart("bias", "\\beta_0", finalStage, colors.bias),
                animatedPart("equals", "=", finalStage),
                animatedPart("output", "y", outputStage)
            ],
            x: s.width / 2,
            y: 275,
            mode: 1,
            font_size: 58,
            color: colors.foreground
        });

        for (let index = 0; index < sourcePositions.length; index++) {
            const start = firstStage + index * stagger;
            activationLabels[index] = singlePartLabel(
                "sourceA" + index,
                "x_" + (index + 1),
                sourcePositions[index].x - 105,
                sourcePositions[index].y,
                start,
                colors.activations[index]
            );
        }

        const weightLabelPositions = [
            {x: 960, y: 570},
            {x: 960, y: 640},
            {x: 960, y: 710}
        ];
        for (let index = 0; index < weightLabelPositions.length; index++) {
            const position = weightLabelPositions[index];
            weightLabels[index] = singlePartLabel(
                "edgeW" + index,
                "\\beta_" + (index + 1),
                position.x,
                position.y,
                secondStage + index * stagger,
                colors.weights[index]
            );
            // Keep the centered edge visible around, but not through, the glyph.
            weightLabels[index].k.style(
                "-webkit-text-stroke", "5px rgb(8, 12, 22)"
            );
            weightLabels[index].k.style("paint-order", "stroke fill");
        }

        outputLabel = singlePartLabel(
            "neuronOutput", "y", targetPosition.x + 105,
            targetPosition.y, outputStage
        );

        targetNetwork = new NeuralNetwork(s, {
            layers: [3, 5, 3],
            x: s.width / 2,
            y: s.height / 2,
            layerDistanceX: 170,
            neuronDistanceY: 90,
            radius: 42,
            start: targetNetworkStart,
            duration: 1.6,
            neuronEntryDuration: 0.4,
            layerDelay: 0.25,
            edgeDuration: 0.6,
            strokeweight: 3,
            seed: 260726
        });
        for (let index = 0; index < weights.length; index++)
            weights[index] = targetNetwork.weights[0][index][2];
        networkMoveTimer = new Timer2(networkTransitionDuration);
        emphasisEntryTimer = new Timer1(emphasisHalfDuration);
        emphasisExitTimer = new Timer1(emphasisHalfDuration);
    };

    function drawConnection(source, target, index, opacity, strokeweight) {
        const color = weights[index] >= 0 ? Blue : Red;
        s.push();
        s.stroke(color[0], color[1], color[2], 255 * opacity);
        s.strokeWeight(strokeweight === undefined ? 7 : strokeweight);
        s.line(source.x, source.y, target.x, target.y);
        s.pop();
    }

    function drawNeuron(position, diameter, opacity, strokeweight) {
        s.push();
        s.stroke(colors.neuronStroke[0], colors.neuronStroke[1],
            colors.neuronStroke[2], 255 * opacity);
        s.strokeWeight(strokeweight === undefined ? 6 : strokeweight);
        s.fill(colors.neuronFill[0], colors.neuronFill[1],
            colors.neuronFill[2], 255 * opacity);
        s.ellipse(position.x, position.y, diameter, diameter);
        s.pop();
    }

    function drawModel() {
        for (let index = 0; index < sourcePositions.length; index++)
            drawConnection(sourcePositions[index], targetPosition, index, 1);

        for (let position of sourcePositions.concat([targetPosition]))
            drawNeuron(position, neuronDiameter, 1);
    }

    function drawTransitionModel(moveProgress) {
        const movedSources = [];
        for (let index = 0; index < sourcePositions.length; index++) {
            const source = sourcePositions[index];
            const destination = targetNetwork.neurons[0][index];
            movedSources[index] = {
                x: source.x + (destination.x - source.x) * moveProgress,
                y: source.y + (destination.y - source.y) * moveProgress
            };
        }
        const targetDestination = targetNetwork.neurons[1][2];
        const movedTarget = {
            x: targetPosition.x +
                (targetDestination.x - targetPosition.x) * moveProgress,
            y: targetPosition.y +
                (targetDestination.y - targetPosition.y) * moveProgress
        };
        const diameter = neuronDiameter +
            (targetNetwork.radius - neuronDiameter) * moveProgress;
        const neuronStrokeweight = 6 + (2 - 6) * moveProgress;

        for (let index = 0; index < movedSources.length; index++) {
            const targetEdge = targetNetwork.edges[0][index][2];
            const opacity = 1 + (Math.abs(weights[index]) - 1) * moveProgress;
            const strokeweight = 7 +
                (targetEdge.strokeweight - 7) * moveProgress;
            drawConnection(movedSources[index], movedTarget, index,
                opacity, strokeweight);
        }
        for (let position of movedSources)
            drawNeuron(position, diameter, 1, neuronStrokeweight);
        drawNeuron(movedTarget, diameter, 1, neuronStrokeweight);
    }

    function drawTitleEmphasis() {
        if (s.frameCount < emphasisStart || s.frameCount > emphasisEnd)
            return;

        const x1 = 735;
        const x2 = 1185;
        const y = 163;
        let startX = x1;
        let endX = x2;
        if (s.frameCount < emphasisStart + emphasisHalfDuration) {
            const progress = emphasisEntryTimer.advance();
            endX = x1 + (x2 - x1) * progress;
        } else {
            const progress = emphasisExitTimer.advance();
            startX = x1 + (x2 - x1) * progress;
        }

        s.push();
        s.stroke(Yellow);
        s.strokeWeight(7);
        s.strokeCap(s.ROUND);
        s.line(startX, y, endX, y);
        s.pop();
    }

    function setKatexOpacity(opacity) {
        const expressions = [equation, outputLabel]
            .concat(activationLabels, weightLabels);
        for (let expression of expressions)
            expression.k.style("opacity", opacity);
    }

    function showExpressions() {
        equation.show();
        for (let label of activationLabels)
            label.show();
        for (let label of weightLabels)
            label.show();
        outputLabel.show();
    }

    function drawNetworkTransition() {
        const moveProgress = networkMoveTimer.advance();
        const fadeProgress = s.constrain(
            (s.frameCount - networkTransitionStart) / katexFadeDuration,
            0,
            1
        );
        targetNetwork.show();
        drawTransitionModel(moveProgress);
        setKatexOpacity(1 - fadeProgress);
        if (!titleFadeStarted) {
            title.ft.fadeOut(katexFadeDuration / fr);
            titleFadeStarted = true;
        }
    }

    function drawStaticModel() {
        if (s.frameCount < networkTransitionStart) {
            drawModel();
            return;
        }
        drawNetworkTransition();
    }

    s.draw = function () {
        s.background.apply(s, colors.background);
        drawStaticModel();
        title.show();
        drawTitleEmphasis();
        showExpressions();
    };
};

const ELRScene03 = function (s) {
    const colors = {
        background: [8, 12, 22],
        foreground: [235, 241, 250],
        muted: [155, 169, 190],
        sigmoid: [201, 139, 60]
    };
    const sigmoidStart = frames(1);
    const axesDuration = frames(0.7);
    const curveStart = sigmoidStart + axesDuration;
    const curveDuration = frames(1.2);
    const sigmoidEnd = curveStart + curveDuration;
    const attentionStart = sigmoidEnd;
    const cellSize = 44;
    const cellGap = 8;
    const gridX = 1370;
    const gridY = 430;
    const cellDrawDuration = frames(0.35);
    const cellStagger = frames(0.035);
    const fillDelay = frames(0.35);
    const fillDuration = frames(0.5);
    const fillStagger = frames(0.04);
    const attentionCellCount = 28;
    const layeredNetworkStart = attentionStart + fillDelay +
        (attentionCellCount - 1) * fillStagger + fillDuration;
    const layeredNetworkStagger = frames(0.2);
    const layeredNetworkOffsetX = 35;
    const layeredNetworkOffsetY = -28;
    const layeredNetworkOpacities = [0.5, 0.3, 0.12];

    let font, network, sigmoidAxes, nonlinearityTitle, attentionTitle;
    let attentionCells = [];
    const layeredNetworks = [];

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    function easeOut(progress) {
        const t = s.constrain(progress, 0, 1);
        return 1 - (1 - t) * (1 - t);
    }

    function smoothstep(progress) {
        const t = s.constrain(progress, 0, 1);
        return t * t * (3 - 2 * t);
    }

    function drawPerimeter(x, y, size, progress) {
        const length = size * 4;
        let remaining = length * easeOut(progress);
        const segments = [
            {x1: x, y1: y, x2: x + size, y2: y},
            {x1: x + size, y1: y, x2: x + size, y2: y + size},
            {x1: x + size, y1: y + size, x2: x, y2: y + size},
            {x1: x, y1: y + size, x2: x, y2: y}
        ];
        for (let segment of segments) {
            if (remaining <= 0)
                break;
            const amount = Math.min(size, remaining) / size;
            s.line(segment.x1, segment.y1,
                segment.x1 + (segment.x2 - segment.x1) * amount,
                segment.y1 + (segment.y2 - segment.y1) * amount);
            remaining -= size;
        }
    }

    function drawCompressedSigmoid() {
        if (s.frameCount < sigmoidStart)
            return;

        sigmoidAxes.showAxes();

        if (s.frameCount < curveStart)
            return;
        const curveProgress = easeOut(
            (s.frameCount - curveStart) / curveDuration
        );
        const sampleCount = 100;
        const lastSample = Math.max(1, Math.floor(sampleCount * curveProgress));
        s.push();
        s.noFill();
        s.stroke(colors.sigmoid);
        s.strokeWeight(5);
        s.strokeCap(s.ROUND);
        s.beginShape();
        for (let index = 0; index <= lastSample; index++) {
            const xValue = -6 + 12 * index / sampleCount;
            const probability = 1 / (1 + Math.exp(-xValue));
            const x = sigmoidAxes.left +
                (sigmoidAxes.right - sigmoidAxes.left) * index / sampleCount;
            const y = sigmoidAxes.centerY -
                probability * sigmoidAxes.stepY;
            s.vertex(x, y);
        }
        s.endShape();
        s.pop();
    }

    function drawAttentionGrid() {
        for (let cell of attentionCells) {
            const fillProgress = smoothstep(
                (s.frameCount - cell.fillStart) / fillDuration
            );
            if (fillProgress > 0) {
                s.push();
                s.noStroke();
                s.fill(cell.intensity, 255 * fillProgress);
                s.rect(cell.x + 2, cell.y + 2,
                    cellSize - 4, cellSize - 4, 3);
                s.pop();
            }

            const outlineProgress = (s.frameCount - cell.outlineStart) /
                cellDrawDuration;
            if (outlineProgress > 0) {
                s.push();
                s.noFill();
                s.stroke(colors.muted);
                s.strokeWeight(2);
                s.strokeCap(s.ROUND);
                drawPerimeter(cell.x, cell.y, cellSize, outlineProgress);
                s.pop();
            }
        }
    }

    s.setup = function () {
        setup2D(s);

        sigmoidAxes = new Axes(s, {
            left: 105,
            right: 595,
            centerX: 350,
            centerY: 650,
            top: 425,
            bottom: 750,
            stepX: 490 / 12,
            stepY: 205,
            labelX: "x",
            labelY: "y",
            start: curveStart
        });
        // Match the shorter sigmoid entrance instead of Axes' one-second default.
        sigmoidAxes.xAxis.timer = new Timer0(axesDuration);
        sigmoidAxes.yAxis.timer = new Timer0(axesDuration);
        sigmoidAxes.label1.x = sigmoidAxes.right + 12;
        sigmoidAxes.label1.y = sigmoidAxes.centerY - 18;
        sigmoidAxes.label2.x = sigmoidAxes.centerX + 16;
        sigmoidAxes.label2.y = sigmoidAxes.top - 35;

        network = new NeuralNetwork(s, {
            layers: [3, 5, 3],
            x: s.width / 2,
            y: s.height / 2,
            layerDistanceX: 170,
            neuronDistanceY: 90,
            radius: 42,
            start: 1,
            duration: 0.8,
            neuronEntryDuration: 0.25,
            layerDelay: 0.12,
            edgeDuration: 0.4,
            strokeweight: 3,
            seed: 260726
        });
        for (let index = 0; index < layeredNetworkOpacities.length; index++) {
            layeredNetworks.push(new NeuralNetwork(s, {
                layers: [3, 5, 3],
                x: s.width / 2 + layeredNetworkOffsetX * (index + 1),
                y: s.height / 2 + layeredNetworkOffsetY * (index + 1),
                layerDistanceX: 170,
                neuronDistanceY: 90,
                radius: 42,
                start: layeredNetworkStart + index * layeredNetworkStagger,
                duration: 0.8,
                neuronEntryDuration: 0.25,
                layerDelay: 0.12,
                edgeDuration: 0.4,
                strokeweight: 3,
                seed: 260727 + index
            }));
        }
        nonlinearityTitle = new TextFade(s, {
            str: "Nonlinearity",
            x: 350,
            y: 350,
            mode: 1,
            size: 42,
            color: colors.foreground,
            start: curveStart,
            duration: 0.5,
            font: font
        });
        attentionTitle = new TextFade(s, {
            str: "Attention",
            x: gridX + (cellSize * 7 + cellGap * 6) / 2,
            y: 350,
            mode: 1,
            size: 42,
            color: colors.foreground,
            start: attentionStart,
            duration: 0.5,
            font: font
        });

        const random = NeuralNetwork.seededWeightRandom(260817);
        let index = 0;
        for (let row = 0; row < 7; row++) {
            const count = 7 - row;
            for (let column = 0; column < count; column++) {
                attentionCells.push({
                    x: gridX + column * (cellSize + cellGap),
                    y: gridY + row * (cellSize + cellGap),
                    intensity: Math.round(35 + (random() + 1) / 2 * 210),
                    outlineStart: attentionStart + index * cellStagger,
                    fillStart: attentionStart + fillDelay + index * fillStagger
                });
                index++;
            }
        }
    };

    s.draw = function () {
        s.background.apply(s, colors.background);
        for (let index = layeredNetworks.length - 1; index >= 0; index--) {
            s.push();
            s.drawingContext.globalAlpha *= layeredNetworkOpacities[index];
            layeredNetworks[index].show();
            s.pop();
        }
        network.show();
        nonlinearityTitle.show();
        drawCompressedSigmoid();
        attentionTitle.show();
        drawAttentionGrid();
    };
};

const ELRScene04 = function (s) {
    const colors = {
        background: [8, 12, 22],
        foreground: "#ebf1fa",
        activations: ["#2dcdbc", "#4dd999", "#91e678"],
        weights: ["#a77dff", "#ce76ee", "#eb78cd"],
        bias: "#f7e32f"
    };
    const weightJump = frames(2);
    const outputJump = frames(4);
    const activationJump = frames(5);
    const jumpHeight = 19;
    const jumpDuration = 0.55;
    const jumpStagger = frames(0.1);
    const equationExit = frames(7);
    const equationExitStagger = frames(0.05);
    const equationExitDuration = frames(0.7);
    const titleMoveDuration = 1;
    const prefixStart = frames(8.5);
    const headingY = 65;
    const cardStagger = frames(0.3);
    const cardDuration = frames(0.65);
    const thumbnailWidth = 430;
    const thumbnailHeight = 250;
    const thumbnailRise = 38;
    const columnX = [175, 745, 1315];
    const rowY = [170, 575];
    const captions = [
        "Simple Linear Regression",
        "Overdetermined\nSystem of Equations",
        "The Normal Equation",
        "Multiple Regression",
        "Least Squares",
        "The Projection Matrix"
    ];
    const equationKeys = [
        "a1", "w1", "plus1", "a2", "w2", "plus2",
        "a3", "w3", "plus3", "bias", "equals", "output"
    ];

    let font, italicFont, title, titlePrefix, equation;
    let titleTargetX;
    let titleMoveStarted = false;
    const images = [];
    const thumbnails = [];
    const labels = [];
    const unfinishedLabels = [];
    const cards = [];

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
        italicFont = s.loadFont("../../lib/font/timesi.ttf");
        for (let index = 0; index < 6; index++)
            images.push(s.loadImage("../pic/elr-" + (index + 1) + ".png"));
    };

    function staticPart(key, text, color) {
        return {
            key: key,
            text: text,
            color: color,
            start: -1,
            fadeIn: false,
            enterDuration: 0
        };
    }

    function showBadge(card) {
        const elapsed = s.frameCount - card.start;
        if (elapsed < 0) return;
        const linearProgress = s.constrain(elapsed / cardDuration, 0, 1);
        const progress = linearProgress * linearProgress *
            (3 - 2 * linearProgress);
        const badgeX = card.x + 34;
        const badgeY = card.y + 34 + thumbnailRise * (1 - progress);
        const badgeColor = card.index >= 4 ? [155, 161, 171] : [235, 241, 250];

        s.push();
        s.stroke(badgeColor[0], badgeColor[1], badgeColor[2], 255 * progress);
        s.strokeWeight(2.5);
        s.fill(8, 12, 22, 127.5 * progress);
        s.circle(badgeX, badgeY, 48);
        s.noStroke();
        s.fill(badgeColor[0], badgeColor[1], badgeColor[2], 255 * progress);
        s.textFont(card.index >= 4 ? italicFont : font);
        s.textSize(37);
        s.textAlign(s.CENTER, s.CENTER);
        s.text(String(card.index + 1), badgeX, badgeY - 4);
        s.pop();
    }

    function showFinishedOutline(card) {
        if (card.index >= 4) return;
        const elapsed = s.frameCount - card.start;
        if (elapsed < 0) return;
        const linearProgress = s.constrain(elapsed / cardDuration, 0, 1);
        const progress = linearProgress * linearProgress *
            (3 - 2 * linearProgress);

        s.push();
        s.noFill();
        s.stroke(184, 230, 193);
        s.strokeWeight(3 * progress);
        s.rect(card.x, card.y, thumbnailWidth, thumbnailHeight);
        s.pop();
    }

    s.setup = function () {
        setup2D(s);
        title = new Text(s, {
            str: "Linear Regression",
            x: s.width / 2,
            y: 340,
            mode: 1,
            size: 57,
            color: [235, 241, 250],
            start: -1,
            font: font
        });
        equation = new AnimatedKatex(s, {
            parts: [
                staticPart("a1", "x_1", colors.activations[0]),
                staticPart("w1", "\\beta_1", colors.weights[0]),
                staticPart("plus1", "+"),
                staticPart("a2", "x_2", colors.activations[1]),
                staticPart("w2", "\\beta_2", colors.weights[1]),
                staticPart("plus2", "+"),
                staticPart("a3", "x_3", colors.activations[2]),
                staticPart("w3", "\\beta_3", colors.weights[2]),
                staticPart("plus3", "+"),
                staticPart("bias", "\\beta_0", colors.bias),
                staticPart("equals", "="),
                staticPart("output", "y")
            ],
            x: s.width / 2,
            y: 540,
            mode: 1,
            font_size: 58,
            color: colors.foreground
        });

        s.textFont(font);
        s.textSize(57);
        const prefixWidth = s.textWidth("Essence of ");
        const titleWidth = s.textWidth("Linear Regression");
        const headingLeft = (s.width - prefixWidth - titleWidth) / 2;
        titleTargetX = headingLeft + prefixWidth + titleWidth / 2;
        titlePrefix = new TextWriteIn(s, {
            str: "Essence of ",
            x: headingLeft,
            y: headingY,
            mode: 3,
            size: 57,
            color: [235, 241, 250],
            start: prefixStart,
            font: font
        });

        for (let index = 0; index < equationKeys.length; index++) {
            const state = equation.partStates[equationKeys[index]];
            state.end = equationExit + index * equationExitStagger;
            state.exitFrames = equationExitDuration;
            state.exitTo = {x: 0, y: 28};
            state.fadeOut = true;
        }

        for (let index = 0; index < 6; index++) {
            const column = index % 3;
            const row = Math.floor(index / 3);
            const x = columnX[column];
            const y = rowY[row];
            const start = prefixStart + index * cardStagger;
            const card = {index: index, x: x, y: y, start: start};
            cards.push(card);
            thumbnails.push(new ImageFadeUp(s, {
                img: images[index],
                x: x,
                y: y,
                w: thumbnailWidth,
                h: thumbnailHeight,
                start: start,
                duration: 0.65,
                rise: thumbnailRise
            }));
            labels.push(new TextFade(s, {
                str: captions[index],
                x: x + thumbnailWidth / 2,
                y: y + thumbnailHeight + 42 + (index === 1 ? 17 : 0),
                mode: 1,
                size: 42,
                lineHeight: index === 1 ? 38 : 34,
                color: index >= 4 ? [155, 161, 171] : [235, 241, 250],
                start: start,
                duration: 1,
                font: index >= 4 ? italicFont : font
            }));
            if (index >= 4) {
                unfinishedLabels.push(new TextFade(s, {
                    str: "(unfinished)",
                    x: x + thumbnailWidth / 2,
                    y: y + thumbnailHeight + 88,
                    mode: 1,
                    size: 29,
                    color: [112, 118, 128],
                    start: start + frames(0.1),
                    duration: 0.5,
                    font: italicFont
                }));
            }
        }
    };

    s.draw = function () {
        s.background.apply(s, colors.background);
        const coefficientKeys = ["w1", "w2", "w3", "bias"];
        for (let index = 0; index < coefficientKeys.length; index++) {
            if (s.frameCount === weightJump + index * jumpStagger)
                equation.jumpPart(coefficientKeys[index], jumpHeight,
                    jumpDuration);
        }
        if (s.frameCount === outputJump)
            equation.jumpPart("output", jumpHeight, jumpDuration);
        const activationKeys = ["a1", "a2", "a3"];
        for (let index = 0; index < activationKeys.length; index++) {
            if (s.frameCount === activationJump + index * jumpStagger)
                equation.jumpPart(activationKeys[index], jumpHeight,
                    jumpDuration);
        }
        if (!titleMoveStarted && s.frameCount >= equationExit) {
            title.move(titleTargetX, headingY, titleMoveDuration, 2);
            titleMoveStarted = true;
        }

        title.show();
        titlePrefix.show();
        equation.show();
        for (let index = 0; index < thumbnails.length; index++) {
            if (index >= 4) {
                s.drawingContext.save();
                s.drawingContext.globalAlpha *= 0.7;
                thumbnails[index].show();
                s.drawingContext.restore();
            } else {
                thumbnails[index].show();
            }
            showFinishedOutline(cards[index]);
            showBadge(cards[index]);
            labels[index].show();
        }
        for (let index = 0; index < unfinishedLabels.length; index++)
            unfinishedLabels[index].show();
    };
};

const ELRScene05 = function (s) {
    const foreground = [235, 241, 250];
    const muted = [145, 153, 165];
    const start = frames(1);
    const logoWidth = 225;
    const logoHeight = 126;
    // The 800x450 asset's visible mark spans approximately x=252..552.
    const logoVisibleWidth = logoWidth * 300 / 800;
    const logoLeftInset = logoWidth * 252 / 800;
    const gap = 28;
    const textSize = 52;

    let font, logoImage, logo, channelPrefix, channelHandle;

    s.preload = function () {
        font = s.loadFont("../../lib/font/arial.ttf");
        logoImage = s.loadImage("../../lib/img/youtube_logo.webp");
    }

    s.setup = function () {
        setup2D(s);
        s.background(0);
        const prefix = "youtube.com/";
        const handle = "@JazonJiao";
        s.textFont(font);
        s.textSize(textSize);
        const prefixWidth = s.textWidth(prefix);
        const handleWidth = s.textWidth(handle);
        const textWidth = prefixWidth + handleWidth;
        const groupWidth = logoVisibleWidth + gap + textWidth;
        const groupLeft = (s.width - groupWidth) / 2;
        const centerY = s.height / 2;

        logo = new ImageFadeUp(s, {
            img: logoImage,
            x: groupLeft - logoLeftInset,
            y: centerY - logoHeight / 2,
            w: logoWidth,
            h: logoHeight,
            start: start,
            duration: 0.7,
            rise: 40
        });
        const textLeft = groupLeft + logoVisibleWidth + gap;
        channelPrefix = new TextFade(s, {
            str: prefix,
            x: textLeft + prefixWidth / 2,
            y: centerY,
            mode: 1,
            size: textSize,
            color: muted,
            start: start,
            duration: 0.7,
            font: font
        });
        channelHandle = new TextFade(s, {
            str: handle,
            x: textLeft + prefixWidth + handleWidth / 2,
            y: centerY,
            mode: 1,
            size: textSize,
            color: foreground,
            start: start,
            duration: 0.7,
            font: font
        });
    };

    s.draw = function () {
        s.background(0);
        logo.show();
        channelPrefix.show();
        channelHandle.show();
    };
};

const ELRTitles = function (s) {
    const selectedChapter = 4; // Configure with a chapter number from 1 through 4.
    const transitionStart = frames(2);
    const transitionDuration = frames(1);
    const foreground = [235, 241, 250];
    const muted = [155, 161, 171];
    const darkerMuted = [112, 118, 128];
    const finished = [184, 230, 193];
    const thumbnailWidth = 430;
    const thumbnailHeight = 250;
    const columnX = [175, 745, 1315];
    const rowY = [170, 575];
    const focusedScale = 1.5;
    const captions = [
        "Simple Linear Regression",
        "Overdetermined\nSystem of Equations",
        "The Normal Equation",
        "Multiple Regression",
        "Least Squares",
        "The Projection Matrix"
    ];

    let font, italicFont, transitionTimer;
    let transitionProgress = 0;
    const images = [];
    const cards = [];

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
        italicFont = s.loadFont("../../lib/font/timesi.ttf");
        for (let index = 0; index < 6; index++)
            images.push(s.loadImage("../pic/elr-" + (index + 1) + ".png"));
    };

    function smoothstep(progress) {
        const t = s.constrain(progress, 0, 1);
        return t * t * (3 - 2 * t);
    }

    function interpolate(from, to, progress) {
        return from + (to - from) * progress;
    }

    function drawCaption(card, centerX, centerY, alpha) {
        const unfinished = card.index >= 4;
        s.push();
        s.textFont(unfinished ? italicFont : font);
        s.textSize(42);
        s.textLeading(card.index === 1 ? 45 : 34);
        s.textAlign(s.CENTER, s.CENTER);
        const color = unfinished ? muted : foreground;
        s.fill(color[0], color[1], color[2], 255 * alpha);
        s.noStroke();
        s.text(captions[card.index], centerX, centerY);
        if (unfinished) {
            s.textFont(italicFont);
            s.textSize(29);
            s.fill(darkerMuted[0], darkerMuted[1], darkerMuted[2], 255 * alpha);
            s.text("(unfinished)", centerX, centerY + 46);
        }
        s.pop();
    }

    function drawBadge(card, x, y, alpha, scale) {
        const gray = card.index >= 4;
        const color = gray ? muted : foreground;
        const badgeX = x + 34 * scale;
        const badgeY = y + 34 * scale;
        s.push();
        s.stroke(color[0], color[1], color[2], 255 * alpha);
        s.strokeWeight(2.5 * scale);
        s.fill(0, 0, 0, 127.5 * alpha);
        s.circle(badgeX, badgeY, 48 * scale);
        s.noStroke();
        s.fill(color[0], color[1], color[2], 255 * alpha);
        s.textFont(gray ? italicFont : font);
        s.textSize(37 * scale);
        s.textAlign(s.CENTER, s.CENTER);
        s.text(String(card.index + 1), badgeX, badgeY - 4 * scale);
        s.pop();
    }

    function drawCard(card, moveProgress, fadeProgress) {
        const selected = card.index === selectedChapter - 1;
        const alpha = selected ? 1 : 1 - fadeProgress;
        const auxiliaryAlpha = selected ? 1 : 1 - fadeProgress;
        if (alpha <= 0) return;
        const scale = selected ? interpolate(1, focusedScale, moveProgress) : 1;
        const width = thumbnailWidth * scale;
        const height = thumbnailHeight * scale;
        const targetX = (s.width - thumbnailWidth * focusedScale) / 2;
        const targetY = (s.height - thumbnailHeight * focusedScale) / 2;
        const x = selected ? interpolate(card.x, targetX, moveProgress) : card.x;
        const y = selected ? interpolate(card.y, targetY, moveProgress) : card.y;
        const captionOffset = card.index === 1 ? 17 : 0;
        const captionStartX = card.x + thumbnailWidth / 2;
        const captionStartY = card.y + thumbnailHeight + 42 + captionOffset;
        const captionTargetX = s.width / 2;
        const captionTargetY = targetY + thumbnailHeight * focusedScale +
            42 + captionOffset;
        const captionX = selected ?
            interpolate(captionStartX, captionTargetX, moveProgress) : captionStartX;
        const captionY = selected ?
            interpolate(captionStartY, captionTargetY, moveProgress) : captionStartY;

        s.push();
        if (card.index >= 4)
            s.tint(255, 255 * 0.7 * alpha);
        else
            s.tint(255, 255 * alpha);
        s.image(images[card.index], x, y, width, height);
        s.noTint();
        s.pop();

        if (card.index < 4 && auxiliaryAlpha > 0) {
            s.push();
            s.noFill();
            s.stroke(finished[0], finished[1], finished[2],
                255 * auxiliaryAlpha);
            s.strokeWeight(3);
            s.rect(x, y, width, height);
            s.pop();
        }
        drawBadge(card, x, y, alpha, scale);
        if (auxiliaryAlpha > 0)
            drawCaption(card, captionX, captionY, auxiliaryAlpha);
    }

    s.setup = function () {
        setup2D(s);
        transitionTimer = new Timer1(transitionDuration);
        if (selectedChapter < 1 || selectedChapter > 4)
            throw new Error("ELRTitles selectedChapter must be from 1 through 4.");
        for (let index = 0; index < 6; index++) {
            cards.push({
                index: index,
                x: columnX[index % 3],
                y: rowY[Math.floor(index / 3)]
            });
        }
    };

    s.draw = function () {
        s.background(0);
        if (s.frameCount >= transitionStart && transitionProgress < 1)
            transitionProgress = transitionTimer.advance();
        const progress = transitionProgress;
        const fadeProgress = smoothstep(
            (s.frameCount - transitionStart) / transitionDuration
        );

        s.push();
        s.noStroke();
        s.fill(foreground[0], foreground[1], foreground[2],
            255 * (1 - fadeProgress));
        s.textFont(font);
        s.textSize(57);
        s.textAlign(s.CENTER, s.CENTER);
        s.text("Essence of Linear Regression", s.width / 2, 65);
        s.pop();

        for (let index = 0; index < cards.length; index++)
            if (index !== selectedChapter - 1)
                drawCard(cards[index], progress, fadeProgress);
        drawCard(cards[selectedChapter - 1], progress, fadeProgress);
    };
};

let elr = new p5(ELRScene01);
