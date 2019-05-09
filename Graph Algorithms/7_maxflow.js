// Max flow, 2019-04-25

let G = {
    V: [[90, 170],  // S = 0
        [190, 70],
        [190, 270],
        [270, 170],
        [350, 70],
        [350, 270],
        [450, 170], // T = 6
    ],
    E: [[0, 1, 0, 7],
        [0, 2, 0, 9],  // last entry stores capacity, should be positive integer
        [0, 3, 0, 3],
        [1, 3, 0, 4],
        [1, 4, 0, 2],
        [2, 3, 0, 4],
        [2, 5, 0, 5],
        [3, 4, 0, 9],
        [3, 6, 0, 7],
        [4, 6, 0, 9],
        [5, 3, 0, 6],
        [5, 6, 0, 1],
    ],
};

let G1 = {
    V: [[100, 200],  // S (0)
        [260, 100],  // 1
        [260, 300],  // 2
        [420, 200],  // T (3)
    ],
    E: [[0, 1, 0, 9],// last entry stores capacity, should be integer
        [0, 2, 0, 9],
        [1, 2, 0, 1],
        [1, 3, 0, 9],
        [2, 3, 0, 9],
    ]
};

let G3 = {
    V: [[120, 70],  // S (0)
        [420, 70],  // 1
        [270, 170],  // 2
        [120, 270],  // 3
        [420, 270],  // T (n-1)
    ],
    E: [[0, 2, 0, 3],// last entry stores capacity, should be integer
        [0, 3, 0, 7],
        [1, 0, 0, 4],
        [2, 1, 0, 5],
        [2, 3, 0, 1],
        [2, 4, 0, 8],
        [3, 4, 0, 9],
        [4, 1, 0, 6],
    ]
};

class Label_07 extends PointBase {  // shows an edge's flow | capacity
    constructor(ctx, args) {
        super(ctx, args);
        this.flow = new TextFade(this.s, {
            str: "0", x: this.x - 10, y: this.y, mode: 4, start: args.start, color: [177, 255, 237],
            stroke: [0, 0, 0], strokeweight: 7, size: 27
        });
        this.cap = new TextFade(this.s, {
            x: this.x - 2, y: this.y, mode: 3, start: args.start, color: [255, 237, 177],
            str: "| " + args.cap, stroke: [0, 0, 0], strokeweight: 7, size: 27
        });
    }
    reset(addedFlow, newFlow) {
        this.resetted = true;
        this.f = 0;
        let sign = addedFlow > 0;
        this.txt = new TextFade(this.s, {
            str: (sign ? "+" : "") + addedFlow,
            x: this.x - 17, y: this.y, mode: 1, color: sign ? [255, 255, 57] : [57, 197, 255],
            size: 24, start: this.s.frameCount + 1,
            duration: 0.4, end: this.s.frameCount + frames(0.6),
        });
        this.txt.shift(0, 54 * (sign ? -1 : 1), 1, 1);
        this.flow.reset({ str: "" + newFlow });
        this.flow.jump(17 * (sign ? 1 : -1));
    }
    resetting() {
        if (this.f < frames(1.2)) {
            this.txt.show();
            this.f++;
        } else {
            this.resetted = false;
            this.txt = null;
        }
    }
    show() {
        if (this.resetted)
            this.resetting();
        this.flow.show();
        this.cap.show();
    }
}

class Edge_07 extends Edge {  // override Edge so that
    constructor(ctx, args) {
        super(ctx, args);
        this.txt = new Label_07(this.s, {
            cap: args.weight, x: this.x3, y: this.y3, start: args.start
        });
    }
    reset(addedFlow, newFlow) {
        this.txt.reset(addedFlow, newFlow);
    }
}

