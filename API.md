# API

`npl`'s API is made available in Promise, which is also accessible via async/await.

## Install

```bash
$ npm install @hankchanocd/npmlist
```

## Import

Import only what you need. I'm listing all of the available imports here for sheer laziness.

```js
const {
	npmDependencies,
	npmScripts,
	npmRegistry,
	npmRecent,
	npmGlobal,
	StringUtil
} = require("@hankchanocd/npmlist");

const { npmList } = npmDependencies;
```

<br/>

## Features

### npmList

> npmList()

List module's dependencies - used by `npl`

- With ANSI color (A better visual on terminal)

```js
npmList()
	.raw()
	.then(i => yourFunction)
	.catch(err => console.log(err));

// @express@1.0.0
// ├── Dependencies
// ├── chalk@2.4.1
```

- Without ANSI color (Clean text)

```js
npmList()
	.rawNoColor()
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

- Async/await with color

  Since Node 8, anything written in Promise can also be written in async/await. Async/await code in the following APIs is very similar to this one, so I won't repeat it.

```js
async () => {
	try {
		let result = await npmList().raw();
		yourFunction(result);
	} catch (err) {
		console.log(err);
	}
};
```

<br/>

### npmRecent

> npmRecent()

List recent global installs - used by `npl -t`

- With ANSI color

```js
npmRecent()
	.all()
	.then(i => i.raw())
	.then(i => yourFunction)
	.catch(err => console.log(err));

// @hankchanocd/npmlist    11-16 21:37
// npm-fzf                 11-16 2:22
```

- Without ANSI color

```js
npmRecent()
	.all()
	.then(i => i.rawNoColor())
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

<br/>

### npmGlobal

> npmGlobal()

List global installs - used by `npl -g`

- With ANSI color

```js
npmGlobal()
	.then(i => i.simple().raw())
	.then(i => yourFunction)
	.catch(err => console.log(err));

// ├── 0x@4.5.3
// ├── aerobatic-cli@1.1.4
```

- Without ANSI color

```js
npmGlobal()
	.then(i => i.simple().rawNoColor())
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

<br/>

### npmScripts

> npmScripts()

Return a list of scripts - used by `npl -s`

- With ANSI color

```js
npmScripts()
	.raw()
	.then(i => yourFunction)
	.catch(err => console.log(err));

// @express@1.0.0
// build => babel src/ -d build/ --quiet
// commit => git-cz
```

- Without ANSI color

```js
npmScripts()
	.rawNoColor()
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

<br/>

### npmRegistry

> npmRegistry(module: String)

Fetch package dependencies from npm registry - used by `npl module`

- With ANSI color

```js
let module = 'express';
npmRegistry(module)
	.then(i => i.simple().raw())
	.then(i => yourFunction)
	.catch(err => console.log(err));

// ├── accepts@1.3.5
// ├── array-flatten@1.1.1
```

- Without ANSI color

```js
npmRegistry(module)
	.then(i => i.simple().rawNoColor())
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

<br/>

## StringUtil

### cleanTagName

> cleanTagName(str: string)

```js
let str = 'surl-cli@semantically-release';
StringUtil.cleanTagName(str); // 'surl-cli'
```

<br/>


### getRidOfColors

> getRidOfColors(str: String)

Especially useful for converting seemingly white text on terminal, which in reality is littered with ANSI color code, to reusable clean text.

```js
StringUtil.getRidOfColors(str);
```

<br/>

### getRidOfQuotationMarks

> getRidOfQuotationMarks(str: String)

```js
StringUtil.getRidOfQuotationMarks(str);
```

<br/>

### truncate

> truncate(str: String, maxWidth: Number, truncateMarker: Boolean)

#### Parameters

- str: required
- maxWidth: optional, default = 50
- truncateMarker: optional, default = true

```js
let str = 'surl-cli@semantically-release';
StringUtil.truncate(str, 8, false); // => 'surl-cli...'
```
