import State from "../State";
import ValidationResult from "./ValidationResult";
import TuringMachine from "../TuringMachine";

export default class ValidationChecker {
    private predicateErrors: string[] = [];
    private isInValidTransition: boolean[] = [];

    public setAmountPredicates(num: number): void {
        this.predicateErrors = new Array<string>(num);
        this.isInValidTransition = new Array<boolean>(num - 1);
    }

    public checkPredicateInput(tm: TuringMachine, value: string, index?: number): ValidationResult | null {
        let result: ValidationResult | null = this.checkPredicateInput_internal(tm, value, index);

        if (result && index !== undefined) {
            this.predicateErrors[index] = result.toString();
        }

        if (!result && index !== undefined) {
            this.predicateErrors[index] = "";
        }

        return result;
    }

    public hasErrors(): boolean {
        return this.predicateErrors.filter(s => s !== "").length > 0;
    }

    public prettyPrint(): string {
        return this.predicateErrors.filter(s => s !== "").join("\n");
    }


    public checkDeterminismInState(tm: TuringMachine, state: State): ValidationResult | null {
        let isDeterministicState: ValidationResult | null = tm.validateDeterminismInState(state);
        this.predicateErrors[this.predicateErrors.length - 1] = isDeterministicState ? isDeterministicState.toString() : "";
        return isDeterministicState;
    }

    private checkPredicateInput_internal(tm: TuringMachine, value: string, index?: number) : ValidationResult | null {
        const filterValue: string = value.toLowerCase();
        let result: string[] = tm.tape_alphabet.filter(option => option.toLowerCase() === filterValue);

        if (value === "~") {
            return new ValidationResult(undefined, `Predicate ${value} not found`);
        }

        if (result.length === 0 && filterValue !== "") {
            return new ValidationResult(undefined, `Predicate ${value} not found`);
        } else if (value === "") {
            return new ValidationResult(undefined, "Predicate can't be empty");
        }

        return null;
    }
}
