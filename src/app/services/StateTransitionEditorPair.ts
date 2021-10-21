import State from "../../model/TM/State";
import TuringMachine from "../../model/TM/TuringMachine";

export class StateTransitionEditorPair {
    constructor(public state?: State, public transitions?: TuringMachine) {
    }
}
