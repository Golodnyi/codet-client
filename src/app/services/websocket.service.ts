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
      console.log('service', 'onOpen');
      this.onOpen.next(msg);
    };

    this.ws.onclose = msg => {
      console.log('service', 'onClose');
      this.timerSubscription = this.timer.subscribe(() => {
        console.log('service', 'Reconnect');
        this.connect();
      });

      this.onClose.next(msg);
    };

    this.ws.onmessage = msg => {
      console.log('service', 'onMessage', msg);
      this.onMessage.next(msg);
    };
  }

  public send(channel, type, text) {
    const data = {
      type: type,
      message: text,
      channel: channel
    };

    console.log('service', 'send');
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

    console.log('service', 'send');
    this.ws.send(JSON.stringify(data));
  }
}
