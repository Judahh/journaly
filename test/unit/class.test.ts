// file deepcode ignore no-any: just for test
import {
  Journaly,
  SubjectObserver,
  SubjectObserverWithMemory,
} from '../../source/index';
const timeout = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
let stringArray;
let objectArray;

class Class0 {
  private simpleString = 'asd';
  constructor(simpleString?: string) {
    if (simpleString) this.simpleString = simpleString;
  }
  async function1(object): Promise<string> {
    await timeout(1000);
    stringArray.push('test 1 ' + this.simpleString);
    objectArray.push(object);
    return new Promise((resolve) => resolve('1asd'));
  }

  async function2(object): Promise<string> {
    stringArray.push('test 1 qwe');
    objectArray.push(object);
    return new Promise((resolve) => resolve('1qwe'));
  }

  async function3(object, object2): Promise<string> {
    stringArray.push('test 2 asd');
    objectArray.push([object, object2]);
    await timeout(500);
    return new Promise((resolve) => resolve('2asd'));
  }

  async function4(object, object2): Promise<string> {
    stringArray.push('test 2 qwe');
    objectArray.push([object, object2]);
    await timeout(500);
    return new Promise((resolve) => resolve('2qwe'));
  }

  function5(object, object2): Promise<string> {
    stringArray.push('test 3 dfg');
    objectArray.push([object, object2]);
    return new Promise((resolve) => {
      setTimeout(() => resolve('dfg' + this.simpleString), 750);
    });
  }

  function6(object, object2): Promise<string> {
    stringArray.push('test 3 hjk');
    objectArray.push([object, object2]);
    return new Promise((resolve) => {
      setTimeout(() => resolve('hjk'), 250);
    });
  }

  function7(object, object2, time): Promise<string> {
    stringArray.push('test 3 tyi');
    objectArray.push([object, object2]);
    return new Promise((resolve) => {
      setTimeout(() => resolve('tyi'), time);
    });
  }
}

test(
  'Publisher Subscriber Without Memory: subscribe 2 functions one slow and another fast' +
    ' then subscribe one medium' +
    ' then publish to each then check order',
  async (done) => {
    stringArray = new Array<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    objectArray = new Array<any>();
    const journaly = Journaly.newJournaly({
      multiple: true,
      hasTopic: true,
    });
    const class0 = new Class0();
    const function1Bound = class0.function1.bind(class0);
    const subscribe1 = journaly.subscribe(function1Bound, 'test');
    const subscribe2 = journaly.subscribe(class0.function2, 'test');
    const subscribe3 = journaly.subscribe(class0.function3, 'test2');

    const subscribes = await Promise.all([subscribe1, subscribe2, subscribe3]);

    expect(journaly.getTopics()).toStrictEqual(['test', 'test2']);

    expect(subscribes[0]).toStrictEqual([]);
    expect(subscribes[1]).toStrictEqual([]);
    expect(subscribes[2]).toStrictEqual([]);

    const publish1 = journaly.publish('test', { a: 'a' });
    const publish2 = journaly.publish('test2', { a: 'a' }, { b: 'b' });

    const publishes = await Promise.all([publish1, publish2]);

    expect(publishes[0]).toStrictEqual(['1asd', '1qwe']);
    expect(publishes[1]).toStrictEqual(['2asd']);

    expect(stringArray).toStrictEqual([
      'test 1 qwe',
      'test 2 asd',
      'test 1 asd',
    ]);
    expect(objectArray).toStrictEqual([
      { a: 'a' },
      [{ a: 'a' }, { b: 'b' }],
      { a: 'a' },
    ]);
    const subscribe4 = journaly.subscribe(class0.function4, 'test2');
    expect(await subscribe4).toStrictEqual([]);
    expect(stringArray).toStrictEqual([
      'test 1 qwe',
      'test 2 asd',
      'test 1 asd',
    ]);
    expect(objectArray).toStrictEqual([
      { a: 'a' },
      [{ a: 'a' }, { b: 'b' }],
      { a: 'a' },
    ]);
    expect(journaly.unsubscribe(function1Bound, 'test')).toStrictEqual(true);
    expect(journaly.unsubscribe(class0.function2, 'test')).toStrictEqual(true);
    expect(journaly.unsubscribe(class0.function3, 'test2')).toStrictEqual(true);
    expect(journaly.unsubscribe(class0.function4, 'test2')).toStrictEqual(true);

    const function5Bound = class0.function5.bind(class0);
    const subscribe5 = journaly.subscribe(function5Bound, 'test3');
    const subscribe6 = journaly.subscribe(class0.function6, 'test4');
    const subscribe7 = journaly.subscribe(class0.function7, 'test5');

    const subscribes2 = await Promise.all([subscribe5, subscribe6, subscribe7]);

    expect(journaly.getTopics()).toStrictEqual([
      'test',
      'test2',
      'test3',
      'test4',
      'test5',
    ]);

    expect(subscribes2[0]).toStrictEqual([]);
    expect(subscribes2[1]).toStrictEqual([]);
    expect(subscribes2[2]).toStrictEqual([]);

    const publish5 = journaly.publish('test3', { a: 'a' });
    const publish6 = journaly.publish('test4', { a: 'a' }, { b: 'b' });
    const publish7 = journaly.publish('test5', { a: 'a' }, { b: 'b' }, 1500);

    const publishes2 = await Promise.all([publish5, publish6, publish7]);

    expect(publishes2[0]).toStrictEqual(['dfgasd']);
    expect(publishes2[1]).toStrictEqual(['hjk']);
    expect(publishes2[2]).toStrictEqual(['tyi']);
    done();
  }
);

