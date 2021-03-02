import { PublisherSubscriber } from './publisherSubscriber';
import { PublisherSubscriberWithMemory } from './publisherSubscriberWithMemory';
import { SenderReceiver } from './senderReceiver';
import { SenderReceiverWithMemory } from './senderReceiverWithMemory';
import { SubjectObserver } from './subjectObserver';
import { SubjectObserverWithMemory } from './subjectObserverWithMemory';

export class Journaly {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  static newJournaly<Result>(options?: {
    hasMemory?: boolean;
    hasTopic?: boolean;
    multiple?: boolean;
  }):
    | PublisherSubscriberWithMemory<Result>
    | PublisherSubscriber<Result>
    | SubjectObserverWithMemory<Result>
    | SubjectObserver<Result>
    | SenderReceiverWithMemory<Result>
    | SenderReceiver<Result> {
    if (options) {
      if (options.hasTopic && options.multiple)
        if (options.hasMemory)
          return new PublisherSubscriberWithMemory<Result>();
        else return new PublisherSubscriber<Result>();
      if (options.multiple)
        if (options.hasMemory) return new SubjectObserverWithMemory<Result>();
        else return new SubjectObserver<Result>();
      if (options.hasTopic)
        if (options.hasMemory) return new SenderReceiverWithMemory<Result>();
        else return new SenderReceiver<Result>();
    }
    return new SenderReceiver<Result>();
  }
}
