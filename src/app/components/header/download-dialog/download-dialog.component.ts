import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {I18nService} from "../../../services/i18n.service";

@Component({
    selector: 'app-download-dialog',
    templateUrl: './download-dialog.component.html',
    styleUrls: ['./download-dialog.component.css']
})
export class DownloadDialogComponent implements OnInit {
    public reuseStructure: boolean = true;

    constructor(public i18n: I18nService, public dialogRef: MatDialogRef<DownloadDialogComponent>) {
    }

    ngOnInit(): void {
    }

    public onCancelDialog() {
        this.dialogRef.close();
    }

    public onCheckBoxChanged(toggle: boolean): void {
        this.reuseStructure = toggle;
    }
}
