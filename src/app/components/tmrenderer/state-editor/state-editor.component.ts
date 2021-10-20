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

    public numTransitions: number = 0;
    public formHelpers: AutoCompleteHelper[][] = [];
    public readonly labels = [
        "Predicate",
        "Next state",
        "Manipulation value",
        "Direction"
    ];

    constructor(private rendererNotifier: StateEditorService, private tmRenderNotifier: TMRendererService) {
        this.rendererNotifier.OnRegisterRender.on((data: StateTransitionEditorPair) => {
            if (data.state != this.state) {
                this.state = data.state;
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
        for (let i = 0; i < this.numTransitions; i++) {
            this.formHelpers[i] = [];
            // predicate
            this.formHelpers[i].push(new AutoCompleteHelper(new FormControl(), tape_alphabet, transitions[i].predicate));
            //next state
            this.formHelpers[i].push(new AutoCompleteHelper(new FormControl(), allStates, transitions[i].nextState.Name));
            // manipulation value
            this.formHelpers[i].push(new AutoCompleteHelper(new FormControl(), tape_alphabet, transitions[i].manipulationValue));
            // direction
            this.formHelpers[i].push(new AutoCompleteHelper(new FormControl(), directions, <string>transitions[i].direction));
        }


        for (let i = 0; i < this.formHelpers.length; i++) {
            for (let j = 0; j < 4; j++) {
                this.formHelpers[i][j].filteredOptions = this.formHelpers[i][j].formControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this.formHelpers[i][j].filter(value))
                );
            }
        }
    }

    ngOnInit(): void {
        this.updateAutoCompleteHelpers();
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
    constructor(public formControl: FormControl, public values: string[], public def: string) {
        formControl.setValue(def);
    }

    public filter(value: string): string[] {
        const filterValue: string = value.toLowerCase();
        return this.values.filter(option => option.toLowerCase().includes(filterValue));
    }
}
