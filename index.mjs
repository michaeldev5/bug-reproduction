import { Binary, createClient } from 'polkadot-api'
import { getWsProvider } from 'polkadot-api/ws'

const EXPECTED_ERROR =
  'Incompatible runtime entry RuntimeCall(DryRunApi_dry_run_call)'

const jamtonClient = createClient(getWsProvider('wss://rpc.jamton.network'))
const polkadotClient = createClient(getWsProvider('wss://rpc.polkadot.io'))

try {
  const jamton = jamtonClient.getUnsafeApi()
  const polkadot = polkadotClient.getUnsafeApi()
  const root = { type: 'system', value: { type: 'Root' } }

  const jamtonCall = jamton.tx.System.remark({
    remark: Binary.fromText('compatible JAMTON call')
  }).decodedCall

  await jamton.apis.DryRunApi.dry_run_call(root, jamtonCall)
  console.log('JAMTON call: compatible')

  const polkadotCall = polkadot.tx.Staking.chill({}).decodedCall

  try {
    await jamton.apis.DryRunApi.dry_run_call(root, polkadotCall)
    throw new Error('Expected PAPI to reject the Polkadot RuntimeCall')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (message !== EXPECTED_ERROR) throw error

    console.log(`Polkadot call on JAMTON: ${message}`)
    console.log('Reproduction successful')
  }
} finally {
  jamtonClient.destroy()
  polkadotClient.destroy()
}
