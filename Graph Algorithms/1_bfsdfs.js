let EU =    // pool of undirected edges
    [[0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 6],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 7],
    [2, 3],
    [2, 5],
    [2, 6],
    [2, 7],
    [2, 9],
    [3, 4],
    [3, 5],
    [3, 6],
    [3, 7],
    [3, 8],
    [3, 10],
    [4, 6],
    [4, 7],
    [4, 8],
    [4, 11],
    [5, 6],
    [5, 9],
    [5, 10],
    [5, 12],
    [6, 7],
    [6, 9],
    [6, 10],
    [6, 13],
    [7, 8],
    [7, 9],
    [7, 10],
    [7, 11],
    [7, 14],
    [8, 10],
    [8, 11],
    [8, 15],
    [9, 10],
    [9, 12],
    [9, 13],
    [9, 14],
    [9, 16],
    [10, 11],
    [10, 12],
    [10, 13],
    [10, 14],
    [10, 15],
    [10, 17],
    [11, 13],
    [11, 14],
    [11, 15],
    [11, 18],
    [12, 13],
    [12, 16],
    [12, 17],
    [13, 14],
    [13, 16],
    [13, 17],
    [13, 18],
    [14, 15],
    [14, 16],
    [14, 17],
    [14, 18],
    [15, 17],
    [15, 18],
    [16, 17],
    [17, 18]
];

let G = {
    V: [[240, 77],
        [360, 77],
        [180, 177],
        [300, 177],
        [420, 177],
        [120, 277],
        [240, 277],
        [360, 277],
        [480, 277],
        [180, 377],
        [300, 377],
        [420, 377],
        [120, 477],
        [240, 477],
        [360, 477],
        [480, 477],
        [180, 577],
        [300, 577],
        [420, 577],
    ],
    E: randomizeEdges(EU, 0.47)
};


class Graph_DFS extends Graph_U {
    constructor(ctx, args) {
        super(ctx, args);

        this.visited = [];  // used for DFS
        for (let i = 0; i < this.n; i++)
            this.visited[i] = false;
        this.stack = [0];  // used for DFS
        this.aim = [1];    // used for DFS
        this.top = 0;    // used for DFS, equal to size - 1

        this.z = new Tracer(this.s, {
            str: "Depth-first search",
            x: 617, y: 57, start: args.time, begin: args.begin,
        });
        this.z.add("Create a queue, and enqueue start vertex", 0, 35, 45);
        this.z.add("While queue is not empty, do:", -1, 35, 90);
        this.z.add("Dequeue a vertex from queue", 1, 70, 135);
        this.z.add("Add its unvisited neighbors to queue", 2, 70, 180);
        this.z.add("End", 3, 35, 225);

        this.f = 47;
        this.state = 0;
    }

    DFS() {   // adapted from 5_topsort.js
        let hlc = Orange;
        let nhr = 12;  // node highlight radius
        let ehr = 14;  // edge highlight radius

        if (! this.visited[0]) {  // starting point
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
                if (! this.visited[aim]) {  // visit this node
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

const Graph00 = function(s) {
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

//------ BFS, 2019-05-07 ------

class Graph_BFS extends Graph_U {
    constructor(ctx, args) {
        super(ctx, args);

        this.visited = [];
        this.queue = [0];
        this.top = 0;     // bfs number
        this.bottom = 0;  // queue's start index

        for (let i = 0; i < this.n; i++) {
            this.nodes[i].txt.str = " ";  // reset text
            this.visited[i] = i === 0;
        }

        this.z = new Tracer(this.s, {
            str: "Breadth-first search",
            x: 617, y: 57, start: args.time, begin: args.begin,
        });
        this.z.add("Create a queue, and enqueue start vertex", 0, 35, 45);
        this.z.add("While queue is not empty, do:", -1, 35, 90);
        this.z.add("Dequeue a vertex from queue", 1, 70, 135);
        this.z.add("Add its unvisited neighbors to queue", 2, 70, 180);
        this.z.add("End", 3, 35, 225);

        this.state = 0;
        this.f = 47;
        this.fc = 0;   // frame count for this class
    }

    resetNode(v, to) {  // to stands for time offset
        v.txt = new TextFade(this.s, {
            x: v.x, y: v.y + this.yOffset,
            size: 42, start: this.s.frameCount + to, mode: 1, str: "" + this.top,
        });
    }

    show() {
        super.show();
        this.z.show();
        this.fc++;

        if (!this.finished && this.fc % this.f === 0 && this.fc > this.begin) {
            if (this.state === 0) {  // initial state
                this.z.reset(0);
                this.resetNode(this.nodes[0], 1);
                this.nodes[0].reColor(Yellow);

                this.state = 1;
            } else if (this.state === 1) {  // dequeue a vertex (highlight it)
                this.z.reset(1);
                let node = this.queue[this.bottom];

                this.nodes[node].highlight(Orange, this.f / fr * 2, 17);

                this.state = 2;
            } else if (this.state === 2) {  // add unvisited neighbors to queue
                this.z.reset(2);
                let node = this.queue[this.bottom];
                this.bottom++;
                this.nodes[node].reColor(Green, false, [77, 147, 117, 248]);

                let to = 1;
                for (let i = 0; i < this.n; i++)
                    if (this.A[node][i] && !this.visited[i]) {
                        this.top++;
                        this.queue[this.top] = i;
                        this.visited[i] = true;
                        this.edges[node][i].highlight(Orange, this.f / fr);
                        this.resetNode(this.nodes[i], to);
                        to += 4;
                        this.nodes[i].reColor(Yellow);
                    }

                if (this.bottom > this.top) {  // queue is empty now
                    let flag = false;  // whether there are unvisited vertices left
                    for (let i = 0; i < this.n; i++)
                        if (!this.visited[i])
                            flag = true;
                    this.state = flag ? 4 : 3;  // flag is true, then not finished
                    return;
                }
                this.state = 1;
            } else if (this.state === 3) {  // finished
                this.z.reset(3);
                this.nodes[this.queue[this.bottom - 1]].reColor(Green);

                this.finished = true;
            } else if (this.state === 4) {  // start BFS at a new vertex; intermediate step
                this.z.reset(0);
                for (let i = 0; i < this.n; i++)
                    if (!this.visited[i]) {
                        this.top++;
                        this.queue[this.top] = i;
                        this.visited[i] = true;
                        this.resetNode(this.nodes[i], 1);
                        this.nodes[i].reColor(Yellow);
                        break;
                    }
                this.state = 1;
            }
        }
    }
}

const Graph01 = function(s) {
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
        s.g = new Graph_BFS(s, {
            V: G.V, E: G.E, font: tnr,
            start: t.start, begin: t.trace, time: t.txt,
            color_e: [7, 97, 7], //color_v: [],
        });
    };
    s.draw = function () {
        s.background(0);
        s.g.show();
    };
};

let p = new p5(Graph00);