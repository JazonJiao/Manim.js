

class Graph_DFS extends Graph_D {
    constructor(ctx, args) {
        super(ctx, args);
        this.visited = [];
        this.stack = [];
    }

    stepDFS() {

    }
}

const Graph01 = function(s) {
    let t = {

    };
    let tnr;
    s.preload = function() {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.g = new Graph_D(s, {
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

let p = new p5(Graph01);