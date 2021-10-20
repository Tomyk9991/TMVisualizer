import State from "./State";
import Transition from "./Transition";

export default class TuringMachine {
    constructor(private _states: State[], private _input_alphabet: string[], private _tape_alphabet: string[], private _transitions: Transition[]) {
    }


    get states(): State[] {
        return this._states;
    }

    get input_alphabet(): string[] {
        return this._input_alphabet;
    }

    get tape_alphabet(): string[] {
        return this._tape_alphabet;
    }

    public setTransitions(t:Transition[]): void  {
        this._transitions = t;
    }

    get transitions(): Transition[] {
        return this._transitions;
    }
}
