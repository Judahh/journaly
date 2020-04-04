import { Observer } from '../observer/observer';
export declare class Journaly<Result> implements Observer {
    private subscribers;
    private oldData;
    constructor(hasMemory?: any);
    subscribe(subject: string, subscriber: (...params: any[]) => Promise<Result>): Promise<Array<Result>>;
    unsubscribe(subject: string, subscriber: (...params: any[]) => Promise<Result>): Array<(...params: any[]) => Promise<Result>>;
    publish(subject: string, ...params: any[]): Promise<Array<Result>>;
    private checkSubscribers;
}
//# sourceMappingURL=journaly.d.ts.map