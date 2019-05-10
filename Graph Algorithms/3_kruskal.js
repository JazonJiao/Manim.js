// Kruskal's Algorithm

let G = {
    V: [[117, 137],
        [237, 137],
        [357, 137],
        [477, 137],
        [117, 257],
        [237, 257],
        [357, 257],
        [477, 257],
        [117, 377],
        [237, 377],
        [357, 377],
        [477, 377],
        [117, 497],
        [237, 497],
        [357, 497],
        [477, 497],
    ],
    E: [[0, 1, 0, 7],
        [0, 4, 0, 7],
        [0, 5, 0, 7],
        [1, 2, 0, 7],
        [1, 5, 0, 7],
        [2, 3, 0, 7],
        [2, 5, 0, 7],
        [2, 6, 0, 7],
        [2, 7, 0, 7],
    ]
};

randomizeWeights(G.E, 40);

class Graph_Kru extends Graph_U {
    constructor(ctx, args) {
        super(ctx, args);
        this.z = new Tracer(this.s, {
            str: "Kruskal's Algorithm for Minimum Spanning Tree",
            x: 577, y: 77, start: args.time, begin: args.begin,
        });
        this.z.add("Sort the edges by their weights", 0, 35, 45);   // step 0
        this.z.add("Repeat:", 0, 35, 90);
        this.z.add("Choose the edge with next smallest weight", 1, 70, 135);  // step 1
        this.z.add("If it doesn't create a cycle", 2, 70, 180);   // step 2
        this.z.add("Add this edge to the tree", 3, 105, 225);    // step 3
        this.z.add("End when all vertices are added", 4, 35, 270);  // step 4: end

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