# LnFi MCP Node Service

This is a Node.js service for interacting with the LnFi API.

## Installation

1. Make sure you have Node.js installed (version 16 or higher recommended)
2. Clone this repository
3. Install dependencies:

```bash
npm install
```

## Building the Project

To compile TypeScript files to JavaScript:

```bash
npm run build
```

This will:
1. Compile TypeScript files using `tsc`
2. Make the built files executable

## Usage

After building, you can start the service with:

```bash
npm start
```



## npx
Please replace with your Nostr private key:
xxxxxxxxxxxxxxxxxxxx 

```bash
{
    "mcpServers": {
        "lnfi-mcp-node-service-test": {
            "command": "npx",
            "args": [
                "-y",
                "lnfi-mcp-node-service-test",
                "xxxxxxxxxxxxxxxxxxxx"
            ]
        }
    }
}
```

## Dependencies

- [lnfi-sdk](https://www.npmjs.com/package/lnfi-sdk) - LnFi API client
- [zod](https://www.npmjs.com/package/zod) - TypeScript-first schema validation
- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) - Model Context Protocol SDK
