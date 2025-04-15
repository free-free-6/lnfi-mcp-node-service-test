import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
    createLnfiApi,
    getConfig,
    getNostrPool,
    marketListOrder,
    marketTakeOrder,
    marketCancelOrder,
    marketRepairOrder,
    tokenApprove,
    tokenTransfer,
    tokenAddAddressBook,
    tokenDeposit,
    tokenWithdraw,
    providerSupportedList,
    providerConnect,
    providerGetProvider,
    utilsNip04,
    utilsNip19,
    utilsGeneratePrivateKey,
    utilsGetPublicKey,
    utilsGetEventHash,
    assetGetBalance,
    assetGetTokenList,
    assetGetAllowance,
    assetGetFundingRecords,
    assetGetTokenEvents,
    assetGetHolders,
    assetGetHolder,
    assetGetHolderSummary,
    assetGetPayeeList,
    marketsGetTokenList,
    marketsGetOrderListing,
    marketsGetOrderHistory,
    marketsGetMyOrder,
    fairmintGetHoroscopeList,
    fairmintGetActivity,
    fairmintGetUserInfo,
    fairmintGetUserList,
    fairmintGetRankingSummary,
    fairmintGetSearchRanking,
    fairmintGetBlockList,
    fairmintGetBlockUserList,
    lockGetLockList
} from "./lnfi_sdk.js";

