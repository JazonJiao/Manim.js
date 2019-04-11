// Chapter 4, Multiple Regression

let Red = [255, 77, 97];
let Green = [77, 217, 77];
let Blue = [77, 177, 255];
let Yellow = [247, 227, 47];
let Orange = [247, 137, 27];


let xCoords = [10, 14, 20, 27, 33, 40];
let yCoords = [11, 17, 18, 29, 32, 37];

const Scene32 = function(s) {
    let time = {
        axes: frames(1),
        pts: frames(2.7),
        kat: frames(4.7),
        empx: frames(7.2),
        line: frames(10.2)
    };
    s.setup = function () {
        setup2D(s);
        s.plot = new Plot(s, {
            right: 675, centerX: 100, centerY: 550, stepX: 10, stepY: 10,
            start: time.axes, startLSLine: time.line, startPt: time.pts,
            xs: xCoords, ys: yCoords,
        });
        s.kat0 = new Katex(s, {
            text: "\\hat{y}=\\hat{\\beta}~~+\\hat{\\beta_0}",
            x: 789, y: 99, fadeIn: true, start: time.kat
        });
        s.kat1 = new Katex(s, {
            text: "x", x: 901, y: 102, fadeIn: true, start: time.kat
        });
        //s.d = new Dragger(s, [s.kat0, s.kat1]);
    };
    s.draw = function () {
        s.background(0);
        if (s.frameCount === time.empx) s.kat1.shake(17, 1);
        s.plot.showAxes(); s.plot.showPoints(); s.plot.LSLine.show();
        s.kat0.show(); s.kat1.show();
        //s.d.show();
    };
};

const Scene31 = function(s) {
    let time = {
        x: frames(4),  // light up x, y coords
        xE: frames(5), // x, y unlit
        y: frames(5.7),  // light up z coords
        yE: frames(6.7), // z unlit
        eq: [frames(9), frames(11), frames(12.5), frames(12.9),
            frames(13.5), frames(14.4), frames(14.8), frames(15.4)],
        emp: frames(18),
        txt: frames(23)
    };
    let g3;
    let tnr;
    let obj = [];
    s.arr = []; s.keq = [];

    s.preload = function () {
        obj[0] = s.loadModel('../lib/obj/axes.obj');
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup3D(s);
        g3 = s.createGraphics(cvw * 2, cvh * 2, s.WEBGL);

        s.axes = new Axes3D(s, {
            angle: 0.6, model: obj[0]
        });
        s.arr[0] = new Arrow3D(s, {
            from: [-400, 0, 0], to: [-400, 0, 0], tipLen: 0.1, tipRadius: 5, radius: 5, color: Green
        });
        s.arr[1] = new Arrow3D(s, {
            from: [0, -400, 0], to: [0, -400, 0], tipLen: 0.1, tipRadius: 5, radius: 5, color: Yellow
        });
        s.arr[2] = new Arrow3D(s, {
            from: [0, 0, -400], to: [0, 0, -400], tipLen: 0.1, tipRadius: 5, radius: 5, color: Blue
        });
        let ex = 107, ey = 7;
        s.keq[0] = new Katex(s, { x: ex, y: ey, text: "\\textcolor{#47b7f7}{y}=", fadeIn: true, start: time.eq[0] });
        s.keq[1] = new Katex(s, { x: ex + 87, y: ey, text: "\\beta_0", color: "#f75757", fadeIn: true, start: time.eq[1] });
        s.keq[2] = new Katex(s, { x: ex + 137, y: ey, text: "+",  fadeIn: true, start: time.eq[2]});
        s.keq[3] = new Katex(s, { x: ex + 177, y: ey, text: "\\beta_1", color: "#47c747",  fadeIn: true, start: time.eq[3]});
        s.keq[4] = new Katex(s, { x: ex + 227, y: ey, text: "x_1", color: "#47c747",  fadeIn: true, start: time.eq[4]});
        s.keq[5] = new Katex(s, { x: ex + 277, y: ey, text: "+",  fadeIn: true, start: time.eq[5]});
        s.keq[6] = new Katex(s, { x: ex + 317, y: ey, text: "\\beta_2", color: "#f7f717", fadeIn: true, start: time.eq[6]});
        s.keq[7] = new Katex(s, { x: ex + 367, y: ey, text: "x_2", color: "#f7f717", fadeIn: true, start: time.eq[7]});
        s.txt = new TextWriteIn(s, {
            x: 434, y: 502, str: "Normal Equations", start: time.txt, font: tnr, size: 47
        });
        //s.d = new Dragger(s, [s.txt]);
    };

    s.draw = function () {
        if (s.frameCount === time.x) {
            s.arr[0].move({ to: [400, 0, 0], mode: 1, duration: 27 });
            s.arr[1].move({ to: [0, 400, 0], mode: 1, duration: 27 });
        }
        if (s.frameCount === time.xE) {
            s.arr[0].move({ from: [400, 0, 0], mode: 1, duration: 27 });
            s.arr[1].move({ from: [0, 400, 0], mode: 1, duration: 27 });
        }
        if (s.frameCount === time.y)
            s.arr[2].move({ to: [0, 0, 400], mode: 1, duration: 27 });
        if (s.frameCount === time.yE)
            s.arr[2].move({ from: [0, 0, 400], mode: 1, duration: 27 });
        if (s.frameCount === time.emp) {
            s.keq[1].jump(21, 1); s.keq[3].jump(21, 1); s.keq[6].jump(21, 1);
        }
        s.background(0);
        //s.d.show();
        s.txt.show();
        s.axes.show(g3);
        for (let a of s.arr) a.show(g3);
        for (let k of s.keq) k.show();
        s.image(g3, 0, 0, cvw, cvh);
        //showFR(s);
    };
};

