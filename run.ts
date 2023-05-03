import { ActionResult, LLMProcess, StopActionParser } from './src/llm-process';
import { TextQueryIterator } from './src/text-query-iterator';
import { fromGoogle } from './src/search-google';

// const llmp = new LLMProcess('wizardLM-7B.ggml.q5_1', '-i --interactive-first --temp 0.8 -c 2048');
const llmp = new LLMProcess('ggml-vic13b-q5_1', '-i --interactive-first --temp 0.8 -c 4096');

process.on('SIGINT', () => {
  console.log('Received SIGINT signal.');
  llmp.close();
  process.exit(0);
});

const ASK_PROMPT = `
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

### Human: `;

function addSlashes(prompt) {
  return prompt.split('\n').join('\\'+"\n");
}

const parseActions : StopActionParser = (multilineString) => {
  const regex = /\*ACTION:\s+(SEARCH|SEARCH_MORE|ANSWER)\s+"?([^"\n]+)("|\n)/gm;

  let match = regex.exec(multilineString);
  const result: ActionResult[] = [];
  while (match !== null) {
    result.push({
      action: match[1],
      param: match[2]
    });
    match = regex.exec(multilineString);
  }
  return result[0];
}


llmp.open();
console.log('LLMProcess opened.');

async function askAgent(question: string)
{
  let prompt = ASK_PROMPT + question + '?\n';
  let searchQuery: TextQueryIterator | null = null;

  // eslint-disable-next-line no-constant-condition
  while (1 === 1)
  {
    console.log(prompt);
    const result = await llmp.prompt(addSlashes(prompt), parseActions);
    
    console.log('\nPARSED_ACTION:', result);

    if (! result?.action || result?.action === 'TIMEOUT' || typeof result?.action != 'string') {
      throw new Error('Unexpected action: ' + result);
    }

    if (result?.action === 'SEARCH') {

      if (!searchQuery) {
        searchQuery = new TextQueryIterator(fromGoogle, 0.3, 1024, result.param);
        await searchQuery.init();
      }

      const nextSearch = searchQuery.next();

      if (nextSearch && nextSearch.value > 0) {
        prompt = `### Human:\n*OBSERVATION:\n` + nextSearch.value + '\n'
        + `\n### Assistant:\n*THOUGHT: If i know the answer to the question "${question}" then i need to *ANSWER it. If observation is unclear i need to *SEARCH more.\n`;
      }
      else {
        prompt = `### Human:\n*OBSERVATION:\n There is no more search results on this query. Please rephrase the search term or give answer if you know it.\n`
        + `\n### Assistant:\n*THOUGHT: If i know the answer to the question "${question}" then i need to *ANSWER it. If observation is unclear i need to *SEARCH more.\n`;
      }

    }

    if (['ANSWER','REPLY'].includes(result?.action) ) {
      return result.param;
    }
  }
}

askAgent('Who is the current tennis world champion?').then((answer) => {
  console.log('\nANSWER', answer);
  llmp.close();
});

