# Step 4: UI Pattern, Component & Composition Knowledge Base

This directory contains the **Step 4 UI Pattern Knowledge Base** extracted from [21st.dev](https://21st.dev/) and the [`serafimcloud/21st`](https://github.com/serafimcloud/21st) ecosystem.

## Separation of Concerns
- **UI Knowledge (This Layer)**: Represents *how real components, layouts, and compositions are constructed* in React, Tailwind, and shadcn/ui.
- **UX Knowledge (Step 2 / Step 3)**: Represents *authoritative UX guidelines, laws, and deterministic rules* (Apple HIG, Laws of UX).

## Directory Structure
- `source.json`: Provenance metadata for 21st.dev ecosystem.
- `components/`: Extracted component structures, props, variants, and interaction states.
- `patterns/`: Recurring UI composition patterns (heroes, bento grids, comparison sliders).
- `tokens/observed_tokens.json`: Observed Tailwind spacing, border radii, and motion curves.
- `dependencies/dependency_graph.json`: React, Radix UI, Framer Motion, Lucide dependencies.
- `relationships/ux_rule_mappings.json`: Cross-source validation mapping UI implementations against Step 3 deterministic rules.
