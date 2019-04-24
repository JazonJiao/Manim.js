function getT(t) {
    if (t === undefined) {
        return 10000;
    } else
        return t;
}

// S is the p5.js sketh variable
const Chap1Part1 = function (s) {
    //let orange = s.color(247, 137, 27);  // fixme: why doesn't it work?

    // define the time for init animations
    let time;

    let t = 0;

    // --------------- Suggestions for future scenes -------------------
    // todo: 1. be more careful at naming things
    // todo: 2. maybe use += to control time
    // todo: 3. enable dragging text to the correct location with mouse, instead of hardcoding x and y
    // todo: 4. to do 3,
    // todo: 5. each trivial object should have a scene number associated with it, otherwise it gets messy in setup()
    // todo: 6. incorporate the frames() function into the getT() function (DISCARD)

    scn = 1;
    // scene 1 -- paragraph 1
    switch (scn) {
        case 1:  // paragraph 1
            t = frames(29);
            time = {
                axes: frames(2),
                leastSqLine: frames(8),
                formula: frames(5),
                emphasizeBhat: t,//frames(11),
                emphasizeBend: t,//frames(12.5),
                formulabeta: t,//frames(13),
                dottedlineX: t,
                dottedlineY: t,
                rect1: t + 50,
                rects: t,
            };
            break;
        case 2:  // paragraph 2
            t = 0;
            time = {
                axes: t += 30,
                table: t += 30,
                points: t += 50,
                indVar: frames(10),
                depVar: frames(13),
                emphasizeX: frames(15),
                emphasizeXend: frames(17),
                simpleLR: frames(18),
            };
            break;
        case 3:  // paragraph 3, 4
            t = 0;
            time = {
                axes: frames(0),
                linRel: frames(4),
                leastSqLine: frames(8),
                formula: frames(12),
                showSlope: frames(16),
                showIntercept: frames(18),
                emphasizeBhat: frames(21),
                emphasizeB0: frames(22),
                estimates: frames(26),
                emphasizeBend: frames(36),
                emphasizeB0end: frames(36),
                emphasizeYhat: frames(36.7),
                givenx: frames(40) - t,
                estimateLine: frames(42) - t,
                giveny: frames(43) - t,
            };
            break;
        case 5:  // paragraph 5, 6
            t = frames(55);
            time = {
                formula: frames(0),

                emphasizeBhat: frames(3),
                formulabeta: frames(6),
                emphasizeBend: frames(20),
                dottedlineX: frames(21),
                dottedlineY: frames(27),
                showCoord: frames(35),
                showCoordFade: frames(37),
                xMinusXbarLine: frames(38.7),
                xMinusXbar: frames(40.7),
                yMinusYbarLine: frames(44),
                yMinusYbar: frames(46),
                rect1: frames(50),
                formulaFadeOut: frames(52.7),
                areaEq: frames(53),
                rects: t + frames(5),
                areaEqFadeOut: t + frames(9.7),
                sumRectA: t + frames(10),
                emphasizeNumerator: t + frames(13),
                emphasizeNumEnd: t + frames(15),
                emphasizeDenom: t + frames(20)
            };
            break;
        case 7:  // paragraph 7
            time = {
                axes: frames(0),
                dottedlineX: frames(0),
                formulabeta: frames(0),
                sumRectA: frames(0),

                yEqualsx: frames(5),
                toxx: frames(8),
                showCoord: frames(11),
                dottedlineY: frames(16),
                centroid: frames(22),
                rects: frames(23),
                rect1: frames(23) + 47,
                showCoordFade: frames(28),
                xMinusXbarLine: frames(30),
                xMinusXbar: frames(30.5),
                sumSqA: frames(33.5),
                emphasizeDenom: frames(35),
                emphasizeNumerator: frames(43.5)
            };
            break;
        case 8:
            time = {
                axes: frames(0),
                formulabeta: frames(0),
                dottedlineX: frames(0),
                dottedlineY: frames(0),
                sumSqA: frames(0),
                sumRectA: frames(0),
                rects: frames(0),
                rect1: frames(0) + 47,
                toxx: frames(1),

                restore: frames(5),
                bigA: frames(9),
                //bigA_end: frames(6),
                bw_0_and_1: frames(14),
                leastSqLine: frames(20),
                bw_0_and_1_end: frames(26),
                to_b_greater_1: frames(27),
                bigV: frames(30),
                restore2: frames(30.3),       // show square areas
                to_b_smaller_0: frames(31),   // restore
                greater_than_1: frames(35),
            };
            break;
        case 9:   // paragraphs 9 and 10
            time = {
                axes: frames(0),
                formulabeta: frames(0),
                dottedlineX: frames(0),
                dottedlineY: frames(0),
                sumSqA: frames(0),
                sumRectA: frames(0),
                leastSqLine: frames(0),
                rects: frames(0),
                rect1: frames(0) + 47,
                to_b_greater_1: frames(1),

                to_b_smaller_0: frames(5),
                is_negative: frames(8),
                quadrant2: frames(11),
                quadrant4: frames(13.5),
                minuses: frames(17.7),

                yLine_fade: frames(22),
                toxx: frames(22),      // show square areas
                emphasizeDenom: frames(23.5),
                greater_than_0: frames(24),
                pluses: frames(27),
                restore2: frames(30),  // restore

                showIntercept: frames(36),
                centroid: frames(40),

            };
            break;
        case 10:
            time = {
                axes: frames(0),
                formulabeta: frames(0),
                dottedlineX: frames(0),
                dottedlineY: frames(0),
                sumSqA: frames(0),
                sumRectA: frames(0),
                leastSqLine: frames(0),
                rects: frames(0),
                rect1: frames(0) + 47,
                toxx: frames(1),

                to_b_smaller_0: frames(5),
                yLine_start: frames(5),
                showIntercept: frames(6),
                centroid: frames(10),
                emphasizeNumerator: frames(16.5),
                emphasizeDenom: frames(17),
            };
            break;
        case 11:
            time = {
                axes: frames(0),
                formulabeta: frames(0),
                dottedlineX: frames(0),
                dottedlineY: frames(0),
                sumSqA: frames(0),
                sumRectA: frames(0),
                leastSqLine: frames(0),
                rects: frames(0),
                rect1: frames(0) + 47,
                //to_b_greater_1: frames(1),

                //emphasizeNumerator: frames(1),
                division_line1: frames(5),
                n_1: frames(11),
                cov: frames(12.5),
                //emphasizeNumEnd: frames(4),
                toxx: frames(16.5),
                //emphasizeDenom: frames(15),
                division_line2: frames(17),
                n_2: frames(19.5),
                var: frames(21.5),
            };
            break;
    }

    // X coordinates
    let xCoords = [10, 14, 20, 27, 33, 41];

    // Y Coordnates and variances
    let yCoords = scn >= 9 ? [40, 36, 24, 19, 7, 4] : [11, 17, 18, 29, 31, 37];
    let yCoords1 = [11, 17, 18, 29, 31, 37];
    let yCoords2 = [-2, 4, 18, 29, 36, 49];
    let yCoords3 = scn === 9 || 10 ? [40, 36, 24, 19, 7, 4] : [-2, 4, 18, 29, 36, 49];
    let yCoords4 = scn === 8 ? [10, 14, 20, 27, 33, 41] : [40, 36, 24, 19, 7, 4];

    class SLR_Plot extends Plot { // the plot used to illustrate simple linear regression
        constructor(ctx, args) {
            // somehow in the super class, the actual coordinate of coordX is called avgX (xCoords)
            // and its canvas coordinate is called coordX (ptXs). I should really be more considerate
            // in how I name things...
            super(ctx, args);

            // the two dotted lines displaying x-line and y-line
            this.xBarLine = new DottedLine(s, {
                x1: this.coordX, x2: this.coordX,
                y1: this.top, y2: this.bottom,
                color: s.color(77, 177, 247),
                strokeweight: 2,
                start: getT(time.dottedlineX)
            });
            this.yLineLine = new DottedLine(s, {
                x1: this.left, x2: this.right,
                y1: this.coordY, y2: this.coordY,
                color: s.color(77, 177, 247),
                strokeweight: 2,
                start: getT(time.dottedlineY)
            });

            // the lines showing x1 - coordX and y1 - coordY
            let index = this.numPts - 1;
            this.xMinusxLineLine = new Line(s, {
                x1: this.coordX,
                x2: this.ptXs[index],
                y1: this.ptYs[index],
                y2: this.ptYs[index],
                start: getT(time.xMinusXbarLine),
                color: s.color(247, 137, 27)
            });
            this.yMinusyLineLine = new Line(s, {
                x1: this.ptXs[index],
                x2: this.ptXs[index],
                y1: this.coordY,
                y2: this.ptYs[index],
                start: getT(time.yMinusYbarLine),
                color: s.color(247, 137, 27)
            });

            // We can use the emphasis class as rectangles, with the end time "infinite"
            this.rects = [];
            for (let i = 0; i < this.numPts - 1; ++i) {
                this.rects[i] = new Emphasis(s, {
                    x: this.coordX,
                    y: this.coordY,
                    w: this.ptXs[i] - this.coordX,
                    h: this.ptYs[i] - this.coordY,
                    start: getT(time.rects) + i * frames(2) / this.numPts,
                    end: frames(1000),  // todo
                    color: s.color(207, 207, 27, 87)
                });
            }
            this.rects[index] = new Emphasis(s, {
                x: this.coordX,
                y: this.coordY,
                w: this.ptXs[index] - this.coordX,
                h: this.ptYs[index] - this.coordY,
                start: getT(time.rect1),
                end: frames(1000),  // todo
                color: s.color(207, 207, 27, 87)
            });

            this.beta0Line = new Line(s, {
                x1: this.centerX, y1: this.centerY,
                x2: this.centerX, y2: this.y_intercept,
                start: getT(time.showIntercept),
                color: s.color(247, 117, 117)
            });
            this.slopeLine1 = new Line(s, {   // I just hardcoded these values..
                x1: 400, y1: 300,
                x2: 400, y2: 264,
                start: getT(time.showSlope),
                color: s.color(247, 117, 117)
            });
            this.slopeLine2 = new Line(s, {
                x1: 400, y1: 300,
                x2: 357, y2: 300,
                start: getT(time.showSlope),
                color: s.color(247, 117, 117)
            });
            this.yEqualsxLine = new Line(s, {
                x1: 0, y1: 650,
                x2: 650, y2: 0,
                start: getT(time.yEqualsx),
                color: s.color(77, 177, 77),
            });
            if (scn === 9) {
                this.quadrant2 = new Emphasis(s, {
                    x: 0, y: 0,
                    w: this.coordX, h: this.coordY,
                    start: getT(time.quadrant2),
                    color: s.color(77, 77, 177, 77)
                });
                this.quadrant4 = new Emphasis(s, {
                    x: this.coordX, y: this.coordY,
                    w: this.right - this.coordX, h: this.bottom - this.coordY,
                    start: getT(time.quadrant4),
                    color: s.color(77, 77, 177, 77)
                });

                this.plusMinus = [];
                this.plusMinus[0] = new TextFade(s, {
                    str: "+",
                    mode: 1, font: comic,
                    x: this.coordX + (this.right - this.coordX) / 2,
                    y: this.coordY / 2 - 50,
                    size: 147, color: [247, 77, 97],
                    start: getT(time.pluses)
                });
                this.plusMinus[1] = new TextFade(s, {
                    str: "-",
                    mode: 1, font: comic,
                    x: this.coordX / 2,
                    y: this.coordY / 2 - 50,
                    size: 147, color: [27, 147, 247],
                    start: getT(time.minuses)
                });
                this.plusMinus[2] = new TextFade(s, {
                    str: "+",
                    mode: 1, font: comic,
                    x: this.coordX / 2,
                    y: this.coordY + (this.bottom - this.coordY) / 2 - 50,
                    size: 147, color: [247, 77, 97],
                    start: getT(time.pluses)
                });
                this.plusMinus[3] = new TextFade(s, {
                    str: "-",
                    mode: 1, font: comic,
                    x: this.coordX + (this.right - this.coordX) / 2,
                    y: this.coordY + (this.bottom - this.coordY) / 2 - 50,
                    size: 147, color: [27, 147, 247],
                    start: getT(time.minuses)
                });
            }
            // added for scene 3
            let givenx = 450;
            this.givenXPt = new PlotPoint(s, {
                x: givenx + this.centerX,
                y: this.centerY,
                radius: 24,
                start: getT(time.givenx),
                color: [255, 185, 0]
            });
            this.givenYPt = new PlotPoint(s, {
                x: givenx + this.centerX,
                y: this.y_intercept - this.beta * givenx,
                radius: 17,
                start: getT(time.giveny),
                color: [255, 185, 0]
            });
            this.estimateLine = new DottedLine(s, {
                x1: givenx + this.centerX, x2: givenx + this.centerX,
                y2: this.y_intercept - this.beta * givenx, y1: this.centerY,
                color: s.color(77, 177, 247),
                strokeweight: 2,
                start: getT(time.estimateLine)
            });
            this.centroid = new PlotPoint(s, {
                x: this.coordX, y: this.coordY,
                radius: 17,
                color: [255, 185, 0],
                start: getT(time.centroid)
            });
        }

        // this method should be only called once, i.e. at one specific frame
        reset(xs, ys) {
            this.xo = this.Xs.copyWithin();
            this.yo = this.Ys.copyWithin();
            this.xd = xs.copyWithin();
            this.yd = ys.copyWithin();
            this.timer = new Timer2(frames(1.4));
            this.resetted = true;
        }

        // helper method
        resetting() {
            let t = this.timer.advance();
            for (let i = 0; i < this.numPts; i++) {
                // this.Xs[i] = this.xo[i] + (this.xd[i] - this.xo[i]) * t;
                this.Ys[i] = this.yo[i] + (this.yd[i] - this.yo[i]) * t;
            }
            this.calcCoords();
            for (let i = 0; i < this.numPts; i++) {
                this.points[i].reset(this.ptXs[i], this.ptYs[i]);
            }
            this.calcParams();
            this.LSLine.reset({
                y1: this.y_intercept + this.beta * (this.centerX - this.left),
                y2: this.y_intercept - this.beta * (this.right - this.centerX)
            });
            this.yLineLine.reset({
                y1: this.coordY, y2: this.coordY,
            });
            this.xMinusxLineLine.reset({
                x1: this.coordX,
                x2: this.ptXs[this.numPts - 1],
                y1: this.ptYs[this.numPts - 1],
                y2: this.ptYs[this.numPts - 1],
            });
            for (let i = 0; i < this.numPts; i++) {
                this.rects[i].reset({
                    x: this.coordX,
                    y: this.coordY,
                    w: this.ptXs[i] - this.coordX,
                    h: this.ptYs[i] - this.coordY
                })
            }
            if (scn === 9) {
                this.quadrant2.reset({w: this.coordX, h: this.coordY,});
                this.quadrant4.reset({
                    x: this.coordX, y: this.coordY,
                    w: this.right - this.coordX, h: this.bottom - this.coordY,
                });
            }
        }


        show() {
            if (this.resetted) {
                this.resetting();
            }
            this.xBarLine.show();
            this.yLineLine.show();
            this.xMinusxLineLine.show();
            this.yMinusyLineLine.show();
            for (let r of this.rects) {
                r.show();
            }
            this.showAxes(); // this.showGrid()
            this.showPoints();
            this.LSLine.show();
            this.beta0Line.show();
            this.slopeLine1.show();
            this.slopeLine2.show();
            this.yEqualsxLine.show();
            if (scn === 9) {
                this.quadrant2.show();
                this.quadrant4.show();
                for (let p of this.plusMinus) {
                    p.show();
                }
            }
            this.givenXPt.show();
            this.givenYPt.show();
            this.estimateLine.show();
            this.centroid.show();
        }

        getXbar() {
            return this.coordX;
        }

        getYbar() {
            return this.coordY;
        }
    }

    let hg;
    let plot;
    let kats = [];
    let txts = [];
    let lines = [];
    let arrows = [];
    let emps = [];
    let table;
    let comic;

    s.preload = function () {
        comic = s.loadFont('../lib/font/comic.ttf');
    };

    s.setup = function () {
        //pixelDensity(1);
        s.frameRate(fr);

        s.createCanvas(cvw, cvh);
        s.background(0);

        hg = new HelperGrid(s);
        plot = new SLR_Plot(s, {
            right: 675,
            centerX: 100, centerY: 550,
            stepX: 10, stepY: 10,
            start: getT(time.axes),
            startPt: time.points,
            startLSLine: getT(time.leastSqLine),
            xs: xCoords, ys: yCoords
        });
        table = new Table(s, {
            x: 700, y: 170,
            size: 37,
            xs: xCoords, ys: yCoords,
            start: getT(time.table),
            font: comic
        });

        txts[0] = new TextWriteIn(s, {
            str: "Independent variable",
            x: 777, y: 57,
            font: comic,
            start: getT(time.indVar),
            color: [57, 147, 247]
        });
        arrows[0] = new Arrow(s, {
            x1: 767, y1: 111,
            x2: 727, y2: 167,
            start: getT(time.indVar) + frames(0.7),
            duration: frames(2),
            color: s.color(57, 147, 247)
        });

        txts[1] = new TextWriteIn(s, {
            str: "Dependent variable",
            x: 777, y: 327,
            font: comic,
            start: getT(time.depVar),
            color: [247, 77, 247]
        });
        arrows[1] = new Arrow(s, {
            x1: 767, y1: 327,
            x2: 727, y2: 277,
            start: getT(time.depVar) + frames(0.7),
            duration: frames(2),
            color: s.color(247, 77, 247)
        });

        txts[2] = new TextFade(s, {
            str: "\"Simple\"\nLinear Regression",
            mode: 1,
            x: 950, y: 500,
            font: comic,
            start: getT(time.simpleLR),
        });
        txts[3] = new TextWriteIn(s, {
            str: "Linear relationship",
            x: 777, y: 57,
            font: comic,
            start: getT(time.linRel)
        });

        txts[4] = new TextWriteIn(s, {
            str: "Sum of rectangle areas",
            x: 727, y: scn <= 100 ? 117 : 147,   // fixme
            font: comic,
            color: s.color(255, 255, 17),
            start: getT(time.sumRectA),
        });

        txts[5] = new TextWriteIn(s, {
            str: "Sum of square areas",
            x: 757, y: scn <= 100 ? 477 : 447,
            font: comic,
            color: s.color(255, 255, 17),
            start: getT(time.sumSqA),
        });
        if (scn < 11) {
            arrows[2] = new Arrow(s, {
                x1: 920, y1: 170,
                x2: 1000, y2: 280,
                start: getT(time.sumRectA),
                color: s.color(255, 255, 17)
            });
            arrows[3] = new Arrow(s, {
                x1: 940, y1: 490,
                x2: 1000, y2: 400,
                start: getT(time.sumSqA),
                color: s.color(255, 255, 17)
            });
        }

        txts[6] = new TextWriteIn(s, {
            str: "\"Estimates\"",
            x: 837, y: 248,
            font: comic,
            color: s.color(255, 255, 17),
            start: getT(time.estimates)
        });

        kats[0] = new Katex(s, {
            text: "\\textstyle\\hat{\\beta}=\\frac{\\sum_{i=1}^n (x_i-\\bar{x})(y_i-\\bar{y})} " +
                "{\\sum_{i=1}^n(x_i-\\bar{x})^2}",
            x: 662,
            y: 232,
            start: getT(time.formulabeta),
            fadeIn: true,
            font_size: 54
        });

        kats[5] = new Katex(s, {
            text: "\\hat{y}=\\hat{\\beta}x+\\hat{\\beta_0}",
            x: 789, y: 99,
            start: getT(time.formula),
            fadeIn: true,
            font_size: 47,
            fadeOut: true,
            end: getT(time.formulaFadeOut)
        });
        //
        kats[1] = new Katex(s, {
            text: "\\bar{x}",
            x: plot.getXbar() - 30,
            y: s.height - 152,
            start: getT(time.dottedlineX),
            fadeIn: true,
            font_size: 37
        });

        kats[2] = new Katex(s, {
            text: scn === 7 ? "\\bar{x}" : "\\bar{y}",
            x: 70,
            y: plot.getYbar() - 73,
            fadeIn: true, start: scn === 10 ? getT(time.yLine_start) : getT(time.dottedlineY),
            fadeOut: true, end: getT(time.yLine_fade),
            font_size: 37,
        });

        kats[3] = new Katex(s, {
            text: "x_1 - \\bar{x}",
            x: 367,
            y: scn === 7 ? 40 : 82,  // fixme
            color: s.color(247, 137, 27),
            start: getT(time.xMinusXbar),
            fadeIn: true,
        });

        kats[4] = new Katex(s, {
            text: "y_1 - \\bar{y}",
            x: 523,
            y: 179,
            color: s.color(247, 137, 27),
            start: getT(time.yMinusYbar),
            fadeIn: true,
        });

        kats[6] = new Katex(s, {
            text: scn === 9 || 10 ? "\\hat{\\beta_0}=\\bar{y}-\\hat{\\beta}\\bar{x}" : "\\hat{\\beta_0}",
            x: 115, y: scn === 9 || 2 ? 0 : 140,
            color: s.color(247, 117, 117),  // PINK
            start: getT(time.showIntercept),
            fadeIn: true,
            font_size: scn === 9 || 10 ? 40 : 42
        });

        kats[7] = new Katex(s, {
            text: "\\hat{\\beta}",
            x: 410, y: 230,
            color: s.color(240, 110, 110),
            start: getT(time.showSlope),
            fadeIn: true,
            font_size: 42
        });

        kats[8] = new Katex(s, {
            text: "Area = (x_1 - \\bar{x})(y_1 - \\bar{y})",
            x: 650, y: 70,
            color: s.color(255, 255, 17),
            fadeIn: true, start: getT(time.areaEq),
            font_size: 42,
            fadeOut: true, end: getT(time.areaEqFadeOut)
        });

        kats[9] = new Katex(s, {
            text: scn === 7 ? "(x_i, x_i)" : "(x_1, y_1)",
            x: 520, y: scn === 7 ? 100 : 90,
            color: s.color(247, 137, 27),
            fadeIn: true, start: getT(time.showCoord),
            fadeOut: true, end: getT(time.showCoordFade),
            font_size: 37
        });

        kats[10] = new Katex(s, {
            text: scn === 7 ? "(\\bar{x}, \\bar{x})" : "(\\bar{x}, \\bar{y})",
            x: plot.getXbar() + 17, y: plot.getYbar() - (scn >= 9 ? 87 : 27),
            fadeIn: true, start: getT(time.centroid)
        });

        if (scn === 8) {
            kats[11] = new Katex(s, {
                text: "∈(0, 1)",
                x: 637, y: 337, font_size: 37, color: s.color(247, 137, 27),
                fadeIn: true, start: getT(time.bw_0_and_1),
                fadeOut: true, end: getT(time.bw_0_and_1_end),
            });

            kats[12] = new Katex(s, {
                text: ">1",
                x: 657, y: 337, font_size: 37, color: s.color(247, 137, 27),
                fadeIn: true, start: getT(time.greater_than_1),
            });

            kats[13] = new Katex(s, {
                text: "\\bigwedge",
                x: 857, y: 47, font_size: 167,
                color: s.color(47, 177, 247),
                fadeIn: true, start: getT(time.bigA),
                fadeOut: true, end: getT(time.bw_0_and_1)
            });

            kats[14] = new Katex(s, {
                text: "\\bigvee",
                x: 857, y: 47, font_size: 167,
                color: s.color(47, 177, 247),
                fadeIn: true, start: getT(time.bigV),
                fadeOut: true, end: getT(time.greater_than_1)
            });

        }
        if (scn === 9) {
            kats[11] = new Katex(s, {
                text: ">0",
                x: 1047, y: 367, font_size: 37, color: s.color(247, 137, 27),
                fadeIn: true, start: getT(time.greater_than_0),
            });
            kats[12] = new Katex(s, {
                text: "<0",
                x: 657, y: 337, font_size: 37, color: s.color(247, 137, 27),
                fadeIn: true, start: getT(time.is_negative),
            });
        }
        if (scn === 11) {
            kats[11] = new Katex(s, {
                text: "Cov(X, Y)=",
                color: s.color(37, 236, 97),
                fadeIn: true, start: getT(time.cov),
                x: 817, y: 34
            });
            kats[12] = new Katex(s, {
                text: "Var(X)=",
                color: s.color(37, 236, 97),
                fadeIn: true, start: getT(time.var),
                x: 841, y: 395
            });
            lines[0] = new Line(s, {
                x1: 727, x2: 1127,
                y1: 174, y2: 174,
                color: s.color(255, 255, 17),
                start: getT(time.division_line1)
            });
            lines[1] = new Line(s, {
                x1: 757, x2: 1107,
                y1: 534, y2: 534,
                color: s.color(255, 255, 17),
                start: getT(time.division_line2)
            });
            txts[7] = new TextFade(s, {
                str: "n - 1",
                x: 897, y: 174,
                font: comic, color: [255, 255, 17],
                start: getT(time.n_1)
            });
            txts[8] = new TextFade(s, {
                str: "n - 1",
                x: 897, y: 534,
                font: comic, color: [255, 255, 17],
                start: getT(time.n_2)
            });

        }

        emps[0] = new Emphasis(s, {
            x: 890, y: 140,
            w: 40, h: 77,
            start: getT(time.emphasizeBhat),
            end: getT(time.emphasizeBend)
        });
        emps[1] = new Emphasis(s, {
            x: 1030, y: 140,
            w: 57, h: 77,
            start: getT(time.emphasizeB0),
            end: getT(time.emphasizeB0end)
        });
        emps[2] = new Emphasis(s, {
            x: 784, y: 150,
            w: 40, h: 67,
            start: getT(time.emphasizeYhat)
        });
        emps[3] = new Emphasis(s, {
            x: 794, y: 280,
            w: 380, h: 60,
            start: getT(time.emphasizeNumerator),
            end: getT(time.emphasizeNumEnd)
        });
        emps[4] = new Emphasis(s, {
            x: 850, y: 340,
            w: 267, h: 60,
            start: getT(time.emphasizeDenom)
        });
        emps[5] = new Emphasis(s, {
            x: 700, y: 177,
            w: 57, h: 40,
            start: getT(time.emphasizeX),
            end: getT(time.emphasizeXend)
        });
    };

    s.draw = function () {
        s.background(0);
        //showFR(s);
        //hg.show();
        for (let e of emps) e.show();

        if (s.frameCount === getT(time.toxx))
            plot.reset(xCoords, xCoords);
        if (s.frameCount === getT(time.restore))
            plot.reset(xCoords, yCoords1);
        if (s.frameCount === getT(time.restore2))
            plot.reset(xCoords, yCoords4);
        if (s.frameCount === getT(time.to_b_greater_1))
            plot.reset(xCoords, yCoords2);
        if (s.frameCount === getT(time.to_b_smaller_0))
            plot.reset(xCoords, yCoords3);

        plot.show();
        table.show();

        for (let k of kats) k.show();
        for (let t of txts) t.show();
        for (let a of arrows) a.show();
        for (let l of lines) l.show();
    };
};

