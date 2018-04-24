import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CodeService } from '../services/code.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  providers: [CodeService]
})
export class EditorComponent {
  public options: any = { printMargin: false };
  public lang: String = 'text';
  public pwd: any;
  public code: any;

  constructor(private router: Router, private codeService: CodeService) { }

  public changeLanguage(lang: String) {
    this.lang = lang;
  }

  public changePassword(pwd: any) {
    this.pwd = pwd;
  }

  public save(event: any) {
    if (!this.code.length) {
      return false;
    }

    this.codeService.add(this.code, this.lang, this.pwd).subscribe(
      res => {
        this.router.navigate([res.result, 'share']);
      },
      error => {
      }
    );
  }
}
