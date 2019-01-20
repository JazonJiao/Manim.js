const Chap1Credits = function (s) {
    let txts = [];
    let comic;

    s.preload = function () {
        comic = s.loadFont('../lib/font/comic.ttf');
    };

    s.setup = function() {
        s.frameRate(fr);
        s.createCanvas(1200, cvh);
        s.background(0);

        txts[0] = new TextWriteIn(s, {
            str: "Inspired By: 3Blue1Brown, The Coding Train, and so many other wonderful YouTubers\n" +
                "Source Code (written in p5.js): https://github.com/JazonJiao/Essence-Linear-Regression\n" +
                "",
            x: 37, y: 277,
            size: 27,
            font: comic,
            start: frames(2)
        });
        txts[1] = new TextWriteIn(s, {
            str: "P.S. they are not my sponsor... yet",
            x: 841,
            y: 637,
            size: 22,
            font: comic,
            start: frames(2)
        })
    };

    s.draw = function() {
        txts[0].show();
    }
};

new p5(Chap1Credits);
