/*** 2019-04-22
 * A graph that serves as the base class for classes that trace the graph algorithms
 * The input must have no self-edges, duplicate edges, etc.
 *
 * V is an array of arrays, each entry consisting of 2 integer fields about the vertex:
 * [0] x-coord, [1] y-coord
 * The vertices are numbered based on the array index; array length will be the number of vertices.
 *
 * E is an array of arrays, each entry consisting of 2 to 4 integer fields about the edge:
 * [0] vertex-from, [1] vertex-to, [2] arc-radius, [3] weight
 * Among them, [2] is set to 0 if the edge is to be displayed as a straight line,
 * or a positive/negative number specifying the radius and orientation of the arc.
 * The ordering of these edges will be the sequence they're shown in the init animation.
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

        // value is undefined if no edge, true for unweighted graphs, a number for weighted graph
        this.A = [];   // 2D adjacency list;

        this.edges = [];  // stores the Edge objects
        // init adjacency list to all null, actual initialization deferred to subclasses
        for (let i = 0; i < this.n; i++) {
            this.A[i] = [];
            this.edges[i] = [];
        }
        this.dur = args.duration || 1.7;
        this.yOffset = args.yOffset === undefined ? -5 : args.yOffset;   // offset for node text
        this.radius = args.radius || 57;  // node radius

        this.nodes = [];  // stores Node objects
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
        // decrement to avoid the label being overwritten in undirected weighted graphs
        for (let i = this.n - 1; i >= 0; i--)
            for (let j = this.n - 1; j >= 0; j--)
                if (this.edges[i][j])
                    this.edges[i][j].show();

        for (let n of this.nodes) n.show();
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
        this.color = args.color || Blue;
        this.fill = args.fill || vector_multiply(this.color, 0.14);

        this.c = new Circle(this.s, {
            x: this.x, y: this.y, r: this.r, start: this.start, end: this.end,
            duration: this.duration, strokeweight: this.sw, color: this.color, fill: this.fill
        });

        this.txt = new TextFade(this.s, {
            x: this.x, y: this.y + args.yOffset, size: 42,
            start: this.start, font: args.font, mode: 1, str: args.str,
        })
    }

    highlight() {

    }

    change(newColor, duration) {
        this.c.shake(7, 0.8);
        this.txt.shake(7, 0.8);
        this.c.st.change(newColor, duration);
        this.c.ft.change(vector_multiply(newColor, 0.2), duration);
    }

    show() {
        this.c.show();
        this.txt.show();
    }
}

/*** 2019-04-23
 * Draws a line/arc from one node to another given the positions and radii of two nodes.
 * Could pass in a string str to add a label the edge in the middle, if so, pass in label: true.
 * If need an arc, pass in its radius as r.
 * r must be greater than half the distance of the two nodes.
 * It's show() needs to be called after nodes'.
 *
 * --- args list ---
 * @mandatory x1, x2, y1, y2, start, node_r, (bool) directed,
 * @optional r [arc radius], weight, (array) color, txtColor
 */
