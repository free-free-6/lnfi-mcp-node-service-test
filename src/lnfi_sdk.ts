// @ts-ignore
import { LnfiSdk, LnfiNostr} from "custom-nostr-sdk";

export function createLnfiApi(lnfiApiEnv: any) {
    const signer = lnfiApiEnv?.privateKey ? new LnfiNostr({
        privateKey: lnfiApiEnv?.privateKey,
    }) : undefined;

    const lnfisdk = new LnfiSdk({
        ...lnfiApiEnv,
        signer: lnfiApiEnv?.privateKey ? signer : lnfiApiEnv?.signer,
    });

    return lnfisdk;
}


