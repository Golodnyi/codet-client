import { Component, OnInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UrlComponent } from '../url/url.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnChanges {
  @Output() chatEmmiter = new EventEmitter<boolean>();
  @Input() new;
  @Input() channel;
  private open = false;

  constructor(private dialog: MatDialog, private router: Router) { }

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

  public openUrlDialog(): void {
    const dialogRef = this.dialog.open(UrlComponent, {
      width: '360px',
      data: {
        url: document.location.protocol + '//' + document.location.hostname + '/' + this.channel
      }
    });
  }

  public home() {
    this.router.navigate(['/']);
  }
}
