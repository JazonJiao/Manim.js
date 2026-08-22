/**
 * A lightweight copy of the graph Edge utility for LLM animations.
 * It draws a straight line or curved arc between two coordinates and supports
 * the standard Line start/end animations without depending on graph.js.
 */
class Edge extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.size = args.size || 29;
        this.node_r = args.node_r || 57;
        this.color = args.color || [97, 7, 117];
        this.txtColor = args.txtColor || [167, 236, 227];
        this.directed = args.directed;
        if (this.directed)
            this.tipLen = 12;

        const dx = args.x2 - args.x1;
        const dy = args.y2 - args.y1;
        const xm = this.x1 + dx / 2;
        const ym = this.y1 + dy / 2;
        const len = Math.sqrt(dx * dx + dy * dy);

        if (args.d) {
            this.d = args.d;
            this.x3 = xm - dy * this.d / len;
            this.y3 = ym + dx * this.d / len;

            const p1 = this.getPB(this.x1, this.y1, this.x3, this.y3);
            const p2 = this.getPB(this.x2, this.y2, this.x3, this.y3);
            const a1 = p1[0], b1 = p1[1], c1 = p1[2];
            const a2 = p2[0], b2 = p2[1], c2 = p2[2];
            const det = a1 * b2 - b1 * a2;
            this.xc = (c1 * b2 - b1 * c2) / det;
            this.yc = (a1 * c2 - c1 * a2) / det;

            const x1d = this.x1 - this.xc;
            const y1d = this.y1 - this.yc;
            this.r = Math.sqrt(x1d * x1d + y1d * y1d);
            this.a1 = Math.atan2(y1d, x1d);

            const x2d = this.x2 - this.xc;
            const y2d = this.y2 - this.yc;
            this.a2 = Math.atan2(y2d, x2d);
            if (this.a2 < this.a1 && this.d < 0) {
                this.a2 += this.s.TWO_PI;
            } else if (this.a2 > this.a1 && this.d > 0) {
                this.a1 += this.s.TWO_PI;
            }

            const half_a = Math.asin(this.node_r / 2 / this.r) * 1.14;
            if (this.d > 0) {
                this.la1 = this.a1 - half_a;
                this.la2 = this.a2 + half_a;
            } else {
                this.la1 = this.a1 + half_a;
                this.la2 = this.a2 - half_a;
            }
        } else {
            this.lx1 = args.x1 + dx * this.node_r / len * 0.54;
            this.lx2 = args.x2 - dx * this.node_r / len * 0.57;
            this.ly1 = args.y1 + dy * this.node_r / len * 0.54;
            this.ly2 = args.y2 - dy * this.node_r / len * 0.57;
            this.x3 = args.x3 || xm;
            this.y3 = args.y3 || ym;
        }

        this.l = this.createLine();
        if (args.weight !== undefined) {
            this.txt = new TextFade(this.s, {
                str: "" + args.weight,
                x: this.x3,
                y: this.y3,
                mode: 1,
                start: this.start,
                end: this.end,
                color: this.txtColor,
                size: this.size
            });
        }
    }

    getPB(x1, y1, x2, y2) {
        const a = x1 - x2;
        const b = y1 - y2;
        const xm = x1 - a / 2;
        const ym = y1 - b / 2;
        return [a, b, a * xm + b * ym];
    }

    createLine() {
        const shared = {
            start: this.start,
            end: this.end,
            duration: this.duration,
            color: this.color,
            strokeweight: this.strokeweight
        };

        if (this.r) {
            const arcArgs = Object.assign({}, shared, {
                r: this.r,
                x: this.xc,
                y: this.yc,
                a1: this.la1,
                a2: this.la2
            });
            if (this.directed) {
                arcArgs.tipLen = this.tipLen;
                return new ArcArrow(this.s, arcArgs);
            }
            return new Arc(this.s, arcArgs);
        }

        const lineArgs = Object.assign({}, shared, {
            x1: this.lx1,
            x2: this.lx2,
            y1: this.ly1,
            y2: this.ly2
        });
        if (this.directed) {
            lineArgs.tipAngle = 0.37;
            lineArgs.tipLen = this.tipLen;
            return new Arrow(this.s, lineArgs);
        }
        return new Line(this.s, lineArgs);
    }

    show() {
        this.l.show();
        if (this.txt)
            this.txt.show();
    }
}

