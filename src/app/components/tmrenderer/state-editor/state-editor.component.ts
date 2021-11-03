import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import State from "../../../../model/TM/State";
import Transition from "../../../../model/TM/Transition";
import StateEditorService from "../../../services/state-editor.service";
import {StateTransitionEditorPair} from "../../../services/StateTransitionEditorPair";
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import TuringMachine from "../../../../model/TM/TuringMachine";
import {TMRendererService} from "../../../services/t-m-renderer.service";
import AutoCompleteHelper, {TransitionPart} from "./AutoCompleteHelper";
import ValidationResult from "../../../../model/TM/Validation/ValidationResult";
import ValidationChecker from "../../../../model/TM/Validation/ValidationChecker";

@Component({
    selector: 'app-state-editor',
    templateUrl: './state-editor.component.html',
    styleUrls: ['./state-editor.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush // Manually marking for check, because of async rebuilding, invoked by autocomplete - system
})


export class StateEditorComponent implements OnInit, AfterViewInit {
    public state?: State;
    public turingMachine?: TuringMachine;

    private static _hasState: boolean = false;
    public static hasState(): boolean { return StateEditorComponent._hasState; }

    public numTransitions: number = 0;
    public formHelpers: AutoCompleteHelper[][] = [];

    public validationChecker: ValidationChecker;
    public errorMessage: string = "";

    public readonly labels: string[] = [
        "Predicate",
        "Next state",
        "Manipulation value",
        "Direction"
    ];

    public readonly lPos: 'before' | 'after' = 'before'

    constructor(private rendererNotifier: StateEditorService, private tmRenderNotifier: TMRendererService, private ref: ChangeDetectorRef) {
        this.rendererNotifier.OnRegisterRender.on((data: StateTransitionEditorPair) => {
            if (data.state != this.state) {
                this.state = data.state;
                StateEditorComponent._hasState = true;
                this.turingMachine = data.transitions;
                this.formHelpers = [];
                this.errorMessage = "";

                this.validationChecker = new ValidationChecker();
                this.updateAutoCompleteHelpers();

                this.ref.markForCheck();
            }
        });

        this.validationChecker = new ValidationChecker();
        this.updateAutoCompleteHelpers();
    }

    ngAfterViewInit(): void {
        this.updateAutoCompleteHelpers();
        this.errorMessage = this.validationChecker.prettyPrint();
        this.ref.markForCheck();
    }

    public isTransitionInvalid(transition: Transition): boolean {
        let validationAllTransitions: ValidationResult | null = this.validationChecker
            .checkDeterminismInState(AutoCompleteHelper.TM, <State>this.state);

        if (validationAllTransitions && validationAllTransitions.transitions !== undefined) {
            return validationAllTransitions.transitions.filter(t => t == transition).length > 0;
        }

        return false;
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

        this.validationChecker.setAmountPredicates(this.numTransitions + 1);

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
                            let validationAllTransitions: ValidationResult | null = this.validationChecker
                                .checkDeterminismInState(AutoCompleteHelper.TM, <State>this.state);

                            for (let k = 0; k < this.numTransitions; k++) {
                                let validation: ValidationResult | null = this.validationChecker.checkPredicateInput(
                                    AutoCompleteHelper.TM,
                                    this.formHelpers[k][j].formControl.value,
                                    k);
                            }

                            this.errorMessage = this.validationChecker.prettyPrint()
                        }

                        return result;
                    })
                );
            }
        }
    }

    ngOnInit(): void {
    }

    public hasErrors(): boolean {
        return this.validationChecker.hasErrors();
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
        this.ref.markForCheck();
    }

    public onFinalStateChanged(val: boolean): void{
        this.state!.isFinalState = val;
        this.tmRenderNotifier.render(<TuringMachine>this.turingMachine);
        this.ref.markForCheck();
    }

    public onClose() {
        StateEditorComponent._hasState = false;
        this.state = undefined;
        this.ref.markForCheck();
    }

    public addTransition(): void {
        let transition: Transition = new Transition(<State>this.state, "~", <State>this.state, "~", "L");
        (<TuringMachine>this.turingMachine).transitions.push(transition);

        this.updateAutoCompleteHelpers();
        this.tmRenderNotifier.render(<TuringMachine>this.turingMachine);
        this.ref.markForCheck();
    }

    public deleteTransition(i: number): void {
        let allTransitions: Transition[] = this.turingMachine?.transitions.filter(t => t.currentState == this.state) ?? [];
        let targetTransition: Transition = allTransitions[i];

        let targetIndex: number = this.turingMachine?.transitions.indexOf(targetTransition, 0) ?? -1;

        if (targetIndex !== -1) {
            this.turingMachine?.transitions.splice(targetIndex, 1);
            this.updateAutoCompleteHelpers();
            this.tmRenderNotifier.render(<TuringMachine>this.turingMachine);

            setTimeout(() => {
                this.ref.markForCheck();
            }, 0);
        }
    }
}
