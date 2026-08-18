# JAMTON PAPI `RuntimeCall` incompatibility

Minimal reproduction using vanilla PAPI, pinned to the latest published
`polkadot-api` release (`2.2.2`).

## Run

```sh
pnpm install
pnpm start
```

Expected output:

```text
JAMTON call: compatible
Polkadot call on JAMTON: Incompatible runtime entry RuntimeCall(DryRunApi_dry_run_call)
Reproduction successful
```

The first call proves JAMTON's `DryRunApi.dry_run_call` works. The second call
is valid according to Polkadot metadata but cannot be represented by JAMTON's
`RuntimeCall`, so PAPI rejects it during compatibility checking.
