import { Keyring } from "@polkadot/api";
import "./App.css";
import { DedotClient, WsProvider as DedotWsProvider } from "dedot";

const WS_URL = "wss://acala-rpc-0.aca-api.network";

export const createSr25519Signer = (path: string) => {
  const keyring = new Keyring({ type: "sr25519" });
  return keyring.addFromUri(path);
};

function App() {
  const onClickDedot = async () => {
    const signer = createSr25519Signer("//Alice");

    const api = await DedotClient.new(new DedotWsProvider(WS_URL));

    const tx = api.tx.polkadotXcm.transferAssets();
    console.log(await tx.sign(signer));
  };

  return (
    <>
      <h1>PAPI reproduction</h1>
      <div className="card">
        <button onClick={onClickDedot}>Click me DEDOT</button>
      </div>
    </>
  );
}

export default App;
