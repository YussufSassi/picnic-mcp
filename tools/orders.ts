import { getPicnicClient } from "../lib/picnic.js";
import { z } from "zod";

export const getOrderStatusTool = {
  name: "get_picnic_order_status",
  schema: { orderId: z.string() },
  handler: async ({ orderId }: { orderId: string }) => {
    const picnicClient = await getPicnicClient();
    const status = await picnicClient.getOrderStatus(orderId);

    return {
      content: [
        {
          type: "text" as const,
          text: `Order ${orderId} - Checkout status: ${status.checkout_status}`,
        },
      ],
    };
  },
};

