


class Graph_Kru extends Graph_U {
    constructor(ctx, args) {
        super(ctx, args);
        this.z = new Tracer(this.s, {
            str: "Kruskal's Algorithm for Minimum Spanning Tree",
            x: 607, y: 77, start: args.time, begin: args.begin,
        });
        this.z.add("Sort the edges by their weights", 0, 35, 45);
        this.z.add("Repeat:", 0, 35, 90);
        this.z.add("Choose the edge with next smallest weight", 0, 70, 135);
        this.z.add("Add it to tree if doesn't create a cycle", 0, 70, 180);
        this.z.add("End when all vertices are added", 0, 35, 225);

        this.f = 47;  // fixme

        this.state = 0;
    }
    show() {
        super.show();
        this.z.show();

        if (!this.finished && this.s.frameCount % this.f === 0 && this.s.frameCount > this.begin) {
            if (this.state === 0) {

            }
        }
    }
}

const Graph03 = function(s) {
    let t = {
        start: frames(1),
        txt: frames(2),
        trace: frames(3),
    };
    let tnr;
    s.preload = function() {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.g = new Graph_Kru(s, {
            V: G.V, E: G.E, font: tnr,
            //color_e: [7, 97, 7],
            start: t.start, begin: t.trace, time: t.txt,
        });
    };
    s.draw = function () {
        s.background(0);
        s.g.show();
    };
};

let p = new p5(Graph03);