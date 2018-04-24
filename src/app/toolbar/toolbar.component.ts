import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Output() saveEmmiter = new EventEmitter<Boolean>();

  constructor() { }

  public save(event: any) {
    this.saveEmmiter.emit(true);
  }
}