test(
  'Publisher Subscriber With Memory: subscribe 2 functions one slow and another fast' +
    ' then subscribe one medium' +
    ' then publish to each then check order',
  async (done) => {
    stringArray = new Array<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    objectArray = new Array<any>();
    const journaly = Journaly.newJournaly({
      hasMemory: true,
      multiple: true,
      hasTopic: true,
    });
    const class0 = new Class0();
    const function1Bound = class0.function1.bind(class0);

    const subscribe1 = journaly.subscribe(function1Bound, 'test');
    const subscribe2 = journaly.subscribe(class0.function2, 'test');
    const subscribe3 = journaly.subscribe(class0.function3, 'test2');

    const subscribes = await Promise.all([subscribe1, subscribe2, subscribe3]);

    expect(journaly.getTopics()).toStrictEqual(['test', 'test2']);

    expect(subscribes[0]).toStrictEqual([]);
    expect(subscribes[1]).toStrictEqual([]);
    expect(subscribes[2]).toStrictEqual([]);

    const publish1 = journaly.publish('test', { a: 'a' });
    const publish2 = journaly.publish('test2', { a: 'a' }, { b: 'b' });

    const publishes = await Promise.all([publish1, publish2]);

    expect(publishes[0]).toStrictEqual(['1asd', '1qwe']);
    expect(publishes[1]).toStrictEqual(['2asd']);

    expect(stringArray).toStrictEqual([
      'test 1 qwe',
      'test 2 asd',
      'test 1 asd',
    ]);
    expect(objectArray).toStrictEqual([
      { a: 'a' },
      [{ a: 'a' }, { b: 'b' }],
      { a: 'a' },
    ]);
    const subscribe4 = journaly.subscribe(class0.function4, 'test2');
    expect(await subscribe4).toStrictEqual(['2qwe']);
    expect(stringArray).toStrictEqual([
      'test 1 qwe',
      'test 2 asd',
      'test 1 asd',
      'test 2 qwe',
    ]);
    expect(objectArray).toStrictEqual([
      { a: 'a' },
      [{ a: 'a' }, { b: 'b' }],
      { a: 'a' },
      [{ a: 'a' }, { b: 'b' }],
    ]);

    expect(journaly.unsubscribe(function1Bound, 'test')).toStrictEqual(true);
    expect(journaly.unsubscribe(class0.function2, 'test')).toStrictEqual(true);
    expect(journaly.unsubscribe(class0.function3, 'test2')).toStrictEqual(true);
    expect(journaly.unsubscribe(class0.function4, 'test2')).toStrictEqual(true);

    const function5Bound = class0.function5.bind(class0);
    const subscribe5 = journaly.subscribe(function5Bound, 'test3');
    const subscribe6 = journaly.subscribe(class0.function6, 'test4');
    const subscribe7 = journaly.subscribe(class0.function7, 'test5');

    const subscribes2 = await Promise.all([subscribe5, subscribe6, subscribe7]);

    expect(journaly.getTopics()).toStrictEqual([
      'test',
      'test2',
      'test3',
      'test4',
      'test5',
    ]);

    expect(subscribes2[0]).toStrictEqual([]);
    expect(subscribes2[1]).toStrictEqual([]);
    expect(subscribes2[2]).toStrictEqual([]);

    const publish5 = journaly.publish('test3', { a: 'a' });
    const publish6 = journaly.publish('test4', { a: 'a' }, { b: 'b' });
    const publish7 = journaly.publish('test5', { a: 'a' }, { b: 'b' }, 1500);

    const publishes2 = await Promise.all([publish5, publish6, publish7]);

    expect(publishes2[0]).toStrictEqual(['dfgasd']);
    expect(publishes2[1]).toStrictEqual(['hjk']);
    expect(publishes2[2]).toStrictEqual(['tyi']);
    done();
  }
);