function Chap1Part2(s) {
    let time = {
        brain: frames(0),
        bubble: frames(5),
        text: [frames(11), frames(12.5), frames(14)]
    };

    let hg;
    let texts = [];
    let font;
    let brain;

    s.preload = function() {
        font = s.loadFont('../lib/font/comic.ttf');
    };

    s.setup = function() {
        s.createCanvas(1200, 675);

        hg = new HelperGrid(s);

        brain = new ThoughtBrain(s, {
            start: time.brain,
            font: font,
            size: 400,
            str: "Multiple Regression",
            bubbleStart: time.bubble
        });
        texts[0] = new TextWriteIn(s, {
            font: font,
            str: "Statistics",
            x: 700,
            y: 450,
            start: time.text[0]
        });
        texts[1] = new TextWriteIn(s, {
            font: font,
            str: "Linear Algebra",
            x: 700,
            y: 500,
            start: time.text[1]
        });
        texts[2] = new TextWriteIn(s, {
            font: font,
            str: "Machine Learning",
            x: 700,
            y: 550,
            start: time.text[2]
        });
    };

    s.draw = function() {
        s.background(0);
        //hg.show();
        //text1.show();
        //bubble.show();
        brain.show();
        for (let t of texts) t.show();
    }
}


const Chap1Credits = function (s) {
    let txts = [];
    let comic;

    s.preload = function () {
        comic = s.loadFont('../lib/font/comic.ttf');
    };

    s.setup = function() {
        s.frameRate(fr);
        s.createCanvas(1200, cvh);
        s.background(0);

        txts[0] = new TextWriteIn(s, {
            str: "Inspired By: 3Blue1Brown, The Coding Train, and so many other wonderful YouTubers\n" +
                "Source Code (written in p5.js): https://github.com/JazonJiao/Essence-Linear-Regression\n" +
                "",
            x: 37, y: 277,
            size: 27,
            font: comic,
            start: frames(2)
        });
        txts[1] = new TextWriteIn(s, {
            str: "P.S. they are not my sponsor... yet",
            x: 841,
            y: 637,
            size: 22,
            font: comic,
            start: frames(2)
        })
    };

    s.draw = function() {
        txts[0].show();
    }
};


let p = new p5(Chap1Part1);
