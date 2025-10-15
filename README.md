> **Note**: This project is not affiliated with, endorsed by, or connected to Picnic in any way. It is an independent, unofficial tool created by the community.

# Picnic MCP Server

An MCP server that provides tools to interact with the Picnic grocery delivery service API.

## Prerequisites

- Node.js
- Picnic account credentials (email and password)
- Picnic service availability in your country (NL or DE)

## Installation

```bash
bun install
bun run build
```

## Configuration

Set the following environment variables:

```bash
export PICNIC_EMAIL="your-email@example.com"
export PICNIC_PASSWORD="your-password"
```

## Usage

The server can be used with any MCP-compatible client. Add it to your MCP client configuration:

```json
{
  "picnic": {
    "command": "node",
    "args": ["/path/to/mcp/build/index.js"],
    "env": {
      "PICNIC_EMAIL": "your-email@example.com",
      "PICNIC_PASSWORD": "your-password"
    }
  }
}
```

## Available Tools (30 total)

### Search & Products

- Search products and get suggestions
- Get product details, categories, and lists

### Shopping Cart

- View, add, remove, and clear cart items

### Delivery Management

- View and select delivery slots
- Track deliveries and view driver routes
- Cancel deliveries and send invoices
- Rate completed deliveries

### Orders & Payment

- Check order status
- View payment methods and wallet transactions

### User & Account

- View user profile and settings
- Get referral details
- Manage consent settings
- Get customer service contact info

## License

MIT
