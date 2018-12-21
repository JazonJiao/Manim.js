/**
 * Brain-creature!
 * 2018-11-14
 *
 *
 */

class Brain extends Graphics {
    constructor(frames) {
        super({w : 1100, h : 1100});  // make it big since we can scale the canvas

        // the coordinates of each vertex, from bottom to top
        this.xCoords = [
            [400, 400, 400, 500, 600, 600, 600],
            [600, 750, 900, 999, 999, 900, 700],
            [700, 800, 860, 900, 860, 800, 700],
            [300, 150, 150, 300, 470, 640, 810],
            [500, 500, 500, 500, 500, 410, 330],
            [100, 160, 220, 280, 340, 400, 400],
            [360, 280, 210, 130, 200, 300, 400]];

        this.yCoords = [
            [900, 800, 700, 600, 500, 350, 200],
            [650, 500, 500, 400, 300, 200, 200],
            [400, 400, 400, 350, 300, 300, 300],
            [300, 300, 250, 100, 100, 100, 100],
            [470, 410, 340, 270, 200, 200, 200],
            [400, 400, 400, 400, 400, 400, 300],
            [600, 600, 600, 500, 500, 500, 500]];

        // number of frames needed to display everything
        // this.frames = frames;
        this.speed = Math.floor(frames / 7);

        // frameCount for this class
        this.frCount = 0;
    }

    showCircle(x, y, size) { // size should be between 0 and 1
        this.g.push();

        // thick line
        this.g.strokeWeight(47 * size);
        this.g.stroke(27, 177, 37);
        this.g.ellipse(x, y, size * 9, size * 9);

        // thin line
        this.g.strokeWeight(17 * size);
        this.g.stroke(107, 227, 97);
        this.g.ellipse(x, y, size * 9, size * 9);

        this.g.pop();
    }

    showWire() {
        for (let i = 0; i < 7; i++) {
            this.g.beginShape();
            let maxJ = Math.floor(this.frCount / this.speed);
            let j = 0;
            let x = this.xCoords[i][0];
            let y = this.yCoords[i][0];
            this.showCircle(x, y, (this.frCount / this.speed) < 1 ? (this.frCount / this.speed) : 1);

            for (; j < 7 && j < maxJ; j++) {
                x = this.xCoords[i][j];
                y = this.yCoords[i][j];

                this.g.vertex(x, y);

            }
            if (j < 7) {   // not reached the end of init animation, add an intermediary vertex
                let factor = (this.frCount % this.speed) / this.speed;    // 0 <= factor < 1
                this.g.vertex(x + (this.xCoords[i][j] - x) * factor,
                              y + (this.yCoords[i][j] - y) * factor);
            } else {
                this.showCircle(x, y, 1); // fixme: abrupt end
            }
            this.g.endShape();
        }
    }

    show() {
        if (frameCount > frames(1)) {
            // the thick lines
            this.g.noFill();
            this.g.strokeWeight(47);
            this.g.stroke(27, 177, 37);
            this.g.strokeJoin(ROUND);
            this.showWire();

            // the thin lines
            this.g.strokeWeight(17);
            this.g.stroke(107, 227, 97);
            this.showWire();

            // update local frame count
            this.frCount++;

            // display canvas
            image(this.g, 100, 100, 330, 330);
        }
    }
}

