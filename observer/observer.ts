export interface Observer {
    subscribe: Function;
    unsubscribe: Function;
    publish: Function;
}