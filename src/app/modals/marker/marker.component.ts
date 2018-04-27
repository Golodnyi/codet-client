import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.css']
})
export class MarkerComponent {
  public message: any;

  constructor(public dialogRef: MatDialogRef<MarkerComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  public onSubmit() {
    this.dialogRef.close(this.message);
  }

  public onClose() {
    this.dialogRef.close(false);
  }
}
