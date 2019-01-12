

let hg;
let txts = [];
let lines = [];
let arrows = [];
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
    })
}

function draw() {
    for (let t of txts) t.show();
}