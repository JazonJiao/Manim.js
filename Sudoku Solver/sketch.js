/***
 * Copyright Canwen Jiao
 *
 * My first Javascript Program
 * Thanks for the Coding Train for their wonderful tutorial!
 */

/*** 2018-10-30
 * The Cell class and related methods
 * Code is similar to Sudoku.cpp, in my CppMiniGames project
 *
 * Initialize a cell to contain a number (0 for non-given, 1~9 for a given grid),
 * x, y coordinates, and a width
 */
function Cell(n, x, y, w) {
    this.n = n;
    this.given = (this.n > 0);  // if n is not 0, then it's a given grid
    this.x = x;
    this.y = y;
    this.w = w;

    /*** 2018-10-30
     * For a grid with given number, display
     */
    this.show = function () {
        // show white margins
        stroke(200);
        strokeWeight(2);
        noFill();
        rect(this.x, this.y, this.w, this.w);

        /// must reset strokeWeight for proper display of text
        strokeWeight(0);
        textFont("Times New Roman");
        textSize(50);

        if (this.given) {
            fill(0, 255, 255); // set color of text to be cyan
            text(this.n, this.x + this.w / 3.6, this.y + this.w * 0.85);
        } else if (this.n !== 0) {
            fill(0, 255, 0);
            text(this.n, this.x + this.w / 3.6, this.y + this.w * 0.85);
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


/***--------------------
 * Main program starts here
 */
var grid;
var table;

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

    frameRate(50);

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var n = table.getNum(i, j);
            // in order for grids to display in the same order as csv file
            // must store the coordinates in terms of (col, row)
            grid[i][j] = new Cell(n, j * w + leftoffset, i * w + downoffset, w);
        }
    }
}


let numTry = 1;
let coord = 0;

/*** 2018-10-30
 * Non-recursive backtracking solution for Sudoku puzzle
 */
function draw() {
    // black background
    background(0);
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            grid[i][j].show();
        }
    }

    let fail = false;
    let row = Math.floor(coord / 9); // fixme (it took me 3 hours to figure out this operator will not give an int...)
    let col = coord % 9;

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

    //saveFrames('out', 'png', 1, 25); // fixme: this will produce ridiculous behavior...
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


