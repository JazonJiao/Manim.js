// 8. Finding cut vertices (articulation points), 2019-04-28

let G = {
    V: [[250, 100],
        [180, 200],
        [320, 200],
        [110, 300],
        [250, 300],
        [390, 300],
        [180, 400],
        [320, 400],
        [123, 510],
        [377, 510],
        [250, 577],
    ],
    E: [[0, 1],
        [0, 2],
        [0, 4],
        [1, 3],
        [1, 4],
        [3, 4],
        [3, 6],
        [6, 7],
        [6, 8],
        [6, 10],
        [7, 8],
        [7, 9],
        [7, 10],
        [9, 10]
    ]
};

class Edge_08 extends Edge {
    addEdge(color) {
        this.directed = true;
        super.addEdge(color);
    }
}

class Graph_Cut extends Graph {
    constructor(ctx, args) {
        super(ctx, args);
        for (let i = 0; i < this.n; i++)
            this.nodes[i].txt.str = " ";  // reset text

        this.z = new Tracer(this.s, {
            str: "Finding cut vertices (a.k.a articulation points)",
            x: 477, y: 67, size: 29, start: args.time, begin: args.begin,
        });
        this.z.add("Do a Depth First Search and set:", 0, 30, 45);   // step 0
        this.z.add("DFS Number = discovery time", -1, 60, 90);
        this.z.add("Low value", -1, 60, 135, null, Blue, 1);
        this.z.add("= DFS Number", -1, 190, 135);
        this.z.add("If DFS reached visited nodes (i.e. found a back edge):", 1, 60, 180); // step 1
        this.z.add("Low value = lowest DFS Number of visited nodes", 2, 90, 225);  // step 2
        this.z.add("While backtracking:", -1, 60, 270);
        this.z.add("Update Low values until it equals DFS Number", 3, 90, 315);  // step 3
        this.z.add("If Low value of a child > DFS Number:", 4, 90, 360);
        this.z.add("then this node is an articulation point", 0, 120, 405);  // step 4

        for (let i = 0; i < this.m; i++) {   // Copied from Graph_U, but need Edge_08
            let a = this.E[i][0], b = this.E[i][1], d = this.E[i][2];
            this.edges[a][b] = new Edge_08(this.s, {
                x1: this.V[a][0], y1: this.V[a][1], x2: this.V[b][0], y2: this.V[b][1],
                start: this.start + frames(this.dur) * i / this.m, d: d, color: args.color_e,
                duration: 0.8, node_r: this.radius, directed: false, label: false
            });
            this.edges[b][a] = new Edge_08(this.s, {
                x1: this.V[b][0], y1: this.V[b][1], x2: this.V[a][0], y2: this.V[a][1],
                color: args.color_e, start: this.start + frames(this.dur) + 1, d: -d,
                duration: 0.8, node_r: this.radius, directed: false, label: false
            });
        }

        this.visited = [];  // used for DFS
        this.stack = [0];  // used for DFS
        this.aim = [1];    // used for DFS
        this.top = 0;    // used for DFS, equal to size - 1
        this.size = 0;   // keeps track of DFS number

        this.D = [];  // DFS number
        this.L = [];  // Low value
        for (let i = 0; i < this.n; i++)
            this.D[i] = this.L[i] = -1;

        this.start = 0;
    }

    addEdge(i, j, forward) {
        // adds a forward (green) or backward (blue) directed edge for the DFS tree
        // if i > j, edge i-j will be displayed earlier than j-i and thus overwritten in animation
        // anyway we delete the undirected edge in the reverse direction since it's not needed

    }

    DFS() {   // Adapted from topological sort
        let hlc = Orange;

        if (! this.visited[0]) {  // starting point
            this.visited[0] = true;
            this.nodes[0].highlight(hlc, 1e5, 12);
            return;
        }
        let node = this.stack[this.top];

        while (this.aim[this.top] < this.n) {
            let aim = this.aim[this.top];
            this.aim[this.top]++;   // skip this edge
            if (this.A[node][aim]) {  // an edge exists
                if (! this.visited[aim]) {  // visit this node
                    this.top++;   // update stack size
                    this.stack[this.top] = aim;  // push onto stack
                    this.aim[this.top] = 0;  // search from vertex 0

                    this.visited[aim] = true;  // mark as visited
                    this.nodes[aim].highlight(hlc, 1e5, 12);
                    this.edges[node][aim].highlight(hlc, 1e5, 14);
                    // mark forward edge as green, and

                } else {  // else, an unvisited edge is detected, but endpoint is visited
                    // endpoint is on stack--it's a back edge
                    if (this.stack.includes(0)) {
                        // mark back edge as blue, and update low value
                    } else {
                        this.nodes[aim].highlight(hlc, this.f / fr * 1.5, 12);
                        this.edges[node][aim].highlight(hlc, this.f / fr * 1.4, 14);
                    }
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
                this.finished = true;
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
        this.z.show();

        if (!this.finished && this.s.frameCount % this.f === 0 && this.s.frameCount > this.begin) {
            if (this.state === -1) {  // intermediate step: start DFS at new vertex
                this.nodes[this.stack[0]].highlight(Orange, 1e5, 12);

                this.state = 0;
            } else if (this.state === 0) {  // visiting new vertices

            } else if (this.state === 1) {

            }
        }
    }
}

const Graph08 = function (s) {
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
        s.g = new Graph_Cut(s, {
            V: G.V, E: G.E, font: tnr, label: " ",
            start: t.start, begin: t.trace, time: t.txt,
        });
    };
    s.draw = function () {
        s.background(0);
        s.g.show();
    };
};

let p = new p5(Graph08);