const GraphEnd = function(s) {
    let tnr;
    s.preload = function() {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.txt = [];
        s.txt[0] = new TextWriteIn(s, {
            str: "Play with the visualization yourself—",
            x: 337, y: 517, start: 30, font: tnr,
        });
        s.txt[1] = new TextWriteIn(s, {
            str: "link in the description below!",
            x: 387, y: 577, start: 69, font: tnr,
        });
        s.d = new Dragger(s, [s.txt]);
    };
    s.draw = function () {
        s.background(0);
        for (let t of s.txt) t.show();
        //s.d.show();
    };
};