class Graph_Flow extends Graph {
    constructor(ctx, args) {
        super(ctx, args);
        this.nodes[0].relabel("S");
        this.nodes[this.n - 1].relabel("T");

        for (let i = 0; i < this.m; i++) {  // copied from Graph_G, but need a different class
            let a = this.E[i][0], b = this.E[i][1];  // two connecting nodes
            let d = this.E[i][2], c = this.E[i][3];  // radius and label
            this.A[a][b] = c;
            this.edges[a][b] = new Edge_07(this.s, {
                x1: this.V[a][0], y1: this.V[a][1], x2: this.V[b][0], y2: this.V[b][1],
                start: this.start + frames(this.dur) * i / this.m, d: d, color: args.color_e,
                duration: 0.8, node_r: this.radius, directed: true, weight: c,
            });
        }

        this.tx = new Tracer(this.s, {
            str: "Ford's Algorithm for Max Flow",
            x: 517, y: 77, size: 29, start: args.time, begin: args.begin,
        });
        this.tx.add("Construct the Residual Graph", 0, 40, 50);
        this.tx.add("Repeat: ", -1, 40, 100);
        this.tx.add("1. Find a path from S to T in Residual Graph", 1, 80, 150);
        this.tx.add("2. Find the smallest-weight edge in the path", 2, 80, 200);
        this.tx.add("3. Add this amount of flow to the network", 3, 80, 250);
        this.tx.add("Forward edge: ", -1, 110, 300, 24, Blue);
        this.tx.add("increase flow of corresponding edge", -1, 260, 300, 24);
        this.tx.add("Backward edge: ", -1, 110, 340, 24, Orange);
        this.tx.add("decrease flow of corresponding edge", -1, 276, 340, 24);
        this.tx.add("4. Update Residual Graph", 4, 80, 390);
        this.tx.add("End if T is unreachable from S in Residual Graph", -1, 40, 440);

        this.R = [];  // residual for edge i-j; F[j][i] (backward edge, undefined in E) is flow
        this.rnodes = [];  // residual graph nodes
        this.redges = [];  // residual graph edges
        for (let i = 0; i < this.n; i++) {
            this.redges[i] = [];
            this.R[i] = [];
        }

        this.dy = 300;  // the location of the residual graph relative to the network graph
        this.d = 14;   // the curvature of edges

        this.resStart = args.resStart;

        this.feu = [0, 17, 47];  // color for forward edge unlit
        this.fel = [17, 97, 197];  // color for forward edge lit
        this.beu = [37, 17, 0];  // color for backward edge unlit
        this.bel = [147, 97, 7];  // color for backward edge lit

        this.ftu = [7, 27, 77, 255];  // this is called
        this.ftl = [177, 236, 255, 255];
        this.btu = [67, 37, 7, 255];
        this.btl = [255, 236, 177, 255];  // this is called

        for (let i = 0; i < this.n; i++) {
            this.rnodes[i] = new Node(this.s, {
                x: this.V[i][0], y: this.V[i][1] + this.dy, yOffset: this.yOffset, duration: 0.37,
                start: this.resStart + frames(this.dur) * i / this.n, str: "" + i, font: args.font,
                color: Red,
            });
            for (let j = 0; j < this.n; j++) {
                if (this.A[i][j] !== undefined) {
                    this.R[j][i] = 0;
                    this.R[i][j] = this.A[i][j];  // R[i,j] + R[j,i] = cap(i,j)
                    this.redges[i][j] = new Edge(this.s, {  // residual, forward edge
                        x1: this.edges[i][j].x1, y1: this.edges[i][j].y1 + this.dy, size: 27,
                        x2: this.edges[i][j].x2, y2: this.edges[i][j].y2 + this.dy,
                        start: this.resStart + frames(this.dur) * i / this.m,
                        duration: 0.8, node_r: this.radius, directed: true, weight: this.A[i][j],
                        d: this.d,
                        color: this.fel,
                        txtColor: this.ftl,
                    });
                    this.redges[j][i] = new Edge(this.s, {  // flow, backward edge
                        x2: this.edges[i][j].x1, y2: this.edges[i][j].y1 + this.dy, size: 27,
                        x1: this.edges[i][j].x2, y1: this.edges[i][j].y2 + this.dy,
                        start: this.resStart + frames(this.dur) * i / this.m,
                        duration: 0.8, node_r: this.radius, directed: true, weight: 0,
                        d: this.d,
                        color: this.beu,
                        txtColor: this.btu,
                    });
                }
            }
        }
        this.rnodes[0].relabel("S");
        this.rnodes[this.n - 1].relabel("T");
        this.hl_time = 2.77;

        this.state = 1;  // corresponds to the step in the algorithm
        this.reset();
        this.tx.reset(0);
    }

    reset() {
        this.visits = []; // array that stores whether a vertex is in current path from S to T
        this.path = [];  // 2D array that stores the edges in path from S to T in residual graph
        this.visited = [];  // used for DFS
        for (let i = 0; i < this.n; i++) {
            this.visits[i] = i === this.n - 1;
            // ERROR LOG: forgot to set starting point as visited, took me 1+ hours to debug...
            this.visited[i] = i === 0;
        }
        this.min_w = 10000000;
        this.found = false;   // found a path from S to T
    }

