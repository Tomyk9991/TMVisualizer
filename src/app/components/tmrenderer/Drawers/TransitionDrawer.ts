import Transition from "../../../../model/TM/Transition";
import IDrawer from "./IDrawer";
import * as p5 from "p5";
import StateDrawer from "./StateDrawer";
import {hexToRGB} from "../../../../utils/utilFunctions";
import IRenderPipelineComponent from "./IRenderPipelineComponent";
import RenderPipelineManager from "./managers/RenderPipelineManager";
import DrawerManager from "./managers/DrawerManager";

class TextColorPair {
    constructor(public text: string, public color: any) {
    }
}

export default class TransitionDrawer implements IDrawer, IRenderPipelineComponent {
    private static readonly radiusX: number = 10;
    private static readonly radiusY: number = 17;
    private static readonly initialOffset: number = 5;
    public static readonly vertexRadius: number = 4;
    private static readonly localMin: number = 300;
    public static drawingColor: any = {r: 194, g: 24, b: 91};
    private static maxDiameter: number = 0;

    private static positions: p5.Vector[] = [];
    private static cleanUpPositions: boolean = false;

    private textPosition: p5.Vector;


    private baseColorText: any = {
        r: 255,
        g: 255,
        b: 255,
    };

    private highlightColorText: any = {
        r: 194 + 100,
        g: 24 + 100,
        b: 91 + 100,
    };

    constructor(private transition: Transition, private currentStateDrawer: StateDrawer, private nextStateDrawer: StateDrawer, private ctx: p5) {
        RenderPipelineManager.rpcs.push(this);
        DrawerManager.drawQueue.push(this);


        if (TransitionDrawer.maxDiameter === 0) {
            TransitionDrawer.maxDiameter = Math.sqrt(ctx.width * ctx.width + ctx.height * ctx.height);

            TransitionDrawer.drawingColor = {r: 255, g: 102, b: 0};
            TransitionDrawer.drawingColor = hexToRGB(getComputedStyle(document.documentElement).getPropertyValue("--primary").trim());
        }

        this.textPosition = ctx.createVector();
    }

    onStartFrame(): void {
        TransitionDrawer.cleanUpPositions = false;
    }

    onFinishFrame(): void {
        if (!TransitionDrawer.cleanUpPositions) {
            TransitionDrawer.positions = [];
            TransitionDrawer.cleanUpPositions = true;
        }
    }

    private calculateTextPosition(): p5.Vector {
        let textPosition: p5.Vector;
        if (this.transition.currentState === this.transition.nextState) {
            textPosition = this.ctx.createVector(
                this.currentStateDrawer.position.x,
                this.currentStateDrawer.position.y - this.currentStateDrawer.circleRadius - (TransitionDrawer.radiusY * 2)
            );
        } else {
            let textPos = this.linearTransformationLerp(0.5);

            textPosition = this.ctx.createVector(
                textPos.x,
                textPos.y
            );
        }

        while (true) {
            let contains: boolean = TransitionDrawer.positions.filter(vec => p5.Vector.dist(vec, textPosition) <= 3).length > 0;

            if (contains) {
                textPosition.y -= 25;
            } else {
                TransitionDrawer.positions.push(textPosition);
                break;
            }
        }

        return textPosition;
    }

