/***
 * Shows it growing from (x1, y1) to (x2, y2)
 */
function GridLine(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x = x1;
    this.y = y1;
    this.x2 = x2;
    this.y2 = y2;

    /*** 2018-10-30,31
     * frames specify the number of frames needed for the line to appear completely
     */
    this.draw = function (frames) {
        stroke(197);
        strokeWeight(2);

        line(this.x1, this.y1, this.x, this.y);
        if (this.x < this.x2 || this.y < this.y2) {
            this.x += (this.x2 - this.x1) / frames;
            this.y += (this.y2 - this.y1) / frames;
        }
        if (this.x > this.x2 || this.y > this.y2) {  // want this.x equal to this.x2, but it may be greater than
            this.x = this.x2;
            this.y = this.y2;
        }
    };
}

/**
 *
 * @param x - x coords
 * @param y - y coords
 * @param light - whether the grid is light or dark (light if (i + j) % 2 == 0)
 */
function Grid(x, y, light) {
    this.x1 = x;
    this.y1 = y;
    this.light = light;
    if (this.light) { // set RGB and alpha (transparency) values
        this.r = 117;
        this.g = 87;
        this.b = 17;
    } else {
        this.r = 77;
        this.g = 47;
        this.b = 17;
    }
    this.a = 0;

    this.draw = function(frames) {
        fill(this.r, this.g, this.b, this.a);
        this.a += 255 / frames;
        if (this.a > 255) {
            this.a = 255;
        }
        noStroke();
        rect(this.x1, this.y1, w, w);
    }
}

function Queen(i, j) {
    this.i = i;  // row number (should be initialized to 0)
    this.j = j;  // column number
    this.y = this.i * w + downoffset;
    this.x = this.j * w + leftoffset;

    this.row = function() {
        return this.i;
    };


    this.show = function() {
        image(img, this.x + 5, this.y + 5, w - 10, w - 10);
    };

    /**
     * animation for moving to the next grid in the same column
     */
    this.move = function() {

    }

}

function make2DArray(rows, cols) {
    var arr = new Array(rows);
    for (var i = 0; i < cols; i++) {
        arr[i] = new Array(cols);
    }
    return arr;
}

var img;
function preload() {
    img = loadImage('queen.png');
}

var queenHoriz;
var queenVerti;
var grids;
var queens;

var cvw = 1200;
var cvh = 675;
var w = 60;

var leftoffset = (cvw - 8 * w) / 2;
var downoffset = (cvh - 8 * w) / 2;


function setup() {

    createCanvas(cvw, cvh);
    queenHoriz = new GridLine(9);
    queenVerti = new GridLine(9);
    queens = new Queen(8);
    grids = make2DArray(8, 8);

    frameRate(25);

    for (var i = 0; i < 9; i++) {
        var y = i * w + downoffset;
        queenHoriz[i] = new GridLine(leftoffset, y, leftoffset + 8 * w, y);
    }

    for (var j = 0; j < 9; j++) {
        var x = j * w + leftoffset;
        /// Error log: did not change i to j!
        queenVerti[j] = new GridLine(x, downoffset, x, downoffset + 8 * w);
    }

    for (j = 0; j < 8; j++) {
        queens[j] = new Queen(0, j);
    }

    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            grids[i][j] = new Grid(j * w + leftoffset, i * w + downoffset, ((i+j) % 2 === 0));
        }
    }
}

var frameOffset = 0;

function draw() {
    background(0);

    // need about 50 frames to initialize grid
    for (i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            // initialize from top left to bottom right
            if (frameCount - frameOffset > (i + j) * 3) {
                grids[i][j].draw(12);
            }
        }
    }

    // need about 50 frames to initialize grid lines
    for (i = 0; i < 9; i++) {
        if (frameCount - frameOffset > i * 3) { // start drawing a new line every three frames
            queenHoriz[i].draw(20);
            queenVerti[i].draw(20);
        }
    }

    // queens are at the top layer, show last
    for (var i = 0; i < 8; i++) {
        queens[i].show();
    }
}
