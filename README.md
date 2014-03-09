# regret

[![build status](https://secure.travis-ci.org/imlucas/node-regret.png)](http://travis-ci.org/imlucas/node-regret)

Organize regexes for your app, non-shittily.

## Example

```
var regret = require('regret');

// Register a base ISO date regex you'll want to use in other patterns
regret.add('date.iso',
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+-[0-5]\d/,
  '2014-02-13T18:00:04.709-0500');

// Use moustaches to use pre-registered patterns
regret.add('mongodb.log', /({{date.iso}}+) \[(\w+)\](?:\s{2})(.*)/,
  '2014-02-13T18:00:04.709-0500 [initandlisten] db version v2.5.6-pre-',
  ['date', 'name', 'message']);

regret.add('mongodb.logShutdown', /(\w+)\:(?:\s{1})(.*)/,
  'dbexit: really exiting now', ['name', 'message']);

// You'll also get nice named captures like you can with `?P<>` in python:
var text = '2014-02-18T14:34:06.272-0500 [clientcursormon]  mapped (incl journal view):320',
  res = regret('mongodb.log', text);

console.log('Log Date: ', new Date(res.date));
// Log Date:  Tue Feb 18 2014 14:34:06 GMT-0500 (EST)

console.log('MongoDB Thread Name: ', res.name);
// MongoDB Thread Name:  clientcursormon


// console.log('Log Message: ', res.message);
Log Message: mapped (incl journal view):320
```

## API

The invention of the Regular Expression is right up there next to antiseptic.
How many times have you copy and pasted the email regex?  Or even worse, come
across a `constants/RegularExpressionsImpl.js`?  I say, enough of this madness.
Regular expressions are beautiful things that deserve better. Now, let's all
stop copy and pasting validation regexes from stackoverflow, k?

### regret.add(`name`, `pattern`, `example`, `[capture keys]`)

Register a new regex `pattern` with a required `example` so you don't have to
deal with the code-review-haters and an optional array of `[capture keys]`
that give each `(<magic>)` in your pattern a property name in the result.

### regret(`name`, `input`)

Match `input` against a regex you already registered as `name` and return a nice
object with the captures.  See you in hell `matches[1]` `matches[2]`!
Optionally, set `name` to a regex to test against multiple
registered matchers, for example:
```
res = regret('mongodb.log', 'dbexit: really exiting now');
console.log('result:', res);
// result: null

res = regret(/^mongodb/, 'dbexit: really exiting now');
console.log('result:', res);
// result: {name: 'dbexit', message: 'really exiting now'}
```

## todo

- [ ] look for and automatically add `regrets` from `package.json`
- [ ] make `regret-usual-suspects` that has all the common crud,  like
  [commonregexjs](https://github.com/talyssonoc/commonregexjs) with phone numbers,
  email (fuck yes!), and other things you just shouldn't have to think about

## License

MIT
