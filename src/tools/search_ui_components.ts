import { COMPONENTS_CATALOG } from "../database/components_index.js";

export function handleSearchUiComponents(args: { query?: string; category?: string; tag?: string }) {
  const { query, category, tag } = args;

  let items = Object.values(COMPONENTS_CATALOG);

  if (category) {
    items = items.filter((item) => item.category === category);
  }

  if (tag) {
    const t = tag.toLowerCase();
    items = items.filter((item) => item.tags.some((tagItem) => tagItem.toLowerCase() === t));
  }

  if (query) {
    const q = query.toLowerCase();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            count: items.length,
            components: items.map(({ slug, name, category, description, author, registryUrl, tags, dependencies }) => ({
              slug,
              name,
              category,
              description,
              author,
              registryUrl,
              tags,
              dependencies,
              installCommand: `npx shadcn@latest add "${registryUrl}"`
            }))
          },
          null,
          2
        )
      }
    ]
  };
}
