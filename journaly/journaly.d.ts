import { Observer } from "../observer/observer";
export declare class Journaly implements Observer {
    private hasMemory;
    private subscribers;
    private subscribersOldData;
    constructor(hasMemory?: any);
    subscribe(subscribers: any, callback: any): void;
    unsubscribe(subscribers: any, callback: any): void;
    publish(subscribers: any, data: any): void;
    private checkSubscribers;
}
