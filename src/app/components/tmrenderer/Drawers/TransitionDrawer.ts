import Transition from "../../../../model/TM/Transition";
import IDrawer from "./IDrawer";
import * as p5 from "p5";
import StateDrawer from "./StateDrawer";

export default class TransitionDrawer implements IDrawer {
    private static readonly radiusX: number = 10;
    private static readonly radiusY: number = 17;
    private static readonly vertexRadius: number = 4;
    private static readonly drawingColor: any = { r: 255, g: 102, b: 0 };

    constructor(private transition: Transition, private currentStateDrawer: StateDrawer, private nextStateDrawer: StateDrawer) {
    }

    public draw(p: any, ctx: p5): void {
        if (this.transition.currentState === this.transition.nextState) {
            p.strokeWeight(0);

            let start = {
                x: this.currentStateDrawer.position.x,
                y: this.currentStateDrawer.position.y - this.currentStateDrawer.circleRadius
            };
            let end = {
                x: this.currentStateDrawer.position.x - 5,
                y: this.currentStateDrawer.position.y - this.currentStateDrawer.circleRadius
            };

            let edgeRight = {x: start.x + TransitionDrawer.radiusX, y: start.y - TransitionDrawer.radiusY};
            let edgeLeft = {x: end.x - TransitionDrawer.radiusX, y: start.y - TransitionDrawer.radiusY};


            p.strokeWeight(8);
            p.stroke(0);
            p.strokeWeight(2);


            p.noFill();
            p.stroke(TransitionDrawer.drawingColor.r, TransitionDrawer.drawingColor.g, TransitionDrawer.drawingColor.b);
            p.curve(start.x, start.y, start.x, start.y, edgeRight.x, edgeRight.y, edgeLeft.x, edgeLeft.y);
            p.curve(start.x, start.y, edgeRight.x, edgeRight.y, edgeLeft.x, edgeLeft.y, end.x, end.y);
            p.curve(edgeRight.x, edgeRight.y, edgeLeft.x, edgeLeft.y, end.x, end.y, end.x, end.y);

            this.drawTriangleEnd(p, ctx, edgeLeft, end);
        }
    }

    private drawTriangleEnd(p: any, ctx: p5, start: any, end: any) {
        let offset = TransitionDrawer.vertexRadius;

        p.stroke(TransitionDrawer.drawingColor.r, TransitionDrawer.drawingColor.g, TransitionDrawer.drawingColor.b);
        p.push() //start new drawing state
        let angle: number = Math.atan2(start.y - end.y, start.x - end.x); //gets the angle of the line
        p.translate(end.x, end.y); //translates to the destination vertex
        p.rotate(angle - ctx.HALF_PI); //rotates the arrow point
        p.triangle(-offset * 0.5, offset, offset * 0.5, offset, 0, -offset / 2); //draws the arrow point as a triangle
        p.pop();
    }
}
