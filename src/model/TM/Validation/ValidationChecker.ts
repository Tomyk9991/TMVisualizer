import State from "../State";
import ValidationResult from "./ValidationResult";
import TuringMachine from "../TuringMachine";

export default class ValidationChecker {
    private static readonly DeterminismErrorString: string = "Determinism error:\t";
    private emptyLabelStringError(label: string): string { return `${label} can't be empty`}

    private predicateErrors: string[] = [];
    private nextStateErrors: string[] = [];
    private manipulationErrors: string[] = [];
    private directionErrors: string[] = [];

    private concatArray: string[] = [];

    public setAmountPredicates(num: number): void {
        this.predicateErrors = new Array<string>(num);
        this.nextStateErrors = new Array<string>(num - 1);
        this.manipulationErrors = new Array<string>(num - 1);
        this.directionErrors = new Array<string>(num - 1);

        this.concatArray = new Array<string>(
            this.predicateErrors.length +
            this.nextStateErrors.length +
            this.manipulationErrors.length +
            this.directionErrors.length
        );
    }

    public checkPredicateInput(tm: TuringMachine, value: string, index?: number): ValidationResult | null {
        let result: ValidationResult | null = this.checkPredicateInput_internal(tm, value, index);

        if (result && index !== undefined) {
            this.predicateErrors[index] = ValidationChecker.DeterminismErrorString + result.toString();
        }

        if (!result && index !== undefined) {
            this.predicateErrors[index] = "";
        }

        return result;
    }

    public hasErrors(): boolean {
        return  this.predicateErrors.filter(s => s !== "").length > 0 ||
                this.nextStateErrors.filter(s => s !== "").length > 0 ||
                this.manipulationErrors.filter(s => s !== "").length > 0 ||
                this.directionErrors.filter(s => s !== "").length > 0;
    }

    public checkNextStateInput(turingMachine: TuringMachine, value: string, index?: number): ValidationResult | null {
        let result: ValidationResult | null = null;
        const filterValue: string = value.toLowerCase();
        let states: State[] = turingMachine.states.filter(s => s.Name.toLowerCase() === filterValue);

        if (states.length === 0) {
            result = new ValidationResult(undefined, `\"${value}\" is not a state`);
            if (value === "") {
                result.error = this.emptyLabelStringError("State");
            }
        }

        if (result && index !== undefined) {
            this.nextStateErrors[index] = result.toString();
        }

        if (!result && index !== undefined) {
            this.nextStateErrors[index] = "";
        }

        return result;
    }

    public checkDirectionValue(turingMachine: TuringMachine, value: string, index?: number): ValidationResult | null {
        let result: ValidationResult | null = null;
        const filterValue: string = value.toLowerCase();
        let directions: string[] = turingMachine.getDirections().filter(s => s.toLowerCase() === filterValue);

        if (directions.length === 0) {
            result = new ValidationResult(undefined, `\"${value}\" is not a direction`);
            if (value === "") {
                result.error = this.emptyLabelStringError("Direction");
            }
        }

        if (result && index !== undefined) {
            this.directionErrors[index] = result.toString();
        }

        if (!result && index !== undefined) {
            this.directionErrors[index] = "";
        }

        return result;
    }

    public checkManipulationValue(turingMachine: TuringMachine, value: string, index?: number): ValidationResult | null {
        let result: ValidationResult | null = null;
        const filterValue: string = value.toLowerCase();
        let tape_alphabets: string[] = turingMachine.tape_alphabet.filter(s => s.toLowerCase() === filterValue);

        if (tape_alphabets.length === 0) {
            result = new ValidationResult(undefined, `\"${value}\" is not a tape letter`);
            if (value === "") {
                result.error = this.emptyLabelStringError("Manipulation value");
            }
        }

        if (result && index !== undefined) {
            this.manipulationErrors[index] = result.toString();
        }

        if (!result && index !== undefined) {
            this.manipulationErrors[index] = "";
        }

        return result;
    }

    public prettyPrint(): string {
        let offset: number = 0;
        for (let i = 0; i < this.predicateErrors.length; i++) {
            this.concatArray[i + offset] = this.predicateErrors[i];
        }

        offset += this.predicateErrors.length;
        for (let i = 0; i < this.nextStateErrors.length; i++) {
            this.concatArray[i + offset] = this.nextStateErrors[i];
        }

        offset += this.nextStateErrors.length;
        for (let i = 0; i < this.manipulationErrors.length; i++) {
            this.concatArray[i + offset] = this.manipulationErrors[i];
        }

        offset += this.manipulationErrors.length;
        for (let i = 0; i < this.directionErrors.length; i++) {
            this.concatArray[i + offset] = this.directionErrors[i];
        }

        return this.concatArray.filter(s => (s !== "" && s !== undefined)).join("\n");
    }


    public checkDeterminismInState(tm: TuringMachine, state: State): ValidationResult | null {
        let isDeterministicState: ValidationResult | null = tm.validateDeterminismInState(state);
        this.predicateErrors[this.predicateErrors.length - 1] = isDeterministicState ?
            ValidationChecker.DeterminismErrorString + isDeterministicState.toString() :
            "";
        return isDeterministicState;
    }

    private checkPredicateInput_internal(tm: TuringMachine, value: string, index?: number) : ValidationResult | null {
        const filterValue: string = value.toLowerCase();
        let result: string[] = tm.tape_alphabet.filter(option => option.toLowerCase() === filterValue);

        if (value === "~") {
            return new ValidationResult(undefined, `Predicate \"${value}\" not found`);
        }

        if (result.length === 0 && filterValue !== "") {
            return new ValidationResult(undefined, `Predicate \"${value}\" not found`);
        } else if (value === "") {
            return new ValidationResult(undefined, this.emptyLabelStringError("Predicate"));
        }

        return null;
    }
}
