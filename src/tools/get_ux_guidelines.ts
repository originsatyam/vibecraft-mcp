import { UX_RULES_DATABASE } from "../database/hig_rules.js";

export function handleGetUxGuidelines(args: { topic?: string; category?: string }) {
  const { topic, category } = args;

  let rules = Object.values(UX_RULES_DATABASE);

  if (category) {
    rules = rules.filter((r) => r.category === category);
  }

  if (topic) {
    const q = topic.toLowerCase();
    rules = rules.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.keyPrinciples.some((p) => p.toLowerCase().includes(q))
    );
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            count: rules.length,
            guidelines: rules
          },
          null,
          2
        )
      }
    ]
  };
}
