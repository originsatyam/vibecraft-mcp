import { IA_BLUEPRINTS } from "../database/ia_patterns.js";

export function handleGetLayoutBlueprint(args: { type?: string; id?: string }) {
  const { type, id } = args;

  if (id && IA_BLUEPRINTS[id]) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ blueprint: IA_BLUEPRINTS[id] }, null, 2)
        }
      ]
    };
  }

  let blueprints = Object.values(IA_BLUEPRINTS);
  if (type) {
    blueprints = blueprints.filter((b) => b.type === type);
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            count: blueprints.length,
            blueprints: blueprints.map(({ id, title, type, nngPrinciples, structureDescription, layoutHierarchy, codeScaffold }) => ({
              id,
              title,
              type,
              nngPrinciples,
              structureDescription,
              layoutHierarchy,
              codeScaffold
            }))
          },
          null,
          2
        )
      }
    ]
  };
}
