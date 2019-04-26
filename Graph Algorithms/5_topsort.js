let G = {
    V: [[300, 100],
        [200, 200],
        [300, 300],
        [400, 200],
    ],
    E: [[0, 1],
        [0, 2],
        [0, 3],
        [1, 2],
    ]
};

class Graph_Topo extends Graph_D {
    constructor(ctx, args) {
        super(ctx, args);

        this.left = 100;  // starting point of list of nodes
        this.right = 1100;  // ending point of list of nodes
        this.y = 100;   // the y-coordinate of list of nodes


    }
}

// Calculate in-degree of each vertex via DFS
// Repeat:
// 1. Find a vertex with in-degree 0
// 2. Add it to the sorted list of vertices
// 3. Remove it in graph and update in-degrees
// If there are no 0-degree vertices:
// graph contains cycle and no topological sort exists
// End if graph is empty


const Graph05 = function(s) {
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
        // s.a = new Arc(s, {
        //     a1: 0, a2: -2, x: 322, y: 332, r: 32
        // })
    };
    s.draw = function () {
        s.background(0);
        s.g.show();
        s.d.show();
    };
};

let p = new p5(Graph05);