const Scene33 = function(s) {
    let SN = 1;
    let time = SN === 1 ? {
        jumpInput1: frames(2.5),
        jumpInput2: frames(2.5) + 17,
        b: frames(5),
        y: frames(9),

        x: frames(13),
        jumpX1: frames(17),
        jumpX2: frames(17) + 27,
        txt1: frames(17),
        jumpX0: frames(22),
        jumpB0: frames(27),
        txt1e: frames(28),

        emp: frames(30.7),
        emE: frames(35),
        txt2: frames(33),
        n: frames(37.7),
        txt2e: frames(41),
        ne: frames(41),

        neq: frames(45), // end at 54th second
    } : {
        x: frames(4),
        b: frames(2),
        y: frames(3),
        neq: frames(7),
        emp: frames(1000),
    };
    let dx = 67;
    let bx = 607, by = 197;

    let tnr, comic;
    s.txt = []; s.kat = []; s.bl = []; s.br = []; s.emp = []; s.keq = []; s.kne = [];

    s.preload = function() {
        comic = s.loadFont('../lib/font/comic.ttf');
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.hg = new HelperGrid(s, {});

        s.txt[4] = new TextFade(s, {
            str: "Each column—\nall data for one\npredictor variable",
            x: 62, y: 77, start: time.txt1, end: time.txt1e, font: tnr, size: 34,
        });
        s.txt[5] = new TextFade(s, {
            str: "Each row—\ndata for one sample",
            x: 62, y: 77, start: time.txt2, end: time.txt2e, font: tnr, size: 34,
        });

        let tx = 407, y = 177, ty = 317, tdy = 297;
        let x1 = 757;

        s.bl[0] = new Bracket(s, { x1: tx - 27, y1: y, x2: tx - 27, y2: y + tdy, start: time.x, });
        s.br[0] = new Bracket(s, { x1: tx + 167, y1: y + tdy, x2: tx + 167, y2: y, start: time.x });
        s.bl[1] = new Bracket(s, { x1: x1, y1: y, x2: x1, y2: y + tdy, start: time.y, });
        s.br[1] = new Bracket(s, { x1: x1 + 72, y1: y + tdy, x2: x1 + 72, y2: y, start: time.y });

        let bbx = 592, bby = 233, bdy = 167;
        s.bl[2] = new Bracket(s, { x1: bbx, y1: bby, x2: bbx, y2: bby + bdy, start: time.b, });
        s.br[2] = new Bracket(s, { x1: bbx + 72, y1: bby + bdy, x2: bbx + 72, y2: bby, start: time.b });

        s.txt[0] = new TextFade(s, {
            x: tx, y: ty, str: "1\n1\n1\n1\n", font: tnr, color: [255, 77, 97],
            size: 47, mode: 1, start: time.x
        });
        s.txt[1] = new TextFade(s, {
            x: tx + dx, y: ty, str: "2\n-6\n4\n1\n", font: tnr, color: [77, 217, 77],
            size: 47, mode: 1, start: time.x + 7
        });
        s.txt[2] = new TextFade(s, {
            x: tx + dx * 2, y: ty, str: "2\n2\n1\n-4\n", font: tnr, color: [247, 227, 47],
            size: 47, mode: 1, start: time.x + 14
        });
        s.txt[3] = new TextFade(s, {
            x: x1 + 37, y: ty, str: "4\n-1\n2\n-3\n", font: tnr, color: [77, 177, 255],
            size: 47, mode: 1, start: time.y
        });

        let kx = 400, ky = 357;
        s.kat[0] = new Katex(s, { x: kx, y: ky, text: "⋮", color: "#f75757",
            fadeIn: true, start: time.x, fadeOut: true, end: time.neq });
        s.kat[1] = new Katex(s, { x: kx + dx, y: ky, text: "⋮", color: '#47c747',
            fadeIn: true, start: time.x + 7, fadeOut: true, end: time.neq });
        s.kat[2] = new Katex(s, { x: kx + dx * 2, y: ky, text: "⋮", color: '#f7f717',
            fadeIn: true, start: time.x + 14, fadeOut: true, end: time.neq });
        s.kat[3] = new Katex(s, { x: x1 + 27, y: ky, text: "⋮", color: "#47b7f7",
            fadeIn: true, start: time.y, fadeOut: true, end: time.neq });
        s.kat[4] = new Katex(s, {
            text: "\\xleftrightarrow{~~~~~~~~~~~~~~~~n~~~~~~~~~~~~~~~~}", rotation: -90,
            x: 197, y: 262, start: time.n, end: time.ne,
        });

        let ny = 457;
        s.kne[0] = new Katex(s, { x: 450, y: ny, text: "X", fadeIn: true, start: time.x });
        s.kne[1] = new Katex(s, { x: 617, y: ny, text: "\\vec{b}", fadeIn: true, start: time.b });
        s.kne[2] = new Katex(s, { x: 780, y: ny, text: "\\vec{y}", fadeIn: true, start: time.y });
        s.kne[3] = new Katex(s, { x: x1 - 67, y: ty - 57, text: "=",
            fadeIn: true, start: time.x, fadeOut: true, end: time.neq });
        s.kne[4] = new Katex(s, {
            x: 477, y: 247, text: "=(X^T ~~~)^{-1} X^T", fadeIn: true, start: time.neq });
        let ex = 407, ey = 7;

        s.keq[0] = new Katex(s, { x: ex, y: ey, text: "\\textcolor{#47b7f7}{y}=", fadeOut: true, end: time.neq });
        s.keq[1] = new Katex(s, { x: ex + 87, y: ey, text: "\\beta_0", color: "#f75757", fadeOut: true, end: time.neq });
        s.keq[2] = new Katex(s, { x: ex + 137, y: ey, text: "+", fadeOut: true, end: time.neq });
        s.keq[3] = new Katex(s, { x: ex + 177, y: ey, text: "\\beta_1", color: "#47c747", fadeOut: true, end: time.neq });
        s.keq[4] = new Katex(s, { x: ex + 227, y: ey, text: "x_1", color: "#47c747", fadeOut: true, end: time.neq });
        s.keq[5] = new Katex(s, { x: ex + 277, y: ey, text: "+", fadeOut: true, end: time.neq });
        s.keq[6] = new Katex(s, { x: ex + 317, y: ey, text: "\\beta_2", color: "#f7f717", fadeOut: true, end: time.neq });
        s.keq[7] = new Katex(s, { x: ex + 367, y: ey, text: "x_2", color: "#f7f717", fadeOut: true, end: time.neq });

        s.keq[8] = new Katex(s, { x: ex + 87, y: ey, text: "\\beta_0", color: "#f75757", fadeOut: true, end: time.neq });
        s.keq[9] = new Katex(s, { x: ex + 177, y: ey, text: "\\beta_1", color: "#47c747", fadeOut: true, end: time.neq });
        s.keq[10] = new Katex(s, { x: ex + 317, y: ey, text: "\\beta_2", color: "#f7f717", fadeOut: true, end: time.neq });

        s.emp[0] = new Emphasis(s, {
            x: 381, y: 177, h: 57, w: 194, start: time.emp, end: time.emE,
        });
        s.box = new Rect(s, {
            x: 0, w: 1200, y: 0, h: 570, color: [0, 0, 0, 255], start: time.neq,
        });
        s.arr = new Arrow(s, {
            x1: 787, x2: 727, y1: 422, y2: 422, start: time.txt2, end: time.txt2e,
        });
        //s.d = new Dragger(s, [s.txt, s.kat]);
    };

    s.draw = function () {
        if (s.frameCount === time.jumpInput1)
            s.keq[4].jump(27, 0.67);
        if (s.frameCount === time.jumpInput2)
            s.keq[7].jump(27, 0.67);
        if (s.frameCount === time.jumpX1)
            s.txt[1].jump(27, 1);
        if (s.frameCount === time.jumpX2)
            s.txt[2].jump(27, 1);
        if (s.frameCount === time.jumpX0)
            s.txt[0].jump(27, 1);
        if (s.frameCount === time.jumpB0)
            s.keq[1].jump(27, 1);

        if (s.frameCount === time.b) {
            s.keq[1].move(bx, by);
            s.keq[3].move(bx, by + 55);
            s.keq[6].move(bx, by + 110);
        }
        if (s.frameCount === time.neq) {
            s.kne[0].move(602, 247);
            s.kne[1].move(437, 247);
            s.kne[2].move(767, 247);
        }
        s.background(0);
        //showFR(s);
        for (let e of s.emp) e.show();
        for (let t of s.txt) t.show();
        for (let k of s.kat) k.show();
        for (let b of s.bl) b.show();
        for (let b of s.br) b.show();
        for (let e of s.keq) e.show();
        for (let e of s.kne) e.show();
        s.box.show();
    }
};

