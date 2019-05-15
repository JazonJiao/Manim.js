// Topological sort using in-degrees, 2019-04-27

let ED = [  // pool of directed edges; note that cycles will never occur from this list of edges
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 3],
    [1, 4],
    [1, 6],
    [2, 1],
    [2, 3],
    [2, 5],
    [2, 6],
    [2, 7],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 6],
    [4, 9],
    [5, 6],
    [5, 7],
    [5, 8],
    [5, 9],
    [6, 8],
    [6, 9],
    [7, 6],
    [7, 8],
    [9, 8],
];

let G = {
    V: [[210, 87],
        [350, 87],
        [140, 197],
        [280, 197],
        [420, 197],
        [210, 307],
        [350, 307],
        [140, 417],
        [280, 417],
        [420, 417],
    ],
    E: randomizeEdges(ED, 0.5 + Math.random() * 0.27)
};

class Graph_Topo extends Graph_D {
    constructor(ctx, args) {
        super(ctx, args);
        this.z = new Tracer(this.s, {
            str: "Topological sort (using in-degrees)",
            x: 537, y: 57, start: args.time, begin: args.begin,
        });
        this.z.add("Using DFS to find the in-degree of each node", 0, 40, 45);
        this.z.add("If detected a cycle:", -1, 40, 90, 24, [147, 147, 147], 1);
        this.z.add("Error: no topological sort exists", 4, 80, 125, 24, [147, 147, 147]);
        this.z.add("Repeat: ", -1, 40, 170);
        this.z.add("1. Choose a vertex with in-degree 0", 1, 80, 215);
        this.z.add("2. Add it to the sorted list of vertices", 2, 80, 260);
        this.z.add("3. Remove from graph and update in-degrees", 3, 80, 305);
        this.z.add("End if graph is empty", 5, 40, 350);  // step 5

        this.f = 37;  // fixme

        this.ty = 567;   // the y-coordinate of list of nodes
        this.I = [];    // array of in-degrees
        this.visited = [];  // used for DFS
        this.stack = [0];  // used for DFS
        this.aim = [1];    // used for DFS
        this.top = 0;    // used for DFS, equal to size - 1
        this.T = [];     // the order of a node
        this.len = 0;    // number of nodes on sorted order
        this.tnodes = [];  // node objects for the sorted order
        this.tedges = [];

        for (let i = 0; i < this.n; i++) {
            this.I[i] = 0;
            this.visited[i] = false;
        }

        this.cur = 0;   // current node to be added to list and removed from graph
        this.state = 0;
    }

