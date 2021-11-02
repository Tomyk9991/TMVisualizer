import {Observable} from "rxjs";
import {TMRendererService} from "../../../services/t-m-renderer.service";
import TuringMachine from "../../../../model/TM/TuringMachine";
import {FormControl} from "@angular/forms";
import Transition from "../../../../model/TM/Transition";
import ValidationResult from "../../../../model/TM/ValidationResult";
import State from "../../../../model/TM/State";


export default class AutoCompleteHelper {
    public filteredOptions?: Observable<string[]>;
    public static tmRenderService: TMRendererService;
    public static TM: TuringMachine;

    constructor(public formControl: FormControl, public values: string[], public def: string, public transitionPart: TransitionPart, public transition: Transition) {
        formControl.setValue(def);
    }

    public checkModel(currentState: State, currentValue: string): ValidationResult | null {
        if (this.transitionPart === TransitionPart.Predicate) {
            const filterValue: string = currentValue.toLowerCase();
            let result: string[] = this.values.filter(option => option.toLowerCase() === filterValue);

            if (currentValue === "~") {
                return new ValidationResult(undefined, `Predicate ${currentValue} not found`);
            }

            if (result.length === 0 && filterValue !== "") {
                return new ValidationResult(undefined, `Predicate ${currentValue} not found`);
            } else if (currentValue === "") {
                return new ValidationResult(undefined, "Predicate can't be empty");
            }
        }

        return null;
    }

    public filter(value: string): string[] {
        const filterValue: string = value.toLowerCase();
        let result: string[] = this.values.filter(option => option.toLowerCase() === filterValue);

        if (result.length == 1) {
            if (this.transitionPart === TransitionPart.Predicate) {
                this.transition.predicate = result[0];
                AutoCompleteHelper.tmRenderService.render(AutoCompleteHelper.TM);
            } else if (this.transitionPart === TransitionPart.NextState) {
                this.transition.nextState = AutoCompleteHelper.TM.states.filter(s => s.Name === result[0])[0];
                AutoCompleteHelper.tmRenderService.render(AutoCompleteHelper.TM);
            } else if (this.transitionPart === TransitionPart.ManipulationValue) {
                this.transition.manipulationValue = result[0];
                AutoCompleteHelper.tmRenderService.render(AutoCompleteHelper.TM);
            } else if (this.transitionPart === TransitionPart.Direction) {
                this.transition.direction = Transition.stringToTMDirection(result[0]);
                AutoCompleteHelper.tmRenderService.render(AutoCompleteHelper.TM);
            }
        }

        return result;
    }
}

export enum TransitionPart {
    Predicate,
    NextState,
    ManipulationValue,
    Direction
}