const Scene34 = function (s) {
    let t = 2, dt = 1.5;
    let time = {
        x3: frames(t),
        x4: frames(t += dt),
        x5: frames(t += dt),
        x6: frames(t += dt)
    };
    let kat = [];
    let ex = 677, ey = 248, dx = 72, sx = 72, sy = 100;
    s.setup = function() {
        setup2D(s);
        kat[0] = new Katex(s, { x: ex - 277, y: ey, text: "y=\\beta_0+\\beta_1 x_1 + \\beta_2 x_2",});
        kat[1] = new Katex(s, { x: ex + dx, y: ey - sy, text: "+~\\beta_3 x_3", fadeIn: true, start: time.x3 });
        kat[2] = new Katex(s, { x: ex + 2 * dx, y: ey - sy, text: "+~\\beta_4 x_4", fadeIn: true, start: time.x4 });
        kat[3] = new Katex(s, { x: ex + 3 * dx, y: ey - sy, text: "+~\\beta_5 x_5", fadeIn: true, start: time.x5 });
        kat[4] = new Katex(s, { x: ex + 4 * dx, y: ey - sy, text: "+~\\beta_6 x_6", fadeIn: true, start: time.x6 });
    };

    s.draw = function() {
        if (s.frameCount === time.x3) {
            kat[0].shift(-sx, 0);
            kat[1].shift(0, sy);
        }
        if (s.frameCount === time.x4) {
            for (let i = 0; i < 2; i++)
                kat[i].shift(-sx, 0);
            kat[2].shift(0, sy);
        }
        if (s.frameCount === time.x5) {
            for (let i = 0; i < 3; i++)
                kat[i].shift(-sx, 0);
            kat[3].shift(0, sy);
        }
        if (s.frameCount === time.x6) {
            for (let i = 0; i < 4; i++)
                kat[i].shift(-sx, 0);
            kat[4].shift(0, sy);
        }
        s.background(0);
        for (let k of kat) k.show();
    }
};

