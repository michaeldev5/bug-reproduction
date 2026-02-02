import { defineConfig } from "@reactive-dot/core";
import { LedgerWallet } from "@reactive-dot/wallet-ledger";

export const config = defineConfig({
  chains: {},
  wallets: [new LedgerWallet()],
});
