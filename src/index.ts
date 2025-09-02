#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
    createLnfiSdk,
} from "./lnfi_sdk.js";


export const getLnfiMcpServer = async (lnfiSdkEnv: any) => {
    const lnfisdk = createLnfiSdk(lnfiSdkEnv);

    const server = new McpServer({
        name: "lnfi-mcp-service",
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
        "Lnfi List a new listing market order. Need to call LnfiTokenApprove first to authorize amount*price SATS, approveTo set to MARKET_ROBOT_ADDR",
        {
            side: z.string(),
            amount: z.number(),
            price: z.string(),
            buyOrSellTokenName: z.string(),
            payTokenName: z.string().describe("Must always be SATS")
        },
        async ({ side, amount, price, buyOrSellTokenName, payTokenName }) => {
            if(payTokenName !== "SATS") {
                payTokenName = "SATS";
            }
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
        "Lnfi takes an existing market order. STEPS: 1) Call LnfiMarketsGetOrderListing to find orders and get price details. 2) Call LnfiTokenApprove with these rules: - If you want to BUY a token (taking a SELL order): authorize tokenName='SATS', amount=price*quantity in SATS, approveTo='MARKET_ROBOT_ADDR' - If you want to SELL a token (taking a BUY order): authorize tokenName=the actual token name you're selling, amount=quantity, approveTo='MARKET_ROBOT_ADDR'. 3) Call this function with orderId.",
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
        "Lnfi Approve token spending. Before using this, first call LnfiTokenApiGetBalance to check the balance, and then call LnfiTokenApiGetAllowance to check the allowance.",
        {
            tokenName: z.string().describe("Always SATS when buying; for selling use the actual tokenName"),
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
        "Lnfi Deposit tokens. Will generate an invoice address, which can be used to deposit tokens.",
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
        "Lnfi Withdraw tokens. Before using this, first call LnfiTokenDecodeInvoice to get the amount. LnfiTokenApprove to authorize the amount. approveTo set to TOKEN_ROBOT_ADDR",
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

    server.tool(
        "LnfiTokenDecodeInvoice",
        "Lnfi Decode invoice to get the amount",
        {
            invoice: z.string()
        },
        async ({ invoice }) => {
            const result = await lnfisdk.token.decodeInvoice(invoice);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    // Asset tools
    server.tool(
        "LnfiTokenApiGetBalance",
        "Lnfi Get asset balance",
        { user: z.string().optional().describe("User address (optional, defaults to query self)") },
        async ({ user }) => {
            const result = await lnfisdk.tokenApi.getBalance(user);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiTokenApiGetTokenList",
        "Lnfi Get token list",
        {},
        async () => {
            const result = await lnfisdk.tokenApi.getTokenList();
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiTokenApiGetAllowance",
        "Lnfi Get token allowance. amountShow result in sats.",
        {
            token: z.string(),
            owner: z.string().optional().describe("User address (optional, defaults empty to query self)"),
            spender: z.string().describe("MARKET_ROBOT_ADDR or TOKEN_ROBOT_ADDR (fixed strings), or a nostrAddress (e.g. npub...)")
        },
        async ({ token, owner, spender }) => {
            let spenderTemp =  spender;
            if (spender.toUpperCase() === "MARKET_ROBOT_ADDR") {
                const config = await lnfisdk.getConfig();
                spenderTemp = config.MARKET_ROBOT_ADDR;
            }
            if (spender.toUpperCase() === "TOKEN_ROBOT_ADDR") {
                const config = await lnfisdk.getConfig();
                spenderTemp = config.TOKEN_ROBOT_ADDR;
            }


            const result = await lnfisdk.tokenApi.getAllowance(token, owner, spenderTemp);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiTokenApiGetFundingRecords",
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
            const result = await lnfisdk.tokenApi.getFundingRecords(params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiTokenApiGetTokenEvents",
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
            const result = await lnfisdk.tokenApi.getTokenEvents(params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiTokenApiGetHolders",
        "Lnfi Get token holders",
        {
            assetId: z.string(),
            owner: z.string().optional(),
            page: z.number().optional(),
            count: z.number().optional()
        },
        async (params) => {
            const result = await lnfisdk.tokenApi.getHolders(params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiTokenApiGetHolder",
        "Lnfi Get holder info",
        {
            assetId: z.string(),
            owner: z.string().optional()
        },
        async ({ assetId, owner }) => {
            const result = await lnfisdk.tokenApi.getHolder(assetId, owner);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiTokenApiGetHolderSummary",
        "Lnfi Get holder summary",
        { assetId: z.string() },
        async ({ assetId }) => {
            const result = await lnfisdk.tokenApi.getHolderSummary(assetId);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "LnfiTokenApiGetPayeeList",
        "Lnfi Get payee list",
        {},
        async () => {
            const result = await lnfisdk.tokenApi.getPayeeList();
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );


    // Market API tools
    server.tool(
        "LnfiMarketsGetTokenList",
        "Lnfi Get market token list (including the latest deal price in the `dealPrice` field)",
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
            page: z.number().optional().describe("Page number, starting from 1"),
            count: z.number().optional().describe("The number of results to return. Default is 10 if not provided"),
            token: z.string().optional().describe("TokenName(optional, if not provided, pass empty)"),
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





async function main() {
    let privateKey = process.env.LNFI_PRIVATE_KEY;
    let env = process.env.LNFI_ENV;
    let relay = process.env.LNFI_RELAY;
    let baseURL = process.env.LNFI_BASE_URL;
    if (!privateKey) {
        console.error("Please provide private key as environment variable");
        process.exit(1);
    }

    const server = await getLnfiMcpServer({privateKey, env, relay, baseURL}).catch((error) => {
        console.error("Fatal error in main():", error);
        process.exit(1);
    });
    return server;
}

main();