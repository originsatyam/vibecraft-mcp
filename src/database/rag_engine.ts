import { RAG_KNOWLEDGE_BASE, RAGChunk, RAGChunkMetadata } from "./rag_chunks.js";

export interface RAGQueryOptions {
  query: string;
  category?: string;
  topic?: string;
  useCase?: string;
  platform?: string;
  pipelineStage?: string;
  limit?: number;
}

export interface RAGSearchResult {
  chunk: RAGChunk;
  relevanceScore: number;
  matchedPipelineStage: string;
  cached?: boolean;
}

// In-memory query cache for 0ms ultra-low latency retrieval
const QUERY_CACHE = new Map<string, RAGSearchResult[]>();
const MAX_CACHE_SIZE = 250;

// UI/UX Domain Synonym Expansion Dictionary
const DOMAIN_SYNONYMS: Record<string, string[]> = {
  modal: ["dialog", "popup", "overlay", "radix", "focus trap"],
  dialog: ["modal", "popup", "overlay", "window"],
  button: ["cta", "cva", "action", "trigger", "fitts"],
  cta: ["button", "primary action", "cva"],
  radius: ["corner", "concentric", "rounded", "geometry"],
  corner: ["radius", "rounded", "concentric", "clipping"],
  contrast: ["wcag", "luminance", "accessibility", "a11y", "color"],
  wcag: ["contrast", "luminance", "accessibility", "a11y"],
  figma: ["auto-layout", "frame", "token", "extraction", "node"],
  glass: ["glassmorphism", "backdrop", "blur", "apple", "hig"],
  grid: ["spacing", "padding", "margin", "gap", "4px"],
  aria: ["accessibility", "keyboard", "focus", "screen reader"],
  font: ["typography", "inter", "geist", "sf pro", "helvetica"]
};

// Common Stop Words to Filter Out
const STOP_WORDS = new Set(["the", "and", "is", "for", "with", "how", "what", "should", "using", "when", "that", "this", "can"]);

// Enhanced BM25 / Field-Weighted Relevance Scorer
function calculateSimilarityScore(query: string, chunk: RAGChunk): number {
  const rawTokens = query.toLowerCase().split(/\W+/).filter(t => t.length > 2 && !STOP_WORDS.has(t));
  if (rawTokens.length === 0) return 1;

  // 1. Expand Tokens with Domain Synonyms
  const expandedTokens = new Set<string>(rawTokens);
  for (const token of rawTokens) {
    if (DOMAIN_SYNONYMS[token]) {
      DOMAIN_SYNONYMS[token].forEach(syn => expandedTokens.add(syn));
    }
  }

  const tokenList = Array.from(expandedTokens);
  const titleText = chunk.title.toLowerCase();
  const topicText = chunk.metadata.topic.toLowerCase();
  const principleText = chunk.metadata.principle.toLowerCase();
  const patternText = chunk.metadata.pattern.toLowerCase();
  const summaryText = chunk.summary.toLowerCase();
  const bodyText = chunk.content.toLowerCase();

  let score = 0;

  // 2. Field-Weighted Token Matches
  for (const token of tokenList) {
    const isOriginal = rawTokens.includes(token);
    const weightMultiplier = isOriginal ? 1.0 : 0.6; // Give full weight to exact query terms, subtle weight to synonyms

    if (titleText.includes(token)) score += 25 * weightMultiplier;
    if (topicText.includes(token)) score += 25 * weightMultiplier;
    if (patternText.includes(token)) score += 18 * weightMultiplier;
    if (principleText.includes(token)) score += 15 * weightMultiplier;
    if (summaryText.includes(token)) score += 10 * weightMultiplier;
    if (bodyText.includes(token)) score += 3 * weightMultiplier;
  }

  // 3. Bi-word Phrase Matching (N-gram bonus)
  for (let i = 0; i < rawTokens.length - 1; i++) {
    const phrase = `${rawTokens[i]} ${rawTokens[i + 1]}`;
    if (titleText.includes(phrase) || topicText.includes(phrase)) score += 40;
    else if (patternText.includes(phrase) || principleText.includes(phrase)) score += 25;
  }

  // 4. Priority Weighting (Priority 1 = Critical, gets +10 points)
  const priorityBonus = (6 - chunk.metadata.priority) * 2.5;
  return Math.round((score + priorityBonus) * 10) / 10;
}

const PIPELINE_ORDER: Record<string, number> = {
  principles: 1,
  rules: 2,
  patterns: 3,
  calculations: 4,
  validation: 5
};

export function searchRAGKnowledge(options: RAGQueryOptions): RAGSearchResult[] {
  const { query = "", category, topic, useCase, platform, pipelineStage, limit = 2 } = options;

  // 1. Cache Key Check
  const cacheKey = JSON.stringify({ query: query.trim().toLowerCase(), category, topic, useCase, platform, pipelineStage, limit });
  if (QUERY_CACHE.has(cacheKey)) {
    const cachedResults = QUERY_CACHE.get(cacheKey)!;
    return cachedResults.map(r => ({ ...r, cached: true }));
  }

  // 2. Metadata Filtering
  const filteredChunks = RAG_KNOWLEDGE_BASE.filter(chunk => {
    if (category && chunk.metadata.category.toLowerCase() !== category.toLowerCase()) return false;
    if (topic && !chunk.metadata.topic.toLowerCase().includes(topic.toLowerCase())) return false;
    if (useCase && !chunk.metadata.useCase.toLowerCase().includes(useCase.toLowerCase())) return false;
    if (platform && chunk.metadata.platform !== "cross-platform" && chunk.metadata.platform.toLowerCase() !== platform.toLowerCase()) return false;
    if (pipelineStage && chunk.metadata.pipelineStage.toLowerCase() !== pipelineStage.toLowerCase()) return false;
    return true;
  });

  // 3. Relevance Scoring
  const scoredResults: RAGSearchResult[] = filteredChunks.map(chunk => ({
    chunk,
    relevanceScore: calculateSimilarityScore(query, chunk),
    matchedPipelineStage: chunk.metadata.pipelineStage,
    cached: false
  }));

  // 4. Ranking (Relevance Score DESC, Pipeline Order ASC)
  scoredResults.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    return (PIPELINE_ORDER[a.matchedPipelineStage] || 99) - (PIPELINE_ORDER[b.matchedPipelineStage] || 99);
  });

  // 5. Minimum Chunk Retrieval Pruning (Avoid token bloat)
  let finalResults = scoredResults.slice(0, Math.min(limit, 5));

  // If top result is high-confidence (score >= 30), return minimum required context
  if (finalResults.length > 1 && finalResults[0].relevanceScore >= 30 && finalResults[1].relevanceScore < 15) {
    finalResults = [finalResults[0]];
  }

  // Save to Cache
  if (QUERY_CACHE.size >= MAX_CACHE_SIZE) {
    const firstKey = QUERY_CACHE.keys().next().value;
    if (firstKey) QUERY_CACHE.delete(firstKey);
  }
  QUERY_CACHE.set(cacheKey, finalResults);

  return finalResults;
}

