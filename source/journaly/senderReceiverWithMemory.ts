// file deepcode ignore no-any: any needed
import { ISubject } from '../interfaces/iSubject';
import { SubjectPromise } from '../types/subjectPromise';
import { SenderReceiver } from './senderReceiver';

export class SenderReceiverWithMemory<Result>
  extends SenderReceiver<Result>
  implements ISubject
{
  protected oldData: { [topic: string]: unknown[][] };

  constructor() {
    super();
    this.oldData = {};
  }

  getTopics(): string[] {
    const topics: string[] = super.getTopics();

    const newProps = Object.getOwnPropertyNames(this.subscribers);
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

  unsubscribe(subscriber: SubjectPromise<Result>, topic: string): boolean {
    if (super.unsubscribe(subscriber, topic)) {
      delete this.oldData[topic];
      return true;
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async publish(topic: string, ...params: any[]): Promise<Result> {
    this.checkTopic(topic);
    const promise = super.publish(topic, ...params);
    this.oldData[topic].push(params);
    return promise;
  }
  protected checkTopic(topic: string): void {
    if (!this.oldData[topic]) {
      this.oldData[topic] = [];
    }
  }
}
