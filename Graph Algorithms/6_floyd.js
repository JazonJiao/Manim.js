
class Label_06 extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);


    }

}

class Chart_Floyd extends Chart {
    constructor(ctx, args) {
        super(ctx, args);
        for (let i = 0; i < this.i; i++)
            for (let j = 0; j < this.j; j++)
                this.grid[i][j] = new Label_06(this.s, {
                    x: (i + 0.5) * this.w, y: (j + 0.5) * this.h, font: args.font,

                });
    }
}


const Graph06 = function (s) {
    let t = {
        start: frames(1),
        txt: [frames(5), frames(8), frames(10), frames(12), frames(15), frames(17), frames(19)],
        trace: frames(3),
    };
    let tnr;
    s.preload = function () {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.c = new Chart(s, {
            x: 100, y: 200, start: t.start, font: tnr,
        });
        // s.g = new Graph_Floyd(s, {
        //     V: G.V, E: G.E, font: tnr,
        //     start: t.start, begin: t.trace, time: t.txt,
        // });
        //s.d = new Dragger(s, [s.g.txt]);
    };
    s.draw = function () {
        s.background(0);
        s.c.show();
        //s.g.show();
        //s.d.show();
    };
};

let p = new p5(Graph06);