/**
 * A fully connected feed-forward neural-network diagram.
 *
 * Neurons enter top-to-bottom in each layer, with neighboring layers staggered
 * into an overlapping wave. Each edge stores a random weight in [-1, 1]:
 * positive weights are blue, negative weights are red, and both opacity and
 * stroke weight are proportional to the magnitude of the weight.
 * The x and y coordinates specify the center of the complete network. If they
 * are omitted, the network is centered on the canvas.
 *
 * ----args list parameters----
 * @mandatory (array) layers
 * @optional (number) x, y, neuronDistanceY, layerDistanceX, radius, start,
 *                    duration, neuronEntryDuration, layerDelay, edgeDuration,
 *                    strokeweight, edgeStrokeweightScale, edgeAlpha,
 *                    seed [for deterministic edge weights]
 */
class NeuralNetwork {
    constructor(ctx, args) {
        this.s = ctx;
        this.layers = args.layers;
        this.neuronDistanceY = args.neuronDistanceY || 150;
        this.layerDistanceX = args.layerDistanceX || 300;
        this.radius = args.radius || 52;
        this.start = args.start || 1;
        this.duration = args.duration || 1.7;
        this.neuronEntryDuration = args.neuronEntryDuration || 0.37;
        this.layerDelay = args.layerDelay || this.neuronEntryDuration / 2;
        this.edgeDuration = args.edgeDuration || 1;
        this.strokeweight = args.strokeweight || 3;
        this.edgeStrokeweightScale = args.edgeStrokeweightScale || 1;
        this.edgeAlpha = args.edgeAlpha;
        this.seed = args.seed;
        this.weightRandom = this.seed === undefined ?
            () => this.s.random(-1, 1) : NeuralNetwork.seededWeightRandom(this.seed);
        this.x = args.x === undefined ? this.s.width / 2 : args.x;
        this.y = args.y === undefined ? this.s.height / 2 : args.y;

        this.neurons = [];
        this.neuronEntryEnds = [];
        this.neuronColorsSettled = [];
        this.edges = [];
        this.weights = [];
        this.entryEnd = this.start;

        const neuronCount = this.layers.reduce((sum, count) => sum + count, 0);
        const neuronStagger = frames(this.duration) / neuronCount;
        for (let layer = 0; layer < this.layers.length; layer++) {
            const layerSize = this.layers[layer];
            const layerX = this.x +
                (layer - (this.layers.length - 1) / 2) * this.layerDistanceX;
            const layerTop = this.y - (layerSize - 1) * this.neuronDistanceY / 2;
            const layerStart = this.start + frames(this.layerDelay) * layer;
            this.neurons[layer] = [];
            this.neuronEntryEnds[layer] = [];
            this.neuronColorsSettled[layer] = [];

            for (let neuron = 0; neuron < layerSize; neuron++) {
                const neuronStart = layerStart + neuronStagger * neuron;
                const circle = new Circle(this.s, {
                    x: layerX,
                    y: layerTop + neuron * this.neuronDistanceY,
                    r: this.radius,
                    start: neuronStart,
                    duration: this.neuronEntryDuration,
                    strokeweight: 2,
                    // Do not share the mutable global Orange array with other animations.
                    color: [Orange[0], Orange[1], Orange[2]],
                    fill: [72, 39, 10]
                });
                this.neurons[layer][neuron] = circle;
                this.neuronEntryEnds[layer][neuron] = circle.start +
                    frames(this.neuronEntryDuration);
                this.entryEnd = Math.max(this.entryEnd, this.neuronEntryEnds[layer][neuron]);
                this.neuronColorsSettled[layer][neuron] = false;
            }
        }

        for (let layer = 0; layer < this.layers.length - 1; layer++) {
            this.edges[layer] = [];
            this.weights[layer] = [];
            for (let from = 0; from < this.layers[layer]; from++) {
                this.edges[layer][from] = [];
                this.weights[layer][from] = [];
                for (let to = 0; to < this.layers[layer + 1]; to++) {
                    const source = this.neurons[layer][from];
                    const target = this.neurons[layer + 1][to];
                    const weight = this.weightRandom();
                    const baseColor = weight >= 0 ? Blue : Red;
                    const color = [baseColor[0], baseColor[1], baseColor[2],
                        this.edgeAlpha === undefined ? Math.round(Math.abs(weight) * 255) :
                            this.edgeAlpha];

                    this.weights[layer][from][to] = weight;
                    this.edges[layer][from][to] = new Line(this.s, {
                        x1: source.x,
                        y1: source.y,
                        x2: target.x,
                        y2: target.y,
                        // Line begins drawing on the frame after `start`.
                        start: this.neuronEntryEnds[layer][from] - 1,
                        duration: this.edgeDuration,
                        strokeweight: this.strokeweight * Math.abs(weight) *
                            this.edgeStrokeweightScale,
                        color: color
                    });
                }
            }
        }
    }

