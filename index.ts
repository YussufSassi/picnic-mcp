import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { searchProductsTool, getSuggestionsTool } from "./tools/search.js";
import {
  getArticleTool,
  getCategoriesTool,
  getListsTool,
  getListTool,
} from "./tools/products.js";
import {
  getShoppingCartTool,
  addProductToCartTool,
  removeProductFromCartTool,
  clearShoppingCartTool,
} from "./tools/cart.js";
import {
  getDeliverySlotsTool,
  setDeliverySlotTool,
  getDeliveriesTool,
  getDeliveryTool,
  getDeliveryPositionTool,
  getDeliveryScenarioTool,
  cancelDeliveryTool,
  setDeliveryRatingTool,
  sendDeliveryInvoiceEmailTool,
} from "./tools/delivery.js";
import { getOrderStatusTool } from "./tools/orders.js";
import {
  getUserDetailsTool,
  getUserInfoTool,
  getProfileMenuTool,
  getMgmDetailsTool,
  getConsentSettingsTool,
  setConsentSettingsTool,
  getCustomerServiceContactInfoTool,
} from "./tools/user.js";
import {
  getPaymentProfileTool,
  getWalletTransactionsTool,
  getWalletTransactionDetailsTool,
} from "./tools/payment.js";

async function main() {
  const mcpServer = new McpServer({
    name: "Picnic",
    version: "1.0.0",
  });

  const allTools = [
    searchProductsTool,
    getSuggestionsTool,
    getArticleTool,
    getCategoriesTool,
    getListsTool,
    getListTool,
    getShoppingCartTool,
    addProductToCartTool,
    removeProductFromCartTool,
    clearShoppingCartTool,
    getDeliverySlotsTool,
    setDeliverySlotTool,
    getDeliveriesTool,
    getDeliveryTool,
    getDeliveryPositionTool,
    getDeliveryScenarioTool,
    cancelDeliveryTool,
    setDeliveryRatingTool,
    sendDeliveryInvoiceEmailTool,
    getOrderStatusTool,
    getUserDetailsTool,
    getUserInfoTool,
    getProfileMenuTool,
    getMgmDetailsTool,
    getConsentSettingsTool,
    setConsentSettingsTool,
    getCustomerServiceContactInfoTool,
    getPaymentProfileTool,
    getWalletTransactionsTool,
    getWalletTransactionDetailsTool,
  ];

  allTools.forEach((tool) => {
    mcpServer.tool(tool.name, tool.schema, tool.handler);
  });

  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
}

main();
