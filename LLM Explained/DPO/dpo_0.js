// Select the section highlighted by the outline: 1, 2, 3, 4a, 4b, 5, 6, or 7.
const DPO_OUTLINE_SECTION = "4b";

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

    const baseColor = [125, 132, 145];
    const activeColor = [242, 246, 252];
    const baseSize = 37;
    const activeSize = 47;
    const textX = 455;
    const firstY = 179;
    const rowGap = 87;
    const highlightStart = frames(0.4);
    const highlightDuration = frames(0.8);
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
        s.background(8, 12, 22);

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
        s.background(8, 12, 22);
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

let dpo0 = new p5(DPOScene50);