    // Mulberry32 keeps seeded weights deterministic without changing p5's RNG.
    static seededWeightRandom(seed) {
        let state = Number(seed) >>> 0;
        return function () {
            state += 0x6D2B79F5;
            let value = state;
            value = Math.imul(value ^ value >>> 15, value | 1);
            value ^= value + Math.imul(value ^ value >>> 7, value | 61);
            return ((value ^ value >>> 14) >>> 0) / 4294967296 * 2 - 1;
        };
    }

    showEdges() {
        for (let layer of this.edges)
            for (let outgoing of layer)
                for (let edge of outgoing)
                    edge.show();
    }

    showNeurons() {
        for (let layer = 0; layer < this.neurons.length; layer++) {
            for (let neuron = 0; neuron < this.neurons[layer].length; neuron++) {
                const circle = this.neurons[layer][neuron];
                if (!this.neuronColorsSettled[layer][neuron] &&
                    this.s.frameCount >= this.neuronEntryEnds[layer][neuron]) {
                    circle.st.reColor([217, 222, 229], 0.27);
                    circle.ft.reColor([49, 54, 61], 0.27);
                    this.neuronColorsSettled[layer][neuron] = true;
                }
                circle.show();
            }
        }
    }

    show() {
        this.showEdges();
        this.showNeurons();
    }
}

/**
 * Plays a repeating, left-to-right inference pass over a NeuralNetwork.
 * Activated neurons and moving edge segments are drawn over the base network,
 * so this can be combined with the existing static edges without modifying
 * their weights or colors.
 *
 * ----args list parameters----
 * @mandatory (NeuralNetwork) network; (number) start
 * @optional (number) activationDuration, edgeDuration, pauseDuration,
 *                    strokeweight, edgeAlpha; (array) positiveColor,
 *                    negativeColor
 */
class Feedforward {
    constructor(ctx, args) {
        this.s = ctx;
        this.network = args.network;
        this.start = args.start;
        this.activationDuration = args.activationDuration || 0.16;
        this.edgeDuration = args.edgeDuration || 0.32;
        this.pauseDuration = args.pauseDuration || 0.18;
        this.strokeweight = args.strokeweight || 5;
        this.edgeAlpha = args.edgeAlpha || 235;
        this.positiveColor = args.positiveColor || [45, 225, 205];
        this.negativeColor = args.negativeColor || [255, 157, 47];
        this.activationFrames = frames(this.activationDuration);
        this.edgeFrames = frames(this.edgeDuration);
        // The packet head reaches the target center at 2/3 of its edge pass.
        this.travelFrames = Math.max(1, Math.round(this.edgeFrames * 2 / 3));
        this.holdFrames = this.activationFrames;
        this.fadeOutFrames = this.activationFrames;
        const lastLayerStart = this.activationFrames +
            Math.max(0, this.network.layers.length - 2) * this.travelFrames;
        const lastEdgeEnd = this.activationFrames +
            Math.max(0, this.network.layers.length - 2) * this.travelFrames +
            this.edgeFrames;
        const lastLayerEnd = lastLayerStart + this.travelFrames +
            this.holdFrames + this.fadeOutFrames;
        this.cycleFrames = Math.max(1,
            Math.max(lastEdgeEnd, lastLayerEnd) + frames(this.pauseDuration));
    }

