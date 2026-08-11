/**
 * Draws and fills a single-path SVG directly on the canvas.
 *
 * `start` is an absolute scene frame. All other timing arguments are offsets
 * in seconds relative to `start`; they are not absolute scene times. In
 * particular, `fillStart: 0.5` with `start: frames(3)` begins filling at scene
 * time 3.5 seconds. The fill may overlap the outline while it is being drawn.
 * `strokeweight` is measured in canvas pixels and is compensated for the SVG's
 * scale. After drawing finishes, its stroke width tapers to zero over
 * `outlineFadeDuration` seconds.
 *
 * ----args list parameters----
 * @mandatory (string) svg or pathData; (number) x, y, w
 * @optional (number) h, start [in frames], outlineStart, outlineDuration,
 *           outlineFadeDuration, fillStart, fillDuration, strokeweight;
 *           (array) outlineColor, fillColor, viewBox; (string) fillRule
 */
class AnimatedSVGPath {
    constructor(ctx, args) {
        this.s = ctx;
        this.x = args.x;
        this.y = args.y;
        this.w = args.w;
        this.start = args.start === undefined ? 0 : Math.floor(args.start);

        const svg = args.svg || "";
        const pathMatch = svg.match(/<path\b[^>]*\sd=(["'])([\s\S]*?)\1/);
        this.pathData = args.pathData || (pathMatch ? pathMatch[2] : undefined);
        if (!this.pathData)
            throw new Error("AnimatedSVGPath requires SVG source with one path or pathData.");

        const viewBoxMatch = svg.match(/\sviewBox=(["'])([^"']+)\1/i);
        this.viewBox = args.viewBox || (viewBoxMatch ?
            viewBoxMatch[2].trim().split(/[ ,]+/).map(Number) : [0, 0, 24, 24]);
        this.h = args.h === undefined ? this.w * this.viewBox[3] / this.viewBox[2] : args.h;

        this.outlineStartOffset = frames(args.outlineStart || 0);
        this.outlineDuration = frames(
            args.outlineDuration === undefined ? 1 : args.outlineDuration
        );
        this.outlineFadeDuration = frames(
            args.outlineFadeDuration === undefined ? 0.5 : args.outlineFadeDuration
        );
        this.fillStartOffset = frames(args.fillStart === undefined ? 0.5 : args.fillStart);
        this.fillDuration = frames(
            args.fillDuration === undefined ? 0.7 : args.fillDuration
        );
        this.outlineColor = args.outlineColor || [255, 255, 255, 255];
        this.fillColor = args.fillColor || [255, 255, 255, 255];
        this.strokeweight = args.strokeweight === undefined ? 0.8 : args.strokeweight;
        this.fillRule = args.fillRule || "evenodd";

        this.path = new Path2D(this.pathData);
        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("d", this.pathData);
        svgElement.setAttribute("width", "0");
        svgElement.setAttribute("height", "0");
        svgElement.style.position = "absolute";
        svgElement.style.visibility = "hidden";
        svgElement.appendChild(pathElement);
        document.body.appendChild(svgElement);
        this.pathLength = pathElement.getTotalLength();
        svgElement.remove();
    }

    colorString(color, opacity) {
        const alpha = (color[3] === undefined ? 255 : color[3]) / 255;
        return "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," +
            alpha * opacity + ")";
    }

    show() {
        const elapsed = this.s.frameCount - this.start;
        if (elapsed < 0)
            return;

        const outlineProgress = this.s.constrain(
            (elapsed - this.outlineStartOffset) / this.outlineDuration, 0, 1
        );
        const outlineFadeProgress = this.s.constrain(
            (elapsed - this.outlineStartOffset - this.outlineDuration) /
                this.outlineFadeDuration,
            0,
            1
        );
        const fillProgress = this.s.constrain(
            (elapsed - this.fillStartOffset) / this.fillDuration, 0, 1
        );
        const context = this.s.drawingContext;
        const scaleX = this.w / this.viewBox[2];
        const scaleY = this.h / this.viewBox[3];
        const strokeScale = (Math.abs(scaleX) + Math.abs(scaleY)) / 2;

        this.s.push();
        this.s.translate(this.x, this.y);
        this.s.scale(scaleX, scaleY);
        this.s.translate(-this.viewBox[0], -this.viewBox[1]);

        if (fillProgress > 0) {
            context.fillStyle = this.colorString(this.fillColor, fillProgress);
            context.fill(this.path, this.fillRule);
        }

        if (outlineProgress > 0 && outlineFadeProgress < 1) {
            context.strokeStyle = this.colorString(this.outlineColor, 1);
            context.lineWidth = this.strokeweight * (1 - outlineFadeProgress) /
                strokeScale;
            context.lineJoin = "round";
            context.lineCap = "round";
            context.setLineDash([this.pathLength, this.pathLength]);
            context.lineDashOffset = this.pathLength * (1 - outlineProgress);
            context.stroke(this.path);
            context.setLineDash([]);
            context.lineDashOffset = 0;
        }
        this.s.pop();
    }
}
