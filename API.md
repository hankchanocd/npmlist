# API

`npmlist`'s API is made available in Promise, which is also accessible via async/await.

## Install

```bash
$ npm install @hankchanocd/npmlist
```

## Import

Import only what you need. I'm listing all of the available imports here for sheer laziness.

```js
const {
	npmDependencies,
	npmGlobal,
	npmRegistry,
	npmRecent,
	npmScripts,
	npmSearch,
	StringUtil
} = require("@hankchanocd/npmlist");

const { npmList } = npmDependencies;
```

<br/>

## Features

### npmSearch

> npmSearch(modules: [ module: String ])

Search npm modules on [npms.io](https://npms.io/) with score analysis

***

#### raw()

With ANSI color (For a better visual on terminal)

```js
const { npmSearch } = require("@hankchanocd/npmlist");

let module = ["express"];
npmSearch(module)
	.then(i => i.raw())
	.then(i => yourFunction)
	.catch(err => console.log(err));

// 92 express@4.16.4 express framework sinatra web rest restful router app api
// 91 path-to-regexp@2.4.0 express regexp route routing
```

#### rawNoColor()

Without ANSI color (Clean text)

```js
const { npmSearch } = require("@hankchanocd/npmlist");

let module = ["express"];
npmSearch(module)
	.then(i => i.rawNoColor())
	.then(i => yourFunction)
	.catch(err => console.log(err));

// 92 express@4.16.4 express framework sinatra web rest restful router app api
// 91 path-to-regexp@2.4.0 express regexp route routing
```

#### Async/await

  Since Node 8, anything written in Promise can also be written in async/await. Async/await code in the rest of the APIs is very similar to this one, so I won't repeat it.

```js
async () => {
	try {
		let result = await npmSearch().raw();
		yourFunction(result);
	} catch (err) {
		console.log(err);
	}
};
```

&nbsp;

### npmList

> npmList()

List module's dependencies - used by `npl -l`

***

#### raw()

```js
npmList()
	.raw()
	.then(i => yourFunction)
	.catch(err => console.log(err));

// @express@1.0.0
// ├── Dependencies
// ├── chalk@2.4.1
```

#### rawNoColor()

```js
npmList()
	.rawNoColor()
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

&nbsp;

### npmRecent

> npmRecent()

List recent global installs - used by `npl -t`

***

#### raw()

```js
npmRecent()
	.all()
	.then(i => i.raw())
	.then(i => yourFunction)
	.catch(err => console.log(err));

// @hankchanocd/npmlist    11-16 21:37
// npm-fzf                 11-16 2:22
```

#### rawNoColor()

```js
npmRecent()
	.all()
	.then(i => i.rawNoColor())
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

&nbsp;

### npmGlobal

> npmGlobal()

List global installs - used by `npl -g`

***

#### raw()

```js
npmGlobal()
	.then(i => i.simple().raw())
	.then(i => yourFunction)
	.catch(err => console.log(err));

// ├── 0x@4.5.3
// ├── aerobatic-cli@1.1.4
```

#### rawNoColor()

```js
npmGlobal()
	.then(i => i.simple().rawNoColor())
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

&nbsp;

### npmScripts

> npmScripts()

Return a list of scripts - used by `npl -s`

***

#### raw()

```js
npmScripts()
	.raw()
	.then(i => yourFunction)
	.catch(err => console.log(err));

// @express@1.0.0
// build => babel src/ -d build/ --quiet
// commit => git-cz
```

#### rawNoColor()

```js
npmScripts()
	.rawNoColor()
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

&nbsp;

### npmRegistry

> npmRegistry(module: String)

Fetch package dependencies from npm registry - used by `npl module`

***

#### raw()

```js
let module = "express";
npmRegistry(module)
	.then(i => i.simple().raw())
	.then(i => yourFunction)
	.catch(err => console.log(err));

// ├── accepts@1.3.5
// ├── array-flatten@1.1.1
```

#### rawNoColor()

```js
npmRegistry(module)
	.then(i => i.simple().rawNoColor())
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

&nbsp;

## StringUtil

### cleanTagName

> cleanTagName(str: string)

```js
let str = "surl-cli@semantically-release";
StringUtil.cleanTagName(str); // 'surl-cli'
```

&nbsp;

### getRidOfColors

> getRidOfColors(str: String)

Especially useful for converting seemingly white text on terminal, which in reality is littered with ANSI color code, to reusable clean text.

```js
StringUtil.getRidOfColors(str);
```

&nbsp;

### getRidOfQuotationMarks

> getRidOfQuotationMarks(str: String)

```js
StringUtil.getRidOfQuotationMarks(str);
```

&nbsp;

### truncate

> truncate(str: String, maxWidth: Number, truncateMarker: Boolean)

#### Parameters

- str: required
- maxWidth: optional, default = 50
- truncateMarker: optional, default = true

```js
let str = "surl-cli@semantically-release";
StringUtil.truncate(str, 8, false); // => 'surl-cli...'
```
