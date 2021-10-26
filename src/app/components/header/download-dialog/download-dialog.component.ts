import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-download-dialog',
    templateUrl: './download-dialog.component.html',
    styleUrls: ['./download-dialog.component.css']
})
export class DownloadDialogComponent implements OnInit {
    public reuseStructure: boolean = true;

    constructor(public dialogRef: MatDialogRef<DownloadDialogComponent>) {
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
