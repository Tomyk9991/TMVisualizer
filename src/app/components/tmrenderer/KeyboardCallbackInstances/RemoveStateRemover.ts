import IKeyboardCallback from "../Drawers/IKeyboardCallback";
import * as p5 from "p5";
import DrawerManager from "../Drawers/managers/DrawerManager";
import StateDrawer from "../Drawers/StateDrawer";
import IDrawer from "../Drawers/IDrawer";
import TuringMachine from "../../../../model/TM/TuringMachine";
import {TMRendererService} from "../../../services/t-m-renderer.service";
import KeyboardCallbackManager from "../Drawers/managers/KeyboardCallbackManager";
import {removePosition, TMRendererComponent} from "../tmrenderer.component";
import {StateEditorComponent} from "../state-editor/state-editor.component";

export default class RemoveStateRemover implements IKeyboardCallback {
    public constructor(private tm: TuringMachine, private renderer: TMRendererService) {
        KeyboardCallbackManager.callbacks.push(this);
    }

    private isStateDrawer(drawer: StateDrawer | IDrawer): drawer is StateDrawer {
        return drawer instanceof StateDrawer;
    }

    keyPressed(ctx: p5, key: string): void {
        if(key !== 'r'  || StateEditorComponent.hasState()) return;

        let mouseVector: p5.Vector = ctx.createVector(ctx.mouseX, ctx.mouseY);
        let stateDrawer: StateDrawer | undefined = undefined;

        let isMouseOnState: boolean = DrawerManager.drawQueue.some(d => {
            if (this.isStateDrawer(d)) {
                let mouseVector: p5.Vector = ctx.createVector(ctx.mouseX, ctx.mouseY);
                if((p5.Vector.dist(d.position, mouseVector) < d.circleRadius)) {
                    stateDrawer = d;
                    return true;
                }
            }
            return false;
        });

        if (isMouseOnState) {
            let iState: StateDrawer = (<StateDrawer><unknown>stateDrawer);


            this.tm.setTransitions(this.tm.transitions.filter(t => t.currentState != stateDrawer?.state && t.nextState != stateDrawer?.state));
            removePosition(iState.position);
            this.tm.states = this.tm.states.filter(state => state != iState.state);

            this.renderer.render(this.tm);
        }
    }

}
