// Prim's algorithm for MST (naive implementation), 2019-04-24

let G = {
    V: [[250, 100],  // 0
        [150, 200],  // 1
        [250, 300],  // 2
        [350, 200],  // 3
        [150, 400],  // 4
        [350, 400],  // 5
        [250, 500],  // 6
        [450, 100],  // 7
        [550, 200],  // 8
        [550, 400],  // 9
        [450, 500],  // 10
    ],
    E: [[0, 1, 0, 2],
        [0, 2, 0, 3],
        [0, 3, 0, 9],
        [0, 7, 0, 19],
        [1, 2, 0, 7],
        [1, 4, 0, 21],
        [2, 3, 0, 22],
        [2, 4, 0, 0],
        [2, 5, 0, 17],
        [3, 5, 0, 10],
        [3, 7, 0, 27],
        [3, 8, 0, 12],
        [3, 9, 0, 11],
        [4, 5, 0, 8],
        [4, 6, 0, 1],
        [5, 6, 0, 18],
        [5, 9, 0, 17],
        [6, 9, 0, 29],
        [6, 10, 0, 4],
        [7, 8, 0, 23],
        [8, 9, 0, 14],
        [9, 10, 0, 5],

    ]
};

/**
 * graph weights should be 0 to 99
 *
 * args.begin describes start time to trace algorithm
 */
class Graph_Prim extends Graph_U {
    constructor(ctx, args) {
        super(ctx, args);
        this.state = 0;  // 0 for searching edges, 1 for adding vertex/edge
        this.added = 0;  // the vertex (starts at 0)
        this.curEdge = [-1, -1];  // the edge that's newly added

        this.VColor = [255, 248, 27];

        // whether a vertex is inside the tree, used when tracing the algorithm
        this.T = [1];  // starts from 0th vertex
        for (let i = 1; i < this.n; i++) {
            this.T[i] = 0;  // 0 for not in, 1 for in
        }

        this.txt = [];
        this.txt[0] = new TextWriteIn(this.s, {
            str: "Prim's Algorithm for Minimum Spanning Tree", color: Yellow,
            x: 607, y: 77, size: 29, start: args.time[0],
        });
        this.txt[1] = new TextWriteIn(this.s, {
            str: "Add Node 0 to the tree",
            x: 647, y: 127, size: 29, start: args.time[1],
        });
        this.txt[2] = new TextWriteIn(this.s, {
            str: "Repeat: ",
            x: 647, y: 177, size: 29, start: args.time[2],
        });
        this.txt[3] = new TextWriteIn(this.s, {
            str: "1. Check all edges from nodes in tree\n" +
                "    to nodes outside the tree",
            x: 687, y: 227, size: 29, start: args.time[3],
        });
        this.txt[4] = new TextWriteIn(this.s, {
            str: "2. Find the smallest among such edges",
            x: 687, y: 317, size: 29, start: args.time[4],
        });
        this.txt[5] = new TextWriteIn(this.s, {
            str: "3. Add this edge and its endpoint to tree",
            x: 687, y: 367, size: 29, start: args.time[5],
        });
        this.txt[6] = new TextWriteIn(this.s, {
            str: "End",
            x: 647, y: 417, size: 29, start: args.time[6],
        });

        this.arr = new Arrow(this.s, {
            x1: 597, y1: 140, x2: 637, y2: 140, tipLen: 10, color: Orange, start: args.begin,
        });
    }
    show() {
        super.show();
        for (let t of this.txt) t.show();
        this.arr.show();
        let s = this.s;

        if (! this.finished && s.frameCount % this.f === 0 && s.frameCount > this.begin) {
            if (this.state === 0) {
                this.nodes[this.added].reColor(this.VColor);

                this.state = 1;  // never returns to 0
            } else if (this.state === 1) {  // search for smallest edge
                let weight = 1000000;
                this.curEdge = [-1, -1];
                this.arr.reset({
                    x1: 637, y1: 240, x2: 677, y2: 240
                });
                for (let i = 0; i < this.n; i++) {
                    for (let j = i + 1; j < this.n; j++) {  // graph is undirected, start at i + 1
                        // there is an edge from i to j, exactly one of i and j is in T,
                        // and the edge is not already added (note: undefined > -1 is false)
                        if (this.A[i][j] > -1 && this.T[i] + this.T[j] === 1) {
                            if (this.T[i])  // highlight goes from vertex in T to vertex not in T
                                this.edges[i][j].highlight();
                            else
                                this.edges[j][i].highlight();
                            if (this.A[i][j] < weight) {
                                weight = this.A[i][j];
                                this.curEdge = [i, j];
                                this.added = this.T[i] ? j : i;
                            }
                        }
                    }
                }
                // mark edge and vertex in the set
                this.A[this.curEdge[0]][this.curEdge[1]] = -1;
                this.T[this.added] = 1;

                this.state = 2;
            } else if (this.state === 2) {  // pick the smallest edge
                this.edges[this.curEdge[0]][this.curEdge[1]].shake(12);
                this.arr.reset({
                    x1: 637, y1: 330, x2: 677, y2: 330
                });

                this.state = 3;
            } else {  // add vertex and edge
                this.edges[this.curEdge[0]][this.curEdge[1]].addEdge(Green);

                this.nodes[this.added].reColor(this.VColor);
                this.arr.reset({
                    x1: 637, y1: 380, x2: 677, y2: 380
                });

                this.state = 1;
                this.finished = true;
                for (let n = 0; n < this.n; n++)
                    if (! this.T[n])
                        this.finished = false;
            }
        }
        if (this.finished && s.frameCount % this.f === 29) {
            this.arr.reset({ x1: 597, y1: 430, x2: 637, y2: 430 });
        }
    }
}

const Graph02 = function(s) {
    let t = {
        start: frames(1),
        trace: frames(2),//frames(21),
        txt: [frames(5), frames(8), frames(10), frames(12), frames(15), frames(17), frames(19)],
    };
    let tnr;
    s.preload = function() {
        tnr = s.loadFont('../lib/font/times.ttf');  // fixme: change this for github pages
    };
    s.setup = function () {
        setup2D(s);
        s.g = new Graph_Prim(s, {
            V: G.V, E: G.E, font: tnr, start: t.start, begin: t.trace, time: t.txt
        });
        //s.d = new Dragger(s, [s.g.txt, s.g.arr]);
    };
    s.draw = function () {
        s.background(0);
        s.g.show();
        //s.d.show();
    };
};

let p = new p5(Graph02);