let G = {
    V: [
        [120, 70],  // S (0)
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

class Label_04 extends PointBase {  // shows an edge's flow | capacity
    constructor(ctx, args) {
        super(ctx, args);
        this.flow = new TextFade(this.s, {
            str: "0", x: this.x - 10, y: this.y, mode: 4, start: args.start, color: [177, 255, 237],
            stroke: [0, 0, 0], strokeweight: 7, size: 29
        });
        this.cap = new TextFade(this.s, {
            x: this.x - 2, y: this.y, mode: 3, start: args.start, color: [255, 237, 177],
            str: "| " + args.cap, stroke: [0, 0, 0], strokeweight: 7, size: 29
        });
    }
    reset(addedFlow, newFlow) {
        console.log(addedFlow);
        this.resetted = true;
        this.f = 0;
        let sign = addedFlow > 0;
        this.txt = new TextFade(this.s, {
            str: (sign ? "+" : "-") + addedFlow,
            x: this.x - 17, y: this.y, mode: 1, color: sign ? [255, 255, 57] : [57, 127, 255],
            size: 24, start: this.s.frameCount + 1,
            duration: 0.4, end: this.s.frameCount + frames(0.6),
        });
        this.txt.shift(0, 54 * (sign ? -1 : 1), 1, 1);
        this.flow.reset({ str: "" + newFlow });
        this.flow.jump(17);
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

class Edge_04 extends Edge {  // override Edge so that
    constructor(ctx, args) {
        super(ctx, args);
        this.txt = new Label_04(this.s, {
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
            let d = this.E[i][2], c = this.E[i][3];  // radius and cost
            this.A[a][b] = c;
            this.edges[a][b] = new Edge_04(this.s, {
                x1: this.V[a][0], y1: this.V[a][1], x2: this.V[b][0], y2: this.V[b][1],
                start: this.start + frames(this.dur) * i / this.m, d: d, color: args.color_e,
                duration: 0.8, node_r: this.radius, directed: true, weight: c,
            });
        }

        this.txt = [];
        this.txt[0] = new TextWriteIn(this.s, {
            str: "Ford's Algorithm for Max Flow", color: Yellow,
            x: 517, y: 77, size: 29, start: args.time[0],
        });
        this.txt[1] = new TextWriteIn(this.s, {
            str: "Construct the Residual Graph",
            x: 557, y: 127, size: 29, start: args.time[1],
        });
        this.txt[2] = new TextWriteIn(this.s, {
            str: "Repeat: ",
            x: 557, y: 177, size: 29, start: args.time[2],
        });
        this.txt[3] = new TextWriteIn(this.s, {
            str: "1. Find a path from S to T in Residual Graph",
            x: 597, y: 227, size: 29, start: args.time[3],
        });
        this.txt[4] = new TextWriteIn(this.s, {
            str: "2. Find the smallest-weight edge in the path",
            x: 597, y: 277, size: 29, start: args.time[4],
        });
        this.txt[5] = new TextWriteIn(this.s, {
            str: "3. Add this amount of flow to the network\n",
            x: 597, y: 327, size: 29, start: args.time[5],
        });
        this.txt[6] = new TextWriteIn(this.s, {
            str: "Forward edge: ",
            x: 627, y: 377, size: 24, start: args.time[5], color: Blue,
        });
        this.txt[7] = new TextWriteIn(this.s, {
            str: "increase flow of corresponding edge",
            x: 777, y: 377, size: 24, start: args.time[5],
        });
        this.txt[8] = new TextWriteIn(this.s, {
            str: "Backward edge: ",
            x: 627, y: 417, size: 24, start: args.time[5], color: Orange,
        });
        this.txt[9] = new TextWriteIn(this.s, {
            str: "decrease flow of corresponding edge",
            x: 793, y: 417, size: 24, start: args.time[5],
        });
        this.txt[10] = new TextWriteIn(this.s, {
            str: "4. Update Residual Graph\n",
            x: 597, y: 467, size: 29, start: args.time[5],
        });
        this.txt[11] = new TextWriteIn(this.s, {
            str: "End if T is unreachable from S in Residual Graph",
            x: 557, y: 517, size: 29, start: args.time[6],
        });

        this.arr = new Arrow(this.s, {
            x1: 597, y1: 140, x2: 637, y2: 140, tipLen: 10, color: Orange, start: args.begin,
        });

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

        this.feu = [0, 7, 37];  // color for forward edge unlit
        this.fel = [17, 97, 197];  // color for forward edge lit
        this.beu = [37, 17, 0];  // color for backward edge unlit
        this.bel = [177, 127, 17];

        this.ftu = [7, 27, 77];
        this.ftl = [177, 236, 255];
        this.btu = [67, 37, 7];
        this.btl = [255, 236, 177];

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
                        x1: this.edges[i][j].x1, y1: this.edges[i][j].y1 + this.dy,
                        x2: this.edges[i][j].x2, y2: this.edges[i][j].y2 + this.dy,
                        start: this.resStart + frames(this.dur) * i / this.m,
                        duration: 0.8, node_r: this.radius, directed: true, weight: this.A[i][j],
                        d: this.d,
                        color: this.fel,
                        txtColor: this.ftl,
                    });
                    this.redges[j][i] = new Edge(this.s, {  // flow, backward edge
                        x2: this.edges[i][j].x1, y2: this.edges[i][j].y1 + this.dy,
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

        this.state = 1;  // corresponds to the step in the algorithm
        this.reset();
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
                    this.rnodes[destination].highlight();
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

            this.rnodes[node].highlight(); //(Yellow, this.f / fr * 3.77, 12);
            this.redges[node][i].highlight(); //(Yellow, this.f / fr * 3.9, 12);
        }
    }

    show() {
        super.show();
        for (let t of this.txt) t.show();
        for (let i = this.n - 1; i >= 0; i--)
            for (let j = this.n - 1; j >= 0; j--)
                if (this.redges[i][j])
                    this.redges[i][j].show();
        for (let r of this.rnodes) r.show();

        if (! this.finished && this.s.frameCount % this.f === 0 && this.s.frameCount > this.begin) {
            if (this.state === 1) {
                this.DFS(0, this.n - 1);
                if (this.found === false)
                    this.state = 5;   // max flow achieved, terminate program
                this.reset();

                this.state = 2;
            } else if (this.state === 2) {
                let x = this.min_e[0], y = this.min_e[1];
                this.redges[x][y].shake(24);

                this.state = 3;
            } else if (this.state === 3) {
                for (let i = 0; i < this.path.length; i++) {
                    let x = this.path[i][0], y = this.path[i][1];
                    this.edges[x][y].reset(this.min_w, this.R[y][x] + this.min_w);
                }
                this.state = 4;
            } else if (this.state === 4) {
                for (let i = 0; i < this.path.length; i++) {
                    let x = this.path[i][0], y = this.path[i][1];
                    this.R[y][x] += this.min_w;
                    this.redges[y][x].change(this.bel);

                    this.R[x][y] -= this.min_w;
                }
                this.state = 1;
            } else if (this.state === 5) {

            }
        }
    }
}

const Graph04 = function (s) {
    let t = {
        start: frames(1),
        resStart: frames(1),  // display residual graph
        txt: [frames(5), frames(8), frames(10), frames(12), frames(15), frames(17), frames(19)],
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
            start: t.start, resStart: t.resStart, time: t.txt,
        });
        s.d = new Dragger(s, [s.g.txt]);
        // s.a = new Arc(s, {
        //     a1: 0, a2: -2, x: 322, y: 332, r: 32
        // })
    };
    s.draw = function () {
        s.background(0);
        s.g.show();
        //s.d.show();
    };
};

let p = new p5(Graph04);