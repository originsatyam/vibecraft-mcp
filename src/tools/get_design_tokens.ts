import { DESIGN_TOKENS } from "../database/tokens.js";

export function handleGetDesignTokens(args: { category?: string }) {
  const { category } = args;

  if (category && DESIGN_TOKENS[category]) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ category, group: DESIGN_TOKENS[category] }, null, 2)
        }
      ]
    };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ availableCategories: Object.keys(DESIGN_TOKENS), tokens: DESIGN_TOKENS }, null, 2)
      }
    ]
  };
}