    showActivatedLayer(layer, age, fadeInFrames) {
        const visibleFrames = fadeInFrames + this.holdFrames +
            this.fadeOutFrames;
        if (age < 0 || age > visibleFrames)
            return;

        let alpha;
        if (age < fadeInFrames) {
            alpha = 255 * age / Math.max(1, fadeInFrames);
        } else if (age <= fadeInFrames + this.holdFrames) {
            alpha = 255;
        } else {
            alpha = 255 * (1 - (age - fadeInFrames - this.holdFrames) /
                Math.max(1, this.fadeOutFrames));
        }
        const color = this.positiveColor;
        for (let neuron of this.network.neurons[layer]) {
            this.s.push();
            this.s.stroke(color[0], color[1], color[2], alpha);
            this.s.strokeWeight(4);
            this.s.fill(24, 100, 96, alpha * 0.72);
            this.s.ellipse(neuron.x, neuron.y,
                this.network.radius, this.network.radius);
            this.s.pop();
        }
    }

    showMovingEdges(layer, progress) {
        if (progress < 0 || progress > 1)
            return;

        // A short packet grows onto each edge, travels right, then leaves it.
        const head = Math.min(1, progress * 1.5);
        const tail = Math.max(0, progress * 1.5 - 0.5);
        for (let from = 0; from < this.network.layers[layer]; from++) {
            const source = this.network.neurons[layer][from];
            for (let to = 0; to < this.network.layers[layer + 1]; to++) {
                const target = this.network.neurons[layer + 1][to];
                const weight = this.network.weights[layer][from][to];
                const color = weight >= 0 ? this.positiveColor : this.negativeColor;
                const intensity = 0.45 + Math.abs(weight) * 0.55;

                this.s.push();
                this.s.stroke(color[0], color[1], color[2],
                    this.edgeAlpha * intensity);
                this.s.strokeWeight(this.strokeweight * intensity);
                this.s.strokeCap(this.s.ROUND);
                this.s.line(
                    source.x + (target.x - source.x) * tail,
                    source.y + (target.y - source.y) * tail,
                    source.x + (target.x - source.x) * head,
                    source.y + (target.y - source.y) * head
                );
                this.s.pop();
            }
        }
    }

    show() {
        if (this.s.frameCount < this.start)
            return;

        const cycleFrame = (this.s.frameCount - this.start) % this.cycleFrames;
        // Draw every animated edge first so activated neurons remain on top.
        for (let layer = 0; layer < this.network.layers.length - 1; layer++) {
            const edgeStart = this.activationFrames + layer * this.travelFrames;
            const edgeProgress = (cycleFrame - edgeStart) /
                Math.max(1, this.edgeFrames);
            this.showMovingEdges(layer, edgeProgress);
        }
        for (let layer = 0; layer < this.network.layers.length; layer++) {
            const layerStart = layer === 0 ? 0 : this.activationFrames +
                (layer - 1) * this.travelFrames;
            const fadeInFrames = layer === 0 ? this.activationFrames :
                this.travelFrames;
            this.showActivatedLayer(layer, cycleFrame - layerStart,
                fadeInFrames);
        }
    }
}

function animateFeedforward(ctx, args) {
    return new Feedforward(ctx, args);
}

/**
 * A constant-width backpropagation edge that wipes away from its right-hand
 * source toward its left-hand target.
 */
