/*
** This is semantic search module. It uses sentence-transformers/all-MiniLM-L6-v2 model to
** calculate cosine similarity between query and text blocks. It returns blocks with
** similarity score above threshold.
**
*/

import pkg from '@xenova/transformers';
import { SemanticSearchResultBlock } from './interfaces/semantic-search-text';

const { pipeline, env } = pkg;

env.remoteModels = false;
env.localURL = './models/';


function calculateCosineSimilarity(queryEmbedding, textEmbedding) {
  let dotProduct = 0;
  let queryMagnitude = 0;
  let embeddingMagnitude = 0;
  for (let i = 0; i < queryEmbedding.length; i++) {
      dotProduct += queryEmbedding[i] * textEmbedding[i];
      queryMagnitude += queryEmbedding[i] ** 2;
      embeddingMagnitude += textEmbedding[i] ** 2;
  }
  return dotProduct / (Math.sqrt(queryMagnitude) * Math.sqrt(embeddingMagnitude));
}

function splitStringIntoBlocks(str : string, blockSize : number) {
  const result: string[] = [];

  const words = str.split(/\s+/);
  let block = '';

  while (words.length > 0) {
    if (block.length > 0) { block += ' '; }
    block += words.shift();
    if (block.length >= blockSize) {
      result.push(block);
      block = '';
    }
  }

  return result;
}


export class SemanticSearch {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any = null;

  async init() {
    this.model = await pipeline("embeddings","sentence-transformers/all-MiniLM-L6-v2");
  }

  async getRelevantBlocks(text: string, query: string, blockSizeInChars: number, threshold = 0.7) {
    const queryEmbedding = await this.model(query);
  
    const blocks = splitStringIntoBlocks(text, blockSizeInChars);
    
    const scores: SemanticSearchResultBlock[] = await Promise.all(blocks.map(async (block) => {
      const textEmbeddings = await this.model(block);
      const score = calculateCosineSimilarity(textEmbeddings.data, queryEmbedding.data);
      return { text: block, score }
    }));
  
    return scores
      .filter((s) => s.score > threshold)
      .sort((a, b) => b.score - a.score);
  
  }
  


}

let semanticSearch: SemanticSearch | null = null;

export default async function getSemanticSearch() {
  if (! semanticSearch) {
    semanticSearch = new SemanticSearch();
    await semanticSearch.init();
  }
  return semanticSearch;
}



