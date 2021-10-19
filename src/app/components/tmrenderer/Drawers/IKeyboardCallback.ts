import * as p5 from "p5";

export default interface IKeyboardCallback {
    keyPressed(ctx: p5, key: string): void;
}
