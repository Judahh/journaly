// file deepcode ignore no-any: just for test
import {
  Journaly,
  SubjectObserver,
  SubjectObserverWithMemory,
} from '../../source/index';

class Subscriber {
  private _name: string;

  get name(): string {
    return this._name;
  }
  constructor(name: string) {
    this._name = name;
  }

  read(title: string, content: string): Promise<string> {
    let full = this.name + ' reads:' + '\n';
    return new Promise((resolve) => {
      full += title + '\n';
      full += content + '\n';
      full += '\n';
      resolve(full);
    });
  }
}

test('Publisher Subscriber Without Memory', async (done) => {
  const journaly = Journaly.newJournaly({
    multiple: true,
    hasTopic: true,
  });
  const reader = new Subscriber('1');
  const reader2 = new Subscriber('2');
  const read1 = reader.read.bind(reader);
  const read2 = reader2.read.bind(reader2);
  const subscribe1 = journaly.subscribe(read1, 'subject1');

  let subscribes = await Promise.all([subscribe1]);

  expect(journaly.getTopics()).toStrictEqual(['subject1']);

  expect(subscribes[0]).toStrictEqual([]);

  const publish1 = journaly.publish('subject1', 'title 1', 'content 1');
  const publish2 = journaly.publish('subject2', 'title 2', 'content 2');

  let publishes = await Promise.all([publish1, publish2]);

  expect(publishes[0]).toStrictEqual([
    '1 reads:\n' + 'title 1\n' + 'content 1\n\n',
  ]);
  expect(publishes[1]).toStrictEqual([]);

  const subscribe2 = journaly.subscribe(read2, 'subject2');

  subscribes = await Promise.all([subscribe2]);

  expect(journaly.getTopics()).toStrictEqual(['subject1', 'subject2']);

  expect(subscribes[0]).toStrictEqual([]);

  const publish3 = journaly.publish('subject1', 'title 3', 'content 3');
  const publish4 = journaly.publish('subject2', 'title 4', 'content 4');

  publishes = await Promise.all([publish3, publish4]);

  expect(publishes[0]).toStrictEqual([
    '1 reads:\n' + 'title 3\n' + 'content 3\n\n',
  ]);
  expect(publishes[1]).toStrictEqual([
    '2 reads:\n' + 'title 4\n' + 'content 4\n\n',
  ]);

  done();
});

test('Publisher Subscriber With Memory', async (done) => {
  const journaly = Journaly.newJournaly({
    multiple: true,
    hasTopic: true,
    hasMemory: true,
  });
  const reader = new Subscriber('1');
  const reader2 = new Subscriber('2');
  const read1 = reader.read.bind(reader);
  const read2 = reader2.read.bind(reader2);
  const subscribe1 = journaly.subscribe(read1, 'subject1');

  let subscribes = await Promise.all([subscribe1]);

  expect(journaly.getTopics()).toStrictEqual(['subject1']);

  expect(subscribes[0]).toStrictEqual([]);

  const publish1 = journaly.publish('subject1', 'title 1', 'content 1');
  const publish2 = journaly.publish('subject2', 'title 2', 'content 2');

  let publishes = await Promise.all([publish1, publish2]);

  expect(publishes[0]).toStrictEqual([
    '1 reads:\n' + 'title 1\n' + 'content 1\n\n',
  ]);
  expect(publishes[1]).toStrictEqual([]);

  const subscribe2 = journaly.subscribe(read2, 'subject2');

  subscribes = await Promise.all([subscribe2]);

  expect(journaly.getTopics()).toStrictEqual(['subject1', 'subject2']);

  expect(subscribes[0]).toStrictEqual([
    '2 reads:\n' + 'title 2\n' + 'content 2\n\n',
  ]);

  const publish3 = journaly.publish('subject1', 'title 3', 'content 3');
  const publish4 = journaly.publish('subject2', 'title 4', 'content 4');

  publishes = await Promise.all([publish3, publish4]);

  expect(publishes[0]).toStrictEqual([
    '1 reads:\n' + 'title 3\n' + 'content 3\n\n',
  ]);
  expect(publishes[1]).toStrictEqual([
    '2 reads:\n' + 'title 4\n' + 'content 4\n\n',
  ]);

  done();
});

