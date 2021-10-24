import IKeyboardCallback from "../Drawers/IKeyboardCallback";
import * as p5 from "p5";
import StateDrawer from "../Drawers/StateDrawer";
import KeyboardCallbackManager from "../Drawers/managers/KeyboardCallbackManager";
import DrawerManager from "../Drawers/managers/DrawerManager";
import IDrawer from "../Drawers/IDrawer";
import TuringMachine from "../../../../model/TM/TuringMachine";
import {TMRendererService} from "../../../services/t-m-renderer.service";
import State from "../../../../model/TM/State";
import {StateEditorComponent} from "../state-editor/state-editor.component";

export default class CreateStateCreater implements IKeyboardCallback {
    public static statePosition: p5.Vector | undefined = undefined;
    public constructor(private tm: TuringMachine, private renderer: TMRendererService) {
        KeyboardCallbackManager.callbacks.push(this);
    }

    private isStateDrawer(drawer: StateDrawer | IDrawer): drawer is StateDrawer {
        return drawer instanceof StateDrawer;
    }

    public keyPressed(ctx: p5, key: string): void {
        if(key !== 'c' || StateEditorComponent.hasState()) return;
        let mouseVector: p5.Vector = ctx.createVector(ctx.mouseX, ctx.mouseY);

        let isMouseOnState: boolean = DrawerManager.drawQueue.some(d => {
            if (this.isStateDrawer(d)) {
                let mouseVector: p5.Vector = ctx.createVector(ctx.mouseX, ctx.mouseY);
                return (p5.Vector.dist(d.position, mouseVector) < d.circleRadius);
            }

            return false;
        });

        if (!isMouseOnState) {
            CreateStateCreater.statePosition = mouseVector;
            let i: number = this.tm.states.length;
            let name: string = `q_${i}`;

            while (this.tm.states.some(s => s.Name === name)) {
                i++;
                name = `q_${i}`;
            }

            let state: State = new State(name);
            this.tm.states.push(state);

            this.renderer.render(this.tm);
        }
    }
}
