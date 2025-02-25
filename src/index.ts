import { createClient, FixedSizeBinary, SS58String } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/node";
import { hydration } from "@polkadot-api/descriptors";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";

const start = async () => {
  const client = createClient(
    withPolkadotSdkCompat(getWsProvider("wss://hydration.ibp.network"))
  );

  const addressSS58: SS58String =
    "7LgutW4uapAUb9XtHjsRmemvWmkyfukPSw1Sr5LwqqUGTKjf";
  const addr = FixedSizeBinary.fromAccountId32<32>(addressSS58).asHex();

  const nonce = await client
    .getTypedApi(hydration)
    .apis.AccountNonceApi.account_nonce(addr);

  console.log(nonce);
};

start();
