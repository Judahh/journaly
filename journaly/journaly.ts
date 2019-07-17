import { Observer } from "../observer/observer";

export class Journaly implements Observer{
    private hasMemory: boolean;
    private subscribers: any;
    private subscribersOldData: any;

    constructor(hasMemory?) {
        let _self = this;
        _self.subscribers = {};
        _self.hasMemory = hasMemory;
        if(this.hasMemory) {
            _self.subscribersOldData = {};
        }
        
    }

    public subscribe(subscribers, callback) {
        this.checkSubscribers(subscribers);
        this.subscribers[subscribers].push(callback);
        if(this.hasMemory) {
            this.subscribersOldData[subscribers].forEach((data) => {
                callback(data);
            });
        }
    }

    public unsubscribe(subscribers, callback) {
        this.checkSubscribers(subscribers);
        this.subscribers[subscribers] = this.subscribers[subscribers].filter((element) => {
            return element !== callback;
        });
    }

    public publish(subscribers, data) {
        this.checkSubscribers(subscribers);
        this.subscribers[subscribers].forEach((subscriber) => {
            subscriber(data);
        });
        if(this.hasMemory) {
            this.subscribersOldData[subscribers].push(data);
        }
    }

    private checkSubscribers(subscribers) {
        if (this.subscribers[subscribers] === undefined) {
            this.subscribers[subscribers] = new Array<any>();
            if(this.hasMemory) {
                this.subscribersOldData[subscribers] = new Array<any>();
            }
        }
    }
}
