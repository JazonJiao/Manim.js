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
 * @optional (number) radius [for nodes], duration [in seconds], begin,
 *           yOffset [for adjusting location of the node number],
 *           (array) color_v, color_e
 */
class Graph extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.f = 47;   // how many frames for advancing one step of the algorithm
        this.begin = args.begin || 100;

        // variables used to keep track of the algorithm's progress
        this.finished = false;

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
                str: "" + i, font: args.font, color: args.color_v,
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

    relabel(txt) {
        this.txt.reset({ str: txt });
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

/*** 2019-04-23, 04-24
 * Draws a line/arc from one node to another given the positions and radii of two nodes.
 * Could pass in a string str to add a label the edge in the middle, if so, pass in label: true.
 * If need an arc, pass in the distance from the midpoint to the arc as d.
 * d should not be greater than half the distance between the two nodes.
 * It's show() needs to be called after nodes'.  // todo: negative d
 *
 * --- args list ---
 * @mandatory x1, x2, y1, y2, start, node_r, (bool) directed,
 * @optional d [arc curvature], weight, x3, y3 [text coordinates]; (array) color, txtColor
 */
class Edge extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.node_r = args.node_r || 57;
        this.color = args.color || [97, 7, 117];
        this.txtColor = args.txtColor || [167, 236, 227];
        this.stroke = args.stroke || [0, 0, 0]; //[17, 47, 127];
        this.directed = args.directed;
        if (this.directed)
            this.tipLen = 12;

        let dx = args.x2 - args.x1;
        let dy = args.y2 - args.y1;
        let xm = this.x1 + dx / 2, ym = this.y1 + dy / 2;
        let len = Math.sqrt(dx * dx + dy * dy);

        if (args.d) {  // needs an arc
            this.d = args.d;
            // this.y1 = cvh - this.y1;
            // this.y2 = cvh - this.y2;

            // calculate center of arc, also will be where the text lies
            this.x3 = xm - dy * this.d / len;
            this.y3 = ym + dx * this.d / len;

            // calculate the centroid of the arc
            // (intersection of perpendicular bisectors for 1,3 and 2,3)
            let p1 = this.getPB(this.x1, this.y1, this.x3, this.y3);
            let p2 = this.getPB(this.x2, this.y2, this.x3, this.y3);
            let a1 = p1[0], b1 = p1[1], c1 = p1[2], a2 = p2[0], b2 = p2[1], c2 = p2[2];
            let det = a1 * b2 - b1 * a2;
            this.xc = (c1 * b2 - b1 * c2) / det;  // 2d Cramer's Rule
            this.yc = (a1 * c2 - c1 * a2) / det;

            // calculate the radius of the arc
            let x1d = this.x1 - this.xc, y1d = this.y1 - this.yc;
            this.r = Math.sqrt(x1d * x1d + y1d * y1d);

            // calculate start and end angles
            this.a1 = Math.atan2(y1d, x1d);  // NOTICE: acos does NOT work here!!!
            let x2d = this.x2 - this.xc, y2d = this.y2 - this.yc;
            this.a2 = Math.atan2(y2d, x2d);
            if (this.a2 > this.a1) {   // don't yet know why I need to do this
                this.a1 += this.s.TWO_PI;
            }

            // start and end angles, after "subtracting" the radius of two nodes from the curve
            let half_a = Math.asin(this.node_r / 2 / this.r) * 1.07;  // guaranteed in [0, PI/4]
            this.la1 = this.a1 - half_a;  // it's supposed to be +, but p5 has a weird coord system
            this.la2 = this.a2 + half_a;  // it's supposed to be - ...

            //console.log(this.la1, this.la2);

            this.l = this.createLine();

        } else {
            // the coordinates for line segment; it's shorter than the distance between node centers
            this.lx1 = args.x1 + dx * this.node_r / len * 0.5;
            // 0.54, to account for the node's ring thickness
            this.lx2 = args.x2 - dx * this.node_r / len * 0.54;
            this.ly1 = args.y1 + dy * this.node_r / len * 0.5;
            this.ly2 = args.y2 - dy * this.node_r / len * 0.54;

            this.l = this.createLine();
            this.x3 = args.x3 || xm;
            this.y3 = args.y3 || ym;
        }
        // add label
        if (args.weight !== undefined) {
            this.str = "" + args.weight;
            this.txt = new TextFade(this.s, {
                str: this.str, x: this.x3, y: this.y3, mode: 1,
                start: args.start, color: this.txtColor,
                stroke: [0, 0, 0],    // black stroke
                strokeweight: 7, size: 29
            });
        }
    }

    // calculates perpendicular bisector, returns [a, b, c] for line ax + by = c
    getPB(x1, y1, x2, y2) {
        let a = x1 - x2;  // a = -dx
        let b = y1 - y2;  // b = -dy
        let xm = x1 - a / 2, ym = y1 - b / 2;  // midpoint
        return [a, b, a * xm + b * ym];
    }

    createLine(){
        return this.r ? (this.directed ? new ArcArrow(this.s, {   // arc directed
            r: this.r, x: this.xc, y: this.yc, a1: this.la1, a2: this.la2,
            start: this.start, duration: this.duration, color: this.color, tipLen: this.tipLen
        }) : new Arc(this.s, {  // arc undirected
            r: this.r, x: this.xc, y: this.yc, a1: this.la1, a2: this.la2,
            start: this.start, duration: this.duration, color: this.color,
        })) : (this.directed ? new Arrow(this.s, {  // straight directed
            x1: this.lx1, x2: this.lx2, y1: this.ly1, y2: this.ly2, start: this.start,
            duration: this.duration, color: this.color,
            tipAngle: 0.37, tipLen: this.tipLen,
        }) : new Line(this.s, {  // straight undirected
            x1: this.lx1, x2: this.lx2, y1: this.ly1, y2: this.ly2, start: this.start,
            duration: this.duration, color: this.color,
        }));
    }

    addEdge(color) {  // shows a line/arc growing on top of previous edge
        this.color = color;
        this.start = this.s.frameCount + 1;
        this.l2 = this.createLine();
    }

    shake(amp) {  // shake the text
        this.txt.shake(amp, 0.9);
    }

    change(newColor, duration) {
        this.l.colorTimer.change(newColor, duration);
    }

    highlight(color, duration, thickness) {
        this.hi = true;
        this.h_color = color || [255, 67, 7];
        this.h_dur = duration || 1;
        this.h_fr = frames(this.h_dur);
        this.thickness = thickness || 14;
        this.f = 0;
        this.h_timer = new Timer2(this.h_fr * 0.67);
        this.s_timer = new StrokeChanger(this.s, this.h_color);
    }

    highlighting() {
        if (this.f < this.h_fr) {
            this.f++;
            this.s_timer.advance();
            this.s.strokeWeight(this.thickness);
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
            let d = this.E[i][2], c = this.E[i][3];  // radius and cost
            if (c !== undefined)
                this.A[a][b] = this.A[b][a] = c;
            else
                this.A[a][b] = this.A[b][a] = true;

            this.edges[a][b] = new Edge(this.s, {
                x1: this.V[a][0], y1: this.V[a][1],
                x2: this.V[b][0], y2: this.V[b][1],
                start: this.start + frames(this.dur) * i / this.m, d: d, color: args.color_e,
                duration: 0.8, node_r: this.radius, directed: false, weight: c,
            });

            // for an undirected graph, set the converse of an input edge to another Edge object
            // they will be displayed at the same location as the other edge,
            // and start time is set to after all edges are displayed.
            // We do this so that edge highlight functionality works both ways
            this.edges[b][a] = new Edge(this.s, {
                x1: this.V[b][0], y1: this.V[b][1],
                x2: this.V[a][0], y2: this.V[a][1], color: args.color_e,
                start: this.start + frames(this.dur) + 1, d: -d,  // notice d is inverted
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
            let d = this.E[i][2], c = this.E[i][3];  // radius and cost
            if (c !== undefined)
                this.A[a][b] = c;
            else
                this.A[a][b] = true;

            this.edges[a][b] = new Edge(this.s, {
                x1: this.V[a][0], y1: this.V[a][1],
                x2: this.V[b][0], y2: this.V[b][1],
                start: this.start + frames(this.dur) * i / this.m, d: d, color: args.color_e,
                duration: 0.8, node_r: this.radius, directed: true, weight: c,
            });
        }
    }
}