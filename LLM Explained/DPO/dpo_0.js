// Select the section highlighted by the outline: 1, 2, 3, 4a, 4b, 5, 6, or 7.
const DPO_OUTLINE_SECTION = "4b";

const DPOEmpty = function (s) {
    s.setup = function () {
        setup2D(s);
    };

    s.draw = function () {};
};

const DPOOutline = function (s) {
    const sections = [
        {id: "1", text: "1. Intro"},
        {id: "2", text: "2. Motivation: what does post-training aim to do?"},
        {id: "3", text: "3. Bradley–Terry: preference pairs are all you need"},
        {id: "4a", text: "4a. How DPO algorithm works"},
        {id: "4b", text: "4b. Why use a reference model?"},
        {id: "5", text: "5. “Your language model is secretly a reward model”"},
        {id: "6", text: "6. Bonus: automatic preference data generation"},
        {id: "7", text: "7. Wrap up"}
    ];
    const activeIndex = sections.findIndex(
        (section) => section.id === String(DPO_OUTLINE_SECTION)
    );
    if (activeIndex === -1)
        throw new Error("Invalid DPO_OUTLINE_SECTION: " + DPO_OUTLINE_SECTION);

    const baseColor = [47, 57, 67];
    const activeColor = [242, 246, 252];
    const baseSize = 37;
    const activeSize = 47;
    const textX = 455;
    const firstY = 179;
    const rowGap = 87;
    const highlightStart = frames(2);
    const highlightDuration = frames(1);
    let font;
    let subtitleTexts = [];

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);

        for (let i = 0; i < sections.length; i++) {
            subtitleTexts[i] = new Text(s, {
                str: sections[i].text,
                x: textX,
                y: firstY + i * rowGap,
                mode: 0,
                width: 1430,
                justify: false,
                size: baseSize,
                color: baseColor.slice(),
                font: font,
                start: 1
            });
        }
    };

    s.draw = function () {
        // This quadratic curve starts quickly and slows with constant deceleration.
        const linearTime = s.constrain(
            (s.frameCount - highlightStart) / highlightDuration,
            0,
            1
        );
        const deceleratedProgress = 1 - (1 - linearTime) * (1 - linearTime);
        const selectedText = subtitleTexts[activeIndex];
        selectedText.size = baseSize + (activeSize - baseSize) * deceleratedProgress;
        selectedText.color = baseColor.map((channel, index) =>
            channel + (activeColor[index] - channel) * deceleratedProgress
        );

        for (let subtitle of subtitleTexts)
            subtitle.show();
    };
};

const DPOAssume = function (s) {
    let font, attentionImage, backpropagationImage;
    let title, attentionFigure, backpropagationFigure, attentionCredit, backpropagationCredit;

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
        attentionImage = s.loadImage("../pic/3b1b-attn.png");
        backpropagationImage = s.loadImage("../pic/welch-back.png");
    };

    s.setup = function () {
        setup2D(s);
        title = new TextFade(s, {
            str: "This video assumes a basic level of familiarity with how LLMs work.",
            x: s.width / 2,
            y: 200,
            mode: 1,
            size: 44,
            color: [235, 241, 250],
            start: frames(0.5),
            duration: 0.7,
            font: font
        });
        attentionFigure = new ImageFadeUp(s, {
            img: attentionImage,
            x: 324,
            y: 360,
            w: 483,
            h: 381,
            start: frames(1.4),
            duration: 0.7,
            rise: 55
        });
        backpropagationFigure = new ImageFadeUp(s, {
            img: backpropagationImage,
            x: 1114,
            y: 365,
            w: 483,
            h: 383,
            start: frames(2.2),
            duration: 0.7,
            rise: 55
        });
        attentionCredit = new TextFade(s, {
            str: "@3Blue1Brown",
            x: 565,
            y: 785,
            mode: 1,
            size: 32,
            color: [235, 241, 250],
            start: frames(1.4),
            duration: 0.7,
            font: font
        });
        backpropagationCredit = new TextFade(s, {
            str: "@WelchLabs",
            x: 1355,
            y: 785,
            mode: 1,
            size: 32,
            color: [235, 241, 250],
            start: frames(2.2),
            duration: 0.7,
            font: font
        });
    };

    s.draw = function () {
        title.show();
        attentionFigure.show();
        backpropagationFigure.show();
        attentionCredit.show();
        backpropagationCredit.show();
    };
};


