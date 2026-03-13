import "./App.css";
import { DedotClient, WsProvider as DedotWsProvider } from "dedot";
import { StatemintApi } from "../statemint/index";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Binary, createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider";

const hex =
  "0x1f0d04010100c91f04040100000700e8764817010401000104040d0102040001010090ae4c88038836d2c4baec14f2e96ed1efd2315497b79877c1680f992b98d17600";
const WS_URL = "wss://asset-hub-polkadot.ibp.network";

function App() {
  const onClickDedot = async () => {
    const api = await DedotClient.new<StatemintApi>(
      new DedotWsProvider(WS_URL),
    );

    const tx = api.registry.$Extrinsic.tryDecode(hex);
    const subTx = api.toTx(tx);
    console.log(subTx);
  };

  const onClickPjs = async () => {
    const api = await ApiPromise.create({
      provider: new WsProvider(WS_URL),
    });

    const hex =
      "0x1f0d04010100c91f04040100000700e8764817010401000104040d0102040001010090ae4c88038836d2c4baec14f2e96ed1efd2315497b79877c1680f992b98d17600";
    const tx = api.tx(hex);
    console.log(tx);
  };

  const onClickPapi = async () => {
    const api = createClient(getWsProvider(WS_URL));
    const tx = await api.getUnsafeApi().txFromCallData(Binary.fromHex(hex));
    console.log(tx);
  };

  return (
    <>
      <h1>PAPI reproduction</h1>
      <div className="card">
        <button onClick={onClickDedot}>Click me DEDOT</button>
        <button onClick={onClickPjs}>Click me PJS</button>
        <button onClick={onClickPapi}>Click me PAPI</button>
      </div>
    </>
  );
}

export default App;
