import { StopActionParser } from "../core/llm-process";

export interface GeneralTool {
  name: string;
  useWhen: string;
}

export interface PromptTool extends GeneralTool {

  prompt: string;
  
  // examples: string[];
  modelName: string | null;
  modelParams: string | null;

  actionParser: StopActionParser;
  actionExecutor: (action: string, param: string) => Promise<ToolExecutorResult>;

}

export interface ToolExecutorResult {
  errorText: string | null;
  actionResult: string | null;
  nextPrompt: string | null;
}

export const answer = (answer: string): ToolExecutorResult => ({
  actionResult: answer,
  nextPrompt: null,
  errorText: null,
});

export const error = (error: string): ToolExecutorResult => ({
  errorText: error,
  actionResult: null,
  nextPrompt: null,
});

export const nextPrompt = (prompt: string, actionResult: string): ToolExecutorResult => ({
  actionResult,
  errorText: null,
  nextPrompt: prompt,
});
