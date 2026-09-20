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
const MAX_CACHE_SIZE = 100;

// Fast BM25 / TF-IDF relevance scorer
function calculateSimilarityScore(query: string, chunk: RAGChunk): number {
  const queryTokens = query.toLowerCase().split(/\W+/).filter(t => t.length > 2);
  if (queryTokens.length === 0) return 1;

  const targetText = `${chunk.title} ${chunk.summary} ${chunk.metadata.topic} ${chunk.metadata.pattern} ${chunk.metadata.principle} ${chunk.metadata.useCase} ${chunk.content}`.toLowerCase();

  let matchCount = 0;
  let exactMatchBonus = 0;

  for (const token of queryTokens) {
    const reg = new RegExp(`\\b${token}\\b`, "g");
    const occurrences = (targetText.match(reg) || []).length;
    if (occurrences > 0) {
      matchCount += occurrences;
      if (chunk.title.toLowerCase().includes(token) || chunk.metadata.topic.toLowerCase().includes(token)) {
        exactMatchBonus += 15;
      }
    }
  }

  const priorityBonus = (6 - chunk.metadata.priority) * 2;
  return (matchCount * 5) + exactMatchBonus + priorityBonus;
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
