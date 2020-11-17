import { Observer } from '../observer/observer';
import { SubjectObserver } from './subjectObserver';

export class SubjectObserverWithMemory<Result>
  extends SubjectObserver<Result>
  implements Observer {
  protected oldData: { [topic: string]: unknown[][] };

  constructor() {
    super();
    this.oldData = {};
  }

  public getTopics(): string[] {
    const topics = new Array<string>();
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
  public subscribe(
    topic: string,
    subscriber: (...params) => Promise<Result>
  ): Promise<Result[]> {
    this.checkSubscribers(topic);
    this.subscribers[topic] = subscriber;
    const datas = this.oldData[topic];
    return Promise.all(datas.map((params) => subscriber(...params)));
  }

  public unsubscribe(topic: string): (...params) => Promise<Result> {
    this.checkSubscribers(topic);
    const subscriber = this.subscribers[topic];
    delete this.subscribers[topic];
    delete this.oldData[topic];
    return subscriber;
  }

  public async publish(topic: string, ...params): Promise<Result> {
    this.checkSubscribers(topic);
    const subscriber = this.subscribers[topic];
    this.oldData[topic].push(params);
    return Promise.resolve(subscriber(...params));
  }

  protected checkSubscribers(topic: string): void {
    if (!this.subscribers[topic] && this.oldData) {
      this.oldData[topic] = new Array<Array<unknown>>();
    }
  }
}
