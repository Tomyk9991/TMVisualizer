import * as p5 from "p5";

export default interface IInteractable {
    interact(p: any, ctx: p5): void;
}
