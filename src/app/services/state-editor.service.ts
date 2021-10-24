import {Injectable} from '@angular/core';
import LiteEvent from "../../model/LiteEvent";
import State from "../../model/TM/State";
import {StateTransitionEditorPair} from "./StateTransitionEditorPair";
import TuringMachine from "../../model/TM/TuringMachine";

@Injectable({
    providedIn: 'root'
})
export default class StateEditorService {
    private readonly onRegisterRender = new LiteEvent<StateTransitionEditorPair>();
    public get OnRegisterRender() { return this.onRegisterRender.expose(); }
    constructor() {
    }

    public render(state?: State, tm?: TuringMachine): void {
        this.onRegisterRender.trigger(new StateTransitionEditorPair(state, tm));
    }
}
