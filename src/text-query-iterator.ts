/*
** This module iterates over text data sources outputing blocks of
** parsed text with similarity score above threshold.
**
** each .next() call returns next text block, higher similarity comes first
*/

import { SemanticSearchResultBlock } from "./interfaces/semantic-search-text";
import { TextResourceSearchFunction, TextResourceSearchResult } from "./interfaces/text-resource.interface";
import getSemanticSearch, { SemanticSearch } from "./semantic-text-search";

const MAX_RESOURCE_COUNT = 10;

export class TextQueryIterator implements Iterator<string> {

  private semanticSearch: SemanticSearch;

  private currentIndex: number;

  private resources: TextResourceSearchResult[] = [];
  private searchBlocks: SemanticSearchResultBlock[] = [];

  constructor(
    private searchFn: TextResourceSearchFunction,
    private threshold: number,
    private maxCharsPerBlock: number,
    private query: string) {
  }

  async init() {
    this.resources = await this.searchFn(this.query, MAX_RESOURCE_COUNT);
    this.semanticSearch = await getSemanticSearch();
    for (const r of this.resources) {
      const blocks = await this.semanticSearch.getRelevantBlocks(
        r.text,
        this.query,
        this.maxCharsPerBlock,
        this.threshold
      );
      this.searchBlocks = this.searchBlocks.concat(blocks);
    }
    this.searchBlocks.sort((a, b) => b.score - a.score);
    this.currentIndex = 0;
  }

  next(): IteratorResult<string> {
    if (this.currentIndex < this.searchBlocks.length) {
      const value = this.searchBlocks[this.currentIndex++].text;
      return { value, done: false };
    } else {
      return { value: null, done: true };
    }
  }

}