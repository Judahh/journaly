import { Observer } from '../observer/observer';
export declare class Journaly implements Observer {
    private hasMemory;
    private subscribers;
    private subscribersOldData;
    constructor(hasMemory?: any);
    subscribe(subject: string, subscriber: (data: any) => Promise<any>): void;
    unsubscribe(subject: string, subscriber: (data: any) => Promise<any>): void;
    publish(subject: string, data: any): Promise<any>;
    private checkSubscribers;
}
//# sourceMappingURL=journaly.d.ts.map