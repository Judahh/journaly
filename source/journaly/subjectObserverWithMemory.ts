// file deepcode ignore no-any: any needed
import { ISubject } from '../interfaces/iSubject';
import { SubjectPromise } from '../types/subjectPromise';
import { SubjectObserver } from './subjectObserver';

export class SubjectObserverWithMemory<Result>
  extends SubjectObserver<Result>
  implements ISubject {
  protected oldData: unknown[][];

  constructor() {
    super();
    this.oldData = [];
  }

  async subscribe(subscriber: SubjectPromise<Result>): Promise<Result[]> {
    try {
      await super.subscribe(subscriber);
      return Promise.all(this.oldData.map((params) => subscriber(...params)));
    } catch (error) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async publish(...params: any[]): Promise<Result[]> {
    const promises = Promise.all(
      this.subscribers.map((subscriber) => {
        return subscriber(...params);
      })
    );

    this.oldData.push(params);
    return promises;
  }
}
