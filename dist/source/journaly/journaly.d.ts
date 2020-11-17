import { PublisherSubscriber } from './publisherSubscriber';
import { PublisherSubscriberWithMemory } from './publisherSubscriberWithMemory';
import { SubjectObserver } from './subjectObserver';
import { SubjectObserverWithMemory } from './subjectObserverWithMemory';
export declare class Journaly {
    private constructor();
    static newJournaly<Result>(options?: {
        hasMemory?: boolean;
        multiple?: boolean;
    }): PublisherSubscriberWithMemory<Result> | PublisherSubscriber<Result> | SubjectObserverWithMemory<Result> | SubjectObserver<Result>;
}
//# sourceMappingURL=journaly.d.ts.map
