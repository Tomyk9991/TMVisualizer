import State, {FinalState} from "../../../../model/TM/State";
import * as p5 from "p5";
import IDrawer from "./IDrawer";
import DrawerManager from "./managers/DrawerManager";
import IInteractable from "./IInteractable";
import InteractableManager from "./managers/InteractableManager";
import IKeyboardCallback from "./IKeyboardCallback";
import KeyboardCallbackManager from "./managers/KeyboardCallbackManager";

export default class StateDrawer implements IDrawer, IInteractable, IKeyboardCallback {
    private static readonly minFontSize: number = 4;
    private static readonly maxFontSize: number = 30;
    private static readonly circleDiameter: number = 55;

    private mouseOverlapping: boolean = false;
    private normalColor: any = {r: 0, g: 0, b: 0};
    private overLappingColor: any = { r: 255, g: 0, b: 0};
    private isMouseTargeted: boolean = false;

    private static targetInstance: StateDrawer | null = null;

    constructor(private _state: State, private _position: p5.Vector) {
        DrawerManager.drawQueue.push(this);
        InteractableManager.interactables.push(this);
        KeyboardCallbackManager.callbacks.push(this);
    }

    get state(): State { return this._state; }

    get circleRadius(): number { return StateDrawer.circleDiameter / 2; }

    get position(): p5.Vector { return this._position; }

    public draw(p: any, ctx: p5): void {
        p.strokeWeight(3);

        if (this._state instanceof FinalState)
        {
            p.noFill();
            if (this.mouseOverlapping) {
                p.stroke(this.overLappingColor.r, this.overLappingColor.g, this.overLappingColor.b);
            } else {
                p.stroke(this.normalColor.r, this.normalColor.g, this.normalColor.b);
            }
            p.circle(this._position.x, this._position.y, 65);
        }

        p.fill(255);
        if (this.mouseOverlapping) {
            p.stroke(this.overLappingColor.r, this.overLappingColor.g, this.overLappingColor.b);
        } else {
            p.stroke(this.normalColor.r, this.normalColor.g, this.normalColor.b);
        }
        p.circle(this._position.x, this._position.y, StateDrawer.circleDiameter);
        let fontSize: number = ctx.map(this._state.Name.length, 1, 10, StateDrawer.maxFontSize, StateDrawer.minFontSize);
        p.textSize(fontSize);

        p.fill(0);
        p.strokeWeight(0.5);
        p.text(this._state.Name, this._position.x, this._position.y);
    }

    interact(p: any, ctx: p5): void {
        if (this == StateDrawer.targetInstance || StateDrawer.targetInstance == null) {

            let mouseVector: p5.Vector = ctx.createVector(p.mouseX, p.mouseY);
            if ((p5.Vector.dist(this.position, mouseVector) < this.circleRadius)) {
                this.mouseOverlapping = true;
            } else {
                this.mouseOverlapping = false;
            }

            if (p.mouseIsPressed && (this.mouseOverlapping || this.isMouseTargeted)) {
                this.isMouseTargeted = true;
                StateDrawer.targetInstance = this;
            } else {
                this.isMouseTargeted = false;
                StateDrawer.targetInstance = null;
            }

            if (this.isMouseTargeted && p.mouseButton === p.LEFT) {
                this.position.x = p.mouseX;
                this.position.y = p.mouseY;
            }
        }
    }

    keyPressed(ctx: p5, key: string): void {
        if (this.mouseOverlapping && key == ' ') {
        }
    }
}
