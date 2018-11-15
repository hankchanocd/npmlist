# API

`npl`'s API is made available in Promise, which is also accessible with async/await.

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
	npmGlobal
} = require("@hankchanocd/npmlist");

const { npmList } = npmDependencies;
```

## npmDependencies()

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

## npmRecent()

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

## npmGlobal()

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

## npmScripts()

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

## npmRegistry()

Used by `npl module` - fetch package dependencies from npm registry.

- With color

```js
npmRegistry(moduleString) // i.e. moduleString = 'express'
	.then(i => i.simple().raw())
	.then(i => yourFunction)
	.catch(err => console.log(err));
```

- Without color

```js
npmRegistry(moduleString)
	.then(i => i.simple().rawNoColor())
	.then(i => yourFunction)
	.catch(err => console.log(err));
```
