import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    private data: any = {
        "download-file": {
            "de": "Datei runterladen",
            "en": "Download file"
        },
        "upload-file": {
            "de": "Datei hochladen",
            "en": "Upload file"
        },
        "download-file-prompt": {
            "de": "Möchten Sie die allgemeine Struktur der Datei behalten?",
            "en": "Do you want to keep the general file structure?"
        },
        "keep": {
            "de": "Struktur beibehalten",
            "en": "Keep structure"
        },
        "cancel": {
            "de": "Abbrechen",
            "en": "Cancel"
        },
        "using-description": {
            "de": "Drücke 'Leertaste' auf einem Zustand\nDrücke 'c' auf einen leeren Raum, um einen Zustand zu erstellen\nDrücke 'r' auf einem Zustand um diesen zu entfernen",
            "en": "Press 'space' on a state\nPress 'c' on an empty space to create a new state\nPress 'r' on a state to delete the state"
        },
        "edit-state": {
            "de": "Zustand bearbeiten",
            "en": "Edit state"
        },
        "state-name": {
            "de": "Zustandsname",
            "en": "State name"
        },
        "initial-state": {
            "de": "Initialzustand",
            "en": "Initial state"
        },
        "final-state": {
            "de": "Endzustand",
            "en": "Final state"
        },
        "choose": {
            "de": "Wähle",
            "en": "Choose"
        },
        "predicate": {
            "de": "Prädikat",
            "en": "Predicate"
        },
        "next-state": {
            "de": "Nächster Zustand",
            "en": "Next state"
        },
        "manipulation-value": {
            "de": "Schreibwert",
            "en": "Manipulation value"
        },
        "determinism-error": {
            "de": "Determinismusfehler",
            "en": "Determinism error"
        },
        "cbEmpty": {
            "de": "kann nicht leer sein",
            "en": "can't be empty"
        },
        "isNotA": {
            "de": "ist kein",
            "en": "is not a"
        },
        "notFound": {
            "de": "nicht gefunden",
            "en": "not found"
        },
        "state": {
            "de": "Zustand",
            "en": "State"
        },
        "tape-letter": {
            "de": "Arbeitsbuchstabe",
            "en": "tape letter"
        },
        "inUse": {
            "de": "wird bereits genutzt",
            "en": "is already in use"
        }
    };

    public static Instance: I18nService;

    private lanuage: string = "de";

    constructor() {
        I18nService.Instance = this;
    }

    public lookUp(value: string): string {
        let translationData: any = this.data[value];
        return translationData[this.lanuage];
    }

    public setLanguage(value: string) {
        this.lanuage = value;
    }
}
