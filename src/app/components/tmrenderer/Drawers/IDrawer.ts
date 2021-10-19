import * as p5 from "p5";

export default interface IDrawer {
    draw(p: any, ctx: p5): void;
    interact(p: any, ctx: p5): void;
}
