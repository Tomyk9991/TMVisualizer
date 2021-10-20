import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {
    @Input()
    title: string = "";
    @Input()
    formControl!: FormControl;
    @Input()
    options!: Observable<string[]>;

    ngOnInit(): void {}
}