test('Subject Observer Without Memory', async (done) => {
  const journaly = Journaly.newJournaly({
    multiple: true,
  }) as SubjectObserver<string>;
  const reader = new Subscriber('1');
  const reader2 = new Subscriber('2');
  const read1 = reader.read.bind(reader);
  const read2 = reader2.read.bind(reader2);
  const subscribe1 = journaly.subscribe(read1);

  let subscribes = await Promise.all([subscribe1]);

  expect(journaly.getTopics()).toStrictEqual([]);

  expect(subscribes[0]).toStrictEqual([]);

  const publish1 = journaly.publish('title 1', 'content 1');
  const publish2 = journaly.publish('title 2', 'content 2');

  let publishes = await Promise.all([publish1, publish2]);

  expect(publishes[0]).toStrictEqual([
    '1 reads:\n' + 'title 1\n' + 'content 1\n\n',
  ]);
  expect(publishes[1]).toStrictEqual([
    '1 reads:\n' + 'title 2\n' + 'content 2\n\n',
  ]);

  const subscribe2 = journaly.subscribe(read2);

  subscribes = await Promise.all([subscribe2]);

  expect(journaly.getTopics()).toStrictEqual([]);

  expect(subscribes[0]).toStrictEqual([]);

  const publish3 = journaly.publish('title 3', 'content 3');
  const publish4 = journaly.publish('title 4', 'content 4');

  publishes = await Promise.all([publish3, publish4]);

  expect(publishes[0]).toStrictEqual([
    '1 reads:\n' + 'title 3\n' + 'content 3\n\n',
    '2 reads:\n' + 'title 3\n' + 'content 3\n\n',
  ]);
  expect(publishes[1]).toStrictEqual([
    '1 reads:\n' + 'title 4\n' + 'content 4\n\n',
    '2 reads:\n' + 'title 4\n' + 'content 4\n\n',
  ]);

  done();
});

test('Subject Observer With Memory', async (done) => {
  const journaly = Journaly.newJournaly({
    multiple: true,
    hasMemory: true,
  }) as SubjectObserver<string>;
  const reader = new Subscriber('1');
  const reader2 = new Subscriber('2');
  const read1 = reader.read.bind(reader);
  const read2 = reader2.read.bind(reader2);
  const subscribe1 = journaly.subscribe(read1);

  let subscribes = await Promise.all([subscribe1]);

  expect(journaly.getTopics()).toStrictEqual([]);

  expect(subscribes[0]).toStrictEqual([]);

  const publish1 = journaly.publish('title 1', 'content 1');
  const publish2 = journaly.publish('title 2', 'content 2');

  let publishes = await Promise.all([publish1, publish2]);

  expect(publishes[0]).toStrictEqual([
    '1 reads:\n' + 'title 1\n' + 'content 1\n\n',
  ]);
  expect(publishes[1]).toStrictEqual([
    '1 reads:\n' + 'title 2\n' + 'content 2\n\n',
  ]);

  const subscribe2 = journaly.subscribe(read2);

  subscribes = await Promise.all([subscribe2]);

  expect(journaly.getTopics()).toStrictEqual([]);

  expect(subscribes[0]).toStrictEqual([
    '2 reads:\n' + 'title 1\n' + 'content 1\n\n',
    '2 reads:\n' + 'title 2\n' + 'content 2\n\n',
  ]);

  const publish3 = journaly.publish('title 3', 'content 3');
  const publish4 = journaly.publish('title 4', 'content 4');

  publishes = await Promise.all([publish3, publish4]);

  expect(publishes[0]).toStrictEqual([
    '1 reads:\n' + 'title 3\n' + 'content 3\n\n',
    '2 reads:\n' + 'title 3\n' + 'content 3\n\n',
  ]);
  expect(publishes[1]).toStrictEqual([
    '1 reads:\n' + 'title 4\n' + 'content 4\n\n',
    '2 reads:\n' + 'title 4\n' + 'content 4\n\n',
  ]);

  done();
});

