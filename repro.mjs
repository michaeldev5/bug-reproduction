import { createWsClient } from "polkadot-api/ws";

const client = createWsClient("wss://westend-asset-hub-rpc.polkadot.io");
const api = client.getUnsafeApi();

const run = async (label, fn) => {
  try {
    const entries = await fn();
    console.log(`[OK]  ${label} -> ${entries.length} entries`);
  } catch (err) {
    console.log(`[ERR] ${label}:`);
    console.log(err);
  }
};

// Assets.Metadata decodes fine, but ForeignAssets is keyed by an
// location and decoding it throws "TypeError: innerDecoder is not a function".
await run("Assets.Metadata", () => api.query.Assets.Metadata.getEntries());
await run("ForeignAssets.Metadata", () =>
  api.query.ForeignAssets.Metadata.getEntries(),
);

process.exit(0);
