import IDrawer from "./IDrawer";
import * as p5 from "p5";
import DrawerManager from "./managers/DrawerManager";

export default class TextDescriptionDrawer implements IDrawer {
    private displayText: string =
        "Press 'space' on a state to edit it\n" +
        "Press 'c' on an empty space to create a new state\n" +
        "Press 'r' to a state to delete the state";

    public constructor() {
        DrawerManager.drawQueue.push(this);
    }

    draw(p: any, ctx: p5): void {
        p.push();
        p.textSize(17);
        p.textAlign(p.LEFT, p.TOP);
        p.text(this.displayText, 5, 5);
        p.pop();
    }
}
