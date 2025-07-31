import { Binary, createClient } from "polkadot-api";
import "./App.css";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import { getWsProvider } from "polkadot-api/ws-provider/web";

import { getPolkadotSigner } from "polkadot-api/signer";
import {
  DEV_PHRASE,
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers";
import { sr25519CreateDerive } from "@polkadot-labs/hdkd";

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
      withPolkadotSdkCompat(
        getWsProvider("wss://paseo-rpc.play.hydration.cloud")
      )
    );

    console.log("Client created");

    const tx = await client
      .getUnsafeApi()
      .txFromCallData(
        Binary.fromHex(
          "0x8900040000000000e8890423c78a000000000000000004010200a10f0100246044e82dcb430908830f90e8c668b02544004d66eab58af5124b953ef57d3700"
        )
      );

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