    public draw(p: any, ctx: p5): void {
        this.textPosition = this.calculateTextPosition();

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

            TransitionDrawer.drawTriangleEnd(p, ctx, edgeLeft, end, TransitionDrawer.vertexRadius);
        } else {
            let direction: p5.Vector = p5.Vector.sub(this.nextStateDrawer.position, this.currentStateDrawer.position);
            p.strokeWeight(8);

            let start: p5.Vector = p5.Vector.add(this.currentStateDrawer.position, direction.setMag(this.currentStateDrawer.circleRadius));
            let end: p5.Vector = p5.Vector.add(this.nextStateDrawer.position, direction.mult(-1).setMag(this.nextStateDrawer.circleRadius));

            let edge1: p5.Vector = this.linearTransformationLerp(0.33);
            let edge2: p5.Vector = this.linearTransformationLerp(0.66);

            p.strokeWeight(8);
            p.stroke(0);
            p.strokeWeight(2);

            p.noFill();
            p.stroke(TransitionDrawer.drawingColor.r, TransitionDrawer.drawingColor.g, TransitionDrawer.drawingColor.b);
            p.curve(start.x, start.y, start.x, start.y, edge1.x, edge1.y, edge2.x, edge2.y);
            p.curve(start.x, start.y, edge1.x, edge1.y, edge2.x, edge2.y, end.x, end.y);
            p.curve(edge1.x, edge1.y, edge2.x, edge2.y, end.x, end.y, end.x, end.y);

            TransitionDrawer.drawTriangleEnd(p, ctx, edge2, end, TransitionDrawer.vertexRadius * 2);
        }


        p.stroke(255);
        p.fill(255);
        p.strokeWeight(0.01);

        this.colorText([
            new TextColorPair(this.transition.predicate, this.highlightColorText),
            new TextColorPair("|", this.baseColorText),
            new TextColorPair(this.transition.manipulationValue, this.highlightColorText),
            new TextColorPair(",", this.baseColorText),
            new TextColorPair(<string>this.transition.direction, this.baseColorText)
        ], this.textPosition.x, this.textPosition.y);
    }

    private colorText(text_array: TextColorPair[], x: number, y: number): void {
        let pos_x: number = x - 30;

        this.ctx.textFont("monospace");

        for (let i = 0; i < text_array.length; ++i) {
            let part: TextColorPair = text_array[i];
            let t: string = part.text;
            let c: any = part.color;
            let w: number = (Math.ceil(t.length / 2)) * 20;
            this.ctx.fill(c.r, c.g, c.b);
            this.ctx.text(t, pos_x, y);
            pos_x += w;
        }

        this.ctx.textFont("sans-serif");
    }

    private linearTransformationLerp(lerpValue: number): p5.Vector {
        if (!this.nextStateDrawer) {
            console.log("something unexpetected undefined");
        }
        let direction: p5.Vector = p5.Vector.sub(this.nextStateDrawer.position, this.currentStateDrawer.position);

        let start: p5.Vector = p5.Vector.add(this.currentStateDrawer.position, direction.setMag(this.currentStateDrawer.circleRadius));
        let end: p5.Vector = p5.Vector.add(this.nextStateDrawer.position, direction.mult(-1).setMag(this.nextStateDrawer.circleRadius));

        let dist: number = p5.Vector.dist(start, end);
        let amplitude: number = this.ctx.map(dist, 0, TransitionDrawer.maxDiameter, 0, TransitionDrawer.localMin);

        let dirNor: p5.Vector = direction.normalize();

        let position: p5.Vector = p5.Vector.lerp(start, end, lerpValue);
        position.y -= this.ctx.lerp(0, amplitude, dirNor.x);
        position.x += this.ctx.lerp(0, amplitude, dirNor.y);
        return position;
    }

    public static drawTriangleEnd(p: any, ctx: p5, start: any, end: any, vertexRadius: number) {
        let offset = vertexRadius;

        p.stroke(TransitionDrawer.drawingColor.r, TransitionDrawer.drawingColor.g, TransitionDrawer.drawingColor.b);
        p.push() //start new drawing transitionentry

        p.fill(TransitionDrawer.drawingColor.r, TransitionDrawer.drawingColor.g, TransitionDrawer.drawingColor.b);
        let angle: number = Math.atan2(start.y - end.y, start.x - end.x);
        p.translate(end.x, end.y);
        p.rotate(angle - ctx.HALF_PI);
        p.triangle(-offset * 0.5, offset, offset * 0.5, offset, 0, -offset / 2);
        p.pop();
    }
}