test(
  'Subject Observer Without Memory: subscribe 2 functions one slow and another fast' +
    ' then subscribe one medium' +
    ' then publish to each then check order',
  async (done) => {
    stringArray = new Array<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    objectArray = new Array<any>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const journaly: SubjectObserver<unknown> = Journaly.newJournaly({
      multiple: true,
    }) as SubjectObserver<unknown>;
    const class0 = new Class0();
    const function1Bound = class0.function1.bind(class0);
    const subscribe1 = journaly.subscribe(function1Bound);
    const subscribe2 = journaly.subscribe(class0.function2);

    const subscribes = await Promise.all([subscribe1, subscribe2]);

    expect(journaly.getTopics()).toStrictEqual([]);

    expect(subscribes[0]).toStrictEqual([]);
    expect(subscribes[1]).toStrictEqual([]);

    const publish1 = journaly.publish({ a: 'a' });
    const publish2 = journaly.publish({ a: 'a' }, { b: 'b' });

    const publishes = await Promise.all([publish1, publish2]);

    expect(publishes[0]).toStrictEqual(['1asd', '1qwe']);
    expect(publishes[1]).toStrictEqual(['1asd', '1qwe']);

    expect(stringArray).toStrictEqual([
      'test 1 qwe',
      'test 1 qwe',
      'test 1 asd',
      'test 1 asd',
    ]);
    expect(objectArray).toStrictEqual([
      { a: 'a' },
      { a: 'a' },
      { a: 'a' },
      { a: 'a' },
    ]);
    const subscribe4 = journaly.subscribe(class0.function4);
    expect(await subscribe4).toStrictEqual([]);
    expect(stringArray).toStrictEqual([
      'test 1 qwe',
      'test 1 qwe',
      'test 1 asd',
      'test 1 asd',
    ]);
    expect(objectArray).toStrictEqual([
      { a: 'a' },
      { a: 'a' },
      { a: 'a' },
      { a: 'a' },
    ]);

    expect(journaly.unsubscribe(function1Bound)).toStrictEqual(true);
    expect(journaly.unsubscribe(class0.function2)).toStrictEqual(true);
    expect(journaly.unsubscribe(class0.function3)).toStrictEqual(false);
    expect(journaly.unsubscribe(class0.function4)).toStrictEqual(true);
    expect(journaly.unsubscribe(class0.function4)).toStrictEqual(false);

    const function5Bound = class0.function5.bind(class0);
    const subscribe5 = journaly.subscribe(function5Bound);
    const subscribe6 = journaly.subscribe(class0.function6);
    const subscribe7 = journaly.subscribe(class0.function7);

    const subscribes2 = await Promise.all([subscribe5, subscribe6, subscribe7]);

    expect(journaly.getTopics()).toStrictEqual([]);

    expect(subscribes2[0]).toStrictEqual([]);
    expect(subscribes2[1]).toStrictEqual([]);
    expect(subscribes2[2]).toStrictEqual([]);

    const publish5 = journaly.publish({ a: 'a' });
    const publish6 = journaly.publish({ a: 'a' }, { b: 'b' });
    const publish7 = journaly.publish({ a: 'a' }, { b: 'b' }, 1500);

    const publishes2 = await Promise.all([publish5, publish6, publish7]);

    expect(publishes2[0]).toStrictEqual(['dfgasd', 'hjk', 'tyi']);
    expect(publishes2[1]).toStrictEqual(['dfgasd', 'hjk', 'tyi']);
    expect(publishes2[2]).toStrictEqual(['dfgasd', 'hjk', 'tyi']);
    done();
  }
);

