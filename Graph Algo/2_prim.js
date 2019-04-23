let G = {
    V: [[300, 100],  // 0
        [200, 200],  // 1
        [300, 300],  // 2
        [400, 200],  // 3
    ],
    E: [[0, 3, 0, 5],
        [1, 2, 0, 7],
        [2, 3, 0, 2],
        [0, 1, 0, 3],
        [0, 2, 0, 9]
    ]
};

class Graph_Prim extends Graph_U {
    constructor(ctx, args) {
        super(ctx, args);
        // variables used to keep track of the algorithm's progress
        let finished = false;

        let T = [];
        for (let i in this.n) {
            T[i] = false;
        }
    }
    show() {
        super.show();
        let s = this.s;

    }
}

const Graph02 = function(s) {
    let t = {

    };
    let tnr;
    s.preload = function() {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.g = new Graph_Prim(s, {
            V: G.V, E: G.E, font: tnr
        });
        s.d = new Dragger(s, []);
    };
    s.draw = function () {
        s.background(0);
        s.g.show();
        s.d.show();
    };
};

let p = new p5(Graph02);