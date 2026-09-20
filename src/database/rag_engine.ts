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
}

// Low-memory, high-speed BM25 / TF-IDF relevance scorer
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
      // Title or topic exact match bonus
      if (chunk.title.toLowerCase().includes(token) || chunk.metadata.topic.toLowerCase().includes(token)) {
        exactMatchBonus += 15;
      }
    }
  }

  // Priority weighting (Priority 1 = +10, Priority 5 = +2)
  const priorityBonus = (6 - chunk.metadata.priority) * 2;

  return (matchCount * 5) + exactMatchBonus + priorityBonus;
}

// Pipeline stage order ranking
const PIPELINE_ORDER: Record<string, number> = {
  principles: 1,
  rules: 2,
  patterns: 3,
  calculations: 4,
  validation: 5
};

export function searchRAGKnowledge(options: RAGQueryOptions): RAGSearchResult[] {
  const { query, category, topic, useCase, platform, pipelineStage, limit = 4 } = options;

  let filteredChunks = RAG_KNOWLEDGE_BASE.filter(chunk => {
    if (category && chunk.metadata.category.toLowerCase() !== category.toLowerCase()) return false;
    if (topic && !chunk.metadata.topic.toLowerCase().includes(topic.toLowerCase())) return false;
    if (useCase && !chunk.metadata.useCase.toLowerCase().includes(useCase.toLowerCase())) return false;
    if (platform && chunk.metadata.platform !== "cross-platform" && chunk.metadata.platform.toLowerCase() !== platform.toLowerCase()) return false;
    if (pipelineStage && chunk.metadata.pipelineStage.toLowerCase() !== pipelineStage.toLowerCase()) return false;
    return true;
  });

  const scoredResults: RAGSearchResult[] = filteredChunks.map(chunk => ({
    chunk,
    relevanceScore: calculateSimilarityScore(query, chunk),
    matchedPipelineStage: chunk.metadata.pipelineStage
  }));

  // Sort primarily by relevanceScore descending, secondarily by pipelineStage ascending
  scoredResults.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    return (PIPELINE_ORDER[a.matchedPipelineStage] || 99) - (PIPELINE_ORDER[b.matchedPipelineStage] || 99);
  });

  return scoredResults.slice(0, Math.min(limit, 10));
}
