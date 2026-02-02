import { Accounts } from "./Accounts";
import "./App.css";

import { Wallets } from "./Wallets";

function App() {
  return (
    <>
      <h1>PAPI reproduction</h1>
      <div className="card">
        <Wallets />
        <Accounts />
      </div>
    </>
  );
}

export default App;
