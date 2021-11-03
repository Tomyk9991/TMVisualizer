import State from "./State";
import Transition from "./Transition";
import ValidationResult from "./Validation/ValidationResult";

export default class TuringMachine {
    public static Instance: TuringMachine;
    constructor(public states: State[], public input_alphabet: string[], public tape_alphabet: string[], public transitions: Transition[]) {
        TuringMachine.Instance = this;
    }

    //returns a reference to the transitions that break the determinism of a turing machine
    // example: with a state q_1 has two transitions with the same predicate
    // q_1, a -> q_2, b | R
    // q_1, a -> q_3, a | R
    // this is illegal
    public validateDeterminism(): ValidationResult {
        let duplicatePredicateTransitions: Set<Transition> = new Set<Transition>();

        for (let i = 0; i < this.states.length; i++) {
            let currentState: State = this.states[i];
            let transitionsFromState: Transition[] = this.transitions.filter(t => t.currentState == currentState);
            let predicatesInState: string[] = transitionsFromState.map(t => t.predicate);
            // to to find a predicate more than one time
            predicatesInState.some((element: string, index: number) => {
               let hasDuplicate: boolean = predicatesInState.indexOf(element) !== index;

               if (hasDuplicate) {
                   let duplicateTransitionPredicates: Transition[] = transitionsFromState.filter(t => t.predicate === element);
                   while(duplicateTransitionPredicates.length === 0) {
                       duplicatePredicateTransitions.add(duplicateTransitionPredicates.pop()!);
                   }
               }
            });
        }

        return new ValidationResult(Array.from(duplicatePredicateTransitions.values()));
    }

    public validateDeterminismInState(state: State): ValidationResult | null {
        let duplicatePredicateTransitions: Set<Transition> = new Set<Transition>();

        let transitionsFromState: Transition[] = this.transitions.filter(t => t.currentState == state);
        let predicatesInState: string[] = transitionsFromState.map(t => t.predicate);
        // to to find a predicate more than one time
        predicatesInState.some((element: string, index: number) => {
            let hasDuplicate: boolean = predicatesInState.indexOf(element) !== index;

            if (hasDuplicate) {
                let duplicateTransitionPredicates: Transition[] = transitionsFromState.filter(t => t.predicate === element);
                while(duplicateTransitionPredicates.length > 0) {
                    duplicatePredicateTransitions.add(duplicateTransitionPredicates.pop()!);
                }
            }
        });

        let arr: Transition[] = Array.from(duplicatePredicateTransitions.values());
        return arr.length > 0 ? new ValidationResult(arr, undefined) : null;
    }

    public validatePredicates(): Transition[] {
        return this.transitions.filter(transition => !this.tape_alphabet.includes(transition.predicate));
    }
}
