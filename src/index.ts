#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
    createLnfiApi,
} from "./lnfi_sdk.js";

// @ts-ignore
export { Singer } from "lnfi-sdk";

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

    server.tool(
        "LnfiGetConfig",
        "Lnfi Get Config Environment",
        {},
        async ({ }) => {
            const config = await lnfisdk.getConfig();
            return { content: [{ type: "text", text: JSON.stringify(config) }] };
        }
    );

    // Market tools
    server.tool(
        "LnfiMarketListOrder",
        "Lnfi List a new market order. Need to call LnfiTokenApprove first to authorize amount*price SATS, approveTo set to MARKET_ROBOT_ADDR",
        {
            side: z.string(),
            amount: z.number(),
            price: z.string(),
            buyOrSellTokenName: z.string(),
            payTokenName: z.string()
        },
        async ({ side, amount, price, buyOrSellTokenName, payTokenName }) => {
            const result = await lnfisdk.market.listOrder({
                side,
                amount,
                price,
                buyOrSellTokenName,
                payTokenName
            });
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiMarketTakeOrder",
        "Lnfi takes an existing market order. First, call LnfiMarketsGetOrderListing to get the money value in SATS, then call LnfiTokenApprove to authorize with approveTo set to MARKET_ROBOT_ADDR.",
        { orderId: z.string() },
        async ({ orderId }) => {
            const result = await lnfisdk.market.takeOrder(orderId);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiMarketCancelOrder",
        "Lnfi Cancel a market order",
        { orderId: z.string() },
        async ({ orderId }) => {
            const result = await lnfisdk.market.cancelOrder(orderId);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiMarketRepairOrder",
        "Lnfi Repair a market order",
        { orderId: z.string() },
        async ({ orderId }) => {
            const result = await lnfisdk.market.repairOrder(orderId);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    // Token tools
    server.tool(
        "LnfiTokenApprove",
        "Lnfi Approve token spending",
        {
            tokenName: z.string(),
            amount: z.number(),
            approveTo: z.string().describe("MARKET_ROBOT_ADDR or TOKEN_ROBOT_ADDR (fixed strings), or a nostrAddress (e.g. npub...)")
        },
        async ({ tokenName, amount, approveTo }) => {
            let approveToTemp =  approveTo;
            if (approveTo.toUpperCase() === "MARKET_ROBOT_ADDR") {
                const config = await lnfisdk.getConfig();
                approveToTemp = config.MARKET_ROBOT_ADDR;
            }
            if (approveTo.toUpperCase() === "TOKEN_ROBOT_ADDR") {
                const config = await lnfisdk.getConfig();
                approveToTemp = config.TOKEN_ROBOT_ADDR;
            }

            const result = await lnfisdk.token.approve({
                tokenName,
                amount,
                approveTo: approveToTemp
            });
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiTokenTransfer",
        "Lnfi Transfer tokens",
        {
            tokenName: z.string(),
            amount: z.number(),
            to: z.string()
        },
        async ({ tokenName, amount, to }) => {
            const result = await lnfisdk.token.transfer({
                tokenName,
                amount,
                to
            });
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiTokenAddAddressBook",
        "Lnfi Add address to address book",
        {
            address: z.string(),
            name: z.string()
        },
        async ({ address, name }) => {
            const result = await lnfisdk.token.addAddressBook({
                address,
                name
            });
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiTokenDeposit",
        "Lnfi Deposit tokens",
        {
            tokenName: z.string().describe("If provided as SATS, do not convert to BTC"),
            amount: z.number(),
            to: z.string().optional().describe("User address (optional, if not provided, pass empty)")
        },
        async ({ tokenName, amount, to }) => {
            const result = await lnfisdk.token.deposit({
                tokenName,
                amount,
                to
            });
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiTokenWithdraw",
        "Lnfi Withdraw tokens",
        {
            tokenName: z.string(),
            invoice: z.string()
        },
        async ({ tokenName, invoice }) => {
            const result = await lnfisdk.token.withdraw({
                tokenName,
                invoice
            });
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    // Asset tools
    server.tool(
        "LnfiAssetGetBalance",
        "Lnfi Get asset balance",
        { user: z.string().optional().describe("User address (optional, defaults to query self)") },
        async ({ user }) => {
            const result = await lnfisdk.asset.getBalance(user);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiAssetGetTokenList",
        "Lnfi Get token list",
        {},
        async () => {
            const result = await lnfisdk.asset.getTokenList();
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiAssetGetAllowance",
        "Lnfi Get token allowance",
        {
            token: z.string(),
            owner: z.string().optional(),
            spender: z.string()
        },
        async ({ token, owner, spender }) => {
            const result = await lnfisdk.asset.getAllowance(token, owner, spender);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiAssetGetFundingRecords",
        "Lnfi Get funding records",
        {
            page: z.number().optional(),
            count: z.number().optional(),
            type: z.string().optional(),
            tokenAddress: z.string().optional(),
            address: z.string().optional(),
            status: z.string().optional()
        },
        async (params) => {
            const result = await lnfisdk.asset.getFundingRecords(params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiAssetGetTokenEvents",
        "Lnfi Get token events",
        {
            type: z.string().optional(),
            token: z.string().optional(),
            eventId: z.string().optional(),
            address: z.string().optional(),
            page: z.number().optional(),
            count: z.number().optional()
        },
        async (params) => {
            const result = await lnfisdk.asset.getTokenEvents(params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiAssetGetHolders",
        "Lnfi Get token holders",
        {
            assetId: z.string(),
            owner: z.string().optional(),
            page: z.number().optional(),
            count: z.number().optional()
        },
        async (params) => {
            const result = await lnfisdk.asset.getHolders(params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiAssetGetHolder",
        "Lnfi Get holder info",
        {
            assetId: z.string(),
            owner: z.string().optional()
        },
        async ({ assetId, owner }) => {
            const result = await lnfisdk.asset.getHolder(assetId, owner);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiAssetGetHolderSummary",
        "Lnfi Get holder summary",
        { assetId: z.string() },
        async ({ assetId }) => {
            const result = await lnfisdk.asset.getHolderSummary(assetId);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiAssetGetPayeeList",
        "Lnfi Get payee list",
        {},
        async () => {
            const result = await lnfisdk.asset.getPayeeList();
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );


    // Market API tools
    server.tool(
        "LnfiMarketsGetTokenList",
        "Lnfi Get market token list",
        {},
        async () => {
            const result = await lnfisdk.marketApi.getMarketTokenList();
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiMarketsGetOrderListing",
        "Lnfi Get market order listing",
        {
            page: z.number().optional(),
            count: z.number().optional(),
            token: z.string().optional(),
            type: z.string().optional().describe("Order type filter. If you want to buy, query SELL. If you want to sell, query BUY.")
        },
        async (params) => {
            const result = await lnfisdk.marketApi.getMarketOrderListing(params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiMarketsGetOrderHistory",
        "Lnfi Get order history",
        {
            count: z.number().optional(),
            page: z.number().optional(),
            type: z.string().optional(),
            token: z.string().optional(),
            eventId: z.string().optional(),
            status: z.string().optional(),
            address: z.string().optional()
        },
        async (params) => {
            const result = await lnfisdk.marketApi.getOrderHistory(params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiMarketsGetMyOrder",
        "Lnfi Get my market orders",
        {
            count: z.number().optional(),
            page: z.number().optional(),
            type: z.string().optional().describe("buy or sell(optional, if not provided, pass empty)"),
            token: z.string().optional().describe("token address(optional, if not provided, pass empty)"),
            status: z.string().optional(),
            owner: z.string().optional()
        },
        async (params) => {
            const result = await lnfisdk.marketApi.getMarketMyOrder(params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiMarketsGetKline",
        "Lnfi Get market Kline data",
        {
            tokenAddress: z.string(),
            startDataTime: z.string().optional(),
            endDataTime: z.string().optional()
        },
        async (params) => {
            const result = await lnfisdk.marketApi.getKline(params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );




    // Lock tools
    server.tool(
        "LnfiLockGetLockList",
        "Lnfi Get lock list",
        {
            page: z.number().optional(),
            count: z.number().optional(),
            owner: z.string().optional()
        },
        async (params) => {
            const result = await lnfisdk.lock.getLockList(params);
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

getMcpLnfiServer({
    env: "development",
    relays: ["wss://dev-relay.lnfi.network"],
    baseURL: "https://market-api.unift.xyz"
}).catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});

