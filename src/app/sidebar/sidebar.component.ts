import { Component, OnInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnChanges {
  @Output() chatEmmiter = new EventEmitter<boolean>();
  @Input() new;
  private open = false;

  constructor() { }

  ngOnChanges(changes) {
    if (!this.open) {
      this.new = true;
    } else {
      this.new = false;
    }
  }

  public showChat() {
    this.open = !this.open;
    this.new = false;
    this.chatEmmiter.emit(this.open);
  }

}
