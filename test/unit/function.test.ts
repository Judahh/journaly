// file deepcode ignore no-any: just for test
import { Journaly } from '../../source/index';
import { PublisherSubscriber } from '../../source/journaly/publisherSubscriber';
const timeout = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
let stringArray;
let objectArray;
const function1 = async (object): Promise<string> => {
  await timeout(1000);
  stringArray.push('test 1 asd');
  objectArray.push(object);
  return new Promise((resolve) => resolve('1asd'));
};

const function2 = async (object): Promise<string> => {
  stringArray.push('test 1 qwe');
  objectArray.push(object);
  return new Promise((resolve) => resolve('1qwe'));
};

const function3 = async (object, object2): Promise<string> => {
  stringArray.push('test 2 asd');
  objectArray.push([object, object2]);
  await timeout(500);
  return new Promise((resolve) => resolve('2asd'));
};

const function4 = async (object, object2): Promise<string> => {
  stringArray.push('test 2 qwe');
  objectArray.push([object, object2]);
  await timeout(500);
  return new Promise((resolve) => resolve('2qwe'));
};

const function5 = (object, object2): Promise<string> => {
  stringArray.push('test 3 dfg');
  objectArray.push([object, object2]);
  return new Promise((resolve) => {
    setTimeout(() => resolve('dfg'), 750);
  });
};

const function6 = (object, object2): Promise<string> => {
  stringArray.push('test 3 hjk');
  objectArray.push([object, object2]);
  return new Promise((resolve) => {
    setTimeout(() => resolve('hjk'), 250);
  });
};

const function7 = (object, object2, time): Promise<string> => {
  stringArray.push('test 3 tyi');
  objectArray.push([object, object2]);
  return new Promise((resolve) => {
    setTimeout(() => resolve('tyi'), time);
  });
};

