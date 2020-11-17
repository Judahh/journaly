import { PublisherSubscriber } from './publisherSubscriber';
import { PublisherSubscriberWithMemory } from './publisherSubscriberWithMemory';
import { SubjectObserver } from './subjectObserver';
import { SubjectObserverWithMemory } from './subjectObserverWithMemory';

export class Journaly {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  static newJournaly<Result>(options: {
    hasMemory?: boolean;
    multiple?: boolean;
  }):
    | PublisherSubscriberWithMemory<Result>
    | PublisherSubscriber<Result>
    | SubjectObserverWithMemory<Result>
    | SubjectObserver<Result> {
    if (options.multiple)
      if (options.hasMemory) return new PublisherSubscriberWithMemory<Result>();
      else return new PublisherSubscriber<Result>();
    else if (options.hasMemory) return new SubjectObserverWithMemory<Result>();
    else return new SubjectObserver<Result>();
  }
}
