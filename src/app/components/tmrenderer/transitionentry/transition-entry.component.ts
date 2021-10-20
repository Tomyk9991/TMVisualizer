import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
    selector: 'app-transitionEntry',
    templateUrl: './transition-entry.component.html',
    styleUrls: ['./transition-entry.component.css']
})
export class TransitionEntryComponent implements OnInit {
    @Input()
    title: string = "";
    @Input()
    control!: FormControl;
    @Input()
    options!: Observable<string[]>;

    ngOnInit(): void {
    }
}
