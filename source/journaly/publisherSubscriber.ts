// file deepcode ignore no-any: any needed
import { Subject } from '../interfaces/subject';
import { SubjectPromise } from '../types/subjectPromise';
import { GenericSubject } from './genericSubject';

export class PublisherSubscriber<Result>
  extends GenericSubject<Result>
  implements Subject {
  protected subscribers: {
    [topic: string]: Array<SubjectPromise<Result>>;
  };
  constructor() {
    super();
    this.subscribers = {};
  }

  subscribe(
    subscriber: SubjectPromise<Result>,
    topic: string
  ): Promise<Result[]> {
    this.checkTopic(topic);
    if (this.checkSubscriber(subscriber, topic) !== -1)
      return new Promise((_resolve, reject) => {
        reject();
      });
    this.subscribers[topic].push(subscriber);
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  unsubscribe(subscriber: SubjectPromise<Result>, topic: string): boolean {
    this.checkTopic(topic);
    const index = this.checkSubscriber(subscriber, topic);
    if (index === -1) {
      return false;
    }

    this.subscribers[topic].splice(index, 1);
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async publish(topic: string, ...params: any[]): Promise<Result[]> {
    this.checkTopic(topic);
    return Promise.all(
      this.subscribers[topic].map((subscriber) => {
        return subscriber(...params);
      })
    );
  }

  protected checkSubscriber(
    subscriber: SubjectPromise<Result>,
    topic: string
  ): number {
    const index = this.subscribers[topic].indexOf(subscriber);
    return index;
  }
}
