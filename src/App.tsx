import { createClient } from "polkadot-api";
import "./App.css";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import { getWsProvider } from "polkadot-api/ws-provider/web";

function App() {
  const getFromRpc = async () => {
    const client = createClient(
      withPolkadotSdkCompat(
        getWsProvider("wss://asset-hub-polkadot-rpc.dwellir.com")
      )
    );

    const value = await client._request("state_getStorage", [
      "0x5fbc5c7ba58845ad1f1a9a7c5bc12fad",
    ]);

    console.log("value", value);

    client.destroy();
  };

  const onClick = () => {
    getFromRpc();
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
