// @ts-ignore
import { LnfiSdk, Singer } from "lnfi-sdk";

export function createLnfiApi(lnfiApiEnv: any) {
    const singer = lnfiApiEnv?.privateKey ? new Singer({
        privateKey: lnfiApiEnv?.privateKey,
    }) : undefined;

    const lnfisdk = new LnfiSdk({
        ...lnfiApiEnv,
        singer: lnfiApiEnv?.privateKey ? singer : lnfiApiEnv?.singer,
    });

    return lnfisdk;
}


