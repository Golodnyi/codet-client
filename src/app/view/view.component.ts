import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from 'selenium-webdriver/http';
import { CodeService } from '../services/code.service';
import { MatDialog } from '@angular/material';
import { MarkerComponent } from '../modals/marker/marker.component';
import { WebsocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  providers: [CodeService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnDestroy {
  public channel: any;
  public comment: any = false;
  public code: any;
  public lang: String;
  public needPassword = false;
  public wrongPassword = false;
  public password: any;
  public show = false;
  public newMessage = false;
  public chat = [];
  public markers = [];
  private subscription: Subscription = new Subscription();

  @ViewChild('editor') editor: any;

  private initData(data: any) {
    this.code = data.result.code;
    this.lang = data.result.lang;

    if (data.result.comment !== undefined) {
      this.comment = data.result.comment;
    }

    if (data.result.chat !== undefined) {
      this.chat = data.result.chat;
    }

    this.changeDetectorRef.markForCheck();

    if (data.result.markers && data.result.markers.length) {
      setTimeout(() => {
        this.editor.getEditor().session.on('changeScrollTop', () => {
          console.log('scroll top');
          this.redrawMarkers();
        });
        this.editor.getEditor().session.on('changeScrollLeft', () => {
          console.log('scroll left');
          this.redrawMarkers();
        });
        data.result.markers.forEach(marker => {
          this.addMarker(marker.lineNumber, marker.column, marker.name, marker.message);
        });
      }, 1000);
    }
  }

  constructor(
    private dialog: MatDialog,
    private router: ActivatedRoute,
    private codeService: CodeService,
    private route: Router,
    private webSocketService: WebsocketService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.router.params.subscribe(params => {
      this.channel = params['code'];

      this.webSocketService.connect();

      this.subscription.add(
        this.webSocketService.open().subscribe(open => {
          if (!open) {
            return false;
          }
          this.webSocketService.send(this.channel, 1, JSON.stringify({ type: 1, channel: this.channel }));
        })
      );

      this.subscription.add(
        this.webSocketService.message().subscribe(msg => {
          if (!msg) {
            return false;
          }

          const data = JSON.parse(msg.data);

          switch (data.type) {
            case 2:
              this.addMarker(data.lineNumber, data.column, data.name, data.message);
              break;
          }
        })
      );

      this.codeService.get(params['code']).subscribe(
        res => {
          this.initData(res);
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

  private redrawMarkers() {
    this.markers.forEach(marker => {
      const coord = this.editor.getEditor().renderer.textToScreenCoordinates(marker.lineNumber, marker.column);
      marker.x = coord.pageX + 5;
      marker.y = coord.pageY - 12;
    });

    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  private addMarker(lineNumber, column, name, message) {
    if (this.editor === undefined) {
      return false;
    }

    const coord = this.editor.getEditor().renderer.textToScreenCoordinates(lineNumber, column);
    this.markers.push({ x: coord.pageX + 5, y: coord.pageY - 12, name: name, message: message, lineNumber: lineNumber, column: column });
    this.changeDetectorRef.markForCheck();
  }

  public setPassword() {
    this.codeService.get(this.channel, this.password).subscribe(
      res => {
        this.initData(res);

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

  public showChat(event: any) {
    this.show = event;
  }

  public onMessage(event) {
    this.newMessage = !this.newMessage;
  }

  public openMarkerDialog(): void {
    const row = this.editor.getEditor().selection.getCursor().row;
    const column = this.editor.getEditor().selection.getCursor().column;
    const code = this.editor.getEditor().session.doc.$lines[row];
    const coord = this.editor.getEditor().renderer.textToScreenCoordinates(row, column);

    const dialogRef = this.dialog.open(MarkerComponent, {
      width: '360px',
      data: {
        lineNumber: row + 1,
        code: code.replace(/^\s*(.*)\s*$/, '$1')
      }
    });

    dialogRef.afterClosed().subscribe(msgMarker => {
      if (msgMarker) {
        this.webSocketService.setMarker(this.channel, row, column, msgMarker);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
