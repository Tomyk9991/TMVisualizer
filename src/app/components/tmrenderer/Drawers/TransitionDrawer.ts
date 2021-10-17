import Transition from "../../../../model/TM/Transition";
import IDrawer from "./IDrawer";
import * as p5 from "p5";
import StateDrawer from "./StateDrawer";

export default class TransitionDrawer implements IDrawer {
    private static readonly radiusX: number = 10;
    private static readonly radiusY: number = 17;
    private static readonly initialOffset: number = 5;
    private static readonly vertexRadius: number = 4;
    private static readonly drawingColor: any = {r: 255, g: 102, b: 0};
    private static readonly localMin: number = 100;
    private static maxDiameter: number = 0;


    private static readonly positions: p5.Vector[] = [];

    private textPosition: p5.Vector;

    constructor(private transition: Transition, private currentStateDrawer: StateDrawer, private nextStateDrawer: StateDrawer, private ctx: p5) {
        if(TransitionDrawer.maxDiameter === 0) {
            TransitionDrawer.maxDiameter = Math.sqrt(ctx.width * ctx.width + ctx.height * ctx.height)
        }

        this.textPosition = ctx.createVector(
            this.currentStateDrawer.position.x,
            this.currentStateDrawer.position.y - this.currentStateDrawer.circleRadius - (TransitionDrawer.radiusY * 2)
        );

        while (true) {
            let contains: boolean = TransitionDrawer.positions.filter(vec => p5.Vector.dist(vec, this.textPosition) <= 3).length > 0;

            if (contains) {
                this.textPosition.y -= 25;
            } else {
                TransitionDrawer.positions.push(this.textPosition);
                break;
            }
        }
    }

    public draw(p: any, ctx: p5): void {
        if (this.transition.currentState === this.transition.nextState) {
            p.strokeWeight(0);

            let start = {
                x: this.currentStateDrawer.position.x + TransitionDrawer.initialOffset,
                y: this.currentStateDrawer.position.y - this.currentStateDrawer.circleRadius
            };
            let end = {
                x: this.currentStateDrawer.position.x - TransitionDrawer.initialOffset,
                y: this.currentStateDrawer.position.y - this.currentStateDrawer.circleRadius
            };

            let edgeRight = {
                x: start.x + TransitionDrawer.radiusX,
                y: start.y - TransitionDrawer.radiusY
            };

            let edgeLeft = {
                x: end.x - TransitionDrawer.radiusX,
                y: start.y - TransitionDrawer.radiusY
            };


            p.strokeWeight(8);
            p.stroke(0);
            p.strokeWeight(2);


            p.noFill();
            p.stroke(TransitionDrawer.drawingColor.r, TransitionDrawer.drawingColor.g, TransitionDrawer.drawingColor.b);
            p.curve(start.x, start.y, start.x, start.y, edgeRight.x, edgeRight.y, edgeLeft.x, edgeLeft.y);
            p.curve(start.x, start.y, edgeRight.x, edgeRight.y, edgeLeft.x, edgeLeft.y, end.x, end.y);
            p.curve(edgeRight.x, edgeRight.y, edgeLeft.x, edgeLeft.y, end.x, end.y, end.x, end.y);

            this.drawTriangleEnd(p, ctx, edgeLeft, end, TransitionDrawer.vertexRadius);

            p.stroke(255);
            p.fill(255);
            p.strokeWeight(0.01);
            p.text(this.transition.predicate + "|" + this.transition.manipulationValue + ", " + <string>this.transition.direction, this.textPosition.x, this.textPosition.y);
        } else {
            let direction: p5.Vector = p5.Vector.sub(this.nextStateDrawer.position, this.currentStateDrawer.position);
            p.strokeWeight(8);

            let start: p5.Vector = p5.Vector.add(this.currentStateDrawer.position, direction.setMag(this.currentStateDrawer.circleRadius));
            let end: p5.Vector = p5.Vector.add(this.nextStateDrawer.position, direction.mult(-1).setMag(this.nextStateDrawer.circleRadius));

            let dist: number = p5.Vector.dist(start, end);
            let amplitude: number = ctx.map(dist, 0, TransitionDrawer.maxDiameter, 0, TransitionDrawer.localMin);

            let dirNor: p5.Vector = direction.normalize();

            let edge1: p5.Vector = p5.Vector.lerp(start, end, 0.33);
            edge1.y -= ctx.lerp(0, amplitude, dirNor.x);
            edge1.x += ctx.lerp(0, amplitude, dirNor.y);

            let edge2: p5.Vector = p5.Vector.lerp(start, end, 0.66);
            edge2.y -= ctx.lerp(0, amplitude, dirNor.x);
            edge2.x += ctx.lerp(0, amplitude, dirNor.y);

            p.strokeWeight(8);
            p.stroke(0);
            p.strokeWeight(2);

            p.noFill();
            p.stroke(TransitionDrawer.drawingColor.r, TransitionDrawer.drawingColor.g, TransitionDrawer.drawingColor.b);
            p.curve(start.x, start.y, start.x, start.y, edge1.x, edge1.y, edge2.x, edge2.y);
            p.curve(start.x, start.y, edge1.x, edge1.y, edge2.x, edge2.y, end.x, end.y);
            p.curve(edge1.x, edge1.y, edge2.x, edge2.y, end.x, end.y, end.x, end.y);

            this.drawTriangleEnd(p, ctx, edge2, end, TransitionDrawer.vertexRadius * 2);
        }
    }

    private drawTriangleEnd(p: any, ctx: p5, start: any, end: any, vertexRadius: number) {
        let offset = vertexRadius;

        p.stroke(TransitionDrawer.drawingColor.r, TransitionDrawer.drawingColor.g, TransitionDrawer.drawingColor.b);
        p.push() //start new drawing state

        p.fill(TransitionDrawer.drawingColor.r, TransitionDrawer.drawingColor.g, TransitionDrawer.drawingColor.b);
        let angle: number = Math.atan2(start.y - end.y, start.x - end.x);
        p.translate(end.x, end.y);
        p.rotate(angle - ctx.HALF_PI);
        p.triangle(-offset * 0.5, offset, offset * 0.5, offset, 0, -offset / 2);
        p.pop();
    }
}
