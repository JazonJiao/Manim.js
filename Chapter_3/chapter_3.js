
let time = {
    grid: frames(1),
    i_hat: frames(3),
    j_hat: frames(4.2),
    u_hat: frames(6),
    transform: frames(3)
};

class LT_Grid extends Grid {  // a grid capable of doing eloa-style linear transformations
    constructor() {
        super({
            centerX: 200,
            centerY: 500,
            start: time.grid
        });
        this.startTransform = time.transform;

        // how many pixels correspond to 1 in the actual coordinate
        this.step = this.spacing * 6;

        this.i_hat = new Arrow({
            x1: this.centerX, x2: this.centerX + this.step,
            y1: this.centerY, y2: this.centerY,
            color: color('#57c757'), strokeweight: 7, tipLen: 27,
            start: time.i_hat
        });

        this.j_hat = new Arrow({
            x1: this.centerX, x2: this.centerX,
            y1: this.centerY, y2: this.centerY - this.step,
            color: color('#f75757'), strokeweight: 7, tipLen: 27,
            start: time.j_hat
        });

        this.u_x = 0.8;
        this.u_y = 0.6;

        this.u_hat = new Arrow({
            x1: this.centerX, x2: this.centerX + this.u_x * this.step,
            y1: this.centerY, y2: this.centerY - this.u_y * this.step,
            color: color('#f7f717'), strokeweight: 7, tipLen: 27,
            start: time.u_hat
        })
    }

    show() {
        this.showGrid();
        this.i_hat.show();
        this.j_hat.show();
        this.u_hat.show();
    }


}

var grid;

function setup() {
    frameRate(fr);
    createCanvas(1200, 675);
    grid = new LT_Grid();
}

function draw() {
    background(0);
    grid.show();
}