export const getMcpLnfiServer = async (lnfiApiEnv: any) => {
    let privateKey;
    let lnfiApiEnvTemp = {};
    //Check if running in browser
    if (typeof window === "undefined") {
        privateKey = process.argv[2];
        if (!privateKey) {
            console.error("Please provide private key as startup parameter");
            process.exit(1);
        }

        lnfiApiEnvTemp = {
            ...lnfiApiEnv,
            privateKey
        }

    } else {
        lnfiApiEnvTemp = {
            ...lnfiApiEnv
        }
    }


    const lnfisdk = createLnfiApi(lnfiApiEnvTemp);

    const server = new McpServer({
        name: "lnfi-mcp-node-service",
        version: "1.0.0",
        capabilities: {
            resources: {},
            tools: {},
        },
    });

    // Config tools
    server.tool(
        "getConfig",
        "Get LNFi configuration",
        {},
        async () => {
            const result = await getConfig(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    // Nostr tools
    server.tool(
        "getNostrPool",
        "Get Nostr pool information",
        {},
        async () => {
            const result = await getNostrPool(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    // Market tools
    server.tool(
        "marketListOrder",
        "List a new market order",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await marketListOrder(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "marketTakeOrder",
        "Take an existing market order",
        { orderId: z.string() },
        async ({ orderId }) => {
            const result = await marketTakeOrder(lnfisdk, orderId);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "marketCancelOrder",
        "Cancel a market order",
        { orderId: z.string() },
        async ({ orderId }) => {
            const result = await marketCancelOrder(lnfisdk, orderId);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "marketRepairOrder",
        "Repair a market order",
        { orderId: z.string() },
        async ({ orderId }) => {
            const result = await marketRepairOrder(lnfisdk, orderId);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    // Token tools
    server.tool(
        "tokenApprove",
        "Approve token spending",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await tokenApprove(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "tokenTransfer",
        "Transfer tokens",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await tokenTransfer(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "tokenAddAddressBook",
        "Add address to address book",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await tokenAddAddressBook(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "tokenDeposit",
        "Deposit tokens",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await tokenDeposit(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "tokenWithdraw",
        "Withdraw tokens",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await tokenWithdraw(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    // Provider tools
    server.tool(
        "providerSupportedList",
        "List supported providers",
        {},
        async () => {
            const result = await providerSupportedList(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "providerConnect",
        "Connect to provider",
        { providerName: z.string() },
        async ({ providerName }) => {
            const result = await providerConnect(lnfisdk, providerName);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "providerGetProvider",
        "Get current provider",
        {},
        async () => {
            const result = await providerGetProvider(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    // Utils tools
    server.tool(
        "utilsNip04",
        "NIP-04 encryption/decryption",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await utilsNip04(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "utilsNip19",
        "NIP-19 encoding/decoding",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await utilsNip19(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "utilsGeneratePrivateKey",
        "Generate a new private key",
        {},
        async () => {
            const result = await utilsGeneratePrivateKey(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "utilsGetPublicKey",
        "Get public key from private key",
        { privateKey: z.string() },
        async ({ privateKey }) => {
            const result = await utilsGetPublicKey(lnfisdk, privateKey);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "utilsGetEventHash",
        "Get event hash",
        { event: z.object({}).passthrough() },
        async ({ event }) => {
            const result = await utilsGetEventHash(lnfisdk, event);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    // Asset tools
    server.tool(
        "assetGetBalance",
        "Get asset balance",
        { nostrAddress: z.string().optional() },
        async ({ nostrAddress }) => {
            const result = await assetGetBalance(lnfisdk, nostrAddress || "");
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "assetGetTokenList",
        "Get token list",
        {},
        async () => {
            const result = await assetGetTokenList(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "assetGetAllowance",
        "Get token allowance",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await assetGetAllowance(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "assetGetFundingRecords",
        "Get funding records",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await assetGetFundingRecords(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "assetGetTokenEvents",
        "Get token events",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await assetGetTokenEvents(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "assetGetHolders",
        "Get token holders",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await assetGetHolders(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "assetGetHolder",
        "Get holder info",
        { holderId: z.string() },
        async ({ holderId }) => {
            const result = await assetGetHolder(lnfisdk, holderId);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "assetGetHolderSummary",
        "Get holder summary",
        {},
        async () => {
            const result = await assetGetHolderSummary(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "assetGetPayeeList",
        "Get payee list",
        {},
        async () => {
            const result = await assetGetPayeeList(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    // Markets tools
    server.tool(
        "marketsGetTokenList",
        "Get market token list",
        {},
        async () => {
            const result = await marketsGetTokenList(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "marketsGetOrderListing",
        "Get market order listing",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await marketsGetOrderListing(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "marketsGetOrderHistory",
        "Get order history",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await marketsGetOrderHistory(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "marketsGetMyOrder",
        "Get my market orders",
        {},
        async () => {
            const result = await marketsGetMyOrder(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    // Fairmint tools
    server.tool(
        "fairmintGetHoroscopeList",
        "Get horoscope list",
        {},
        async () => {
            const result = await fairmintGetHoroscopeList(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "fairmintGetActivity",
        "Get fairmint activity",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await fairmintGetActivity(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "fairmintGetUserInfo",
        "Get fairmint user info",
        { userId: z.string() },
        async ({ userId }) => {
            const result = await fairmintGetUserInfo(lnfisdk, userId);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "fairmintGetUserList",
        "Get fairmint user list",
        {},
        async () => {
            const result = await fairmintGetUserList(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "fairmintGetRankingSummary",
        "Get fairmint ranking summary",
        {},
        async () => {
            const result = await fairmintGetRankingSummary(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "fairmintGetSearchRanking",
        "Search fairmint ranking",
        { params: z.object({}).passthrough() },
        async ({ params }) => {
            const result = await fairmintGetSearchRanking(lnfisdk, params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "fairmintGetBlockList",
        "Get fairmint block list",
        {},
        async () => {
            const result = await fairmintGetBlockList(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "fairmintGetBlockUserList",
        "Get fairmint block user list",
        {},
        async () => {
            const result = await fairmintGetBlockUserList(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    // Lock tools
    server.tool(
        "lockGetLockList",
        "Get lock list",
        {},
        async () => {
            const result = await lockGetLockList(lnfisdk);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    //Check if running in browser
    if (typeof window === "undefined") {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("Weather MCP Server running on stdio");
    }
    return server;
}

getMcpLnfiServer({}).catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});

