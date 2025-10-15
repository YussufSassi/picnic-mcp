import { getPicnicClient } from "../lib/picnic.js";
import { z } from "zod";

export const getShoppingCartTool = {
  name: "get_picnic_shopping_cart",
  schema: {},
  handler: async () => {
    const picnicClient = await getPicnicClient();
    const cart = await picnicClient.getShoppingCart();

    const cartText = `
# Shopping Cart

## Summary
- Order ID: ${cart.id}
- Total items: ${cart.total_count}
- Total price: ${cart.total_price / 100}€
- Checkout total: ${cart.checkout_total_price / 100}€
- Total savings: ${cart.total_savings / 100}€
- Total deposit: ${cart.total_deposit / 100}€
- Status: ${cart.status}
- Cancellable: ${cart.cancellable ? "Yes" : "No"}

## Items
${cart.items
  .map(
    (line) =>
      `\n### Order Line ${line.id}\n- Display price: ${line.display_price / 100}€\n- Price: ${line.price / 100}€\n- Products: ${line.items.length}\n${line.items.map((item) => `  - ${item.name} (${item.unit_quantity}) - ${item.price / 100}€`).join("\n")}`,
  )
  .join("\n")}

${cart.selected_slot.slot_id ? `\n## Selected Delivery Slot\n- Slot ID: ${cart.selected_slot.slot_id}\n- State: ${cart.selected_slot.state}` : ""}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: cartText,
        },
      ],
    };
  },
};

export const addProductToCartTool = {
  name: "add_picnic_product_to_cart",
  schema: { productId: z.string(), count: z.number().optional().default(1) },
  handler: async ({ productId, count }: { productId: string; count?: number }) => {
    const picnicClient = await getPicnicClient();
    const cart = await picnicClient.addProductToShoppingCart(productId, count || 1);

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully added ${count || 1} item(s) to cart. Cart status: ${cart.status}`,
        },
      ],
    };
  },
};

export const removeProductFromCartTool = {
  name: "remove_picnic_product_from_cart",
  schema: { productId: z.string(), count: z.number().optional().default(1) },
  handler: async ({ productId, count }: { productId: string; count?: number }) => {
    const picnicClient = await getPicnicClient();
    const cart = await picnicClient.removeProductFromShoppingCart(productId, count || 1);

    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully removed ${count || 1} item(s) from cart. Cart status: ${cart.status}`,
        },
      ],
    };
  },
};

export const clearShoppingCartTool = {
  name: "clear_picnic_shopping_cart",
  schema: {},
  handler: async () => {
    const picnicClient = await getPicnicClient();
    const cart = await picnicClient.clearShoppingCart();

    return {
      content: [
        {
          type: "text" as const,
          text: `Shopping cart cleared successfully. Cart status: ${cart.status}`,
        },
      ],
    };
  },
};

