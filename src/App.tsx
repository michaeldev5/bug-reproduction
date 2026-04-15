import { createWsClient } from "polkadot-api/ws";
import "./App.css";
import { Binary } from "polkadot-api";

const WS_URL_1 = "wss://acala-rpc-0.aca-api.network";
const WS_URL_2 = "wss://acala.ibp.network";

function App() {
  const onClickPapi = async () => {
    const client = createWsClient([WS_URL_1, WS_URL_2]);
    console.log(client);

    const tx = await client
      .getUnsafeApi()
      .txFromCallData(
        Binary.fromHex(
          "0x0c0100920ff0c3caf1cf146c9561ce7cb35dcb3be505511070788a47f028f93cb127000b00a0724e1809",
        ),
      );
    // This code is never reached beacause it's stuck on the first non-responsive endpoint (WS_URL_1) and never tries the second one (WS_URL_2).
    console.log(tx);
  };

  return (
    <>
      <h1>PAPI reproduction</h1>
      <div className="card">
        <button onClick={onClickPapi}>Click me</button>
      </div>
    </>
  );
}

export default App;
