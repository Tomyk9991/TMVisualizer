import IDrawer from "./IDrawer";
import * as p5 from "p5";
import DrawerManager from "./managers/DrawerManager";
import {I18nService} from "../../../services/i18n.service";

export default class TextDescriptionDrawer implements IDrawer {
    private displayText: string = "";

    public constructor() {
        DrawerManager.drawQueue.push(this);
        this.displayText = I18nService.Instance.lookUp("using-description")
    }

    draw(p: any, ctx: p5): void {
        p.push();
        p.textSize(17);
        p.stroke(255);
        p.strokeWeight(0);
        p.fill(255);
        p.textAlign(p.LEFT, p.TOP);
        p.text(this.displayText, 5, 5);
        p.pop();
    }
}
