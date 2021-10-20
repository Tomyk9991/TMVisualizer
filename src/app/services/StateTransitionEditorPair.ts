import State from "../../model/TM/State";
import Transition from "../../model/TM/Transition";
import TuringMachine from "../../model/TM/TuringMachine";

export class StateTransitionEditorPair {
    constructor(public state?: State, public transitions?: TuringMachine) {
    }
}
