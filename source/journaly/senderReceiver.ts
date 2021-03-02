/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Subject } from '../interfaces/subject';
import { SubjectPromise } from '../types/subjectPromise';
import { GenericSubject } from './genericSubject';

export class SenderReceiver<Result>
  extends GenericSubject<Result>
  implements Subject {
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

  async publish(topic: string, ...params: any): Promise<Result> {
    const subscriber = this.subscribers[topic];
    if (!subscriber) return new Promise((_resolve, reject) => reject());
    return Promise.resolve(subscriber(...params));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected checkSubscriber(
    _subscriber: SubjectPromise<Result>,
    topic: string
  ): number {
    return this.subscribers[topic] ? 1 : -1;
  }
}
