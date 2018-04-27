import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class WebsocketService {
  private ws: any;
  private timer = TimerObservable.create(5000, 1000);
  private timerSubscription: Subscription;
  private onOpen = new BehaviorSubject<any>(false);
  private onClose = new BehaviorSubject<any>(false);
  private onMessage = new BehaviorSubject<any>(false);

  constructor() { }

  public open() {
    return this.onOpen.asObservable();
  }

  public close() {
    return this.onClose.asObservable();
  }

  public message() {
    return this.onMessage.asObservable();
  }

  public connect() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.ws = new WebSocket(environment.websocket);

    this.ws.onopen = msg => {
      this.onOpen.next(msg);
    };

    this.ws.onclose = msg => {
      this.timerSubscription = this.timer.subscribe(() => {
        this.connect();
      });

      this.onClose.next(msg);
    };

    this.ws.onmessage = msg => {
      this.onMessage.next(msg);
    };
  }

  public send(channel, type, text) {
    const data = {
      type: type,
      message: text,
      channel: channel
    };

    this.ws.send(JSON.stringify(data));
  }

  public setMarker(channel, lineNumber, column, message) {
    const data = {
      type: 2,
      message: message,
      channel: channel,
      lineNumber: lineNumber,
      column: column
    };

    this.ws.send(JSON.stringify(data));
  }
}
