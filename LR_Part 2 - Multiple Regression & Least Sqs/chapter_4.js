// Chapter 4, Multiple Regression

// scene 26
const Scene31 = function(s) {
    let time = {

    };
    let g3;
    let tnr;
    let obj = [];
    let tmr = [];
    s.arr = [];

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
        s.arr[0] = new Arrow(s, {

        });


        let ex = 407, ey = 7;
        s.keq[0] = new Katex(s, { x: ex, y: ey, text: "\\textcolor{#47b7f7}{y}=", });
        s.keq[1] = new Katex(s, { x: ex + 87, y: ey, text: "\\beta_0", color: "#f75757", });
        s.keq[2] = new Katex(s, { x: ex + 137, y: ey, text: "+", });
        s.keq[3] = new Katex(s, { x: ex + 177, y: ey, text: "\\beta_1", color: "#47c747", });
        s.keq[4] = new Katex(s, { x: ex + 227, y: ey, text: "x_1", color: "#47c747", });
        s.keq[5] = new Katex(s, { x: ex + 277, y: ey, text: "+", });
        s.keq[6] = new Katex(s, { x: ex + 317, y: ey, text: "\\beta_2", color: "#f7f717" });
        s.keq[7] = new Katex(s, { x: ex + 367, y: ey, text: "x_2", color: "#f7f717" });
    };

    s.draw = function () {
        s.background(0);
        s.axes.show(g3);
        s.image(g3, 0, 0, cvw, cvh);
        //showFR(s);
    };
};

const Scene34 = function(s) {
    let time = {
        txt1: frames(3),
        txt1e: frames(4),
        txt2: frames(4),
        txt3: frames(5),
        txt3e: frames(7),
        txt2e: frames(8),

        jumpInput1: frames(2),
        jumpInput2: frames(2) + 27,
        jumpX1: frames(7),
        jumpX2: frames(7) + 27,
        jumpX0: frames(9),
        jumpB0: frames(10),
        x: frames(4),
        b: frames(2),
        y: frames(3),
        emp: frames(5),
        emE: frames(17),
        neq: frames(100)
    }
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
            str: "   3 data points\n= 3 dimensions",
            x: 757, y: 277, start: time.txt1, end: time.txt1e, font: tnr, color: [255, 255, 255]
        });
        s.txt[5] = new TextFade(s, {
            str: "One entry", x: 797, y: 400, start: time.txt2, end: time.txt2e, font: tnr,
        });
        s.txt[6] = new TextFade(s, {
            str: "...unless if you're a string theorist :)",
            x: 847, y: 640, start: time.txt3, end: time.txt3e, size: 24, font: tnr,
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

        let ny = 457;
        s.kne[0] = new Katex(s, { x: 450, y: ny, text: "X", fadeIn: true, start: time.x });
        s.kne[1] = new Katex(s, { x: 617, y: ny, text: "\\vec{b}", fadeIn: true, start: time.b });
        s.kne[2] = new Katex(s, { x: 780, y: ny, text: "\\vec{y}", fadeIn: true, start: time.y });
        s.kne[3] = new Katex(s, { x: x1 - 67, y: ty - 57, text: "=", fadeIn: true, start: time.x });
        s.kne[3] = new Katex(s, {
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
        })
    }

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
        s.hg.show();
        for (let e of s.emp) e.show();
        for (let t of s.txt) t.show();
        for (let k of s.kat) k.show();
        for (let b of s.bl) b.show();
        for (let b of s.br) b.show();
        for (let e of s.keq) e.show();
        for (let e of s.kne) e.show();
        s.box.show();
    }
}

let p = new p5(Scene34);