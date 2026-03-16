import "./App.css";
import { ApiPromise, WsProvider } from "@polkadot/api";

const WS_URL = "wss://asset-hub-polkadot.ibp.network";

function App() {
  const onClickPjs = async () => {
    const api = await ApiPromise.create({
      provider: new WsProvider(WS_URL),
    });

    const customXcm = {
      V4: [
        // Multiple instructions here
        // I am adding one just as an example
        {
          WithdrawAsset: [
            {
              id: {
                parents: 1,
                interior: { Here: null },
              },
              fun: {
                Fungible: "1000000000",
              },
            },
          ],
        },
      ],
    };

    const objHex = api.createType("XcmVersionedXcm", customXcm).toHex();
    console.log(objHex);
  };

  return (
    <>
      <h1>PAPI reproduction</h1>
      <div className="card">
        <button onClick={onClickPjs}>Click me PJS</button>
      </div>
    </>
  );
}

export default App;
