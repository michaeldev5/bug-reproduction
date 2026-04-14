import { createWsClient } from "polkadot-api/ws";
import "./App.css";

const WS_URL = "wss://acala-rpc-0.aca-api.network";

function App() {
  const onClickPapi = async () => {
    const client = createWsClient(WS_URL);
    console.log(client);
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