    // 2019-04-27
    DFS() {   // code is reusable, except for places marked as fixme
        let hlc = Orange;
        let nhr = 12;  // node highlight radius
        let ehr = 14;  // edge highlight radius

        if (!this.visited[0]) {  // starting point
            this.visited[0] = true;
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
                    this.edges[node][aim].reColor([7, 77, 147]);  // mark visited edge as blue
                    this.edges[node][aim].highlight(hlc, 1e5, ehr);
                    this.nodes[aim].highlight(hlc, 1e5, nhr, true);
                } else {  // else, an unvisited edge is detected, but endpoint is visited
                    if (this.stack.includes(aim)) {  // this is a back edge--cycle detected
                        this.edges[node][aim].highlight([247, 27, 7], 1e5, ehr);
                        this.state = 4;  // fixme
                    } else {   // this is a cross edge (can exist since it's directed graph)
                        this.edges[node][aim].reColor([7, 77, 147]);  // mark visited edge as blue
                        this.edges[node][aim].highlight(hlc, this.f / fr * 1.27, ehr);
                        this.nodes[aim].highlight(hlc, this.f / fr * 1.57, nhr, true);
                        this.state = -3;  // fixme: intermediate step
                    }
                }

                this.I[aim]++;    // fixme
                this.nodes[aim].reset(this.I[aim]);  // fixme

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
                        this.state = -2;   // intermediate step, fixme
                        return;
                    }
                }  // for loop exits: all vertices are visited, DFS finished
                this.state = -1;  // fixme
                return;
            }
            // not at root; all neighboring edges and vertices are visited, need to backtrack
            this.nodes[node].dehighlight();
            this.stack[this.top] = -1;
            this.top--;    // reset stack size
            this.edges[this.stack[this.top]][node].dehighlight();
        }
    }

    reColor() {
        for (let i = 0; i < this.n; i++)
            if (this.I[i] === 0)
                this.nodes[i].reColor(Yellow);
    }

    show() {
        super.show();
        this.z.show();
        for (let t of this.tnodes) t.show();
        for (let e of this.tedges) e.show();

        if (!this.finished && this.s.frameCount % this.f === 0 && this.s.frameCount > this.begin) {
            if (this.state === 0) {  // perform DFS
                this.DFS();
            } else if (this.state === -3) {  // intermediate step
                this.state = 0;
            } else if (this.state === -2) {  // intermediate step: start DFS at new vertex
                this.nodes[this.stack[0]].highlight(Orange, 1e5, 12);

                this.state = 0;
            } else if (this.state === -1) {  // intermediate step: mark all 0-degree vertices
                this.z.reset(1);
                this.reColor();

                this.state = 1;
            } else if (this.state === 1) {
                this.z.reset(1);
                for (let i = 0; i < this.n; i++) {
                    if (this.I[i] === 0) {  // found a 0 in-degree vertex!
                        this.cur = i;
                        this.T[i] = this.len;
                        this.len++;
                        this.nodes[i].highlight(Orange, this.f / fr * 1.5, 17);

                        this.state = 2;
                        return;
                    }
                }
                this.state = 4;  // no topological sort exists
            } else if (this.state === 2) {
                this.z.reset(2);
                let i = this.cur;
                let l = this.tnodes.length;
                let x = cvw * (l + 1) / (this.n + 1);

                this.tnodes[l] = new Node(this.s, {  // add new vertex in the sorted list
                    str: "" + i, color: Green,
                    start: this.s.frameCount + 1,  // this is important since fade in anim needs it!
                    x: x, y: this.ty,
                });
                // add incoming edges
                for (let j = 0; j < this.n; j++)
                    if (this.A[j][i]) {
                        let pj = this.T[j];  // position of j on the sorted order
                        this.tedges[this.tedges.length] = new Edge(this.s, {
                            x1: cvw * (pj + 1) / (this.n + 1), x2: x,
                            y1: this.ty, y2: this.ty,
                            color: [7, 67, 127], directed: true, start: this.s.frameCount + 1,
                            duration: 0.8, node_r: this.radius,
                            d: Math.abs(pj - l) === 1 ?
                                0 : 27 + Math.abs(pj - l) * 7  // curvature of edge
                        });
                    }

                this.state = 3;
            } else if (this.state === 3) {
                this.z.reset(3);
                let i = this.cur;

                this.I[i]--;  // in-degree set to -1

                // NodeLabel fade out animation
                this.nodes[i].reColor([57, 27, 0], false, [97, 77, 77, 177]);
                this.nodes[i].lin.timer_sw =
                    new StrokeWeightTimer(this.s, this.s.frameCount + 1, 1, 0.7);
                this.nodes[i].label.end = this.s.frameCount + 1;

                // outgoing edges fade out & reset in-degrees
                for (let j = 0; j < this.n; j++) {
                    if (this.A[i][j]) {
                        this.edges[i][j].reColor([4, 27, 4]);
                        this.I[j]--;
                        this.nodes[j].reset(this.I[j], true);  // decrease, so down = true
                    }
                }
                this.reColor();

                this.finished = true;
                for (let i = 0; i < this.n; i++)  // check if algorithm is terminated
                    if (this.I[i] > -1)
                        this.finished = false;

                if (this.finished)
                    this.z.reset(5);
                this.state = 1;
            } else if (this.state === 4) {
                this.z.reset(4);
                this.finished = true;
            }
        }
    }
}

const Graph05 = function (s) {
    let t = {
        start: frames(1),
        txt: frames(4),
        trace: frames(18.7),
    };
    let tnr;
    s.preload = function () {
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
    };
    s.draw = function () {
        s.background(0);
        s.g.show();
    };
};

let p = new p5(Graph05);