// Dijkstra's algorithm

let G2 = {
    V: [[225, 100],  // 0
        [375, 100],  // 1
        [150, 250],  // 2
        [300, 250],  // 3
        [450, 250],  // 4
        [150, 400],  // 5
        [300, 400],  // 6
        [450, 400],  // 7
        [225, 550],  // 8
        [375, 550],  // 9
    ],
};

let G = {
    V: [[90, 170],
        [190, 70],
        [190, 270],
        [270, 170],
        [350, 70],
        [350, 270],
        [450, 170],
    ],
    E: [[0, 1, 0, 7],
        [0, 2, 0, 9],
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

let nodeTxtSize = 37;
let nodeRadius = 67;

class Node_07 extends Node {
    constructor(ctx, args) {
        super(ctx, args);
        this.txt.reset({
            x: this.x - 12, y: this.y - 14
        });
        let m = 0.24;
        this.lin = new Line(this.s, {
            x1: this.x - this.r * m, y1: this.y + this.r * m,
            x2: this.x + this.r * m, y2: this.y - this.r * m,
            strokeweight: 1, start: args.start, color: [177, 177, 177]
        });
        this.cost = new TextFade(this.s, {
            str: "-", mode: 1, x: this.x + 10, y: this.y + 10, start: args.start,
            color: [177, 217, 255], size: 24
        });
    }

    reset(cost) {  // display reset animations
        this.resetted = true;
        this.f = 0;
        this.duration = 1;
        this.costN = new TextFade(this.s, {
            str: "" + cost, mode: 1, x: this.x + 10, y: this.y + 40, start: this.s.frameCount + 1,
            color: [255, 247, 177], size: 24
        });
        this.cost.ft.fadeOut(0.7);
        this.cost.shift(0, -30, 1, 1);
        this.costN.shift(0, -30, 1, 1);
    }

    resetting() {
        if (this.f <= this.duration * fr) {
            this.f++;
            this.costN.show();
        } else {
            this.resetted = false;
            this.cost = this.costN;
            this.costN = null;
        }
    }

    show() {
        super.show();
        this.lin.show();
        if (this.resetted)
            this.resetting();
        this.cost.show();
    }
}

class Graph_Dijk extends Graph_D {
    constructor(ctx, args) {
        super(ctx, args);
        for (let i = 0; i < this.n; i++)   // reconstruct nodes
            this.nodes[i] = new Node_07(this.s, {
                x: this.V[i][0], y: this.V[i][1], yOffset: this.yOffset, duration: 0.37,
                start: this.start + frames(this.dur) * i / this.n, size: args.size,
                str: "" + i, font: args.font, color: args.color_v, r: nodeRadius
            });

        this.C = [];
        for (let i = 0; i < this.n; i++) {
            this.C[i] = -1;
        }
    }


}

const Graph07 = function (s) {
    let t = {
        start: frames(1),
        txt: [frames(5), frames(8), frames(10), frames(12), frames(15), frames(17), frames(19)],
        trace: frames(3),
    };
    let tnr;
    s.preload = function () {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.g = new Graph_Dijk(s, {
            V: G.V, E: G.E, font: tnr,
            color_v: Green,
            size: nodeTxtSize, radius: nodeRadius,  // necessary for config
            color_e: [7, 97, 7],
            start: t.start, begin: t.trace, time: t.txt,
        });
        s.d = new Dragger(s, [s.g.txt]);
    };
    s.draw = function () {
        s.background(0);
        if (s.frameCount === 150)
            s.g.nodes[3].reset(12);
        s.g.show();
        //s.d.show();
    };
};

let p = new p5(Graph07);