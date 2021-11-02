import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import State from "../../../../model/TM/State";
import Transition from "../../../../model/TM/Transition";
import StateEditorService from "../../../services/state-editor.service";
import {StateTransitionEditorPair} from "../../../services/StateTransitionEditorPair";
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import TuringMachine from "../../../../model/TM/TuringMachine";
import {TMRendererService} from "../../../services/t-m-renderer.service";
import AutoCompleteHelper, {TransitionPart} from "./AutoCompleteHelper";
import ValidationResult from "../../../../model/TM/ValidationResult";

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


    public errorMessage: string = "";
    private predicateErrors: string[] = [];

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

                this.errorMessage = "";
                this.predicateErrors = [];

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

        this.predicateErrors = new Array<string>(this.numTransitions + 1);
        let counter: number = 0;
        for (let i = 0, j = 0; i < this.numTransitions; i++, j += 4) {
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
                    map(value => {
                        let result = this.formHelpers[i][j].filter(value);

                        if(this.formHelpers[i][j].transitionPart === TransitionPart.Predicate) {
                            // if (counter >= this.numTransitions) {
                                let validation: ValidationResult | null = null;
                                let validationAllTransitions: ValidationResult | null = AutoCompleteHelper.TM.validateDeterminismInState(<State>this.state);

                                for (let k = 0; k < this.numTransitions; k++) {
                                    let validation: ValidationResult | null = this.formHelpers[k][j]
                                        .checkModel(this.formHelpers[k][j].transition.currentState, this.formHelpers[k][j].formControl.value);

                                    if (validation) {
                                        this.predicateErrors[k] = validation.toString();
                                    } else {
                                        this.predicateErrors[k] = "";
                                    }
                                }

                                this.predicateErrors[this.numTransitions] = validationAllTransitions ? validationAllTransitions.toString() : "";
                                this.errorMessage = this.predicateErrors.filter(s => s !== "").join("\n");
                            // }
                            counter++;
                        }

                        return result;
                    })
                );
            }
        }
    }

    ngOnInit(): void {
        this.updateAutoCompleteHelpers();
        this.errorMessage = this.predicateErrors.filter(s => s !== "").join("\n");
    }

    public hasErrors(): boolean {
        return this.predicateErrors.filter(s => s !== "").length > 0;
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
