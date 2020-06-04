# Journaly
![Publish](https://github.com/Judahh/journaly/workflows/Publish/badge.svg)
[![npm version](https://badge.fury.io/js/journaly.svg)](https://badge.fury.io/js/journaly)
[![npm downloads](https://img.shields.io/npm/dt/journaly.svg)](https://img.shields.io/npm/dt/journaly.svg)

A simple message-broker/Pub-sub library

```js
const function1 = async (object0, string0): Promise<string> => {
  await timeout(100);
  return new Promise((resolve) => resolve({string0: string0 + ' executed!', object0}));
};

const journaly = new Journaly<string>();

const subscribe1 = journaly.subscribe('test', function1);// Connects function1 to subject test

const subscribes = await Promise.all([subscribe1]);

// Publishes to subject test args: { someObject: 'something' }, 'test 0'
const publish1 = await journaly.publish('test', { someObject: 'something' }, 'test 0');
// Prints all responses to publish 1 from functions witch subscribe to subject test
// Each response is an element of the returned array
console.log(publish1);
```

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file) or [`yarn init` command](https://classic.yarnpkg.com/en/docs/cli/init/).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally)
or [`yarn add` command](https://classic.yarnpkg.com/en/docs/cli/add):

```bash
$ npm install journaly
```
or
```bash
$ yarn add journaly
```

## Features

  * Ready to use Pub-sub design pattern
  * Promises oriented
  * Simple implementation

## Object Example

```js
class ObjectClass {
  public async method1(object0, string0): Promise<string> {
    await timeout(100);
    return new Promise((resolve) => resolve({string0: string0 + ' executed!', object0}));
  }
}

const object = new ObjectClass();

const journaly = new Journaly<string>();

const subscribe1 = journaly.subscribe('test', object.method1.bind(object));// Connects method1 to subject test

const subscribes = await Promise.all([subscribe1]);

// Publishes to subject test args: { someObject: 'something' }, 'test 0'
const publish1 = await journaly.publish('test', { someObject: 'something' }, 'test 0');
// Prints all responses to publish 1 from functions witch subscribe to subject test
console.log(publish1);
```

## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```
or
```bash
$ yarn
$ yarn test
```

## People

The original author of Journaly is [Judah Lima](https://github.com/Judahh)

[List of all contributors](https://github.com/Judahh/journaly/graphs/contributors)
