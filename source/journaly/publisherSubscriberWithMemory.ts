// file deepcode ignore no-any: any needed
import { ISubject } from '../interfaces/iSubject';
import { SubjectPromise } from '../types/subjectPromise';
import { PublisherSubscriber } from './publisherSubscriber';

export class PublisherSubscriberWithMemory<Result>
  extends PublisherSubscriber<Result>
  implements ISubject {
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

  async subscribe(
    subscriber: SubjectPromise<Result>,
    topic: string
  ): Promise<Result[]> {
    try {
      await super.subscribe(subscriber, topic);
      return Promise.all(
        this.oldData[topic].map((params) => subscriber(...params))
      );
    } catch (error) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }
  }

  async publish(topic: string, ...params: any[]): Promise<Result[]> {
    this.checkTopic(topic);
    const promises = Promise.all(
      this.subscribers[topic].map((subscriber) => {
        return subscriber(...params);
      })
    );

    this.oldData[topic].push(params);
    return promises;
  }

  protected checkTopic(topic: string): void {
    if (!this.subscribers[topic]) {
      this.subscribers[topic] = [];
      this.oldData[topic] = [];
    }
  }
}
