// Select the section highlighted by the outline: 1, 2, 3, 4a, 4b, 5, 6, or 7.
const DPO_OUTLINE_SECTION = "7";

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
    const eclipseDurationScale = 1.5;
    const eclipseFadeDuration = frames(0.5 * eclipseDurationScale);
    const eclipseCruiseEndTime = eclipseStartTime +
        frames(1 * eclipseDurationScale);
    const baseBackground = [8, 12, 22];
    const brightBackground = [16, 24, 35];
    const moonRadius = sunRadius;
    const moonSpeed = 200 / eclipseDurationScale;
    const moonTouchTime = eclipseStartTime +
        frames(0.5 * eclipseDurationScale);
    const moonDecelerationStartOffset =
        sunRadius + featherWidth + moonRadius - sunRadius;
    const moonDecelerationDuration =
        frames(2 * moonDecelerationStartOffset / moonSpeed);
    const eclipseEndTime = eclipseCruiseEndTime + moonDecelerationDuration;
    const totalityHoldDuration = frames(0.5);
    const reverseStartTime = eclipseEndTime + totalityHoldDuration;
    const reverseEclipseDuration = eclipseEndTime - eclipseStartTime;
    const reverseEclipseEndTime = reverseStartTime + reverseEclipseDuration;
    const sunFadeOutStartTime = reverseEclipseEndTime + frames(0.7);
    const sunFadeOutDuration = frames(1);
    let font, prompt, eclipseDate;

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
        eclipseDate = new TextFade(s, {
            str: "Aug 12, 2026",
            x: 90, // s.width / 2,
            y: 60, // s.height * 3 / 5 + sunRadius + 129,
            mode: 0,
            size: 24,
            color: [99, 103, 117],
            start: frames(9),
            end: frames(11),
            duration: 0.5,
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
            (s.frameCount - sunFadeOutStartTime) / sunFadeOutDuration,
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
        eclipseDate.show();
    };
};

