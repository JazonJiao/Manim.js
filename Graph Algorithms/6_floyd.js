let G = {
    V: [[120, 70],  // 1
        [440, 70],  // 2
        [280, 170],  // 3
        [120, 270],  // 4
        [440, 270],  // 5
    ],
    E: [[0, 2, 0, 3],
        [0, 3, 0, 7],
        [1, 0, 0, 4],
        [2, 1, 0, 5],
        [2, 3, 0, 1],
        [2, 4, 0, 8],
        [3, 4, 0, 9],
        [4, 1, 0, 6],
    ]
};

class Chart_Floyd extends Chart {
    constructor(ctx, args) {
        super(ctx, args);
        this.A = args.A;  // adjacency list
        this.edges = args.edges;  // needed for init animation
        this.path = [];   // text for the previous node
        this.startMove = Math.round(this.start + this.duration * 0.7);

        this.xp = 0.37;

        for (let i = 1; i < this.i; i++) {
            this.path[i] = [];
            for (let j = 1; j < this.j; j++) {
                this.grid[i][j] = this.A[i - 1][j - 1] === undefined ? new TextRoll(this.s, {
                    str: i === j ? "0" : "∞",
                    color: [77, 77, 77],
                    x: this.x + (i + this.xp) * this.w, y: this.y + (j + 0.42) * this.h, mode: 1,
                    font: args.font, size: 29,
                    start: this.start + (i + j) * this.duration / this.j,
                }) : new TextRoll(this.s, {       // move from edge label to chart
                    str: "" + this.A[i - 1][j - 1],
                    x: this.edges[i - 1][j - 1].x3, y: this.edges[i - 1][j - 1].y3, font: args.font,
                    size: 29, start: this.start, mode: 1,
                });
                this.path[i][j] = new TextRoll(this.s, {
                    str: "-",
                    x: this.x + (i + 0.9) * this.w, y: this.y + (j + 0.74) * this.h, mode: 1,
                    font: args.font, size: 19, color: Orange,
                    start: this.start + (i + j) * this.duration / this.j,
                });
            }
        }
        this.diag = new Line(this.s, {
            x1: this.x, y1: this.y, x2: this.x + this.w, y2: this.y + this.h,
            start: this.start + this.duration * 2 / this.j,
            strokeweight: this.sw, color: this.color,
        });

        this.txt = [];
        this.txt[0] = new TextFade(this.s, {
            x: this.x + 3, y: this.y + 24, start: this.start, str: "from", size: 21, color: Green
        });
        this.txt[1] = new TextFade(this.s, {
            x: this.x + 47, y: this.y, start: this.start, str: "to", size: 21, color: Blue
        });

        for (let i = 1; i < this.i; i++) {
            this.grid[i][0] = new TextFade(this.s, {
                str: "" + i,
                x: this.x + (0.5) * this.w, y: this.y + (i + 0.42) * this.h, mode: 1,
                font: args.font, size: 32, color: Green,
                start: this.start + i * this.duration / this.j,
            });
            this.grid[0][i] = new TextFade(this.s, {
                str: "" + i,
                x: this.x + (i + 0.5) * this.w, y: this.y + (0.42) * this.h, mode: 1,
                font: args.font, size: 32, color: Blue,
                start: this.start + i * this.duration / this.j,
            });
        }

    }

    reset(i, j, cost, path) {
        this.grid[i][j].roll(cost);
        this.path[i][j].roll(path);
    }

    show() {
        super.show();
        this.diag.show();
        for (let t of this.txt)
            t.show();

        if (this.s.frameCount === this.startMove)
            for (let i = 1; i < this.i; i++)
                for (let j = 1; j < this.j; j++)
                    if (this.A[i - 1][j - 1] !== undefined)
                        this.grid[i][j].move(this.x + (i + this.xp) * this.w,
                            this.y + (j + 0.42) * this.h, 1);

        for (let i = 1; i < this.i; i++)
            for (let j = 1; j < this.j; j++)
                this.path[i][j].show();
    }
}

class Graph_Floyd extends Graph_D {
    constructor(ctx, args) {
        super(ctx, args);

        this.z = new Tracer(this.s, {
            str: "Floyd's all-pair shortest path algorithm",
            x: 567, y: 67, size: 29, start: args.time, begin: args.begin,
        });
        this.z.add("Initialize label table", 0, 30, 45);   // step 0
        this.z.add("For i from 1 to number of nodes: ", 1, 30, 90);  // step 1
        this.z.add("For each pair of nodes j and k:", -1, 60, 135);
        //this.z.add("Compute Cost(j→i) and Cost(i→k)", 2, 90, 180);
        this.z.add("If Cost(j→i) + Cost(i→k) < Cost(j→k):", 2, 90, 180);   // step 2
        this.z.add("Update label table and", 3, 120, 225, false, White, 1);  // step 3
        this.z.add("source vertex", -1, 387, 225, false, Orange);
        this.z.add("If j == k and Cost(j→k) < 0 then", -1, 90, 270, 24, [117, 117, 117]);
        this.z.add("Graph contains negative-weight cycle,\n" +
            "shortest path undefined", 4, 120, 305, 24, [117, 117, 117]);  // step 4

        this.P = [];  // 2D array of paths (previous node in the best path)
        //this.C = [];  // 2D array of costs



        this.chart = new Chart_Floyd(this.s, {
            x: 100, y: 327, start: 70, h: 47,
            i: this.n + 1, j: this.n + 1, A: this.A, edges: this.edges, font: args.font,
        });

        for (let i = 0; i < this.n; i++)   // use 1-based indexing
            this.nodes[i].relabel("" + (i + 1));

        this.state = 1;
        this.i = 0;
        this.j = 0;
        this.k = 0;
    }
    show() {
        super.show();
        this.z.show();
        this.chart.show();

        if (!this.finished && this.s.frameCount % this.f === 0 && this.s.frameCount > this.begin) {

        }
    }
}

const Graph06 = function (s) {
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
        s.g = new Graph_Floyd(s, {
            V: G.V, E: G.E, font: tnr,
            start: t.start, begin: t.trace, time: t.txt,
        });
        //s.d = new Dragger(s, [s.g.txt]);
    };
    s.draw = function () {
        s.background(0);
        s.g.show();
        //s.d.show();
    };
};

let p = new p5(Graph06);