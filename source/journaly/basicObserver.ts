/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Observer } from '../observer/observer';

export class BasicObserver<Result> implements Observer {
  protected subscribers:
    | {
        [topic: string]: (...params) => Promise<Result>;
      }
    | {
        [topic: string]: Array<(...params) => Promise<Result>>;
      };

  constructor() {
    this.subscribers = {};
  }

  getTopics(): string[] {
    const topics: string[] = [];

    if (this.subscribers) {
      const newProps = Object.getOwnPropertyNames(this.subscribers);
      for (const prop of newProps) {
        if (!topics.includes(prop)) topics.push(prop);
      }
    }

    return topics;
  }

  subscribe(
    topic: string,
    subscriber: (...params) => Promise<Result>
  ): Promise<Result[]> {
    this.checkSubscribers(topic);
    this.subscribers[topic] = subscriber;
    return Promise.resolve([]);
  }

  unsubscribe(
    topic: string,
    subscriber?: (...params) => Promise<Result>
  ): ((...params) => Promise<Result>) | Array<(...params) => Promise<Result>> {
    this.checkSubscribers(topic);
    const removedSubscriber = this.subscribers[topic];
    delete this.subscribers[topic];
    return removedSubscriber;
  }

  async publish(topic: string, ...params): Promise<Result | Result[]> {
    this.checkSubscribers(topic);
    const subscribers = this.subscribers[topic];
    if (subscribers instanceof Array)
      return Promise.all(
        subscribers.map((subscriber) => subscriber(...params))
      );
    else return Promise.resolve(subscribers(...params));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected checkSubscribers(topic: string): void {}
}
