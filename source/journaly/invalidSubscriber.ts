export default class InvalidSubscriber extends Error {
  constructor(subscriber?: string) {
    super('Invalid Subscriber:' + subscriber);
  }
}