class BackpropLine extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.disappearStart = args.disappearStart;
        this.disappearDuration = args.disappearDuration || 0.5;
        this.disappearTimer = new Timer1(frames(this.disappearDuration));
    }

    show() {
        if (this.s.frameCount > this.start) {
            this.showSetup();
            if (this.s.frameCount >= this.disappearStart) {
                const t = this.s.constrain(this.disappearTimer.advance(), 0, 1);
                this.s.line(this.x1 + (this.x2 - this.x1) * t,
                    this.y1 + (this.y2 - this.y1) * t, this.x2, this.y2);
            } else {
                const t = this.s.constrain(this.timer.advance(), 0, 1);
                this.s.line(this.x1, this.y1,
                    this.x1 + (this.x2 - this.x1) * t,
                    this.y1 + (this.y2 - this.y1) * t);
            }
        }
    }
}

/**
 * Builds and plays a reverse, layer-by-layer backpropagation overlay on a
 * NeuralNetwork. Backward edges are drawn center-to-center above the network's
 * forward weights, while each activated layer turns a different orange shade.
 *
 * ----args list parameters----
 * @mandatory (NeuralNetwork) network; (number) start
 * @optional (number) seed, activationDuration, edgeDuration, fadeDuration,
 *                    edgeDisappearDuration, strokeweight, edgeAlpha,
 *                    maxWeightChange
 */
class Backpropagation {
    constructor(ctx, args) {
        this.s = ctx;
        this.network = args.network;
        this.start = args.start;
        this.activationDuration = args.activationDuration || 0.5;
        this.edgeDuration = args.edgeDuration || 0.5;
        this.fadeDuration = args.fadeDuration || 0.5;
        this.edgeDisappearDuration = args.edgeDisappearDuration || 0.5;
        this.strokeweight = args.strokeweight || 3;
        this.edgeAlpha = args.edgeAlpha;
        this.maxWeightChange = args.maxWeightChange || 0.25;
        this.seed = args.seed;
        this.random = this.seed === undefined ?
            () => this.s.random(-1, 1) : NeuralNetwork.seededWeightRandom(this.seed);
        this.edges = [];
        this.weights = [];
        this.forwardWeightChanges = [];
        this.activationStarts = [];
        this.edgeStarts = [];
        this.disappearanceStarts = [];
        this.layerActivated = [];
        this.layerFaded = [];
        this.weightUpdatesStarted = [];
        this.weightUpdates = [];
        this.finalLayerRestored = false;

        const lastLayer = this.network.layers.length - 1;
        const activationStep = frames(this.edgeDuration);
        for (let layer = lastLayer; layer >= 0; layer--) {
            const activationStart = this.start + (lastLayer - layer) * activationStep;
            this.activationStarts[layer] = activationStart;
            this.layerActivated[layer] = false;
            this.layerFaded[layer] = false;

            if (layer === 0)
                continue;

            const edgeStart = activationStart + frames(this.activationDuration) - 1;
            const disappearanceStart = edgeStart + frames(this.edgeDuration) + 1;
            this.edgeStarts[layer] = edgeStart;
            this.disappearanceStarts[layer] = disappearanceStart;
            this.weightUpdatesStarted[layer] = false;
            this.edges[layer] = [];
            this.weights[layer] = [];
            this.forwardWeightChanges[layer] = [];
            for (let from = 0; from < this.network.layers[layer]; from++) {
                this.edges[layer][from] = [];
                this.weights[layer][from] = [];
                for (let to = 0; to < this.network.layers[layer - 1]; to++) {
                    const source = this.network.neurons[layer][from];
                    const target = this.network.neurons[layer - 1][to];
                    const forwardEdge = this.network.edges[layer - 1][to][from];
                    const oldWeight = this.network.weights[layer - 1][to][from];
                    const newWeight = this.s.constrain(oldWeight +
                        this.random() * this.maxWeightChange, -1, 1);
                    const weightChange = newWeight - oldWeight;
                    const intensity = Math.abs(weightChange) / this.maxWeightChange;
                    const color = weightChange >= 0 ? [247, 227, 47] : [177, 107, 255];

                    this.weights[layer][from][to] = weightChange;
                    this.forwardWeightChanges[layer].push({
                        edge: forwardEdge,
                        oldWeight: oldWeight,
                        newWeight: newWeight,
                        from: to,
                        to: from
                    });
                    this.edges[layer][from][to] = new BackpropLine(this.s, {
                        x1: source.x,
                        y1: source.y,
                        x2: target.x,
                        y2: target.y,
                        start: edgeStart,
                        duration: this.edgeDuration,
                        mode: 1,
                        disappearStart: disappearanceStart,
                        disappearDuration: this.edgeDisappearDuration,
                        strokeweight: this.strokeweight * intensity,
                        color: [color[0], color[1], color[2],
                            this.edgeAlpha === undefined ? Math.round(intensity * 255) :
                                this.edgeAlpha]
                    });
                }
            }
        }
        this.finalLayerRestoreStart = this.disappearanceStarts[1];
    }

