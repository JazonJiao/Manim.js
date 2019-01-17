/**
 * Capable of displaying the squared error of each point
 */
class LS_Plot extends Plot {
    constructor(args) {
        super(args);
        this.sqs = [];
        for (let i = 0; i < this.numPts; i++) {
            this.sqs[i] = new Emphasis({

            })
        }
    }
}