    DFS(node, destination) {  // terminates when T is found
        let i;  // the node from the previous recursive call
        for (i = 0; i < this.n; i++) {
            if (this.R[node][i] > 0 && !this.visited[i]) {
                if (i === destination) {
                    this.rnodes[destination].highlight(Yellow, this.f / fr * this.hl_time, 9);
                    this.found = true;
                    break;
                }
                this.visited[i] = true;
                this.DFS(i, destination);
                if (this.found)
                    break;
            }
        }
        if (this.found) {
            if (this.min_w > this.R[node][i]) {
                this.min_w = this.R[node][i];
                this.min_e = [node, i];
            }
            this.visits[i] = true;
            this.path.push([node, i]);

            this.rnodes[node].highlight(Yellow, this.f / fr * this.hl_time, 9);
            this.redges[node][i].highlight([227, 197, 27], this.f / fr * this.hl_time, 14);
        }
    }

    show() {  // trace the algorithm
        this.tx.show();
        for (let i = this.n - 1; i >= 0; i--)
            for (let j = this.n - 1; j >= 0; j--)
                if (this.redges[i][j])
                    this.redges[i][j].show();
        for (let r of this.rnodes) r.show();

        if (!this.finished && this.s.frameCount % this.f === 0 && this.s.frameCount > this.begin) {
            if (this.state === 1) {
                this.DFS(0, this.n - 1);
                this.tx.reset(1);
                if (this.found === false)
                    this.finished = true;   // max flow achieved, terminate program

                this.state = 2;
            } else if (this.state === 2) {
                let x = this.min_e[0], y = this.min_e[1];
                this.redges[x][y].shake(24);
                this.tx.reset(2);

                this.state = 3;
            } else if (this.state === 3) {
                for (let i = 0; i < this.path.length; i++) {
                    let x = this.path[i][0], y = this.path[i][1];
                    if (this.A[x][y] !== undefined) {   // this is a forward edge
                        this.edges[x][y].reset(this.min_w, this.R[y][x] + this.min_w);
                    } else {   // this is a backward edge
                        this.edges[y][x].reset(-this.min_w, this.R[x][y] - this.min_w);
                    }
                }
                this.tx.reset(3);

                this.state = 4;
            } else if (this.state === 4) {
                for (let i = 0; i < this.path.length; i++) {
                    let x = this.path[i][0], y = this.path[i][1];

                    this.R[x][y] -= this.min_w;
                    this.redges[x][y].reset(this.R[x][y]);

                    this.R[y][x] += this.min_w;
                    this.redges[y][x].reset(this.R[y][x]);

                    let c = this.A[x][y];  // capacity
                    let r = this.R[x][y];  // new residual
                    let f = c - r;  // new flow (capacity - residual) = this.R[y][x]

                    if (this.A[x][y] === undefined) {   // this is a backward edge
                        if (r === this.min_w)  // forward edge fades out
                            this.redges[x][y].reColor(this.feu, this.ftu);
                        else if (r === 0)   // forward edge fades in
                            this.redges[x][y].reColor(this.fel, this.ftl);

                        if (f === this.min_w)  // backward edge fades out
                            this.redges[y][x].reColor(this.beu, this.btu);
                        else if (f === 0)   // backward edge fades in
                            this.redges[y][x].reColor(this.bel, this.btl);
                    } else {   // this is a forward edge
                        if (r === 0)  // forward edge fades out
                            this.redges[x][y].reColor(this.feu, this.ftu);
                        else if (r === this.min_w)   // forward edge fades in
                            this.redges[x][y].reColor(this.fel, this.ftl);

                        if (f === 0)  // backward edge fades out
                            this.redges[y][x].reColor(this.beu, this.btu);
                        else if (f === this.min_w)   // backward edge fades in
                            this.redges[y][x].reColor(this.bel, this.btl);
                    }
                }
                this.tx.reset(4);

                this.reset();
                this.state = 1;
            } else if (this.state === 5) {  // terminated
                this.finished = true;
            }
        }
        super.show();
    }
}

const Graph07 = function (s) {
    let t = {
        start: frames(1),
        resStart: frames(1),  // display residual graph
        txt: frames(2),
        trace: frames(3),
    };
    let tnr;
    s.preload = function () {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.g = new Graph_Flow(s, {
            V: G.V, E: G.E, font: tnr,
            color_v: Green,
            color_e: [7, 97, 7],
            start: t.start, begin: t.trace, resStart: t.resStart, time: t.txt,
        });
        s.d = new Dragger(s, [s.g.txt]);
    };
    s.draw = function () {
        s.background(0);
        s.g.show();
        //s.d.show();
    };
};

let p = new p5(Graph07);