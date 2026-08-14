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
            y: s.height / 2,
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

let dpo5 = new p5(DPOScene18);
