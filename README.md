# eslint-plugin-tsdoc: undeclared `eslint` type dependency

Minimal reproduction for [microsoft/tsdoc](https://github.com/microsoft/tsdoc).

`eslint-plugin-tsdoc`'s published `lib/index.d.ts` does:

```ts
import type * as eslint from 'eslint';
```

but the package declares no `dependency` or `peerDependency` on `eslint`, only a
`devDependency`. Under pnpm's non-hoisted layout, `eslint` is therefore never linked
into the plugin's private `node_modules`, so TypeScript's upward walk continues past
the plugin and binds `'eslint'` to whatever `@types/eslint` is reachable in the tree.

## Reproduce

```bash
pnpm install
./node_modules/.bin/tsc --noEmit
```

Expected: exit 0. Actual: exit 2:

```
eslint.config.js(6,14): error TS2322: Type 'IPlugin' is not assignable to type 'Plugin'.
  Types of property 'rules' are incompatible.
    Type '{ [x: string]: RuleModule; }' is not assignable to type 'Record<string, RuleDefinition<RuleDefinitionTypeOptions>>'.
```

Confirm the misresolution with:

```bash
./node_modules/.bin/tsc --noEmit --traceResolution | grep "Module name 'eslint' was successfully resolved"
```

which reports `@types/eslint@9.6.1` rather than the installed `eslint@10.8.0`.

## Why `@types/eslint-scope` is here

It is the only reason `@types/eslint` enters the tree, and it enters transitively:
`@types/eslint-scope` pulls in `@types/eslint`. In a real project this typically arrives via
`webpack`. Nothing depends on `@types/eslint` directly. Remove `@types/eslint-scope`
from `package.json` and the repro passes.

## Does not reproduce under npm

A flat `npm install` hoists the real `eslint` to the top level, where its bundled
types win the lookup. The bug needs an isolated layout (pnpm, Yarn PnP).

## Workaround (consumer side)

Declaring the missing peer is sufficient. Add:

```yaml
# pnpm-workspace.yaml
packageExtensions:
  eslint-plugin-tsdoc:
    peerDependencies:
      eslint: "*"
```

then `pnpm install` and re-run `tsc`, which exits 0. pnpm now links the consumer's ESLint
into the plugin's private `node_modules`, and resolution finds the real package.

## Fix (package side)

Add `"peerDependencies": { "eslint": ">=7" }` to `eslint-plugin-tsdoc`'s own
`package.json`.
