let G = {
    V: [[300, 100],
        [200, 200],
        [300, 300],
        [400, 200],
    ],
    E: [[0, 1],
        [0, 2],
        [2, 3],
    ]
};


class Graph_DFS extends Graph_D {
    constructor(ctx, args) {
        super(ctx, args);
        this.visited = [];
        this.stack = [];
    }

    stepDFS() {

    }
}

const Graph00 = function(s) {
    let t = {

    };
    let tnr;
    s.preload = function() {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.g = new Graph_DFS(s, {
            V: G.V, E: G.E, font: tnr
        });
        s.d = new Dragger(s, []);
    };
    s.draw = function () {
        s.background(0);
        s.g.show();
        //s.d.show();
    };
};



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
            x: 537, y: 57, start: args.time, begin: args.begin,
        });
        this.z.add("Create a queue, and enqueue start vertex", 0, 35, 45);
        this.z.add("While queue is not empty, do:", -1, 35, 90);
        this.z.add("Dequeue a vertex from queue", 1, 70, 135);
        this.z.add("Add its unvisited neighbors to queue", 2, 70, 180);
        this.z.add("End", 3, 35, 225);

        this.state = 0;
        this.fc = 0;   // frame count for this class
    }

    stepBFS() {

    }

    resetNode(v) {
        v.txt = new TextFade(this.s, {
            x: v.x, y: v.y + this.yOffset,
            size: 42, start: this.s.frameCount + 1, mode: 1, str: "" + this.top,
        });
    }

    show() {
        super.show();
        this.z.show();
        this.fc++;

        if (!this.finished && this.fc % this.f === 0 && this.fc > this.begin) {
            if (this.state === 0) {  // initial state
                this.z.reset(0);
                this.resetNode(this.nodes[0]);
                this.nodes[0].reColor(Yellow);

                this.state = 1;
            } else if (this.state === 1) {  // dequeue a vertex (highlight it)
                this.z.reset(1);
                this.bottom++;
                let node = this.queue[this.bottom - 1];

                if (this.bottom === this.n) {
                    this.state = 3;
                }
                let flag = false;  // highlight the node for 1 or 2 seconds
                for (let i = 0; i < this.n; i++) {
                    if (this.A[node][i] && !this.visited[i]) {
                        flag = true;
                        this.state = 2;  // if there is a unvisited node nearby, go to state 2
                    }
                }
                this.nodes[node].highlight(Orange, this.f / fr * (flag ? 2 : 1), 14);

            } else if (this.state === 2) {  // add unvisited neighbors to queue
                this.z.reset(2);
                let node = this.queue[this.bottom - 1];
                this.nodes[node].reColor(Green);

                for (let i = 0; i < this.n; i++)
                    if (this.A[node][i] && !this.visited[i]) {
                        this.top++;
                        this.queue[this.top] = i;
                        this.visited[i] = true;
                        this.edges[node][i].highlight(Orange, this.f / fr);
                        this.resetNode(this.nodes[i]);
                        this.nodes[i].reColor(Yellow);
                    }
                this.state = 1;
            } else {
                this.z.reset(3);
                this.finished = true;
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

let p = new p5(Graph01);