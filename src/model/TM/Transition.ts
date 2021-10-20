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
}


// TODO Make Initial position work in state editor and drawer
export class InitialTransition extends Transition {

}
