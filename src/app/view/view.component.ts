import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from 'selenium-webdriver/http';
import { CodeService } from '../services/code.service';
import { MatDialog } from '@angular/material';
import { MarkerComponent } from '../modals/marker/marker.component';
import { WebsocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs/Subscription';
import { MarkerExistComponent } from '../modals/marker-exist/marker-exist.component';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  providers: [CodeService, WebsocketService],
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
  private scrollX = 0;
  private scrollY = 0;

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

    setTimeout(() => {
      this.editor.getEditor().session.on('changeScrollTop', (e) => {
        this.scrollY = e;
        this.redrawMarkers();
      });
      this.editor.getEditor().session.on('changeScrollLeft', (e) => {
        this.scrollX = e;
        this.redrawMarkers();
      });

      if (data.result.markers !== undefined) {
        data.result.markers.forEach(marker => {
          this.addMarker(marker.lineNumber, marker.column, marker.name, marker.message);
        });
      }
    }, 1000);
  }

  public hiddenMarker(x: number, y: number, marker: any) {
    const width = this.editor.getEditor().renderer.$size.width;
    const height = this.editor.getEditor().renderer.$size.height;
    const widthVisible = x - width <= 0;
    const heightVisible = y - height <= 0;

    return !(widthVisible && heightVisible);
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
            this.changeDetectorRef.markForCheck();
          } else if (error.status === 404) {
            this.route.navigate(['/404']);
          }
        }
      );
    });
  }

  private redrawMarkers() {
    this.markers.forEach(marker => {
      const code = this.editor.getEditor().session.doc.$lines[marker.lineNumber];
      const coord = this.editor.getEditor().renderer.textToScreenCoordinates(marker.lineNumber, code.length);
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

    this.deleteMarkerByLine(lineNumber);

    const code = this.editor.getEditor().session.doc.$lines[lineNumber];
    const coord = this.editor.getEditor().renderer.textToScreenCoordinates(lineNumber, code.length);
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

  private searchMarkerByLine(lineNumber: number): boolean {
    return this.markers.find(marker => marker.lineNumber === lineNumber);
  }

  private deleteMarkerByLine(lineNumber: number) {
    const obj = this.searchMarkerByLine(lineNumber);
    this.markers = this.markers.filter(marker => {
      return marker !== obj;
    });
  }

  public openMarkerDialog(): void {
    const row = this.editor.getEditor().selection.getCursor().row;
    const column = this.editor.getEditor().selection.getCursor().column;
    const code = this.editor.getEditor().session.doc.$lines[row];
    const coord = this.editor.getEditor().renderer.textToScreenCoordinates(row, column);

    if (this.searchMarkerByLine(row) !== undefined) {
      const dialogExistRef = this.dialog.open(MarkerExistComponent, {
        width: '360px',
      });

      dialogExistRef.afterClosed().subscribe(result => {
        if (result) {
          this.markerDialog(row, column, code, true);
        }
      });
    } else {
      this.markerDialog(row, column, code, false);
    }
  }

  private markerDialog(row, column, code, replace) {
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
