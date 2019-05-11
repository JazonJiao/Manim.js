// Kruskal's Algorithm

let G = {
    V: [[127, 97],
        [277, 97],
        [427, 97],
        [127, 247],
        [277, 247],
        [427, 247],
        [127, 397],
        [277, 397],
        [427, 397],
        [127, 547],
        [277, 547],
        [427, 547],
    ],
    E: [[0, 1, 0, 0],
        [0, 3, 0, 1],
        [1, 2, 0, 2],
        [1, 3, 0, 3],
        [1, 4, 0, 4],
        [1, 5, 0, 5],
        [2, 5, 0, 6],
        [3, 4, 0, 7],
        [3, 6, 0, 8],
        [3, 7, 0, 9],
        [4, 5, 0, 10],
        [4, 7, 0, 11],
        [5, 7, 0, 12],
        [5, 8, 0, 13],
        [6, 7, 0, 14],
        [6, 9, 0, 15],
        [7, 8, 0, 16],
        [7, 9, 0, 17],
        [7, 10, 0, 18],
        [7, 11, 0, 19],
        [8, 11, 0, 20],
        [9, 10, 0, 21],
        [10, 11, 0, 22],
    ]
};

function shuffleWeights(arr) {

}

class Graph_Kru extends Graph_U {
    constructor(ctx, args) {
        super(ctx, args);
        this.z = new Tracer(this.s, {
            str: "Kruskal's Algorithm for Minimum Spanning Tree",
            x: 547, y: 77, start: args.time, begin: args.begin,
        });
        this.z.add("Sort the edges by their weights", 0, 35, 45);   // step 0
        this.z.add("Repeat:", 0, 35, 90);
        this.z.add("Choose the edge with next smallest weight", 1, 70, 135);  // step 1
        this.z.add("If it doesn't create a cycle:", 2, 70, 180);   // step 2
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

const Graph03a = function(s) {
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

class Graph_UF extends Graph_U {  // Kruskal's Algorithm using UNION-FIND
    constructor(ctx, args) {
        super(ctx, args);
        this.z = new Tracer(this.s, {
            str: "Kruskal's Algorithm using UNION-FIND",
            x: 527, y: 77, start: args.time, begin: args.begin,
        });
        this.z.add("Sort the edges by their weights", 0, 35, 45);   // step 0
        this.z.add("Repeat:", 0, 35, 90);
        this.z.add("Choose the edge x-y with next smallest weight", 1, 70, 135);  // step 1
        this.z.add("If FIND(x) ≠ FIND(y):", 2, 70, 180);   // step 2
        this.z.add("Add edge x-y to the tree", 3, 105, 225);    // step 3
        this.z.add("UNION(x, y)", 4, 105, 270);    // step 4
        this.z.add("End when all vertices are added", 5, 35, 315);  // step 5: end

        this.unodes = [];
        for (let i = 0; i < this.n; i++)
            this.unodes[i] = new Node(this.s, {
                x: 557 + i * 50, y: 567, yOffset: -3, duration: 0.37,
                start: this.start + frames(this.dur) * i / this.n, size: args.size || 27,
                str: "" + i, color: Green, r: 34,
            });

        this.f = 47;  // fixme

        this.state = 0;
    }
    show() {
        super.show();
        for (let u of this.unodes) u.show();
        this.z.show();

        if (!this.finished && this.s.frameCount % this.f === 0 && this.s.frameCount > this.begin) {
            if (this.state === 0) {

            }
        }
    }
}

const Graph03b = function(s) {
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
        s.g = new Graph_UF(s, {
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

let p = new p5(Graph03b);