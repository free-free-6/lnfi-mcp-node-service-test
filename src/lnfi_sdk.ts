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

// Config methods
export async function getConfig(lnfisdk: any) {
    return await lnfisdk.getConfig();
}

// Nostr methods
export async function getNostrPool(lnfisdk: any) {
    return await lnfisdk.getNostrPool();
}

// Market methods
export async function marketListOrder(lnfisdk: any, params: any) {
    return await lnfisdk.market.listOrder(params);
}

export async function marketTakeOrder(lnfisdk: any, orderId: string) {
    return await lnfisdk.market.takeOrder(orderId);
}

export async function marketCancelOrder(lnfisdk: any, orderId: string) {
    return await lnfisdk.market.cancelOrder(orderId);
}

export async function marketRepairOrder(lnfisdk: any, orderId: string) {
    return await lnfisdk.market.repairOrder(orderId);
}

// Token methods
export async function tokenApprove(lnfisdk: any, params: any) {
    return await lnfisdk.token.approve(params);
}

export async function tokenTransfer(lnfisdk: any, params: any) {
    return await lnfisdk.token.transfer(params);
}

export async function tokenAddAddressBook(lnfisdk: any, params: any) {
    return await lnfisdk.token.addAddressBook(params);
}

export async function tokenDeposit(lnfisdk: any, params: any) {
    return await lnfisdk.token.deposit(params);
}

export async function tokenWithdraw(lnfisdk: any, params: any) {
    return await lnfisdk.token.withdraw(params);
}

// Provider methods
export async function providerSupportedList(lnfisdk: any) {
    return await lnfisdk.provider.supportedProviderList();
}

export async function providerConnect(lnfisdk: any, providerName: string) {
    return await lnfisdk.provider.connect(providerName);
}

export async function providerGetProvider(lnfisdk: any) {
    return await lnfisdk.provider.getProvider();
}

// Utils methods
export async function utilsNip04(lnfisdk: any, params: any) {
    return await lnfisdk.utils.nip04(params);
}

export async function utilsNip19(lnfisdk: any, params: any) {
    return await lnfisdk.utils.nip19(params);
}

export async function utilsGeneratePrivateKey(lnfisdk: any) {
    return await lnfisdk.utils.generatePrivateKey();
}

export async function utilsGetPublicKey(lnfisdk: any, privateKey: string) {
    return await lnfisdk.utils.getPublicKey(privateKey);
}

export async function utilsGetEventHash(lnfisdk: any, event: any) {
    return await lnfisdk.utils.getEventHash(event);
}

// Asset methods
export async function assetGetBalance(lnfisdk: any, nostrAddress: string) {
    return await lnfisdk.asset.getBalance(nostrAddress);
}

export async function assetGetTokenList(lnfisdk: any) {
    return await lnfisdk.asset.getTokenList();
}

export async function assetGetAllowance(lnfisdk: any, params: any) {
    return await lnfisdk.asset.getAllowance(params);
}

export async function assetGetFundingRecords(lnfisdk: any, params: any) {
    return await lnfisdk.asset.getFundingRecords(params);
}

export async function assetGetTokenEvents(lnfisdk: any, params: any) {
    return await lnfisdk.asset.getTokenEvents(params);
}

export async function assetGetHolders(lnfisdk: any, params: any) {
    return await lnfisdk.asset.getHolders(params);
}

export async function assetGetHolder(lnfisdk: any, holderId: string) {
    return await lnfisdk.asset.getHolder(holderId);
}

export async function assetGetHolderSummary(lnfisdk: any) {
    return await lnfisdk.asset.getHolderSummary();
}

export async function assetGetPayeeList(lnfisdk: any) {
    return await lnfisdk.asset.getPayeeList();
}

// Markets methods
export async function marketsGetTokenList(lnfisdk: any) {
    return await lnfisdk.markets.getMarketTokenList();
}

export async function marketsGetOrderListing(lnfisdk: any, params: any) {
    return await lnfisdk.markets.getMarketOrderListing(params);
}

export async function marketsGetOrderHistory(lnfisdk: any, params: any) {
    return await lnfisdk.markets.getOrderHistory(params);
}

export async function marketsGetMyOrder(lnfisdk: any) {
    return await lnfisdk.markets.getMarketMyOrder();
}

// Fairmint methods
export async function fairmintGetHoroscopeList(lnfisdk: any) {
    return await lnfisdk.fairmint.getHoroscopList();
}

export async function fairmintGetActivity(lnfisdk: any, params: any) {
    return await lnfisdk.fairmint.getActivity(params);
}

export async function fairmintGetUserInfo(lnfisdk: any, userId: string) {
    return await lnfisdk.fairmint.getUserInfo(userId);
}

export async function fairmintGetUserList(lnfisdk: any) {
    return await lnfisdk.fairmint.getUserList();
}

export async function fairmintGetRankingSummary(lnfisdk: any) {
    return await lnfisdk.fairmint.getRankingSummary();
}

export async function fairmintGetSearchRanking(lnfisdk: any, params: any) {
    return await lnfisdk.fairmint.getSearchRanking(params);
}

export async function fairmintGetBlockList(lnfisdk: any) {
    return await lnfisdk.fairmint.getBlockList();
}

export async function fairmintGetBlockUserList(lnfisdk: any) {
    return await lnfisdk.fairmint.getBlockUserList();
}

// Lock methods
export async function lockGetLockList(lnfisdk: any) {
    return await lnfisdk.lock.getLockList();
}


