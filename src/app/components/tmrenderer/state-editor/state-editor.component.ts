import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import State from "../../../../model/TM/State";
import Transition from "../../../../model/TM/Transition";
import StateEditorService from "../../../services/state-editor.service";
import {StateTransitionEditorPair} from "../../../services/StateTransitionEditorPair";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import TuringMachine from "../../../../model/TM/TuringMachine";
import {TMRendererService} from "../../../services/t-m-renderer.service";

@Component({
    selector: 'app-state-editor',
    templateUrl: './state-editor.component.html',
    styleUrls: ['./state-editor.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class StateEditorComponent implements OnInit {
    public state?: State;
    public turingMachine?: TuringMachine;

    private static _hasState: boolean = false;
    public static hasState(): boolean { return StateEditorComponent._hasState; }

    public numTransitions: number = 0;
    public formHelpers: AutoCompleteHelper[][] = [];
    public readonly labels: string[] = [
        "Predicate",
        "Next state",
        "Manipulation value",
        "Direction"
    ];

    public readonly lPos: 'before' | 'after' = 'before'

    constructor(private rendererNotifier: StateEditorService, private tmRenderNotifier: TMRendererService) {
        this.rendererNotifier.OnRegisterRender.on((data: StateTransitionEditorPair) => {
            if (data.state != this.state) {
                this.state = data.state;
                StateEditorComponent._hasState = true;
                this.turingMachine = data.transitions;

                this.updateAutoCompleteHelpers();
            }
        });
    }

    private updateAutoCompleteHelpers(): void {
        let transitions: Transition[] = this.turingMachine?.transitions.filter(t => t.currentState == this.state) ?? [];
        let allStates: string[] = this.turingMachine?.states.map(s => s.Name) ?? [];
        this.numTransitions = transitions.length;

        let tape_alphabet: string[] = <string[]>this.turingMachine?.tape_alphabet;
        let directions: string[] = ["L", "R", "N"];

        this.formHelpers = [];

        if (AutoCompleteHelper.tmRenderService === undefined) {
            AutoCompleteHelper.tmRenderService = this.tmRenderNotifier;
        }
        if(AutoCompleteHelper.TM === undefined) {
            AutoCompleteHelper.TM = <TuringMachine> this.turingMachine;
        }

        for (let i = 0; i < this.numTransitions; i++) {
            this.formHelpers[i] = [];
            // predicate
            this.formHelpers[i].push(new AutoCompleteHelper(new FormControl(), tape_alphabet, transitions[i].predicate, TransitionPart.Predicate, transitions[i]));
            //next state
            this.formHelpers[i].push(new AutoCompleteHelper(new FormControl(), allStates, transitions[i].nextState.Name, TransitionPart.NextState, transitions[i]));
            // manipulation value
            this.formHelpers[i].push(new AutoCompleteHelper(new FormControl(), tape_alphabet, transitions[i].manipulationValue, TransitionPart.ManipulationValue, transitions[i]));
            // direction
            this.formHelpers[i].push(new AutoCompleteHelper(new FormControl(), directions, <string>transitions[i].direction, TransitionPart.Direction, transitions[i]));

            for (let j = 0; j < 4; j++) {
                this.formHelpers[i][j].filteredOptions = this.formHelpers[i][j].formControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this.formHelpers[i][j].filter(value)),
                );
            }
        }
    }

    ngOnInit(): void {
        this.updateAutoCompleteHelpers();
    }

    public isInitialState(): boolean {
        return this.state!.isInitialState;
    }
    public isFinalState(): boolean {
        return this.state!.isFinalState;
    }

    public onInitialStateChanged(val: boolean): void {
        this.state!.isInitialState = val;
        this.tmRenderNotifier.render(<TuringMachine>this.turingMachine);
    }

    public onFinalStateChanged(val: boolean): void{
        this.state!.isFinalState = val;
        this.tmRenderNotifier.render(<TuringMachine>this.turingMachine);
    }

    public onClose() {
        StateEditorComponent._hasState = false;
        this.state = undefined;
    }

    public addTransition(): void {
        let transition: Transition = new Transition(<State>this.state, "~", <State>this.state, "~", "L");
        (<TuringMachine>this.turingMachine).transitions.push(transition);

        this.updateAutoCompleteHelpers();
        this.tmRenderNotifier.render(<TuringMachine>this.turingMachine);
    }

    public deleteTransition(i: number): void {
        let allTransitions: Transition[] = this.turingMachine?.transitions.filter(t => t.currentState == this.state) ?? [];
        let targetTransition: Transition = allTransitions[i];

        let targetIndex: number = this.turingMachine?.transitions.indexOf(targetTransition, 0) ?? -1;

        if (targetIndex !== -1) {
            this.turingMachine?.transitions.splice(targetIndex, 1);
            this.updateAutoCompleteHelpers();
            this.tmRenderNotifier.render(<TuringMachine>this.turingMachine);
        }
    }
}


class AutoCompleteHelper {
    public filteredOptions?: Observable<string[]>;
    public static tmRenderService: TMRendererService;
    public static TM: TuringMachine;

    constructor(public formControl: FormControl, public values: string[], public def: string, private transitionPart: TransitionPart, private transition: Transition) {
        formControl.setValue(def);
    }

    public filter(value: string): string[] {
        const filterValue: string = value.toLowerCase();
        let result: string[] = this.values.filter(option => option.toLowerCase() === filterValue);

        if (result.length == 1)
        {
            if (this.transitionPart === TransitionPart.Predicate)
            {
                this.transition.predicate = result[0];
                AutoCompleteHelper.tmRenderService.render(AutoCompleteHelper.TM);
            }
            else if (this.transitionPart === TransitionPart.NextState)
            {
                this.transition.nextState = AutoCompleteHelper.TM.states.filter(s => s.Name === result[0])[0];
                AutoCompleteHelper.tmRenderService.render(AutoCompleteHelper.TM);
            }
            else if (this.transitionPart === TransitionPart.ManipulationValue)
            {
                this.transition.manipulationValue = result[0];
                AutoCompleteHelper.tmRenderService.render(AutoCompleteHelper.TM);
            }
            else if (this.transitionPart === TransitionPart.Direction)
            {
                this.transition.direction = Transition.stringToTMDirection(result[0]);
                AutoCompleteHelper.tmRenderService.render(AutoCompleteHelper.TM);
            }
        }

        return result;
    }
}

enum TransitionPart {
    Predicate,
    NextState,
    ManipulationValue,
    Direction
}
