import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { LanguageComponent } from '../modals/language/language.component';
import { MatDialog } from '@angular/material';
import { PasswordComponent } from '../modals/password/password.component';
import { CommentComponent } from '../modals/comment/comment.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  @Output() langEmmiter = new EventEmitter<String>();
  @Output() pwdEmmiter = new EventEmitter<any>();
  @Output() commentEmmiter = new EventEmitter<any>();
  @Output() saveEmmiter = new EventEmitter<Boolean>();
  public showFiller = false;
  public lang: any;
  public pwd: any = false;
  public comment: any;

  constructor(public dialog: MatDialog) {
    this.setLanguage({name: 'C++', value: 'c_cpp'});
  }

  public setLanguage(lang) {
    this.lang = lang.name;
    this.langEmmiter.emit(lang.value);
  }

  public setPassword(pwd) {
    this.pwd = pwd;
    this.pwdEmmiter.emit(pwd);
  }

  public setComment(comment) {
    this.comment = comment;
    this.commentEmmiter.emit(comment);
  }

  public openLanguageDialog(): void {
    const dialogRef = this.dialog.open(LanguageComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(lang => {
      if (lang) {
        this.setLanguage(lang);
      }
    });
  }

  public openPasswordDialog(): void {
    const dialogRef = this.dialog.open(PasswordComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(pwd => {
      if (pwd) {
        this.setPassword(pwd);
      }
    });
  }

  public openCommentDialog(): void {
    const dialogRef = this.dialog.open(CommentComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(comment => {
      if (comment) {
        this.setComment(comment);
      }
    });
  }
}
