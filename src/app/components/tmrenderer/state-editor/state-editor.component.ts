import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, ElementRef,
    OnInit, ViewChild,
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
import {I18nService} from "../../../services/i18n.service";

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
    private validationTasks: ((value: string, index: number) => void)[] = [];

    private static _hasState: boolean = false;
    public static hasState(): boolean { return StateEditorComponent._hasState; }

    public numTransitions: number = 0;
    public formHelpers: AutoCompleteHelper[][] = [];

    public validationChecker: ValidationChecker;
    public errorMessage: string = "";

    public isEditingStateName: boolean = false;

    @ViewChild('stateName', { static: false })
    set input(element: ElementRef<HTMLInputElement>) {
        if(element) {
            setTimeout(() => {
                element.nativeElement.focus()
            }, 5);
        }
    }

    public labels: string[] = [];

    public readonly lPos: 'before' | 'after' = 'before'

    constructor(public i18n: I18nService, private rendererNotifier: StateEditorService, private tmRenderNotifier: TMRendererService, private ref: ChangeDetectorRef) {
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
        this.labels = [
            this.i18n.lookUp("predicate"),
            this.i18n.lookUp("next-state"),
            this.i18n.lookUp("manipulation-value")
        ];

        this.validationTasks.push(this.performPredicateValidation);
        this.validationTasks.push(this.performNextStateValidation);
        this.validationTasks.push(this.performManipulationValueValidation);

        this.validationChecker = new ValidationChecker();
        this.updateAutoCompleteHelpers();
    }

    ngAfterViewInit(): void {
        this.updateAutoCompleteHelpers();
        this.errorMessage = this.validationChecker.prettyPrint();
        this.ref.markForCheck();
    }

    public getHeight(): string {
        let margin: number = 15;
        let pixel: number = margin + this.errorMessage.split('\n').length * 20;
        pixel = Math.max(pixel, margin + 40);

        return pixel + "px";
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

        const amountLabels: number = 3;

        for (let i = 0, j = 0; i < this.numTransitions; i++, j += amountLabels) {
            this.formHelpers[i] = [];
            // predicate
            this.formHelpers[i].push(new AutoCompleteHelper(new FormControl(), tape_alphabet, transitions[i].predicate, TransitionPart.Predicate, transitions[i]));
            //next state
            this.formHelpers[i].push(new AutoCompleteHelper(new FormControl(), allStates, transitions[i].nextState.Name, TransitionPart.NextState, transitions[i]));
            // manipulation value
            this.formHelpers[i].push(new AutoCompleteHelper(new FormControl(), tape_alphabet, transitions[i].manipulationValue, TransitionPart.ManipulationValue, transitions[i]));

            for (let j = 0; j < amountLabels; j++) {
                this.formHelpers[i][j].filteredOptions = this.formHelpers[i][j].formControl.valueChanges.pipe(
                    startWith(''),
                    map(value => {
                        let result = this.formHelpers[i][j].filter(value);

                        // Validation of turing machine
                        let transitionPartToIndex: number = this.formHelpers[i][j].transitionPart;
                        this.validationTasks[transitionPartToIndex].call(this, this.formHelpers[i][j].formControl.value, i);

                        return result;
                    })
                );
            }
        }
    }

    ngOnInit(): void {
    }

    private performManipulationValueValidation(value: string, index: number): void {
        this.validationChecker.checkManipulationValue(AutoCompleteHelper.TM,
            value, index
        );

        this.errorMessage = this.validationChecker.prettyPrint();
    }

    private performNextStateValidation(value: string, index: number): void {
        this.validationChecker.checkNextStateInput(AutoCompleteHelper.TM,
            value, index
        );
        this.errorMessage = this.validationChecker.prettyPrint();
    }

    private performPredicateValidation(value: string, index: number): void {
        this.validationChecker.checkDeterminismInState(AutoCompleteHelper.TM, <State>this.state);

        for (let k = 0; k < this.numTransitions; k++) {
            this.validationChecker.checkPredicateInput(
                AutoCompleteHelper.TM,
                this.formHelpers[k][0].formControl.value,
                k);
        }
        this.errorMessage = this.validationChecker.prettyPrint();
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

    public isSelectedButton(i: number, direction: string): string {
        const primary: string = "#e91e63";
        const unselected: string = "#5b5b5b";

        let allTransitions: Transition[] = this.turingMachine?.transitions.filter(t => t.currentState == this.state) ?? [];
        let targetTransition: Transition = allTransitions[i];

        return (<string>targetTransition.direction) === direction ? primary : unselected;
    }

    public onDirectionChanged(i: number, newDirection: string): void {
        let allTransitions: Transition[] = this.turingMachine?.transitions.filter(t => t.currentState == this.state) ?? [];
        let targetTransition: Transition = allTransitions[i];

        targetTransition.direction = Transition.stringToTMDirection(newDirection);
        this.tmRenderNotifier.render(<TuringMachine>this.turingMachine);
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

    public onFocusOut(event: any, element: HTMLInputElement): void {
        let result: ValidationResult | null = this.validationChecker.checkStateName(TuringMachine.Instance, element.value, (<State>this.state).Name);

        if (!result) {
            (<State>this.state).Name = element.value;
        } else {
            this.validationChecker.checkStateName(TuringMachine.Instance, (<State>this.state).Name, (<State>this.state).Name);
        }

        this.errorMessage = this.validationChecker.prettyPrint();
        this.isEditingStateName = false;
    }



    public onStateNameChanged(event: any, element: HTMLInputElement): void {
        let result: ValidationResult | null = this.validationChecker.checkStateName(TuringMachine.Instance, element.value, (<State>this.state).Name);

        if (event.key === 'Enter') {
            if (!result) { // No errors, so send it so the turing machine
                (<State>this.state).Name = element.value;
                this.isEditingStateName = false;
            }
        }

        this.errorMessage = this.validationChecker.prettyPrint();
        this.ref.markForCheck();
    }
}
