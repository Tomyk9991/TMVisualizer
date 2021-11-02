import {Observable} from "rxjs";
import {TMRendererService} from "../../../services/t-m-renderer.service";
import TuringMachine from "../../../../model/TM/TuringMachine";
import {FormControl} from "@angular/forms";
import Transition from "../../../../model/TM/Transition";

export default class AutoCompleteHelper {
    public filteredOptions?: Observable<string[]>;
    public static tmRenderService: TMRendererService;
    public static TM: TuringMachine;
    private static readonly PseudoEmptyString: string = "-";

    constructor(public formControl: FormControl, public values: string[], public def: string, private transitionPart: TransitionPart, private transition: Transition) {
        formControl.setValue(def);
    }

    public filter(value: string): [string[], string] {
        const filterValue: string = value.toLowerCase();
        let result: string[] = this.values.filter(option => option.toLowerCase() === filterValue);
        let error: string = "";

        if (this.transitionPart === TransitionPart.Predicate && result.length === 0 && filterValue !== "") {
            error = `Predicate ${value} not found`;
        }

        if (value === "") {
            error = AutoCompleteHelper.PseudoEmptyString;
        }

        if (result.length == 1) {
            if (this.transitionPart === TransitionPart.Predicate) {
                this.transition.predicate = result[0];
                let breakingDeterminism: Transition[] = AutoCompleteHelper.TM.validateDeterminism();

                if (breakingDeterminism.length > 0) {
                    error += breakingDeterminism.map(t => "Determinism error:\t\t" + t.toString()).join('\n');
                } else {
                    error += AutoCompleteHelper.PseudoEmptyString;
                }


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

        return [result, error];
    }
}

export enum TransitionPart {
    Predicate,
    NextState,
    ManipulationValue,
    Direction
}