test(
  'Publisher Subscriber Without Memory: subscribe 2 functions one slow and another fast' +
    ' then subscribe one medium' +
    ' then publish to each then check order',
  async (done) => {
    stringArray = new Array<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    objectArray = new Array<any>();
    const journaly = Journaly.newJournaly<string>({
      multiple: true,
    }) as PublisherSubscriber<string>;
    const subscribe1 = journaly.subscribe('test', function1);
    const subscribe2 = journaly.subscribe('test', function2);
    const subscribe3 = journaly.subscribe('test2', function3);

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
    const subscribe4 = journaly.subscribe('test2', function4);
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
    const remaining0 = journaly.unsubscribe('test', function1);
    const remaining1 = journaly.unsubscribe('test', function2);
    const remaining2 = journaly.unsubscribe('test2', function3);
    const remaining3 = journaly.unsubscribe('test2', function4);
    expect(remaining0).toStrictEqual([function2]);
    expect(remaining1).toStrictEqual([]);
    expect(remaining2).toStrictEqual([function4]);
    expect(remaining3).toStrictEqual([]);
    const subscribe5 = journaly.subscribe('test3', function5);
    const subscribe6 = journaly.subscribe('test4', function6);
    const subscribe7 = journaly.subscribe('test5', function7);

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

    expect(publishes2[0]).toStrictEqual(['dfg']);
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
    });
    const subscribe1 = journaly.subscribe('test', function1);
    const subscribe2 = journaly.subscribe('test', function2);
    const subscribe3 = journaly.subscribe('test2', function3);

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
    const subscribe4 = journaly.subscribe('test2', function4);
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
    const remaining0 = journaly.unsubscribe('test', function1);
    const remaining1 = journaly.unsubscribe('test', function2);
    const remaining2 = journaly.unsubscribe('test2', function3);
    const remaining3 = journaly.unsubscribe('test2', function4);
    expect(remaining0).toStrictEqual([function2]);
    expect(remaining1).toStrictEqual([]);
    expect(remaining2).toStrictEqual([function4]);
    expect(remaining3).toStrictEqual([]);
    const subscribe5 = journaly.subscribe('test3', function5);
    const subscribe6 = journaly.subscribe('test4', function6);
    const subscribe7 = journaly.subscribe('test5', function7);

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

    expect(publishes2[0]).toStrictEqual(['dfg']);
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
    const journaly = Journaly.newJournaly<string>() as PublisherSubscriber<
      string
    >;
    const subscribe1 = journaly.subscribe('test', function1);
    const subscribe2 = journaly.subscribe('test', function2);
    const subscribe3 = journaly.subscribe('test2', function3);

    const subscribes = await Promise.all([subscribe1, subscribe2, subscribe3]);

    expect(journaly.getTopics()).toStrictEqual(['test', 'test2']);

    expect(subscribes[0]).toStrictEqual([]);
    expect(subscribes[1]).toStrictEqual([]);
    expect(subscribes[2]).toStrictEqual([]);

    const publish1 = journaly.publish('test', { a: 'a' });
    const publish2 = journaly.publish('test2', { a: 'a' }, { b: 'b' });

    const publishes = await Promise.all([publish1, publish2]);

    expect(publishes[0]).toStrictEqual('1qwe');
    expect(publishes[1]).toStrictEqual('2asd');

    expect(stringArray).toStrictEqual(['test 1 qwe', 'test 2 asd']);
    expect(objectArray).toStrictEqual([{ a: 'a' }, [{ a: 'a' }, { b: 'b' }]]);
    const subscribe4 = journaly.subscribe('test2', function4);
    expect(await subscribe4).toStrictEqual([]);
    expect(stringArray).toStrictEqual(['test 1 qwe', 'test 2 asd']);
    expect(objectArray).toStrictEqual([{ a: 'a' }, [{ a: 'a' }, { b: 'b' }]]);
    const remaining0 = journaly.unsubscribe('test', function1);
    const remaining1 = journaly.unsubscribe('test', function2);
    const remaining2 = journaly.unsubscribe('test2', function3);
    const remaining3 = journaly.unsubscribe('test2', function4);
    expect(remaining0).toStrictEqual(function2);
    expect(remaining1).toStrictEqual(undefined);
    expect(remaining2).toStrictEqual(function4);
    expect(remaining3).toStrictEqual(undefined);
    const subscribe5 = journaly.subscribe('test3', function5);
    const subscribe6 = journaly.subscribe('test4', function6);
    const subscribe7 = journaly.subscribe('test5', function7);

    const subscribes2 = await Promise.all([subscribe5, subscribe6, subscribe7]);

    expect(journaly.getTopics()).toStrictEqual(['test3', 'test4', 'test5']);

    expect(subscribes2[0]).toStrictEqual([]);
    expect(subscribes2[1]).toStrictEqual([]);
    expect(subscribes2[2]).toStrictEqual([]);

    const publish5 = journaly.publish('test3', { a: 'a' });
    const publish6 = journaly.publish('test4', { a: 'a' }, { b: 'b' });
    const publish7 = journaly.publish('test5', { a: 'a' }, { b: 'b' }, 1500);

    const publishes2 = await Promise.all([publish5, publish6, publish7]);

    expect(publishes2[0]).toStrictEqual('dfg');
    expect(publishes2[1]).toStrictEqual('hjk');
    expect(publishes2[2]).toStrictEqual('tyi');
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
    const journaly = Journaly.newJournaly({
      hasMemory: true,
    });
    const subscribe1 = journaly.subscribe('test', function1);
    const subscribe2 = journaly.subscribe('test', function2);
    const subscribe3 = journaly.subscribe('test2', function3);

    const subscribes = await Promise.all([subscribe1, subscribe2, subscribe3]);

    expect(journaly.getTopics()).toStrictEqual(['test', 'test2']);

    expect(subscribes[0]).toStrictEqual([]);
    expect(subscribes[1]).toStrictEqual([]);
    expect(subscribes[2]).toStrictEqual([]);

    const publish1 = journaly.publish('test', { a: 'a' });
    const publish2 = journaly.publish('test2', { a: 'a' }, { b: 'b' });

    const publishes = await Promise.all([publish1, publish2]);

    expect(publishes[0]).toStrictEqual('1qwe');
    expect(publishes[1]).toStrictEqual('2asd');

    expect(stringArray).toStrictEqual(['test 1 qwe', 'test 2 asd']);
    expect(objectArray).toStrictEqual([{ a: 'a' }, [{ a: 'a' }, { b: 'b' }]]);
    const subscribe4 = journaly.subscribe('test2', function4);
    expect(await subscribe4).toStrictEqual(['2qwe']);
    expect(stringArray).toStrictEqual([
      'test 1 qwe',
      'test 2 asd',
      'test 2 qwe',
    ]);
    expect(objectArray).toStrictEqual([
      { a: 'a' },
      [{ a: 'a' }, { b: 'b' }],
      [{ a: 'a' }, { b: 'b' }],
    ]);
    const remaining0 = journaly.unsubscribe('test', function1);
    const remaining1 = journaly.unsubscribe('test', function2);
    const remaining2 = journaly.unsubscribe('test2', function3);
    const remaining3 = journaly.unsubscribe('test2', function4);
    expect(remaining0).toStrictEqual(function2);
    expect(remaining1).toStrictEqual(undefined);
    expect(remaining2).toStrictEqual(function4);
    expect(remaining3).toStrictEqual(undefined);
    const subscribe5 = journaly.subscribe('test3', function5);
    const subscribe6 = journaly.subscribe('test4', function6);
    const subscribe7 = journaly.subscribe('test5', function7);

    const subscribes2 = await Promise.all([subscribe5, subscribe6, subscribe7]);

    expect(journaly.getTopics()).toStrictEqual(['test3', 'test4', 'test5']);

    expect(subscribes2[0]).toStrictEqual([]);
    expect(subscribes2[1]).toStrictEqual([]);
    expect(subscribes2[2]).toStrictEqual([]);

    const publish5 = journaly.publish('test3', { a: 'a' });
    const publish6 = journaly.publish('test4', { a: 'a' }, { b: 'b' });
    const publish7 = journaly.publish('test5', { a: 'a' }, { b: 'b' }, 1500);

    const publishes2 = await Promise.all([publish5, publish6, publish7]);

    expect(publishes2[0]).toStrictEqual('dfg');
    expect(publishes2[1]).toStrictEqual('hjk');
    expect(publishes2[2]).toStrictEqual('tyi');
    done();
  }
);