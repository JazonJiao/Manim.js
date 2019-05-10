// Dijkstra's algorithm, 2019-04-26

let G = {
    V: [[225, 100],  // 0
        [375, 100],  // 1
        [150, 250],  // 2
        [300, 250],  // 3
        [450, 250],  // 4
        [150, 400],  // 5
        [300, 400],  // 6
        [450, 400],  // 7
        [225, 550],  // 8
        [375, 550],  // 9
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
    ],
};

class Graph_Dijk extends Graph_U {
    constructor(ctx, args) {
        super(ctx, args);

        this.C = [];
        for (let i = 0; i < this.n; i++) {
            this.C[i] = -1;
        }
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