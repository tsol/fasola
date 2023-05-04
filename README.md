# FASOLA-js

Free, Autonomous Self-Orchestrating Local Agent.

## Who is it for?

- If you would like to play around with Autonomous GPT Agents
- If you don't like the idea that agent can empty your API balance
- If you have a laptop with 16 Gb of RAM
- If you don't mind things running slow, but free and with no budget limits
- If you're not a fan of fancy Python, but more a JS guy.

## Story

Quantified local GPT models are dumb as sh@t. My first impression when I first ran GPT4ALL on my computer after all those YouTubers screaming in excitement - I was very disappointed. There is no comparison to OpenAI 3.5 - it is not even a competition. Writing poems? Really? We all need AGI! And the closest thing we have is autonomous agents like AutoGPT and BabyAGI, based on the work of llangchain project.

I want me some of that, but I don't want to pay for API. I'm just an average Joe with a laptop, but goddamn I want my computer to have the potential to rule the Earth!

So I thought - can I use elaborate prompts and some algorithmic control to make dumb quantified local models less dumb? That's what FASOLA is all about.

## Current state

Now it can use search tool to search the internet and give answers. War even on this first step is not over. Trying to trick the model to stay on track.

## Goals and Plans

I want FASOLA to be able not only to work at the level of BabyAGI but also make an accent on creating the simplest tools using JavaScript to solve tasks and populate the tool database.

### To use the program, you'll need:

1. Download `all-MiniLM-L6-v2` model in ONNX format:

   File `model.onnx` from https://huggingface.co/philschmid/all-MiniLM-L6-v2-optimum-embeddings
   and place it into `./models/sentence-transformers/all-MiniLM-L6-v2/default/`
   along with *.json files (can be cloned via 'git lfs' size is ok)

   This model used as a core subtool to create embeddings and search.

2. Download `ggml-vic13b-q5_1.bin` file from https://huggingface.co/eachadea/ggml-vicuna-13b-1.1 (can be done using download.py file because the whole repository is huge!)

   This is the orchestrator model - the one responsible for the main logic.
   You can use any model in ggml format used by llama.cpp. Fact to note
   here is that quantified models are not good, so probably initial tool
   prompts will need to be adjusted per model. 

3. Download llama.cpp repo to `./llama.cpp` folder and build it.
   https://github.com/ggerganov/llama.cpp

   GGML model executor.

4. Get user search API key, create .env file, and fill variables:

```
GOOGLE_SEARCH_API_KEY=
GOOGLE_SEARCH_CX=
```

## TODO:

#### Modify Core information source iterator tool

Factory Search tool which keeps dependencies between queries -> text-query-iterator (possibly caching)

#### AskAgent tool improvement

Anti fading: After two observations repeat the prompt and those two observations.

Human impersonation breaker - break and repeat init prompt with another example if tool offers one.

Too long without formatted response breaker - words count threshold
to restart with another example.

#### Tools framework

Interface for tools with description and use examples.
( Tags, Autoreload, semantic search for tool )

Tool factory that returns the most appropriate tool for the query.

Template standard.
- Several examples array
- Short tool reminder
- Tool description

#### Core tools to create

* Task splitter
* Tool selector
* Variables tool: storage memory
* Variables listing, prioritizing, garbage collection
* Variables manipulation: concat, filter

#### TOOL-PIPING tool. (Subtask -> Tool using chain)
 "I need to use tool X, give result to tool Y, store result as Z"
#### Regex data extractor Toolc(extract rows of data, lists by template)
 for fetching table data without passing it through prompt
#### Export tool (csv)
 export to csv
#### Tool creation tool.
 creation, eslint, execution, testing, add to toolbox
#### Orchestrator core class
 tools pipe executor
#### Models benchmark auto-testing
 you/me/apples validation test
 javaScript creation test
 tool usage test

#### Next.js frontend
 not a priority
#### Auto-installation
 also. JS geeks we are after

## These are the projects that we directly base on or get inspiration from

* https://github.com/nomic-ai/gpt4all
* https://github.com/hwchase17/langchain
* https://github.com/ggerganov/llama.cpp
* https://huggingface.co/eachadea/ggml-vicuna-13b-1.1
* https://huggingface.co/philschmid/all-MiniLM-L6-v2-optimum-embeddings
* https://huggingface.co/Xenova/transformers.js
* https://huggingface.co/TheBloke