const DPOThumbnail = function (s) {
    const foreground = [235, 241, 250];
    const chosen = [77, 217, 153];
    const rejected = [255, 112, 128];
    const chosenMark = [40, 255, 90];
    const rejectedMark = [255, 45, 55];
    const panelCenterXs = [350, 960, 1570];
    const panelCenterY = 385 + 585 / 2;
    const panelSize = 585 * 0.75;
    const panelY = panelCenterY - panelSize / 2;
    const panelXs = panelCenterXs.map((x) => x - panelSize / 2);
    let font;
    let titlePrefix, titleReward, preferredAnswer, rejectedAnswer, dpoLabel;
    let brain, rewardCube, rewardLabel;

    s.preload = function () {
        font = s.loadFont("../../lib/font/times.ttf");
    };

    s.setup = function () {
        setup2D(s);
        const titlePrefixString = "Your LLM is a ";
        const titleRewardString = "Reward Model";
        const titleSize = 137;
        s.textFont(font);
        s.textSize(titleSize);
        const titleStartX = (s.width - s.textWidth(
            titlePrefixString + titleRewardString
        )) / 2;
        titlePrefix = new Text(s, {
            str: titlePrefixString,
            x: titleStartX,
            y: 202,
            mode: 3,
            size: titleSize,
            color: foreground,
            font: font,
            start: 1
        });
        titleReward = new Text(s, {
            str: titleRewardString,
            x: titleStartX + s.textWidth(titlePrefixString),
            y: 202,
            mode: 3,
            size: titleSize,
            color: [248, 238, 75],
            font: font,
            start: 1
        });
        preferredAnswer = new Text(s, {
            str: "Preferred\nAnswer",
            x: panelCenterXs[0] - 45,
            y: panelCenterY - 115,
            mode: 1,
            size: 57,
            color: chosen,
            font: font,
            start: 1
        });
        rejectedAnswer = new Text(s, {
            str: "Rejected\nAnswer",
            x: panelCenterXs[0] - 45,
            y: panelCenterY + 99,
            mode: 1,
            size: 57,
            color: rejected,
            font: font,
            start: 1
        });
        dpoLabel = new Text(s, {
            str: "DPO",
            x: (panelXs[0] + panelSize + panelXs[1]) / 2,
            y: panelCenterY - 61,
            mode: 1,
            size: 49,
            color: [247, 227, 47],
            font: font,
            start: 1
        });
        brain = new BrainBase(s, {start: -1, duration: frames(1)});
        brain.frCount = brain.duration;
        rewardCube = new RotatingRewardCube(s, {
            x: panelCenterXs[2],
            y: panelCenterY - 70,
            size: 79,
            strokeweight: 6,
            start: -1,
            wiggleAmplitude: 0,
            entryDuration: 0.2
        });
        rewardLabel = new Katex(s, {
            text: "r(\\textcolor{#4db1ff}{x}, " +
                "\\textcolor{#c54fb1}{y})",
            x: panelCenterXs[2],
            y: panelCenterY + 99,
            mode: 1,
            font_size: 72,
            color: "#ebf1fa"
        });
    };

    function showPipeline() {
        s.push();
        s.noFill();
        s.strokeJoin(s.ROUND);
        s.strokeCap(s.SQUARE);
        s.stroke(247, 227, 47);
        s.strokeWeight(10);
        for (let i = 0; i < panelXs.length - 1; i++) {
            const arrowTipX = panelXs[i + 1] - 4;
            s.strokeCap(s.SQUARE);
            s.line(
                panelXs[i] + panelSize,
                panelCenterY,
                arrowTipX,
                panelCenterY
            );
            s.strokeCap(s.ROUND);
            s.line(
                arrowTipX,
                panelCenterY,
                arrowTipX - 24,
                panelCenterY - 16
            );
            s.line(
                arrowTipX,
                panelCenterY,
                arrowTipX - 24,
                panelCenterY + 16
            );
        }
        s.strokeCap(s.SQUARE);
        s.stroke(foreground);
        s.strokeWeight(5);
        for (let x of panelXs)
            s.rect(x, panelY, panelSize, panelSize, 22);
        for (let i = 0; i < panelXs.length - 1; i++) {
            s.line(
                panelXs[i] + panelSize,
                panelCenterY,
                panelXs[i + 1],
                panelCenterY
            );
        }
        s.strokeWeight(2);
        s.line(
            panelXs[0] + 55,
            panelCenterY,
            panelXs[0] + panelSize - 55,
            panelCenterY
        );
        s.pop();
    }

    function showBackgroundGradient() {
        const context = s.drawingContext;
        const gradient = context.createLinearGradient(0, s.height, s.width, 0);
        gradient.addColorStop(0, "rgb(8, 12, 22)");
        gradient.addColorStop(1, "rgb(14, 28, 46)");
        context.save();
        context.fillStyle = gradient;
        context.fillRect(0, 0, s.width, s.height);
        context.restore();
    }

    function showRewardGlow() {
        const context = s.drawingContext;
        const centerX = panelCenterXs[2];
        const centerY = panelCenterY - 70;
        const radius = 175;
        const glow = context.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        glow.addColorStop(0, "rgba(247, 227, 47, 0.18)");
        glow.addColorStop(0.45, "rgba(247, 227, 47, 0.07)");
        glow.addColorStop(1, "rgba(247, 227, 47, 0)");
        context.save();
        context.fillStyle = glow;
        context.fillRect(
            centerX - radius,
            centerY - radius,
            radius * 2,
            radius * 2
        );
        context.restore();
    }

    function showAnswerMarks() {
        const markX = panelCenterXs[0] + 130;
        s.push();
        s.noFill();
        s.strokeCap(s.ROUND);
        s.strokeJoin(s.ROUND);
        s.strokeWeight(12);
        s.stroke(chosenMark);
        s.line(markX - 30, panelCenterY - 115,
            markX - 9, panelCenterY - 92);
        s.line(markX - 9, panelCenterY - 92,
            markX + 34, panelCenterY - 142);
        s.stroke(rejectedMark);
        s.line(markX - 25, panelCenterY + 90,
            markX + 25, panelCenterY + 140);
        s.line(markX + 25, panelCenterY + 90,
            markX - 25, panelCenterY + 140);
        s.pop();
    }

    s.draw = function () {
        showBackgroundGradient();
        showRewardGlow();
        showPipeline();
        titlePrefix.show();
        titleReward.show();
        preferredAnswer.show();
        rejectedAnswer.show();
        dpoLabel.show();
        showAnswerMarks();
        const brainSize = 860 * 0.65;
        brain.showAt(
            panelCenterXs[1] - brainSize * 110 / 430,
            panelCenterY - brainSize * 100 / 430,
            brainSize
        );
        rewardCube.show();
        rewardLabel.show();
    };
};

let dpo0 = new p5(DPOEclipse);
