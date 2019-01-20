/***
 * Copyright Canwen Jiao
 *
 * My first Javascript Program
 * Thanks for the Coding Train for their wonderful tutorial!
 */

// todo: restructure the program and put the classes in another file

/*** 2018-10-30
 * The Cell class and related methods
 * Code is similar to Sudoku.cpp, in my CppMiniGames project
 *
 * Initialize a cell to contain a number (0 for non-given, 1~9 for a given grid),
 * x, y coordinates, and a width
 */
function Cell(n, x, y, w) {
    this.n = n;
    this.given = (this.n > 0);  // if n is not 0, then it'o a given grid
    this.x = x;
    this.y = y;
    this.w = w;
    // set display color (target values)
    if (this.given) {
        this.r = 37;
        this.g = 207;
        this.b = 217;
        // the current values of RGB, needed for fade in effects
        this.rc = 0;
        this.gc = 0;
        this.bc = 0;
    } else {
        this.r = 17;
        this.g = 237;
        this.b = 0;
        // non-given grids, no need for fade in effects
        this.rc = this.r;
        this.gc = this.g;
        this.bc = this.b;
    }


    /*** 2018-10-30,31
     * For a grid with given number, display the number
     * frames specify the number of frames needed for it to appear completely
     */
    this.show = function (frames) {

        // display if grid is not empty
        if (this.n > 0) {
            strokeWeight(0);
            textFont("Times New Roman");
            textSize(50);
            fill(this.rc, this.gc, this.bc);
            // fixme: even with textAlign, need to manually set y coordinates
            textAlign(CENTER);
            text(this.n, this.x + this.w / 2, this.y + this.w * 0.85);
        }

        // need to display fade in effects for given grids
        // NOTE: can actually utilize the alpha value (transparency), as in EightQueens.js
        if (this.given) {
            if (this.rc < this.r || this.gc < this.g || this.bc < this.b) {
                this.rc += this.r / frames;
                this.gc += this.g / frames;
                this.bc += this.b / frames;
            }
            if (this.rc > this.r || this.gc > this.g || this.bc > this.b) {
                this.rc = this.r;
                this.gc = this.g;
                this.bc = this.b;
            }
        }

    }; // fixme: semicolon?


    /***
     * Mutator and getters
     */
    this.isGiven = function () {
        return (this.given === true);
    };

    this.get = function () {
        return this.n;
    };

    this.set = function (n) {
        this.n = n;
    };

    this.remove = function () {
        this.n = 0;
    };
}

/***
 * Shows it growing from (x1, y1) to (x2, y2) in 'frames' frames
 * type = 0 if it'o a normal line, = 1 if it'o a bold line
 */
function gridLine(x1, y1, x2, y2, type) {
    this.x1 = x1;
    this.y1 = y1;
    this.x = x1;
    this.y = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.type = type;

    /*** 2018-10-30,31
     * frames specify the number of frames needed for the line to appear completely
     */
    this.draw = function (frames) {
        if (type === 0) {  // normal line
            stroke(157);
            strokeWeight(2);
        } else {           // thick line
            stroke(207);
            strokeWeight(4);
        }
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


/***--------------------
 * Main program starts here
 */
var grid;
var table;
var linesHoriz;
var linesVerti;

/*** 2018-10-30
 * Loads the Sudoku grid into table in csv format
 * 0 stands for a grid to be solved, 1~9 stands for a given number
 */
function preload() {
    table = loadTable('Sudoku4.csv', 'csv');
}

/*** 2018-10-30
 * Copied from Coding Challenge 71
 * Returns a 2D array with given number of rows and cols
 */
function make2DArray(rows, cols) {
    var arr = new Array(rows);
    for (var i = 0; i < cols; i++) {
        arr[i] = new Array(cols);
    }
    return arr;
}

// global variable that stores width and height of canvas
var cvw = 1200;
var cvh = 675;

// global variable that stores the width of each square cell
var w = 50;

// offset for displaying the grid relative to top left corner of canvas
var leftoffset = (cvw - 10 * w) / 2;
var downoffset = (cvh - 10 * w) / 2;


function setup() {
    createCanvas(cvw, cvh);
    grid = make2DArray(9, 9);
    linesHoriz = new Array(10);
    linesVerti = new Array(10);

    frameRate(25);  // default 25

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var n = table.getNum(i, j);
            // in order for grids to display in the same order as csv file
            // must store the coordinates in terms of (col, row)
            grid[i][j] = new Cell(n, j * w + leftoffset, i * w + downoffset, w);
        }
    }
    // draw horizontal lines, y-values vary
    // draw a thick line if i is a multiple of 3
    for (i = 0; i < 10; i++) {
        var y = i * w + downoffset;
        linesHoriz[i] = new gridLine(leftoffset, y, leftoffset + 9 * w, y, (i % 3 === 0) ? 1 : 0);
    }
    // draw vertical lines
    for (j = 0; j < 10; j++) {
        var x = j * w + leftoffset;
        linesVerti[j] = new gridLine(x, downoffset, x, downoffset + 9 * w, (j % 3 === 0) ? 1 : 0);
    }

}

