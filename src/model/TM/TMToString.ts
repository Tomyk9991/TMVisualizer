import TuringMachine from "./TuringMachine";
import {FileStructure} from "./FileStructure";
import {FinalState, InitialState} from "./State";

export default function constructFromTM(tm: TuringMachine, optionalComments: string[], optionalCompilerHints: string[], fileStructure: FileStructure[]): string {
    console.log("Optional Comments:\n" + optionalComments);
    console.log("Optional compiler hints:\n" + optionalCompilerHints);

    let target: string = "";
    let commentsCount: number = 0;
    let hintCount: number = 0;
    let transitions: string = tm.transitions.map(transition => "\t\t\t\t\t"
        + transition.currentState.Name + ", " + transition.predicate + "      -> "
        + transition.nextState.Name + ", " + transition.manipulationValue + ", " + <string>transition.direction).join('\n');
    let startState: string = tm.states.filter(s => s instanceof InitialState).map(s => s.Name).join(',');
    let finalStates: string = tm.states.filter(s => s instanceof FinalState).map(s => s.Name).join(',');

    for (let i = 0; i < fileStructure.length; i++) {
        let lineStructure: FileStructure = fileStructure[i];

        switch (lineStructure) {
            case FileStructure.Comment:
                target += optionalComments[commentsCount] + "\n";
                commentsCount++;
                break;
            case FileStructure.CompilerHint:
                target += optionalCompilerHints[hintCount] + "\n";
                hintCount++;
                break;
            case FileStructure.InputAlphabet:
                target += ("input_alphabet = \t" + tm.input_alphabet.join(',') + "\n");
                break;
            case FileStructure.Transitions:
                target += ("transitions =\t\t\t\t\t" + transitions + "\n");
                break;
            case FileStructure.StartState:
                target += ("start_state = \t" + startState + "\n");
                break;
            case FileStructure.FinishingState:
                target += ("\"acc_states = \t" + finalStates + "\n");
                break;
        }
    }

    console.log("Final Turing machine:\n" + target);
    return target;
}
