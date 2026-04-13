import "./App.css";
import { DedotClient, WsProvider as DedotWsProvider } from "dedot";

const WS_URL = "wss://acala-rpc-0.aca-api.network";

function App() {
  const onClickDedot = async () => {
    await DedotClient.new(new DedotWsProvider(WS_URL));
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
