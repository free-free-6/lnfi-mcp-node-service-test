import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
    createLnfiApi,
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

    // Market tools
    server.tool(
        "marketListOrder",
        "List a new market order",
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
        "marketTakeOrder",
        "Take an existing market order",
        { orderId: z.string() },
        async ({ orderId }) => {
            const result = await lnfisdk.market.takeOrder(orderId);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "marketCancelOrder",
        "Cancel a market order",
        { orderId: z.string() },
        async ({ orderId }) => {
            const result = await lnfisdk.market.cancelOrder(orderId);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "marketRepairOrder",
        "Repair a market order",
        { orderId: z.string() },
        async ({ orderId }) => {
            const result = await lnfisdk.market.repairOrder(orderId);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    // Token tools
    server.tool(
        "tokenApprove",
        "Approve token spending",
        {
            tokenName: z.string(),
            amount: z.number(),
            approveTo: z.string()
        },
        async ({ tokenName, amount, approveTo }) => {
            const result = await lnfisdk.token.approve({
                tokenName,
                amount,
                approveTo
            });
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "tokenTransfer",
        "Transfer tokens",
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
        "tokenAddAddressBook",
        "Add address to address book",
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
        "tokenDeposit",
        "Deposit tokens",
        {
            amount: z.number(),
            to: z.string()
        },
        async ({ amount, to }) => {
            const result = await lnfisdk.token.deposit({
                amount,
                to
            });
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "tokenWithdraw",
        "Withdraw tokens",
        {
            invoice: z.string()
        },
        async ({ invoice }) => {
            const result = await lnfisdk.token.withdraw({
                invoice
            });
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    // Asset tools
    server.tool(
        "assetGetBalance",
        "Get asset balance",
        { user: z.string().optional() },
        async ({ user }) => {
            const result = await lnfisdk.asset.getBalance(user);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "assetGetTokenList",
        "Get token list",
        {},
        async () => {
            const result = await lnfisdk.asset.getTokenList();
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "assetGetAllowance",
        "Get token allowance",
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
        "assetGetFundingRecords",
        "Get funding records",
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
        "assetGetTokenEvents",
        "Get token events",
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
        "assetGetHolders",
        "Get token holders",
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
        "assetGetHolder",
        "Get holder info",
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
        "assetGetHolderSummary",
        "Get holder summary",
        { assetId: z.string() },
        async ({ assetId }) => {
            const result = await lnfisdk.asset.getHolderSummary(assetId);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "assetGetPayeeList",
        "Get payee list",
        {},
        async () => {
            const result = await lnfisdk.asset.getPayeeList();
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );


    // Market API tools
    server.tool(
        "marketsGetTokenList",
        "Get market token list",
        {},
        async () => {
            const result = await lnfisdk.marketApi.getMarketTokenList();
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "marketsGetOrderListing",
        "Get market order listing",
        {
            page: z.number().optional(),
            count: z.number().optional(),
            token: z.string().optional(),
            type: z.string().optional()
        },
        async (params) => {
            const result = await lnfisdk.marketApi.getMarketOrderListing(params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "marketsGetOrderHistory",
        "Get order history",
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
        "marketsGetMyOrder",
        "Get my market orders",
        {
            count: z.number().optional(),
            page: z.number().optional(),
            type: z.string().optional(),
            token: z.string().optional(),
            status: z.string().optional(),
            owner: z.string().optional()
        },
        async (params) => {
            const result = await lnfisdk.marketApi.getMarketMyOrder(params);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
    );

    server.tool(
        "marketsGetKline",
        "Get market Kline data",
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
        "lockGetLockList",
        "Get lock list",
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

getMcpLnfiServer({}).catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});

