import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-marker-exist',
  templateUrl: './marker-exist.component.html',
  styleUrls: ['./marker-exist.component.css']
})
export class MarkerExistComponent {

  constructor(public dialogRef: MatDialogRef<MarkerExistComponent>) { }

  public onReplace() {
    this.dialogRef.close(true);
  }

  public onCancel() {
    this.dialogRef.close(false);
  }
}
