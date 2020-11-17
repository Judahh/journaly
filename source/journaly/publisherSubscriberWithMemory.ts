import { Observer } from '../observer/observer';
import { PublisherSubscriber } from './publisherSubscriber';

export class PublisherSubscriberWithMemory<Result>
  extends PublisherSubscriber<Result>
  implements Observer {
  protected oldData: { [topic: string]: unknown[][] };

  constructor() {
    super();
    this.oldData = {};
  }

  getTopics(): string[] {
    const topics: string[] = [];
    let newProps = Object.getOwnPropertyNames(this.oldData);
    for (const prop of newProps) {
      if (!topics.includes(prop)) topics.push(prop);
    }

    newProps = Object.getOwnPropertyNames(this.subscribers);
    for (const prop of newProps) {
      if (!topics.includes(prop)) topics.push(prop);
    }

    return topics;
  }

  subscribe(
    topic: string,
    subscriber: (...params) => Promise<Result>
  ): Promise<Result[]> {
    this.checkSubscribers(topic);
    this.subscribers[topic].push(subscriber);
    const datas = this.oldData[topic];
    return Promise.all(datas.map((params) => subscriber(...params)));
  }

  unsubscribe(
    topic: string,
    subscriber?: (...params) => Promise<Result>
  ): Array<(...params) => Promise<Result>> {
    this.checkSubscribers(topic);
    this.subscribers[topic] = this.subscribers[topic].filter(
      (element) => element !== subscriber
    );
    //! TODO: check oldData
    return this.subscribers[topic];
  }

  async publish(topic: string, ...params): Promise<Result[]> {
    this.checkSubscribers(topic);
    this.oldData[topic].push(params);
    const subscribers = this.subscribers[topic];
    return Promise.all(subscribers.map((subscriber) => subscriber(...params)));
  }

  protected checkSubscribers(topic: string): void {
    if (!this.subscribers[topic]) {
      this.subscribers[topic] = new Array<(...params) => Promise<Result>>();
      this.oldData[topic] = new Array<Array<unknown>>();
    }
  }
}
