let G = {
    V: [[300, 100],
        [200, 200],
        [300, 300],
        [400, 200],
    ],
    E: [[0, 1],
        [0, 2],
        [0, 3],
        [2, 1],
    ]
};

class Graph_Topo extends Graph_D {
    constructor(ctx, args) {
        super(ctx, args);
        this.f = 37;

        this.dx = cvw / this.n;  // starting point of list of nodes as well as x-step
        this.y = 100;   // the y-coordinate of list of nodes

        this.I = [];    // array of in-degrees
        this.visited = [];  // used for DFS
        this.stack = [0];  // used for DFS
        this.aim = [1];    // used for DFS
        this.top = 0;    // used for DFS, equal to size - 1

        for (let i = 0; i < this.n; i++) {
            this.I[i] = 0;
            this.visited[i] = false;
        }
        this.zvc = Yellow;  // zero degree node color
        this.rec = [];  // removed edge color
        this.rvc = [];  // removed vertex color

        this.state = 0;
    }

    // 2019-04-27
    DFS() {   // code is reusable, except for updating in-degree part, marked as fixme
        if (! this.visited[0]) {  // starting point
            this.visited[0] = true;
            this.nodes[0].highlight(Yellow, 1e5, 12);
            return;
        }

        let node = this.stack[this.top];

        while (this.aim[this.top] < this.n) {
            let aim = this.aim[this.top];
            if (this.A[node][aim]) {  // an edge exists
                this.aim[this.top]++;   // skip this edge

                if (! this.visited[aim]) {  // visit this node
                    this.top++;   // update stack size
                    this.stack[this.top] = aim;  // push onto stack
                    this.aim[this.top] = 0;  // search from vertex 0

                    this.visited[aim] = true;  // mark as visited
                    this.nodes[aim].highlight(Yellow, 1e5, 12);
                    this.edges[node][aim].highlight(Yellow, 1e5, 14);
                } else {// else, an unvisited edge is detected, but endpoint is visited
                    this.nodes[aim].highlight(Yellow, 1.9, 12);
                    this.edges[node][aim].highlight(Yellow, 1.8, 14);
                }

                this.I[aim]++;    // fixme
                this.nodes[aim].reset(this.I[aim]);  // fixme

                return;  // if any unvisited edge is detected, stop this iteration
            }
            this.aim[this.top]++;
        }
        if (this.aim[this.top] === this.n) {  // finished this node
            this.nodes[node].dehighlight();
            if (this.top === 0) {  // already at root
                for (let i = 0; i < this.n; i++) {
                    if (!this.visited[i]) {  // start a new DFS tree at another component
                        this.top[0] = i;
                        this.nodes[i].highlight(Yellow, 1e5, 9);
                        return;
                    }
                }  // for loop exits: all vertices are visited, DFS finished
                this.state = -1;
                return;
            }
            // not at root; all neighboring edges and vertices are visited, need to backtrack
            this.nodes[node].dehighlight();
            this.top--;    // reset stack size
            this.edges[this.stack[this.top]][node].dehighlight();
        }
    }

    show() {
        super.show();
        if (!this.finished && this.s.frameCount % this.f === 0 && this.s.frameCount > this.begin) {
            if (this.state === 0) {  // perform DFS
                this.DFS();
            } else if (this.state === -1) {  // intermediate step: mark all 0-degree vertices
                for (let i = 0; i < this.n; i++)
                    if (this.I[i] === 0)
                        this.nodes[i].reColor(Yellow, false, false, [255, 147, 7, 255]);
                this.state = 1;
            }
        }
    }
}

// Calculate in-degree of each vertex via DFS
// Repeat:
// 1. Choose a vertex with in-degree 0
// 2. Add it to the sorted list of vertices
// 3. Remove it in graph and update in-degrees
// If there are no 0-degree vertices:
// graph contains cycle, no topological sort exists
// End if graph is empty


const Graph05 = function(s) {
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
        s.g = new Graph_Topo(s, {
            V: G.V, E: G.E, font: tnr,
            color_e: [7, 97, 7],
            start: t.start, begin: t.trace, time: t.txt,
            label: "0",
        });
        s.d = new Dragger(s, []);
        // s.a = new Arc(s, {
        //     a1: 0, a2: -2, x: 322, y: 332, r: 32
        // })
    };
    s.draw = function () {
        s.background(0);
        s.g.show();
        s.d.show();
    };
};

let p = new p5(Graph05);