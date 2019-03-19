// Chapter 4, Multiple Regression

const Scene33 = function(s) {
    let time = {
        txt1: frames(3),
        txt1e: frames(4),
        txt2: frames(4),
        txt3: frames(5),
        txt3e: frames(7),
        txt2e: frames(8),


    }
    let dx = 67;

    let tnr, comic;
    s.txt = []; s.kat = []; s.bl = []; s.br = []; s.emp = [];

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
            str: "the 4th dimension", x: 797, y: 400, start: time.txt2, end: time.txt2e, font: tnr,
        });
        s.txt[6] = new TextFade(s, {
            str: "...unless if you're a string theorist :)",
            x: 847, y: 640, start: time.txt3, end: time.txt3e, size: 24, font: tnr,
        });

        let tx = 407, y = 177, ty = 317, tdy = 297;
        let x1 = 757;

        s.bl[0] = new Bracket(s, { x1: tx - 27, y1: y, x2: tx - 27, y2: y + tdy, start: 1, });
        s.br[0] = new Bracket(s, { x1: tx + 167, y1: y + tdy, x2: tx + 167, y2: y, start: 1 });
        s.bl[1] = new Bracket(s, { x1: x1, y1: y, x2: x1, y2: y + tdy, start: 1, });
        s.br[1] = new Bracket(s, { x1: x1 + 72, y1: y + tdy, x2: x1 + 72, y2: y, start: 1 });

        s.txt[0] = new TextFade(s, {
            x: tx, y: ty, str: "1\n1\n1\n1\n", font: tnr, color: [255, 77, 97], size: 47, mode: 1
        });
        s.txt[1] = new TextFade(s, {
            x: tx + dx, y: ty, str: "2\n-6\n4\n1\n", font: tnr, color: [77, 217, 77], size: 47, mode: 1
        });
        s.txt[2] = new TextFade(s, {
            x: tx + dx * 2, y: ty, str: "2\n2\n1\n-4\n", font: tnr, color: [247, 227, 47], size: 47, mode: 1
        });
        s.txt[3] = new TextFade(s, {
            x: x1 + 37, y: ty, str: "4\n-1\n2\n-3\n", font: tnr, color: [77, 177, 255], size: 47, mode: 1
        });

        let kx = 400, ky = 357;
        s.kat[0] = new Katex(s, { x: kx, y: ky, text: "⋮", color: "#f76767" });
        s.kat[1] = new Katex(s, { x: kx + dx, y: ky, text: "⋮", color: '#57c757' });
        s.kat[2] = new Katex(s, { x: kx + dx * 2, y: ky, text: "⋮", color: '#f7f717' });
        s.kat[3] = new Katex(s, { x: x1 + 27, y: ky, text: "⋮", color: "#47b7f7" });

        s.kat[4] = new Katex(s, {
            text: "\\begin{bmatrix}" +
                "   \\beta_0 \\\\" +
                "   \\beta_1 \\\\" +
                "   \\beta_2" +
                "\\end{bmatrix}",
            x: 577, y: 200, fadeIn: true, start: 1,
        });
        s.kat[5] = new Katex(s, { x: x1 - 67, y: ty - 57, text: "=" });

        s.emp[0] = new Emphasis(s, {

        });
        s.arr = new Arrow(s, {
            x1: 787, x2: 727, y1: 422, y2: 422, start: time.txt2, end: time.txt2e,
        })
    }
    s.draw = function () {
        s.background(0);
        //s.hg.show();
        for (let t of s.txt) t.show();
        for (let k of s.kat) k.show();
        for (let b of s.bl) b.show();
        for (let b of s.br) b.show();
        for (let e of s.emp) e.show();
        s.arr.show();
    }
}

let p = new p5(Scene33);