import { Component, Input, ElementRef, ViewChild, AfterViewInit, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Subscription';
import { WebsocketService } from '../services/websocket.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  public messages = [];
  public text = '';
  @ViewChild('chatLog') el: ElementRef;
  @Input() channel: any;
  @Input() chat = [];
  @Output() messageEmmiter = new EventEmitter<boolean>();
  private newMessage = false;
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    if (this.chat.length) {
      this.messages = this.chat;
    }
  }

  constructor(private webSocketService: WebsocketService) {
    this.subscription.add(
      this.webSocketService.open().subscribe(open => {
        if (!open) {
          return false;
        }
      })
    );

    this.subscription.add(
      this.webSocketService.close().subscribe(close => {
        if (!close) {
          return false;
        }
        this.messages.push({ name: 'System', message: 'You are disconect' });
      })
    );

    this.subscription.add(
      this.webSocketService.message().subscribe(msg => {
        if (!msg) {
          return false;
        }
        const data = JSON.parse(msg.data);

        switch (data.type) {
          case 0:
            this.messages.push(data);
            break;
          case 1:
            if (data.result === 'ok') {
              this.messages.push({ name: 'System', message: 'You are connected' });
            } else {
              this.messages.push({ name: 'System', message: 'Error to join channel' });
            }
            break;
        }

        this.newMessage = !this.newMessage;
        this.messageEmmiter.emit(this.newMessage);

        setTimeout(() => {
          this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
        }, 200);
      })
    );
  }

  public send() {
    this.webSocketService.send(this.channel, 0, this.text);
    this.text = '';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
