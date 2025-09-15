import "./App.css";

import { createClient } from "polkadot-api";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import { getWsProvider } from "polkadot-api/ws-provider/web";

import { getPolkadotSigner } from "polkadot-api/signer";
import {
  DEV_PHRASE,
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers";
import { sr25519CreateDerive } from "@polkadot-labs/hdkd";
import { moonbeam } from "@polkadot-api/descriptors";

const createSr25519Signer = () => {
  const miniSecret = entropyToMiniSecret(mnemonicToEntropy(DEV_PHRASE));
  const derive = sr25519CreateDerive(miniSecret);
  const aliceKeyPair = derive("//Alice");
  return getPolkadotSigner(
    aliceKeyPair.publicKey,
    "Sr25519",
    aliceKeyPair.sign
  );
};

function App() {
  const createAndSignTx = async () => {
    const client = createClient(
      withPolkadotSdkCompat(getWsProvider("wss://moonbeam.ibp.network"))
    );

    console.log("Client created");

    const tx = client.getTypedApi(moonbeam).tx.Balances.force_set_balance({
      // If we change address to lowercase only, it works
      // 0x24d18dbfbced732eadf98ee520853e13909fe258
      // Mixed case or uppercase fails
      who: "0x24D18DBFBCED732EADF98EE520853E13909FE258",
      new_free: 1000000000000000n,
    });

    console.log("Transaction created:");

    console.log("Signing transaction...");

    const signer = createSr25519Signer();

    console.log("Signer created");

    const result = await tx.sign(signer);

    console.log("Transaction result:", result);
  };

  const onClick = () => {
    createAndSignTx();
  };

  return (
    <>
      <h1>PAPI reproduction</h1>
      <div className="card">
        <button onClick={onClick}>Start</button>
      </div>
    </>
  );
}

export default App;
