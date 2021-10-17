import State from "./State";


export enum TMDirection {
    Left = "L",
    Right = "R",
    Noop = "N",
    NotInitialized = "~"
}

export default class Transition {
    private _direction: TMDirection = TMDirection.NotInitialized;

    constructor(private _currentState: State, private _predicate: string, private _nextState: State, private _manipulationValue: string, direction: string) {
        if (direction === "L") { this._direction = TMDirection.Left; }
        else if (direction === "R") { this._direction = TMDirection.Right; }
        else if (direction === "N") { this._direction = TMDirection.Noop; }
    }
    
    get direction(): TMDirection {
        return this._direction;
    }

    get currentState(): State {
        return this._currentState;
    }

    get predicate(): string {
        return this._predicate;
    }

    get nextState(): State {
        return this._nextState;
    }

    get manipulationValue(): string {
        return this._manipulationValue;
    }
}

export class InitialTransition extends Transition {

}
