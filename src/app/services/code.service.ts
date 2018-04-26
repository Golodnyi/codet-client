import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class CodeService {

  constructor(private http: HttpClient) { }

  private _env = environment.backend;

  public get(code: any, pwd: any = false): Observable<any> {
    let params = new HttpParams();
    params = params.append('code', code);

    if (pwd) {
      params = params.append('pwd', pwd);
    }

    return this.http.get(this._env + '/v1/get', { params: params });
  }

  public add(code: any, lang: any = 'text', pwd: any = false, comment: false): Observable<any> {
    const body = {code: false, lang: false, pwd: false, comment: false};
    body.code = code;
    body.lang = lang;

    if (comment) {
      body.comment = comment;
    }

    if (pwd) {
      body.pwd = pwd;
    }

    return this.http.post(this._env + '/v1/add', body);
  }

}
