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

/**
 * graph weights should be 0 to 99
 */
class Graph_Prim extends Graph_U {
    constructor(ctx, args) {
        super(ctx, args);
        this.f = 47;   // how many frames for advancing one step of the algorithm

        // variables used to keep track of the algorithm's progress
        this.finished = false;
        this.state = 1;  // 0 for searching edges, 1 for adding vertex/edge
        this.added = 0;  // the vertex (starts at 0)
        this.curEdge = [-1, -1];  // the edge that's newly added

        this.VColor = [255, 248, 27];

        // whether a vertex is inside the tree, used when tracing the algorithm
        this.T = [1];  // starts from 0th vertex
        for (let i = 1; i < this.n; i++) {
            this.T[i] = 0;  // 0 for not in, 1 for in
        }
    }
    show() {
        super.show();
        let s = this.s;
        if (! this.finished && s.frameCount % this.f === 0 && s.frameCount > this.start) {
            if (this.state === 0) {  // search for smallest edge
                let weight = 1000000;
                this.curEdge = [-1, -1];
                for (let i = 0; i < this.n; i++) {
                    for (let j = i + 1; j < this.n; j++) {  // graph is undirected, start at i + 1
                        // there is an edge from i to j, exactly one of i and j is in T,
                        // and the edge is not already added (note: undefined > -1 is false)
                        if (this.A[i][j] > -1 && this.T[i] + this.T[j] === 1) {
                            if (this.T[i])  // highlight goes from vertex in T to vertex not in T
                                this.edges[i][j].highlight();
                            else
                                this.edges[j][i].highlight();
                            //console.log(i, j);
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
                this.T[this.added] = true;

                this.state = 1;
            } else {  // add vertex and edge
                if (this.curEdge[0] > -1) {
                    this.edges[this.curEdge[0]][this.curEdge[1]].addEdge(Green);
                }
                this.nodes[this.added].change(this.VColor);

                this.state = 0;
                this.finished = true;
                for (let n = 0; n < this.n; n++)
                    if (! this.T[n])
                        this.finished = false;
            }
        }
    }
}

const Graph02 = function(s) {
    let t = {
        start: frames(2)
    };
    let tnr;
    s.preload = function() {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.g = new Graph_Prim(s, {
            V: G.V, E: G.E, font: tnr, start: t.start
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