    activateLayer(layer) {
        for (let neuron of this.network.neurons[layer]) {
            const shade = (this.random() + 1) / 2;
            neuron.st.reColor([255, 70 + Math.round(shade * 170), 5 + Math.round(shade * 30)],
                this.activationDuration);
            neuron.ft.reColor([80 + Math.round(shade * 95), 20 + Math.round(shade * 65), 4],
                this.activationDuration);
        }
        this.layerActivated[layer] = true;
    }

    fadeLayer(layer) {
        for (let neuron of this.network.neurons[layer]) {
            neuron.st.reColor([217, 222, 229], this.fadeDuration);
            neuron.ft.reColor([49, 54, 61], this.fadeDuration);
        }
        this.layerFaded[layer] = true;
    }

    restoreFinalLayer() {
        for (let neuron of this.network.neurons[0]) {
            neuron.st.reColor([217, 222, 229], this.fadeDuration);
            neuron.ft.reColor([49, 54, 61], this.fadeDuration);
        }
        this.finalLayerRestored = true;
    }

    updateForwardWeights(layer) {
        const updates = [];
        for (let change of this.forwardWeightChanges[layer]) {
            const baseColor = change.newWeight >= 0 ? Blue : Red;

            change.edge.st.reColor([baseColor[0], baseColor[1], baseColor[2],
                Math.round(Math.abs(change.newWeight) * 255)], this.edgeDuration);
            updates.push({
                edge: change.edge,
                startStrokeweight: change.edge.timer_sw.sw,
                endStrokeweight: this.network.strokeweight * Math.abs(change.newWeight) *
                    this.network.edgeStrokeweightScale
            });
            this.network.weights[layer - 1][change.from][change.to] = change.newWeight;
        }
        this.weightUpdates[layer] = {
            timer: new Timer1(frames(this.edgeDuration)),
            updates: updates
        };
        this.weightUpdatesStarted[layer] = true;
    }

    advanceForwardWeightUpdates(layer) {
        const update = this.weightUpdates[layer];
        if (!update)
            return;

        const t = update.timer.advance();
        for (let item of update.updates)
            item.edge.timer_sw.sw = item.startStrokeweight +
                (item.endStrokeweight - item.startStrokeweight) * t;
    }

    show() {
        const lastLayer = this.network.layers.length - 1;
        for (let layer = lastLayer; layer >= 0; layer--) {
            if (!this.layerActivated[layer] &&
                this.s.frameCount >= this.activationStarts[layer])
                this.activateLayer(layer);

            if (layer > 0 && !this.weightUpdatesStarted[layer] &&
                this.s.frameCount > this.edgeStarts[layer])
                this.updateForwardWeights(layer);
            this.advanceForwardWeightUpdates(layer);

            // Clear each completed source layer when its yellow edges wipe away.
            if (layer > 0 && !this.layerFaded[layer] &&
                this.s.frameCount >= this.disappearanceStarts[layer])
                this.fadeLayer(layer);

            if (this.edges[layer])
                for (let outgoing of this.edges[layer])
                    for (let edge of outgoing)
                        edge.show();
        }

        if (!this.finalLayerRestored &&
            this.s.frameCount >= this.finalLayerRestoreStart)
            this.restoreFinalLayer();
    }
}

/**
 * Creates a reusable backpropagation animation for a NeuralNetwork.
 */
