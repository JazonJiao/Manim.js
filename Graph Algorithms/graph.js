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
 *           (str) label [if passed in, then node has bigger radius and a label on bottom-right]
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
        this.radius = args.radius || (args.label ? 67 : 57);  // node radius

        this.nodes = [];  // stores Node objects
        for (let i = 0; i < this.n; i++) {
            this.nodes[i] = args.label ? new NodeLabel(this.s, {
                x: this.V[i][0], y: this.V[i][1], yOffset: this.yOffset, duration: 0.37,
                start: this.start + frames(this.dur) * i / this.n, size: args.size || 37,
                str: "" + i, font: args.font, color: args.color_v, r: this.radius,
                label: args.label
            }) : new Node(this.s, {
                x: this.V[i][0], y: this.V[i][1], yOffset: this.yOffset, duration: 0.37,
                // display all nodes in this.dur seconds
                start: this.start + frames(this.dur) * i / this.n, size: args.size || 42,
                str: "" + i, font: args.font, color: args.color_v, r: this.radius,
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
 * @mandatory (number) x, y, str, (p5.Font) font [tnr]
 * @optional (number) r, start, end, duration, strokeweight, size, yOffset,
 *           (array) color [for the ring], fill [for inside the circle]
 *
 */
class Node extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.r = args.r || 57;
        this.sw = args.strokeweight || 2;
        this.color = args.color || Blue;
        this.yOffset = args.yOffset || -4;
        this.fill = args.fill || vector_multiply(this.color, 0.14);

        this.c = new Circle(this.s, {
            x: this.x, y: this.y, r: this.r, start: this.start, end: this.end,
            duration: this.duration, strokeweight: this.sw, color: this.color, fill: this.fill
        });

        this.txt = new TextFade(this.s, {
            x: this.x, y: this.y + this.yOffset, size: args.size || 42,
            start: this.start, font: args.font, mode: 1, str: args.str,
        })
    }

    move(x, y, dur, timerNum) {
        this.c.move(x, y, dur, timerNum);
        this.txt.move(x, y, dur, timerNum);
    }

    relabel(txt) {
        this.txt.reset({ str: txt });
    }

    /**
     * If time for highlight is unknown, could pass in 1e5 as @param duration and
     * call dehighlight() later on
     *
     * There seems to be a bug that duration = 1 causes error. Try setting duration to be >= 1.7
     * disableGrow - disable the arc grow animation, only grow the highlight radius
     */
    highlight(color, duration, thickness, disableGrow) {
        this.dis = !!disableGrow;  // fancy JavaScript syntax, == disableGrow ? true : false
        this.hi = true;
        this.h_color = color || [255, 67, 7];
        this.h_dur = duration || 1;
        this.h_fr = frames(this.h_dur);
        this.thickness = thickness || 17;
        this.f = 0;
        this.h_timer = new Timer1(frames(0.67));
        this.s_timer = new FillChanger(this.s, this.h_color);
    }

    dehighlight() {
        this.h_fr = this.f + frames(1);
    }

    highlighting() {
        if (this.f < this.h_fr) {
            this.f++;
            this.s.noStroke();
            this.s_timer.advance();
            if (this.f === this.h_fr - frames(0.27)) {
                this.s_timer.fadeOut(0.27);  // fade out .27 seconds before duration ends
            }
            let t = this.h_timer.advance();
            let r = this.r + this.thickness * t;
            if (this.dis) {
                this.s.ellipse(this.x, this.y,
                    this.r + this.thickness * t, this.r + this.thickness * t);
            } else     // refined animation on 05/14
                this.s.arc(this.x, this.y, r, r,
                    -this.s.PI + t * this.s.HALF_PI, -this.s.PI + t * this.s.TWO_PI * 1.2499);
        } else
            this.hi = false;
    }

    /**
     * NOTICE: If this does not work correctly, it's usually because color array should have
     * 4 entries!!
     */
    reColor(ringColor, fillColor, txtColor, duration) {
        // this.c.shake(7, 0.8);
        // this.txt.shake(7, 0.8);
        this.c.st.reColor(ringColor, duration);
        this.c.ft.reColor(fillColor ? fillColor : vector_multiply(ringColor, 0.2), duration);
        if (txtColor) {
            this.txt.ft.reColor(txtColor, duration);
        }
    }

    show() {
        if (this.hi)
            this.highlighting();
        this.c.show();
        this.txt.show();
    }
}

// extra param: label, labelColor
class NodeLabel extends Node {
    constructor(ctx, args) {
        super(ctx, args);
        this.txt.reset({   // if it's a two digit number, txt needs to be smaller
            x: this.x - 12, y: this.y - 14, size: args.str.length === 2 ? 37 : 42  // fixme
        });
        let m = 0.24;
        this.labelColor = args.labelColor || [255, 247, 77];
        this.lin = new Line(this.s, {
            x1: this.x - this.r * m, y1: this.y + this.r * m,
            x2: this.x + this.r * m, y2: this.y - this.r * m,
            strokeweight: 1, start: args.start, color: [177, 177, 177]
        });
        this.label = new TextFade(this.s, {
            str: args.label, mode: 1, x: this.x + 10, y: this.y + 10, start: args.start,
            color: this.labelColor, size: 24
        });
    }

    reColor(ringColor, fillColor, txtColor, labelColor, lineColor, duration) {
        super.reColor(ringColor, fillColor, txtColor, duration);
        if (labelColor)
            this.label.ft.reColor(labelColor, duration);
        if (lineColor)
            this.lin.st.reColor(lineColor, duration);
    }

    reset(cost, down) {  // display reset animations, 2nd param specify direction (default shift up)
        this.resetted = true;
        this.f = 0;
        this.duration = 1;
        this.labelN = new TextFade(this.s, {
            str: "" + cost, mode: 1, x: this.x + 10,
            y: down ? this.y - 20 : this.y + 40, start: this.s.frameCount + 1,
            color: this.labelColor, size: 24
        });
        this.label.ft.fadeOut(0.7);
        let d = down ? 1 : -1;
        this.label.shift(0, 30 * d, 1, 1);
        this.labelN.shift(0, 30 * d, 1, 1);
    }

    resetting() {
        if (this.f <= this.duration * fr) {
            this.f++;
            this.labelN.show();
        } else {
            this.resetted = false;
            this.label = this.labelN;
            this.labelN = null;
        }
    }

    show() {
        super.show();
        this.lin.show();
        if (this.resetted)
            this.resetting();
        this.label.show();
    }
}

/*** 2019-04-23, 04-24, 05-09
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
        this.size = args.size || 29;
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
            if (this.a2 < this.a1 && this.d < 0) {
                this.a2 += this.s.TWO_PI;
            } else if (this.a2 > this.a1 && this.d > 0) {   // don't yet know why I need to do this
                this.a1 += this.s.TWO_PI;
            }

            // start and end angles, after "subtracting" the radius of two nodes from the curve
            let half_a = Math.asin(this.node_r / 2 / this.r) * 1.14;  // guaranteed in [0, PI/4]
            if (this.d > 0) {
                this.la1 = this.a1 - half_a;  // supposed to be +, but p5 has a weird coord system
                this.la2 = this.a2 + half_a;  // it's supposed to be - ...
            } else {  // 05-09: handle negative d
                this.la1 = this.a1 + half_a;
                this.la2 = this.a2 - half_a;
            }

            this.l = this.createLine();

            this.numPts = 27;   // this is used for highlighting, code copied from Arc class
            this.pts = [];
            let a = this.a1;
            let da = (this.a2 - this.a1) / (this.numPts - 1);
            for (let i = 0; i < this.numPts; i++) {
                let x = this.xc + this.r * Math.cos(a), y = this.yc + this.r * Math.sin(a);
                a += da;
                this.pts[i] = [x, y];
            }
        } else {
            // the coordinates for line segment; it's shorter than the distance between node centers
            this.lx1 = args.x1 + dx * this.node_r / len * 0.54;
            // 0.54, to account for the node's ring thickness
            this.lx2 = args.x2 - dx * this.node_r / len * 0.57;
            this.ly1 = args.y1 + dy * this.node_r / len * 0.54;
            this.ly2 = args.y2 - dy * this.node_r / len * 0.57;

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
                strokeweight: 7, size: this.size
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
        this.txt.shake(amp, 1);
    }

    reset(str) {
        if (this.txt)
            this.txt.reset({ str: "" + str });
    }

    reColor(lineColor, txtColor, duration) {
        this.l.st.reColor(lineColor, duration);
        if (this.txt !== undefined)
            this.txt.reColor(txtColor, duration);
    }

    highlight(color, duration, thickness) {
        this.hi = true;
        this.h_color = color || [255, 67, 7];
        this.h_dur = duration || 1;
        this.h_fr = frames(this.h_dur);
        this.thickness = thickness || 14;
        this.f = 0;
        this.h_timer = new Timer2(frames(0.67));
        this.s_timer = new StrokeChanger(this.s, this.h_color);
    }

    /**
     * @see class Node's highlight() and dehighlight() method
     */
    dehighlight() {
        this.h_fr = this.f + frames(1);
    }

    highlighting() {
        if (this.f < this.h_fr) {
            this.f++;
            this.s_timer.advance();
            this.s.strokeWeight(this.thickness);
            if (this.f === this.h_fr - frames(0.27)) {
                this.s_timer.fadeOut(0.27);  // fade out .27 seconds before duration ends
            }
            let t = this.h_timer.advance();
            if (!this.d)
                this.s.line(this.x1, this.y1,
                    this.x1 + t * (this.x2 - this.x1), this.y1 + t * (this.y2 - this.y1));
            else {
                this.s.noFill();
                this.s.beginShape();
                for (let i = 0; i < this.numPts * t - 1; i++) {
                    this.s.vertex(this.pts[i][0], this.pts[i][1]);
                }
                this.s.endShape();
            }
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
 * Assumes that args.E go from small-index vertices to big-index vertices, otherwise weight
 * will not be displayed properly
 */
class Graph_U extends Graph {
    constructor(ctx, args) {
        super(ctx, args);
        for (let i = 0; i < this.m; i++) {
            let a = this.E[i][0], b = this.E[i][1];  // two connecting nodes
            let d = this.E[i][2], c = this.E[i][3];  // radius and label
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
            let d = this.E[i][2], c = this.E[i][3];  // radius and label
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

// modify Tracer class for use in github pages
/*** 2019-04-26
 * A class that contains the steps of the algorithm
 *
 * --- args list ---
 * str, x, y, start, (size): parameters for the title
 * begin: starting time for showing the arrow (should be same as starting time for tracing algo)
 * (array) arrColor
 */
class Tracer extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.t = [];
        this.n = 1;
        this.xs = [];
        this.ys = [];
        this.to = 17;  // time offset

        this.t[0] = new TextWriteIn(this.s, {
            str: args.str, color: Yellow,
            x: args.x, y: args.y, size: args.size || 29, start: this.start,
        });
        this.start += args.str.length + this.to * 2;

        this.arr = new Arrow(this.s, {
            x1: 0, x2: 0, y1: 1, y2: 1, start: args.begin, color: args.arrColor || Orange,
        });
    }

    /***
     * x and y are relative to the location of this graph, which is defined as
     * the top-left position of the title.
     * If want no halt between display time, pass in 1 as frameOff for PREVIOUS string
     *
     * index is set to 0, 1, 2, 3... if this text is a step of the algorithm, or -1 if not
     */
    add(str, index, x, y, size, color, frameOff) {
        this.t[this.n] = new TextWriteIn(this.s, {
            str: str, x: this.x + x, y: this.y + y, size: size || 29, start: this.start,
            color: color || White
        });
        this.start += str.length + (frameOff ? frameOff : this.to);  // disabled for github pages
        this.n++;
        if (index >= 0) {
            this.xs[index] = this.x + x;
            this.ys[index] = this.y + y;
        }
    }

    /**
     * Reset the arrow to point to a certain step of the algorithm (step 0, 1, 2, 3, etc.)
     */
    reset(index) {
        this.arr.reset({
            x1: this.xs[index] - 50, x2: this.xs[index] - 10,
            y1: this.ys[index] + 17, y2: this.ys[index] + 17,
        });
    }
    show() {
        for (let t of this.t) t.show();
        this.arr.show();
    }
}

// 2019-05-06
// change the weights to be a random int value between 0 and max
function randomizeWeights(arr, max) {  // this will change the array
    for (let i = 0; i < arr.length; i++) {
        arr[i][3] = Math.floor(Math.random() * max);  // fixme: random often gives duplicate nums
    }
}

// 2019-05-06
// select edges from a given list of valid edges, each choice with a certain probability
function randomizeEdges(arr, prob) {
    let r = [];
    let l = 0;
    for (let i = 0; i < arr.length; i++)
        if (Math.random() < prob) {
            r[l] = arr[i];
            l++;
        }
    return r;
}