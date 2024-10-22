import { createClient, FixedSizeBinary, SS58String } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/node";
import {
  darwinia,
  XcmV3Junction,
  XcmV3Junctions,
  XcmV3WeightLimit,
  XcmVersionedLocation,
} from "@polkadot-api/descriptors";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import { ecdsaCreateDerive } from "@polkadot-labs/hdkd";
import {
  DEV_PHRASE,
  entropyToMiniSecret,
  mnemonicToEntropy,
} from "@polkadot-labs/hdkd-helpers";
import { getPolkadotSigner } from "polkadot-api/signer";

const start = async () => {
  const client = createClient(
    withPolkadotSdkCompat(getWsProvider("wss://koi-rpc.darwinia.network"))
  );

  const addressSS58: SS58String =
    "23hBHVjKq6bRNL3FoYeq7ugZnvVcgjTaoUoWXcKPaNSgxAR3";
  const addr = FixedSizeBinary.fromAccountId32<32>(addressSS58);

  const miniSecret = entropyToMiniSecret(mnemonicToEntropy(DEV_PHRASE));
  const derive = ecdsaCreateDerive(miniSecret);
  const aliceKeyPair = derive("//Alice");
  const signer = getPolkadotSigner(
    aliceKeyPair.publicKey,
    "Ecdsa",
    aliceKeyPair.sign
  );

  const tx = client.getTypedApi(darwinia).tx.XTokens.transfer({
    currency_id: { type: "ForeignAsset", value: BigInt(1029) },
    amount: BigInt(1000),
    dest: XcmVersionedLocation.V3({
      parents: 1,
      interior: XcmV3Junctions.X2([
        XcmV3Junction.Parachain(2000),
        XcmV3Junction.AccountId32({
          network: undefined,
          id: addr,
        }),
      ]),
    }),
    dest_weight_limit: XcmV3WeightLimit.Unlimited(),
  });

  const hex = await tx.sign(signer);
  console.log(hex);
};

start();
