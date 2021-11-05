import {Observable} from "rxjs";
import {TMRendererService} from "../../../services/t-m-renderer.service";
import TuringMachine from "../../../../model/TM/TuringMachine";
import {FormControl} from "@angular/forms";
import Transition from "../../../../model/TM/Transition";


export default class AutoCompleteHelper {
    public filteredOptions?: Observable<string[]>;
    public static tmRenderService: TMRendererService;
    public static TM: TuringMachine;

    private onFilterFoundActions: ((value: string) => void)[] = [
        this.onPredicateFound,
        this.onNextStateFound,
        this.onManipulationValueFound
    ]

    constructor(public formControl: FormControl, public values: string[], public def: string, public transitionPart: TransitionPart, public transition: Transition) {
        formControl.setValue(def);
    }

    public filter(value: string): string[] {
        const filterValue: string = value.toLowerCase();
        let result: string[] = this.values.filter(option => option.toLowerCase() === filterValue);

        if (result.length == 1) {
            let transitionPartIndex: number = this.transitionPart;
            this.onFilterFoundActions[transitionPartIndex].call(this, result[0]);
        }

        return result;
    }
    private onManipulationValueFound(value: string): void {
        this.transition.manipulationValue = value;
        AutoCompleteHelper.tmRenderService.render(AutoCompleteHelper.TM);
    }

    private onNextStateFound(value: string): void {
        this.transition.nextState = AutoCompleteHelper.TM.states.filter(s => s.Name === value)[0];
        AutoCompleteHelper.tmRenderService.render(AutoCompleteHelper.TM);
    }

    private onPredicateFound(value: string): void {
        this.transition.predicate = value;
        AutoCompleteHelper.tmRenderService.render(AutoCompleteHelper.TM);
    }
}

export enum TransitionPart {
    Predicate,
    NextState,
    ManipulationValue
}
