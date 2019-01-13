

let hg;
let txts = [];
let comic;


function preload() {
    comic = loadFont('../lib/font/comic.ttf');
}

function setup() {
    frameRate(fr);
    createCanvas(1200, cvh);
    background(0);

    txts[0] = new TextWriteIn({
        str: "Inspired By: 3Blue1Brown, The Coding Train, and so many other wonderful YouTubers\n" +
            "Source Code (written in p5.js): https://github.com/JazonJiao/Essence-Linear-Regression\n" +
            "",
        x: 37, y: 277,
        start: 0,
        size: 27,
        font: comic
    });
    txts[1] = new TextWriteIn({
        str: "P.S. they are not my sponsor... yet",
        x: 841,
        y: 637,
        size: 22,
        font: comic,
        start: frames(1)
    })
}

function draw() {
    txts[0].show();
}