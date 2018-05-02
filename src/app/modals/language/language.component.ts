import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {
  public langList = [];
  public langListFiltered = [];
  public languageControl = new FormControl();
  public lang: any;

  constructor(public dialogRef: MatDialogRef<LanguageComponent>) {
    this.langList.push({ name: 'Text', value: 'text' });
    this.langList.push({ name: 'Bash', value: 'sh' });
    this.langList.push({ name: 'C', value: 'c_cpp' });
    this.langList.push({ name: 'C++', value: 'c_cpp' });
    this.langList.push({ name: 'C#', value: 'csharp' });
    this.langList.push({ name: 'Go', value: 'golang' });
    this.langList.push({ name: 'Rust', value: 'rust' });
    this.langList.push({ name: 'Erlang', value: 'erlang' });
    this.langList.push({ name: 'Kotlin', value: 'kotlin' });
    this.langList.push({ name: 'Java', value: 'java' });
    this.langList.push({ name: 'PHP', value: 'php' });
    this.langList.push({ name: 'Perl', value: 'perl' });
    this.langList.push({ name: 'Ruby', value: 'ruby' });
    this.langList.push({ name: 'Scala', value: 'scala' });
    this.langList.push({ name: 'Swift', value: 'swift' });
    this.langList.push({ name: 'JavaScript', value: 'javascript' });
    this.langList.push({ name: 'TypeScript', value: 'typescript' });
    this.langList.push({ name: 'Python', value: 'python' });
    this.langList.push({ name: 'HTML', value: 'html' });
    this.langList.push({ name: 'CSS', value: 'css' });
    this.langList.push({ name: 'SQL', value: 'sql' });

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
    this.lang = lang;
  }

  public onSubmit(): void {
    this.dialogRef.close(this.lang);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }
}
