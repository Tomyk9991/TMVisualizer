import State, {FinalState, InitialState} from "./State";
import Transition from "./Transition";
import TuringMachine from "./TuringMachine";

export default function constructFromString(target: string): TuringMachine {
    let lines: string[] = target.split('\n');
    lines = removeComments(lines);
    lines = removeCompilerHintCharacters(lines);
    lines = removeLeadingEmptyLines(lines);
    // lines = removeSpaces(lines);


    // console.log(lines.join('\n'));

    let input_alphabet: string[] = filterFor('input_alphabet', lines);
    let tape_alphabet: string[] = filterForTapeAlphabet(lines);

    let start_state: string = filterFor("start_state", lines)[0];
    let acc_states: string[] = filterFor("acc_states", lines);

    let states: State[] = filterForStates(lines, start_state, acc_states);
    let transitions: Transition[] = filterForTransitions(lines, states);


    // console.log("Input alphabet: ", input_alphabet);
    // console.log("Tape alphabet: ", tape_alphabet);
    // console.log("Start transitionentry: ", start_state);
    // console.log("Final states: ", acc_states);
    // console.log("States: ", states);
    // console.log("Transitions: ", transitions);

    return new TuringMachine(states, input_alphabet, tape_alphabet, transitions)
}

function filterForTransitions(lines: string[], states: State[]): Transition[] {
    let transitions: Transition[] = [];
    for (let i = 0; i < lines.length; i++) {
        let line: string = lines[i];
        if (line.includes("transitions")) {
            line = line.replace("transitions", " ".repeat(11)).replace("=", " ");
        }

        if (line.includes("->")) {
            line = line.trim();
            let transitionSides: string[] = line.split("->");

            let stateStr: string = transitionSides[0].split(',')[0].trim();
            let tapeLetter: string = transitionSides[0].split(',')[1].trim();

            let nextStateStr: string = transitionSides[1].split(',')[0].trim();
            let manipulationValue: string = transitionSides[1].split(',')[1].trim();
            let tmDirection: string = transitionSides[1].split(',')[2].trim();

            let targetState: State = <State>states.find((value: State) => value.Name === stateStr);
            let nextState: State = <State>states.find((value: State) => value.Name === nextStateStr);

            transitions.push(new Transition(targetState, tapeLetter, nextState, manipulationValue, tmDirection));
        }
    }

    return transitions;
}

function filterForTapeAlphabet(lines: string[]): string[] {
    let tapeAlphabet: Set<string> = new Set<string>();

    for (let i = 0; i < lines.length; i++) {
        let line: string = lines[i];
        if (line.includes("transitions")) {
            line = line.replace("transitions", " ".repeat(11)).replace("=", " ");
        }

        if (line.includes("->")) {
            line = line.trim();
            let tapeLetter: string = line.split("->")[0].split(',')[1].trim();
            let tapeLetter2: string = line.split("->")[1].split(',')[1].trim();
            tapeAlphabet.add(tapeLetter);
            tapeAlphabet.add(tapeLetter2);
        }
    }

    return Array.from(tapeAlphabet.values());
}

function filterForStates(lines: string[], startState: string, acc_states: string[]): State[] {
    let states: Set<string> = new Set<string>();

    states.add(startState);

    for (let i = 0; i < lines.length; i++) {
        let line: string = lines[i];
        if (line.includes("transitions")) {
            line = line.replace("transitions", " ".repeat(11)).replace("=", " ");
        }

        if (line.includes("->")) {
            line = line.trim();
            let state: string = line.split("->")[0].split(',')[0].trim();

            states.add(state);
        }
    }

    for (let i = 0; i < acc_states.length; i++) {
        states.add(acc_states[i]);
    }

    return Array.from(states.values()).map(value => {
        return value === startState ? new InitialState(value)
            : acc_states.includes(value) ? new FinalState(value)
                : new State(value);
    });
}

function filterFor(stringTarget: string, lines: string[]): string[] {
    for (let i = 0; i < lines.length; i++) {
        let line: string = lines[i];

        if (line.includes(stringTarget)) {
            let targetValues: string = removeSpaces_(line.split("=")[1]);
            return targetValues.split(",");
        }
    }
    return [];
}

function removeLeadingEmptyLines(lines: string[]): string[] {
    while (lines[0].length === 0) {
            lines.splice(0, 1);
    }

    return lines;
}

function removeCompilerHintCharacters(lines: string[]): string[] {
    let a: string[] = [];
    let eatLine: boolean = false;

    for (let i = 0; i < lines.length; i++) {
        let line: string = lines[i];

        if (line.includes("\"\"\"")) { // search for next """
            if (line.trim() === "\"\"\"") {
                eatLine = !eatLine;
                continue;
            } else {
                let temp: string = line.trim();
                let start = temp.indexOf("\"\"\"");
                let end = temp.lastIndexOf("\"\"\"");
                if (start != end) {
                    continue;
                }
            }
        }

        if (!eatLine)
        {
            a.push(line);
        }
    }

    return a;
}

function removeSpaces_(line: string): string {
    return line.replace(/\s/g, "");
}

function removeSpaces(lines: string[]): string[] {
    for (let i = 0; i < lines.length; i++) {
        let line: string = lines[i];
        lines[i] = line.replace(/\s/g, "");
    }

    return lines;
}

function removeComments(lines: string[]): string[] {
    return lines.filter(value => !value.startsWith('#'));
}
