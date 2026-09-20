import { searchRAGKnowledge, RAGQueryOptions } from "../database/rag_engine.js";

export function handleQueryRagKnowledge(args: RAGQueryOptions) {
  const { query, category, topic, useCase, platform, pipelineStage, limit } = args;

  const results = searchRAGKnowledge({
    query: query || "",
    category,
    topic,
    useCase,
    platform,
    pipelineStage,
    limit: limit || 4
  });

  const formattedResults = results.map(r => ({
    id: r.chunk.id,
    title: r.chunk.title,
    relevanceScore: r.relevanceScore,
    pipelineStage: r.matchedPipelineStage,
    metadata: r.chunk.metadata,
    summary: r.chunk.summary,
    content: r.chunk.content
  }));

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            retrievalMethod: "RAG Semantic Retrieval + Metadata Filter + BM25 Relevance Ranking",
            queryOptions: args,
            returnedChunksCount: results.length,
            chunks: formattedResults
          },
          null,
          2
        )
      }
    ]
  };
}