function animateBackpropagation(ctx, args) {
    return new Backpropagation(ctx, args);
}

/**
 * Replaces a group of existing Text/TextFade objects in one coordinated motion.
 * Old objects move down and fade out while new objects descend into their old
 * positions and fade in.
 *
 * ----args list parameters----
 * @mandatory (array) oldTexts, newStrings; (number) start
 * @optional (number) duration, offsetY
 */
class TextReplace {
    constructor(ctx, args) {
        this.s = ctx;
        this.oldTexts = args.oldTexts;
        this.newStrings = args.newStrings;
        this.start = args.start;
        this.duration = args.duration || 0.7;
        this.offsetY = args.offsetY || 45;
        this.started = false;
        this.newTexts = [];

        for (let i = 0; i < this.oldTexts.length; i++) {
            const oldText = this.oldTexts[i];
            this.newTexts[i] = new TextFade(this.s, {
                str: this.newStrings[i],
                x: oldText.x,
                y: oldText.y - this.offsetY,
                mode: oldText.mode,
                size: oldText.size,
                color: oldText.color.slice(),
                start: this.start,
                duration: this.duration,
                font: oldText.font
            });
        }
    }

    begin() {
        for (let i = 0; i < this.oldTexts.length; i++) {
            const oldText = this.oldTexts[i];
            const newText = this.newTexts[i];

            oldText.ft.fadeOut(this.duration);
            oldText.move(oldText.x, oldText.y + this.offsetY, this.duration, 1);
            newText.move(oldText.x, oldText.y, this.duration, 1);
        }
        this.started = true;
    }

    show() {
        if (!this.started && this.s.frameCount >= this.start)
            this.begin();

        for (let text of this.newTexts)
            text.show();
    }
}

/**
 * A reward represented by the rotating yellow, red-edged cube used for 3D
 * points in Linear Regression/part2_utils.js. The cube is rendered in a small
 * WEBGL buffer and composited onto an otherwise 2D scene.
 */
class RotatingRewardCube {
    constructor(ctx, args = {}) {
        this.s = ctx;
        this.x = args.x === undefined ? ctx.width / 2 : args.x;
        this.y = args.y === undefined ? ctx.height / 2 : args.y;
        this.size = args.size || 27;
        this.strokeweight = args.strokeweight || 2;
        this.start = args.start || 0;
        this.end = args.end === undefined ? Infinity : args.end;
        this.wiggleAmplitude = args.wiggleAmplitude === undefined ? 6 : args.wiggleAmplitude;
        this.wigglePeriod = args.wigglePeriod || 2.4;
        this.entryTimer = new Timer1(frames(args.entryDuration || 0.7));
        this.exitDuration = frames(args.exitDuration || 0.7);
        this.exitTimer = new Timer1(this.exitDuration);
        this.bufferSize = this.size * 3;
        this.g = this.s.createGraphics(this.bufferSize, this.bufferSize, this.s.WEBGL);
        this.g.pixelDensity(1);
    }

    show() {
        if (this.s.frameCount <= this.start ||
            this.s.frameCount >= this.end + this.exitDuration)
            return;

        const elapsed = this.s.frameCount - this.start;
        const entryScale = this.s.constrain(this.entryTimer.advance(), 0, 1);
        const exitScale = this.s.frameCount >= this.end ?
            1 - this.s.constrain(this.exitTimer.advance(), 0, 1) : 1;
        const scale = entryScale * exitScale;
        const displayY = this.y + this.wiggleAmplitude * Math.sin(
            this.s.TWO_PI * elapsed / frames(this.wigglePeriod)
        );
        this.g.clear();
        this.g.push();
        this.g.scale(scale);
        this.g.stroke(247, 77, 7);
        this.g.strokeWeight(this.strokeweight);
        this.g.fill(197, 197, 17);
        this.g.rotateX(elapsed / 17);
        this.g.rotateY(elapsed / 27);
        this.g.box(this.size);
        this.g.pop();

        this.s.push();
        this.s.imageMode(this.s.CENTER);
        this.s.image(this.g, this.x, displayY);
        this.s.pop();
    }
}
