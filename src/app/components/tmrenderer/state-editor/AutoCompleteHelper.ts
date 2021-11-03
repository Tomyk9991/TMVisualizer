import {Observable} from "rxjs";
import {TMRendererService} from "../../../services/t-m-renderer.service";
import TuringMachine from "../../../../model/TM/TuringMachine";
import {FormControl} from "@angular/forms";
import Transition from "../../../../model/TM/Transition";


export default class AutoCompleteHelper {
    public filteredOptions?: Observable<string[]>;
    public static tmRenderService: TMRendererService;
    public static TM: TuringMachine;

    constructor(public formControl: FormControl, public values: string[], public def: string, public transitionPart: TransitionPart, public transition: Transition) {
        formControl.setValue(def);
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
