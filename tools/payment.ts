import { getPicnicClient } from "../lib/picnic.js";
import { z } from "zod";

export const getPaymentProfileTool = {
  name: "get_picnic_payment_profile",
  schema: {},
  handler: async () => {
    const picnicClient = await getPicnicClient();
    const profile = await picnicClient.getPaymentProfile();

    const profileText = `
# Payment Profile

## Payment Methods
${profile.payment_methods
  .map(
    (method) =>
      `\n### ${method.display_name}\n- Payment method: ${method.payment_method}\n- Visibility: ${method.visibility}${method.visibility_reason ? `\n- Visibility reason: ${method.visibility_reason}` : ""}\n- Brands: ${method.brands.map((b) => b.display_name).join(", ")}`,
  )
  .join("\n")}

## Stored Payment Options
${profile.stored_payment_options
  .map(
    (option) =>
      `\n### ${option.display_name}\n- ID: ${option.id}\n- Brand: ${option.brand}\n- Payment method: ${option.payment_method}${option.account ? `\n- Account: ${option.account}` : ""}`,
  )
  .join("\n")}

## Preferred Payment Option
- ID: ${profile.preferred_payment_option_id}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: profileText,
        },
      ],
    };
  },
};

export const getWalletTransactionsTool = {
  name: "get_picnic_wallet_transactions",
  schema: { pageNumber: z.number().default(0) },
  handler: async ({ pageNumber }: { pageNumber: number }) => {
    const picnicClient = await getPicnicClient();
    const transactions = await picnicClient.getWalletTransactions(pageNumber);

    const transactionsText = `
# Wallet Transactions (Page ${pageNumber})

${transactions
  .map(
    (transaction) =>
      `\n## Transaction ${transaction.id}\n- Amount: ${transaction.amount_in_cents / 100}€\n- Status: ${transaction.status}\n- Type: ${transaction.transaction_type}\n- Method: ${transaction.transaction_method}\n- Brand: ${transaction.brand}\n- Display name: ${transaction.display_name}\n- Timestamp: ${new Date(transaction.timestamp * 1000).toLocaleString()}`,
  )
  .join("\n")}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: transactionsText,
        },
      ],
    };
  },
};

export const getWalletTransactionDetailsTool = {
  name: "get_picnic_wallet_transaction_details",
  schema: { transactionId: z.string() },
  handler: async ({ transactionId }: { transactionId: string }) => {
    const picnicClient = await getPicnicClient();
    const details = await picnicClient.getWalletTransactionDetails(transactionId);

    const detailsText = `
# Wallet Transaction Details

- Delivery ID: ${details.delivery_id}

## Shop Items
${details.shop_items
  .map(
    (item) =>
      `\n### ${item.id}\n- Display price: ${item.display_price / 100}€\n- Price: ${item.price / 100}€\n- Items: ${item.items.length}`,
  )
  .join("\n")}

${details.deposits.length > 0 ? `\n## Deposits\n${details.deposits.map((deposit) => `- Type: ${deposit.type}, Count: ${deposit.count}, Value: ${deposit.value / 100}€`).join("\n")}` : ""}

${details.returned_containers.length > 0 ? `\n## Returned Containers\n${details.returned_containers.map((container) => `- ${container.localized_name}: ${container.quantity} (${container.price / 100}€)`).join("\n")}` : ""}

${details.refunded_items.length > 0 ? `\n## Refunded Items\n${details.refunded_items.map((item) => `- ${JSON.stringify(item)}`).join("\n")}` : ""}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: detailsText,
        },
      ],
    };
  },
};

