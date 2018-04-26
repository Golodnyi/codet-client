import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-url',
  templateUrl: './url.component.html',
  styleUrls: ['./url.component.css']
})
export class UrlComponent {
  constructor(public dialogRef: MatDialogRef<UrlComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  public onClose(): void {
    this.dialogRef.close(false);
  }
}
