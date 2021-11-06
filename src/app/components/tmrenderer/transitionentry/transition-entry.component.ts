import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {I18nService} from "../../../services/i18n.service";

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

    constructor(public i18n: I18nService) {
    }

    ngOnInit(): void {
    }
}
