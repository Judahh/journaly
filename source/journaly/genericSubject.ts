/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Subject } from '../interfaces/subject';
import { SubjectPromise } from '../types/subjectPromise';

export class GenericSubject<Result> implements Subject {
  protected subscribers!:
    | {
        [topic: string]: Array<SubjectPromise<Result>>;
      }
    | { [topic: string]: SubjectPromise<Result> }
    | Array<SubjectPromise<Result>>;

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
    subscriber: SubjectPromise<Result>,
    topic?: string
  ): Promise<Result[]> {
    if (topic) this.checkTopic(topic);
    if (this.checkSubscriber(subscriber, topic) !== -1)
      return new Promise((_resolve, reject) => {
        reject();
      });
    if (topic) this.subscribers[topic].push(subscriber);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    else this.subscribers.push(subscriber);
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  unsubscribe(subscriber: SubjectPromise<Result>, topic?: string): boolean {
    if (topic) this.checkTopic(topic);
    const index = this.checkSubscriber(subscriber, topic);
    if (index === -1) {
      return false;
    }

    if (topic) this.subscribers[topic].splice(index, 1);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    else this.subscribers.splice(index, 1);
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async publish(topic?: string, ...params: any[]): Promise<Result[] | Result> {
    if (topic) {
      this.checkTopic(topic);
      return Promise.all(
        this.subscribers[topic].map((subscriber) => {
          return subscriber(...params);
        })
      );
    } else {
      return Promise.all(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.subscribers.map((subscriber) => {
          return subscriber(...params);
        })
      );
    }
  }

  protected checkSubscriber(
    subscriber: SubjectPromise<Result>,
    topic?: string
  ): number {
    const index = topic
      ? this.subscribers[topic].indexOf(subscriber)
      : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.subscribers.indexOf(subscriber);
    return index;
  }

  protected checkTopic(topic: string): void {
    if (!this.subscribers[topic]) {
      this.subscribers[topic] = [];
    }
  }
}
