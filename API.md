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

Used by `npl` - list module's dependencies.

- With color

```js
npmList()
	.raw()
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

- Without color

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

Used by `npl -t` - list recent global installs.

- With color

```js
npmRecent()
	.all()
	.then(i => i.raw())
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

- Without color

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

Used by `npl -g` - list global installs.

- With color

```js
npmGlobal()
	.then(i => i.simple().raw())
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

- Without color

```js
npmGlobal()
	.then(i => i.simple().rawNoColor())
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

<br/>

### npmScripts

> npmScripts()

Used by `npl -s` - return a list of scripts.

- With color

```js
npmScripts()
	.raw()
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

- Without color

```js
npmScripts()
	.rawNoColor()
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

<br/>

### npmRegistry

> npmRegistry(module: String)

Used by `npl module` - fetch package dependencies from npm registry.

- With color

```js
let module = 'express';
npmRegistry(module)
	.then(i => i.simple().raw())
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

- Without color

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
StringUtil.truncate(str, 8, false); // 'surl-cli...'
```
