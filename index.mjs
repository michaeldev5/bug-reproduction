import { createClient } from 'polkadot-api'
import { getWsProvider } from 'polkadot-api/ws'

const EXPECTED_ERROR =
  'Incompatible runtime entry RuntimeCall(DryRunApi_dry_run_call)'
const ACCOUNT = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'

const jamtonClient = createClient(getWsProvider('wss://rpc.jamton.network'))

try {
  const jamton = jamtonClient.getUnsafeApi()
  const root = { type: 'system', value: { type: 'Root' } }

  // This is the mint call ParaSpell adds before the transfer for dry-run
  // balance bypass. Its "0" asset ID is transformed into the number 0.
  const brokenMint = jamton.tx.Tokens.set_balance({
    who: { type: 'Id', value: ACCOUNT },
    currency_id: 0,
    new_free: 1_000_000_000_000n,
    new_reserved: 0n
  })
  const brokenBatch = jamton.tx.Utility.batch_all({
    calls: [brokenMint.decodedCall]
  })

  try {
    await jamton.apis.DryRunApi.dry_run_call(root, brokenBatch.decodedCall)
    throw new Error('Expected PAPI to reject the ParaSpell-shaped RuntimeCall')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (message !== EXPECTED_ERROR) throw error

    console.log(`ParaSpell-shaped call: ${message}`)
  }

  // JAMTON's CurrencyId is an enum. Using its actual shape makes the same call
  // compatible and proves the numeric currency_id is the failing value.
  const fixedMint = jamton.tx.Tokens.set_balance({
    who: { type: 'Id', value: ACCOUNT },
    currency_id: { type: 'ForeignAsset', value: 0 },
    new_free: 1_000_000_000_000n,
    new_reserved: 0n
  })
  const fixedBatch = jamton.tx.Utility.batch_all({
    calls: [fixedMint.decodedCall]
  })

  await jamton.apis.DryRunApi.dry_run_call(root, fixedBatch.decodedCall)
  console.log('Enum CurrencyId call: compatible')
  console.log('Reproduction successful')
} finally {
  jamtonClient.destroy()
}
