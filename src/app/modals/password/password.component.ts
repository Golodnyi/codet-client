import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  public pwd: any;

  constructor(public dialogRef: MatDialogRef<PasswordComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.password) {
      this.pwd = data.password;
    }
  }

  public onSubmit(): void {
    this.dialogRef.close(this.pwd);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }
}
