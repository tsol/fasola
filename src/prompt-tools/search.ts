import { PromptTool, answer, error, nextPrompt } from "../interfaces/tool";

import { TextQueryIterator } from '../services/text-query-iterator';
import { fromGoogle } from '../services/search-google';
import { stringActionParser } from "../core/action-parser-string";

export default class ToolSearch implements PromptTool {

  name = 'SEARCH';
  useWhen = 'when you need to find information in internet';
  prompt = `
  Assistant is a large language model trained by OpenAI.
  
  TOOLS
  ------
  Assistant can ask the user to use tools to look up information that may be helpful in answering the
  users original question. The tools the human can use are:
  
  1. "SEARCH" use to find any information in internet.
  
  RESPONSE FORMAT INSTRUCTIONS
  ----------------------------
  
  When responding to me, please output a response in one of two formats:
  
  **Option #1:**
  Use this if you want the human to use SEARCH tool.
  *ACTION: SEARCH "text you need to find"
  
  **Option #2:**
  Use this if you want to respond directly to the human.
  *ACTION: ANSWER "your answer"
  
  If you know the answer to the question, you can respond directly to the human. If you do not know the answer, you can ask the human to use SEARCH tool.
  
  EXAMPLE
  --------
  
  ### Human: When Jason Booba was born?
  
  ### Assistant:
  
  *THOUGHT: I need to search information about person Jason Booba and find out when he was born and reply with a date.
  *ACTION: SEARCH "Jason Booba was born"
  
  ### Human:
  *OBSERVATION:
  Jasom Gimmek was born pale like an ant and never seen boobs.
  
  ### Assistant:
  *THOUGHT: Observation has no mentioning of Jason Booba or his birth date. I Need to seach MORE information.
  *ACTION: SEARCH "Jason Booba was born"
  
  ### Human:
  *OBSERVATION:
  Jason Booba is a man who has lived an adventurous life full of twists and turns. From an early age, he displayed a keen sense of curiosity and a thirst for knowledge that would stay with him throughout his life. As a young man, he traveled extensively, exploring different cultures and learning from the people he met along the way.
  
  ### Assistant:
  *THOUGHT: There is no information about the birth date of Jason Booba. I cant answer the question yet. Need to seach next block of text.
  *ACTION: SEARCH "Jason Booba's birth date"
  
  ### Human:
  *OBSERVATION:
  In his early years, Jason Booba showed a keen interest in music and began playing the guitar at the age of 12. He was born 1 of april 1954 in a small vilage near Brooklyn.   He spent much of his youth performing at local talent shows and honing his skills as a musician. By the time he was in his early twenties, Jason had formed his own band and began playing gigs at various clubs and venues in and around New York City.
  
  ### Assistant:
  *THOUGHT: I know the answer he was born 1 of april 1954.
  *ACTION: ANSWER "1 of april 1954"
  
  ### Human: {{query}}
  `;

  nextPrompt = `
  ### Human:
  *OBSERVATION:
  {{actionResult}}

  ### Assistant:
  *THOUGHT: If i know the answer to the question "{{query}}" then i need to *ANSWER it. If observation is unclear i need to *SEARCH more.
  `;

  modelName = 'ggml-vic13b-q5_1';
  modelParams = '--temp 0.8 -c 4096';

  actionParser = stringActionParser;
  actionExecutor = this.searchActionExecutor;

  searchQuery: TextQueryIterator | null = null;

  async searchActionExecutor(action: string, param: string) {

    if (action === 'ANSWER') return answer(param);
    if (action === 'SEARCH') {
  
      if (!this.searchQuery) {
        this.searchQuery = new TextQueryIterator(fromGoogle, 0.3, 1024, param);
        await this.searchQuery.init();
      }
  
      const nextSearch = this.searchQuery.next();
  
      if (nextSearch && nextSearch.value.length > 0) {
        return nextPrompt(this.nextPrompt, nextSearch.value);
      }
  
      return error('No more search results');
    }
  
    return error('Unknown action: ' + action);
  
  }
  

}

