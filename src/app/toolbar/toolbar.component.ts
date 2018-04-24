import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Output() langEmmiter = new EventEmitter<String>();
  @Output() pwdEmmiter = new EventEmitter<any>();
  @Output() saveEmmiter = new EventEmitter<Boolean>();
  public langList = [];
  public langListFiltered = [];
  public showFiller = false;
  public languageControl = new FormControl();
  public pwd: any;

  constructor() {
    this.langList.push({name: 'Text', value: 'text'});
    this.langList.push({name: 'Bash', value: 'sh'});
    this.langList.push({name: 'C', value: 'c_cpp'});
    this.langList.push({name: 'C++', value: 'c_cpp'});
    this.langList.push({name: 'C#', value: 'csharp'});
    this.langList.push({name: 'Go', value: 'golang'});
    this.langList.push({name: 'PHP', value: 'php'});
    this.langList.push({name: 'JavaScript', value: 'javascript'});
    this.langList.push({name: 'TypeScript', value: 'typescript'});
    this.langList.push({name: 'Python', value: 'python'});
    this.langList.push({name: 'HTML', value: 'html'});
    this.langList.push({name: 'CSS', value: 'css'});
    this.langList.push({name: 'SQL', value: 'sql'});

    this.langListFiltered = this.langList;
  }

  ngOnInit() {
    this.languageControl.valueChanges.subscribe(lang => {
      this.langListFiltered = this.filter(lang);
    });
  }

  public filter(lang) {
    return this.langList.filter(option =>
      option.name.toLowerCase().indexOf(lang.toLowerCase()) === 0);
  }

  public setLanguage(lang) {
    this.langEmmiter.emit(lang.value);
  }

  public save(event: any) {
    this.pwdEmmiter.emit(this.pwd);
    this.saveEmmiter.emit(true);
  }
}
