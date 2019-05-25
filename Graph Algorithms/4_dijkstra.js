// Dijkstra's algorithm, 2019-04-26

let G = {
    V: [[187, 100],  // 0
        [353, 100],  // 1
        [104, 240],  // 2
        [270, 240],  // 3
        [436, 240],  // 4
        [187, 380],  // 5
        [353, 380],  // 6
        [104, 520],  // 7
        [270, 520],  // 8
        [436, 520],  // 9
    ],
    E: [[0, 1, 0, 7],
        [0, 2, 0, 9],
        [0, 3, 0, 3],
        [1, 3, 0, 4],
        [1, 4, 0, 2],
        [2, 3, 0, 4],
        [2, 5, 0, 5],
        [3, 4, 0, 9],
        [3, 5, 0, 6],
        [3, 6, 0, 7],
        [4, 6, 0, 9],
        [5, 6, 0, 1],
        [5, 7, 0, 1],
        [5, 8, 0, 1],
        [6, 8, 0, 1],
        [6, 9, 0, 1],
        [7, 8, 0, 1],
        [8, 9, 0, 1],
    ],
};

randomizeWeights(G.E, 20);

class Graph_Dijk extends Graph_U {
    constructor(ctx, args) {
        super(ctx, args);

        this.z = new Tracer(this.s, {
            str: "Dijkstra's Algorithm (finding shortest-path tree)",
            x: 517, y: 57, start: args.time, begin: args.begin,
        });
        this.z.add("Initialize dist(start node) = 0, dist(other nodes) = ∞", -1, 35, 50);
        this.z.add("Repeat:", 1, 35, 100);
        this.z.add("1. Select the unfinished vertex with smallest", 2, 70, 150, false, false, 1);
        this.z.add("dist value, and set as “cur” node", -1, 100, 187);
        this.z.add("2. For each unfinished neighbor, v, of “cur”:", 2, 70, 237);
        this.z.add("If dist(v) > dist(cur) + weight(cur—v):", 2, 125, 287);
        this.z.add("Update dist(v)", 2, 160, 337);
        this.z.add("3. Mark “cur” as", 2, 70, 387, false, false, 1);
        this.z.add("finished", -1, 270, 387, false, Green);
        this.z.add("End", 3, 35, 437);

        this.C = [];
        for (let i = 0; i < this.n; i++) {
            this.C[i] = -1;
        }
    }
    show() {
        super.show();
        this.z.show();
    }

}

const Graph04 = function (s) {
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
        s.g = new Graph_Dijk(s, {
            V: G.V, E: G.E, font: tnr,
            start: t.start, begin: t.trace, time: t.txt,
            label: "∞"
        });
        s.d = new Dragger(s, [s.g.txt]);
    };
    s.draw = function () {
        s.background(0);
        if (s.frameCount === 150)
            s.g.nodes[3].reset(12);
        s.g.show();
        //s.d.show();
    };
};

let p = new p5(Graph04);