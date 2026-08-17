const ELRScene01 = function (s) {
    const colors = {
        background: [8, 12, 22],
        foreground: [235, 241, 250],
        outline: [255, 255, 255],
        transmit: [247, 227, 47],
        token: [77, 177, 255]
    };
    const pipelineStart = frames(1);
    const connectionStart = frames(1.7);
    const modelStart = frames(1.5);
    const predictionStart = frames(3);
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

    let font, title, contextRect, modelRect, tokenRect;
    let connect1, connect2, transmit1, transmit2, model;
    let contextText, tokenText;

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);

        title = new TextFade(s, {
            str: "Autoregressive",
            x: s.width / 2,
            y: 175,
            size: 48,
            mode: 1,
            color: colors.foreground,
            start: predictionStart,
            duration: 0.7,
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
        for (let i = 0; i < predictedWords.length; i++) {
            const start = predictionStart + i * framesPerWord;
            firstIntervals.push({start: start, end: start + 12});
            secondIntervals.push({start: start + 8, end: start + 20});
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
        contextText = new Text(s, {
            str: initialWords.join(" "),
            x: contextRect.x + contextRect.w / 2,
            y: contextRect.y + contextRect.h / 2,
            mode: 1,
            size: 33,
            width: contextRect.w - 80,
            lineHeight: 48,
            justify: false,
            color: colors.foreground,
            start: predictionStart,
            font: font
        });
        tokenText = new Text(s, {
            str: predictedWords[0],
            x: tokenRect.x + tokenRect.w / 2,
            y: tokenRect.y + tokenRect.h / 2,
            mode: 1,
            size: 40,
            color: colors.token,
            start: predictionStart,
            font: font
        });
    };

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
        model.showAt(modelRect.x + 10, modelRect.y + 20, 420);
    };

};

let elr = new p5(ELRScene01);
