/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observer } from '../observer/observer';

export class Journaly implements Observer {
  private hasMemory: boolean;
  private subscribers: any;
  private subscribersOldData: any;

  constructor(hasMemory?) {
    this.subscribers = {};
    this.hasMemory = hasMemory || false;
    if (this.hasMemory) {
      this.subscribersOldData = {};
    }
  }

  public subscribe(subject: string, subscriber: (data) => Promise<any>): void {
    this.checkSubscribers(subject);
    this.subscribers[subject].push(subscriber);
    if (this.hasMemory) {
      this.subscribersOldData[subject].forEach((data) => {
        subscriber(data);
      });
    }
  }

  public unsubscribe(
    subject: string,
    subscriber: (data) => Promise<any>
  ): void {
    this.checkSubscribers(subject);
    this.subscribers[subject] = this.subscribers[subject].filter((element) => {
      return element !== subscriber;
    });
  }

  public async publish(subject: string, data): Promise<any> {
    this.checkSubscribers(subject);
    if (this.hasMemory) {
      this.subscribersOldData[subject].push(data);
    }
    const subscribers = this.subscribers[subject];

    return Promise.all(subscribers.map((subscriber) => subscriber(data)));
  }

  private checkSubscribers(subject: string): void {
    if (!this.subscribers[subject]) {
      this.subscribers[subject] = new Array<Promise<any>>();
      if (this.hasMemory) {
        this.subscribersOldData[subject] = new Array<Promise<any>>();
      }
    }
  }
}