const Scene35 = function(s) {
    let time = {
        table: frames(2),
        axes: frames(5),
        pts: frames(7),
        l: frames(9),  // linear equation
        graph: frames(12),
        x: frames(15),
        empX2: frames(19), // data mat
        empx2: frames(24), // in lin rel
        neq: frames(30),
        fn: frames(32.7), // footnote
    };
    let tnr;

    s.preload = function () {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);

        // the data used for quadratic regression
        let xs = [-9, -6, 2, 7, 13, 19];
        let ys = [3, -4, -7, 1, 9, 21];
        let x2 = [];
        for (let i = 0; i < xs.length; i++)
            x2[i] = xs[i] * xs[i];

        s.plot = new Plot(s, {
            xs: xs, ys: ys,
            startPt: time.pts, start: time.axes,
            right: 675,
            centerX: 200, centerY: 500,
            labelX: "x", labelY: "y",
            stepX: 20, stepY: 20,
        });
        s.table = new Table(s, {
            x: 697, y: 47,
            xs: xs, ys: ys,
            start: time.table,
            font: tnr,
            colorX: [77, 217, 77], colorY: [77, 177, 255],
            size: 47, sizeX: 47
        });
        s.b = new MR_Plane(s, {  // only to extract the coefficients b0, b1, b2
            x1: xs, x2: x2, y: ys,
        });
        s.graph = new FcnPlot(s, {
            axes: s.plot, color: Orange, start: time.graph,
            f: ((x) => { return (x * x * s.b.b2 + x * s.b.b1 + s.b.b0); })  // quadratic best-fit
        });

        s.txt = new TextFade(s, {
            font: tnr,
            start: time.fn, // end: time.txtEnd,
            size: 27,
            x: 267, y: 247,
            str: "Note: Previously, I've used x_1, x_2 ... \nto denote different predictor variables. \n" +
                "So here I use x_a, x_b ... for individual\ndata points."
        });

        // adapted (copied lol) from Scene 34
        let ex = 167, ey = 7, dt = 4, i = 0;
        s.keq = []; s.kat = [];
        s.keq[0] = new Katex(s, { x: ex, y: ey, text: "\\textcolor{#47b7f7}{y}=", start: time.l + dt * (i++)});
        s.keq[1] = new Katex(s, { x: ex + 87, y: ey, text: "\\beta_0", color: "#f75757", start: time.l + dt * (i++)});
        s.keq[2] = new Katex(s, { x: ex + 137, y: ey, text: "+", start: time.l + dt * (i++)});
        s.keq[3] = new Katex(s, { x: ex + 177, y: ey, text: "\\beta_1", color: "#47c747", start: time.l + dt * (i++)});
        s.keq[4] = new Katex(s, { x: ex + 227, y: ey, text: "x", start: time.l + dt * (i++)});
        s.keq[5] = new Katex(s, { x: ex + 267, y: ey, text: "+", start: time.l + dt * (i++)});
        s.keq[6] = new Katex(s, { x: ex + 307, y: ey, text: "\\beta_2", color: "#f7f717", start: time.l + dt * (i++)});
        s.keq[7] = new Katex(s, { x: ex + 357, y: ey, text: "x^2", start: time.l + dt * (i++)});

        let sx = 477, sy = 47;

        let tx = 407 + sx, y = 177 + sy, tdx = 179, tdy = 297;
        s.bl = new Bracket(s, { x1: tx - 27, y1: y, x2: tx - 27, y2: y + tdy, start: time.x, });
        s.br = new Bracket(s, { x1: tx + tdx, y1: y + tdy, x2: tx + tdx, y2: y, start: time.x });

        let nx = 390 + sx, ny = 140 + sy, dx = 67;
        s.kat[3] = new Katex(s, { x: nx + 10, y: ny,
            text: "1\\newline 1\\newline 1\\newline 1"
            , color: "#f75757", fadeIn: true, start: time.x, font_size: 39 });
        s.kat[4] = new Katex(s, { x: nx + dx, y: ny,
            text: "x_a\\newline x_b\\newline x_c\\newline x_d",
            color: '#47c747', fadeIn: true, start: time.x + 7, });
        s.kat[5] = new Katex(s, { x: nx + dx * 2, y: ny,
            text: "x_a^2\\newline x_b^2\\newline x_c^2\\newline x_d^2",
            color: '#f7f717', fadeIn: true, start: time.x + 14, });

        let kx = 407 + sx, ky = 357 + sy;
        s.kat[0] = new Katex(s, { x: kx, y: ky, text: "⋮", color: "#f75757", start: time.x, });
        s.kat[1] = new Katex(s, { x: kx + dx, y: ky, text: "⋮", color: '#47c747', start: time.x + 7,});
        s.kat[2] = new Katex(s, { x: kx + dx * 2, y: ky, text: "⋮", color: '#f7f717', start: time.x + 14, });

        s.kat[6] = new Katex(s, {
            x: 271 + sx, y: 260 + sy, text: "X=", fadeIn: true, start: time.x,
        });
        s.kat[7] = new Katex(s, { x: 747, y: 527, text: "\\vec{b}=(X^T X)^{-1} X^T \\vec{y}",
            fadeIn: true, start: time.neq });
    };

    s.draw = function () {
        s.background(0);
        if (s.frameCount === time.empX2) { s.kat[5].jump(24, 1); s.kat[2].jump(24, 1); }
        if (s.frameCount === time.empx2) s.keq[7].shake(21, 1);
        s.plot.showAxes();
        s.plot.showPoints();
        s.graph.show();
        s.table.show();
        for (let k of s.keq) k.show();
        for (let k of s.kat) k.show();
        s.bl.show();
        s.br.show();
        s.txt.show();
        //showFR(s);
    };
};

