import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  public pwd: any;

  constructor(public dialogRef: MatDialogRef<PasswordComponent>) {
  }

  public onClose(): void {
    this.dialogRef.close(this.pwd);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }
}
