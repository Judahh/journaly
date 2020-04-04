/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observer } from '../observer/observer';

export class Journaly implements Observer {
  private subscribers: { [subject: string]: Array<(data) => Promise<any>> };
  private oldData: { [subject: string]: Array<any> } | undefined;

  constructor(hasMemory?) {
    this.subscribers = {};
    if (hasMemory) {
      this.oldData = {};
    }
  }

  public subscribe(
    subject: string,
    subscriber: (data) => Promise<any>
  ): Promise<any> {
    this.checkSubscribers(subject);
    this.subscribers[subject].push(subscriber);
    if (this.oldData) {
      const datas = this.oldData[subject];
      return Promise.all(datas.map((data) => subscriber(data)));
    }
    return Promise.resolve([]);
  }

  public unsubscribe(
    subject: string,
    subscriber: (data) => Promise<any>
  ): Array<(data) => Promise<any>> {
    this.checkSubscribers(subject);
    this.subscribers[subject] = this.subscribers[subject].filter(
      (element) => element !== subscriber
    );
    return this.subscribers[subject];
  }

  public async publish(subject: string, data): Promise<any> {
    this.checkSubscribers(subject);
    if (this.oldData) {
      this.oldData[subject].push(data);
    }
    const subscribers = this.subscribers[subject];
    return Promise.all(subscribers.map((subscriber) => subscriber(data)));
  }

  private checkSubscribers(subject: string): void {
    if (!this.subscribers[subject]) {
      this.subscribers[subject] = new Array<(data) => Promise<any>>();
      if (this.oldData) {
        this.oldData[subject] = new Array<Promise<any>>();
      }
    }
  }
}
