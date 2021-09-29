// file deepcode ignore no-any: any needed
import { ISubject } from '../interfaces/iSubject';
import { SubjectPromise } from '../types/subjectPromise';
import InvalidSubscriber from './invalidSubscriber';
import { Subject } from './subject';

export class SubjectObserver<Result>
  extends Subject<Result>
  implements ISubject
{
  protected subscribers: Array<SubjectPromise<Result>>;

  constructor() {
    super();
    this.subscribers = [];
  }

  getTopics(): string[] {
    return [];
  }

  subscribe(subscriber: SubjectPromise<Result>): Promise<Result[]> {
    if (this.checkSubscriber(subscriber) !== -1)
      return new Promise((_resolve, reject) => {
        reject(new InvalidSubscriber());
      });
    this.subscribers.push(subscriber);
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  unsubscribe(subscriber: SubjectPromise<Result>): boolean {
    const index = this.checkSubscriber(subscriber);
    if (index === -1) {
      return false;
    }

    this.subscribers.splice(index, 1);
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async publish(...params: any[]): Promise<Result[]> {
    return Promise.all(
      this.subscribers.map((subscriber) => {
        return subscriber(...params);
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected checkSubscriber(subscriber: SubjectPromise<Result>): number {
    const index = this.subscribers.indexOf(subscriber);
    return index;
  }
}
