import { getPicnicClient } from "../lib/picnic.js";
import { z } from "zod";

export const getDeliverySlotsTool = {
  name: "get_picnic_delivery_slots",
  schema: {},
  handler: async () => {
    const picnicClient = await getPicnicClient();
    const result = await picnicClient.getDeliverySlots();

    const slotsText = `
# Available Delivery Slots

${result.delivery_slots
  .map(
    (slot) =>
      `\n## ${slot.window_start} - ${slot.window_end}\n- Slot ID: ${slot.slot_id}\n- Available: ${slot.is_available ? "Yes" : "No"}\n- Selected: ${slot.selected ? "Yes" : "No"}\n- Reserved: ${slot.reserved ? "Yes" : "No"}\n- Minimum order value: ${slot.minimum_order_value / 100}€\n- Cut off time: ${slot.cut_off_time}${slot.unavailability_reason ? `\n- Unavailability reason: ${slot.unavailability_reason}` : ""}`,
  )
  .join("\n")}

${result.selected_slot.slot_id ? `\n## Currently Selected Slot\n- Slot ID: ${result.selected_slot.slot_id}\n- State: ${result.selected_slot.state}` : ""}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: slotsText,
        },
      ],
    };
  },
};

export const setDeliverySlotTool = {
  name: "set_picnic_delivery_slot",
  schema: { slotId: z.string() },
  handler: async ({ slotId }: { slotId: string }) => {
    const picnicClient = await getPicnicClient();
    const cart = await picnicClient.setDeliverySlot(slotId);

    return {
      content: [
        {
          type: "text" as const,
          text: `Delivery slot set successfully. Selected slot ID: ${cart.selected_slot.slot_id}`,
        },
      ],
    };
  },
};

export const getDeliveriesTool = {
  name: "get_picnic_deliveries",
  schema: {
    filter: z.array(z.string()).optional(),
  },
  handler: async ({ filter }: { filter?: string[] }) => {
    const picnicClient = await getPicnicClient();
    const deliveries = await picnicClient.getDeliveries(filter as any);

    const deliveriesText = `
# Deliveries

${deliveries
  .map(
    (delivery) =>
      `\n## Delivery ${delivery.delivery_id}\n- ID: ${delivery.id}\n- Status: ${delivery.status}\n- Creation time: ${delivery.creation_time}\n- Delivery time: ${delivery.delivery_time.start} - ${delivery.delivery_time.end}\n- ETA: ${delivery.eta2.start} - ${delivery.eta2.end}\n- Orders: ${delivery.orders.length}\n- Total price: ${delivery.orders.reduce((sum, order) => sum + order.total_price, 0) / 100}€`,
  )
  .join("\n")}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: deliveriesText,
        },
      ],
    };
  },
};

export const getDeliveryTool = {
  name: "get_picnic_delivery",
  schema: { deliveryId: z.string() },
  handler: async ({ deliveryId }: { deliveryId: string }) => {
    const picnicClient = await getPicnicClient();
    const delivery = await picnicClient.getDelivery(deliveryId);

    const deliveryText = `
# Delivery ${delivery.delivery_id}

## General Information
- ID: ${delivery.id}
- Status: ${delivery.status}
- Creation time: ${delivery.creation_time}
- Delivery time: ${delivery.delivery_time.start} - ${delivery.delivery_time.end}
- ETA: ${delivery.eta2.start} - ${delivery.eta2.end}

## Orders
${delivery.orders
  .map(
    (order) =>
      `\n### Order ${order.id}\n- Total items: ${order.total_count}\n- Total price: ${order.total_price / 100}€\n- Checkout total: ${order.checkout_total_price / 100}€\n- Status: ${order.status}`,
  )
  .join("\n")}

${delivery.returned_containers.length > 0 ? `\n## Returned Containers\n${delivery.returned_containers.map((container) => `- ${container.localized_name}: ${container.quantity} (${container.price / 100}€)`).join("\n")}` : ""}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: deliveryText,
        },
      ],
    };
  },
};

export const getDeliveryPositionTool = {
  name: "get_picnic_delivery_position",
  schema: { deliveryId: z.string() },
  handler: async ({ deliveryId }: { deliveryId: string }) => {
    const picnicClient = await getPicnicClient();
    const position = await picnicClient.getDeliveryPosition(deliveryId);

    return {
      content: [
        {
          type: "text" as const,
          text: `Delivery position - Scenario timestamp: ${position.scenario_ts}`,
        },
      ],
    };
  },
};

export const getDeliveryScenarioTool = {
  name: "get_picnic_delivery_scenario",
  schema: { deliveryId: z.string() },
  handler: async ({ deliveryId }: { deliveryId: string }) => {
    const picnicClient = await getPicnicClient();
    const scenario = await picnicClient.getDeliveryScenario(deliveryId);

    const scenarioText = `
# Delivery Scenario

## Vehicle
- Image: ${scenario.vehicle.image}

## Route (${scenario.scenario.length} points)
${scenario.scenario
  .slice(0, 5)
  .map((point) => `- Timestamp: ${point.ts}, Location: ${point.lat}, ${point.lng}`)
  .join("\n")}
${scenario.scenario.length > 5 ? `\n... and ${scenario.scenario.length - 5} more points` : ""}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: scenarioText,
        },
      ],
    };
  },
};

export const cancelDeliveryTool = {
  name: "cancel_picnic_delivery",
  schema: { deliveryId: z.string() },
  handler: async ({ deliveryId }: { deliveryId: string }) => {
    const picnicClient = await getPicnicClient();
    await picnicClient.cancelDelivery(deliveryId);

    return {
      content: [
        {
          type: "text" as const,
          text: `Delivery ${deliveryId} cancelled successfully.`,
        },
      ],
    };
  },
};

export const setDeliveryRatingTool = {
  name: "set_picnic_delivery_rating",
  schema: {
    deliveryId: z.string(),
    rating: z.number().min(0).max(10),
  },
  handler: async ({ deliveryId, rating }: { deliveryId: string; rating: number }) => {
    const picnicClient = await getPicnicClient();
    const result = await picnicClient.setDeliveryRating(deliveryId, rating);

    return {
      content: [
        {
          type: "text" as const,
          text: `Delivery rating set to ${rating}/10. Result: ${result}`,
        },
      ],
    };
  },
};

export const sendDeliveryInvoiceEmailTool = {
  name: "send_picnic_delivery_invoice_email",
  schema: { deliveryId: z.string() },
  handler: async ({ deliveryId }: { deliveryId: string }) => {
    const picnicClient = await getPicnicClient();
    const result = await picnicClient.sendDeliveryInvoiceEmail(deliveryId);

    return {
      content: [
        {
          type: "text" as const,
          text: `Invoice email sent. Result: ${result}`,
        },
      ],
    };
  },
};

