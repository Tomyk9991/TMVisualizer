import {Injectable} from '@angular/core';
import TuringMachine from "../../model/TM/TuringMachine";
import LiteEvent from "../../model/LiteEvent";

@Injectable({
    providedIn: 'root'
})
export class TMRendererService {
    private readonly onRegisterRender = new LiteEvent<TuringMachine>();

    public get OnRegisterRender() { return this.onRegisterRender.expose(); }

    constructor() {
    }

    public render(tm: TuringMachine): void {
        this.onRegisterRender.trigger(tm);
    }
}
