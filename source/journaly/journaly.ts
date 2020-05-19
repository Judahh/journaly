import { Observer } from '../observer/observer';

export class Journaly<Result> implements Observer {
  //! TODO: Add get subjects
  private subscribers: {
    [subject: string]: Array<(...params) => Promise<Result>>;
  };
  private oldData: { [subject: string]: Array<Array<unknown>> } | undefined;

  constructor(hasMemory?) {
    this.subscribers = {};
    if (hasMemory) {
      this.oldData = {};
    }
  }

  public getSubjects(): Array<string> {
    let subjects = new Array<string>();

    if (this.oldData) {
      const newProps = Object.getOwnPropertyNames(this.oldData);
      subjects = newProps;
    }

    if (this.subscribers) {
      const newProps = Object.getOwnPropertyNames(this.subscribers);
      for (const prop of newProps) {
        if (!subjects.includes(prop)) subjects.push(prop);
      }
    }

    return subjects;
  }

  public subscribe(
    subject: string,
    subscriber: (...params) => Promise<Result>
  ): Promise<Array<Result>> {
    this.checkSubscribers(subject);
    this.subscribers[subject].push(subscriber);
    if (this.oldData) {
      const datas = this.oldData[subject];
      return Promise.all(datas.map((params) => subscriber(...params)));
    }
    return Promise.resolve([]);
  }

  public unsubscribe(
    subject: string,
    subscriber: (...params) => Promise<Result>
  ): Array<(...params) => Promise<Result>> {
    this.checkSubscribers(subject);
    this.subscribers[subject] = this.subscribers[subject].filter(
      (element) => element !== subscriber
    );
    return this.subscribers[subject];
  }

  public async publish(subject: string, ...params): Promise<Array<Result>> {
    this.checkSubscribers(subject);
    if (this.oldData) {
      this.oldData[subject].push(params);
    }
    const subscribers = this.subscribers[subject];
    return Promise.all(subscribers.map((subscriber) => subscriber(...params)));
  }

  private checkSubscribers(subject: string): void {
    if (!this.subscribers[subject]) {
      this.subscribers[subject] = new Array<(...params) => Promise<Result>>();
      if (this.oldData) {
        this.oldData[subject] = new Array<Array<unknown>>();
      }
    }
  }
}
