import { LLMProcess } from './llm-process';
import { PromptTool } from '../interfaces/tool';

import Handlebars from 'handlebars';

import dotenv from 'dotenv';
dotenv.config();

const LLM_MODEL_PATH: string = process.env.LLM_MODEL_PATH || './models/{{model}}.bin';
const LLM_MODEL: string = process.env.LLM_MODEL || 'ggml-vic13b-q5_1';
const LLM_PARAM_STRING: string = process.env.LLM_PARAM_STRING || '---temp 0.8 -c 4096';

export async function usePromptTool(toolName: string, param: string) {
  try {
    const tool = await importPromptTool(toolName)

    const model = tool.modelName || LLM_MODEL;
    const modelParams = tool.modelParams || LLM_PARAM_STRING;
    const modelPath = LLM_MODEL_PATH.replace('{{model}}', model);

    const llmp = new LLMProcess(modelPath, modelParams);

    process.on('SIGINT', () => {
      console.log('Received SIGINT signal.');
      llmp.close();
      process.exit(0);
    });

    llmp.open();
    console.log('Opened LLM process for tool: ', tool.name);

    const template = Handlebars.compile(tool.prompt);
    const defaultPrompt = template({ query: param });
    let prompt = defaultPrompt;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log(prompt);

      const result = await llmp.prompt(prompt, tool.actionParser);

      console.log('\nPARSED_ACTION:', result);

      if (!result?.action || result?.action === 'TIMEOUT' || typeof result?.action != 'string') {
        throw new Error('Unexpected action: ' + result);
      }

      const execResult = await tool.actionExecutor(result.action, result.param);

      if (execResult.errorText) {
        llmp.close();
        return 'Error using tool: ' + execResult.errorText;
      }

      if (!execResult.nextPrompt) {
        llmp.close();
        return execResult.actionResult;
      }

      const template = Handlebars.compile(execResult.nextPrompt);
      prompt = template({ query: param, actionResult: execResult.actionResult });
    }

  }
  catch (e) {
    console.error(e);
    return 'Using tool failed';
  }

}


async function importPromptTool(moduleName: string): Promise<PromptTool> {
  moduleName = moduleName.toLowerCase();
  const module = await import(`../prompt-tools/${moduleName}`);
  const MyClass = module.default as new () => PromptTool;
  const instance = new MyClass() as PromptTool;
  return instance;
}
