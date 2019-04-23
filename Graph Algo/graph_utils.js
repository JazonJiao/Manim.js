/*** 2019-04-22
 * A graph that serves as the base class for classes that trace the graph algorithms
 *
 * V is an array of arrays, each entry consisting of 2 integer fields about the vertex:
 * [0] x-coord, [1] y-coord
 *
 * E is an array of arrays, each entry consisting of 2 to 4 integer fields about the edge:
 * [0] vertex-from, [1] vertex-to, [2] arc-radius, [3] weight
 * Among them, [2] is set to 0 if the edge is to be displayed as a straight line,
 * or a positive/negative number specifying the radius and orientation of the arc
 *
 * @mandatory (2D array) V, E, (p5.Font) font
 * @optional (number) radius [for nodes], duration [in seconds],
 *           yOffset [for adjusting location of the node number],
 */
class Graph extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.V = args.V;
        this.n = this.V.length;  // n - number of nodes
        this.E = args.E;
        this.m = this.E.length;  // m - number of edges

        this.A = [];   // adjacency list that stores the Edge objects
        // init adjacency list to all null, actual initialization deferred to subclasses
        for (let i = 0; i < this.n; i++) {
            this.A[i] = [];
            for (let j = 0; j < this.n; j++)
                this.A[i][j] = null;
        }

        this.dur = args.duration || 1.7;
        this.yOffset = args.yOffset === undefined ? -4 : args.yOffset;
        this.radius = args.radius || 57;  // node radius
        this.nodes = [];
        for (let i = 0; i < this.n; i++) {
            this.nodes[i] = new Node(this.s, {
                x: this.V[i][0], y: this.V[i][1], yOffset: this.yOffset, duration: 0.37,
                // display all nodes in this.dur seconds
                start: this.start + frames(this.dur) * i / this.n,
                str: "" + i, font: args.font,
            });
        }
    }
    show() {
        for (let n of this.nodes) n.show();

        for (let i = 0; i < this.n; i++)
            for (let j = 0; j < this.n; j++)
                if (this.A[i][j])
                    this.A[i][j].show();
    }
}

/*** 2019-04-23
 * --- args list ---
 * @mandatory (number) x, y, str, yOffset, (p5.Font) font [tnr]
 * @optional (number) r, start, end, duration, strokeweight,
 *           (array) color [for the ring], fill [for inside the circle]
 *
 */
class Node extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.r = args.r || 57;
        this.sw = args.strokeweight || 2;
        this.color = args.color || [255, 247, 7];
        this.fill = args.fill || [this.color[0] * 0.17, this.color[1] * 0.17, this.color[2] * 0.17];

        this.c = new Circle(this.s, {
            x: this.x, y: this.y, r: this.r, start: this.start, end: this.end,
            duration: this.duration, strokeweight: this.sw, color: this.color, fill: this.fill
        });

        this.txt = new TextFade(this.s, {
            x: this.x, y: this.y + args.yOffset,
            start: this.start, font: args.font, mode: 1, str: args.str,
        })
    }

    show() {
        this.c.show();
        this.txt.show();
    }
}


/***
 * Draws a straight line from one node to another
 * given the positions and radii of two nodes.
 * --- args list ---
 * x1, x2, y1, y2, start, (bool) directed
 */
class Edge_S extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.emp = new Line(this.s, {
            x1: args.x1, x2: args.x2,
        });

        this.r = args.r || 57;
        let dx = args.x2 - args.x1;
        let dy = args.y2 - args.y1;
        let len = Math.sqrt(dx * dx + dy * dy);
        this.x1 = args.x1 + dx * args.r / len * 0.5;
        this.x2 = args.x2 - dx * args.r / len * 0.54;
        this.y1 = args.y1 + dy * args.r / len * 0.5;
        this.y2 = args.y2 - dy * args.r / len * 0.54;

        this.c = args.color || Green;
        this.l = args.directed ? new Arrow(this.s, {
            x1: this.x1, x2: this.x2, y1: this.y1, y2: this.y2, start: args.start,
            duration: args.duration, color: this.c,
            tipAngle: 0.37, tipLen: 9
        }) : new Line(this.s, {
            x1: this.x1, x2: this.x2, y1: this.y1, y2: this.y2, start: args.start,
            duration: args.duration, color: this.c,
        });
    }

    show() {
        this.l.show();
    }
}



/**
 * Undirected Graph
 */
class Graph_U extends Graph {
    constructor(ctx, args) {
        super(ctx, args);
    }
}

/**
 * Directed Graph
 *
 */
class Graph_D extends Graph {
    constructor(ctx, args) {
        super(ctx, args);
        for (let i = 0; i < this.m; i++) {
            let x = this.E[i][0], y = this.E[i][1];  // two connecting nodes
            let r = this.E[i][2];
            let c = this.E[i][3];
            if (r) {  // needs an arc to show as the edge

            } else {  // needs a straight line to show as the edge
                this.A[x][y] = new Edge_S(this.s, {
                    x1: this.V[x][0], y1: this.V[x][1],
                    x2: this.V[y][0], y2: this.V[y][1],
                    start: this.start + frames(this.dur) * i / this.m, // fixme
                    duration: 0.8, r: this.radius, directed: true,
                });
            }
        }
    }
}