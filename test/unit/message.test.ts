import { Journaly } from '../../source/index';
const timeout = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
test(
  'subscribe 2 functions one slow and another fast' +
    ' then subscribe one medium' +
    ' then publish to each then check order',
  async (done) => {
    const journaly = new Journaly();
    const stringArray = new Array<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objectArray = new Array<any>();
    journaly.subscribe('test', async (object) => {
      await timeout(1000);
      stringArray.push('test 1 asd');
      objectArray.push(object);
      return new Promise((resolve) => resolve('1asd'));
    });
    journaly.subscribe('test', async (object) => {
      stringArray.push('test 1 qwe');
      objectArray.push(object);
      return new Promise((resolve) => resolve('1qwe'));
    });
    journaly.subscribe('test2', async (object) => {
      stringArray.push('test 2 asd');

      objectArray.push(object);
      await timeout(500);
      return new Promise((resolve) => resolve('2asd'));
    });

    const test1 = journaly.publish('test', { a: 'a' });
    const test2 = journaly.publish('test2', { b: 'b' });

    const all = await Promise.all([test1, test2]);

    expect(all[0]).toStrictEqual(['1asd', '1qwe']);
    expect(all[1]).toStrictEqual(['2asd']);

    expect(stringArray).toStrictEqual([
      'test 1 qwe',
      'test 2 asd',
      'test 1 asd',
    ]);
    expect(objectArray).toStrictEqual([{ a: 'a' }, { b: 'b' }, { a: 'a' }]);
    done();
  }
);
