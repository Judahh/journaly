/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Observer } from '../observer/observer';
import { BasicObserver } from './basicObserver';

export class SubjectObserver<Result>
  extends BasicObserver<Result>
  implements Observer {
  protected subscribers: {
    [topic: string]: (...params) => Promise<Result>;
  };

  constructor() {
    super();
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

  unsubscribe(topic: string): (...params) => Promise<Result> {
    this.checkSubscribers(topic);
    const subscriber = this.subscribers[topic];
    delete this.subscribers[topic];
    return subscriber;
  }

  async publish(topic: string, ...params): Promise<Result> {
    this.checkSubscribers(topic);
    const subscriber = this.subscribers[topic];
    return Promise.resolve(subscriber(...params));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected checkSubscribers(topic: string): void {}
}
