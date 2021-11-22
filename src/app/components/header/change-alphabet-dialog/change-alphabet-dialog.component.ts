import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {I18nService} from "../../../services/i18n.service";
import TuringMachine from "../../../../model/TM/TuringMachine";

@Component({
    selector: 'app-change-alphabet-dialog',
    templateUrl: './change-alphabet-dialog.component.html',
    styleUrls: ['./change-alphabet-dialog.component.css'],
})
export class ChangeAlphabetDialogComponent implements OnInit {
    public readonly indexLookup: any = {
        "tape": 0,
        "input": 1
    };

    public readonly i18nKeys: string[][] = [
        [
            "edit-tape-alphabet",
            "tape-letter"
        ],
        [
            "edit-input-alphabet",
            "input-letter"
        ]
    ];

    @ViewChild('alphabetLetter', { static: false })
    set input(element: ElementRef<HTMLInputElement>) {
        if(element) {
            setTimeout(() => {
                element.nativeElement.focus()
            }, 5);
        }
    }


    public errorMessage: string = "";
    private _internalErrorMessage: string[] = [];
    public isEditingAlphabet: boolean[] = [];
    public alphabet: string[] = [];

    constructor(public i18n: I18nService, @Inject(MAT_DIALOG_DATA) public data: { alphabet: string }, public dialogRef: MatDialogRef<ChangeAlphabetDialogComponent>) {
        this.alphabet = this.data.alphabet === "tape" ? TuringMachine.Instance.tape_alphabet : TuringMachine.Instance.input_alphabet;

        for (let i = 0; i < this.alphabet.length; i++) {
            this.isEditingAlphabet.push(false);
            this._internalErrorMessage.push("");
        }
    }

    ngOnInit(): void {
    }

    public translationFor(index: number): string {
        return this.i18nKeys[this.indexLookup[this.data.alphabet]][index];
    }

    public onStateNameChanged(event: any, element: HTMLInputElement, index: number): void {
        let potentialLetter: string = element.value.trim();
        let hasError: boolean = false;

        if (potentialLetter === "" || potentialLetter !== this.alphabet[index]) {
            hasError = this.validate(potentialLetter, index, false);
        }

        if (event.key === 'Enter') {
            this.isEditingAlphabet[index] = false;
            if (!hasError) {
                this.alphabet[index] = potentialLetter;
                this.isEditingAlphabet[index] = false;
            }
        }
    }

    public onClose(): void {
        this.dialogRef.close();
    }

    public onFocusOut(event: any, element: HTMLInputElement, index: number): void {
        let potentialLetter: string = element.value.trim();

        if (potentialLetter === "" || potentialLetter !== this.alphabet[index]) {
            this.validate(potentialLetter, index);
        }


        this.isEditingAlphabet[index] = false;
    }

    public addLetter(): void {
        this.alphabet.push("~");
    }

    public removeLetter(index: number): void {
        this.alphabet.splice(index, 1);
    }

    private validate(potentialLetter: string, index: number, setAlphabetBuffer: boolean = true): boolean {
        let hasError: boolean = false;

        if (this.alphabet.includes(potentialLetter)) {
            this._internalErrorMessage[index] = this.i18n.lookUp(this.translationFor(1)) + ` "${potentialLetter}" ` + this.i18n.lookUp("inUse");
            hasError = true;
        }

        if (potentialLetter === "") {
            this._internalErrorMessage[index] = this.i18n.lookUp(this.translationFor(1)) + " " + this.i18n.lookUp("cbEmpty");
            hasError = true;
        }

        if(!hasError) {
            this._internalErrorMessage[index] = "";

        }

        if (setAlphabetBuffer) {
            this.alphabet[index] = potentialLetter;
        }


        this.errorMessage = this._internalErrorMessage.filter(s => s !== "").join("\n");

        return hasError;
    }

    public hasErrors(): boolean {
        return this.errorMessage !== "";
    }
}