const Scene36a = function(s) {
    let t = {
        txt0: frames(1),
        txt1: frames(2)
    };
    let tnr;
    s.preload = function() {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.txt = [];
        s.txt[0] = new TextWriteIn(s, {
            str: "describing", x: 200, y: 200, start: t.txt0
        });
        s.txt[1] = new TextWriteIn(s, {
            str: "deriving", x: 300, y: 200, start: t.txt1
        });
        s.d = new Dragger(s, [s.txt]);
    };
    s.draw = function () {
        s.background(0);
        s.d.show();
    };
}

const Scene36 = function (s) {
    let time = {
        axes: frames(1),
        pts: frames(2),
        yLabel: frames(2),
        xLabel: frames(2),
        yabx: frames(6),
        line: frames(8),
        formula: frames(10),
    };
    // US population, 1920 to 2019
    let xs = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 99];
    let ys = [106, 123, 132, 151, 179, 203, 227, 248, 281, 309, 328];

    let kat = [], txt = [];
    let tnr;
    s.preload = function () {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function() {
        setup2D(s);
        s.plot = new Plot(s, {
            startPt: time.pts, start: time.axes, ptLabel: true, font: tnr,
            right: 1200, centerX: 67, centerY: 600, stepX: 10, stepY: 1.7,
            xs: xs, ys: ys,
        });
        s.lin = new LRP_Scene36(s, {  /// CAUTION: DO NOT NAME IT LINE
            startPt: 10, startLSLine: time.line,
            right: 1200, centerX: 67, centerY: 600, stepX: 10, stepY: 1.7,
            xs: xs, ys: ys, lineColor: s.color(247, 137, 27)
        });
        kat[0] = new Katex(s, {
            text: "y=\\textcolor{f78747}{a}\\textcolor{77f777}{b}^x",
            x: 832, y: 123, font_size: 37, fadeIn: true, start: time.yabx
        });
        kat[1] = new Katex(s, {
            text: "ln(y)=ln(\\textcolor{f78747}{a})+ln(\\textcolor{77f777}{b})x",
            x: 687, y: 107, font_size: 37, fadeIn: true, start: time.formula
        });
        txt[0] = new TextWriteIn(s, {
            str: "U.S. Population (millions)", x: 80, y: 7, start: time.yLabel
        });
        txt[1] = new TextWriteIn(s, {
            str: "Decades Since 1920", x: 877, y: 605, start: time.xLabel
        });
        //this.d = new Dragger(s, [kat, txt]);
    };
    s.draw = function() {
        s.background(0);
        if (s.frameCount === time.formula) kat[1].shift(0, 100, 1, 1);
        s.plot.showPoints();
        s.plot.showAxes();
        s.lin.show();
        //s.d.show();
        for (let k of kat) k.show();
        for (let t of txt) t.show();
        //showFR(s);
    }
};

