import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {HeaderComponent} from './components/header/header/header.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {TMRendererComponent} from './components/tmrenderer/tmrenderer.component';
import {StateEditorComponent} from './components/tmrenderer/state-editor/state-editor.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatOptionModule} from "@angular/material/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {TransitionEntryComponent} from './components/tmrenderer/transitionentry/transition-entry.component';
import { DownloadDialogComponent } from './components/header/download-dialog/download-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeAlphabetDialogComponent } from './components/header/change-alphabet-dialog/change-alphabet-dialog.component';


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        TMRendererComponent,
        StateEditorComponent,
        TransitionEntryComponent,
        DownloadDialogComponent,
        ChangeAlphabetDialogComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        MatCardModule,
        MatDividerModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatToolbarModule,
        MatAutocompleteModule,
        MatOptionModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatCheckboxModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
