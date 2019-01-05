let time = {
    brain: frames(1),
    bubble: frames(2)
};

let hg;
let font;
let brain;

function preload() {
    font = loadFont('../lib/font/comic.ttf');
}

function setup() {
    createCanvas(1200, 675);

    hg = new HelperGrid({});

    brain = new ThoughtBrain({
        start: time.brain,
        font: font,
        size: 57,
        str: "Linear Regression",
        bubbleStart: time.bubble
    });
}

function draw() {
    background(0);
    //hg.show();
    //text1.show();
    //bubble.show();
    brain.show();
}