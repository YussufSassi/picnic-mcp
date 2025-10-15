import { getPicnicClient } from "../lib/picnic.js";
import type { SearchResult } from "picnic-api/lib/types/picnic-api.js";
import { z } from "zod";

export const searchProductsTool = {
  name: "search_picnic_products" as const,
  schema: { query: z.string() },
  handler: async ({ query }: { query: string }) => {
    const picnicClient = await getPicnicClient();
    const results = await picnicClient.search(query);

    const productsAsText = `
# Found the following products:
${results.map(
  (product: SearchResult) =>
    `\n### Name: ${product.name}\n- Product ID: ${product.id}\n- Price: ${
      parseInt(product.display_price) / 100
    }€\n- Availability: ${
      product.unit_quantity
    }\n- Max quantity per purchase: ${product.max_count}`,
)}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: productsAsText,
        },
      ],
    };
  },
};

export const getSuggestionsTool = {
  name: "get_picnic_suggestions" as const,
  schema: { query: z.string() },
  handler: async ({ query }: { query: string }) => {
    const picnicClient = await getPicnicClient();
    const suggestions = await picnicClient.getSuggestions(query);

    const suggestionsText = `
# Product suggestions for "${query}":
${suggestions.map((suggestion) => `\n- ${suggestion.suggestion}`).join("")}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: suggestionsText,
        },
      ],
    };
  },
};
