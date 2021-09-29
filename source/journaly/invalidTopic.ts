export default class InvalidTopic extends Error {
  constructor(topic?: string) {
    super('Invalid Topic:' + topic);
  }
}