class Edge extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.node_r = args.node_r || 57;
        this.color = args.color || [127, 47, 147];
        this.txtColor = args.txtColor || [167, 236, 227];
        this.stroke = args.stroke || [0, 0, 0]; //[17, 47, 127];
        this.directed = args.directed;

        let dx = args.x2 - args.x1;
        let dy = args.y2 - args.y1;
        let len = Math.sqrt(dx * dx + dy * dy);

        if (args.r) {
            this.r = args.r;
            this.l = this.createLine();
        } else {
            this.lx1 = args.x1 + dx * this.node_r / len * 0.5;
            // 0.54, to account for the node's ring thickness
            this.lx2 = args.x2 - dx * this.node_r / len * 0.54;
            this.ly1 = args.y1 + dy * this.node_r / len * 0.5;
            this.ly2 = args.y2 - dy * this.node_r / len * 0.54;

            this.l = this.createLine();

            if (args.weight !== undefined) {
                this.str = "" + args.weight;
                this.txt = new TextFade(this.s, {
                    str: this.str, x: args.x1 + dx / 2, y: args.y1 + dy / 2, mode: 1,
                    start: args.start, color: this.txtColor,
                    stroke: [0, 0, 0],    // black stroke
                    strokeweight: 7, size: 29
                });
            }
        }
    }

    createLine(){
        return this.r ? null
            : (this.directed ? new Arrow(this.s, {
            x1: this.lx1, x2: this.lx2, y1: this.ly1, y2: this.ly2, start: this.start,
            duration: this.duration, color: this.color,
            tipAngle: 0.37, tipLen: 9
        }) : new Line(this.s, {
            x1: this.lx1, x2: this.lx2, y1: this.ly1, y2: this.ly2, start: this.start,
            duration: this.duration, color: this.color,
        }));
    }

    addEdge(color) {  // shows a line/arc growing on top of previous edge
        this.color = color;
        this.start = this.s.frameCount + 1;
        this.l2 = this.createLine();
    }

    change(newColor, duration) {
        this.l.colorTimer.change(newColor, duration);
    }

    highlight(color, duration, thickness) {
        this.hi = true;
        this.h_color = color || [255, 107, 17];
        this.h_dur = duration || 1;
        this.h_fr = frames(this.h_dur);
        this.thickness = thickness || 24;
        this.f = 0;
        this.h_timer = new Timer2(this.h_fr * 0.67);
        this.s_timer = new StrokeChanger(this.s, this.h_color);
    }

    highlighting() {
        if (this.f < this.h_fr) {
            this.f++;
            this.s_timer.advance();
            if (this.f === Math.floor(this.h_fr * 0.74)) {
                this.s_timer.fadeOut(this.h_dur * 0.27);
            }
            let t = this.h_timer.advance();
            this.s.line(this.x1, this.y1,
                this.x1 + t * (this.x2 - this.x1), this.y1 + t * (this.y2 - this.y1));
        } else
            this.hi = false;
    }

    show() {
        if (this.hi)
            this.highlighting();
        this.l.show();
        if (this.l2)
            this.l2.show();
        if (this.txt)
            this.txt.show();
    }
}

/**
 * Undirected Graph
 * Assumes that args.E go from small-index vertices to big-index vertices (actually doesn't matter)
 */
class Graph_U extends Graph {
    constructor(ctx, args) {
        super(ctx, args);
        for (let i = 0; i < this.m; i++) {
            let a = this.E[i][0], b = this.E[i][1];  // two connecting nodes
            let r = this.E[i][2], c = this.E[i][3];  // radius and cost
            if (c !== undefined)
                this.A[a][b] = this.A[b][a] = c;
            else
                this.A[a][b] = this.A[b][a] = true;

            this.edges[a][b] = new Edge(this.s, {
                x1: this.V[a][0], y1: this.V[a][1],
                x2: this.V[b][0], y2: this.V[b][1],
                start: this.start + frames(this.dur) * i / this.m, r: r,
                duration: 0.8, node_r: this.radius, directed: false, weight: c,
            });

            // for an undirected graph, set the converse of an input edge to another Edge object
            // they will be displayed at the same location as the other edge,
            // and start time is set to after all edges are displayed.
            // We do this so that edge highlight functionality works both ways
            this.edges[b][a] = new Edge(this.s, {
                x1: this.V[b][0], y1: this.V[b][1],
                x2: this.V[a][0], y2: this.V[a][1],
                start: this.start + frames(this.dur) + 1, r: r,
                duration: 0.8, node_r: this.radius, directed: false, label: false
            });
        }
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
            let a = this.E[i][0], b = this.E[i][1];  // two connecting nodes
            let r = this.E[i][2], c = this.E[i][3];  // radius and cost
            if (c !== undefined)
                this.A[a][b] = c;
            else
                this.A[a][b] = true;

            this.edges[a][b] = new Edge(this.s, {
                x1: this.V[a][0], y1: this.V[a][1],
                x2: this.V[b][0], y2: this.V[b][1],
                start: this.start + frames(this.dur) * i / this.m, r: r,
                duration: 0.8, node_r: this.radius, directed: true, weight: c,
            });
        }
    }
}