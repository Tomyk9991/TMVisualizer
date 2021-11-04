import Transition from "../Transition";

export default class ValidationResult {
    constructor(public transitions?: Transition[], public error?: string) {

    }

    public toString(joinOperator?: string): string {
        if (this.error) {
            return this.error;
        }

        if (this.transitions) {
            return this.transitions.join(joinOperator ?? '\n\t\t\t\t\t');
        }

        return "";
    }
}
