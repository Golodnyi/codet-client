import { Component, Input, ElementRef, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { map } from 'rxjs/operators/map';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  public messages = [];
  private ws: any;
  public text = '';
  private timer = TimerObservable.create(5000, 1000);
  private timerSubscription: Subscription;
  @ViewChild('chatLog') el: ElementRef;
  @Input() channel: any;
  @Output() messageEmmiter = new EventEmitter<boolean>();
  private newMessage = false;

  constructor() {
    this.connect();
  }

  public send() {
    if (!this.text.length) {
      return false;
    }

    const message = {
      type: 0,
      message: this.text,
      channel: this.channel
    };

    this.ws.send(JSON.stringify(message));
    this.text = '';
  }

  private connect() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.ws = new WebSocket(environment.websocket);

    this.ws.onopen = msg => {
      // TODO: проверить что присутствуют все переменные
      this.ws.send(JSON.stringify({ type: 1, channel: this.channel }));
    };

    this.ws.onmessage = msg => {
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
    };

    this.ws.onclose = msg => {
      this.messages.push({ name: 'System', message: 'You are disconected' });
      this.timerSubscription = this.timer.subscribe(() => {
        this.connect();
      });
    };
  }
}
