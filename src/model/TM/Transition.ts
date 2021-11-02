import State from "./State";


export enum TMDirection {
    Left = "L",
    Right = "R",
    Noop = "N",
    NotInitialized = "~"
}

export default class Transition {
    public direction: TMDirection = TMDirection.NotInitialized;

    constructor(public currentState: State, public predicate: string, public nextState: State, public manipulationValue: string, direction: string) {
        this.direction = Transition.stringToTMDirection(direction);
    }

    public static stringToTMDirection(value: string): TMDirection {
        value = value.toLowerCase();
        if (value === "l") { return TMDirection.Left; }
        else if (value === "r") { return TMDirection.Right; }
        else if (value === "n") { return TMDirection.Noop; }

        return TMDirection.NotInitialized;
    }

    // q_1, a -> q_3, a | R
    public toString(): string {
        return this.currentState.Name + ", " + this.predicate + " -> " + this.nextState.Name + ", " + this.manipulationValue + " | " + <string>this.direction;
    }
}
