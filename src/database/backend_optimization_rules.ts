export interface SystemOptimizationRule {
  id: string;
  category: "backend_logic" | "debugging" | "database" | "frontend_perf" | "security" | "network";
  title: string;
  summary: string;
  keyPrinciples: string[];
  codeRefactoringExample: {
    badCode: string;
    goodCode: string;
    explanation: string;
  };
}

export const SYSTEM_OPTIMIZATION_RULES: Record<string, SystemOptimizationRule> = {
  n_plus_one_queries: {
    id: "n_plus_one_queries",
    category: "database",
    title: "N+1 Database Query Elimination",
    summary: "Executing individual queries inside loops causes massive DB latency and connection pool exhaustion.",
    keyPrinciples: [
      "Use ORM eager-loading (Prisma `include`, TypeORM `relations`, Sequelize `include`).",
      "Use SQL `JOIN FETCH` or batching with DataLoader for GraphQL/REST.",
      "Target database query execution times under 50ms."
    ],
    codeRefactoringExample: {
      badCode: `const users = await prisma.user.findMany();
for (const user of users) {
  user.posts = await prisma.post.findMany({ where: { userId: user.id } });
}`,
      goodCode: `const usersWithPosts = await prisma.user.findMany({
  include: {
    posts: { select: { id: true, title: true, createdAt: true } }
  }
});`,
      explanation: "Replaces N+1 sequential database roundtrips with a single batch join query."
    }
  },

  backend_transaction_safety: {
    id: "backend_transaction_safety",
    category: "backend_logic",
    title: "Multi-Step Database Transaction Isolation & Atomicity",
    summary: "Multi-step state updates without explicit database transactions leave orphaned records on partial failure.",
    keyPrinciples: [
      "Wrap multi-table mutations (e.g. payment + order creation) in explicit DB transactions.",
      "Enforce automatic rollback on any thrown error.",
      "Support idempotency keys (`X-Idempotency-Key`) for state-modifying requests."
    ],
    codeRefactoringExample: {
      badCode: `const user = await db.user.create({ data: userData });
const wallet = await db.wallet.create({ data: { userId: user.id, balance: 100 } });
// If wallet creation throws, user is orphaned`,
      goodCode: `const result = await db.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  const wallet = await tx.wallet.create({ data: { userId: user.id, balance: 100 } });
  return { user, wallet };
});`,
      explanation: "Guarantees atomic execution where all operations succeed together or roll back cleanly."
    }
  },

  cursor_pagination: {
    id: "cursor_pagination",
    category: "database",
    title: "Keyset/Cursor Pagination Over Offset Pagination",
    summary: "High `OFFSET` values force full table scans that degrade exponentially as dataset size grows.",
    keyPrinciples: [
      "Use cursor/keyset pagination (`WHERE id > lastId LIMIT 20`) for high-volume datasets.",
      "Ensure sorting columns have compound B-tree index coverage.",
      "Avoid returning unconstrained `SELECT *` payloads; select explicit required fields."
    ],
    codeRefactoringExample: {
      badCode: `// Slow OFFSET query scans 50,000 rows
const items = await db.item.findMany({
  skip: 50000,
  take: 20
});`,
      goodCode: `// Fast Keyset query uses B-Tree index lookup
const items = await db.item.findMany({
  take: 20,
  skip: 1,
  cursor: { id: lastSeenId },
  orderBy: { id: 'asc' }
});`,
      explanation: "Uses indexed cursor lookup instead of scanning 50k rows in memory."
    }
  },

  network_waterfall_elimination: {
    id: "network_waterfall_elimination",
    category: "network",
    title: "Sequential Promise Waterfall Elimination",
    summary: "Awaiting independent async calls sequentially multiplies latency instead of executing in parallel.",
    keyPrinciples: [
      "Combine independent API or DB calls into `Promise.all([a(), b()])`.",
      "Avoid awaiting network requests inside loops or un-dependent code blocks.",
      "Target server response TTFB < 200ms."
    ],
    codeRefactoringExample: {
      badCode: `const user = await fetchUser(userId);
const settings = await fetchSettings(userId);
const notifications = await fetchNotifications(userId);`,
      goodCode: `const [user, settings, notifications] = await Promise.all([
  fetchUser(userId),
  fetchSettings(userId),
  fetchNotifications(userId)
]);`,
      explanation: "Parallelizes 3 network requests, reducing total latency from sum of times to max time of longest call."
    }
  },

  owasp_idor_security: {
    id: "owasp_idor_security",
    category: "security",
    title: "Insecure Direct Object Reference (IDOR) & Ownership Validation",
    summary: "Fetching records solely by URL parameter without user ownership checks allows data breaches.",
    keyPrinciples: [
      "Always check user ownership (`WHERE id = recordId AND tenantId = currentUserId`).",
      "Enforce strict schema validation on body, query, and path parameters.",
      "Redact tokens, passwords, and PII from server logs."
    ],
    codeRefactoringExample: {
      badCode: `app.get('/invoice/:id', async (req, res) => {
  const invoice = await db.invoice.findUnique({ where: { id: req.params.id } });
  res.json(invoice);
});`,
      goodCode: `app.get('/invoice/:id', authMiddleware, async (req, res) => {
  const invoice = await db.invoice.findFirst({
    where: { id: req.params.id, organizationId: req.user.organizationId }
  });
  if (!invoice) return res.status(404).json({ code: "NOT_FOUND", message: "Invoice not found" });
  res.json(invoice);
});`,
      explanation: "Enforces tenant authorization check to prevent cross-account IDOR vulnerabilities."
    }
  },

  frontend_bundle_splitting: {
    id: "frontend_bundle_splitting",
    category: "frontend_perf",
    title: "Route Code Splitting & Dynamic Modal Lazy Loading",
    summary: "Bundling large modal dialogs or chart libraries into the main bundle bloats LCP and TTFB.",
    keyPrinciples: [
      "Use dynamic imports (`next/dynamic` or `React.lazy`) for heavy modal dialogs and charts.",
      "Keep Core Web Vitals LCP < 2.5s and INP < 100ms.",
      "Use WebP/AVIF images with explicit width/height to eliminate Cumulative Layout Shift (CLS)."
    ],
    codeRefactoringExample: {
      badCode: `import { HeavyChart } from './HeavyChart'; // Bundled in main JS chunk

export function Dashboard() {
  return <HeavyChart />;
}`,
      goodCode: `import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton className="h-64 w-full rounded-xl" />,
  ssr: false
});

export function Dashboard() {
  return <HeavyChart />;
}`,
      explanation: "Defer loading of heavy chart library until rendered, reducing initial JS payload size."
    }
  }
};
