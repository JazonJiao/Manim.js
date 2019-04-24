let G = {
    V: [[300, 100],
        [200, 200],
        [300, 300],
        [400, 200],
    ],
    E: [[0, 1, 2, 2],
        [0, 2, 23, 3],
        [0, 3, 34, 9],
        [1, 2, 0, 5],
    ]
};


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

        s.d.show();
    };
};

let p = new p5(Graph01);