let frameOffset = 0; // time to start animation
let xtrans = 0;
let numTry = 1;
let coord = 0;

/*** 2018-10-30
 * Non-recursive backtracking solution for Sudoku puzzle
 * Halts when coord exceeds 81, in which case will produce a "read undefined" error in console
 */
function draw() {
    // black background
    background(0);

    // if (frameCount > 50) {
    //     translate(-xtrans, 0);
    //     xtrans += 10;
    // }

    // need about 50 frames to initialize grid
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            // initialize from top left to bottom right
            if (frameCount - frameOffset > 3 * (i + j)) {
                grid[i][j].show(10);
            }
        }
    }

    // need about 50 frames to initialize lines
    for (i = 0; i < 10; i++) {
        if (frameCount - frameOffset > i * 3) { // start drawing a new line every three frames
            linesHoriz[i].draw(20);
            linesVerti[i].draw(20);
        }
    }

    let fail = false;
    let row = Math.floor(coord / 9); // fixme (it took me 3 hours to figure out this operator will not give an int...)
    let col = coord % 9;

    // start solving after 3 seconds (75 frames)
    if (frameCount > frameOffset + 75) {
        if (grid[row][col].isGiven()) {
            numTry = 1;
            coord++;  // this grid contains a given number. Look at next grid
        } else {
            while (!isValid(row, col, numTry)) {
                numTry++;
                if (numTry > 9) {
                    fail = true;
                }
            }
            if (fail) { // all numbers are tried, but no solution found. Need to backtrack
                // remove the number on the current grid
                grid[row][col].remove();

                // restore coord to previous non-given grid, and numTry to the number in it
                coord--;
                row = Math.floor(coord / 9);
                col = coord % 9;
                while (grid[row][col].isGiven()) {
                    coord--;
                    row = Math.floor(coord / 9);
                    col = coord % 9;
                }
                numTry = grid[row][col].get();
            } else {  // a valid number is placed on this grid, try next grid
                grid[row][col].set(numTry);
                numTry = 1;
                coord++;
            }
        }
    }

    //saveFrames('out', 'png', 1, 15); // fixme: this will produce ridiculous behavior...
}

// copied from Sudoku.cpp
function isValid(row, col, n) {
    for (var i = 0; i < 9; i++) {
        if (grid[i][col].get() === n)
            return false;
    }
    for (var j = 0; j < 9; j++) {
        if (grid[row][j].get() === n)
            return false;
    }
    var x = Math.floor(row / 3);
    var y = Math.floor(col / 3);
    for (i = x * 3; i < x * 3 + 3; i++) {
        for (j = y * 3; j < y * 3 + 3; j++) {
            if (grid[i][j].get() === n)
                return false;
        }
    }
    return true;
}


/***
 * Copied from my original C++ implementation of Soduku solver
 * This immediately solves the puzzle. Need to rewrite so I can display each step
 */
function solver(coord) {
    if (coord === 81) {// base case, coord reaches 81
        return true;
    }
    var row = Math.floor(coord / 9);
    var col = coord % 9;
    if (grid[row][col].isGiven()) {
        return solver(coord + 1);
    } else {
        for (var i = 1; i < 10; i++) {
            if (isValid(row, col, i)) {
                grid[row][col].set(i);
                if (solver(coord + 1) === true)
                    return true;
                grid[row][col].remove();  // reset
            }
        }
    }
    return false;
}

function mousePressed() {  // press the mouse and show solution immediately
    //solver(0);
}


