/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// file deepcode ignore no-any: any needed
import { ISubject } from '../interfaces/iSubject';
import { SubjectPromise } from '../types/subjectPromise';
import { Subject } from './subject';

export class SenderReceiver<Result>
  extends Subject<Result>
  implements ISubject {
  protected subscribers: {
    [topic: string]: SubjectPromise<Result>;
  };

  constructor() {
    super();
    this.subscribers = {};
  }

  subscribe(
    subscriber: SubjectPromise<Result>,
    topic: string
  ): Promise<Result[]> {
    this.subscribers[topic] = subscriber;
    return Promise.resolve([]);
  }

  unsubscribe(subscriber: SubjectPromise<Result>, topic: string): boolean {
    const index = this.checkSubscriber(subscriber, topic);
    if (index === -1) {
      return false;
    }
    delete this.subscribers[topic];
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async publish(topic: string, ...params: any): Promise<Result> {
    const subscriber = this.subscribers[topic];
    if (!subscriber) return new Promise((_resolve, reject) => reject());
    return Promise.resolve(subscriber(...params));
  }

  protected checkSubscriber(
    _subscriber: SubjectPromise<Result>,
    topic: string
  ): number {
    return this.subscribers[topic] ? 1 : -1;
  }
}
