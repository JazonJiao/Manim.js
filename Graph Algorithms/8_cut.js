// 8. Finding cut vertices (articulation points), 2019-04-27



class Graph_Cut extends Graph_U {
    constructor(ctx, args) {
        super(ctx, args);
        for (let i = 0; i < this.n; i++)
            this.nodes[i].reset({ str: " " });

        this.z = new Tracer(this.s, {
            str: "Finding cut vertices (articulation points)",
            x: 567, y: 67, size: 29, start: args.time, begin: args.begin,
        });

        this.D = [];  // DFS number
        this.L = [];  // Low value
        for (let i = 0; i < this.n; i++)
            this.D[i] = this.L[i] = -1;

        this.start = 0;
    }

    show() {
        super.show();
        this.z.show();

        if (!this.finished && this.s.frameCount % this.f === 0 && this.s.frameCount > this.begin) {

        }
    }
}

const Graph08 = function (s) {
    let t = {
        start: frames(1),
        txt: frames(2),
        trace: frames(3),
    };
    let tnr;
    s.preload = function () {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.g = new Graph_Cut(s, {
            V: G.V, E: G.E, font: tnr, label: " ",
            start: t.start, begin: t.trace, time: t.txt,
        });
        //s.d = new Dragger(s, [s.g.txt]);
    };
    s.draw = function () {
        s.background(0);
        s.g.show();
        //s.d.show();
    };
};

let p = new p5(Graph08);