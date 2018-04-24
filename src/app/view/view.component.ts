import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from 'selenium-webdriver/http';
import { CodeService } from '../services/code.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  providers: [CodeService]
})
export class ViewComponent {
  private params: any;
  public code: any;
  public lang: String;
  public needPassword = false;
  public wrongPassword = false;
  public password: any;
  constructor(private router: ActivatedRoute, private codeService: CodeService, private route: Router) {
    this.router.params.subscribe(params => {
      this.params = params;

      this.codeService.get(params['code']).subscribe(
        res => {
          this.code = res.result.code;
          this.lang = res.result.lang;
        },
        error => {
          if (error.status === 401) {
            this.needPassword = true;
          } else if (error.status === 404) {
            this.route.navigate(['/404']);
          }
        }
      );
    });
  }

  public setPassword() {
    this.codeService.get(this.params['code'], this.password).subscribe(
      res => {
        this.code = res.result.code;
        this.lang = res.result.lang;

        this.needPassword = false;
        this.wrongPassword = false;
      },
      error => {
        if (error.status === 403) {
          this.wrongPassword = true;
        }
      }
    );
  }
}
