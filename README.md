# ParaSpell JAMTON PAPI `RuntimeCall` incompatibility

Minimal reproduction of the call shape produced by ParaSpell's JAMTON dry-run
bypass. It uses only vanilla PAPI, pinned to the latest published `polkadot-api`
release (`2.2.2`).

## Run

```sh
pnpm install
pnpm start
```

Expected output:

```text
ParaSpell-shaped call: Incompatible runtime entry RuntimeCall(DryRunApi_dry_run_call)
Enum CurrencyId call: compatible
Reproduction successful
```

## Why it fails

Before dry-running a transfer, ParaSpell wraps it in `Utility.batch_all` and
adds mint calls so the sender has enough balance. For JAMTON's DOT asset, the
mint is `Tokens.set_balance`.

ParaSpell takes the asset ID `"0"` and transforms it to the number `0`. JAMTON's
`Tokens.set_balance.currency_id` is not a number; it is a `CurrencyId` enum and
the DOT value must be:

```js
{ type: 'ForeignAsset', value: 0 }
```

When the batch is passed to `DryRunApi.dry_run_call`, PAPI checks the entire
nested `RuntimeCall` against JAMTON metadata. The numeric `currency_id` is
incompatible, so PAPI throws locally before making the runtime call.

The broken call cannot be stored as valid SCALE call hex: calling
`getEncodedData()` on it already throws
`Incompatible runtime entry Tx(Tokens.set_balance)`. Decoding valid JAMTON call
hex would produce the correct enum and would no longer reproduce the bug.