test('Sender Receiver Without Memory', async (done) => {
  const journaly = Journaly.newJournaly({
    hasTopic: true,
  });
  const reader = new Subscriber('1');
  const reader2 = new Subscriber('2');
  const read1 = reader.read.bind(reader);
  const read2 = reader2.read.bind(reader2);
  const subscribe1 = journaly.subscribe(read1, 'subject1');

  let subscribes = await Promise.all([subscribe1]);

  expect(journaly.getTopics()).toStrictEqual(['subject1']);

  expect(subscribes[0]).toStrictEqual([]);

  const publish1 = journaly.publish('subject1', 'title 1', 'content 1');
  expect(
    journaly.publish('subject2', 'title 2', 'content 2')
  ).rejects.toStrictEqual(undefined);

  let publishes = await Promise.all([publish1]);

  expect(publishes[0]).toStrictEqual(
    '1 reads:\n' + 'title 1\n' + 'content 1\n\n'
  );
  expect(publishes[1]).toStrictEqual(undefined);

  const subscribe2 = journaly.subscribe(read2, 'subject2');

  subscribes = await Promise.all([subscribe2]);

  expect(journaly.getTopics()).toStrictEqual(['subject1', 'subject2']);

  expect(subscribes[0]).toStrictEqual([]);

  const publish3 = journaly.publish('subject1', 'title 3', 'content 3');
  const publish4 = journaly.publish('subject2', 'title 4', 'content 4');

  publishes = await Promise.all([publish3, publish4]);

  expect(publishes[0]).toStrictEqual(
    '1 reads:\n' + 'title 3\n' + 'content 3\n\n'
  );
  expect(publishes[1]).toStrictEqual(
    '2 reads:\n' + 'title 4\n' + 'content 4\n\n'
  );

  done();
});

test('Sender Receiver With Memory', async (done) => {
  const journaly = Journaly.newJournaly({
    hasTopic: true,
    hasMemory: true,
  });
  const reader = new Subscriber('1');
  const reader2 = new Subscriber('2');
  const reader3 = new Subscriber('3');
  const read1 = reader.read.bind(reader);
  const read2 = reader2.read.bind(reader2);
  const read3 = reader3.read.bind(reader3);
  const subscribe1 = journaly.subscribe(read1, 'subject1');

  let subscribes = await Promise.all([subscribe1]);

  expect(journaly.getTopics()).toStrictEqual(['subject1']);

  expect(subscribes[0]).toStrictEqual([]);

  const publish1 = journaly.publish('subject1', 'title 1', 'content 1');
  expect(
    journaly.publish('subject2', 'title 2', 'content 2')
  ).rejects.toStrictEqual(undefined);

  let publishes = await Promise.all([publish1]);

  expect(publishes[0]).toStrictEqual(
    '1 reads:\n' + 'title 1\n' + 'content 1\n\n'
  );
  expect(publishes[1]).toStrictEqual(undefined);

  const subscribe2 = journaly.subscribe(read2, 'subject2');

  subscribes = await Promise.all([subscribe2]);

  expect(journaly.getTopics()).toStrictEqual(['subject1', 'subject2']);

  expect(subscribes[0]).toStrictEqual([
    '2 reads:\n' + 'title 2\n' + 'content 2\n\n',
  ]);

  const publish3 = journaly.publish('subject1', 'title 3', 'content 3');
  const publish4 = journaly.publish('subject2', 'title 4', 'content 4');

  publishes = await Promise.all([publish3, publish4]);

  expect(publishes[0]).toStrictEqual(
    '1 reads:\n' + 'title 3\n' + 'content 3\n\n'
  );
  expect(publishes[1]).toStrictEqual(
    '2 reads:\n' + 'title 4\n' + 'content 4\n\n'
  );

  const subscribe3 = journaly.subscribe(read3, 'subject2');

  subscribes = await Promise.all([subscribe3]);

  expect(journaly.getTopics()).toStrictEqual(['subject1', 'subject2']);

  expect(subscribes[0]).toStrictEqual([
    '3 reads:\n' + 'title 2\n' + 'content 2\n\n',
    '3 reads:\n' + 'title 4\n' + 'content 4\n\n',
  ]);

  const publish5 = journaly.publish('subject2', 'title 5', 'content 5');

  publishes = await Promise.all([publish5]);

  expect(publishes[0]).toStrictEqual(
    '3 reads:\n' + 'title 5\n' + 'content 5\n\n'
  );

  done();
});