test(
  'Subject Observer With Memory: subscribe 2 functions one slow and another fast' +
    ' then subscribe one medium' +
    ' then publish to each then check order',
  async (done) => {
    stringArray = new Array<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    objectArray = new Array<any>();
    const journaly: SubjectObserverWithMemory<unknown> = Journaly.newJournaly({
      hasMemory: true,
      multiple: true,
    }) as SubjectObserverWithMemory<unknown>;
    const class0 = new Class0();
    const function1Bound = class0.function1.bind(class0);

    const subscribe1 = journaly.subscribe(function1Bound);
    const subscribe2 = journaly.subscribe(class0.function2);

    const subscribes = await Promise.all([subscribe1, subscribe2]);

    expect(journaly.getTopics()).toStrictEqual([]);

    expect(subscribes[0]).toStrictEqual([]);
    expect(subscribes[1]).toStrictEqual([]);

    const publish1 = journaly.publish({ a: 'a' });
    const publish2 = journaly.publish({ a: 'a' }, { b: 'b' });

    const publishes = await Promise.all([publish1, publish2]);

    expect(publishes[0]).toStrictEqual(['1asd', '1qwe']);
    expect(publishes[1]).toStrictEqual(['1asd', '1qwe']);

    expect(stringArray).toStrictEqual([
      'test 1 qwe',
      'test 1 qwe',
      'test 1 asd',
      'test 1 asd',
    ]);
    expect(objectArray).toStrictEqual([
      { a: 'a' },
      { a: 'a' },
      { a: 'a' },
      { a: 'a' },
    ]);
    const subscribe4 = journaly.subscribe(class0.function4);
    expect(await subscribe4).toStrictEqual(['2qwe', '2qwe']);
    expect(stringArray).toStrictEqual([
      'test 1 qwe',
      'test 1 qwe',
      'test 1 asd',
      'test 1 asd',
      'test 2 qwe',
      'test 2 qwe',
    ]);
    expect(objectArray).toStrictEqual([
      { a: 'a' },
      { a: 'a' },
      { a: 'a' },
      { a: 'a' },
      [{ a: 'a' }, undefined],
      [{ a: 'a' }, { b: 'b' }],
    ]);

    expect(journaly.unsubscribe(function1Bound)).toStrictEqual(true);
    expect(journaly.unsubscribe(class0.function2)).toStrictEqual(true);
    expect(journaly.unsubscribe(class0.function3)).toStrictEqual(false);
    expect(journaly.unsubscribe(class0.function4)).toStrictEqual(true);

    const function5Bound = class0.function5.bind(class0);
    const subscribe5 = journaly.subscribe(function5Bound);
    const subscribe6 = journaly.subscribe(class0.function6);
    const subscribe7 = journaly.subscribe(class0.function7);

    const subscribes2 = await Promise.all([subscribe5, subscribe6, subscribe7]);

    expect(journaly.getTopics()).toStrictEqual([]);

    expect(subscribes2[0]).toStrictEqual(['dfgasd', 'dfgasd']);
    expect(subscribes2[1]).toStrictEqual(['hjk', 'hjk']);
    expect(subscribes2[2]).toStrictEqual(['tyi', 'tyi']);

    const publish5 = journaly.publish('test3', { a: 'a' });
    const publish6 = journaly.publish('test4', { a: 'a' }, { b: 'b' });
    const publish7 = journaly.publish('test5', { a: 'a' }, { b: 'b' }, 1500);

    const publishes2 = await Promise.all([publish5, publish6, publish7]);

    expect(publishes2[0]).toStrictEqual(['dfgasd', 'hjk', 'tyi']);
    expect(publishes2[1]).toStrictEqual(['dfgasd', 'hjk', 'tyi']);
    expect(publishes2[2]).toStrictEqual(['dfgasd', 'hjk', 'tyi']);
    done();
  }
);
