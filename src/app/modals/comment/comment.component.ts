import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { PasswordComponent } from '../password/password.component';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  public comment: any;

  constructor(public dialogRef: MatDialogRef<PasswordComponent>) {
  }

  public onSubmit(): void {
    this.dialogRef.close(this.comment);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }
}
