import State from "../State";
import ValidationResult from "./ValidationResult";
import TuringMachine from "../TuringMachine";
import {I18nService} from "../../../app/services/i18n.service";

export default class ValidationChecker {
    private determinismErrorString(): string {
        return this.i18n.lookUp("determinism-error") + ":\t";
    }
    private emptyLabelStringError(label: string): string { return `${label} ${this.i18n.lookUp("cbEmpty")}`}

    private predicateErrors: string[] = [];
    private nextStateErrors: string[] = [];
    private manipulationErrors: string[] = [];
    private directionErrors: string[] = [];
    private stateNameError: string = "";

    private i18n: I18nService;
    private concatArray: string[] = [];

    public constructor() {
        this.i18n = I18nService.Instance;
    }

    public setAmountPredicates(num: number): void {
        this.predicateErrors = new Array<string>(num);
        this.nextStateErrors = new Array<string>(num - 1);
        this.manipulationErrors = new Array<string>(num - 1);
        this.directionErrors = new Array<string>(num - 1);
        this.stateNameError = "";

        this.concatArray = new Array<string>(
            this.predicateErrors.length +
            this.nextStateErrors.length +
            this.manipulationErrors.length +
            this.directionErrors.length +
            1
        );
    }

    public checkPredicateInput(tm: TuringMachine, value: string, index?: number): ValidationResult | null {
        let result: ValidationResult | null = this.checkPredicateInput_internal(tm, value, index);

        if (result && index !== undefined) {
            this.predicateErrors[index] = this.determinismErrorString() + result.toString();
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
                this.directionErrors.filter(s => s !== "").length > 0 ||
                this.stateNameError !== "";
    }

    public checkNextStateInput(turingMachine: TuringMachine, value: string, index?: number): ValidationResult | null {
        let result: ValidationResult | null = null;
        const filterValue: string = value.toLowerCase();
        let states: State[] = turingMachine.states.filter(s => s.Name.toLowerCase() === filterValue);

        if (states.length === 0) {
            result = new ValidationResult(undefined, `\"${value}\" ${this.i18n.lookUp("isNotA") + this.i18n.lookUp("state")}`);
            if (value === "") {
                result.error = this.emptyLabelStringError(this.i18n.lookUp("state"));
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

    public checkManipulationValue(turingMachine: TuringMachine, value: string, index?: number): ValidationResult | null {
        let result: ValidationResult | null = null;
        const filterValue: string = value.toLowerCase();
        let tape_alphabets: string[] = turingMachine.tape_alphabet.filter(s => s.toLowerCase() === filterValue);

        if (tape_alphabets.length === 0) {
            result = new ValidationResult(undefined, `\"${value}\" ${this.i18n.lookUp("isNotA") + " " + this.i18n.lookUp("tape-letter")}`);
            if (value === "") {
                result.error = this.emptyLabelStringError(this.i18n.lookUp("manipulation-value"));
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

        offset += this.directionErrors.length;
        this.concatArray[this.concatArray.length - 1] = this.stateNameError;


        return this.concatArray.filter(s => (s !== "" && s !== undefined)).join("\n");
    }


    public checkDeterminismInState(tm: TuringMachine, state: State): ValidationResult | null {
        let isDeterministicState: ValidationResult | null = tm.validateDeterminismInState(state);
        this.predicateErrors[this.predicateErrors.length - 1] = isDeterministicState ?
            this.determinismErrorString() + isDeterministicState.toString() :
            "";
        return isDeterministicState;
    }

    private checkPredicateInput_internal(tm: TuringMachine, value: string, index?: number) : ValidationResult | null {
        const filterValue: string = value.toLowerCase();
        let result: string[] = tm.tape_alphabet.filter(option => option.toLowerCase() === filterValue);

        if (value === "~") {
            return new ValidationResult(undefined, `${this.i18n.lookUp("predicate")} \"${value}\" ${this.i18n.lookUp("notFound")}`);
        }

        if (result.length === 0 && filterValue !== "") {
            return new ValidationResult(undefined, `${this.i18n.lookUp("predicate")} \"${value}\" ${this.i18n.lookUp("notFound")}`);
        } else if (value === "") {
            return new ValidationResult(undefined, this.emptyLabelStringError(this.i18n.lookUp("predicate")));
        }

        return null;
    }

    public checkStateName(turingMachine: TuringMachine, value: string, allowedValue: string): ValidationResult | null {
        let result: ValidationResult | null = null;
        let r: State[] = turingMachine.states.filter(s => s.Name.toLowerCase() === value.toLowerCase());

        if(value.trim().toLowerCase() === allowedValue.toLowerCase()) {
            this.stateNameError = "";
            return null;
        }

        if (r.length > 0) {
            let message: string = `${value} ${this.i18n.lookUp("inUse")}`;
            result = new ValidationResult(undefined, message);
        }

        if (value.trim() === "") {
            result = new ValidationResult(undefined, this.emptyLabelStringError(this.i18n.lookUp("state-name")));
        }

        this.stateNameError = result == null ? "" : result.toString();


        return result;
    }
}
