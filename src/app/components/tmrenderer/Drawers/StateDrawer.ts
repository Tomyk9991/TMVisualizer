import State, {FinalState} from "../../../../model/TM/State";
import * as p5 from "p5";
import IDrawer from "./IDrawer";

export default class StateDrawer implements IDrawer {
    private static readonly minFontSize: number = 4;
    private static readonly maxFontSize: number = 30;
    private static readonly circleDiameter: number = 55;

    constructor(private _state: State, private _position: p5.Vector) {
    }


    get state(): State {
        return this._state;
    }

    get circleRadius(): number {
        return StateDrawer.circleDiameter / 2;
    }

    get position(): p5.Vector {
        return this._position;
    }

    public draw(p: any, ctx: p5): void {
        p.strokeWeight(3);

        if (this._state instanceof FinalState)
        {
            p.noFill();
            p.circle(this._position.x, this._position.y, 65);
        }

        p.fill(255);
        p.stroke(0);
        p.circle(this._position.x, this._position.y, StateDrawer.circleDiameter);
        let fontSize: number = ctx.map(this._state.Name.length, 1, 10, StateDrawer.maxFontSize, StateDrawer.minFontSize);
        p.textSize(fontSize);

        p.fill(0);
        p.strokeWeight(0.5);
        p.text(this._state.Name, this._position.x, this._position.y);
    }
}