const Scene37a = function (s) {
    let t = {
        txt0: frames(1),
        txt1: frames(2),
        arr: frames(2),
        brain: frames(2),
        bubble: frames(3),
    };
    let tnr, comic, emoji;
    s.preload = function() {
        tnr = s.loadFont('../lib/font/times.ttf');
        comic = s.loadFont('../lib/font/comic.ttf');
        emoji = s.loadFont('../lib/font/emoji.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.txt = [];
        s.txt[0] = new TextWriteIn(s, {
            str: "describing", x: 357, y: 50, start: t.txt0, font: tnr, size: 42
        });
        s.txt[1] = new TextWriteIn(s, {
            str: "deriving", x: 670, y: 50, start: t.txt1, font: tnr, size: 42
        });
        // s.txt[2] = new Katex(s, {
        //     str: "X^TX\\vec{b}=X^T\\vec{y}", x: 100, y: 300, start: t.bubble,
        // });
        let len = 40;
        s.arr = new Arrow(s, {
            x1: 600 - len, x2: 600 + len, y1: 77, y2: 77, start: t.arr
        });
        s.brain = new ThoughtBrain(s, {
            start: t.brain,
            x: 217, y: 487, size: 327,
            font: comic, str: "How are the\nnormal equations\nderived?", font_size: 37,
            bubbleStart: t.bubble,
            emoji: emoji, question: true
            // bulbStart: time.bulb
        });
        s.d = new Dragger(s, [s.txt]);
    };
    s.draw = function () {
        s.background(0);
        for (let x of s.txt) x.show();
        s.arr.show();
        s.brain.show();
        s.d.show();
    };
}

const Scene37 = function (s) {
    let time = {
        move: frames(2),
        //show0: frames(2),

    }
    let kat = [];
    s.setup = function() {
        setup2D(s);
        s.plot = new LRP_Scene37(s, {
            startPt: 10, startLSLine: 10000000,
            right: 600, centerX: 67, centerY: 550, stepX: 10, stepY: 10,
            xs: xCoords, ys: yCoords, lineColor: s.color(247, 137, 27)
        });
        s.axes = new AxesTransform(s, {
            plot: s.plot,
            move: time.move,
        });
        let kx = 637, ky = 37;
        kat[0] = new Katex(s, {
            text: "\\textstyle\\hat{\\beta}=\\frac{\\sum_{i=1}^n " +
                "(\\textcolor{" + "#37c717" + "}{x_i}-~~~)(\\textcolor{#27a7f7}{y_i}-~~~)} " +
                "{\\sum_{i=1}^n(\\textcolor{#37c717}{x_i}-~~~)^2}",
            x: kx - 57, y: ky, font_size: 54,
        });
        let x1 = 920, y1 = 50, x2 = 1065, x3 = 984, y3 = 107;
        kat[1] = new Katex(s, { text: "\\bar{x}", x: x1, y: y1, fadeOut: true, end: time.move });
        kat[2] = new Katex(s, { text: "\\bar{y}", x: x2, y: y1, fadeOut: true, end: time.move });
        kat[3] = new Katex(s, { text: "\\bar{x}", x: x3, y: y3, fadeOut: true, end: time.move });
        kat[4] = new Katex(s, {
            text: "0", color: '#f76737', x: x1, y: y1, fadeIn: true, start: time.move
        });
        kat[5] = new Katex(s, {
            text: "0", color: '#f76737', x: x2, y: y1, fadeIn: true, start: time.move
        });
        kat[6] = new Katex(s, {
            text: "0", color: '#f76737', x: x3, y: y3, fadeIn: true, start: time.move
        });
    };

    s.draw = function() {
        s.background(0);
        s.plot.show();
        s.plot.showPoints();
        s.axes.show();
        for (let k of kat) k.show();
        showFR(s);
    }
};

const Scene38 = function (s) {
    let time = {
        move: 7,
        line: frames(4),
        exp1: frames(1),
        exp2: frames(2),
        exp3: frames(3)
    };
    let kat = [];
    let comic;
    s.preload = function () {
        comic = s.loadFont('../lib/font/comic.ttf');
    };
    s.setup = function() {
        setup2D(s);
        s.plot = new LRP_Scene37(s, {
            startPt: 10, move: time.move, startLSLine: time.line,
            right: 600, centerX: 67, centerY: 550, stepX: 10, stepY: 10,
            xs: xCoords, ys: yCoords, lineColor: s.color(247, 137, 27)
        });
        s.axes = new AxesTransform(s, {
            plot: s.plot,
        });
        s.brain = new ThoughtBrain(s, {
            str: "Since the data is\nre-centered, " +
                "the line must\nto go through the origin, " +
                "so we\nhave only 1 degree of freedom\n—the slope.",
            font: comic, font_size: 24, x: 37, y: 537, size: 277,
        });
        kat[0] = new Katex(s, {
            text: "\\textcolor{#37f717}{\\vec{x} = \\scriptsize {\\begin{bmatrix}" +
                "-14\\\\" +
                "-10\\\\" +
                "-4\\\\" +
                "3\\\\" +
                "9\\\\" +
                "16\\end{bmatrix}}}",
            fadeIn: true, start: 1,
            x: 637, y: 327
        });
        kat[1] = new Katex(s, {
            text: "\\textcolor{#27c7ff}{\\vec{y} = \\scriptsize {\\begin{bmatrix}" +
                "-13\\\\-7\\\\-6\\\\5\\\\8\\\\13" +
                "\\end{bmatrix}}}",
            fadeIn: true, start: 1,
            x: 887, y: 327
        });

        let kx = 637, ky = 37;
        kat[2] = new Katex(s, {
            text: "\\textstyle\\hat{\\beta}=\\frac{\\sum_{i=1}^n \\textcolor{#37c717}{x_i} " +
                "\\textcolor{#27a7f7}{y_i}} {\\sum_{i=1}^n \\textcolor{#37c717}{x_i}^2}",
            x: kx - 57, y: ky, font_size: 54,
            fadeIn: true, start: time.remove0
        });
        kat[3] = new Katex(s, {
            text: "\\textstyle=\\frac{\\textcolor{#37c717}{\\vec{x}}⋅\\textcolor{#27a7f7}{\\vec{y}}}" +
                "{\\textcolor{#37c717}{\\vec{x}}⋅\\textcolor{#37c717}{\\vec{x}}}",
            x: kx + 297, y: ky + 7, font_size: 54,
            fadeIn: true, start: time.exp1
        });
        kat[4] = new Katex(s, {
            text: "\\textstyle=\\frac{\\textcolor{#37c717}{\\vec{x}}^T\\textcolor{#27a7f7}{\\vec{y}}}" +
                "{\\textcolor{#37c717}{\\vec{x}}^T\\textcolor{#37c717}{\\vec{x}}}",
            x: kx, y: ky + 125, font_size: 54,
            fadeIn: true, start: time.exp2
        });
        kat[5] = new Katex(s, {
            text: "=(\\textcolor{#37c717}{\\vec{x}}^T\\textcolor{#37c717}{\\vec{x}})^{-1}" +
                "{\\textcolor{#37c717}{\\vec{x}}^T\\textcolor{#27a7f7}{\\vec{y}}}",
            x: kx + 181, y: ky + 167, font_size: 37,
            fadeIn: true, start: time.exp3
        });
    };

    s.draw = function() {
        s.background(0);
        s.plot.show();
        s.plot.showPoints();
        s.axes.show();
        s.brain.show();
        for (let k of kat) k.show();
        showFR(s);
    }
};

let p = new p5(Scene37a);