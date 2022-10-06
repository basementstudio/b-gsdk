# b-gsdk

A GraphQL Codegen that outputs a TypeScript SDK.


### Usage

1. Create `./b-gsdk/config.js`:

```js
/**
 * @type {import('b-gsdk').BGsdkConfig}
 */
module.exports = {
  endpoint: "",
  headers: {}
}
```

2. Run generator:

```zsh
yarn b-gsdk generate
```

### With Custom Directory

1. Create `./custom-dir/config.js`.
2. Run generator with `--dir` argument:


```zsh
yarn b-gsdk generate --dir custom-dir
```
