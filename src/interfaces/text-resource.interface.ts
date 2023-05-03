export interface TextResourceSearchResult {
  resource: string;
  text: string;
}

export interface TextResourceSearchFunction {
  (query: string, maxResources?: number): Promise<TextResourceSearchResult[]>;
}