const DPOScene50 = function (s) {
    let font, boldFont, title;
    let topics = [];
    let topicStartTime = frames(0.8);
    let topicStagger = frames(0.35);
    let topicMoveDuration = 0.45;
    const topicStrings = [
        "Online and Iterative DPO",
        "PPO-Based RLHF",
        "SimPO, ORPO, and KTO",
        "GRPO for Reasoning Models",
        "Reward Hacking and Length Bias"
    ];

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
        boldFont = s.loadFont("../../lib/font/timesbd.ttf");
    };

    s.setup = function () {
        setup2D(s);
        title = new Text(s, {
            str: "Related topics",
            x: s.width / 2,
            y: 115,
            mode: 1,
            size: 52,
            color: [235, 241, 250],
            start: 1,
            font: font
        });

        for (let index = 0; index < topicStrings.length; index++) {
            const targetY = 265 + index * 115;
            const start = topicStartTime + index * topicStagger;
            const topic = new TextFade(s, {
                str: topicStrings[index],
                x: s.width / 2,
                y: targetY - 45,
                mode: 1,
                size: 43,
                color: [235, 241, 250],
                start: start,
                duration: topicMoveDuration,
                font: boldFont
            });
            topics.push({text: topic, targetY: targetY, start: start, moving: false});
        }
    };

    s.draw = function () {
        title.show();
        for (let topic of topics) {
            if (!topic.moving && s.frameCount >= topic.start) {
                topic.text.move(topic.text.x, topic.targetY, topicMoveDuration, 1);
                topic.moving = true;
            }
            topic.text.show();
        }
    };
};

