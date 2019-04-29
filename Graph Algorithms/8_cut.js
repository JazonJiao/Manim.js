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

class Graph_Cut extends Graph_U {
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
        this.z.add("While backtracking:", 3, 60, 270);   // step 3
        this.z.add("Update Low values until it equals DFS Number", 4, 90, 315);  // step 4
        this.z.add("If Low value of a child > DFS Number:", 5, 90, 360);   // step 5
        this.z.add("then this node is an articulation point", 6, 120, 405);  // step 6
        this.z.add("End", 7, 30, 450);  // step 7

        this.visited = [];  // used for DFS
        this.stack = [0];  // used for DFS
        this.aim = [1];    // used for DFS
        this.top = 0;    // used for DFS, equal to size - 1
        this.size = 0;   // keeps track of DFS number

        this.D = [];  // DFS number
        this.L = [];  // Low value
        for (let i = 0; i < this.n; i++)
            this.D[i] = this.L[i] = 0;

        this.state = -2;
    }

    addEdge(i, j, forward) {
        // adds a forward (green) or backward (blue) directed edge for the DFS tree
        // if i > j, edge i-j will be displayed earlier than j-i and thus overwritten in animation
        // anyway we delete the undirected edge in the reverse direction since it's not needed
        this.edges[j][i] = false;
        this.A[j][i] = false;
        this.edges[i][j].directed = true;
        this.edges[i][j].addEdge(forward ? [7, 117, 17] : [7, 77, 177]);
    }

    resetNode(v) {
        let n = this.size;
        v.labelColor = Blue;
        v.txt = new TextFade(this.s, {  // overwrite text objects
            x: v.x - 12, y: v.y - 14, size: n > 9 ? 34 : 42,
            start: this.s.frameCount + 1, mode: 1, str: "" + n,
        });
        v.label = new TextFade(this.s, {
            str: "" + n, mode: 1, x: v.x + 10, y: v.y + 10,
            start: this.s.frameCount + 1, color: Blue, size: 24
        });
    }

    DFS() {   // Adapted from topological sort
        let hlc = Orange;
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

                    // mark forward edge as green, and update it's DFS number and low value
                    this.addEdge(node, aim, true);
                    this.D[aim] = this.L[aim] = this.size;

                    this.resetNode(this.nodes[aim]);
                    this.size++;
                } else {  // else, an unvisited edge is detected, but endpoint is visited
                    this.z.reset(1);
                    // this cannot be a cross edge since graph is undirected
                    // it's a back edge; mark it as blue, and update low value
                    this.edges[node][aim].highlight([17, 167, 255], this.f / fr * 1.4, 14);
                    this.addEdge(node, aim, false);

                    // update low value if it's lower
                    if (this.D[aim] < this.L[node]) {
                        this.L[node] = this.D[aim];
                        this.state = 2;
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
                this.z.reset(7);
                return;
            }
            // not at root; all neighboring edges and vertices are visited, need to backtrack
            this.nodes[node].dehighlight();

            this.top--;    // reset stack size
            let prev = this.stack[this.top];
            this.edges[prev][node].dehighlight();
            this.z.reset(3);

            if (this.L[prev] > this.L[node]) {  // found an articulation point!
                this.state = 6;
            } else if (this.L[prev] < this.L[node]) {  // need to update low value
                this.L[prev] = this.L[node];
                this.nodes[prev].reset(this.L[prev], true);
            }
        }
    }

    show() {
        super.show();
        this.z.show();

        if (!this.finished && this.s.frameCount % this.f === 0 && this.s.frameCount > this.begin) {
            if (this.state === -2) {  // initial state
                this.visited[0] = true;
                this.z.reset(0);
                this.nodes[0].highlight(Orange, 1e5, 12);
                this.resetNode(this.nodes[0]);
                this.size++;

                this.state = 0;
            } else if (this.state === -1) {  // intermediate step: start DFS at new vertex
                let aim = this.stack[0];
                this.nodes[aim].highlight(Orange, 1e5, 12);
                this.resetNode(this.nodes[aim], aim, this.size);

                this.state = 0;
            } else if (this.state === 0) {  // visiting new vertices
                this.DFS();
            } else if (this.state === 2) {
                this.z.reset(2);
                this.nodes[this.stack[this.top]].reset(this.D[this.aim[this.top] - 1], true);

                this.state = 0;
            } else if (this.state === 3) {

            } if (this.state === 6) {
                this.z.reset(6);
                this.nodes[this.stack[this.top]].reColor(Yellow);

                this.state = 0;
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
            color_v: Green,
        });
    };
    s.draw = function () {
        s.background(0);
        s.g.show();
    };
};

let p = new p5(Graph08);