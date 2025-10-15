import { getPicnicClient } from "../lib/picnic.js";
import { z } from "zod";

export const getArticleTool = {
  name: "get_picnic_article",
  schema: { productId: z.string() },
  handler: async ({ productId }: { productId: string }) => {
    const picnicClient = await getPicnicClient();
    const article = await picnicClient.getArticle(productId);

    const articleText = `
# ${article.name}

## Description
${article.description.main}
${article.description.extension ? `\n${article.description.extension}` : ""}

## Price Information
- Price: ${article.price_info.price / 100}€
${article.price_info.base_price_text ? `- Base price: ${article.price_info.base_price_text}` : ""}
${article.price_info.deposit ? `- Deposit: ${article.price_info.deposit / 100}€` : ""}

## Details
- Unit quantity: ${article.unit_quantity}
- Max order quantity: ${article.max_order_quantity}
- Product ID: ${article.id}

${article.highlights.length > 0 ? `\n## Highlights\n${article.highlights.map(h => `- ${h.text}`).join("\n")}` : ""}

${article.allergies.allergy_contains.length > 0 ? `\n## Allergen Information\n**Contains:** ${article.allergies.allergy_contains.map(a => a.name).join(", ")}` : ""}
${article.allergies.allergy_may_contain.length > 0 ? `\n**May contain:** ${article.allergies.allergy_may_contain.join(", ")}` : ""}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: articleText,
        },
      ],
    };
  },
};

export const getCategoriesTool = {
  name: "get_picnic_categories",
  schema: { depth: z.number().optional().default(0) },
  handler: async ({ depth }: { depth?: number }) => {
    const picnicClient = await getPicnicClient();
    const myStore = await picnicClient.getCategories(depth || 0);

    const categoriesText = `
# Picnic Categories

${myStore.catalog
  .map(
    (category) =>
      `\n## ${category.name}\n- ID: ${category.id}\n- Level: ${category.level}\n- Items: ${category.items.length}`,
  )
  .join("\n")}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: categoriesText,
        },
      ],
    };
  },
};

export const getListsTool = {
  name: "get_picnic_lists",
  schema: { depth: z.number().optional().default(0) },
  handler: async ({ depth }: { depth?: number }) => {
    const picnicClient = await getPicnicClient();
    const lists = await picnicClient.getLists(depth || 0);

    const listsText = `
# Picnic Lists

${lists
  .map(
    (list) =>
      `\n## ${list.name}\n- ID: ${list.id}\n- Level: ${list.level}\n- Sub-items: ${list.items.length}`,
  )
  .join("\n")}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: listsText,
        },
      ],
    };
  },
};

export const getListTool = {
  name: "get_picnic_list",
  schema: {
    listId: z.string(),
    subListId: z.string().optional(),
    depth: z.number().optional().default(0),
  },
  handler: async ({
    listId,
    subListId,
    depth,
  }: {
    listId: string;
    subListId?: string;
    depth?: number;
  }) => {
    const picnicClient = await getPicnicClient();
    const listItems = await picnicClient.getList(listId, subListId, depth || 0);

    const listText = `
# List Items

${listItems.map((item: any) => `\n- ${item.name || item.id} (ID: ${item.id})`).join("")}
`;

    return {
      content: [
        {
          type: "text" as const,
          text: listText,
        },
      ],
    };
  },
};