const DPOEclipse = function (s) {
    const promptText = 'Prompt: "When is the next total solar eclipse in Beijing?"';
    const promptSize = 40;
    const sunRadius = 100;
    const featherWidth = 7;
    const sunStartTime = frames(2);
    const sunFadeDuration = frames(1);
    const eclipseStartTime = frames(5);
    const eclipseFadeDuration = frames(0.5);
    const eclipseCruiseEndTime = frames(6);
    const baseBackground = [8, 12, 22];
    const brightBackground = [16, 24, 35];
    const moonRadius = sunRadius;
    const moonSpeed = 200;
    const moonTouchTime = frames(5.5);
    const moonDecelerationStartOffset =
        sunRadius + featherWidth + moonRadius - sunRadius;
    const moonDecelerationDuration =
        frames(2 * moonDecelerationStartOffset / moonSpeed);
    const eclipseEndTime = eclipseCruiseEndTime + moonDecelerationDuration;
    const totalityHoldDuration = frames(0.5);
    const reverseStartTime = eclipseEndTime + totalityHoldDuration;
    const reverseEclipseDuration = eclipseEndTime - eclipseStartTime;
    const reverseEclipseEndTime = reverseStartTime + reverseEclipseDuration;
    const sunFadeOutDuration = frames(1);
    let font, prompt;

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);
        s.textFont(font);
        s.textSize(promptSize);

        // Match Scene 19's visual placement while using the requested
        // upper-left text anchor.
        prompt = new TextWriteIn(s, {
            str: promptText,
            x: s.width / 2 - s.textWidth(promptText) / 2,
            y: s.height / 4 - promptSize / 2,
            mode: 0,
            size: promptSize,
            color: [77, 177, 255],
            start: frames(0.5),
            font: font
        });
    };

    function eclipseFrame() {
        if (s.frameCount <= eclipseEndTime)
            return s.frameCount;
        if (s.frameCount <= reverseStartTime)
            return eclipseEndTime;
        if (s.frameCount <= reverseEclipseEndTime)
            return eclipseEndTime - (s.frameCount - reverseStartTime);
        return eclipseStartTime - 1;
    }

    function sunExitProgress() {
        return s.constrain(
            (s.frameCount - reverseEclipseEndTime) / sunFadeOutDuration,
            0,
            1
        );
    }

    function drawSun(progress) {
        if (progress <= 0)
            return;

        const centerX = s.width / 2;
        const centerY = s.height * 3 / 5;
        const outerRadius = sunRadius + featherWidth;
        const context = s.drawingContext;
        const gradient = context.createRadialGradient(
            centerX, centerY, 0, centerX, centerY, outerRadius
        );
        const alpha = progress;
        const coronaProgress = eclipseProgress();
        const featherGreen = 220 + 35 * coronaProgress;
        const featherBlue = 45 + 210 * coronaProgress;
        gradient.addColorStop(0, "rgba(255, 220, 45, " + alpha + ")");
        gradient.addColorStop(
            sunRadius / outerRadius,
            "rgba(255, " + featherGreen + ", " + featherBlue + ", " +
                alpha + ")"
        );
        gradient.addColorStop(
            1,
            "rgba(255, " + featherGreen + ", " + featherBlue + ", 0)"
        );

        context.save();
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
        context.fill();
        context.restore();
    }

    function eclipseProgress() {
        return s.constrain(
            (eclipseFrame() - eclipseCruiseEndTime) /
                moonDecelerationDuration,
            0,
            1
        );
    }

    function drawMoon() {
        const currentEclipseFrame = eclipseFrame();
        if (currentEclipseFrame < eclipseStartTime)
            return;

        const centerX = s.width / 2;
        const centerY = s.height * 3 / 5;
        const touchX = centerX + sunRadius + featherWidth + moonRadius;
        let moonX;

        if (currentEclipseFrame <= eclipseCruiseEndTime) {
            const secondsFromTouch =
                (currentEclipseFrame - moonTouchTime) / fr;
            moonX = touchX - moonSpeed * secondsFromTouch;
        } else {
            const progress = eclipseProgress();
            // Constant deceleration ends with the circles perfectly aligned
            // and the moon at rest.
            const eased = 2 * progress - progress * progress;
            moonX = centerX +
                moonDecelerationStartOffset * (1 - eased);
        }

        // On the way out, mirror the reversed path so the moon continues
        // traveling left instead of retreating to the right.
        if (s.frameCount > reverseStartTime)
            moonX = 2 * centerX - moonX;

        const alpha = 255 * s.constrain(
            (currentEclipseFrame - eclipseStartTime) / eclipseFadeDuration,
            0,
            1
        );
        const coveringProgress = s.constrain(
            (currentEclipseFrame - moonTouchTime) /
                (eclipseCruiseEndTime - moonTouchTime),
            0,
            1
        );
        const decelerationProgress = eclipseProgress();
        const moonColor = brightBackground.map(function (channel, index) {
            const baseChannel = channel +
                (baseBackground[index] - channel) * coveringProgress;
            return baseChannel * (1 - decelerationProgress);
        });
        s.noStroke();
        s.fill(moonColor[0], moonColor[1], moonColor[2], alpha);
        s.circle(moonX, centerY, moonRadius * 2);
    }

    s.draw = function () {
        const sunEntranceProgress = s.constrain(
            (s.frameCount - sunStartTime) / sunFadeDuration,
            0,
            1
        );
        const sunProgress = sunEntranceProgress * (1 - sunExitProgress());
        const darkness = eclipseProgress();
        const backgroundColor = baseBackground.map(function (channel, index) {
            const sunlitChannel = channel +
                (brightBackground[index] - channel) * sunProgress;
            return sunlitChannel * (1 - darkness);
        });

        s.background(
            backgroundColor[0], backgroundColor[1], backgroundColor[2]
        );
        drawSun(sunProgress);
        drawMoon();
        prompt.show();
    };
};

let dpo0 = new p5(DPOOutline);
