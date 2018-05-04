import { Component, OnInit, Inject, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PasswordComponent } from '../password/password.component';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements AfterViewChecked {
  public comment: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    public dialogRef: MatDialogRef<PasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.comment) {
      this.comment = data.comment;
    }
  }

  ngAfterViewChecked() { this.changeDetector.detectChanges(); }

  public onSubmit(): void {
    this.dialogRef.close(this.comment);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }
}
