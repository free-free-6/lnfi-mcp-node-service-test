// @ts-ignore
import { LnfiSdk, LnfiNostr} from "@lnfi-network/lnfi-sdk";

export function createLnfiSdk(lnfiSdkEnv: any) {
    const signer = lnfiSdkEnv?.privateKey ? new LnfiNostr({
        privateKey: lnfiSdkEnv?.privateKey,
    }) : undefined;

    const lnfisdk = new LnfiSdk({
        ...lnfiSdkEnv,
        signer: lnfiSdkEnv?.privateKey ? signer : lnfiSdkEnv?.signer,
    });

    return lnfisdk;
}


