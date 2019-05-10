// DFS

let EU = [   // pool of undirected edges
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 6],
    [1, 2],
    [1, 5],
    [1, 6],
    [1, 8, 54],
    [2, 3],
    [2, 5],
    [2, 6],
    [2, 7],
    [2, 8],
    [3, 4],
    [3, 5],
    [3, 6],
    [3, 7],
    [3, 9],
    [4, 6],
    [4, 7],
    [4, 9, -54],
    [5, 6],
    [5, 8],
    [5, 9],
    [5, 10],
    [6, 7],
    [6, 8],
    [6, 9],
    [6, 11],
    [6, 13],
    [7, 8],
    [7, 9],
    [7, 12],
    [8, 9],
    [8, 10],
    [8, 11],
    [8, 12],
    [8, 13, 54],
    [8, 14],
    [9, 10],
    [9, 11],
    [9, 12],
    [9, 15],
    [9, 16, -54],
    [10, 11],
    [10, 13],
    [10, 14],
    [10, 15],
    [11, 12],
    [11, 13],
    [11, 14],
    [11, 15],
    [11, 16],
    [12, 14],
    [12, 15],
    [12, 16],
    [13, 14],
    [14, 15],
    [15, 16]
];

let G = {
    V: [[300, 77],
        [120, 177],
        [240, 177],
        [360, 177],
        [480, 177],
        [180, 277],
        [300, 277],
        [420, 277],
        [240, 377],
        [360, 377],
        [180, 477],
        [300, 477],
        [420, 477],
        [120, 577],
        [240, 577],
        [360, 577],
        [480, 577]
    ],
    E: randomizeEdges(EU, 0.67)
};

class Graph_DFS extends Graph_U {
    constructor(ctx, args) {
        super(ctx, args);

        this.visited = [];  // used for DFS
        for (let i = 0; i < this.n; i++) {
            this.nodes[i].txt.str = " ";  // reset text
            this.visited[i] = i === 0;
        }
        this.stack = [0];  // used for DFS
        this.aim = [1];    // used for DFS
        this.top = 0;    // used for DFS, equal to size - 1

        this.z = new Tracer(this.s, {
            str: "Depth-first search",
            x: 637, y: 77, start: args.time, begin: args.begin,
        });
        this.z.add("DFS(start vertex)", 0, 35, 45, false, false, 17);
        this.z.add("End", 4, 0, 90);
        this.z.add("DFS(v):", -1, 0, 175, false, Yellow);
        this.z.add("Mark v as visited", 1, 35, 220);
        this.z.add("For each unvisited neighbor, w, of v:", 2, 35, 265);
        this.z.add("call DFS(w)", 3, 70, 310);

        this.f = 54;
        this.state = 0;
    }

    DFS() {   // adapted from 5_topsort.js
        let hlc = Orange;
        let nhr = 12;  // node highlight radius
        let ehr = 14;  // edge highlight radius

        if (!this.visited[0]) {  // starting point
            this.nodes[0].highlight(hlc, 1e5, nhr);
            this.z.reset(0);
            return;
        }

        let node = this.stack[this.top];

        while (this.aim[this.top] < this.n) {
            let aim = this.aim[this.top];
            this.aim[this.top]++;   // skip this edge

            if (this.A[node][aim]) {  // an edge exists
                if (!this.visited[aim]) {  // visit this node
                    this.top++;   // update stack size
                    this.stack[this.top] = aim;  // push onto stack
                    this.aim[this.top] = 0;  // search from vertex 0

                    this.visited[aim] = true;  // mark as visited
                    this.nodes[aim].highlight(hlc, 1e5, nhr);
                    this.edges[node][aim].highlight(hlc, 1e5, ehr);
                } else {  // else, an unvisited edge is detected, but endpoint is visited
                    this.edges[node][aim].highlight([247, 27, 7], 1, ehr);
                }
                return;  // if any unvisited edge is detected, stop this iteration
            }
        }
        if (this.aim[this.top] === this.n) {  // finished this node
            this.nodes[node].dehighlight();
            if (this.top === 0) {  // already at root
                for (let i = 0; i < this.n; i++) {
                    if (!this.visited[i]) {  // start a new DFS tree at another component
                        this.stack[0] = i;
                        this.aim[0] = 0;
                        this.visited[i] = true;
                        this.state = -1;   // intermediate step
                        return;
                    }
                }  // for loop exits: all vertices are visited, DFS finished
                this.state = 3; // fixme
                return;
            }
            // not at root; all neighboring edges and vertices are visited, need to backtrack
            this.nodes[node].dehighlight();
            this.stack[this.top] = -1;
            this.top--;    // reset stack size
            this.edges[this.stack[this.top]][node].dehighlight();
        }
    }

    show() {
        super.show();
        this.z.show();

        if (!this.finished && this.s.frameCount % this.f === 0 && this.s.frameCount > this.begin) {
            if (this.state === 0) {  // perform DFS
                this.DFS();
            } else if (this.state === -1) {  // intermediate step: start DFS at new vertex
                this.nodes[this.stack[0]].highlight(Orange, 1e5, 12);

                this.state = 0;
            }
        }
    }
}

const Graph00 = function (s) {
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
        s.g = new Graph_DFS(s, {
            V: G.V, E: G.E, font: tnr,
            start: t.start, begin: t.trace, time: t.txt,
        });
    };
    s.draw = function () {
        s.background(0);
        s.g.show();
    };
};

let p = new p5(Graph00);