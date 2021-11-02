import Transition from "./Transition";

export default class ValidationResult {
    constructor(private transitions?: Transition[], private error?: string) {

    }

    public toString(joinOperator?: string): string {
        if (this.error) {
            return this.error;
        }

        if (this.transitions) {
            return this.transitions.join(joinOperator ?? '\n');
        }

        return "";
    }
}
